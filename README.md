# 🌿 Canopea — Balizas Meteorológicas de Código Libre

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![ESP32](https://img.shields.io/badge/Microcontroller-ESP32-blue)](https://www.espressif.com/)

**Canopea** es un sistema distribuido y de código abierto para el monitoreo de la calidad del aire. Consiste en una red de balizas autónomas construidas con un microcontrolador ESP32 y sensores electroquímicos de gas de la familia MQ. 

Diseñado como un proyecto de investigación científica para el **XXXV Concurso Estatal de Aparatos y Experimentos de Física**, Canopea busca democratizar el acceso a información medioambiental con hardware accesible.

---

## 🚀 Inicio rápido (Entorno Web)

El ecosistema web consta de un Dashboard en tiempo real, construido con **Next.js 14**, **Tailwind CSS** y gráficos impulsados por **Chart.js** y **Leaflet**.

```bash
# 1. Clonar el repositorio
git clone https://github.com/Zev3n7/canopea.git
cd canopea

# 2. Instalar dependencias
npm install  # o pnpm install / yarn install

# 3. Configurar variables de entorno (Opcional, habilita panel Firebase en lugar de demo)
cp .env.local.example .env.local
# Edita .env.local con las credenciales de tu proyecto de Firebase.

# 4. Iniciar entorno de desarrollo
npm run dev
# 👉 Disponible en http://localhost:3000
```

---

## 🗄️ Configuración de Firebase Cloud Firestore

Canopea utiliza **Firebase** como el backend en tiempo real para recibir, procesar y transmitir los datos recolectados por las balizas.

1. Ingresa a la [Consola de Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto. *Tip: Selecciona el servidor (región GCP) más cercano a tu país (ej. `us-central1` o Ciudad de México).*
2. Habilita **Cloud Firestore** en modo de producción.
3. Actualiza las **Reglas de Seguridad** para permitir lecturas al público pero restringir la escritura a clientes autenticados (opcional para desarrollo inicial):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
         allow write: if true; // Ojo: Cambiar en despliegues a producción para evitar escritura no permitida
       }
     }
   }
   ```
4. En la base de datos Firestore, crea una Colección inicial llamada `balizas`.
5. Dentro de `balizas`, crea un documento referenciando tu nodo, por ejemplo `baliza-001`. Agrega la metadata:
   ```json
   { "nombre": "Baliza Principal", "lat": 20.049, "lng": -102.052, "activa": true, "firmware": "v1.0.0" }
   ```
6. Obtén la configuración Web en *Configuración del Proyecto > Mis apps* y transfiere las variables a tu archivo `.env.local` en el repositorio del frontend.

---

## ⚙️ Código del Microcontrolador (ESP32)

El ESP32 actúa como el componente encargado del sensado. Este esquinero en código C++ lee periódicamente las variaciones analógicas de voltaje de los sensores (MQ-2, MQ-7 y MQ-135) y transmite la carga útil (payload JSOn) por medio de WiFi al backend.

*Nota: Este ejemplo requiere el uso de la librería `Firebase_ESP_Client` para Arduino IDE.*

```cpp
#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// Credenciales WiFi y Firebase
#define WIFI_SSID "TU_WIFI_RED"
#define WIFI_PASSWORD "TU_WIFI_PASSWORD"
#define API_KEY "TU_FIREBASE_API_KEY"
#define PROJECT_ID "TU_FIREBASE_PROJECT_ID"

// Pines analógicos del ESP32 donde se conectan los divisores de tensión
#define PIN_MQ2 34 
#define PIN_MQ7 35
#define PIN_MQ135 32

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n[WiFi] Conectado exitosamente.");

  // Inicializa conexión a Firebase
  config.api_key = API_KEY;
  config.project_id = PROJECT_ID;
  config.signer.test_mode = true;
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (Firebase.ready()) {
    // 1. Leer sensores (ADC 12bits: 0 - 4095)
    int raw_mq2 = analogRead(PIN_MQ2);
    int raw_mq7 = analogRead(PIN_MQ7);
    int raw_mq135 = analogRead(PIN_MQ135);
    
    /* 2. Procesar valores RAW a Concentración (PPM)
       NOTA: Estos son mapeos simplificados ilustrativos.
       Se debe aplicar la Transformación Lineal log(ppm) = m*log(Rs/R0)+b
       previa calibración térmica del equipo como se describe en la Guía.*/
    float ppm_mq2 = raw_mq2 * (1000.0 / 4095.0); 
    float ppm_mq7 = raw_mq7 * (200.0 / 4095.0);
    float ppm_mq135 = raw_mq135 * (300.0 / 4095.0);

    // 3. Formatear y empaquetar JSON Payload
    FirebaseJson json;
    json.set("timestamp/.sv", "timestamp");
    json.set("mq2_ppm", ppm_mq2);
    json.set("mq7_ppm", ppm_mq7);
    json.set("mq135_ppm", ppm_mq135);
    json.set("fuente", "esp32-alpha");

    // 4. Publicar la trama de los tres sensores
    String path = "balizas/baliza-001/lecturas";
    if (Firebase.Firestore.createDocument(&fbdo, PROJECT_ID, "", path.c_str(), json.raw())) {
      Serial.println("✓ [Firebase] Transmisión periódica realizada.");
    } else {
      Serial.println("x [Firebase] Error transmitiendo: " + fbdo.errorReason());
    }
  }
  
  delay(10000); // Frecuencia de muestreo (10 Segundos)
}
```

---

## 🎨 Arquitectura de Diseño

El proyecto emplea de forma nativa un sistema de diseño `Tech-Noir / Sci-Fi` de alto contraste en `Tailwind` pensado.
- **Acento Primario:** `Caribbean Green (#00DF81)` para botones visuales y notificaciones `Activas`.
- **Fondo General:** `Rich Black (#030D09)` y `Dark Jungle (#032221)`.
- **Paletas Auxiliares:** `Cyan, Olive, Teal` que identifican contextualmente la semántica y categorías en los componentes de datos y diagramas cartesianos del dashboard.

---

## 📝 Licencia / Autoría

Desarrollado bajo licencia **MIT** por el equipo de investigación de la **Preparatoria 2 de Octubre de 1968**. 
Agradecemos el apoyo a la Física descentralizada. Tienes el permiso de clonar y bifurcar este repositorio, conectar más Balizas y generar mapas dinámicos.

*«Lo que no se mide, no se puede estudiar ni mejorar.»*
