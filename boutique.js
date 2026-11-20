(() => {
 const $=s=>document.querySelector(s);const params=new URLSearchParams(location.search);const slug=params.get("slug");
 let sb,shop,products=[];
 const money=v=>new Intl.NumberFormat("fr-FR").format(Number(v)||0)+" FCFA";
 const node=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
 function render(){
  const q=$("#product-search").value.trim().toLocaleLowerCase("fr");
  const root=$("[data-products]");root.replaceChildren();
  const filtered=products.filter(p=>[p.contenu_json?.titre,p.contenu_json?.description,p.contenu_json?.categorie].join(" ").toLocaleLowerCase("fr").includes(q));
  if(!filtered.length){root.append(node("div","empty",products.length?"Aucun produit ne correspond à votre recherche.":"Cette boutique ne présente pas encore de produits."));return;}
  filtered.forEach(p=>{
   const d=p.contenu_json||{},card=node("article","store-product");
   if(d.image_url){const img=node("img","store-product-image");img.src=d.image_url;img.alt=d.titre||"Produit";img.loading="lazy";card.append(img);}else card.append(node("div","store-product-placeholder","J"));
   const body=node("div","store-product-body");body.append(node("span","store-product-category",d.categorie||"Article"));
   body.append(node("h3","",d.titre||"Produit"));body.append(node("p","store-product-description",d.description||"Contactez la boutique pour plus d'informations."));
   const foot=node("div","store-product-foot");foot.append(node("strong","store-product-price",d.prix!==null&&d.prix!==undefined?money(d.prix):"Prix sur demande"));
   const btn=node("button","btn btn-primary","Commander");btn.type="button";btn.addEventListener("click",()=>openOrder(p));foot.append(btn);body.append(foot);card.append(body);root.append(card);
  });
 }
 function openOrder(p){const form=$("[data-order-form]");form.reset();form.product_id.value=p.id;form.product_title.value=p.contenu_json?.titre||"Produit";$("[data-order-title]").textContent="Commander : "+form.product_title.value;$("[data-order-modal]").hidden=false;}
 function closeOrder(){$("[data-order-modal]").hidden=true;}
 async function init(){
  if(!slug){throw Error("Adresse de boutique invalide.");}
  sb=window.requireSupabase();
  const {data,error}=await sb.from("sites").select("id,nom,slug,settings_json,public_slug,is_published").eq("public_slug",slug).eq("is_published",true).maybeSingle();
  if(error)throw error;if(!data)throw Error("Cette boutique est indisponible ou n'a pas encore été publiée.");shop=data;
  const cfg=shop.settings_json||{};document.title=(cfg.display_name||shop.nom)+" — JDNEXA";
  $("[data-shop-name]").textContent=cfg.display_name||shop.nom;
  $("[data-shop-description]").textContent=cfg.description||"Bienvenue dans notre boutique. Découvrez notre catalogue et contactez-nous pour toute information.";
  $("[data-shop-logo]").textContent=(cfg.display_name||shop.nom).slice(0,1).toUpperCase();
  if(cfg.logo_url){const img=node("img");img.src=cfg.logo_url;img.alt="Logo "+shop.nom;$("[data-shop-logo]").replaceChildren(img);}
  if(cfg.whatsapp||cfg.phone){const a=node("a","btn btn-light","Contacter la boutique");const phone=String(cfg.whatsapp||cfg.phone).replace(/[^0-9]/g,"");a.href="https://wa.me/"+phone;a.target="_blank";a.rel="noopener";$("[data-shop-contact]").append(a);}
  const result=await sb.from("collections_donnees").select("id,type_donnee,contenu_json,date_creation").eq("site_id",shop.id).eq("type_donnee","produit").order("date_creation",{ascending:false});
  if(result.error)throw result.error;products=result.data||[];render();
 }
 $("#product-search").addEventListener("input",render);
 $("[data-close-order]").addEventListener("click",closeOrder);
 $("[data-order-modal]").addEventListener("click",e=>{if(e.target===$("[data-order-modal]"))closeOrder();});
 $("[data-order-form]").addEventListener("submit",async e=>{
  e.preventDefault();const form=e.currentTarget;const btn=form.querySelector('[type="submit"]');btn.disabled=true;
  const status=$("[data-order-status]");status.textContent="";
  try{
   const payload={site_id:shop.id,type:"commande",details_json:{nom_client:form.nom_client.value.trim(),telephone:form.telephone.value.trim(),produit_id:form.product_id.value,produit:form.product_title.value,quantite:Number(form.quantite.value),message:form.message.value.trim(),source:"catalogue_public"}};
   const {error}=await sb.from("messages_et_commandes").insert(payload);if(error)throw error;
   status.className="success";status.textContent="Votre demande a bien été transmise à la boutique. Elle vous contactera.";
   form.reset();
  }catch(err){status.className="error";status.textContent=err.message||"Impossible d'envoyer la demande pour le moment.";}
  finally{btn.disabled=false;}
 });
 init().catch(e=>{$("[data-products]").replaceChildren(node("div","empty",e.message));$("[data-shop-name]").textContent="Boutique indisponible";});
})();