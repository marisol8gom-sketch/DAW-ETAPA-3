document.addEventListener("DOMContentLoaded",()=>{
  const loginForm=document.getElementById("loginForm");
  if(loginForm) loginForm.addEventListener("submit",login);
  const registerForm=document.getElementById("registerForm");
  if(registerForm) registerForm.addEventListener("submit",register);
});
function login(e){
  e.preventDefault();
  const form=e.currentTarget;
  if(!validateForm(form)){showAlert("loginMessage","Revisa el correo y la contraseña. La contraseña debe tener al menos 8 caracteres.");return}
  const correo=document.getElementById("email").value.trim().toLowerCase();
  const password=document.getElementById("password").value;
  const user=getData(STORAGE_KEYS.users,[]).find(u=>u.correo===correo && u.password===password);
  if(!user){showAlert("loginMessage","Correo o contraseña incorrectos.");return}
  setData(STORAGE_KEYS.session,user);
  location.href=user.rol==="admin"?"admin/dashboard.html":"index.html";
}
function register(e){
  e.preventDefault();
  const form=e.currentTarget;
  const pass=document.getElementById("password").value;
  const confirm=document.getElementById("confirmPassword").value;
  const confirmEl=document.getElementById("confirmPassword");
  confirmEl.setCustomValidity(pass!==confirm?"Las contraseñas no coinciden.":"");
  if(!validateForm(form)){showAlert("registerMessage","Revisa los campos resaltados. Usa una contraseña de al menos 8 caracteres y confirma que coincidan.");return}
  const users=getData(STORAGE_KEYS.users,[]);
  const correo=document.getElementById("email").value.trim().toLowerCase();
  if(users.some(u=>u.correo===correo)){showAlert("registerMessage","Ese correo ya está registrado.");return}
  const user={id:Date.now(),nombre:document.getElementById("name").value.trim(),correo,password:pass,rol:"cliente"};
  users.push(user);setData(STORAGE_KEYS.users,users);setData(STORAGE_KEYS.session,user);
  location.href="index.html";
}
