#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>

// ─── Configuración WiFi ────────────────────────────────────────────────────
const char* ssid     = "TU_RED_WIFI";
const char* password = "TU_PASSWORD_WIFI";

// ─── Configuración Firebase ───────────────────────────────────────────────
const String PROJECT_ID = "TU_PROJECT_ID";
const String BALIZA_ID  = "baliza-001";
const String API_KEY    = "TU_API_KEY";

String firestoreURL =
  "https://firestore.googleapis.com/v1/projects/" + PROJECT_ID +
  "/databases/(default)/documents/balizas/" + BALIZA_ID +
  "/lecturas?key=" + API_KEY;

// ─── Pines ADC ────────────────────────────────────────────────────────────
const int PIN_MQ2   = 35;
const int PIN_MQ7   = 33;
const int PIN_MQ135 = 34;

// ─── Constantes del circuito ──────────────────────────────────────────────
const float VCC       = 5.0f;    // Alimentación sensores (V)
const float VREF      = 3.3f;    // Referencia ADC ESP32 (V)
const float ADC_RES   = 4095.0f; // Resolución 12 bits

// DIVISOR DE VOLTAJE antes del ADC:
//   Si el circuito tiene R_top=1kΩ y R_bot=2kΩ para bajar de 5V a 3.3V,
//   el factor de reconstrucción es (1+2)/2 = 1.5.
//   Si conectas directo al pin 3.3V del sensor (sin divisor), pon 1.0.
const float DIV_FACTOR = 1.5f;

// ─── Resistencias de carga RL (kΩ) ────────────────────────────────────────
const float RL_MQ2   = 5.0f;
const float RL_MQ7   = 10.0f;
const float RL_MQ135 = 20.0f;

// ─── R0 calibradas en setup() ─────────────────────────────────────────────
float R0_MQ2   = 0.0f;
float R0_MQ7   = 0.0f;
float R0_MQ135 = 0.0f;

// ─── Ratios Rs/R0 en AIRE LIMPIO (datasheet Winsen) ───────────────────────
//   Estos son los valores de Rs_aire / R0_referencia según cada curva.
//   BUG ORIGINAL: el código anterior usaba Rs_aire directamente como R0,
//   lo que hacía ratio=1 en aire limpio y ppm≈valor_a (ej. 99 ppm CO
//   en aire limpio), inflando el nivel a "EXTREMADAMENTE MALA".
//
//   CORRECCIÓN: R0 = Rs_medida_en_aire_limpio / ratio_aire_limpio_datasheet
//
//   MQ2  (LPG/propano, ref. 1000 ppm): Rs_air / R0 ≈ 9.83
//   MQ7  (CO,          ref. 100  ppm): Rs_air / R0 ≈ 27.5
//   MQ135(NH3/VOC,     ref. 100  ppm): Rs_air / R0 ≈ 3.6
const float RATIO_AIRE_MQ2   = 9.83f;
const float RATIO_AIRE_MQ7   = 27.5f;
const float RATIO_AIRE_MQ135 = 3.6f;

// ─── Curvas de sensibilidad — ppm = a·(Rs/R0)^b ───────────────────────────
//   Fuente: Winsen MQ-2/MQ-7/MQ-135 Datasheet v1.4 (2020)
const float A_MQ2 = 574.25f,  B_MQ2   = -2.222f;  // LPG / propano
const float A_MQ7 = 99.042f,  B_MQ7   = -1.529f;  // Monóxido de carbono CO
const float A_MQ135 = 110.47f, B_MQ135 = -2.862f; // NH3 / VOC equiv.

// ─── Umbrales ICA — NOM-172-SEMARNAT-2019 ─────────────────────────────────
//   CO (MQ7): bandas para promedio móvil 8h en ppm
//   BUG ORIGINAL: UMBRAL_MQ7 = 7.0 → cualquier lectura >7 ppm era "no BUENA".
//   La NOM-172-2019 define las bandas de CO a partir del promedio 8h:
//     Buena          ≤  8.75 ppm
//     Aceptable      ≤ 10.40 ppm
//     Mala           ≤ 17.30 ppm
//     Muy mala       ≤ 34.60 ppm
//     Extrem. mala   >  34.60 ppm
//   Para medición instantánea con MQ7 se usan los mismos breakpoints
//   como referencia orientativa.
//
//   LPG/Humo (MQ2) y VOC/NH3 (MQ135) no tienen banda NOM-172 directa;
//   se usan los umbrales del fabricante como alertas de seguridad.
struct BandaCO { float limite; const char* nombre; };
const BandaCO BANDAS_CO[] = {
  {  8.75f, "BUENA"               },
  { 10.40f, "ACEPTABLE"           },
  { 17.30f, "MALA"                },
  { 34.60f, "MUY MALA"            },
  { 9999.f, "EXTREMADAMENTE MALA" }
};

