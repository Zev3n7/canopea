# Canopea — Balizas Meteorológicas de Código Libre

Sistema de monitoreo de calidad del aire basado en balizas autónomas con sensores MQ y ESP32. Proyecto de investigación científica orientado a fisica para el XXXV Concurso Estatal De Aparatos y Experimentos de Física.

---

## Inicio rápido

```bash
# Para poder modificar el codigo de forma correcta
Utiliza algun visualizador de codigo como VisualStudioCode o Antigravity junto con un administrador de archivos

# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (opcional para modo demo)
cp .env.local.example .env.local
# Edita .env.local con tus credenciales de Firebase

# 3. Ejecutar en desarrollo
npm run dev
# → http://localhost:3000
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── monitoring/page.tsx   # Dashboard de monitoreo
│   └── credits/page.tsx      # Créditos y documentación
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── sections/             # Hero, About, Sensores, Mision
│   └── ui/                   # TextType, ShapeGrid, KpiCard, Charts…
├── hooks/
│   └── useFirestore.ts       # Datos en tiempo real (Firebase o demo)
├── lib/
│   ├── firebase.ts           # Inicialización Firebase
│   └── constants.ts          # Datos, componentes, autores
└── types/
    └── index.ts              # Interfaces TypeScript
```

---

## 🔥 Conectar Firebase

1. Crea un proyecto en [console.firebase.google.com](https://console.firebase.google.com) poniendo como servidor más cercano el de Mexico para tener más conexión
2. Activa **Firestore** en modo nativo
3. Crea la colección `balizas` con un documento `baliza-001`:
   ```json
   { "nombre": "Baliza Principal", "lat": 20.049, "lng": -102.052, "activa": true, "firmware": "v1.0.0" }
   ```
4. El ESP32 escribe documentos en `/balizas/baliza-001/lecturas/{autoId}`:
   ```json
   { "timestamp": <serverTimestamp>, "mq2_ppm": 120.5, "mq7_ppm": 28.3, "mq135_ppm": 44.1, "fuente": "esp32" }
   ```
5. Copia `.env.local.example` → `.env.local` y rellena las credenciales
6. Reinicia el servidor de desarrollo

**Sin credenciales:** el dashboard funciona en **modo demo** con datos simulados.

---

## 🎨 Paleta de colores (Adobe Color — Tidy Green Clean)

| Nombre   | Hex       | Uso                     |
|----------|-----------|-------------------------|
| Charcoal | `#565859` | Texto secundario        |
| Olive    | `#4F7001` | Acentos secundarios     |
| Lime     | `#84BD01` | Color primario / acciones |
| Cyan     | `#0DD2EA` | Highlights / datos live |
| Teal     | `#265157` | Fondos de tarjetas      |

---

## 📦 Tecnologías

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** con paleta personalizada
- **Firebase Firestore** (tiempo real)
- **Leaflet.js** (mapa interactivo con pin arrastrable)
- **Chart.js** (gráficas de historial)
- **Framer Motion** (animaciones)
- **Lucide React** (iconos)

---

## 🌐 Páginas

| Ruta           | Descripción                                      |
|----------------|--------------------------------------------------|
| `/`            | Landing page con hero, sensores, misión          |
| `/monitoring`  | Dashboard en tiempo real con Firebase            |
| `/credits`     | Autores + documentación de componentes           |

---

## 📝 Licencia

MIT © 2025 Proyecto Canopea
