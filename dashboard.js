(async () => {
 const email = document.querySelector("[data-user-email]");
 const list = document.querySelector("[data-sites]");
 const msg = document.querySelector("[data-dashboard-message]");
 try {
  const sb = window.requireSupabase();
  const {data:{session},error:authErr}=await sb.auth.getSession();
  if(authErr) throw authErr;
  if(!session){location.href="login.html";return;}
  if(email) email.textContent=session.user.email;
  const {data,error}=await sb.from("sites").select("id,nom,slug,created_at").order("created_at",{ascending:false});
  if(error) throw error;
  list.innerHTML="";
  if(!data.length){list.innerHTML='<div class="empty">Aucun site pour le moment. Créez votre premier site.</div>';return;}
  data.forEach(site=>{
   const row=document.createElement("article");row.className="data-row";
   const info=document.createElement("div");const title=document.createElement("strong");title.textContent=site.nom;
   const sub=document.createElement("p");sub.textContent=site.slug;info.append(title,sub);
   const link=document.createElement("a");link.className="btn btn-light";link.href=`studio.html?site=${encodeURIComponent(site.id)}`;link.textContent="Ouvrir le studio";
   row.append(info,link);list.append(row);
  });
 } catch(e){if(msg)msg.textContent=e.message;}
 const create=document.querySelector("[data-create-site]");
 create?.addEventListener("submit",async e=>{
  e.preventDefault();const status=create.querySelector("[data-message]");
  try{
   const sb=window.requireSupabase();const {data:{user}}=await sb.auth.getUser();
   const nom=create.nom.value.trim();const slug=create.slug.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,"-");
   if(!nom||!slug)throw Error("Saisissez un nom et un identifiant de site.");
   const {error}=await sb.from("sites").insert({owner_id:user.id,nom,slug,settings_json:{theme:"facebook-blue"}});
   if(error)throw error;location.reload();
  }catch(err){status.textContent=err.message;}
 });
 document.querySelector("[data-logout]")?.addEventListener("click",async()=>{await window.sb?.auth.signOut();location.href="index.html";});
})();