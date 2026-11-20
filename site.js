(()=>{
 const $=s=>document.querySelector(s),params=new URLSearchParams(location.search),slug=params.get("slug");
 const types={boutique:"Boutique en ligne",blog:"Blog / Magazine",portfolio:"Portfolio",entreprise:"Entreprise",logiciels:"Logiciels et applications",services:"Services",actualites:"Actualités",communaute:"Communauté",personnalise:"Site personnalisé"};
 const node=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 const safeUrl=value=>{if(typeof value==="string"&&/^#[a-zA-Z0-9_-]*$/.test(value))return value;try{const u=new URL(value);return ["http:","https:"].includes(u.protocol)?u.href:null;}catch{return null;}};
 function renderBlock(block){const wrap=node("section","public-block");if(block.type==="title"){const h=node(block.level===1?"h1":"h2","",block.text||"");wrap.append(h);}else if(block.type==="text"){wrap.append(node("p","",block.text||""));}else if(block.type==="image"){const url=safeUrl(block.url);if(url){const img=node("img");img.src=url;img.alt=block.alt||"";img.loading="lazy";const link=safeUrl(block.link_url||"");if(link){const a=node("a","public-image-link");a.href=link;a.target="_blank";a.rel="noopener noreferrer";a.append(img);wrap.append(a);}else wrap.append(img);if(block.caption)wrap.append(node("small","",block.caption));}}else if(block.type==="button"){const url=safeUrl(block.url);if(url){const a=node("a","btn btn-primary",block.text||"En savoir plus");a.href=url;a.target="_blank";a.rel="noopener noreferrer";wrap.append(a);}}else if(block.type==="video"){const url=safeUrl(block.url);if(url){const frame=node("iframe","public-video");frame.src=url;frame.title=block.caption||"Vidéo";frame.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";frame.allowFullscreen=true;wrap.append(frame);}}else if(block.type==="gallery"){const gallery=node("div","public-gallery");(Array.isArray(block.images)?block.images:[]).forEach(value=>{const url=safeUrl(value);if(url){const img=node("img");img.src=url;img.alt="Image";img.loading="lazy";const link=safeUrl((block.link_urls||[])[gallery.children.length]||"");if(link){const a=node("a","public-image-link");a.href=link;a.target="_blank";a.rel="noopener noreferrer";a.append(img);gallery.append(a);}else gallery.append(img);}});wrap.append(gallery);}else if(block.type==="list"){const ul=node("ul");(Array.isArray(block.items)?block.items:[]).forEach(value=>ul.append(node("li","",value)));wrap.append(ul);}else if(block.type==="divider")wrap.append(node("hr"));else if(block.type==="spacer"){const space=node("div");space.style.height=Math.max(8,Math.min(300,Number(block.height)||32))+"px";wrap.append(space);}return wrap;}
 async function init(){
  if(!slug)throw Error("Adresse du site invalide.");
  const sb=window.requireSupabase();
  const siteResult=await sb.from("sites").select("id,nom,slug,type_site,settings_json,public_slug,is_published").eq("public_slug",slug).eq("is_published",true).maybeSingle();
  if(siteResult.error)throw siteResult.error;if(!siteResult.data)throw Error("Ce site n'existe pas ou n'est pas publié.");
  const site=siteResult.data,cfg=site.settings_json||{};
  const root=document.documentElement;
  if(/^#[0-9a-f]{6}$/i.test(cfg.primary_color||""))root.style.setProperty("--primary",cfg.primary_color);
  if(/^#[0-9a-f]{6}$/i.test(cfg.background_color||""))root.style.setProperty("--page-bg",cfg.background_color);
  if(["Inter","Arial","Georgia","system"].includes(cfg.font_family))document.body.style.fontFamily=cfg.font_family==="system"?"system-ui,sans-serif":cfg.font_family+",sans-serif";
  document.body.classList.toggle("site-intro-enabled",cfg.intro_animation!==false);
  document.body.dataset.design=cfg.design_style||"moderne";
  document.title=(cfg.display_name||site.nom)+" — JDNEXA";
  $("[data-public-name]").textContent=cfg.display_name||site.nom;$("[data-public-description]").textContent=cfg.description||"";
  $("[data-public-type]").textContent=types[site.type_site]||"Site";
  const logo=$("[data-public-logo]");logo.textContent=(site.nom||"J").slice(0,1).toUpperCase();
  const logoUrl=safeUrl(cfg.logo_url||"");if(logoUrl){const img=node("img");img.src=logoUrl;img.alt="Logo";logo.replaceChildren(img);}
  const contact=cfg.whatsapp||cfg.phone;if(contact){const phone=String(contact).replace(/[^0-9]/g,"");const a=node("a","btn btn-light","Contacter");a.href="https://wa.me/"+phone;a.target="_blank";a.rel="noopener";$("[data-public-contact]").append(a);}
  const [pagesResult,contentResult]=await Promise.all([
   sb.from("pages").select("id,titre,slug,content_json,created_at").eq("site_id",site.id).order("created_at",{ascending:true}),
   sb.from("collections_donnees").select("id,type_donnee,contenu_json,date_creation").eq("site_id",site.id).order("date_creation",{ascending:false})
  ]);
  if(pagesResult.error)throw pagesResult.error;if(contentResult.error)throw contentResult.error;
  const pages=pagesResult.data||[],content=contentResult.data||[];
  const nav=$("[data-page-nav]"),pageRoot=$("[data-public-pages]");nav.replaceChildren();pageRoot.replaceChildren();
  if(pages.length){const requestedPage=params.get("page");const active=pages.find(p=>p.slug===requestedPage)||pages[0];pages.forEach(page=>{const a=node("a","public-page-link",page.titre||"Page");a.href="site.html?slug="+encodeURIComponent(slug)+"&page="+encodeURIComponent(page.slug||"");if(page.id===active.id)a.classList.add("active");nav.append(a);});const section=node("article","public-page");section.id="page-"+active.id;section.append(node("h2","public-page-title",active.titre||"Page"));(Array.isArray(active.content_json?.blocks)?active.content_json.blocks:[]).forEach(b=>section.append(renderBlock(b)));pageRoot.append(section);}
  else pageRoot.append(node("div","empty","Ce site sera bientôt disponible."));
  const root=$("[data-public-content]");root.replaceChildren();const type=site.type_site;
  const visible=content.filter(item=>item.type_donnee!=="profil_rencontre");
  $("[data-content-heading]").textContent=type==="logiciels"?"Logiciels et applications":type==="blog"||type==="actualites"?"Publications":type==="portfolio"?"Galerie et créations":type==="services"?"Nos services":"Découvrir nos contenus";
  visible.forEach(item=>{const d=item.contenu_json||{},card=node("article","public-content-card");
   const imageUrl=safeUrl(d.image_url||"");if(imageUrl){const img=node("img","public-content-image");img.src=imageUrl;img.alt=d.titre||"Illustration";img.loading="lazy";card.append(img);}
   const label=node("span","public-content-label",({produit:"Produit",article:"Article",logiciel:"Logiciel",dessin:"Création graphique",service:"Service",annonce:"Annonce",media:"Média"})[item.type_donnee]||"Contenu");card.append(label);
   card.append(node("h3","",d.titre||"Sans titre"));if(d.version)card.append(node("small","public-content-version","Version "+d.version));card.append(node("p","",d.description||""));
   if(d.prix!==null&&d.prix!==undefined)card.append(node("strong","public-content-price",new Intl.NumberFormat("fr-FR").format(Number(d.prix)||0)+" FCFA"));
   const url=safeUrl(d.download_url||"");if(url){const a=node("a","btn btn-primary",item.type_donnee==="logiciel"?"Télécharger / Voir le logiciel":"En savoir plus");a.href=url;a.target="_blank";a.rel="noopener noreferrer";card.append(a);}
   root.append(card);
  });
  if(!visible.length)root.append(node("div","empty","Aucun contenu supplémentaire n'a encore été publié."));
 }
 init().catch(e=>{$("[data-public-name]").textContent="Site indisponible";$("[data-public-pages]").replaceChildren(node("div","empty",e.message||"Impossible de charger ce site."));});
})();