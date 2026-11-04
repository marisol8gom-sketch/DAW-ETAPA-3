document.addEventListener("DOMContentLoaded",()=>{
  if(!requireAdmin())return;
  if(document.getElementById("statProducts")){renderDashboard();renderDashboardCharts();}
  if(document.getElementById("productsTable"))renderProducts();
  if(document.getElementById("inventoryTable"))renderInventory();
  if(document.getElementById("ordersList"))renderOrders();
  const form=document.getElementById("productForm");if(form)form.addEventListener("submit",saveProduct);
});
function renderDashboard(){
  const products=getData(STORAGE_KEYS.products,[]),orders=getData(STORAGE_KEYS.orders,[]);
  document.getElementById("statProducts").textContent=products.length;
  document.getElementById("statStock").textContent=products.reduce((s,p)=>s+Number(p.stock),0);
  document.getElementById("statOrders").textContent=orders.length;
  document.getElementById("recentOrders").innerHTML=orders.slice(0,6).map(o=>`<tr><td><strong>${o.codigo}</strong></td><td>${o.cliente}</td><td>${money(o.total)}</td><td><span class="badge ${statusClass(o.estado)}">${o.estado}</span></td></tr>`).join("") || `<tr><td colspan="4" class="text-secondary">No hay pedidos todavía.</td></tr>`;
}
function statusClass(s){return s==="Entregado"?"text-bg-success":s==="Pendiente"?"text-bg-warning":s==="En Preparación"?"text-bg-primary":"text-bg-info"}
function renderProducts(){
  const products=getData(STORAGE_KEYS.products,[]);
  document.getElementById("productsTable").innerHTML=products.map(p=>`<tr>
    <td><strong>${p.nombre}</strong></td><td>${p.categoria}</td><td>${money(p.precio)}</td><td>${p.stock}</td>
    <td><button class="btn btn-sm btn-outline-primary" onclick="editProduct(${p.id})">Editar</button> <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${p.id})">Eliminar</button></td>
  </tr>`).join("");
}
function openProductForm(){
  document.getElementById("productFormCard").classList.remove("d-none");
  document.getElementById("formTitle").textContent="Nuevo producto";
  document.getElementById("productForm").reset();document.getElementById("productId").value="";
}
function closeProductForm(){document.getElementById("productFormCard").classList.add("d-none")}
function editProduct(id){
  const p=getData(STORAGE_KEYS.products,[]).find(x=>x.id===id);if(!p)return;
  openProductForm();document.getElementById("formTitle").textContent="Editar producto";
  document.getElementById("productId").value=p.id;document.getElementById("pName").value=p.nombre;
  document.getElementById("pCategory").value=p.categoria;document.getElementById("pPrice").value=p.precio;
  document.getElementById("pStock").value=p.stock;document.getElementById("pImage").value=p.imagen||"";
  window.scrollTo({top:0,behavior:"smooth"});
}
function saveProduct(e){
  e.preventDefault();const form=e.currentTarget;if(!validateForm(form)){showAlert("productAdminMessage","Revisa los campos. El precio debe ser mayor que cero y el stock un entero no negativo.");return}
  const products=getData(STORAGE_KEYS.products,[]);const id=document.getElementById("productId").value;
  const data={nombre:document.getElementById("pName").value.trim(),categoria:document.getElementById("pCategory").value,precio:Number(document.getElementById("pPrice").value),stock:Number(document.getElementById("pStock").value),imagen:document.getElementById("pImage").value.trim(),emoji:({Salas:"🛋️",Camas:"🛏️",Comedores:"🍽️",Roperos:"🚪",Colchones:"🛌"})[document.getElementById("pCategory").value]||"🪑"};
  if(id){const i=products.findIndex(p=>p.id===Number(id));products[i]={...products[i],...data}}else products.push({id:Date.now(),...data});
  setData(STORAGE_KEYS.products,products);closeProductForm();renderProducts();showAlert("productAdminMessage","Producto guardado correctamente.","success");
}
async function deleteProduct(id){
  const p=getData(STORAGE_KEYS.products,[]).find(x=>x.id===id);if(!p)return;
  const result=window.Swal?await Swal.fire({icon:"warning",title:"¿Eliminar producto?",text:`Se eliminará ${p.nombre}. Esta acción no se puede deshacer.`,showCancelButton:true,confirmButtonText:"Sí, eliminar",cancelButtonText:"Cancelar",confirmButtonColor:"#dc3545"}):{isConfirmed:confirm("¿Eliminar este producto?")};
  if(!result.isConfirmed)return;
  setData(STORAGE_KEYS.products,getData(STORAGE_KEYS.products,[]).filter(p=>p.id!==id));renderProducts();showAlert("productAdminMessage","Producto eliminado.","success");
}
function renderInventory(){
  const products=getData(STORAGE_KEYS.products,[]);
  document.getElementById("inventoryTable").innerHTML=products.map(p=>`<tr><td><strong>${p.nombre}</strong></td><td>${p.categoria}</td><td><span class="badge ${p.stock>0?"text-bg-success":"text-bg-secondary"}">${p.stock}</span></td><td><input id="stock-${p.id}" class="form-control" type="number" min="0" value="${p.stock}" style="max-width:130px"></td><td><button class="btn btn-sm btn-primary" onclick="updateStock(${p.id})">Actualizar</button></td></tr>`).join("");
}
function updateStock(id){
  const products=getData(STORAGE_KEYS.products,[]),p=products.find(x=>x.id===id);if(!p)return;
  const value=Number(document.getElementById(`stock-${id}`).value);if(!Number.isInteger(value)||value<0){showAlert("inventoryMessage","El stock debe ser un número entero igual o mayor que 0.");return}
  p.stock=value;setData(STORAGE_KEYS.products,products);renderInventory();showAlert("inventoryMessage","Stock actualizado.","success");
}
function renderOrders(){
  const orders=getData(STORAGE_KEYS.orders,[]),products=getData(STORAGE_KEYS.products,[]);
  const box=document.getElementById("ordersList");
  if(!orders.length){box.innerHTML=`<div class="col-12"><div class="empty-state card-soft">No hay pedidos registrados.</div></div>`;return}
  box.innerHTML=orders.map(o=>`<div class="col-lg-6"><article class="order-card">
    <div class="d-flex justify-content-between gap-2"><div><h5 class="fw-bold mb-1">${o.codigo}</h5><div class="small text-secondary">${o.fecha}</div></div><span class="badge ${statusClass(o.estado)}">${o.estado}</span></div>
    <hr><p class="mb-1"><strong>Cliente:</strong> ${o.cliente}</p><p class="mb-1"><strong>Teléfono:</strong> ${o.telefono}</p><p class="mb-1"><strong>Entrega:</strong> ${o.entrega}</p>
    <p class="mb-2"><strong>Productos:</strong> ${o.items.map(i=>{const p=products.find(x=>x.id===i.id);return `${i.cantidad} × ${p?.nombre||"Producto"}`}).join(", ")}</p>
    <div class="d-flex justify-content-between align-items-center mt-3"><strong>Total: ${money(o.total)}</strong>
      <select class="form-select form-select-sm status-select" onchange="changeOrderStatus('${o.codigo}',this.value)">
        ${["Pendiente","En Preparación","Listo","Entregado"].map(s=>`<option ${s===o.estado?"selected":""}>${s}</option>`).join("")}
      </select>
    </div>
  </article></div>`).join("");
}
function changeOrderStatus(code,status){
  const orders=getData(STORAGE_KEYS.orders,[]),products=getData(STORAGE_KEYS.products,[]),o=orders.find(x=>x.codigo===code);if(!o)return;
  if(o.estado!=="Entregado" && status==="Entregado"){
    for(const item of o.items){const p=products.find(x=>x.id===item.id);if(!p||p.stock<item.cantidad){showAlert("ordersMessage","No hay stock suficiente para marcar este pedido como entregado.","danger");renderOrders();return}}
    for(const item of o.items){const p=products.find(x=>x.id===item.id);p.stock-=item.cantidad}
    setData(STORAGE_KEYS.products,products);
  }
  o.estado=status;setData(STORAGE_KEYS.orders,orders);renderOrders();showAlert("ordersMessage",`El pedido ${code} ahora está "${status}".`,"success");
}

