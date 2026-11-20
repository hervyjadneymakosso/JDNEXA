(() => {
 const $=s=>document.querySelector(s);let sb,user;
 const money=n=>new Intl.NumberFormat("fr-FR").format(n)+" FCFA";
 const status=(m,ok=false)=>{const e=$("[data-admin-status]");e.textContent=m;e.className=ok?"success":"error";};
 const cell=(tr,v)=>{const td=document.createElement("td");td.textContent=v??"—";tr.append(td);return td;};
 const danger=(label,fn)=>{const b=document.createElement("button");b.className="btn btn-danger-light";b.type="button";b.textContent=label;b.addEventListener("click",fn);return b;};
 async function loadPayments(){
  const {data,error}=await sb.from("demandes_paiement").select("id,owner_id,formule,cycle,montant_xaf,moyen,reference,statut,created_at").order("created_at",{ascending:false});if(error)throw error;
  const rows=data||[],counts={pending:0,approved:0,rejected:0};rows.forEach(r=>counts[r.statut]=(counts[r.statut]||0)+1);
  $("[data-pending-count]").textContent=counts.pending;$("[data-approved-count]").textContent=counts.approved;$("[data-rejected-count]").textContent=counts.rejected;
  const body=$("[data-payment-rows]");body.replaceChildren();if(!rows.length){const tr=document.createElement("tr");cell(tr,"Aucune demande.");body.append(tr);return;}
  rows.forEach(r=>{const tr=document.createElement("tr");cell(tr,new Date(r.created_at).toLocaleString("fr-FR"));cell(tr,r.owner_id);cell(tr,r.formule+" · "+(r.cycle==="annual"?"Annuel":"Mensuel"));cell(tr,money(r.montant_xaf));cell(tr,r.moyen);cell(tr,r.reference||"—");const td=cell(tr,r.statut==="pending"?"En attente":r.statut==="approved"?"Validée":"Refusée");
   if(r.statut==="pending"){const box=document.createElement("div");box.className="admin-actions";const a=document.createElement("button");a.className="btn btn-primary";a.textContent="Confirmer paiement";a.onclick=()=>review(r,true);const b=document.createElement("button");b.className="btn btn-light";b.textContent="Refuser";b.onclick=()=>review(r,false);box.append(a,b);td.append(box);}body.append(tr);});
 }
 async function review(r,approved){if(!confirm(approved?"Confirmez-vous avoir reçu ce paiement ?":"Confirmez-vous le refus ?"))return;try{
  if(approved){const start=new Date(),end=new Date(start);if(r.cycle==="annual")end.setFullYear(end.getFullYear()+1);else end.setMonth(end.getMonth()+1);
   const {error}=await sb.from("abonnements").upsert({owner_id:r.owner_id,formule:r.formule,statut:"active",cycle:r.cycle,debut:start.toISOString(),expiration:end.toISOString(),renouvellement_auto:false,fournisseur:r.moyen,reference_paiement:r.reference},{onConflict:"owner_id"});if(error)throw error;}
  const {error}=await sb.from("demandes_paiement").update({statut:approved?"approved":"rejected",reviewed_at:new Date().toISOString()}).eq("id",r.id);if(error)throw error;status(approved?"Paiement confirmé et abonnement activé.":"Demande refusée.",true);await loadPayments();
 }catch(e){status(e.message||"Erreur de mise à jour.");}}
 async function remove(action,id,label){
  const promptText=action==="delete_user"?"SUPPRESSION DÉFINITIVE DU COMPTE\n"+label+"\nTous ses sites, pages, contenus, commandes, abonnements et médias seront supprimés.":"SUPPRESSION DÉFINITIVE DU SITE\n"+label+"\nSes pages, contenus, commandes et médias seront supprimés.";
  if(!confirm(promptText+"\n\nCette opération est irréversible. Continuer ?"))return;
  const {data,error}=await sb.functions.invoke("jdnexa-admin-delete",{body:{action,id}});if(error)throw error;if(data?.error)throw new Error(data.error);
  status(data?.message||"Suppression effectuée.",true);await Promise.all([loadUsers(),loadSites(),loadPayments()]);
 }
 async function loadUsers(){const {data,error}=await sb.rpc("jdnexa_admin_list_users");if(error)throw error;const body=$("[data-user-rows]");body.replaceChildren();
  if(!data?.length){const tr=document.createElement("tr");cell(tr,"Aucun compte.");body.append(tr);return;}
  data.forEach(u=>{const tr=document.createElement("tr");cell(tr,u.email||"E-mail inconnu");cell(tr,u.created_at?new Date(u.created_at).toLocaleDateString("fr-FR"):"—");cell(tr,u.last_sign_in_at?new Date(u.last_sign_in_at).toLocaleString("fr-FR"):"Jamais");cell(tr,u.site_count);const td=document.createElement("td");if(u.user_id===user.id)td.textContent="Administrateur actuel";else td.append(danger("Supprimer le compte",()=>remove("delete_user",u.user_id,u.email||u.user_id).catch(e=>status(e.message))));tr.append(td);body.append(tr);});
 }
 async function loadSites(){const {data,error}=await sb.rpc("jdnexa_admin_list_sites");if(error)throw error;const body=$("[data-site-rows]");body.replaceChildren();
  if(!data?.length){const tr=document.createElement("tr");cell(tr,"Aucun site.");body.append(tr);return;}
  data.forEach(s=>{const tr=document.createElement("tr");cell(tr,s.nom);cell(tr,s.type_site);cell(tr,s.owner_email||s.owner_id);cell(tr,s.created_at?new Date(s.created_at).toLocaleDateString("fr-FR"):"—");cell(tr,s.is_published?"Publié":"Brouillon");const td=document.createElement("td");td.append(danger("Supprimer le site",()=>remove("delete_site",s.site_id,s.nom).catch(e=>status(e.message))));tr.append(td);body.append(tr);});
 }
 async function init(){sb=window.requireSupabase();const {data,error}=await sb.auth.getUser();if(error)throw error;user=data.user;if(!user){location.replace("login.html");return;}if(user.app_metadata?.role!=="admin"){document.querySelector("main").replaceChildren();status("Accès réservé aux administrateurs JDNEXA.");return;}await Promise.all([loadPayments(),loadUsers(),loadSites()]);}
 $("[data-refresh]").onclick=()=>loadPayments().catch(e=>status(e.message));$("[data-refresh-users]").onclick=()=>loadUsers().catch(e=>status(e.message));$("[data-refresh-sites]").onclick=()=>loadSites().catch(e=>status(e.message));
 $("[data-logout]").onclick=async()=>{await sb.auth.signOut();location.replace("index.html");};
 init().catch(e=>status(e.message||"Impossible de charger l'administration."));
})();