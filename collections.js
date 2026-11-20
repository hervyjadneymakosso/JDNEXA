(() => {
 const form=document.querySelector("[data-collection-form]"); if(!form)return;
 const list=document.querySelector("[data-collection-list]"), status=document.querySelector("[data-message]");
 let siteId=new URLSearchParams(location.search).get("site");
 let rows=[];
 const safe=(s)=>String(s??"");
 function render(){
  list.innerHTML="";
  if(!rows.length){list.innerHTML='<div class="empty">Aucun contenu. Ajoutez votre premier élément.</div>';return;}
  rows.forEach(item=>{
   const row=document.createElement("article");row.className="data-row";
   const info=document.createElement("div"),title=document.createElement("strong"),desc=document.createElement("p");
   title.textContent=item.contenu_json?.titre || item.type_donnee;
   desc.textContent=`${item.type_donnee} · ${new Date(item.date_creation).toLocaleDateString("fr-FR")}`;
   info.append(title,desc);
   const actions=document.createElement("div");actions.className="editor-actions";
   const edit=document.createElement("button");edit.className="btn btn-light";edit.textContent="Modifier";edit.onclick=()=>{form.item_id.value=item.id;form.type_donnee.value=item.type_donnee;form.titre.value=item.contenu_json?.titre||"";form.description.value=item.contenu_json?.description||"";form.prix.value=item.contenu_json?.prix??"";};
   const del=document.createElement("button");del.className="btn btn-light";del.textContent="Supprimer";del.onclick=()=>remove(item.id);
   actions.append(edit,del);row.append(info,actions);list.append(row);
  });
 }
 async function load(){const sb=window.requireSupabase();const {data:{user}}=await sb.auth.getUser();if(!user){location.href="login.html";return;}
  if(!siteId){const {data,error}=await sb.from("sites").select("id").limit(1).single();if(error)throw error;siteId=data.id;}
  const {data,error}=await sb.from("collections_donnees").select("*").eq("site_id",siteId).order("date_creation",{ascending:false});if(error)throw error;rows=data;render();}
 async function remove(id){if(!confirm("Supprimer cet élément ?"))return;try{const {error}=await window.sb.from("collections_donnees").delete().eq("id",id);if(error)throw error;await load();}catch(e){status.textContent=e.message;}}
 form.addEventListener("submit",async e=>{e.preventDefault();status.textContent="";try{
  const sb=window.requireSupabase();const contenu_json={titre:form.titre.value.trim(),description:form.description.value.trim(),prix:form.prix.value?Number(form.prix.value):null};
  const payload={site_id:siteId,type_donnee:form.type_donnee.value,contenu_json};
  const id=form.item_id.value;const result=id?await sb.from("collections_donnees").update(payload).eq("id",id):await sb.from("collections_donnees").insert(payload);
  if(result.error)throw result.error;form.reset();form.item_id.value="";await load();
 }catch(err){status.textContent=err.message;}});
 load().catch(e=>status.textContent=e.message);
})();