function renderDashboardCharts(){
  if(!window.Chart)return;
  const products=getData(STORAGE_KEYS.products,[]),orders=getData(STORAGE_KEYS.orders,[]);
  const categories=[...new Set(products.map(p=>p.categoria))];
  const inventoryCanvas=document.getElementById('inventoryChart');
  if(inventoryCanvas){if(window.inventoryChartInstance)window.inventoryChartInstance.destroy();window.inventoryChartInstance=new Chart(inventoryCanvas,{type:'bar',data:{labels:categories,datasets:[{label:'Unidades',data:categories.map(c=>products.filter(p=>p.categoria===c).reduce((n,p)=>n+Number(p.stock||0),0)),backgroundColor:'#2b8a78',borderRadius:7}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{precision:0}}}}});}
  const orderCanvas=document.getElementById('ordersChart');
  if(orderCanvas){if(window.ordersChartInstance)window.ordersChartInstance.destroy();const states=['Pendiente','En Preparación','Listo','Entregado'];window.ordersChartInstance=new Chart(orderCanvas,{type:'doughnut',data:{labels:states,datasets:[{data:states.map(st=>orders.filter(o=>o.estado===st).length),backgroundColor:['#f0ad4e','#0d6efd','#6f42c1','#198754'],borderWidth:1}]},options:{responsive:true,plugins:{legend:{position:'bottom'}}}});}
}
