(async()=>{
 const $=s=>document.querySelector(s),list=$("[data-sites]"),msg=$("[data-dashboard-message]"),form=$("[data-create-site]");
 let sb,user,sites=[],plan="FREE",siteLimit=1;
 const types={boutique:"Boutique en ligne",blog:"Blog / Magazine",portfolio:"Portfolio / Créatif",entreprise:"Entreprise / Vitrine",logiciels:"Logiciels / Applications",services:"Services / Prestations",actualites:"Actualités",communaute:"Communauté / Annonces",personnalise:"Site personnalisé"};
 const slugify=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70);
 const say=(el,t,ok=false)=>{el.textContent=t;el.className=ok?"success":"error";};
 function siteCard(site){
  const card=document.createElement("article");card.className="site-card";
  const top=document.createElement("div");top.className="site-card-top";
  const icon=document.createElement("div");icon.className="site-type-icon";icon.textContent=({boutique:"▣",blog:"▤",portfolio:"✦",entreprise:"▦",logiciels:"⌘",services:"⚒",actualites:"◷",communaute:"◎",personnalise:"◇"})[site.type_site]||"◇";
  const meta=document.createElement("div");meta.className="site-card-meta";
  const title=document.createElement("h3");title.textContent=site.nom;
  const type=document.createElement("p");type.textContent=types[site.type_site]||"Site personnalisé";
  meta.append(title,type);top.append(icon,meta);
  const status=document.createElement("span");status.className="site-status "+(site.is_published?"published":"private");status.textContent=site.is_published?"Publié":"Brouillon";top.append(status);
  const address=document.createElement("p");address.className="site-card-address";address.textContent=site.public_slug?"jdnexa.com/"+site.public_slug:"Adresse : "+site.slug;
  const actions=document.createElement("div");actions.className="site-card-actions";
  const link=(label,url,primary=false)=>{const a=document.createElement("a");a.className="btn "+(primary?"btn-primary":"btn-light");a.href=url;a.textContent=label;return a;};
  actions.append(link("Ouvrir le studio","studio.html?site="+encodeURIComponent(site.id),true),link("Contenus","collections.html?site="+encodeURIComponent(site.id)),link("Paramètres","settings.html?site="+encodeURIComponent(site.id)));
  if(site.is_published&&site.public_slug)actions.append(link("Voir le site","site.html?slug="+encodeURIComponent(site.public_slug)));
  const edit=document.createElement("button");edit.className="btn btn-light";edit.type="button";edit.textContent="Modifier";edit.addEventListener("click",()=>editSite(site));
  const del=document.createElement("button");del.className="btn btn-danger-light";del.type="button";del.textContent="Supprimer";del.addEventListener("click",()=>deleteSite(site));
  actions.append(edit,del);card.append(top,address,actions);return card;
 }
 async function editSite(site){
  const nom=prompt("Nouveau nom du site :",site.nom);if(nom===null)return;
  const slug=prompt("Identifiant interne (lettres, chiffres et tirets) :",site.slug);if(slug===null)return;
  const clean=slugify(slug);if(!nom.trim()||clean.length<2){say(msg,"Nom ou identifiant invalide.");return;}
  const {error}=await sb.from("sites").update({nom:nom.trim(),slug:clean}).eq("id",site.id);
  if(error){say(msg,error.message);return;}say(msg,"Site modifié.",true);await load();
 }
 async function deleteSite(site){
  if(!confirm("Supprimer définitivement « "+site.nom+" » ? Ses pages, contenus et commandes associés seront également supprimés. Cette action est irréversible."))return;
  const {error}=await sb.from("sites").delete().eq("id",site.id);
  if(error){say(msg,error.message);return;}say(msg,"Site et données associées supprimés.",true);await load();
 }
 async function load(){
  const result=await sb.from("sites").select("id,nom,slug,type_site,settings_json,public_slug,is_published,created_at").order("created_at",{ascending:false});
  if(result.error)throw result.error;sites=result.data||[];
  $("[data-site-count]").textContent=sites.length;$("[data-site-usage]").textContent=sites.length+" / "+siteLimit+" site"+(siteLimit>1?"s":"");
  list.replaceChildren();if(!sites.length){const e=document.createElement("div");e.className="empty";e.textContent="Vous n'avez pas encore créé de site. Utilisez le formulaire ci-dessus pour commencer.";list.append(e);}else sites.forEach(s=>list.append(siteCard(s)));
  const ids=sites.map(s=>s.id);let count=0;if(ids.length){const r=await sb.from("collections_donnees").select("id",{count:"exact",head:true}).in("site_id",ids);if(!r.error)count=r.count||0;}
  $("[data-content-count]").textContent=count;
 }
 try{
  sb=window.requireSupabase();const auth=await sb.auth.getUser();if(auth.error)throw auth.error;user=auth.data.user;if(!user){location.href="login.html";return;}
  $("[data-user-email]").textContent=user.email||"";
  const sub=await sb.from("abonnements").select("formule,statut,expiration").eq("owner_id",user.id).maybeSingle();
  if(!sub.error&&sub.data){plan=sub.data.formule;siteLimit=plan==="BUSINESS"?5:1;$("[data-plan-name]").textContent=plan;$("[data-plan-limit]").textContent=sub.data.statut==="active"?"Jusqu'à "+siteLimit+" site"+(siteLimit>1?"s":""):"Abonnement à renouveler";}
  await load();
 }catch(e){say(msg,e.message||"Impossible de charger votre espace.");}
 form.addEventListener("submit",async e=>{
  e.preventDefault();const btn=form.querySelector('[type="submit"]');btn.disabled=true;const status=form.querySelector("[data-message]");
  try{
   const nom=form.nom.value.trim(),slug=slugify(form.slug.value),type=form.type_site.value;
   if(!nom||slug.length<2)throw Error("Indiquez un nom et un identifiant valide.");
   const {data,error}=await sb.from("sites").insert({owner_id:user.id,nom,slug,type_site:type,settings_json:{site_type:type,display_name:nom,description:"Bienvenue sur "+nom,template:type}}).select("id").single();
   if(error)throw error;
   const {error:pageError}=await sb.from("pages").insert({site_id:data.id,titre:"Accueil",slug:"accueil",content_json:{blocks:[{id:crypto.randomUUID(),type:"title",level:1,text:nom},{id:crypto.randomUUID(),type:"text",text:"Bienvenue sur "+nom+". Présentez ici votre activité, vos produits ou vos services."}] }});
   if(pageError)throw pageError;
   form.reset();say(status,"Votre site a été créé. Vous pouvez maintenant le personnaliser.",true);await load();
  }catch(err){say(status,err.message||"La création du site a échoué.");}
  finally{btn.disabled=false;}
 });
 $("[data-logout]").addEventListener("click",async()=>{await sb.auth.signOut();location.href="index.html";});
})();