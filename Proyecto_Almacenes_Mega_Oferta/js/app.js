const STORAGE_KEYS = {
  users: "mega_oferta_users",
  session: "mega_oferta_session",
  products: "mega_oferta_products",
  cart: "mega_oferta_cart",
  orders: "mega_oferta_orders"
};

const DEFAULT_PRODUCTS = [
  {id:1,nombre:"Sala moderna",categoria:"Salas",precio:450,stock:5,imagen:"",emoji:"🛋️"},
  {id:2,nombre:"Cama matrimonial",categoria:"Camas",precio:350,stock:3,imagen:"",emoji:"🛏️"},
  {id:3,nombre:"Comedor familiar",categoria:"Comedores",precio:600,stock:4,imagen:"",emoji:"🍽️"},
  {id:4,nombre:"Ropero de 6 puertas",categoria:"Roperos",precio:420,stock:2,imagen:"",emoji:"🚪"},
  {id:5,nombre:"Colchón matrimonial",categoria:"Colchones",precio:280,stock:6,imagen:"",emoji:"🛌"},
  {id:6,nombre:"Sala esquinera",categoria:"Salas",precio:575,stock:2,imagen:"",emoji:"🛋️"},
  {id:7,nombre:"Cama individual",categoria:"Camas",precio:250,stock:4,imagen:"",emoji:"🛏️"},
  {id:8,nombre:"Comedor de 6 sillas",categoria:"Comedores",precio:520,stock:0,imagen:"",emoji:"🍽️"}
];

function getData(key, fallback=[]){
  try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch(e){return fallback}
}
function setData(key,value){localStorage.setItem(key,JSON.stringify(value))}
function seedData(){
  if(!localStorage.getItem(STORAGE_KEYS.users)){
    setData(STORAGE_KEYS.users,[{id:1,nombre:"Administrador",correo:"admin@megaoferta.com",password:"Admin123",rol:"admin"}]);
  }
  if(!localStorage.getItem(STORAGE_KEYS.products)) setData(STORAGE_KEYS.products,DEFAULT_PRODUCTS);
  if(!localStorage.getItem(STORAGE_KEYS.orders)) setData(STORAGE_KEYS.orders,[]);
  if(!localStorage.getItem(STORAGE_KEYS.cart)) setData(STORAGE_KEYS.cart,[]);
}
function currentUser(){return getData(STORAGE_KEYS.session,null)}
function logout(){localStorage.removeItem(STORAGE_KEYS.session); location.href="../index.html"}
function requireAdmin(){
  const user=currentUser();
  if(!user || user.rol!=="admin"){location.href="../login.html";return false}
  return true
}
function moneyUSD(value){return new Intl.NumberFormat("es-SV",{style:"currency",currency:"USD"}).format(value)}
function money(value){return window.MoneyConverter?window.MoneyConverter.format(value):moneyUSD(value)}
function showAlert(id,message,type="danger"){
  const titles={success:"¡Listo!",warning:"Atención",danger:"No se pudo completar",info:"Información"};
  if(window.Swal){Swal.fire({icon:type==="danger"?"error":type==="warning"?"warning":type==="success"?"success":"info",title:titles[type]||"Aviso",html:message,confirmButtonText:"Entendido",confirmButtonColor:"#2563eb"});}
  const el=document.getElementById(id); if(el) el.innerHTML=`<div class="alert alert-${type} d-none" role="alert">${message}</div>`;
}
function validateForm(form){
  if(!form)return false;
  for(const input of form.querySelectorAll('input,select,textarea')){
    if(input.disabled || input.type==='hidden')continue;
    input.setCustomValidity('');
    if(input.type==='email' && input.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) input.setCustomValidity('Escribe un correo electrónico válido.');
    if(input.type==='tel' && input.value.trim() && !/^[0-9+ ()-]{8,}$/.test(input.value.trim())) input.setCustomValidity('Escribe un teléfono válido.');
    if(input.id==='name' || input.id==='customerName' || input.id==='pName'){
      if(input.value.trim().length<3)input.setCustomValidity('Escribe al menos 3 caracteres.');
      if(input.value.trim().length>100)input.setCustomValidity('No debe superar 100 caracteres.');
    }
    if(input.id==='password' && input.value && input.value.length<8)input.setCustomValidity('Usa al menos 8 caracteres.');
    if(input.id==='confirmPassword'){
      const pass=form.querySelector('#password'); if(pass && input.value!==pass.value)input.setCustomValidity('Las contraseñas no coinciden.');
    }
    if(input.type==='number' && input.value!=='' && Number(input.value)<Number(input.min||0))input.setCustomValidity('El valor está por debajo del mínimo permitido.');
  }
  form.classList.add('was-validated');
  return form.checkValidity();
}
function updateNavbar(){
  const user=currentUser();
  const loginLink=document.getElementById("loginLink");
  const sessionNav=document.getElementById("sessionNav");
  const sessionUser=document.getElementById("sessionUser");
  const adminNav=document.getElementById("adminNav");
  const logoutNav=document.getElementById("logoutNav");
  if(user){
    if(loginLink) loginLink.classList.add("d-none");
    if(sessionNav) sessionNav.classList.remove("d-none");
    if(sessionUser) sessionUser.textContent=`Hola, ${user.nombre}`;
    if(logoutNav) logoutNav.classList.remove("d-none");
    if(adminNav && user.rol==="admin") adminNav.classList.remove("d-none");
  }
  const cart=getData(STORAGE_KEYS.cart,[]);
  const count=cart.reduce((sum,i)=>sum+i.cantidad,0);
  const badge=document.getElementById("cartCount"); if(badge) badge.textContent=count;
}
document.addEventListener("DOMContentLoaded",()=>{seedData();updateNavbar()});
