const {chromium}=require('playwright');
const base='file:///tmp/claude-0/-home-claude/0dd4d0ed-602a-5814-a778-a2473b59c77c/scratchpad/out/Proyecto_Almacenes_Mega_Oferta/';
const ok={result:"success",time_last_update_utc:"Mon, 02 Nov 2026 00:00:01 +0000",rates:{USD:1,GTQ:7.7,MXN:18.5,EUR:0.9,CRC:510,SVC:8.75}};
(async()=>{
 const b=await chromium.launch();
 for(const mode of ['ok','500','abort','badjson']){
  const ctx=await b.newContext();const page=await ctx.newPage();
  const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.route('**/*',r=>{const u=r.request().url();
    if(u.includes('open.er-api.com')){
      if(mode==='ok')return r.fulfill({json:ok});
      if(mode==='500')return r.fulfill({status:500,body:'x'});
      if(mode==='badjson')return r.fulfill({json:{result:'error'}});
      return r.abort();}
    if(u.startsWith('file:'))return r.continue();
    return r.abort();});
  await page.goto(base+'index.html');
  await page.waitForTimeout(800);
  const price0=await page.locator('.price').first().innerText();
  const info=await page.locator('#currencyBox').innerText();
  let price1='-';
  if(mode==='ok'){await page.selectOption('#currencySelect','GTQ');await page.waitForTimeout(200);price1=await page.locator('.price').first().innerText();}
  console.log(mode,'| precio:',price0,'| tras GTQ:',price1,'| aviso:',info.replace(/\n/g,' '),'| errores JS:',errs.length);
  if(mode==='ok'){
    await page.click('button:has-text("Agregar al carrito")');
    await page.goto(base+'carrito.html');await page.waitForTimeout(500);
    console.log(' carrito total:',await page.locator('#cartTotal').innerText());
    await page.goto(base+'pedido.html');await page.waitForTimeout(500);
    console.log(' pedido total:',await page.locator('#orderTotal').innerText());
    await page.goto(base+'admin/dashboard.html');
  }
  await ctx.close();
 }
 await b.close();
})();
