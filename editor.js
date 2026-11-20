(() => {
 const $=s=>document.querySelector(s),canvas=$("[data-canvas]"),props=$("[data-properties]"),status=$("[data-editor-status]");
 if(!canvas)return;
 const params=new URLSearchParams(location.search);let sb,user,siteId=params.get("site"),site=null,pages=[],pageId=null,blocks=[],selectedId=null,dirty=false,settings={};
 const titleInput=$("#page-title-input"),slugInput=$("#page-slug-input"),saveBtn=$("[data-save-page"),pageSelect=$("[data-page-select"),siteSelect=$("[data-site-select");
 const uid=()=>crypto.randomUUID();
 const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
 const setStatus=(s,kind="muted")=>{status.textContent=s;status.className="studio-save-state "+kind;};
 const changed=()=>{dirty=true;saveBtn.disabled=false;setStatus("Modifications non enregistrées","warning");};
 const safeUrl=v=>{try{const u=new URL(v);return ["https:","http:"].includes(u.protocol)?u.href:"";}catch{return "";}};
 const templates={
 title:{type:"title",text:"Votre titre principal",level:1},text:{type:"text",text:"Présentez votre activité, vos services ou votre projet à vos visiteurs."},
 button:{type:"button",text:"En savoir plus",url:"https://example.com"},image:{type:"image",url:"",alt:"Illustration",caption:""},
 video:{type:"video",url:"",caption:""},gallery:{type:"gallery",images:[]},list:{type:"list",items:["Premier élément","Deuxième élément","Troisième élément"]},spacer:{type:"spacer",height:32},divider:{type:"divider"}
 };
 function previewBlock(b){
  const w=el("section","studio-block"+(selectedId===b.id?" selected":""));
  if(b.type==="title"){const h=el(b.level===1?"h1":"h2","",b.text);w.append(h);}
  if(b.type==="text")w.append(el("p","",b.text));
  if(b.type==="button"){const a=el("span","btn btn-primary",b.text);w.append(a);}
  if(b.type==="image"){if(b.url){const i=el("img","studio-preview-image");i.src=b.url;i.alt=b.alt||"";w.append(i);}if(b.caption)w.append(el("small","",b.caption));if(!b.url)w.append(el("div","empty","Ajoutez une image depuis les propriétés."));}
  if(b.type==="video"){const u=safeUrl(b.url);if(u){const frame=el("iframe","studio-video");frame.src=u;frame.title=b.caption||"Vidéo";frame.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";frame.allowFullscreen=true;w.append(frame);}else w.append(el("div","empty","Ajoutez l'adresse d'une vidéo compatible."));}
  if(b.type==="gallery"){const g=el("div","studio-gallery");(b.images||[]).forEach(url=>{const i=el("img");i.src=url;i.alt="Image de galerie";g.append(i);});w.append(g);if(!g.children.length)w.append(el("div","empty","Ajoutez des adresses d'images dans les propriétés."));}
  if(b.type==="list"){const ul=el("ul","");(b.items||[]).forEach(x=>ul.append(el("li","",x)));w.append(ul);}
  if(b.type==="divider")w.append(el("hr"));
  if(b.type==="spacer"){const s=el("div","studio-spacer");s.style.height=Math.max(8,Math.min(300,Number(b.height)||32))+"px";w.append(s);}
  w.addEventListener("click",()=>{selectedId=b.id;render();renderProps();});
  return w;
 }
 function render(){canvas.replaceChildren();if(!blocks.length){canvas.append(el("div","empty","Page vide. Ajoutez un élément depuis le panneau de gauche."));return;}
  blocks.forEach((b,i)=>{const wrap=el("div","studio-block-wrap");wrap.append(previewBlock(b));const controls=el("div","studio-block-controls");
   [["↑",-1],["↓",1]].forEach(([t,d])=>{const x=el("button","btn btn-light",t);x.type="button";x.disabled=i+d<0||i+d>=blocks.length;x.addEventListener("click",e=>{e.stopPropagation();[blocks[i],blocks[i+d]]=[blocks[i+d],blocks[i]];selectedId=blocks[i+d].id;changed();render();renderProps();});controls.append(x);});
   wrap.append(controls);canvas.append(wrap);
  });
 }
 function field(parent,label,key,value,type="text",onValue){const w=el("label","field");w.append(el("span","",label));let input;
  if(type==="textarea"){input=el("textarea");input.value=value??"";}
  else{input=el("input");input.type=type;input.value=value??"";}
  input.addEventListener("input",()=>{onValue?onValue(input.value):update(key,type==="number"?Number(input.value):input.value);});w.append(input);parent.append(w);return input;
 }
 function update(key,value){const b=blocks.find(x=>x.id===selectedId);if(!b)return;b[key]=value;changed();render();}
 function renderProps(){props.replaceChildren(el("h2","","Propriétés"));const b=blocks.find(x=>x.id===selectedId);if(!b){props.append(el("p","muted","Sélectionnez un élément dans l'aperçu."));return;}
  props.append(el("p","studio-selected-label","Élément : "+b.type));
  if(["title","text","button"].includes(b.type))field(props,"Texte","text",b.text,"textarea");
  if(b.type==="title"){const w=el("label","field");w.append(el("span","","Niveau du titre"));const s=el("select");[["1","Titre principal"],["2","Sous-titre"]].forEach(([v,t])=>{const o=el("option","",t);o.value=v;s.append(o);});s.value=String(b.level||2);s.addEventListener("change",()=>{b.level=Number(s.value);changed();render();});w.append(s);props.append(w);}
  if(b.type==="button")field(props,"Adresse du lien","url",b.url,"url");
  if(b.type==="image"){field(props,"Adresse de l'image (URL)","url",b.url,"url");field(props,"Texte alternatif","alt",b.alt);field(props,"Légende","caption",b.caption,"textarea");const upload=el("label","field");upload.append(el("span","","Déposer une image depuis l'appareil"));const f=el("input");f.type="file";f.accept="image/jpeg,image/png,image/webp";f.addEventListener("change",async()=>{try{const url=await uploadFile(f.files[0]);b.url=url;changed();render();renderProps();}catch(e){setStatus(e.message,"error");}});upload.append(f);props.append(upload);}
  if(b.type==="video"){field(props,"Adresse vidéo (YouTube/Vimeo ou MP4)","url",b.url,"url");field(props,"Titre / légende","caption",b.caption,"text");}
  if(b.type==="gallery"){field(props,"Adresses des images (une URL par ligne)","images",(b.images||[]).join("\n"),"textarea",v=>{b.images=v.split("\n").map(x=>safeUrl(x.trim())).filter(Boolean);changed();render();});const upload=el("label","field");upload.append(el("span","","Déposer plusieurs images"));const f=el("input");f.type="file";f.multiple=true;f.accept="image/jpeg,image/png,image/webp";f.addEventListener("change",async()=>{try{for(const file of f.files)b.images.push(await uploadFile(file));changed();render();renderProps();}catch(e){setStatus(e.message,"error");}});upload.append(f);props.append(upload);}
  if(b.type==="list")field(props,"Un élément par ligne","items",(b.items||[]).join("\n"),"textarea",v=>{b.items=v.split("\n");changed();render();});
  if(b.type==="spacer")field(props,"Hauteur en pixels","height",b.height||32,"number");
  const actions=el("div","studio-property-actions");const dup=el("button","btn btn-light","Dupliquer");dup.type="button";dup.onclick=()=>{const c={...b,id:uid(),images:b.images?[...b.images]:undefined,items:b.items?[...b.items]:undefined};blocks.splice(blocks.findIndex(x=>x.id===b.id)+1,0,c);selectedId=c.id;changed();render();renderProps();};const del=el("button","btn btn-danger-light","Supprimer");del.type="button";del.onclick=()=>{blocks=blocks.filter(x=>x.id!==b.id);selectedId=null;changed();render();renderProps();};actions.append(dup,del);props.append(actions);
 }
 async function uploadFile(file){if(!file)throw Error("Choisissez un fichier.");if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw Error("Format accepté : JPG, PNG ou WebP.");if(file.size>5*1024*1024)throw Error("Fichier limité à 5 Mo.");const path=siteId+"/"+uid()+"-"+file.name.replace(/[^a-zA-Z0-9._-]/g,"_");const {error}=await sb.storage.from("jdnexa-media").upload(path,file,{contentType:file.type,upsert:false});if(error)throw error;return sb.storage.from("jdnexa-media").getPublicUrl(path).data.publicUrl;}
 async function loadPages(){const {data,error}=await sb.from("pages").select("id,titre,slug,content_json,created_at").eq("site_id",siteId).order("created_at",{ascending:true});if(error)throw error;pages=data||[];pageSelect.replaceChildren();pages.forEach(p=>{const o=el("option","",p.titre||p.slug);o.value=p.id;pageSelect.append(o);});if(!pages.length){await createPage("Accueil");return;}await selectPage(pages[0].id);}
 async function selectPage(id){const p=pages.find(x=>x.id===id);if(!p)return;pageId=p.id;titleInput.value=p.titre||"";slugInput.value=p.slug||"";blocks=Array.isArray(p.content_json?.blocks)?p.content_json.blocks:[];selectedId=null;dirty=false;saveBtn.disabled=true;pageSelect.value=id;render();renderProps();setStatus("Page chargée : "+p.titre,"success");}
 async function createPage(name){const titre=name||"Nouvelle page";const slug=titre.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"page";const {data,error}=await sb.from("pages").insert({site_id:siteId,titre,slug,content_json:{blocks:[]}}).select("id,titre,slug,content_json,created_at").single();if(error)throw error;pages.push(data);await selectPage(data.id);const o=el("option","",data.titre);o.value=data.id;pageSelect.append(o);pageSelect.value=data.id;}
 async function savePage(){const titre=titleInput.value.trim()||"Page";const slug=slugInput.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9-]+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"")||"page";const {error}=await sb.from("pages").update({titre,slug,content_json:{blocks}}).eq("id",pageId).eq("site_id",siteId);if(error)throw error;const p=pages.find(x=>x.id===pageId);Object.assign(p,{titre,slug,content_json:{blocks}});pageSelect.options[pageSelect.selectedIndex].text=titre;dirty=false;saveBtn.disabled=true;setStatus("Page enregistrée avec succès.","success");}
 async function saveTheme(){const cfg={...settings};document.querySelectorAll("[data-theme]").forEach(i=>cfg[i.dataset.theme]=i.type==="checkbox"?i.checked:i.value);const {error}=await sb.from("sites").update({settings_json:cfg}).eq("id",siteId);if(error)throw error;settings=cfg;setStatus("Identité visuelle enregistrée.","success");}
 function applyTheme(){document.querySelectorAll("[data-theme]").forEach(i=>{const v=settings[i.dataset.theme];if(v!==undefined){if(i.type==="checkbox")i.checked=!!v;else i.value=v;}});}
 async function loadSite(id){siteId=id;const {data,error}=await sb.from("sites").select("id,nom,settings_json").eq("id",id).maybeSingle();if(error)throw error;if(!data)throw Error("Site introuvable ou accès refusé.");site=data;settings=data.settings_json||{};$("[data-site-name]").textContent="Projet : "+site.nom;applyTheme();await loadPages();}
 async function init(){sb=window.requireSupabase();const {data:{user:u},error}=await sb.auth.getUser();if(error)throw error;if(!u){location.href="login.html";return;}user=u;const r=await sb.from("sites").select("id,nom").order("created_at",{ascending:false});if(r.error)throw r.error;if(!r.data?.length){location.href="dashboard.html";return;}siteSelect.replaceChildren();r.data.forEach(s=>{const o=el("option","",s.nom);o.value=s.id;siteSelect.append(o);});const chosen=siteId&&r.data.some(s=>s.id===siteId)?siteId:r.data[0].id;siteSelect.value=chosen;await loadSite(chosen);}
 document.querySelectorAll("[data-add-block]").forEach(btn=>btn.addEventListener("click",()=>{const b={...templates[btn.dataset.addBlock],id:uid()};blocks.push(b);selectedId=b.id;changed();render();renderProps();}));
 [titleInput,slugInput].forEach(i=>i.addEventListener("input",changed));
 saveBtn.addEventListener("click",()=>savePage().catch(e=>setStatus(e.message,"error")));
 pageSelect.addEventListener("change",async()=>{if(dirty&&!confirm("Abandonner les modifications non enregistrées ?")){pageSelect.value=pageId;return;}await selectPage(pageSelect.value);});
 siteSelect.addEventListener("change",async()=>{if(dirty&&!confirm("Abandonner les modifications non enregistrées ?")){siteSelect.value=siteId;return;}await loadSite(siteSelect.value).catch(e=>setStatus(e.message,"error"));});
 $("[data-add-page]").addEventListener("click",async()=>{const n=prompt("Nom de la nouvelle page :","Nouvelle page");if(n===null||!n.trim())return;try{await createPage(n.trim());setStatus("Nouvelle page créée.","success");}catch(e){setStatus(e.message,"error");}});
 $("[data-rename-page]").addEventListener("click",()=>{const n=prompt("Nouveau titre :",titleInput.value);if(n===null)return;titleInput.value=n;changed();});
 $("[data-delete-page]").addEventListener("click",async()=>{
  if(pages.length<=1){setStatus("Conservez au moins une page sur votre site.","warning");return;}
  if(!confirm("Supprimer définitivement cette page ?"))return;
  const deletedId=pageId;
  const {error}=await sb.from("pages").delete().eq("id",deletedId).eq("site_id",siteId);
  if(error){setStatus(error.message,"error");return;}
  pages=pages.filter(p=>p.id!==deletedId);
  const option=Array.from(pageSelect.options).find(o=>o.value===deletedId);
  if(option)option.remove();
  await selectPage(pages[0].id);
  setStatus("Page supprimée.","success");
 });
 $("[data-save-theme]").addEventListener("click",()=>saveTheme().catch(e=>setStatus(e.message,"error")));
 $("[data-logout]").addEventListener("click",async()=>{await sb.auth.signOut();location.href="index.html";});
 window.addEventListener("beforeunload",e=>{if(dirty){e.preventDefault();e.returnValue="";}});
 init().catch(e=>setStatus(e.message||"Impossible de charger le Studio.","error"));
})();