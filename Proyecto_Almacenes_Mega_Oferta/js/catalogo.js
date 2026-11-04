let allProducts=[];
document.addEventListener("DOMContentLoaded",()=>{
  allProducts=getData(STORAGE_KEYS.products,[]);
  const categories=[...new Set(allProducts.map(p=>p.categoria))];
  const select=document.getElementById("categoryFilter");
  categories.forEach(c=>select.insertAdjacentHTML("beforeend",`<option value="${c}">${c}</option>`));
  document.getElementById("searchInput").addEventListener("input",renderCatalog);
  select.addEventListener("change",renderCatalog);
  renderCatalog();
});
document.addEventListener("currencychange",()=>{if(document.getElementById("productGrid"))renderCatalog()});
function renderCatalog(){
  const term=document.getElementById("searchInput").value.toLowerCase().trim();
  const category=document.getElementById("categoryFilter").value;
  const products=allProducts.filter(p=>
    p.nombre.toLowerCase().includes(term) && (!category || p.categoria===category)
  );
  const grid=document.getElementById("productGrid");
  if(!products.length){grid.innerHTML=`<div class="col-12"><div class="empty-state">No se encontraron productos con esos criterios.</div></div>`;return}
  grid.innerHTML=products.map(p=>`
    <div class="col-sm-6 col-lg-3">
      <article class="product-card">
        <div class="product-image">${p.imagen?`<img src="${escapeHtml(p.imagen)}" alt="${escapeHtml(p.nombre)}">`:`<span>${p.emoji||"🪑"}</span>`}</div>
        <div class="product-body">
          <div class="small text-secondary mb-1">${escapeHtml(p.categoria)}</div>
          <h5 class="fw-bold">${escapeHtml(p.nombre)}</h5>
          <div class="price mb-2">${money(p.precio)}</div>
          <span class="badge ${p.stock>0?"text-bg-success":"text-bg-secondary"} badge-stock">${p.stock>0?"Disponible":"Agotado"}</span>
          <button class="btn btn-primary w-100 mt-3" ${p.stock<=0?"disabled":""} onclick="addToCart(${p.id})">
            ${p.stock>0?"Agregar al carrito":"Sin existencias"}
          </button>
        </div>
      </article>
    </div>`).join("");
}
function addToCart(id){
  const product=allProducts.find(p=>p.id===id); if(!product)return;
  const cart=getData(STORAGE_KEYS.cart,[]);
  const item=cart.find(i=>i.id===id);
  if(item){if(item.cantidad>=product.stock){showAlert("catalogMessage","No puedes agregar más unidades que las disponibles.","warning");return}item.cantidad++}
  else cart.push({id,cantidad:1});
  setData(STORAGE_KEYS.cart,cart);updateNavbar();
  showAlert("catalogMessage",`${product.nombre} se agregó al carrito.`,"success");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
