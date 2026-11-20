(() => {
 const canvas=document.querySelector("[data-canvas]");
 if(!canvas)return;
 const $=s=>document.querySelector(s);
 const params=new URLSearchParams(location.search);
 let siteId=params.get("site"),pageId=null,blocks=[],selectedId=null,sb=null,site=null,dirty=false;
 const status=$("[data-editor-status]"),saveButton=$("[data-save-page]"),titleInput=$("#page-title-input"),slugInput=$("#page-slug-input"),properties=$("[data-properties]");
 const uid=()=>crypto.randomUUID?crypto.randomUUID():"b-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2);
 const defaults={
  title:()=>({type:"title",text:"Votre titre principal",level:2}),
  text:()=>({type:"text",text:"Présentez votre activité, vos services ou votre entreprise à vos visiteurs. Expliquez clairement ce que vous proposez."}),
  button:()=>({type:"button",text:"Nous contacter",url:"https://wa.me/242000000000"}),
  image:()=>({type:"image",alt:"Image de présentation",url:"https://placehold.co/1000x500/eaf2ff/1458d4?text=Votre+image"}),
  divider:()=>({type:"divider"}),
  spacer:()=>({type:"spacer",height:32})
 };
 function setStatus(message,type="muted"){status.textContent=message;status.className="studio-save-state "+type;}
 function changed(){dirty=true;setStatus("Modifications non enregistrées","warning");saveButton.disabled=false;}
 function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
 function addField(parent,label,key,value,type="text"){
  const wrap=el("label","field");wrap.append(el("span","",label));
  const input=el(type==="textarea"?"textarea":"input");
  if(type!=="textarea")input.type=type;
  input.value=value??"";
  if(key==="url")input.placeholder="https://…";
  input.addEventListener("input",()=>{const block=blocks.find(b=>b.id===selectedId);if(!block)return;block[key]=type==="number"?Number(input.value):input.value;changed();renderCanvas();});
  wrap.append(input);parent.append(wrap);
 }
 function selectBlock(block){selectedId=block.id;renderCanvas();renderProperties();}
 function renderCanvas(){
  canvas.replaceChildren();
  if(!blocks.length){const empty=el("div","empty","Votre page est vide. Ajoutez un titre, un texte, une image ou un bouton depuis le panneau de gauche.");canvas.append(empty);return;}
  blocks.forEach((block,index)=>{
   const card=el("section","studio-block"+(selectedId===block.id?" selected":""));
   card.tabIndex=0;card.setAttribute("role","button");card.setAttribute("aria-label","Sélectionner l'élément "+(index+1));
   if(block.type==="title"){const h=el(block.level===1?"h1":"h2","",block.text);card.append(h);}
   else if(block.type==="text"){card.append(el("p","",block.text));}
   else if(block.type==="button"){const a=el("span","btn btn-primary",block.text);a.setAttribute("aria-label","Aperçu du bouton");card.append(a);}
   else if(block.type==="image"){const img=el("img");img.src=block.url||"";img.alt=block.alt||"Image";img.loading="lazy";card.append(img);}
   else if(block.type==="divider"){card.append(el("hr"));}
   else if(block.type==="spacer"){const space=el("div","studio-spacer","Espace");space.style.height=Math.max(8,Math.min(240,Number(block.height)||32))+"px";card.append(space);}
   card.addEventListener("click",()=>selectBlock(block));
   card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectBlock(block);}});
   const controls=el("div","studio-block-controls");
   const moveUp=el("button","btn btn-light","↑");moveUp.type="button";moveUp.title="Monter";moveUp.disabled=index===0;moveUp.addEventListener("click",e=>{e.stopPropagation();moveBlock(index,-1);});
   const moveDown=el("button","btn btn-light","↓");moveDown.type="button";moveDown.title="Descendre";moveDown.disabled=index===blocks.length-1;moveDown.addEventListener("click",e=>{e.stopPropagation();moveBlock(index,1);});
   controls.append(moveUp,moveDown);card.append(controls);canvas.append(card);
  });
 }
 function renderProperties(){
  properties.replaceChildren(el("h2","","Propriétés"));
  const block=blocks.find(b=>b.id===selectedId);
  if(!block){properties.append(el("p","muted","Sélectionnez un élément dans l'aperçu pour le modifier."));return;}
  properties.append(el("p","studio-selected-label","Élément sélectionné : "+({title:"Titre",text:"Texte",button:"Bouton / lien",image:"Image",divider:"Séparateur",spacer:"Espace"}[block.type]||"Contenu")));
  if(block.type==="title"||block.type==="text"||block.type==="button")addField(properties,block.type==="button"?"Texte du bouton":block.type==="title"?"Votre titre":"Votre texte","text",block.text,"textarea");
  if(block.type==="title"){
   const wrap=el("label","field");wrap.append(el("span","","Niveau du titre"));const select=el("select");[["1","Titre principal"],["2","Sous-titre"]].forEach(([v,t])=>{const o=el("option","",t);o.value=v;select.append(o);});select.value=String(block.level||2);select.addEventListener("change",()=>{block.level=Number(select.value);changed();renderCanvas();});wrap.append(select);properties.append(wrap);
  }
  if(block.type==="button")addField(properties,"Adresse du lien","url",block.url,"url");
  if(block.type==="image"){addField(properties,"Adresse de l'image (URL)","url",block.url,"url");addField(properties,"Texte alternatif","alt",block.alt);addField(properties,"Légende","caption",block.caption||"","textarea");}
  if(block.type==="spacer"){addField(properties,"Hauteur en pixels","height",block.height||32,"number");}
  const actions=el("div","studio-property-actions");
  const duplicate=el("button","btn btn-light","Dupliquer");duplicate.type="button";duplicate.addEventListener("click",()=>{const copy={...block,id:uid()};blocks.splice(blocks.findIndex(b=>b.id===block.id)+1,0,copy);selectedId=copy.id;changed();renderCanvas();renderProperties();});
  const remove=el("button","btn btn-light","Supprimer");remove.type="button";remove.addEventListener("click",()=>{blocks=blocks.filter(b=>b.id!==block.id);selectedId=null;changed();renderCanvas();renderProperties();});
  actions.append(duplicate,remove);properties.append(actions);
 }
 function moveBlock(index,delta){const next=index+delta;if(next<0||next>=blocks.length)return;[blocks[index],blocks[next]]=[blocks[next],blocks[index]];selectedId=blocks[next].id;changed();renderCanvas();renderProperties();}
 document.querySelectorAll("[data-add-block]").forEach(button=>button.addEventListener("click",()=>{const type=button.dataset.addBlock;if(!defaults[type])return;const block={...defaults[type](),id:uid()};blocks.push(block);selectedId=block.id;changed();renderCanvas();renderProperties();}));
 async function init(){
  sb=window.requireSupabase();
  const {data:{user},error:authError}=await sb.auth.getUser();if(authError)throw authError;if(!user){location.href="login.html";return;}
  if(!siteId){const {data,error}=await sb.from("sites").select("id,nom,slug").order("created_at",{ascending:false}).limit(1).maybeSingle();if(error)throw error;if(!data){location.href="dashboard.html";return;}siteId=data.id;site=data;}
  else {const {data,error}=await sb.from("sites").select("id,nom,slug").eq("id",siteId).maybeSingle();if(error)throw error;if(!data)throw Error("Ce site est introuvable ou vous n'avez pas accès à cet espace.");site=data;}
  const {data:pages,error:pageError}=await sb.from("pages").select("id,titre,slug,content_json").eq("site_id",siteId).order("created_at",{ascending:true}).limit(1);
  if(pageError)throw pageError;
  if(pages&&pages.length){const page=pages[0];pageId=page.id;titleInput.value=page.titre||"Accueil";slugInput.value=page.slug||"accueil";blocks=Array.isArray(page.content_json?.blocks)?page.content_json.blocks:[];}
  else {const {data,error}=await sb.from("pages").insert({site_id:siteId,titre:"Accueil",slug:"accueil",content_json:{blocks:[]}}).select("id").single();if(error)throw error;pageId=data.id;titleInput.value="Accueil";slugInput.value="accueil";blocks=[];}
  renderCanvas();renderProperties();setStatus("Page chargée : "+site.nom,"success");
 }
 [titleInput,slugInput].forEach(input=>input.addEventListener("input",changed));
 saveButton.addEventListener("click",async()=>{
  saveButton.disabled=true;setStatus("Enregistrement en cours…","muted");
  try{
   const title=titleInput.value.trim()||"Accueil";
   const slug=slugInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"")||"accueil";
   const {error}=await sb.from("pages").update({titre:title,slug,content_json:{blocks}}).eq("id",pageId).eq("site_id",siteId);
   if(error)throw error;
   slugInput.value=slug;dirty=false;setStatus("Toutes les modifications ont été enregistrées.","success");
  }catch(error){setStatus(error.message||"Impossible d'enregistrer les modifications.","error");saveButton.disabled=false;}
 });
 document.querySelector("[data-logout]")?.addEventListener("click",async()=>{await sb?.auth.signOut();location.href="index.html";});
 window.addEventListener("beforeunload",e=>{if(dirty){e.preventDefault();e.returnValue="";}});
 init().catch(error=>setStatus(error.message||"Impossible de charger le studio.","error"));
})();