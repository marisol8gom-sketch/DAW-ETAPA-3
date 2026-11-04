document.addEventListener("DOMContentLoaded",()=>{
  const cart=getData(STORAGE_KEYS.cart,[]);
  if(!cart.length){showAlert("orderMessage",'El carrito está vacío. <a href="index.html">Volver al catálogo</a>.');document.getElementById("orderForm").classList.add("d-none");return}
  const user=currentUser();
  if(user){document.getElementById("customerName").value=user.nombre}
  const total=calculateCartTotal();document.getElementById("orderTotal").textContent=money(total);
  document.getElementById("orderForm").addEventListener("submit",createOrder);
});
document.addEventListener("currencychange",()=>{const t=document.getElementById("orderTotal");if(t)t.textContent=money(calculateCartTotal())});
function calculateCartTotal(){
  const products=getData(STORAGE_KEYS.products,[]),cart=getData(STORAGE_KEYS.cart,[]);
  return cart.reduce((sum,i)=>{const p=products.find(x=>x.id===i.id);return sum+(p?p.precio*i.cantidad:0)},0);
}
function createOrder(e){
  e.preventDefault();const form=e.currentTarget;
  if(!validateForm(form)){showAlert("orderMessage","Revisa los campos: nombre, teléfono y dirección son obligatorios y deben tener un formato válido.");return}
  const products=getData(STORAGE_KEYS.products,[]),cart=getData(STORAGE_KEYS.cart,[]);
  for(const item of cart){const p=products.find(x=>x.id===item.id);if(!p||item.cantidad>p.stock){showAlert("orderMessage","Uno de los productos ya no tiene suficientes existencias.");return}}
  const orders=getData(STORAGE_KEYS.orders,[]);
  const code=`MO-${String(orders.length+1).padStart(4,"0")}`;
  const order={codigo:code,fecha:new Date().toLocaleString("es-SV"),cliente:document.getElementById("customerName").value.trim(),telefono:document.getElementById("phone").value.trim(),direccion:document.getElementById("address").value.trim(),entrega:document.getElementById("delivery").value,estado:"Pendiente",items:cart.map(i=>({id:i.id,cantidad:i.cantidad})),total:calculateCartTotal()};
  orders.unshift(order);setData(STORAGE_KEYS.orders,orders);
  setData(STORAGE_KEYS.cart,[]);
  document.getElementById("orderForm").classList.add("d-none");
  document.getElementById("createdOrder").innerHTML=`
    <div class="card-soft p-4">
      <div class="display-6 mb-2">✅</div><h3 class="fw-bold">Pedido generado</h3>
      <p>Tu código de pedido es <strong>${code}</strong>.</p>
      <p class="mb-3">Estado inicial: <span class="badge text-bg-warning">Pendiente</span></p>
      <div class="d-flex gap-2 flex-wrap">
        <button class="btn btn-success" onclick="sendWhatsApp('${code}')">Enviar por WhatsApp</button>
        <a class="btn btn-outline-primary" href="index.html">Volver al catálogo</a>
      </div>
    </div>`;
  updateNavbar();
}
function sendWhatsApp(code){
  const order=getData(STORAGE_KEYS.orders,[]).find(o=>o.codigo===code);if(!order)return;
  const products=getData(STORAGE_KEYS.products,[]);
  const lines=order.items.map(i=>{const p=products.find(x=>x.id===i.id);return `${i.cantidad} x ${p?.nombre||"Producto"}`}).join("%0A");
  const text=`Pedido ${order.codigo}%0ACliente: ${encodeURIComponent(order.cliente)}%0AProductos:%0A${encodeURIComponent(lines)}%0ATotal: ${encodeURIComponent(moneyUSD(order.total))}%0AEntrega: ${encodeURIComponent(order.entrega)}`;
  window.open(`https://wa.me/?text=${text}`,"_blank");
}
