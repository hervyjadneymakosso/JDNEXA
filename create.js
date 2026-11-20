(async()=>{
 const $=s=>document.querySelector(s),params=new URLSearchParams(location.search),key=params.get("template")||"fashion",preset=window.JDN_TEMPLATES?.[key],form=$("#jdn-create-form"),preview=$("[data-create-preview]"),message=$("[data-message]");
 if(!preset){location.href="dashboard.html";return;}
 const category=preset.type||"vitrine";let sb,user,device="desktop";
 const slugify=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70);
 const title=form.elements.hero_title,desc=form.elements.hero_description,brand=form.elements.nom,slug=form.elements.slug,button=form.elements.hero_button;
 document.title="Créer — "+preset.name+" | JDNEXA";$("[data-template-title]").textContent=preset.name;
 form.elements.primary_color.value=preset.primary;form.elements.background_color.value=preset.bg;form.elements.design_style.value=preset.style;
 title.value=preset.blocks.find(b=>b.type==="title"&&b.level===1)?.text||preset.name;desc.value=preset.blocks.find(b=>b.type==="text")?.text||"";button.value=preset.blocks.find(b=>b.type==="button")?.text||"Découvrir";
 function render(){
  const name=brand.value.trim()||"Votre marque";$("[data-preview-url]").textContent=(slugify(slug.value)||"votre-site")+".jdnexa";
  preview.replaceChildren();preview.style.setProperty("--preview-primary",form.elements.primary_color.value);preview.style.setProperty("--preview-background",form.elements.background_color.value);preview.dataset.design=form.elements.design_style.value;
  const nav=document.createElement("nav");nav.className="create-site-nav";const logo=document.createElement("b");logo.textContent=name;const links=document.createElement("span");links.textContent="Accueil　 Découvrir　 À propos　 Contact";nav.append(logo,links);preview.append(nav);
  const hero=document.createElement("section");hero.className="create-site-hero";const imageBlock=preset.blocks.find(b=>b.type==="image");if(imageBlock?.url){const im=document.createElement("img");im.src=imageBlock.url;im.alt=imageBlock.alt||preset.name;im.className="create-hero-image";hero.append(im);}
  const content=document.createElement("div");content.className="create-hero-content";const eyebrow=document.createElement("small");eyebrow.textContent=preset.name.toUpperCase();const h=document.createElement("h1");h.textContent=title.value;const p=document.createElement("p");p.textContent=desc.value;const cta=document.createElement("span");cta.className="create-site-button";cta.textContent=button.value;content.append(eyebrow,h,p,cta);hero.append(content);preview.append(hero);
  const galleryBlock=preset.blocks.find(b=>b.type==="gallery");if(galleryBlock?.images?.length){const gallery=document.createElement("section");gallery.className="create-gallery";const gh=document.createElement("h2");gh.textContent="Découvrez notre univers";gallery.append(gh);const grid=document.createElement("div");grid.className="create-gallery-grid";galleryBlock.images.forEach((url,i)=>{const im=document.createElement("img");im.src=url;im.alt=preset.name+" photo "+(i+1);im.loading="lazy";grid.append(im);});gallery.append(grid);preview.append(gallery);}
  const listBlock=preset.blocks.find(b=>b.type==="list");if(listBlock){const sec=document.createElement("section");sec.className="create-preview-list";const h2=document.createElement("h2");h2.textContent="Explorez nos services";const ul=document.createElement("ul");(listBlock.items||[]).forEach(x=>{const li=document.createElement("li");li.textContent=x;ul.append(li);});sec.append(h2,ul);preview.append(sec);}
  const foot=document.createElement("footer");foot.className="create-site-footer";foot.textContent="© "+name+" — Tous droits réservés";preview.append(foot);
 }
 [brand,slug,title,desc,button,form.elements.primary_color,form.elements.background_color,form.elements.design_style].forEach(el=>el.addEventListener("input",render));
 brand.addEventListener("input",()=>{if(!slug.dataset.edited)slug.value=slugify(brand.value);render();});slug.addEventListener("input",()=>{slug.dataset.edited="1";});
 document.querySelectorAll("[data-device]").forEach(btn=>btn.addEventListener("click",()=>{device=btn.dataset.device;document.querySelectorAll("[data-device]").forEach(x=>x.classList.toggle("active",x===btn));$("[data-preview-frame]").classList.toggle("mobile-preview",device==="mobile");}));
 render();
 try{sb=window.requireSupabase();const auth=await sb.auth.getUser();if(auth.error)throw auth.error;user=auth.data.user;if(!user){location.href="login.html";return;}}
 catch(e){message.textContent=e.message||"Connexion impossible.";message.className="error";return;}
 form.addEventListener("submit",async e=>{
  e.preventDefault();const submit=form.querySelector('[type="submit"]');submit.disabled=true;message.textContent="Création de votre site…";message.className="muted";
  try{
   const nom=brand.value.trim(),cleanSlug=slugify(slug.value);if(!nom||cleanSlug.length<2)throw Error("Indiquez un nom et une adresse valide.");
   const sub=await sb.from("abonnements").select("formule,statut,expiration").eq("owner_id",user.id).maybeSingle();const limit=sub.data?.formule==="BUSINESS"?5:1;
   const count=await sb.from("sites").select("id",{count:"exact",head:true}).eq("owner_id",user.id);if(count.error)throw count.error;if((count.count||0)>=limit)throw Error("Votre formule autorise "+limit+" site(s). Consultez les offres pour augmenter votre limite.");
   const settings={site_type:category,display_name:nom,description:desc.value,template:category,template_design:key,design_style:form.elements.design_style.value,font_family:form.elements.font_family.value,primary_color:form.elements.primary_color.value,background_color:form.elements.background_color.value,intro_animation:form.elements.intro_animation.checked};
   const {data,error}=await sb.from("sites").insert({owner_id:user.id,nom,slug:cleanSlug,public_slug:cleanSlug,is_published:false,type_site:category,settings_json:settings}).select("id").single();if(error)throw error;
   const blocks=preset.blocks.map(b=>({...b,id:crypto.randomUUID(),items:b.items?[...b.items]:undefined,images:b.images?[...b.images]:undefined}));if(blocks[0]?.type==="title")blocks[0].text=title.value;if(blocks[1]?.type==="text")blocks[1].text=desc.value;const buttonBlock=blocks.find(b=>b.type==="button");if(buttonBlock)buttonBlock.text=button.value;
   const pageRows=[{site_id:data.id,titre:"Accueil",slug:"accueil",content_json:{blocks}}];
   const pageDefaults={
    about:{titre:"À propos",slug:"a-propos",blocks:[{type:"title",level:1,text:"À propos de "+nom},{type:"text",text:"Présentez votre histoire, votre mission et les valeurs qui vous distinguent."},{type:"image",url:preset.blocks.find(b=>b.type==="image")?.url||"",alt:"Notre univers"}]},
    services:{titre:"Services / Offres",slug:"services",blocks:[{type:"title",level:1,text:"Nos services et offres"},{type:"text",text:"Présentez ici vos prestations, produits ou solutions."},{type:"list",items:["Notre offre principale","Nos solutions","Accompagnement et assistance"]}]},
    blog:{titre:"Articles / Actualités",slug:"actualites",blocks:[{type:"title",level:1,text:"Articles et actualités"},{type:"text",text:"Publiez ici vos nouvelles, conseils et articles."},{type:"article",title:"Première publication",excerpt:"Votre premier article peut être modifié dans le Studio.",image_url:preset.blocks.find(b=>b.type==="image")?.url||"",link_url:"#"}]},
    contact:{titre:"Contact",slug:"contact",blocks:[{type:"title",level:1,text:"Contactez-nous"},{type:"text",text:"Ajoutez ici vos coordonnées, horaires et moyens de contact."},{type:"button",text:"Nous contacter",url:"#"}]}
   };
   [...form.querySelectorAll('[name="extra_pages"]:checked')].forEach(input=>{const p=pageDefaults[input.value];if(p)pageRows.push({site_id:data.id,titre:p.titre,slug:p.slug,content_json:{blocks:p.blocks.map(b=>({...b,id:crypto.randomUUID()}))}});});
   const {error:pageError}=await sb.from("pages").insert(pageRows);if(pageError){await sb.from("sites").delete().eq("id",data.id);throw pageError;}
   message.textContent="Site créé. Ouverture du Studio…";message.className="success";location.href="studio.html?site="+encodeURIComponent(data.id);
  }catch(err){message.textContent=err.message||"La création du site a échoué.";message.className="error";submit.disabled=false;}
 });
})();