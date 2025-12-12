🔥 Epic Converter

Conversor de Monedas Venezolano Profesional

by LUANSysten™


---

📋 Descripción

Epic Converter es una aplicación web progresiva (PWA) de nivel empresarial para convertir monedas venezolanas en tiempo real. Soporta USD (BCV), USD Paralelo, EUR y Bolívares.

✨ Características

🎯 Funcionalidades Principales

Conversión entre USD (BCV), EUR, USD Paralelo y Bolívares

Actualización automática de tasas cada 5 minutos

Fallback manual cuando las APIs fallan

Historial de conversiones (últimas 50)

Exportación a CSV

Swap rápido

Botones rápidos (+10, +50, +100)

Copiar resultado

Override manual de tasas

PWA instalable

Modo offline


🎨 Diseño Profesional

Glassmorphism

Gradientes animados

Animaciones suaves

Responsive

Dark mode

Colores de marca LUANSysten™


🔒 Seguridad y Rendimiento

Cache inteligente

Service Worker

Validaciones

Manejo de errores



---

📂 Estructura de Archivos

LUAN_Convertor_PWA/
├── index.html
├── styles.css
├── app.js
├── manifest.json
├── sw.js
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── README.md


---

🚀 Instalación

Opción 1: GitHub Pages

git clone https://github.com/Luisla425/LUAN_Convertor_PWA.git
cd LUAN_Convertor_PWA
git add .
git commit -m "Epic Converter completo"
git push

Luego en Settings > Pages activas el deploy desde main.

URL final:

https://luisla425.github.io/LUAN_Convertor_PWA/

Opción 2: Local

npm install -g http-server
cd LUAN_Convertor_PWA
http-server -p 8080


---

🎨 Iconos

Coloca en icons/:

icon-192.png

icon-512.png



---

🔧 APIs Usadas

USD (BCV):    https://ve.dolarapi.com/v1/dolares
USD Paralelo: https://ve.dolarapi.com/v1/dolares/paralelo
EUR:          https://api.exchangerate-api.com/v4/latest/EUR

¿Qué pasa si fallan?

1. Usa cache


2. Si no hay cache, pide tasas manuales


3. Puedes seguir trabajando




---

📖 Guía de Uso

Ingresa monto

Selecciona monedas

Dale a Convertir

Usa botones rápidos

Exporta historial

Cambia tasas manualmente cuando necesites



---

💡 Técnicas

HTML, CSS, JS

PWA

Service Worker

LocalStorage

Compatible con todos los navegadores modernos



---

🎯 Roadmap

Más monedas

Gráficos

Notificaciones push

Multi-idioma

Tema oscuro/claro

Calculadora integrada



---

🐛 Problemas comunes

Tasas no cargan

Recarga

Revisa internet

Usa manuales


No se instala la PWA

Revisa HTTPS

Revisa manifest

Revisa iconos



---

📄 Licencia

© 2024 Luis Lárez - LUANSysten™
Todos los derechos reservados.


---

📧 Contacto

GitHub: @Luisla425


---

🌟 ¿Te gusta el proyecto?

Dale ⭐ en GitHub.


---

Made with 🔥 by Luis Lárez - LUANSysten™
El conversor más épico de Venezuela
