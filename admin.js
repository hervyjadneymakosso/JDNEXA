(() => {
 const $=s=>document.querySelector(s);let sb,user,rows=[];
 const money=n=>new Intl.NumberFormat("fr-FR").format(n)+" FCFA";
 const status=(m,ok=false)=>{const e=$("[data-admin-status]");e.textContent=m;e.className=ok?"success":"error";};
 const cell=(tr,value)=>{const td=document.createElement("td");td.textContent=value??"—";tr.append(td);return td;};
 async function load(){
  const {data,error}=await sb.from("demandes_paiement").select("id,owner_id,formule,cycle,montant_xaf,moyen,reference,statut,created_at").order("created_at",{ascending:false});
  if(error)throw error;rows=data||[];
  const counts={pending:0,approved:0,rejected:0};rows.forEach(r=>counts[r.statut]=(counts[r.statut]||0)+1);
  $("[data-pending-count]").textContent=counts.pending;$("[data-approved-count]").textContent=counts.approved;$("[data-rejected-count]").textContent=counts.rejected;
  const body=$("[data-payment-rows]");body.replaceChildren();
  if(!rows.length){const tr=document.createElement("tr");cell(tr,"Aucune demande enregistrée.");body.append(tr);return;}
  rows.forEach(r=>{
   const tr=document.createElement("tr");cell(tr,new Date(r.created_at).toLocaleString("fr-FR"));cell(tr,r.owner_id);cell(tr,r.formule+" · "+(r.cycle==="annual"?"Annuel":"Mensuel"));cell(tr,money(r.montant_xaf));cell(tr,r.moyen);cell(tr,r.reference||"Non communiquée");
   const td=cell(tr,r.statut==="pending"?"En attente":r.statut==="approved"?"Validée":"Refusée");
   if(r.statut==="pending"){
    const actions=document.createElement("div");actions.className="admin-actions";
    const approve=document.createElement("button");approve.className="btn btn-primary";approve.textContent="Confirmer paiement";approve.addEventListener("click",()=>review(r,true));
    const reject=document.createElement("button");reject.className="btn btn-light";reject.textContent="Refuser";reject.addEventListener("click",()=>review(r,false));
    actions.append(approve,reject);td.append(actions);
   }
   body.append(tr);
  });
 }
 async function review(r,approved){
  if(!confirm(approved?"Confirmez-vous avoir vérifié et reçu ce paiement ?":"Confirmez-vous le refus de cette demande ?"))return;
  try{
   if(approved){
    const start=new Date(),end=new Date(start);if(r.cycle==="annual")end.setFullYear(end.getFullYear()+1);else end.setMonth(end.getMonth()+1);
    const {error:subError}=await sb.from("abonnements").upsert({owner_id:r.owner_id,formule:r.formule,statut:"active",cycle:r.cycle,debut:start.toISOString(),expiration:end.toISOString(),renouvellement_auto:false,fournisseur:r.moyen,reference_paiement:r.reference},{onConflict:"owner_id"});
    if(subError)throw subError;
   }
   const {error}=await sb.from("demandes_paiement").update({statut:approved?"approved":"rejected",reviewed_at:new Date().toISOString()}).eq("id",r.id);
   if(error)throw error;status(approved?"Paiement confirmé et abonnement activé.":"Demande refusée.",true);await load();
  }catch(e){status(e.message||"La mise à jour a échoué.");}
 }
 async function init(){
  sb=window.requireSupabase();const {data,error}=await sb.auth.getUser();if(error)throw error;user=data.user;if(!user){location.href="login.html";return;}
  const role=user.app_metadata?.role;if(role!=="admin"){document.querySelector("main").replaceChildren();status("Accès réservé aux administrateurs JDNEXA.");return;}
  await load();
 }
 $("[data-refresh]").addEventListener("click",()=>load().catch(e=>status(e.message)));
 $("[data-logout]").addEventListener("click",async()=>{await sb.auth.signOut();location.href="index.html";});
 init().catch(e=>status(e.message||"Impossible de charger l'administration."));
})();