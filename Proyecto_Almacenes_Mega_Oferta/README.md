# Aplicación Web - Almacenes Mega Oferta
## ETAPA 3 - Implementación Final (Avance 1)

Proyecto académico para DAW901 G01T - Universidad Don Bosco.

### Integrantes
- CR260027 Edwin Andrés Crespin Rivera
- AG253407 Sonia Magaly Alfaro Granados
- TH260411 Rodrigo José Tobar Huezo
- HR260143 Erick Alejandro Hernández Rodríguez
- LG260389 Roció Marisol López Gómez

### Tecnologías
- HTML5
- CSS3
- JavaScript Vanilla
- Bootstrap 5
- Chart.js 4 (gráficas del dashboard)
- SweetAlert2 (diálogos y confirmaciones)
- localStorage
- API externa: ExchangeRate-API (tipo de cambio, sin API key)

### Roles
- Cliente: catálogo, búsqueda, filtros, carrito y pedidos.
- Administrador: dashboard, productos, inventario y pedidos.

### Credenciales de demostración
Administrador:
- Correo: admin@megaoferta.com
- Contraseña: Admin123

También se puede crear una cuenta de cliente desde Registro.

### Estructura
- `index.html`: catálogo principal.
- `login.html`: autenticación.
- `registro.html`: registro de clientes.
- `carrito.html`: carrito y confirmación.
- `pedido.html`: confirmación/resumen del pedido.
- `admin/dashboard.html`: panel administrativo.
- `admin/productos.html`: crear, listar, actualizar y eliminar productos.
- `admin/inventario.html`: control de stock.
- `admin/pedidos.html`: gestión de estados de pedidos.
- `admin/reportes.html`: reportes por categoría y exportación de inventario/pedidos a CSV.
- `js/api.js`: consumo de la API externa de tipo de cambio y conversión de moneda.
- `js/reportes.js`: módulo de reportes y exportación CSV.
- `css/estilos.css`: estilos personalizados.
- `js/`: lógica de autenticación, catálogo, carrito y administración.

### Prueba rápida
1. Abrir `login.html`.
2. Entrar como administrador con las credenciales anteriores o registrar un cliente.
3. Como cliente, agregar productos al carrito y confirmar un pedido.
4. Cerrar sesión y entrar como administrador.
5. Revisar el pedido, cambiar su estado y comprobar el inventario.

### GitHub
Se recomienda que cada integrante trabaje en una rama propia y realice commits identificables. Antes de la entrega, integrar las ramas a `main` y publicar el proyecto mediante GitHub Pages, Netlify o Vercel.

### Cambios de Etapa 3
- Gráfica funcional de unidades de inventario por categoría y gráfica de pedidos por estado en el dashboard (Chart.js).
- Diálogos de confirmación, alertas y mensajes de resultado con SweetAlert2.
- Validación avanzada del lado del cliente: correo, contraseña mínima de 8 caracteres, coincidencia de contraseñas, nombre, teléfono, precio y stock.
- Módulo adicional de reportes con resumen de inventario y exportación CSV.
- Documento `Investigacion_Librerias_JS_APA7.pdf` incluido en la raíz del proyecto.

### Ejecución
Abrir `index.html` en el navegador. Para acceder al panel, iniciar sesión con `admin@megaoferta.com` y `Admin123` (si el navegador ya conserva datos de una versión anterior, borrar el almacenamiento local del sitio para reinicializarlo). Las librerías externas se cargan por CDN y requieren conexión a internet.


### API externa (tipo de cambio)
- Endpoint: `https://open.er-api.com/v6/latest/USD` (público, no requiere API key).
- Integración: selector de moneda (USD, GTQ, MXN, EUR, CRC) en catálogo, carrito y pedido; los precios se convierten con la tasa obtenida.
- Estados: indicador de carga, mensaje de error y respaldo con la última tasa guardada (caché de 1 hora) o USD si no hay conexión.
- El inventario, el panel administrativo y los pedidos se mantienen en USD.
- Más detalle y pasos de verificación en `Documentacion_Entrega/API_EXTERNA.md`.
