# Epic Converter

🚀 ArichunaCambio Pro - LUAN System™

> **Conversor de monedas venezolanas de nueva generación** con tasas en tiempo real, estadísticas avanzadas, logros desbloqueables y experiencia premium.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)
[![Version](https://img.shields.io/badge/version-1.0.0-purple.svg)](https://github.com/yourusername/venezuelacambio-pro)

---

## ✨ Features Principales

### 💱 **Conversión de Monedas**
- **Tasas en tiempo real** desde API venezolana oficial
- Soporte para **Bolívares (Bs)**, **USD (BCV)**, **EUR** y **USD Paralelo**
- Conversión instantánea con colores diferenciados por moneda
- Botones rápidos (+10, +50, +100, +500) para entrada veloz
- Sistema de override manual para tasas personalizadas

### 🎯 **Calculadora Personalizada (Compra/Venta)**
- Define tu propia tasa de cambio
- Ideal para negociaciones persona a persona
- Historial de cálculos personalizados
- Sistema de tasas a conveniencia

### 📊 **Estadísticas Avanzadas**
- Conversiones totales realizadas
- Total convertido en Bs y USD
- Conversión favorita
- Días usando la app
- Racha actual de uso
- Gráfico de uso semanal

### 🏆 **Sistema de Logros**
- **Primera Conversión** - Realiza tu primera conversión
- **Usuario Power** - Realiza 50 conversiones
- **Centurión** - Realiza 100 conversiones
- **Alto Volumen** - Convierte más de 10,000 Bs
- **Usuario Diario** - Usa la app 7 días seguidos
- **Maestro Personalizado** - Usa la calculadora personalizada 10 veces
- **Explorador** - Prueba todas las monedas

### 🎨 **Experiencia Premium**
- **Modo Oscuro/Claro** - Cambia el tema según tu preferencia
- **Modo Turbo** - Animaciones ultra rápidas para usuarios power
- **Glassmorphism Design** - Interfaz moderna y elegante
- **Animaciones Fluidas** - Transiciones suaves en cada interacción
- **Vibración Táctil** - Feedback físico en dispositivos móviles
- **Sonidos Sutiles** - Feedback auditivo opcional
- **Confetti** - Celebra tus conversiones grandes
- **Gestos Táctiles** - Swipe para intercambiar monedas

### 📈 **Análisis y Tendencias**
- Gráfico de tendencias 24h
- Comparador de tasas en tiempo real
- Alertas cuando las tasas cambian significativamente
- Historial visual de uso

### 💾 **Backup y Sincronización**
- Genera backup con código QR
- Exporta historial a CSV
- Sincroniza entre dispositivos
- LocalStorage para persistencia

### 📱 **PWA Completa**
- Instalable en dispositivos móviles y desktop
- Funciona offline con Service Worker
- Caché inteligente de tasas
- Actualizaciones automáticas cada 5 minutos
- Notificaciones push (futuro)

### 🎁 **Otras Features**
- Compartir resultados vía WhatsApp/Telegram
- Copiar resultados al portapapeles
- Selector de decimales (2, 3, 4)
- Responsive design total
- Accesibilidad optimizada

---

## 🚀 Instalación y Uso

### **Opción 1: GitHub Pages (Recomendado)**

1. Haz fork del repositorio
2. Ve a **Settings** > **Pages**
3. Selecciona **Branch: main** y **/ (root)**
4. Guarda y espera 2-3 minutos
5. Accede a `https://tuusuario.github.io/venezuelacambio-pro`

### **Opción 2: Local**

```bash
# Clonar repositorio
git clone https://github.com/tuusuario/venezuelacambio-pro.git

# Entrar a la carpeta
cd venezuelacambio-pro

# Abrir con Live Server o similar
# O simplemente abre index.html en tu navegador
```

### **Opción 3: Instalación como PWA**

1. Abre la app en tu navegador
2. En móvil: Menú → "Agregar a pantalla de inicio"
3. En desktop: Ícono de instalación en la barra de direcciones

---

## 📁 Estructura del Proyecto

```
venezuelacambio-pro/
│
├── index.html              # HTML principal
├── app.js                  # Lógica completa de la app
├── styles.css              # Estilos completos
├── manifest.json           # Configuración PWA
├── sw.js                   # Service Worker
├── README.md               # Este archivo
│
├── icons/                  # Iconos de la PWA
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
│
└── screenshots/            # Screenshots para PWA
    ├── screenshot1.png
    └── screenshot2.png
```

---

## 🔧 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Glassmorphism, Grid, Flexbox, Animations
- **JavaScript (ES6+)** - Lógica de la app
- **Chart.js** - Gráficos interactivos
- **Canvas Confetti** - Efectos de celebración
- **QRCode.js** - Generación de códigos QR
- **Font Awesome** - Iconos
- **Google Fonts (Inter)** - Tipografía moderna
- **PWA APIs** - Service Worker, Web App Manifest, etc.
- **LocalStorage API** - Persistencia de datos
- **Vibration API** - Feedback táctil
- **Web Audio API** - Sonidos
- **Share API** - Compartir contenido
- **Clipboard API** - Copiar al portapapeles

---

## 🌐 API Utilizada

### **ve.dolarapi.com**

```
GET https://ve.dolarapi.com/v1/dolares
```

Retorna tasas actualizadas para:
- USD (BCV)
- EUR
- USD Paralelo

**Ejemplo de respuesta:**
```json
[
  {
    "title": "Dólar BCV",
    "source": "BCV",
    "promedio": 51.34,
    "fecha": "2024-12-14"
  },
  ...
]
```

---

## 📊 Configuración

### **Constantes principales (app.js)**

```javascript
const CONFIG = {
  API_URL: 'https://ve.dolarapi.com/v1/dolares',
  CACHE_KEY: 'vcpro_cache_v3',
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutos
  ALERT_THRESHOLD: 2, // Alerta si cambia más de 2 Bs
  CONFETTI_THRESHOLD: 1000, // Confetti para >1000 USD
  SOUNDS_ENABLED: true,
  VIBRATION_ENABLED: true
};
```

---

## 🎨 Personalización

### **Cambiar colores**

Edita las variables CSS en `styles.css`:

```css
:root {
  --accent: #667eea;           /* Color principal */
  --accent-2: #764ba2;         /* Color secundario */
  --bs-color: #FFD700;         /* Color Bolívares */
  --usd-color: #60A5FA;        /* Color USD */
  --eur-color: #A78BFA;        /* Color EUR */
  --par-color: #F472B6;        /* Color Paralelo */
  --custom-color: #4ADE80;     /* Color personalizado */
}
```

### **Cambiar intervalo de actualización**

En `app.js`:

```javascript
const CONFIG = {
  REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutos
};
```

---

## 🔒 Privacidad y Seguridad

- ✅ **Sin servidor backend** - Todo funciona en el cliente
- ✅ **Sin tracking** - No se envían datos a terceros
- ✅ **Sin cookies** - Solo LocalStorage local
- ✅ **HTTPS recomendado** - Para PWA y Service Worker
- ✅ **Datos locales** - Todo se guarda en tu dispositivo

---

## 🐛 Solución de Problemas

### **Las tasas no cargan**

1. Verifica tu conexión a internet
2. Revisa la consola del navegador (F12)
3. Usa el override manual si la API falla
4. Espera unos minutos y refresca

### **La PWA no se instala**

1. Asegúrate de estar en HTTPS
2. Verifica que `manifest.json` sea accesible
3. Revisa que el Service Worker se registre correctamente
4. Prueba en modo incógnito

### **Los logros no se desbloquean**

1. Verifica que LocalStorage esté habilitado
2. Revisa la consola del navegador
3. Intenta limpiar caché y volver a usar la app

---

## 📝 Roadmap

### **V1.1 (Próximamente)**
- [ ] Notificaciones push de cambios de tasas
- [ ] Más monedas (COP, BRL, ARS)
- [ ] Widget de escritorio
- [ ] Temas personalizados
- [ ] Más logros

### **V1.2 (Futuro)**
- [ ] Modo offline completo
- [ ] Sincronización en nube
- [ ] Historial ilimitado
- [ ] Alertas personalizables
- [ ] API propia de respaldo

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**LUAN System™**  
Luis Arichuna

- GitHub: [@tuusuario](https://github.com/tuusuario)
- Email: contacto@luansystem.com

---

## 🙏 Agradecimientos

- **ve.dolarapi.com** - Por proveer la API de tasas venezolanas
- **Chart.js** - Por los gráficos increíbles
- **Font Awesome** - Por los iconos
- **Canvas Confetti** - Por las celebraciones épicas

---

## ⭐ Dale una estrella

Si te gusta este proyecto, ¡dale una ⭐ en GitHub!

---

## 📸 Screenshots

### Desktop
![Desktop View](screenshots/desktop.png)

### Mobile
![Mobile View](screenshots/mobile.png)

### Estadísticas
![Stats View](screenshots/stats.png)

### Logros
![Achievements](screenshots/achievements.png)

---

**Made with ❤️ in Arichuna 🇻🇪**