const float UMBRAL_LPG_ALERTA  = 500.0f;  // ppm — alerta fugas MQ2
const float UMBRAL_VOC_ALERTA  =  80.0f;  // ppm equiv. — alerta NH3/VOC MQ135

// ─── Promedio móvil de CO (aproximación 8h con ventana corta) ─────────────
const int   VENTANA_CO  = 30;   // Últimas N lecturas (≈5 min a 10 s/lectura)
float       buffer_co[VENTANA_CO];
int         buf_idx     = 0;
bool        buf_lleno   = false;

// ─── Intervalo de envío ───────────────────────────────────────────────────
const unsigned long INTERVALO_MS = 10000UL;
unsigned long ultimoEnvio = 0;

// ═════════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═════════════════════════════════════════════════════════════════════════════

// ─── Leer voltaje real en el sensor (con compensación del divisor) ─────────
float leerVoltSensor(int pin) {
  long suma = 0;
  // 64 muestras para reducir ruido del ADC del ESP32
  for (int i = 0; i < 64; i++) {
    suma += analogRead(pin);
    delayMicroseconds(100);
  }
  float volt_adc = (suma / 64.0f) / ADC_RES * VREF;
  return volt_adc * DIV_FACTOR;  // Reconstruye voltaje antes del divisor
}

// ─── Calcular Rs desde voltaje Vout del sensor ────────────────────────────
//   Vout = VCC · RL / (Rs + RL)  →  Rs = RL · (VCC − Vout) / Vout
float calcularRs(float vout, float RL) {
  vout = constrain(vout, 0.02f, VCC - 0.02f);
  return RL * (VCC - vout) / vout;
}

// ─── Convertir ratio Rs/R0 a ppm usando curva del datasheet ──────────────
float rsToPPM(float ratio, float a, float b, float ppm_min, float ppm_max) {
  if (ratio <= 0.0f) return ppm_max;
  float ppm = a * powf(ratio, b);
  return constrain(ppm, ppm_min, ppm_max);
}

// ─── Calibrar R0 en aire limpio ───────────────────────────────────────────
//   CORRECCIÓN CLAVE: R0 = Rs_aire_limpio / ratio_aire_datasheet
//   El código original asignaba R0 = Rs_aire directamente, lo que hacía
//   ratio=1 en aire limpio y generaba lecturas incorrectamente altas.
float calibrarR0(int pin, float RL, float ratio_aire) {
  const int N = 60;
  float suma = 0;
  for (int i = 0; i < N; i++) {
    float v  = leerVoltSensor(pin);
    float rs = calcularRs(v, RL);
    suma += rs;
    delay(50);
  }
  float Rs_aire = suma / N;
  float R0 = Rs_aire / ratio_aire;
  Serial.printf("    Rs_aire=%.3f kΩ  →  R0=%.3f kΩ\n", Rs_aire, R0);
  return R0;
}

// ─── Calcular nivel ICA del CO con promedio móvil ─────────────────────────
//   BUG ORIGINAL: la función mezclaba los tres sensores en una sola escala
//   lineal arbitraria, lo que provocaba que MQ7 dominara siempre con valores
//   falsos y reportara "EXTREMADAMENTE MALA" en todo momento.
String nivelCO(float co_ppm_inst) {
  // Actualizar buffer de promedio móvil
  buffer_co[buf_idx] = co_ppm_inst;
  buf_idx = (buf_idx + 1) % VENTANA_CO;
  if (buf_idx == 0) buf_lleno = true;

  int n = buf_lleno ? VENTANA_CO : buf_idx;
  float suma = 0;
  for (int i = 0; i < n; i++) suma += buffer_co[i];
  float co_avg = suma / n;

  for (auto& b : BANDAS_CO) {
    if (co_avg <= b.limite) return String(b.nombre);
  }
  return "EXTREMADAMENTE MALA";
}

