# BALS Marketing Digital · Web corporativa

Landing page corporativa de **BALS Marketing Digital**, construida siguiendo el *Manual de marca BALS*.

> No somos un proveedor más. Somos parte de tu equipo.

## Estructura

```
index.html              Página completa (Header, Hero, Problema, Servicios, Proceso, Nosotros, CTA, Contacto, Footer)
favicon.svg             Isotipo (verde / beige)
assets/css/styles.css   Estilos: tokens de marca, layout responsive, animaciones
assets/js/main.js       Menú móvil, header, reveals, nav activa, formulario
assets/img/             Logotipo e isotipo en SVG vectorial (extraídos del manual de marca)
```

HTML, CSS y JavaScript sin dependencias ni paso de build: basta con servir la carpeta.

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## Identidad aplicada

- **Colores:** principales `#FFFFFF` `#000000` `#3C523D` `#F2C8CF`, secundarios `#F2E9E4` `#7E8C7B` `#8C2108` `#FFB774` (variables en `:root`).
- **Tipografías (Google Fonts):** Montserrat (titulares, menú, destacados), Source Sans 3 (texto), EB Garamond (citas y acentos).
- **Elementos gráficos:** líneas verticales (guías de fondo, viñetas, la "l" del logo), círculos y formas orgánicas (póster del hero, valores) y subrayados simples que se dibujan al aparecer.
- **Logo e isotipo:** trazados vectoriales originales del PDF, en un sprite SVG inline (`#logo-bals`, `#iso-bals`) que toma `currentColor`, así se pueden usar en cualquier color de la paleta.

## Pendiente antes de publicar

- **Redes sociales:** los enlaces del footer usan `href="#"` (marcados con `data-todo`). Sustituir por las URLs reales.
- **Páginas legales:** Aviso legal, Privacidad y Cookies (también `data-todo`).
- **Formulario:** sin backend, abre el correo del usuario con el mensaje ya redactado para `hola@balsmarketingdigital.com`. Para recibir los envíos directamente, añade la URL de un servicio de formularios (p. ej. Formspree) en `data-endpoint` del `<form id="contact-form">`.
- **Imagen para redes (og:image):** añadir una imagen 1200×630 y su etiqueta `og:image`.
