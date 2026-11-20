(async()=>{
 const $=s=>document.querySelector(s),list=$("[data-sites]"),msg=$("[data-dashboard-message]"),form=$("[data-create-site]");
 let sb,user,sites=[],plan="FREE",siteLimit=1;
 const types={
  boutique:"Boutique en ligne / E-commerce",marketplace:"Marketplace",rencontre:"Rencontre",reseau_social:"Réseau social",blog:"Blog / Magazine / Actualités",streaming:"Streaming vidéo, musique et podcasts",jeux:"Jeux en ligne / Jeux vidéo",vitrine:"Vitrine / Site d'entreprise",portfolio:"Portfolio",emploi:"Emploi / Recrutement",education:"Éducation / E-learning",forum:"Forum / Communauté",annonces:"Petites annonces",voyage:"Voyage / Réservation",immobilier:"Immobilier",finance:"Banque / Finance / Paiement",sante:"Santé / Médical",administration:"Administration / Services publics",comparateur:"Comparateur de prix",wiki:"Wiki / Encyclopédie",recherche:"Moteur de recherche",messagerie:"Messagerie / Webmail",saas:"SaaS / Outils en ligne",crowdfunding:"Crowdfunding / Dons",association:"Association / ONG",livraison:"Livraison / Restauration",cloud:"Hébergement de fichiers / Cloud",evenementiel:"Événementiel / Billetterie",landing:"Landing page"
 };
 const icons={boutique:"▣",marketplace:"▦",rencontre:"♡",reseau_social:"◎",blog:"▤",streaming:"▶",jeux:"♟",vitrine:"▧",portfolio:"✦",emploi:"▣",education:"⌘",forum:"☷",annonces:"▤",voyage:"✈",immobilier:"⌂",finance:"◇",sante:"✚",administration:"▥",comparateur:"⇄",wiki:"W",recherche:"⌕",messagerie:"✉",saas:"⌘",crowdfunding:"♡",association:"♧",livraison:"↗",cloud:"☁",evenementiel:"▣",landing:"↗"};
 const slugify=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70);
 const templatePresets={
  commerce:{name:"Commerce Pro",style:"moderne",primary:"#1458d4",bg:"#f6f8fc",blocks:[{type:"title",level:1,text:"Les essentiels, au meilleur endroit"},{type:"text",text:"Découvrez une sélection pensée pour vous. Qualité, simplicité et service au rendez-vous."},{type:"button",text:"Voir la boutique",url:"#produits"},{type:"title",level:2,text:"Nos catégories"},{type:"list",items:["Nouveautés","Meilleures ventes","Offres du moment"]},{type:"divider"},{type:"title",level:2,text:"Pourquoi nous choisir ?"},{type:"text",text:"Paiement sécurisé · Livraison suivie · Service client disponible"}]},
  agency:{name:"Agence Moderne",style:"minimal",primary:"#182b49",bg:"#ffffff",blocks:[{type:"title",level:1,text:"Faisons grandir vos ambitions."},{type:"text",text:"Nous transformons vos idées en expériences digitales claires, utiles et mémorables."},{type:"button",text:"Parler de votre projet",url:"#contact"},{type:"title",level:2,text:"Nos expertises"},{type:"list",items:["Stratégie & conseil","Design & identité","Développement digital"]},{type:"title",level:2,text:"Une méthode simple, des résultats concrets."},{type:"text",text:"Échangeons sur vos objectifs et construisons la bonne solution."}]},
  editorial:{name:"Magazine Éditorial",style:"editorial",primary:"#a34b2d",bg:"#fbf7f1",blocks:[{type:"title",level:1,text:"Les idées qui font avancer."},{type:"text",text:"Analyses, actualités et histoires à découvrir."},{type:"image",url:"",alt:"Image principale",caption:"À la une"},{type:"title",level:2,text:"À la une aujourd'hui"},{type:"list",items:["Le grand dossier de la semaine","Comprendre les nouvelles tendances","Les voix qui inspirent"]},{type:"button",text:"Lire les articles",url:"#articles"}]},
  creator:{name:"Portfolio Créatif",style:"elegant",primary:"#7048c8",bg:"#f8f6fc",blocks:[{type:"title",level:1,text:"Créer avec intention."},{type:"text",text:"Je suis créateur indépendant. Voici une sélection de projets, d'idées et d'expériences."},{type:"button",text:"Découvrir mes projets",url:"#projets"},{type:"title",level:2,text:"Projets sélectionnés"},{type:"gallery",images:[]},{type:"title",level:2,text:"À propos"},{type:"text",text:"Une approche sensible, exigeante et tournée vers l'essentiel."}]},
  community:{name:"Communauté",style:"moderne",primary:"#087f75",bg:"#f3faf8",blocks:[{type:"title",level:1,text:"Votre communauté commence ici."},{type:"text",text:"Rencontrez, échangez et partagez avec des personnes qui ont les mêmes centres d'intérêt."},{type:"button",text:"Rejoindre la communauté",url:"#inscription"},{type:"title",level:2,text:"Des espaces pour échanger"},{type:"list",items:["Discussions récentes","Groupes et centres d'intérêt","Événements de la communauté"]},{type:"title",level:2,text:"Un espace ouvert à tous."}]},
  dating:{name:"Rencontre Élégance",style:"elegant",primary:"#a63c68",bg:"#fff7fa",blocks:[{type:"title",level:1,text:"Les belles rencontres commencent ici."},{type:"text",text:"Un espace bienveillant pour faire connaissance, partager et créer de vraies connexions."},{type:"button",text:"Créer mon profil",url:"#inscription"},{type:"title",level:2,text:"Découvrez des profils"},{type:"gallery",images:[]},{type:"title",level:2,text:"Une expérience respectueuse et sécurisée"},{type:"text",text:"Respect, confidentialité et modération au cœur de la communauté."}]},
  media:{name:"Studio Média",style:"audacieux",primary:"#e34d32",bg:"#111827",blocks:[{type:"title",level:1,text:"Play. Listen. Discover."},{type:"text",text:"Vos vidéos, podcasts et contenus favoris réunis dans un seul espace."},{type:"button",text:"Explorer les contenus",url:"#medias"},{type:"title",level:2,text:"À découvrir"},{type:"gallery",images:[]},{type:"title",level:2,text:"Les dernières nouveautés"},{type:"list",items:["Épisodes récents","Sélections de la semaine","Créateurs à suivre"]}]},
  saas:{name:"SaaS Dashboard",style:"minimal",primary:"#2563eb",bg:"#f5f8ff",blocks:[{type:"title",level:1,text:"Pilotez votre activité simplement."},{type:"text",text:"Une plateforme claire pour organiser votre travail, suivre vos résultats et gagner du temps."},{type:"button",text:"Commencer gratuitement",url:"#inscription"},{type:"title",level:2,text:"Tout votre espace au même endroit"},{type:"list",items:["Tableau de bord intelligent","Automatisations utiles","Rapports et statistiques"]},{type:"title",level:2,text:"Conçu pour vous accompagner."},{type:"text",text:"Démarrez rapidement et faites évoluer votre espace selon vos besoins."}]}
 };
 let selectedTemplate="commerce";
 let draftBlocks=templatePresets.commerce.blocks.map((b,i)=>({...b,id:"draft-"+i}));

 let selectedDraft=null;
 function renderDraft(){
  const screen=$("[data-live-preview]");if(!screen)return;
  screen.replaceChildren();
  const nav=document.createElement("div");nav.className="preview-site-nav";
  const brand=document.createElement("b");brand.dataset.previewBrand="";brand.textContent=form.nom.value.trim()||"Mon projet";
  const links=document.createElement("span");links.textContent="Accueil　 Services　 Contact";nav.append(brand,links);screen.append(nav);
  const hero=document.createElement("div");hero.className="preview-site-hero";
  const cat=document.createElement("small");cat.dataset.previewCategory="";cat.textContent=form.type_site.selectedOptions[0]?.textContent||"VOTRE PROJET";hero.append(cat);
  const title=document.createElement("h2");title.textContent=form.nom.value.trim()||"Mon nouveau site";hero.append(title);
  const desc=document.createElement("p");desc.textContent=" ";hero.append(desc);
  screen.append(hero);
  draftBlocks.forEach((b,i)=>{
   const wrap=document.createElement("div");wrap.className="preview-draft-block"+(selectedDraft===b.id?" selected":"");wrap.dataset.draftId=b.id;
   let node;
   if(b.type==="title"){node=document.createElement(b.level===1?"h2":"h3");node.textContent=b.text;node.contentEditable="true";}
   else if(b.type==="text"){node=document.createElement("p");node.textContent=b.text;node.contentEditable="true";}
   else if(b.type==="button"){node=document.createElement("a");node.className="preview-site-button";node.textContent=b.text;node.href="javascript:void(0)";node.contentEditable="true";}
   else if(b.type==="image"){node=document.createElement("div");if(b.url){const im=document.createElement("img");im.src=b.url;im.alt="Image du site";node.append(im);}else node.textContent="Image à ajouter";}
   else if(b.type==="list"){node=document.createElement("ul");(b.items||[]).forEach(x=>{const li=document.createElement("li");li.textContent=x;node.append(li);});}
   else {node=document.createElement("hr");}
   node.addEventListener("input",()=>{if(["title","text","button"].includes(b.type)){b.text=node.textContent;selectedDraft=b.id;}});
   if(b.type==="button")node.addEventListener("dblclick",e=>{e.preventDefault();const value=prompt("Adresse du bouton :",b.url||"#");if(value!==null){b.url=value.trim();selectedDraft=b.id;renderDraft();}});
   if(b.type==="image")node.addEventListener("dblclick",()=>{const value=prompt("Nouvelle adresse HTTPS de l'image :",b.url||"");if(value){try{const u=new URL(value);if(!["https:","http:"].includes(u.protocol))throw Error();b.url=u.href;renderDraft();}catch{alert("Adresse invalide.");}}});
   wrap.append(node);wrap.addEventListener("click",e=>{if(e.target.isContentEditable)return;selectedDraft=b.id;renderDraft();});
   screen.append(wrap);
  });
  const cards=document.createElement("div");cards.className="preview-site-cards";for(let i=0;i<3;i++){const c=document.createElement("div");const b=document.createElement("b"),a=document.createElement("i"),d=document.createElement("i");c.append(b,a,d);cards.append(c);}screen.append(cards);
  const foot=document.createElement("div");foot.className="preview-site-footer";foot.textContent="© "+(form.nom.value.trim()||"Mon projet")+" — Tous droits réservés";screen.append(foot);
  const primary=form.primary_color.value||"#1458d4",background=form.background_color.value||"#f6f8fc";
  screen.style.setProperty("--preview-primary",primary);screen.style.setProperty("--preview-background",background);screen.dataset.design=form.design_style.value||"moderne";screen.dataset.template=selectedTemplate;
  const address=$("[data-preview-address]");if(address)address.textContent=(slugify(form.slug.value)||"votre-site")+".jdnexa";
  const label=$("[data-preview-selection]");if(label){const b=draftBlocks.find(x=>x.id===selectedDraft);label.textContent=b?"Élément sélectionné : "+b.type:"Sélectionnez un élément pour le modifier";}
  const up=$("[data-preview-up]"),down=$("[data-preview-down]"),del=$("[data-preview-delete]");const idx=draftBlocks.findIndex(x=>x.id===selectedDraft);
  if(up)up.disabled=idx<=0;if(down)down.disabled=idx<0||idx>=draftBlocks.length-1;if(del)del.disabled=idx<0;
 }
 function updateLivePreview(){renderDraft();}
 function addDraftBlock(type){
  const id="draft-"+Date.now()+"-"+Math.random().toString(36).slice(2,7);
  const defaults={title:{type,text:"Nouveau titre",level:2},text:{type,text:"Écrivez votre texte ici."},button:{type,text:"En savoir plus",url:"#"},image:{type,url:""},list:{type,items:["Premier élément","Deuxième élément"]},divider:{type}};
  const b=defaults[type];if(!b)return;
  if(type==="image"){const url=prompt("Collez l'adresse HTTPS de votre image :");if(!url)return;try{const u=new URL(url);if(!["https:","http:"].includes(u.protocol))throw Error();b.url=u.href;}catch{alert("Adresse d'image invalide.");return;}}
  b.id=id;draftBlocks.push(b);selectedDraft=id;renderDraft();
 }
 const say=(el,t,ok=false)=>{el.textContent=t;el.className=ok?"success":"error";};
 function siteCard(site){
  const card=document.createElement("article");card.className="site-card";
  const top=document.createElement("div");top.className="site-card-top";
  const icon=document.createElement("div");icon.className="site-type-icon";icon.textContent=icons[site.type_site]||"◇";
  const meta=document.createElement("div");meta.className="site-card-meta";
  const title=document.createElement("h3");title.textContent=site.nom;
  const type=document.createElement("p");type.textContent=types[site.type_site]||"Site personnalisé";
  meta.append(title,type);top.append(icon,meta);
  const status=document.createElement("span");status.className="site-status "+(site.is_published?"published":"private");status.textContent=site.is_published?"Publié":"Brouillon";top.append(status);
  const address=document.createElement("p");address.className="site-card-address";address.textContent=site.public_slug?"Adresse publique : "+site.public_slug:"Identifiant : "+site.slug;
  const actions=document.createElement("div");actions.className="site-card-actions";
  const link=(label,url,primary=false)=>{const a=document.createElement("a");a.className="btn "+(primary?"btn-primary":"btn-light");a.href=url;a.textContent=label;return a;};
  actions.append(link("Ouvrir le studio","studio.html?site="+encodeURIComponent(site.id),true),link("Articles et contenus","collections.html?site="+encodeURIComponent(site.id)),link("Paramètres","settings.html?site="+encodeURIComponent(site.id)));
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
  if(!confirm("Supprimer définitivement « "+site.nom+" » ? Ses pages, contenus, fichiers et commandes associés seront également supprimés. Cette action est irréversible."))return;
  const {error}=await sb.from("sites").delete().eq("id",site.id);
  if(error){say(msg,error.message);return;}say(msg,"Site et données associées supprimés.",true);await load();
 }
 async function load(){
  const result=await sb.from("sites").select("id,nom,slug,type_site,settings_json,public_slug,is_published,created_at").order("created_at",{ascending:false});
  if(result.error)throw result.error;sites=result.data||[];
  $("[data-site-count]").textContent=sites.length;$("[data-site-usage]").textContent=sites.length+" / "+siteLimit+" site"+(siteLimit>1?"s":"");
  list.replaceChildren();if(!sites.length){const e=document.createElement("div");e.className="empty";e.textContent="Vous n'avez pas encore créé de site. Choisissez un type de projet et créez votre premier espace.";list.append(e);}else sites.forEach(s=>list.append(siteCard(s)));
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
 ["nom","type_site","design_style","primary_color","background_color"].forEach(name=>form.elements[name]?.addEventListener("input",updateLivePreview));
 ["type_site","design_style"].forEach(name=>form.elements[name]?.addEventListener("change",updateLivePreview));
 updateLivePreview();
 document.querySelectorAll("[data-template]").forEach(card=>card.addEventListener("click",()=>{const key=card.dataset.template,preset=templatePresets[key];if(!preset)return;selectedTemplate=key;document.querySelectorAll("[data-template]").forEach(x=>x.classList.toggle("active",x===card));form.elements.template_design.value=key;form.elements.design_style.value=preset.style;form.elements.primary_color.value=preset.primary;form.elements.background_color.value=preset.bg;draftBlocks=preset.blocks.map((b,i)=>({...b,id:"draft-"+key+"-"+i,items:b.items?[...b.items]:undefined,images:b.images?[...b.images]:undefined}));selectedDraft=null;renderDraft();}));
 document.querySelectorAll("[data-preview-add]").forEach(btn=>btn.addEventListener("click",()=>addDraftBlock(btn.dataset.previewAdd)));
 $("[data-preview-up]").addEventListener("click",()=>{const i=draftBlocks.findIndex(x=>x.id===selectedDraft);if(i>0){[draftBlocks[i-1],draftBlocks[i]]=[draftBlocks[i],draftBlocks[i-1]];renderDraft();}});
 $("[data-preview-down]").addEventListener("click",()=>{const i=draftBlocks.findIndex(x=>x.id===selectedDraft);if(i>=0&&i<draftBlocks.length-1){[draftBlocks[i+1],draftBlocks[i]]=[draftBlocks[i],draftBlocks[i+1]];renderDraft();}});
 $("[data-preview-delete]").addEventListener("click",()=>{draftBlocks=draftBlocks.filter(x=>x.id!==selectedDraft);selectedDraft=null;renderDraft();});
 form.addEventListener("submit",async e=>{
  e.preventDefault();const btn=form.querySelector('[type="submit"]');btn.disabled=true;const status=form.querySelector("[data-message]");
  try{
   const nom=form.nom.value.trim(),slug=slugify(form.slug.value),type=form.type_site.value;
   if(!nom||slug.length<2)throw Error("Indiquez un nom et un identifiant valide.");
   const settings={site_type:type,display_name:nom,description:"Bienvenue sur "+nom,template:type,template_design:selectedTemplate,design_style:form.design_style.value,font_family:form.font_family.value,primary_color:form.primary_color.value,background_color:form.background_color.value,intro_animation:form.intro_animation.checked};
   const {data,error}=await sb.from("sites").insert({owner_id:user.id,nom,slug,type_site:type,settings_json:settings}).select("id").single();
   if(error)throw error;
   const blocks=draftBlocks.map(b=>({...b,id:crypto.randomUUID(),items:b.items?[...b.items]:undefined,images:b.images?[...b.images]:undefined}));
   const {error:pageError}=await sb.from("pages").insert({site_id:data.id,titre:"Accueil",slug:"accueil",content_json:{blocks}});
   if(pageError)throw pageError;
   form.reset();selectedTemplate="commerce";form.elements.template_design.value="commerce";document.querySelectorAll("[data-template]").forEach(x=>x.classList.toggle("active",x.dataset.template==="commerce"));draftBlocks=templatePresets.commerce.blocks.map((b,i)=>({...b,id:"draft-"+i}));selectedDraft=null;updateLivePreview();say(status,"Votre site a été créé avec les éléments de votre aperçu. Ouvrez le Studio pour continuer.",true);await load();
  }catch(err){say(status,err.message||"La création du site a échoué.");}
  finally{btn.disabled=false;}
 });
 $("[data-logout]").addEventListener("click",async()=>{await sb.auth.signOut();location.href="index.html";});
})();