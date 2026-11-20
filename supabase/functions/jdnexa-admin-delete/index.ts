import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return reply({error:"Méthode non autorisée."},405);
 try{
  const url=Deno.env.get("SUPABASE_URL")!,anon=Deno.env.get("SUPABASE_ANON_KEY")!,service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const auth=req.headers.get("Authorization")||"";if(!auth.startsWith("Bearer "))return reply({error:"Connexion administrateur requise."},401);
  const caller=createClient(url,anon,{global:{headers:{Authorization:auth}}});
  const {data:who,error:whoErr}=await caller.auth.getUser();
  if(whoErr||!who.user||who.user.app_metadata?.role!=="admin")return reply({error:"Accès réservé aux administrateurs."},403);
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  const {action,id}=await req.json();if(!id)return reply({error:"Identifiant manquant."},400);
  if(action==="delete_user"&&id===who.user.id)return reply({error:"Vous ne pouvez pas supprimer votre propre compte administrateur."},400);
  let sites:string[]=[];
  if(action==="delete_site"){
   const {data,error}=await admin.from("sites").select("id").eq("id",id).maybeSingle();if(error)throw error;
   if(!data)return reply({error:"Site introuvable."},404);sites=[data.id];
  }else if(action==="delete_user"){
   const {data,error}=await admin.from("sites").select("id").eq("owner_id",id);if(error)throw error;sites=(data||[]).map((s:{id:string})=>s.id);
  }else return reply({error:"Action inconnue."},400);
  async function filesUnder(prefix:string):Promise<string[]>{
   const found:string[]=[];let offset=0;
   while(true){const {data,error}=await admin.storage.from("jdnexa-media").list(prefix,{limit:100,offset});if(error)throw error;if(!data?.length)break;
    for(const item of data){const path=prefix+"/"+item.name;if(item.id===null)found.push(...await filesUnder(path));else found.push(path);}
    if(data.length<100)break;offset+=data.length;
   }return found;
  }
  for(const siteId of sites){const paths=await filesUnder(siteId);for(let i=0;i<paths.length;i+=100){const {error}=await admin.storage.from("jdnexa-media").remove(paths.slice(i,i+100));if(error)throw error;}}
  if(action==="delete_site"){const {error}=await admin.from("sites").delete().eq("id",id);if(error)throw error;return reply({success:true,message:"Site, pages, contenus, commandes et médias supprimés."});}
  const {error}=await admin.auth.admin.deleteUser(id);if(error)throw error;
  return reply({success:true,message:"Compte, sites, données associées et médias supprimés."});
 }catch(e){console.error(e);return reply({error:e instanceof Error?e.message:"La suppression a échoué."},500);}
});