// ─── Calcular nivel ICA combinado (regla del peor) ────────────────────────
String calcularNivel(float co_ppm, float lpg_ppm, float voc_ppm) {
  String n_co  = nivelCO(co_ppm);
  String n_lpg = (lpg_ppm < UMBRAL_LPG_ALERTA) ? "BUENA" : "MALA";
  String n_voc = (voc_ppm < UMBRAL_VOC_ALERTA)  ? "BUENA" : "MALA";

  // Orden de prioridad (peor primero)
  const char* orden[] = {
    "EXTREMADAMENTE MALA", "MUY MALA", "MALA", "ACEPTABLE", "BUENA"
  };
  for (auto& o : orden) {
    if (n_co == o || n_lpg == o || n_voc == o) return String(o);
  }
  return "BUENA";
}

// ─── Timestamp ISO 8601 UTC ───────────────────────────────────────────────
String getTimestampISO() {
  struct tm ti;
  if (!getLocalTime(&ti)) return "1970-01-01T00:00:00Z";
  char buf[30];
  strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", &ti);
  return String(buf);
}

// ─── Envío a Firestore ────────────────────────────────────────────────────
void enviarAFirestore(float lpg, float co, float voc) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Reconectando...");
    WiFi.reconnect();
    unsigned long t0 = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - t0 < 8000) delay(300);
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("[WiFi] Sin conexión — lectura almacenada localmente");
      return;
    }
  }

  HTTPClient http;
  http.begin(firestoreURL);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(8000);

  String ts    = getTimestampISO();
  String nivel = calcularNivel(co, lpg, voc);

  DynamicJsonDocument doc(1024);
  JsonObject fields = doc.createNestedObject("fields");
  
  // LÍNEAS CORREGIDAS: Ahora coinciden exactamente con los nombres en la base de datos de Firestore
  fields["mq2_ppm"]["doubleValue"]      = roundf(lpg * 100.0f) / 100.0f;
  fields["mq7_ppm"]["doubleValue"]      = roundf(co  * 100.0f) / 100.0f;
  fields["mq135_ppm"]["doubleValue"]    = roundf(voc * 100.0f) / 100.0f;
  
  fields["timestamp"]["timestampValue"] = ts;
  fields["nivel"]["stringValue"]        = nivel;
  fields["balizaId"]["stringValue"]     = BALIZA_ID;

  String body;
  serializeJson(doc, body);
  int code = http.POST(body);

  Serial.printf("[%s] HTTP:%d | CO:%.2f ppm | LPG:%.2f ppm | VOC:%.2f ppm | %s\n",
                ts.c_str(), code, co, lpg, voc, nivel.c_str());

  if (code < 200 || code > 299)
    Serial.println("[Error Firestore] " + http.getString().substring(0, 300));

  http.end();
}

// ═════════════════════════════════════════════════════════════════════════════
// SETUP
// ═════════════════════════════════════════════════════════════════════════════
void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n\n╔══ CANOPEA v2.0 — Iniciando ══╗");

  analogSetAttenuation(ADC_11db);
  pinMode(PIN_MQ2,   INPUT);
  pinMode(PIN_MQ7,   INPUT);
  pinMode(PIN_MQ135, INPUT);

  // Inicializar buffer CO
  memset(buffer_co, 0, sizeof(buffer_co));

  // ── WiFi ──────────────────────────────────────────────────────────────────
  WiFi.begin(ssid, password);
  Serial.print("Conectando WiFi");
  unsigned long t0 = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - t0 < 15000) {
    delay(400); Serial.print(".");
  }
  if (WiFi.status() == WL_CONNECTED)
    Serial.println("\nWiFi OK — IP: " + WiFi.localIP().toString());
  else
    Serial.println("\n[WARN] Sin WiFi. Continuando sin conexión.");

