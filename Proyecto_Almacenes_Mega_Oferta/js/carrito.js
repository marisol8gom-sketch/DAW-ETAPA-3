let cart=[];
document.addEventListener("DOMContentLoaded",renderCart);
document.addEventListener("currencychange",renderCart);
function renderCart(){
  cart=getData(STORAGE_KEYS.cart,[]);
  const products=getData(STORAGE_KEYS.products,[]);
  const box=document.getElementById("cartItems");
  if(!cart.length){
    box.innerHTML=`<div class="empty-state"><div class="fs-1 mb-2">🛒</div><h5>Tu carrito está vacío</h5><a class="btn btn-primary mt-2" href="index.html">Ver catálogo</a></div>`;
    document.getElementById("checkoutButton").classList.add("disabled");
    document.getElementById("cartTotal").textContent=money(0);return;
  }
  let total=0;
  box.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id); if(!p)return "";
    const subtotal=p.precio*item.cantidad; total+=subtotal;
    return `<div class="cart-row">
      <div class="row align-items-center g-3">
        <div class="col-7"><strong>${p.nombre}</strong><div class="small text-secondary">${money(p.precio)} · Stock ${p.stock}</div></div>
        <div class="col-3"><div class="qty-control"><button class="btn btn-outline-secondary" onclick="changeQty(${p.id},-1)">−</button><strong>${item.cantidad}</strong><button class="btn btn-outline-secondary" onclick="changeQty(${p.id},1)">+</button></div></div>
        <div class="col-2 text-end"><strong>${money(subtotal)}</strong><button class="btn btn-link btn-sm text-danger" onclick="removeItem(${p.id})">Eliminar</button></div>
      </div>
    </div>`;
  }).join("");
  document.getElementById("cartTotal").textContent=money(total);
}
function changeQty(id,delta){
  const products=getData(STORAGE_KEYS.products,[]);
  const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);if(!p||!item)return;
  item.cantidad+=delta;
  if(item.cantidad>p.stock)item.cantidad=p.stock;
  if(item.cantidad<=0)cart=cart.filter(x=>x.id!==id);
  setData(STORAGE_KEYS.cart,cart);updateNavbar();renderCart();
}
function removeItem(id){cart=cart.filter(x=>x.id!==id);setData(STORAGE_KEYS.cart,cart);updateNavbar();renderCart()}
