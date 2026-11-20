/* Catalogue complet des modèles JDNEXA. Chaque entrée ouvre un atelier personnalisable. */
(()=>{
 const groups=[
 ["Présentation","Site vitrine|Portfolio|Site CV / personnel|Landing page (page unique)|Site one-page (défilement unique)|Site événementiel (mariage, conférence, festival)|Site de recrutement / carrière|Site de restaurant / menu en ligne|Galerie d'art / exposition virtuelle|Site de lancement (coming soon)"],
 ["Commerce","E-commerce (boutique en ligne)|Marketplace (plusieurs vendeurs)|Dropshipping|Petites annonces|Comparateur de prix|Site d'enchères|Site d'affiliation|Crowdfunding (financement participatif)|Site de location (voitures, matériel, logements)|Vente d'abonnements (box)|Produits numériques (ebooks, templates, logiciels)|Revente / seconde main|Cartes cadeaux et coupons"],
 ["Contenu et information","Blog|Média / actualités|Magazine en ligne|Wiki / encyclopédie|Annuaire / répertoire|Documentation|Avis / critiques|Podcast / site audio|Newsletter en ligne|Recettes de cuisine|Site météo|Statistiques / données ouvertes|FAQ / centre d'aide|Traduction / dictionnaire"],
 ["Communauté et relations","Réseau social|Site de rencontre|Forum|Messagerie / chat|Association ou communauté|Covoiturage|Mise en relation freelance|Généalogie|Pétitions / mobilisation|Bénévolat"],
 ["Services","Réservation (hôtels, restaurants, billets)|SaaS / application web|Banque et finance en ligne|Santé / rendez-vous médicaux|Immobilier|Voyage et transport|Livraison de repas|Devis / comparateur d'assurances|Gestion de projet / collaboration|Stockage cloud|Emploi (offres et candidatures)|Juridique / démarches administratives|Suivi de colis|Rendez-vous beauté / bien-être"],
 ["Éducation","E-learning / formation en ligne|Site scolaire ou universitaire|Tutoriels|Site de langues|Bibliothèque numérique|Recherche scientifique / publications"],
 ["Divertissement","Streaming (vidéo, musique)|Jeux en ligne|Paris sportifs|Partage de médias (photos, vidéos)|Billetterie|Fan / communauté de passionnés|Blagues / mèmes|Quiz / sondages"],
 ["Institutionnel","Gouvernemental / administration|ONG / association caritative|Entreprise (corporate)|Intranet / extranet|Religieux / spirituel|Sportif / club et fédération"],
 ["Technique et autres","Développement (code, API)|Test / bac à sable (staging)|Site miroir / archive"]
 ];
 const existing={
 "site-vitrine":"agency","portfolio":"portfolio","site-cv-personnel":"portfolio","landing-page-page-unique":"saas","site-one-page-defilement-unique":"agency","site-evenementiel-mariage-conference-festival":"events","site-de-recrutement-carriere":"education","site-de-restaurant-menu-en-ligne":"restaurant","galerie-d-art-exposition-virtuelle":"portfolio","site-de-lancement-coming-soon":"saas",
 "e-commerce-boutique-en-ligne":"fashion","marketplace-plusieurs-vendeurs":"fashion","dropshipping":"fashion","petites-annonces":"community","comparateur-de-prix":"finance","site-d-encheres":"fashion","site-d-affiliation":"agency","crowdfunding-financement-participatif":"nonprofit","site-de-location-voitures-materiel-logements":"property","vente-d-abonnements-box":"saas","produits-numeriques-ebooks-templates-logiciels":"saas","revente-seconde-main":"fashion","cartes-cadeaux-et-coupons":"fashion",
 "blog":"magazine","media-actualites":"magazine","magazine-en-ligne":"magazine","wiki-encyclopedie":"education","annuaire-repertoire":"community","documentation":"saas","avis-critiques":"magazine","podcast-site-audio":"media","newsletter-en-ligne":"magazine","recettes-de-cuisine":"restaurant","site-meteo":"saas","statistiques-donnees-ouvertes":"finance","faq-centre-d-aide":"saas","traduction-dictionnaire":"education",
 "reseau-social":"community","site-de-rencontre":"dating","forum":"community","messagerie-chat":"community","association-ou-communaute":"nonprofit","covoiturage":"travel","mise-en-relation-freelance":"agency","genealogie":"community","petitions-mobilisation":"nonprofit","benevolat":"nonprofit",
 "reservation-hotels-restaurants-billets":"travel","saas-application-web":"saas","banque-et-finance-en-ligne":"finance","sante-rendez-vous-medicaux":"health","immobilier":"property","voyage-et-transport":"travel","livraison-de-repas":"restaurant","devis-comparateur-d-assurances":"finance","gestion-de-projet-collaboration":"saas","stockage-cloud":"saas","emploi-offres-et-candidatures":"education","juridique-demarches-administratives":"agency","suivi-de-colis":"travel","rendez-vous-beaute-bien-etre":"health",
 "e-learning-formation-en-ligne":"education","site-scolaire-ou-universitaire":"education","tutoriels":"education","site-de-langues":"education","bibliotheque-numerique":"education","recherche-scientifique-publications":"education",
 "streaming-video-musique":"media","jeux-en-ligne":"gaming","paris-sportifs":"gaming","partage-de-medias-photos-videos":"media","billetterie":"events","fan-communaute-de-passionnes":"community","blagues-memes":"media","quiz-sondages":"education",
 "gouvernemental-administration":"agency","ong-association-caritative":"nonprofit","entreprise-corporate":"agency","intranet-extranet":"saas","religieux-spirituel":"nonprofit","sportif-club-federation":"events",
 "developpement-code-api":"saas","test-bac-a-sable-staging":"saas","site-miroir-archive":"magazine"
 };
 const typeMap={fashion:"boutique",restaurant:"livraison",property:"immobilier",travel:"voyage",agency:"vitrine",magazine:"blog",portfolio:"portfolio",community:"communaute",dating:"rencontre",media:"streaming",gaming:"jeux",saas:"saas",education:"education",finance:"finance",health:"sante",events:"evenementiel",nonprofit:"association"};
 const visuals={
 fashion:["https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85","#171717","moderne"],
 restaurant:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85","#9a542f","elegant"],
 property:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85","#183b56","minimal"],
 travel:["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85","#087e8b","elegant"],
 agency:["https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85","#172b4d","minimal"],
 magazine:["https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=85","#a34b2d","editorial"],
 portfolio:["https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1400&q=85","#6347b5","audacieux"],
 community:["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85","#356b9a","moderne"],
 dating:["https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1400&q=85","#c24d79","elegant"],
 media:["https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=85","#24243a","audacieux"],
 gaming:["https://images.unsplash.com/photo-1542751371-adc38448a05c?auto=format&fit=crop&w=1400&q=85","#6437d8","audacieux"],
 saas:["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85","#1458d4","moderne"],
 education:["https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85","#147b68","moderne"],
 finance:["https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85","#126b59","minimal"],
 health:["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=85","#168b88","minimal"],
 events:["https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=85","#8a4dd1","audacieux"],
 nonprofit:["https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1400&q=85","#26805d","moderne"]
 };
 const slug=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
 const photoSet={
 fashion:["photo-1490481651871-ab68de25d43d","photo-1542291026-7eec264c27ff","photo-1529139574466-a303027c1d8"],
 restaurant:["photo-1515003197210-e0cd7184f8b5","photo-1414235077428-338989a2e8c0","photo-1559339352-11d035aa65de"],
 property:["photo-1600607687939-ce8a6c25118c","photo-1600566753086-00f18fb6b3ea","photo-1600607687920-4e2a09cf159d"],
 travel:["photo-1507525428034-b723cf961d3e","photo-1464822759023-fed622ff2c3b","photo-1516483638261-f4dbaf036963"],
 agency:["photo-1497366811353-6870744d04b2","photo-1521737711867-e3b97375f902","photo-1552664730-d307ca884978"]
 };
 const copy={
 fashion:["Découvrez une sélection soignée, des nouveautés et des collections pensées pour vous.","Parcourez les collections, découvrez les produits et contactez notre équipe."],
 restaurant:["Une cuisine généreuse, une carte claire et une expérience accueillante à chaque visite.","Découvrez nos spécialités, consultez le menu et préparez votre prochaine visite."],
 property:["Des biens sélectionnés, des informations précises et un accompagnement à chaque étape.","Explorez les annonces, comparez les biens et contactez nos conseillers."],
 travel:["Des destinations inspirantes, des séjours adaptés et des conseils pour voyager sereinement.","Explorez les destinations et préparez votre prochaine expérience."],
 agency:["Une présence digitale claire, une identité forte et des informations accessibles.","Découvrez nos services, nos réalisations et notre équipe."],
 magazine:["Des contenus utiles, des actualités et des histoires à découvrir régulièrement.","Parcourez les dernières publications et retrouvez les sujets qui vous intéressent."],
 portfolio:["Un espace pour présenter les projets, les créations et les réalisations.","Explorez une sélection de travaux et découvrez notre univers créatif."],
 community:["Un espace pour échanger, partager et faire grandir une communauté.","Découvrez les activités, les membres et les possibilités de participation."],
 dating:["Un espace de rencontres convivial, pensé pour favoriser les échanges respectueux.","Découvrez la plateforme et créez votre profil pour commencer."],
 media:["Découvrez des vidéos, des créations audio et des contenus à regarder ou écouter.","Explorez les nouveautés et retrouvez vos contenus favoris."],
 gaming:["Actualités, tournois et univers gaming réunis dans un espace dynamique.","Découvrez les jeux, les compétitions et les dernières annonces."],
 saas:["Des outils simples et efficaces pour organiser votre activité et gagner du temps.","Découvrez les fonctionnalités, les offres et l'espace de connexion."],
 education:["Apprenez, progressez et accédez à des ressources conçues pour vous accompagner.","Explorez les cours, les ressources et les parcours de formation."],
 finance:["Des informations claires pour comprendre les services et suivre vos opérations.","Découvrez les services, les ressources et les moyens de contact."],
 health:["Des informations fiables et un parcours simple pour accéder aux services de santé.","Découvrez les prestations et les informations pratiques."],
 events:["Toutes les informations pour découvrir l'événement et préparer votre participation.","Consultez le programme, les intervenants et les informations pratiques."],
 nonprofit:["Agissons ensemble autour d'une mission utile et d'initiatives concrètes.","Découvrez nos actions, nos projets et les façons de nous soutenir."]
 };
 const cta={fashion:"Découvrir la collection",restaurant:"Voir le menu",property:"Voir les annonces",travel:"Explorer les destinations",agency:"Découvrir nos services",magazine:"Lire les publications",portfolio:"Voir les réalisations",community:"Rejoindre la communauté",dating:"Créer un profil",media:"Explorer les contenus",gaming:"Voir les tournois",saas:"Découvrir la plateforme",education:"Découvrir les cours",finance:"Voir nos services",health:"Prendre rendez-vous",events:"Voir le programme",nonprofit:"Soutenir notre mission"};
 const entries=[];
 groups.forEach(([group,labels])=>labels.split("|").forEach(label=>{
  const key=slug(label),base=existing[key]||"agency",visual=visuals[base],text=copy[base]||copy.agency,photos=photoSet[base]||photoSet.agency;
  const current=window.JDN_TEMPLATES?.[base];
  const preset=current?JSON.parse(JSON.stringify(current)):{
   name:label,type:typeMap[base]||"vitrine",style:visual[2],primary:visual[1],bg:"#f7f9fc",
   blocks:[
    {type:"title",level:1,text:label+" : votre espace en ligne"},
    {type:"text",text:text[0]},
    {type:"image",url:visual[0],alt:label,caption:label},
    {type:"button",text:cta[base]||"Découvrir",url:"#contact"},
    {type:"title",level:2,text:"Découvrez notre univers"},
    {type:"gallery",images:photos.map(id=>"https://images.unsplash.com/"+id+"?auto=format&fit=crop&w=900&q=85")},
    {type:"title",level:2,text:"Nos rubriques"},
    {type:"list",items:text[1].split(", ")},
    {type:"article",title:"À découvrir",excerpt:text[0],image_url:visual[0],link_url:"#contact"},
    {type:"button",text:"Nous contacter",url:"#contact"}
   ]
  };
  preset.name=label;preset.category=group;preset.type=typeMap[base]||preset.type||"vitrine";preset.image=visual[0];preset.primary=preset.primary||visual[1];preset.style=preset.style||visual[2];
  window.JDN_TEMPLATES[key]=preset;
  entries.push({key,name:label,group,type:preset.type,image:visual[0]});
 }));
 window.JDN_CATALOGUE=entries;
})();
(function(){
 const grid=document.querySelector("[data-template-grid]"),search=document.querySelector("[data-template-search]"),category=document.querySelector("[data-template-category]"),count=document.querySelector("[data-template-count]"),empty=document.querySelector("[data-template-empty]");
 if(!grid||!window.JDN_CATALOGUE)return;
 const groups=[...new Set(window.JDN_CATALOGUE.map(x=>x.group))];
 groups.forEach(g=>{const o=document.createElement("option");o.value=g;o.textContent=g;category.append(o);});
 function draw(){const q=(search.value||"").toLocaleLowerCase("fr"),g=category.value;const list=window.JDN_CATALOGUE.filter(x=>(!g||x.group===g)&&(!q||(x.name+" "+x.group).toLocaleLowerCase("fr").includes(q)));grid.replaceChildren();list.forEach(x=>{const b=document.createElement("button");b.type="button";b.className="template-card";b.dataset.template=x.key;const thumb=document.createElement("span");thumb.className="template-thumb";const im=document.createElement("img");im.src=x.image;im.alt="";im.loading="lazy";const tag=document.createElement("i");tag.textContent=x.group;thumb.append(im,tag);const title=document.createElement("strong");title.textContent=x.name;const sub=document.createElement("small");sub.textContent=x.group;b.append(thumb,title,sub);b.addEventListener("click",()=>{location.href="create.html?template="+encodeURIComponent(x.key);});grid.append(b);});count.textContent=list.length+" modèles";empty.hidden=!!list.length;}
 search.addEventListener("input",draw);category.addEventListener("change",draw);draw();
})();