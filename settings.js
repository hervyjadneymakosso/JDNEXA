(() => {
 const $=s=>document.querySelector(s);
 const status=(selector,message,ok=false)=>{const el=$(selector);if(el){el.textContent=message;el.className=ok?"success":"error";}};
 let sb,user,sites=[];
 const select=$("#site-select");
 const fields={title:$("#site-title"),description:$("#site-description"),contact:$("#site-contact"),logo:$("#site-logo")};
 function currentSite(){return sites.find(s=>s.id===select.value);}
 function fillSite(){const site=currentSite();const cfg=site?.settings_json||{};fields.title.value=cfg.display_name||site?.nom||"";fields.description.value=cfg.description||"";fields.contact.value=cfg.whatsapp||cfg.phone||"";fields.logo.value=cfg.logo_url||"";status("[data-site-status]","");}
 async function init(){
  sb=window.requireSupabase();
  const {data,error}=await sb.auth.getUser();if(error)throw error;user=data.user;
  if(!user){location.href="login.html";return;}
  $("[data-account-email]").value=user.email||"";
  const result=await sb.from("sites").select("id,nom,slug,settings_json").order("created_at",{ascending:false});
  if(result.error)throw result.error;sites=result.data||[];
  select.innerHTML="";
  if(!sites.length){select.innerHTML='<option value="">Aucun site disponible</option>';return;}
  sites.forEach(site=>{const o=document.createElement("option");o.value=site.id;o.textContent=site.nom;select.append(o);});
  fillSite();
  $("#language").value=localStorage.getItem("jdnexa_language")||"fr";
  $("#currency").value=localStorage.getItem("jdnexa_currency")||"XAF";
 }
 select.addEventListener("change",fillSite);
 $("[data-save-site]").addEventListener("click",async()=>{
  const site=currentSite();if(!site){status("[data-site-status]","Créez d'abord un site depuis le tableau de bord.");return;}
  try{
   const previous=site.settings_json||{};
   const settings_json={...previous,display_name:fields.title.value.trim()||site.nom,description:fields.description.value.trim(),whatsapp:fields.contact.value.trim(),logo_url:fields.logo.value.trim()};
   const {error}=await sb.from("sites").update({settings_json}).eq("id",site.id);if(error)throw error;
   site.settings_json=settings_json;status("[data-site-status]","Paramètres du site enregistrés.",true);
  }catch(e){status("[data-site-status]",e.message||"Impossible d'enregistrer les paramètres.");}
 });
 $("[data-update-email]").addEventListener("click",async()=>{
  const email=$("#new-email").value.trim();if(!email){status("[data-email-status]","Saisissez une nouvelle adresse e-mail.");return;}
  try{const {error}=await sb.auth.updateUser({email});if(error)throw error;status("[data-email-status]","Demande envoyée. Confirmez le changement depuis l'e-mail reçu.",true);$("#new-email").value="";}
  catch(e){status("[data-email-status]",e.message||"La mise à jour a échoué.");}
 });
 $("[data-update-password]").addEventListener("click",async()=>{
  const password=$("#new-password").value,confirm=$("#confirm-password").value;
  if(password.length<8){status("[data-password-status]","Le mot de passe doit contenir au moins 8 caractères.");return;}
  if(password!==confirm){status("[data-password-status]","Les deux mots de passe ne correspondent pas.");return;}
  try{const {error}=await sb.auth.updateUser({password});if(error)throw error;$("#new-password").value="";$("#confirm-password").value="";status("[data-password-status]","Mot de passe mis à jour.",true);}
  catch(e){status("[data-password-status]",e.message||"La modification a échoué.");}
 });
 $("[data-save-preferences]").addEventListener("click",()=>{localStorage.setItem("jdnexa_language",$("#language").value);localStorage.setItem("jdnexa_currency",$("#currency").value);status("[data-pref-status]","Préférences enregistrées sur cet appareil.",true);});
 $("[data-logout]").addEventListener("click",async()=>{await sb.auth.signOut();location.href="index.html";});
 init().catch(e=>status("[data-site-status]",e.message||"Impossible de charger les paramètres."));
})();