(() => {
 const form=document.querySelector("[data-collection-form]");if(!form)return;
 const $=s=>document.querySelector(s),list=$("[data-collection-list]"),status=$("[data-message]");
 let siteId=new URLSearchParams(location.search).get("site"),rows=[],sb,site;
 const safe=v=>String(v??"");
 const setStatus=(msg,ok=false)=>{status.textContent=msg;status.className=ok?"success":"error";};
 function clearForm(){form.reset();form.item_id.value="";form.querySelector('[data-cancel-edit]').hidden=true;$("[data-image-preview]").hidden=true;}
 function render(){
  list.replaceChildren();
  if(!rows.length){const e=document.createElement("div");e.className="empty";e.textContent="Aucun contenu enregistré pour le moment.";list.append(e);return;}
  rows.forEach(item=>{
   const d=item.contenu_json||{},row=document.createElement("article");row.className="data-row product-admin-row";
   if(d.image_url){const img=document.createElement("img");img.src=d.image_url;img.alt=d.titre||"Produit";img.className="product-admin-thumb";row.append(img);}
   const info=document.createElement("div");info.className="product-admin-info";
   const title=document.createElement("strong");title.textContent=d.titre||item.type_donnee;
   const desc=document.createElement("p");desc.textContent=[item.type_donnee,d.categorie,d.prix!=null?new Intl.NumberFormat("fr-FR").format(d.prix)+" FCFA":null,d.stock!=null?"Stock : "+d.stock:null].filter(Boolean).join(" · ");
   const description=document.createElement("p");description.textContent=d.description||"";
   info.append(title,desc,description);row.append(info);
   const actions=document.createElement("div");actions.className="editor-actions";
   const edit=document.createElement("button");edit.type="button";edit.className="btn btn-light";edit.textContent="Modifier";edit.addEventListener("click",()=>editItem(item));
   const del=document.createElement("button");del.type="button";del.className="btn btn-light";del.textContent="Supprimer";del.addEventListener("click",()=>remove(item.id));
   actions.append(edit,del);row.append(actions);list.append(row);
  });
 }
 function editItem(item){const d=item.contenu_json||{};form.item_id.value=item.id;form.type_donnee.value=item.type_donnee;form.titre.value=d.titre||"";form.description.value=d.description||"";form.categorie.value=d.categorie||"";form.prix.value=d.prix??"";form.stock.value=d.stock??0;form.version.value=d.version||"";form.download_url.value=d.download_url||"";$("[data-image-preview]").hidden=!d.image_url;if(d.image_url)$("[data-image-preview]").src=d.image_url;form.querySelector('[data-cancel-edit]').hidden=false;form.scrollIntoView({behavior:"smooth",block:"start"});}
 async function uploadImage(file){
  if(!file)return null;
  if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw Error("Format d'image non accepté. Utilisez JPG, PNG ou WebP.");
  if(file.size>5*1024*1024)throw Error("L'image dépasse la limite de 5 Mo.");
  const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
  const path=siteId+"/"+crypto.randomUUID()+"."+ext;
  const {error}=await sb.storage.from("jdnexa-media").upload(path,file,{upsert:false,contentType:file.type});
  if(error)throw error;
  return sb.storage.from("jdnexa-media").getPublicUrl(path).data.publicUrl;
 }
 async function load(){
  sb=window.requireSupabase();const {data:{user},error:authError}=await sb.auth.getUser();if(authError)throw authError;if(!user){location.href="login.html";return;}
  if(!siteId){const {data,error}=await sb.from("sites").select("id,nom,public_slug,is_published").order("created_at",{ascending:false}).limit(1).maybeSingle();if(error)throw error;if(!data)throw Error("Créez d'abord un site depuis le tableau de bord.");siteId=data.id;site=data;}
  else{const {data,error}=await sb.from("sites").select("id,nom,public_slug,is_published").eq("id",siteId).maybeSingle();if(error)throw error;if(!data)throw Error("Site introuvable ou accès refusé.");site=data;}
  const {data,error}=await sb.from("collections_donnees").select("*").eq("site_id",siteId).order("date_creation",{ascending:false});if(error)throw error;rows=data||[];render();
  const link=$("[data-store-link]");if(site.is_published&&site.public_slug){const a=document.createElement("a");a.className="btn btn-primary";a.href="site.html?slug="+encodeURIComponent(site.public_slug);a.target="_blank";a.textContent="Ouvrir ma boutique publique";link.replaceChildren(a);}else link.textContent="Publiez votre boutique depuis Paramètres pour rendre les produits visibles.";
 }
 async function remove(id){if(!confirm("Supprimer définitivement ce contenu ?"))return;try{const {error}=await sb.from("collections_donnees").delete().eq("id",id);if(error)throw error;rows=rows.filter(r=>r.id!==id);render();setStatus("Contenu supprimé.",true);}catch(e){setStatus(e.message);}}
 form.addEventListener("submit",async e=>{e.preventDefault();const btn=form.querySelector('[type="submit"]');btn.disabled=true;setStatus("");
  try{
   const id=form.item_id.value;const old=rows.find(r=>r.id===id);let imageUrl=old?.contenu_json?.image_url||null;
   if(form.image.files[0])imageUrl=await uploadImage(form.image.files[0]);
   const contenu_json={...(old?.contenu_json||{}),titre:form.titre.value.trim(),description:form.description.value.trim(),categorie:form.categorie.value.trim(),prix:form.prix.value===""?null:Number(form.prix.value),stock:Number(form.stock.value||0),version:form.version.value.trim(),download_url:form.download_url.value.trim(),image_url:imageUrl};
   const payload={site_id:siteId,type_donnee:form.type_donnee.value,contenu_json};
   const result=id?await sb.from("collections_donnees").update(payload).eq("id",id):await sb.from("collections_donnees").insert(payload);
   if(result.error)throw result.error;clearForm();await load();setStatus("Contenu enregistré avec succès.",true);
  }catch(err){setStatus(err.message||"Impossible d'enregistrer ce contenu.");}finally{btn.disabled=false;}
 });
 form.querySelector('[data-cancel-edit]').addEventListener("click",clearForm);
 form.image.addEventListener("change",()=>{const file=form.image.files[0];if(!file)return;const preview=$("[data-image-preview]");preview.src=URL.createObjectURL(file);preview.hidden=false;});
 document.querySelector("[data-logout]")?.addEventListener("click",async()=>{await sb.auth.signOut();location.href="index.html";});
 load().catch(e=>setStatus(e.message));
})();