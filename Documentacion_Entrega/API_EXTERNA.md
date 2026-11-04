# API externa: tipo de cambio (ExchangeRate-API)

## Descripción
El sistema consume `GET https://open.er-api.com/v6/latest/USD`, que devuelve las tasas de cambio del dólar. No necesita API key, por lo que no hay credenciales en el repositorio.

## Dónde está en el código
- `js/api.js`: petición `fetch` con timeout de 8 s, validación de la respuesta, caché de 1 hora en localStorage y manejo de errores.
- `js/app.js`: `money()` usa el convertidor; `moneyUSD()` conserva el formato en dólares.
- `index.html`, `carrito.html`, `pedido.html`: contenedor `#currencyBox` con el selector de moneda.
- `js/catalogo.js`, `js/carrito.js`, `js/pedido.js`: se vuelven a dibujar al cambiar la moneda (evento `currencychange`).

## Integración con el flujo del proyecto
El cliente elige su moneda y ve convertidos los precios del catálogo, el subtotal del carrito y el total del pedido. El pedido se registra en USD y el mensaje de WhatsApp se envía en USD.

## Manejo de errores
- Mientras responde la API: "Cargando tipo de cambio...".
- Si falla (sin internet, error del servidor o respuesta inválida): aviso con SweetAlert2 y mensaje en pantalla; se usa la última tasa guardada o USD.

## Cómo verificarlo (evidencia para el PDF y el video)
1. Abrir `index.html` con Live Server o desde GitHub Pages.
2. F12 > Network > filtro Fetch/XHR > recargar: debe aparecer `latest/USD` con estado 200.
3. Cambiar la moneda a GTQ: los precios cambian y se muestra "1 USD = X GTQ".
4. Network > Offline, borrar `mega_oferta_rates` en Application > Local Storage y recargar: aparece el aviso y los precios quedan en USD.

## Referencia (APA 7)
ExchangeRate-API. (s. f.). *Open access endpoint documentation*. https://www.exchangerate-api.com/docs/free
