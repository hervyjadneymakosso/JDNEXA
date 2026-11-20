(() => {
 const $=s=>document.querySelector(s);
 const status=(sel,msg,ok=false)=>{const el=$(sel);if(el){el.textContent=msg;el.className=ok?"success":"error";}};
 let sb,user,sites=[],subscription;
 const select=$("#site-select");
 const fields={title:$("#site-title"),description:$("#site-description"),contact:$("#site-contact"),logo:$("#site-logo"),slug:$("#public-slug"),published:$("#site-published")};
 const slugify=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70);
 function currentSite(){return sites.find(s=>s.id===select.value);}
 function fillSite(){
  const site=currentSite();const cfg=site?.settings_json||{};
  fields.title.value=cfg.display_name||site?.nom||"";fields.description.value=cfg.description||"";fields.contact.value=cfg.whatsapp||cfg.phone||"";fields.logo.value=cfg.logo_url||"";
  fields.slug.value=site?.public_slug||slugify(site?.nom);fields.published.checked=Boolean(site?.is_published);
  const link=$("[data-public-link]");link.hidden=!(site?.is_published&&site?.public_slug);if(!link.hidden)link.href="site.html?slug="+encodeURIComponent(site.public_slug);
  status("[data-site-status]","");
 }
 async function loadSubscription(){
  const {data,error}=await sb.from("abonnements").select("formule,statut,expiration,cycle,renouvellement_auto").maybeSingle();
  if(error)throw error;subscription=data;
  $("[data-current-plan]").textContent=data?data.formule+" · "+data.statut:"Formule non initialisée";
  $("[data-plan-expiry]").textContent=data?new Date(data.expiration).toLocaleString("fr-FR"):"—";
 }
 async function init(){
  sb=window.requireSupabase();const {data,error}=await sb.auth.getUser();if(error)throw error;user=data.user;if(!user){location.href="login.html";return;}
  $("[data-account-email]").value=user.email||"";
  const result=await sb.from("sites").select("id,nom,slug,settings_json,public_slug,is_published").order("created_at",{ascending:false});
  if(result.error)throw result.error;sites=result.data||[];select.replaceChildren();
  const requestedSite=new URLSearchParams(location.search).get("site");
  if(!sites.length){const o=document.createElement("option");o.value="";o.textContent="Aucun site disponible";select.append(o);}
  else sites.forEach(site=>{const o=document.createElement("option");o.value=site.id;o.textContent=site.nom;select.append(o);});
  if(requestedSite&&sites.some(s=>s.id===requestedSite))select.value=requestedSite;
  fillSite();$("#language").value=localStorage.getItem("jdnexa_language")||"fr";$("#currency").value=localStorage.getItem("jdnexa_currency")||"XAF";
  await loadSubscription();
 }
 select.addEventListener("change",fillSite);
 $("[data-save-site]").addEventListener("click",async()=>{
  const site=currentSite();if(!site){status("[data-site-status]","Créez d'abord un site depuis le tableau de bord.");return;}
  try{
   const publicSlug=slugify(fields.slug.value||fields.title.value||site.nom);if(publicSlug.length<2)throw Error("L'adresse publique doit contenir au moins 2 caractères.");
   const settings_json={...(site.settings_json||{}),display_name:fields.title.value.trim()||site.nom,description:fields.description.value.trim(),whatsapp:fields.contact.value.trim(),logo_url:fields.logo.value.trim()};
   const published=fields.published.checked;
   const {error}=await sb.from("sites").update({settings_json,public_slug:publicSlug,is_published:published,published_at:published?(site.published_at||new Date().toISOString()):null}).eq("id",site.id);
   if(error)throw error;site.settings_json=settings_json;site.public_slug=publicSlug;site.is_published=published;
   fillSite();status("[data-site-status]",published?"Boutique enregistrée et publiée.":"Paramètres enregistrés. La boutique reste privée.",true);
  }catch(e){status("[data-site-status]",e.message||"Impossible d'enregistrer les paramètres.");}
 });
 $("[data-payment-request]").addEventListener("click",async()=>{
  const plan=$("#payment-plan").value,cycle=$("#payment-cycle").value,method=$("#payment-method").value,reference=$("#payment-reference").value.trim();
  const prices={PRO:{monthly:1000,annual:10000},BUSINESS:{monthly:2500,annual:25000}};
  try{
   const {error}=await sb.from("demandes_paiement").insert({owner_id:user.id,formule:plan,cycle,montant_xaf:prices[plan][cycle],moyen:method,reference:reference||null});
   if(error)throw error;$("#payment-reference").value="";status("[data-payment-status]","Demande enregistrée. L'activation intervient après confirmation du paiement.",true);
  }catch(e){status("[data-payment-status]",e.message||"Impossible d'envoyer la demande.");}
 });
 $("[data-update-email]").addEventListener("click",async()=>{const email=$("#new-email").value.trim();if(!email){status("[data-email-status]","Saisissez une nouvelle adresse e-mail.");return;}try{const {error}=await sb.auth.updateUser({email});if(error)throw error;status("[data-email-status]","Demande envoyée. Confirmez le changement depuis l'e-mail reçu.",true);$("#new-email").value="";}catch(e){status("[data-email-status]",e.message||"La mise à jour a échoué.");}});
 $("[data-update-password]").addEventListener("click",async()=>{const password=$("#new-password").value,confirm=$("#confirm-password").value;if(password.length<8){status("[data-password-status]","Le mot de passe doit contenir au moins 8 caractères.");return;}if(password!==confirm){status("[data-password-status]","Les deux mots de passe ne correspondent pas.");return;}try{const {error}=await sb.auth.updateUser({password});if(error)throw error;$("#new-password").value="";$("#confirm-password").value="";status("[data-password-status]","Mot de passe mis à jour.",true);}catch(e){status("[data-password-status]",e.message||"La modification a échoué.");}});
 $("[data-save-preferences]").addEventListener("click",()=>{localStorage.setItem("jdnexa_language",$("#language").value);localStorage.setItem("jdnexa_currency",$("#currency").value);status("[data-pref-status]","Préférences enregistrées sur cet appareil.",true);});
 $("[data-logout]").addEventListener("click",async()=>{await sb.auth.signOut();location.href="index.html";});
 init().catch(e=>status("[data-site-status]",e.message||"Impossible de charger les paramètres."));
})();