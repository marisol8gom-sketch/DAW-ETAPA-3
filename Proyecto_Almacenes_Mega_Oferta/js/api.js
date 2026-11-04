/* ============================================================
   API EXTERNA: tipo de cambio (ExchangeRate-API, endpoint abierto)
   URL: https://open.er-api.com/v6/latest/USD   (sin API key)
   Uso en el proyecto: convertir los precios (catálogo, carrito y
   pedido) de USD a GTQ, MXN, EUR o CRC según elija el cliente.
   - Estado de carga mientras se consulta la API.
   - Manejo de errores: timeout, respuesta inválida y sin internet.
   - Respaldo: usa la última tasa guardada (caché de 1 hora) o USD.
   - No requiere clave, por lo que no hay credenciales en el repo.
   ============================================================ */
const MoneyConverter=(function(){
  const API_URL="https://open.er-api.com/v6/latest/USD";
  const CURRENCIES={USD:"Dólar (USD)",GTQ:"Quetzal (GTQ)",MXN:"Peso mexicano (MXN)",EUR:"Euro (EUR)",CRC:"Colón costarricense (CRC)"};
  const KEY_CURRENCY="mega_oferta_currency", KEY_RATES="mega_oferta_rates";
  const CACHE_MS=60*60*1000, TIMEOUT_MS=8000;
  let rates=null, updated="", currency="USD", status="loading", message="";

  const read=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};

  function usd(value){return new Intl.NumberFormat("es-SV",{style:"currency",currency:"USD"}).format(value)}
  function format(value){
    if(currency==="USD"||!rates||!rates[currency])return usd(value);
    return new Intl.NumberFormat("es-SV",{style:"currency",currency}).format(value*rates[currency]);
  }

  async function requestRates(){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),TIMEOUT_MS);
    try{
      const res=await fetch(API_URL,{signal:controller.signal});
      if(!res.ok)throw new Error("La API respondió con estado "+res.status);
      const data=await res.json();
      if(data.result!=="success"||!data.rates)throw new Error("Respuesta inválida de la API");
      const picked={};
      Object.keys(CURRENCIES).forEach(c=>{if(typeof data.rates[c]==="number")picked[c]=data.rates[c]});
      if(!picked.USD)picked.USD=1;
      return {rates:picked,updated:data.time_last_update_utc||new Date().toUTCString()};
    }finally{clearTimeout(timer)}
  }

  async function load(){
    status="loading";render();
    const cached=read(KEY_RATES);
    if(cached&&cached.rates&&Date.now()-cached.ts<CACHE_MS){
      rates=cached.rates;updated=cached.updated;status="ok";message="";render();notify();return;
    }
    try{
      const result=await requestRates();
      rates=result.rates;updated=result.updated;
      write(KEY_RATES,{ts:Date.now(),rates,updated});
      status="ok";message="";
    }catch(err){
      console.error("Error al consumir la API de tipo de cambio:",err);
      if(cached&&cached.rates){
        rates=cached.rates;updated=cached.updated;status="stale";
        message="No se pudo actualizar el tipo de cambio; se usa la última tasa guardada.";
      }else{
        rates=null;status="error";currency="USD";
        message="No se pudo cargar el tipo de cambio. Los precios se muestran en USD.";
      }
      if(window.Swal)Swal.fire({toast:true,position:"top-end",icon:"warning",title:message,showConfirmButton:false,timer:4000});
    }
    render();notify();
  }

  function notify(){document.dispatchEvent(new CustomEvent("currencychange"))}

  function setCurrency(code){
    if(!CURRENCIES[code])return;
    currency=code;write(KEY_CURRENCY,code);render();notify();
  }

  function render(){
    const box=document.getElementById("currencyBox");if(!box)return;
    const disabled=status==="loading"||status==="error"?"disabled":"";
    let info="";
    if(status==="loading")info=`<span class="spinner-border spinner-border-sm me-2" role="status"></span>Cargando tipo de cambio...`;
    else if(status==="error")info=`<span class="text-danger">${message}</span>`;
    else{
      const rate=currency==="USD"?"":` · 1 USD = ${Number(rates[currency]).toLocaleString("es-SV",{maximumFractionDigits:4})} ${currency}`;
      info=`<span class="text-secondary">Tipo de cambio en vivo${rate}</span>${status==="stale"?`<div class="text-warning small">${message}</div>`:""}`;
    }
    box.innerHTML=`<div class="d-flex flex-wrap align-items-center gap-2">
      <label for="currencySelect" class="form-label mb-0 fw-semibold">Moneda</label>
      <select id="currencySelect" class="form-select form-select-sm w-auto" ${disabled}>
        ${Object.keys(CURRENCIES).map(c=>`<option value="${c}" ${c===currency?"selected":""}>${CURRENCIES[c]}</option>`).join("")}
      </select>
      <small>${info}</small></div>`;
    const sel=document.getElementById("currencySelect");
    if(sel)sel.addEventListener("change",e=>setCurrency(e.target.value));
  }

  function init(){
    const saved=read(KEY_CURRENCY);
    if(saved&&CURRENCIES[saved])currency=saved;
    render();load();
  }
  return {init,format,usd,load};
})();
window.MoneyConverter=MoneyConverter;
document.addEventListener("DOMContentLoaded",()=>MoneyConverter.init());