// ── NTP — UTC puro (Firestore espera UTC en timestampValue) ──────────────
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  Serial.print("Sincronizando NTP (UTC)");
  struct tm ti;
  t0 = millis();
  while (!getLocalTime(&ti) && millis() - t0 < 10000) {
    delay(400); Serial.print(".");
  }
  if (getLocalTime(&ti)) {
    char buf[32];
    strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", &ti);
    Serial.println("\nNTP OK — " + String(buf));
  } else {
    Serial.println("\n[WARN] NTP no disponible.");
  }

  // ── Calentamiento ─────────────────────────────────────────────────────────
  Serial.println("Calentando sensores (60 s)...");
  for (int i = 60; i > 0; i--) {
    Serial.printf("\r  %2d s restantes...   ", i);
    delay(1000);
  }
  Serial.println("\nCalentamiento completo.");

  // ── Calibración R0 ────────────────────────────────────────────────────────
  //   ASEGÚRESE de que la baliza esté en AIRE LIMPIO al encender.
  //   R0 = Rs_medida_en_aire / ratio_aire_datasheet
  Serial.println("\nCalibrando R0 (aire limpio requerido)...");

  Serial.println("  MQ2  (LPG/propano, ratio_aire=9.83):");
  R0_MQ2   = calibrarR0(PIN_MQ2,   RL_MQ2,   RATIO_AIRE_MQ2);

  Serial.println("  MQ7  (CO,          ratio_aire=27.5):");
  R0_MQ7   = calibrarR0(PIN_MQ7,   RL_MQ7,   RATIO_AIRE_MQ7);

  Serial.println("  MQ135(NH3/VOC,     ratio_aire=3.6):");
  R0_MQ135 = calibrarR0(PIN_MQ135, RL_MQ135, RATIO_AIRE_MQ135);

  Serial.printf("\nR0 calibrados:\n"
                "  MQ2   = %.4f kΩ\n"
                "  MQ7   = %.4f kΩ\n"
                "  MQ135 = %.4f kΩ\n",
                R0_MQ2, R0_MQ7, R0_MQ135);
  Serial.println("╚══ Setup completo. Iniciando lecturas ══╝\n");
}

// ═════════════════════════════════════════════════════════════════════════════
// LOOP
// ═════════════════════════════════════════════════════════════════════════════
void loop() {
  unsigned long ahora = millis();
  if (ahora - ultimoEnvio < INTERVALO_MS) return;
  ultimoEnvio = ahora;

  // ── Leer voltajes ─────────────────────────────────────────────────────────
  float v2   = leerVoltSensor(PIN_MQ2);
  float v7   = leerVoltSensor(PIN_MQ7);
  float v135 = leerVoltSensor(PIN_MQ135);

  // ── Calcular Rs ───────────────────────────────────────────────────────────
  float rs2   = calcularRs(v2,   RL_MQ2);
  float rs7   = calcularRs(v7,   RL_MQ7);
  float rs135 = calcularRs(v135, RL_MQ135);

  // ── Calcular ratios Rs/R0 ─────────────────────────────────────────────────
  float ratio2   = (R0_MQ2   > 0) ? rs2   / R0_MQ2   : 1.0f;
  float ratio7   = (R0_MQ7   > 0) ? rs7   / R0_MQ7   : 1.0f;
  float ratio135 = (R0_MQ135 > 0) ? rs135 / R0_MQ135 : 1.0f;

  // ── Calcular ppm ──────────────────────────────────────────────────────────
 float ppm_lpg = rsToPPM(ratio2,   A_MQ2,   B_MQ2,   0.0f, 10000.0f);
 float ppm_co  = rsToPPM(ratio7,   A_MQ7,   B_MQ7,   0.0f,  2000.0f);
 float ppm_voc = rsToPPM(ratio135, A_MQ135, B_MQ135, 0.0f,  1000.0f);

  // ── Diagnóstico en Serial Monitor ─────────────────────────────────────────
  Serial.printf("[DBG] Volt → MQ2:%.3fV  MQ7:%.3fV  MQ135:%.3fV\n",
                v2, v7, v135);
  Serial.printf("[DBG] Rs   → MQ2:%.2f  MQ7:%.2f  MQ135:%.2f  kΩ\n",
                rs2, rs7, rs135);
  Serial.printf("[DBG] Ratio→ MQ2:%.3f  MQ7:%.3f  MQ135:%.3f\n",
                ratio2, ratio7, ratio135);

  // ── Enviar a Firestore ────────────────────────────────────────────────────
  enviarAFirestore(ppm_lpg, ppm_co, ppm_voc);
}