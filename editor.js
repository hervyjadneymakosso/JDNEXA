(() => {
 const canvas=document.querySelector("[data-canvas]");if(!canvas)return;
 const params=new URLSearchParams(location.search);let siteId=params.get("site"),pageId=null,blocks=[],selected=null;
 const status=document.querySelector("[data-editor-status]");
 const tools=document.querySelectorAll("[data-add-block]");
 function make(type){const defaults={title:{type,text:"Votre titre",level:2},text:{type,text:"Présentez votre activité ici."},button:{type,text:"Nous contacter",url:"#"},image:{type,alt:"Image de présentation",url:"https://placehold.co/900x360/eaf2ff/0866ff?text=Votre+image"}};return {...defaults[type],id:crypto.randomUUID()};}
 function render(){canvas.innerHTML="";blocks.forEach(b=>{
  const el=document.createElement("section");el.className="block"+(selected===b.id?" selected":"");el.tabIndex=0;
  if(b.type==="title"){const h=document.createElement("h2");h.textContent=b.text;el.append(h);}
  if(b.type==="text"){const p=document.createElement("p");p.textContent=b.text;el.append(p);}
  if(b.type==="button"){const a=document.createElement("a");a.className="btn btn-primary";a.textContent=b.text;a.href=b.url;el.append(a);}
  if(b.type==="image"){const img=document.createElement("img");img.src=b.url;img.alt=b.alt||"Image";img.loading="lazy";img.style.width="100%";img.style.borderRadius="8px";el.append(img);}
  el.addEventListener("click",()=>{selected=b.id;render();editPanel(b);});canvas.append(el);
 });}
 function editPanel(b){const panel=document.querySelector("[data-properties]");panel.innerHTML="";const heading=document.createElement("h3");heading.textContent="Modifier le bloc";panel.append(heading);
  [["Texte","text"],...(b.type==="button"||b.type==="image"?[["Adresse du lien / image","url"]]:[]) ,...(b.type==="image"?[["Texte alternatif","alt"]]:[])].forEach(([label,key])=>{const wrap=document.createElement("label");wrap.className="field";wrap.textContent=label;const input=document.createElement("input");input.value=b[key]||"";input.addEventListener("input",()=>{b[key]=input.value;render();});wrap.append(input);panel.append(wrap);});
  const copy=document.createElement("button");copy.className="btn btn-light";copy.textContent="Dupliquer";copy.onclick=()=>{const clone={...b,id:crypto.randomUUID()};blocks.splice(blocks.findIndex(x=>x.id===b.id)+1,0,clone);selected=clone.id;render();editPanel(clone);};panel.append(copy);
  const del=document.createElement("button");del.className="btn btn-light";del.textContent="Supprimer";del.onclick=()=>{blocks=blocks.filter(x=>x.id!==b.id);selected=null;render();panel.innerHTML="<p class='muted'>Sélectionnez un bloc pour le modifier.</p>";};panel.append(del);
  const up=document.createElement("button");up.className="btn btn-light";up.textContent="Monter";up.onclick=()=>move(b.id,-1);panel.append(up);
  const down=document.createElement("button");down.className="btn btn-light";down.textContent="Descendre";down.onclick=()=>move(b.id,1);panel.append(down);
 }
 function move(id,dir){const i=blocks.findIndex(x=>x.id===id),j=i+dir;if(j<0||j>=blocks.length)return;[blocks[i],blocks[j]]=[blocks[j],blocks[i]];render();editPanel(blocks[j]);}
 tools.forEach(t=>t.addEventListener("click",()=>{const b=make(t.dataset.addBlock);blocks.push(b);selected=b.id;render();editPanel(b);}));
 async function init(){const sb=window.requireSupabase();const {data:{user}}=await sb.auth.getUser();if(!user){location.href="login.html";return;}
  if(!siteId){const {data,error}=await sb.from("sites").select("id").limit(1).single();if(error)throw error;siteId=data.id;}
  const {data:pages,error}=await sb.from("pages").select("*").eq("site_id",siteId).order("created_at").limit(1);
  if(error)throw error;
  if(pages.length){pageId=pages[0].id;blocks=pages[0].content_json?.blocks||[];}
  else {const {data,error:insertErr}=await sb.from("pages").insert({site_id:siteId,titre:"Accueil",slug:"accueil",content_json:{blocks:[]}}).select().single();if(insertErr)throw insertErr;pageId=data.id;}
  render();
 }
 document.querySelector("[data-save-page]")?.addEventListener("click",async()=>{try{const {error}=await window.sb.from("pages").update({content_json:{blocks}}).eq("id",pageId);if(error)throw error;status.textContent="Page sauvegardée.";status.className="success";}catch(e){status.textContent=e.message;status.className="error";}});
 document.querySelector("[data-export-json]")?.addEventListener("click",()=>{const blob=new Blob([JSON.stringify({version:1,blocks},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="jdnexa-page.json";a.click();URL.revokeObjectURL(a.href);});
 init().catch(e=>{status.textContent=e.message;status.className="error";});
})();