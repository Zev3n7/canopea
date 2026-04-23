# 🌿 Canopea — Red de Balizas Meteorológicas de Código Abierto

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![ESP32](https://img.shields.io/badge/Microcontroller-ESP32-blue)](https://www.espressif.com/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase_Firestore-orange)](https://firebase.google.com/)
[![NOM-172](https://img.shields.io/badge/Norma-NOM--172--SEMARNAT--2019-green)](https://www.gob.mx/semarnat)

> *«Lo que no se mide, no se puede estudiar ni mejorar.»*

**Canopea** es un sistema de código abierto para el monitoreo de la calidad del aire, presentado en el **XXXV Concurso Estatal de Aparatos y Experimentos de Física** de la Benemérita Universidad Autónoma de Puebla. Consiste en balizas autónomas construidas con un microcontrolador ESP32 y sensores electroquímicos de gas de la familia MQ (MQ-2, MQ-7 y MQ-135), que transmiten datos en tiempo real a un dashboard web accesible para cualquier estudiante de nivel medio superior o superior.
![Canopea](assets/canopea.jpeg)
---

## 📋 Tabla de contenidos

- [Resumen del proyecto](#-resumen-del-proyecto)
- [Inicio rápido — Web](#-inicio-rápido--web)
- [Configuración de Firebase](#️-configuración-de-firebase-cloud-firestore)
- [Hardware y circuito](#-hardware-y-circuito)
- [Configuración del firmware](#️-configuración-del-firmware)
- [Modelo de conversión sensor → ppm](#-modelo-de-conversión-sensor--ppm)
- [Algoritmo ICA / AQI](#️-algoritmo-ica--aqi-de-canopea)
- [Integración con Firestore](#️-integración-con-firestore)
- [Flujo de ejecución](#-flujo-de-ejecución)
- [Arquitectura de diseño web](#-arquitectura-de-diseño-web)
- [Bugs corregidos en v2.0](#-bugs-corregidos-en-v20)
- [Resultados experimentales](#-resultados-experimentales)
- [Estructura del repositorio](#-estructura-del-repositorio)
- [Licencia](#-licencia)

---

## 🔭 Resumen del proyecto

Los gases como el monóxido de carbono (CO), los compuestos orgánicos volátiles (VOC) y el gas licuado de petróleo (GLP) son contaminantes primarios de gran relevancia, cuyas concentraciones en entornos urbanos e industriales con frecuencia superan los límites establecidos por organismos internacionales como la OMS.

Los sensores MOS de la familia MQ basan su operación en la quimisorción sobre dióxido de estaño (SnO₂), un semiconductor tipo N cuya resistencia varía en función de la concentración del gas objetivo. Este fenómeno puede modelarse mediante funciones potenciales para calcular concentraciones en partes por millón (ppm).

Canopea integra tres sensores de esta familia con el microcontrolador ESP32 de doble núcleo Xtensa LX6 a 240 MHz. Cada sensor se conecta en configuración de divisor de voltaje con una resistencia de carga. La tensión de salida es leída por el convertidor analógico-digital de 12 bits del ESP32 (rango 0–4095 unidades, resolución aproximada de 0.8 mV/unidad), alimentado a 5 V para los calefactores internos y a 3.3 V para la lógica de señal.

En pruebas realizadas en la zona de Angelópolis, Puebla, las concentraciones promedio registradas durante el período de monitoreo fueron de **22.4 ppm** de CO (MQ-7), **41.1 ppm** de VOC/NH₃ (MQ-135) y **300 ppm** de LPG/humo (MQ-2), clasificando la calidad del aire como **"Buena"** según la NOM-172-SEMARNAT-2019.

La transmisión de datos presentó una latencia promedio de **720 ms** con una tasa de éxito del **97.2%** en 100 ciclos consecutivos de transmisión.

---

## 🚀 Inicio rápido — Web

El ecosistema web consta de un dashboard en tiempo real construido con **Next.js 14**, **Tailwind CSS** y gráficos impulsados por **Chart.js** y **Leaflet**.

```bash
# 1. Clonar el repositorio
git clone https://github.com/Zev3n7/canopea.git
cd canopea

# 2. Instalar dependencias
npm install  # o pnpm install / yarn install

# 3. Configurar variables de entorno (habilita panel Firebase en lugar de demo)
cp .env.local.example .env.local
# Edita .env.local con las credenciales de tu proyecto de Firebase

# 4. Iniciar entorno de desarrollo
npm run dev
# 👉 Disponible en http://localhost:3000
```

El dashboard se actualiza en tiempo real cada 5–10 segundos mediante el listener `onSnapshot` de Firebase, sin recarga de página.

---

## 🗄️ Configuración de Firebase Cloud Firestore

1. Ingresa a la [Consola de Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto de tipo **Firestore**. Selecciona el servidor más cercano (ej. `us-central1`).
2. Habilita **Cloud Firestore** en modo de producción. Está disponible una prueba gratuita de 30 días para desarrollo inicial.
3. En la pestaña de configuración del proyecto, selecciona **Agregar app** y sigue las instrucciones. Este proyecto usa **Vercel** como hosting gratuito en lugar del hosting de Firebase.
4. Actualiza las **Reglas de Seguridad**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
      // ⚠️ Esta configuración permite escritura libre.
      // Se recomienda restringir con autenticación en producción.
    }
  }
}
```

5. Crea la colección inicial `balizas` y dentro de ella un documento por nodo (ej. `baliza-001`) agregando la primera coleccion que sera `lecturas` y la metadata:

```json
{ "nombre": "Baliza Principal" }
```

6. Obtén la configuración Web en *Configuración del Proyecto > Mis apps* y transfiérela a tu archivo `.env.local`.

---

## 🔌 Hardware y circuito

### Pines ADC (ESP32)

| Pin | Sensor | Gas objetivo |
|---|---|---|
| GPIO 35 | MQ-2 | LPG / Propano / Humo |
| GPIO 33 | MQ-7 | Monóxido de carbono (CO) |
| GPIO 34 | MQ-135 | NH₃ / COVs / Calidad general |

### Circuito de acondicionamiento de señal

Los sensores MQ operan a **5 V**, pero el ADC del ESP32 acepta máximo **3.3 V**. Se usa un divisor resistivo R₁=1 kΩ / R₂=2 kΩ antes de cada pin ADC:

```
Sensor AOUT (5V) ──[ 1kΩ ]──┬── ADC ESP32
                              │
                           [ 2kΩ ]
                              │
                             GND
```

El factor de reconstrucción `DIV_FACTOR = 1.5` compensa este divisor en el firmware para recuperar el voltaje real del sensor. Los sensores requieren un **precalentamiento de 24 a 48 horas** antes de la primera calibración para estabilizar la película de SnO₂.

### Resistencias de carga RL

Ajusta según los valores reales de tu circuito:

```cpp
const float RL_MQ2   = 5.0f;   // kΩ
const float RL_MQ7   = 10.0f;  // kΩ
const float RL_MQ135 = 20.0f;  // kΩ
```

---

## ⚙️ Configuración del firmware

Edita las siguientes constantes al inicio de `canopea_v2.ino` antes de compilar:

```cpp
// WiFi
const char* ssid     = "TU_RED";
const char* password = "TU_PASSWORD";

// Firebase
const String PROJECT_ID = "tu-proyecto-firebase";
const String BALIZA_ID  = "baliza-001";   // ID único por dispositivo
const String API_KEY    = "tu-api-key";
```

### Dependencias (Arduino IDE / PlatformIO)

| Librería | Función |
|---|---|
| `WiFi.h` | Conexión a red inalámbrica, escanea SSIDs y gestiona reconexión automática |
| `HTTPClient.h` | Peticiones HTTP POST/GET a Firestore, maneja códigos de respuesta (200, 201, 404...) |
| `ArduinoJson.h` | Serialización del payload JSON al formato que acepta la API REST de Firestore |
| `time.h` | Sincronización NTP, manejo de zonas horarias y generación de timestamps ISO 8601 |

---

## 🔬 Modelo de conversión sensor → ppm

### 1. Lectura de voltaje

Se toman **64 muestras** por ciclo con un retardo de 100 µs entre cada una para reducir el ruido del ADC del ESP32. El resultado se promedia y se escala con `DIV_FACTOR`:

```
V_sensor = (Σ ADC / 64) / 4095 × 3.3 × 1.5
```

### 2. Cálculo de Rs

La resistencia del sensor se calcula a partir del divisor de voltaje interno del módulo MQ:

```
Rs = RL × (VCC − Vout) / Vout
```

### 3. Calibración de R0

Durante el `setup()`, con la baliza en **aire limpio**, se promedian 60 muestras de Rs y se divide entre el ratio de aire limpio del datasheet Winsen v1.4 (2020):

```
R0 = Rs_aire_limpio / ratio_aire_datasheet
```

| Sensor | ratio_aire (datasheet Winsen) |
|---|---|
| MQ-2 | 9.83 |
| MQ-7 | 27.5 |
| MQ-135 | 3.6 |

> ⚠️ **Importante:** La calibración ocurre cada vez que el ESP32 arranca. El dispositivo **debe estar en aire limpio** al encender. Se recomienda el precalentamiento completo antes de la primera calibración.

### 4. Cálculo de ppm

Se aplica la curva de sensibilidad del datasheet Winsen v1.4 (2020):

```
ppm = a × (Rs/R0)^b
```

| Sensor | Gas | a | b |
|---|---|---|---|
| MQ-2 | LPG/Propano | 574.25 | −2.222 |
| MQ-7 | CO | 99.042 | −1.529 |
| MQ-135 | NH₃/COV | 110.47 | −2.862 |

---

## 🏷️ Algoritmo ICA / AQI de Canopea

El sistema incorpora un algoritmo propio para calcular el **Índice de Calidad del Aire (ICA)** evaluando el impacto de los tres sensores en simultáneo, alineado con el **Índice AIRE Y SALUD** del Gobierno de la CDMX y la NOM-172-SEMARNAT-2019.

### Umbrales de referencia

| Sensor | Gas | Umbral de alerta |
|---|---|---|
| MQ-2 | LPG / Humo | 500 ppm |
| MQ-7 | CO | Bandas NOM-172 (promedio móvil 8 h) |
| MQ-135 | VOC / NH₃ | 80 ppm |

### CO — MQ-7 (NOM-172-SEMARNAT-2019)

El nivel de CO se calcula sobre un **promedio móvil** de las últimas 30 lecturas (~5 minutos como aproximación al promedio 8 h normativo):

| Nivel | Límite CO promedio |
|---|---|
| 🟢 BUENA | ≤ 8.75 ppm |
| 🟡 ACEPTABLE | ≤ 10.40 ppm |
| 🟠 MALA | ≤ 17.30 ppm |
| 🔴 MUY MALA | ≤ 34.60 ppm |
| 🟣 EXTREMADAMENTE MALA | > 34.60 ppm |

### Regla del peor caso

El nivel final reportado es siempre el **peor** de los tres sensores. El algoritmo itera en orden de prioridad descendente:

```
EXTREMADAMENTE MALA → MUY MALA → MALA → ACEPTABLE → BUENA
```

---

## ☁️ Integración con Firestore

Cada 10 segundos se envía un documento POST con ID automático a la colección:

```
balizas/{BALIZA_ID}/lecturas
```

### Estructura del documento

```json
{
  "fields": {
    "balizaId":   { "stringValue":    "baliza-001" },
    "mq2_ppm":    { "doubleValue":    3.56 },
    "mq7_ppm":    { "doubleValue":    4.76 },
    "mq135_ppm":  { "doubleValue":    2.94 },
    "nivel":      { "stringValue":    "BUENA" },
    "timestamp":  { "timestampValue": "2026-04-22T21:48:09Z" }
  }
}
```

> El timestamp se envía en **UTC puro** (formato ISO 8601). La conversión a hora local la realiza el frontend del navegador automáticamente.

### Reconexión automática

Si el WiFi se pierde durante la operación, el firmware intenta reconectarse con un timeout de 8 segundos antes de descartar la lectura.

---

## 🔄 Flujo de ejecución

```
setup()
  │
  ├── Inicializar Serial (115200 baud) + ADC (atenuación 11 dB)
  ├── Conectar WiFi (timeout 15 s)
  ├── Sincronizar NTP UTC — pool.ntp.org / time.nist.gov
  ├── Calentamiento sensores (60 s)
  └── Calibrar R0 en aire limpio (MQ-2, MQ-7, MQ-135)

loop() — cada 10 s
  │
  ├── Leer voltajes (64 muestras × 3 sensores)
  ├── Calcular Rs
  ├── Calcular ratios Rs/R0
  ├── Calcular ppm (curva potencial datasheet)
  ├── Actualizar promedio móvil CO (ventana 30 lecturas)
  ├── Calcular nivel ICA (regla del peor caso)
  └── HTTP POST → Firestore
```

---

## 🎨 Arquitectura de diseño web

El dashboard emplea un sistema de diseño `Tech-Noir / Sci-Fi` de alto contraste implementado en Tailwind CSS:

| Rol | Color | Hex |
|---|---|---|
| Acento primario (activo / OK) | Caribbean Green | `#00DF81` |
| Fondo general | Rich Black | `#030D09` |
| Fondo secundario | Dark Jungle | `#032221` |
| Paletas auxiliares | Cyan, Olive, Teal | — |

Los colores auxiliares identifican contextualmente la semántica de los datos y los niveles ICA en los componentes de diagramas cartesianos del dashboard.

---

## 🐛 Bugs corregidos en v2.0

| Bug | Descripción | Corrección |
|---|---|---|
| R0 incorrecto | Se asignaba `R0 = Rs_aire` directamente, causando `ratio=1` y ppm infladas en aire limpio | `R0 = Rs_aire / ratio_aire_datasheet` |
| ppm clampadas al mínimo | `ppm_min` igual al rango del datasheet forzaba valores artificiales (300 / 20 / 10 ppm) | Mínimos ajustados a `0.0` |
| Nivel siempre EXTREMADAMENTE MALA | Escala lineal arbitraria mezclaba los tres sensores en una sola banda | Bandas NOM-172 independientes por sensor + promedio móvil CO |
| Timestamp incorrecto (+1 h) | `configTime(-21600, 3600, ...)` aplicaba DST de México, abolido desde 2023 | `configTime(0, 0, ...)` — UTC puro |
| Campos Firestore | Nombres de campos no coincidían con la colección en producción | Renombrados a `mq2_ppm`, `mq7_ppm`, `mq135_ppm` |

---

## 📊 Resultados experimentales

Las pruebas de validación consistieron en registrar 100 ciclos consecutivos de transmisión en la zona de Angelópolis, Puebla:

- **Latencia promedio:** 720 ms por ciclo completo (adquisición → procesamiento → escritura en Firestore)
- **Tasa de éxito:** 97.2% de paquetes recibidos correctamente por Firestore
- **Concentraciones promedio registradas:**
  - CO (MQ-7): 22.4 ppm
  - VOC/NH₃ (MQ-135): 41.1 ppm equiv.
  - LPG/Humo (MQ-2): 300 ppm
- **Clasificación ICA:** BUENA — conforme a NOM-021-SSA1-2021 y NOM-172-SEMARNAT-2019

Los espectros de absorción del MQ-135 mostraron respuesta diferenciada ante la presencia simultánea de VOC y NH₃, comportamiento consistente con sensores MOS en entornos urbanos donde coexisten emisiones vehiculares y de origen agroindustrial.

La arquitectura Firebase–ESP32 escala de forma directa con la cantidad de nodos activos en la red, lo que la hace apta para aplicaciones de alerta temprana y toma de decisiones en salud pública.

---

## 📁 Estructura del repositorio

```
canopea/
├── firmware/
│   └── canopea_v2/
│       └── canopea_v2.ino        # Firmware principal ESP32
├── web/                          # Dashboard Next.js 14
│   ├── src/
│   │   ├── app/                  # Rutas y páginas
│   │   ├── components/           # Componentes React
│   │   └── lib/
│   │       └── aqi.ts            # Lógica del algoritmo ICA
│   ├── .env.local.example        # Plantilla de variables de entorno
│   └── package.json
└── README.md
```

---

## 📄 Licencia

Desarrollado bajo licencia **MIT** por el equipo de investigación de la **Preparatoria 2 de Octubre de 1968**, BUAP. Tienes el permiso de clonar y bifurcar este repositorio, conectar más balizas y generar mapas dinámicos de calidad del aire.
