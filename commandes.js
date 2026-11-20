(() => {
 const $=s=>document.querySelector(s);let sb,sites=[],orders=[];
 const msg=(s,ok=false)=>{const e=$("[data-status]");e.textContent=s;e.className=ok?"success":"error";};
 const fmt=d=>new Date(d).toLocaleString("fr-FR");
 async function load(){
  const {data,error}=await sb.from("sites").select("id,nom").order("created_at",{ascending:false});if(error)throw error;sites=data||[];
  const sel=$("[data-site-filter]"),old=sel.value;sel.replaceChildren(new Option("Toutes mes boutiques",""));sites.forEach(s=>sel.add(new Option(s.nom,s.id)));sel.value=old;
  let query=sb.from("messages_et_commandes").select("id,site_id,type,details_json,date_creation").eq("type","commande").order("date_creation",{ascending:false});
  if(sel.value)query=query.eq("site_id",sel.value);else if(sites.length)query=query.in("site_id",sites.map(s=>s.id));else query=query.eq("site_id","00000000-0000-0000-0000-000000000000");
  const result=await query;if(result.error)throw result.error;orders=result.data||[];
  const done=orders.filter(o=>o.details_json?.statut==="traitee").length;
  $("[data-total]").textContent=orders.length;$("[data-new]").textContent=orders.length-done;$("[data-done]").textContent=done;
  render();
 }
 function render(){
  const root=$("[data-orders]");root.replaceChildren();
  if(!orders.length){const e=document.createElement("div");e.className="empty";e.textContent="Aucune commande reçue pour le moment.";root.append(e);return;}
  orders.forEach(o=>{
   const d=o.details_json||{},row=document.createElement("article");row.className="data-row order-row";
   const info=document.createElement("div");const title=document.createElement("strong");title.textContent=d.produit||"Commande";const desc=document.createElement("p");desc.textContent=(d.nom_client||"Client")+" · "+(d.telephone||"Sans téléphone")+" · Quantité : "+(d.quantite||1);
   const meta=document.createElement("p");meta.textContent=fmt(o.date_creation)+" · "+(sites.find(s=>s.id===o.site_id)?.nom||"Boutique");
   const note=document.createElement("p");note.textContent=d.message||"Aucune précision supplémentaire.";
   info.append(title,desc,meta,note);
   const actions=document.createElement("div");actions.className="editor-actions";
   const call=document.createElement("a");call.className="btn btn-light";call.href="tel:"+String(d.telephone||"").replace(/[^0-9+]/g,"");call.textContent="Appeler";
   const wa=document.createElement("a");wa.className="btn btn-light";wa.href="https://wa.me/"+String(d.telephone||"").replace(/[^0-9]/g,"");wa.target="_blank";wa.rel="noopener";wa.textContent="WhatsApp";
   const state=document.createElement("button");state.className="btn "+(d.statut==="traitee"?"btn-light":"btn-primary");state.textContent=d.statut==="traitee"?"Marquer comme nouvelle":"Marquer comme traitée";state.addEventListener("click",()=>toggle(o));
   actions.append(call,wa,state);row.append(info,actions);root.append(row);
  });
 }
 async function toggle(o){const details={...o.details_json,statut:o.details_json?.statut==="traitee"?"nouvelle":"traitee"};const {error}=await sb.from("messages_et_commandes").update({details_json:details}).eq("id",o.id);if(error){msg(error.message);return;}await load();}
 async function init(){sb=window.requireSupabase();const {data,error}=await sb.auth.getUser();if(error)throw error;if(!data.user){location.href="login.html";return;}await load();}
 $("[data-site-filter]").addEventListener("change",()=>load().catch(e=>msg(e.message)));
 $("[data-refresh]").addEventListener("click",()=>load().catch(e=>msg(e.message)));
 $("[data-logout]").addEventListener("click",async()=>{await sb.auth.signOut();location.href="index.html";});
 init().catch(e=>msg(e.message||"Impossible de charger les commandes."));
})();