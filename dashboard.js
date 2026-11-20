(async()=>{
 const $=s=>document.querySelector(s),list=$("[data-sites]"),msg=$("[data-dashboard-message]"),form=$("[data-create-site]");
 let sb,user,sites=[],plan="FREE",siteLimit=1;
 const types={
  boutique:"Boutique en ligne / E-commerce",marketplace:"Marketplace",rencontre:"Rencontre",reseau_social:"Réseau social",blog:"Blog / Magazine / Actualités",streaming:"Streaming vidéo, musique et podcasts",jeux:"Jeux en ligne / Jeux vidéo",vitrine:"Vitrine / Site d'entreprise",portfolio:"Portfolio",emploi:"Emploi / Recrutement",education:"Éducation / E-learning",forum:"Forum / Communauté",annonces:"Petites annonces",voyage:"Voyage / Réservation",immobilier:"Immobilier",finance:"Banque / Finance / Paiement",sante:"Santé / Médical",administration:"Administration / Services publics",comparateur:"Comparateur de prix",wiki:"Wiki / Encyclopédie",recherche:"Moteur de recherche",messagerie:"Messagerie / Webmail",saas:"SaaS / Outils en ligne",crowdfunding:"Crowdfunding / Dons",association:"Association / ONG",livraison:"Livraison / Restauration",cloud:"Hébergement de fichiers / Cloud",evenementiel:"Événementiel / Billetterie",landing:"Landing page"
 };
 const icons={boutique:"▣",marketplace:"▦",rencontre:"♡",reseau_social:"◎",blog:"▤",streaming:"▶",jeux:"♟",vitrine:"▧",portfolio:"✦",emploi:"▣",education:"⌘",forum:"☷",annonces:"▤",voyage:"✈",immobilier:"⌂",finance:"◇",sante:"✚",administration:"▥",comparateur:"⇄",wiki:"W",recherche:"⌕",messagerie:"✉",saas:"⌘",crowdfunding:"♡",association:"♧",livraison:"↗",cloud:"☁",evenementiel:"▣",landing:"↗"};
 const slugify=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70);
 const templatePresets={
  "fashion": {
    "name": "Mode & Boutique",
    "type": "boutique",
    "style": "moderne",
    "primary": "#171717",
    "bg": "#f7f5f2",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Le style qui vous ressemble."
      },
      {
        "type": "text",
        "text": "Découvrez les nouvelles collections, les pièces incontournables et les essentiels de saison."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85",
        "alt": "Mode & Boutique — photographie principale",
        "caption": "Mode & Boutique"
      },
      {
        "type": "button",
        "text": "Découvrir la collection",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Nouveautés",
          "Vêtements",
          "Chaussures",
          "Accessoires"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "restaurant": {
    "name": "Restaurant",
    "type": "livraison",
    "style": "elegant",
    "primary": "#9a542f",
    "bg": "#fffaf4",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Une expérience à savourer."
      },
      {
        "type": "text",
        "text": "Une cuisine généreuse, des produits frais et une ambiance chaleureuse pour chaque moment."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85",
        "alt": "Restaurant — photographie principale",
        "caption": "Restaurant"
      },
      {
        "type": "button",
        "text": "Réserver une table",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Notre carte",
          "Menu du jour",
          "Événements privés",
          "Contact"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "property": {
    "name": "Immobilier Premium",
    "type": "immobilier",
    "style": "minimal",
    "primary": "#183b56",
    "bg": "#f4f7fa",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Trouvez le lieu de vos rêves."
      },
      {
        "type": "text",
        "text": "Découvrez des propriétés sélectionnées avec soin, des appartements modernes aux villas d'exception."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85",
        "alt": "Immobilier Premium — photographie principale",
        "caption": "Immobilier Premium"
      },
      {
        "type": "button",
        "text": "Voir les propriétés",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "À vendre",
          "À louer",
          "Prestige",
          "Estimation"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "travel": {
    "name": "Voyage & Évasion",
    "type": "voyage",
    "style": "elegant",
    "primary": "#087e8b",
    "bg": "#f2fbfc",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Le monde vous attend."
      },
      {
        "type": "text",
        "text": "Préparez votre prochaine aventure avec des destinations inspirantes, des séjours uniques et des conseils pratiques."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",
        "alt": "Voyage & Évasion — photographie principale",
        "caption": "Voyage & Évasion"
      },
      {
        "type": "button",
        "text": "Explorer les destinations",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Destinations",
          "Circuits",
          "Séjours",
          "Conseils"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "agency": {
    "name": "Agence Digitale",
    "type": "vitrine",
    "style": "minimal",
    "primary": "#172b4d",
    "bg": "#f7f9fc",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Transformons vos idées en impact."
      },
      {
        "type": "text",
        "text": "Nous créons des marques, des expériences et des solutions digitales qui font avancer votre activité."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
        "alt": "Agence Digitale — photographie principale",
        "caption": "Agence Digitale"
      },
      {
        "type": "button",
        "text": "Démarrer un projet",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Stratégie",
          "Identité visuelle",
          "Développement web",
          "Marketing"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "magazine": {
    "name": "Magazine & Actualités",
    "type": "blog",
    "style": "editorial",
    "primary": "#a34b2d",
    "bg": "#fbf7f1",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Les histoires qui comptent."
      },
      {
        "type": "text",
        "text": "Actualités, analyses, reportages et idées pour comprendre le monde et nourrir votre curiosité."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=85",
        "alt": "Magazine & Actualités — photographie principale",
        "caption": "Magazine & Actualités"
      },
      {
        "type": "button",
        "text": "Lire les articles",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "À la une",
          "Société",
          "Culture",
          "Technologie"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "portfolio": {
    "name": "Portfolio Créatif",
    "type": "portfolio",
    "style": "elegant",
    "primary": "#7048c8",
    "bg": "#f8f6fc",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Laissez parler votre travail."
      },
      {
        "type": "text",
        "text": "Un portfolio élégant pour présenter vos projets, votre univers créatif et vos collaborations."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1400&q=85",
        "alt": "Portfolio Créatif — photographie principale",
        "caption": "Portfolio Créatif"
      },
      {
        "type": "button",
        "text": "Voir mes réalisations",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Projets",
          "À propos",
          "Services",
          "Contact"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "community": {
    "name": "Réseau Social",
    "type": "reseau_social",
    "style": "moderne",
    "primary": "#087f75",
    "bg": "#f1faf8",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Connectez-vous à vos passions."
      },
      {
        "type": "text",
        "text": "Un espace vivant pour partager vos idées, découvrir des communautés et échanger avec des personnes inspirantes."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85",
        "alt": "Réseau Social — photographie principale",
        "caption": "Réseau Social"
      },
      {
        "type": "button",
        "text": "Rejoindre la communauté",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Fil d'actualité",
          "Groupes",
          "Événements",
          "Membres"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "dating": {
    "name": "Rencontres Élégance",
    "type": "rencontre",
    "style": "elegant",
    "primary": "#a63c68",
    "bg": "#fff7fa",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Les belles histoires commencent ici."
      },
      {
        "type": "text",
        "text": "Faites de nouvelles rencontres dans un espace accueillant, respectueux et pensé pour créer de vraies connexions."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1400&q=85",
        "alt": "Rencontres Élégance — photographie principale",
        "caption": "Rencontres Élégance"
      },
      {
        "type": "button",
        "text": "Créer mon profil",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Profils",
          "Centres d'intérêt",
          "Événements",
          "Sécurité"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "media": {
    "name": "Plateforme Streaming",
    "type": "streaming",
    "style": "audacieux",
    "primary": "#e34d32",
    "bg": "#111827",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Play. Listen. Discover."
      },
      {
        "type": "text",
        "text": "Retrouvez films, séries, vidéos, podcasts et créations originales dans un univers immersif."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=85",
        "alt": "Plateforme Streaming — photographie principale",
        "caption": "Plateforme Streaming"
      },
      {
        "type": "button",
        "text": "Explorer les contenus",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Films & séries",
          "Podcasts",
          "Musique",
          "Créateurs"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "gaming": {
    "name": "Gaming & Esport",
    "type": "jeux",
    "style": "audacieux",
    "primary": "#8b5cf6",
    "bg": "#10111b",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Entrez dans l'arène."
      },
      {
        "type": "text",
        "text": "Actualités gaming, compétitions, équipes et communauté : toute votre passion réunie au même endroit."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=85",
        "alt": "Gaming & Esport — photographie principale",
        "caption": "Gaming & Esport"
      },
      {
        "type": "button",
        "text": "Rejoindre le jeu",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Actualités",
          "Tournois",
          "Équipes",
          "Classements"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "saas": {
    "name": "Application SaaS",
    "type": "saas",
    "style": "minimal",
    "primary": "#2563eb",
    "bg": "#f5f8ff",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Votre activité, en toute simplicité."
      },
      {
        "type": "text",
        "text": "Une plateforme claire pour organiser vos opérations, suivre vos performances et travailler efficacement."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85",
        "alt": "Application SaaS — photographie principale",
        "caption": "Application SaaS"
      },
      {
        "type": "button",
        "text": "Commencer gratuitement",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Tableau de bord",
          "Automatisations",
          "Rapports",
          "Intégrations"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "education": {
    "name": "Éducation & E-learning",
    "type": "education",
    "style": "moderne",
    "primary": "#176b5b",
    "bg": "#f2faf7",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Apprenez à votre rythme."
      },
      {
        "type": "text",
        "text": "Des cours accessibles, des ressources utiles et un parcours pensé pour développer vos compétences."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85",
        "alt": "Éducation & E-learning — photographie principale",
        "caption": "Éducation & E-learning"
      },
      {
        "type": "button",
        "text": "Découvrir les formations",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Formations",
          "Cours populaires",
          "Enseignants",
          "Certificats"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "finance": {
    "name": "Finance & Fintech",
    "type": "finance",
    "style": "minimal",
    "primary": "#123c69",
    "bg": "#f3f7fb",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Gardez le contrôle de vos finances."
      },
      {
        "type": "text",
        "text": "Une expérience claire pour suivre vos opérations, gérer vos services et comprendre vos données financières."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85",
        "alt": "Finance & Fintech — photographie principale",
        "caption": "Finance & Fintech"
      },
      {
        "type": "button",
        "text": "Découvrir les services",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Comptes",
          "Paiements",
          "Cartes",
          "Assistance"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "health": {
    "name": "Santé & Bien-être",
    "type": "sante",
    "style": "minimal",
    "primary": "#168b83",
    "bg": "#f4fbfa",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Votre bien-être, notre priorité."
      },
      {
        "type": "text",
        "text": "Découvrez nos services, nos professionnels et des conseils pour prendre soin de vous au quotidien."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=85",
        "alt": "Santé & Bien-être — photographie principale",
        "caption": "Santé & Bien-être"
      },
      {
        "type": "button",
        "text": "Prendre rendez-vous",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Spécialités",
          "Praticiens",
          "Conseils santé",
          "Contact"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "events": {
    "name": "Événements & Billetterie",
    "type": "evenementiel",
    "style": "audacieux",
    "primary": "#c04470",
    "bg": "#fff6f9",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Vivez des moments inoubliables."
      },
      {
        "type": "text",
        "text": "Concerts, conférences, festivals et expériences : trouvez votre prochain rendez-vous."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=85",
        "alt": "Événements & Billetterie — photographie principale",
        "caption": "Événements & Billetterie"
      },
      {
        "type": "button",
        "text": "Voir les événements",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "À venir",
          "Concerts",
          "Conférences",
          "Billetterie"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  },
  "nonprofit": {
    "name": "Association & ONG",
    "type": "association",
    "style": "moderne",
    "primary": "#28734f",
    "bg": "#f4faf5",
    "blocks": [
      {
        "type": "title",
        "level": 1,
        "text": "Ensemble, faisons la différence."
      },
      {
        "type": "text",
        "text": "Mobilisons les énergies autour de projets solidaires, d'actions concrètes et d'un avenir meilleur."
      },
      {
        "type": "image",
        "url": "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1400&q=85",
        "alt": "Association & ONG — photographie principale",
        "caption": "Association & ONG"
      },
      {
        "type": "button",
        "text": "Soutenir notre action",
        "url": "#contact"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Découvrez notre univers"
      },
      {
        "type": "gallery",
        "images": [
          "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        "type": "title",
        "level": 2,
        "text": "Explorez nos espaces"
      },
      {
        "type": "list",
        "items": [
          "Notre mission",
          "Nos projets",
          "Faire un don",
          "Bénévolat"
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "title",
        "level": 2,
        "text": "Une expérience pensée pour vous"
      },
      {
        "type": "text",
        "text": "Un design soigné, une navigation simple et un contenu que vous pourrez adapter librement depuis le Studio JDNEXA."
      },
      {
        "type": "button",
        "text": "Nous contacter",
        "url": "#contact"
      }
    ]
  }
};
 let selectedTemplate="fashion";
 let draftBlocks=templatePresets.fashion.blocks.map((b,i)=>({...b,id:"draft-"+i}));

 let selectedDraft=null;
 function renderDraft(){
  const screen=$("[data-live-preview]");if(!screen)return;
  screen.replaceChildren();
  const nav=document.createElement("div");nav.className="preview-site-nav";
  const brand=document.createElement("b");brand.dataset.previewBrand="";brand.textContent=form.nom.value.trim()||"Mon projet";
  const links=document.createElement("span");links.textContent="Accueil　 Services　 Contact";nav.append(brand,links);screen.append(nav);
  const hero=document.createElement("div");hero.className="preview-site-hero";
  const cat=document.createElement("small");cat.dataset.previewCategory="";cat.textContent=form.type_site.selectedOptions[0]?.textContent||"VOTRE PROJET";hero.append(cat);
  const title=document.createElement("h2");title.textContent=form.nom.value.trim()||"Mon nouveau site";hero.append(title);
  const desc=document.createElement("p");desc.textContent=" ";hero.append(desc);
  screen.append(hero);
  draftBlocks.forEach((b,i)=>{
   const wrap=document.createElement("div");wrap.className="preview-draft-block"+(selectedDraft===b.id?" selected":"");wrap.dataset.draftId=b.id;
   let node;
   if(b.type==="title"){node=document.createElement(b.level===1?"h2":"h3");node.textContent=b.text;node.contentEditable="true";}
   else if(b.type==="text"){node=document.createElement("p");node.textContent=b.text;node.contentEditable="true";}
   else if(b.type==="button"){node=document.createElement("a");node.className="preview-site-button";node.textContent=b.text;node.href="javascript:void(0)";node.contentEditable="true";}
   else if(b.type==="image"){node=document.createElement("div");if(b.url){const im=document.createElement("img");im.src=b.url;im.alt="Image du site";node.append(im);}else node.textContent="Image à ajouter";}
   else if(b.type==="list"){node=document.createElement("ul");(b.items||[]).forEach(x=>{const li=document.createElement("li");li.textContent=x;node.append(li);});}
   else if(b.type==="gallery"){node=document.createElement("div");node.className="preview-image-gallery";(b.images||[]).forEach((url,j)=>{const im=document.createElement("img");im.src=url;im.alt="Photo "+(j+1);im.loading="lazy";node.append(im);});}
   else {node=document.createElement("hr");}
   node.addEventListener("input",()=>{if(["title","text","button"].includes(b.type)){b.text=node.textContent;selectedDraft=b.id;}});
   if(b.type==="button")node.addEventListener("dblclick",e=>{e.preventDefault();const value=prompt("Adresse du bouton :",b.url||"#");if(value!==null){b.url=value.trim();selectedDraft=b.id;renderDraft();}});
   if(b.type==="image")node.addEventListener("dblclick",()=>{const value=prompt("Nouvelle adresse HTTPS de l'image :",b.url||"");if(value){try{const u=new URL(value);if(!["https:","http:"].includes(u.protocol))throw Error();b.url=u.href;renderDraft();}catch{alert("Adresse invalide.");}}});
   wrap.append(node);wrap.addEventListener("click",e=>{if(e.target.isContentEditable)return;selectedDraft=b.id;renderDraft();});
   screen.append(wrap);
  });
  if(window.Sortable){if(screen._jdnSortable)screen._jdnSortable.destroy();screen._jdnSortable=new Sortable(screen,{animation:160,draggable:".preview-draft-block",onEnd:()=>{const ids=[...screen.querySelectorAll(".preview-draft-block")].map(x=>x.dataset.draftId);draftBlocks=ids.map(id=>draftBlocks.find(b=>b.id===id)).filter(Boolean);renderDraft();}});}
  const cards=document.createElement("div");cards.className="preview-site-cards";for(let i=0;i<3;i++){const c=document.createElement("div");const b=document.createElement("b"),a=document.createElement("i"),d=document.createElement("i");c.append(b,a,d);cards.append(c);}screen.append(cards);
  const foot=document.createElement("div");foot.className="preview-site-footer";foot.textContent="© "+(form.nom.value.trim()||"Mon projet")+" — Tous droits réservés";screen.append(foot);
  const primary=form.primary_color.value||"#1458d4",background=form.background_color.value||"#f6f8fc";
  screen.style.setProperty("--preview-primary",primary);screen.style.setProperty("--preview-background",background);screen.dataset.design=form.design_style.value||"moderne";screen.dataset.template=selectedTemplate;
  const address=$("[data-preview-address]");if(address)address.textContent=(slugify(form.slug.value)||"votre-site")+".jdnexa";
  const label=$("[data-preview-selection]");if(label){const b=draftBlocks.find(x=>x.id===selectedDraft);label.textContent=b?"Élément sélectionné : "+b.type:"Sélectionnez un élément pour le modifier";}
  const up=$("[data-preview-up]"),down=$("[data-preview-down]"),del=$("[data-preview-delete]");const idx=draftBlocks.findIndex(x=>x.id===selectedDraft);
  if(up)up.disabled=idx<=0;if(down)down.disabled=idx<0||idx>=draftBlocks.length-1;if(del)del.disabled=idx<0;
 }
 function updateLivePreview(){renderDraft();}
 function addDraftBlock(type){
  const id="draft-"+Date.now()+"-"+Math.random().toString(36).slice(2,7);
  const defaults={title:{type,text:"Nouveau titre",level:2},text:{type,text:"Écrivez votre texte ici."},button:{type,text:"En savoir plus",url:"#"},image:{type,url:""},list:{type,items:["Premier élément","Deuxième élément"]},divider:{type}};
  const b=defaults[type];if(!b)return;
  if(type==="image"){const url=prompt("Collez l'adresse HTTPS de votre image :");if(!url)return;try{const u=new URL(url);if(!["https:","http:"].includes(u.protocol))throw Error();b.url=u.href;}catch{alert("Adresse d'image invalide.");return;}}
  b.id=id;draftBlocks.push(b);selectedDraft=id;renderDraft();
 }
 const say=(el,t,ok=false)=>{el.textContent=t;el.className=ok?"success":"error";};
 function siteCard(site){
  const card=document.createElement("article");card.className="site-card";
  const top=document.createElement("div");top.className="site-card-top";
  const icon=document.createElement("div");icon.className="site-type-icon";icon.textContent=icons[site.type_site]||"◇";
  const meta=document.createElement("div");meta.className="site-card-meta";
  const title=document.createElement("h3");title.textContent=site.nom;
  const type=document.createElement("p");type.textContent=types[site.type_site]||"Site personnalisé";
  meta.append(title,type);top.append(icon,meta);
  const status=document.createElement("span");status.className="site-status "+(site.is_published?"published":"private");status.textContent=site.is_published?"Publié":"Brouillon";top.append(status);
  const address=document.createElement("p");address.className="site-card-address";address.textContent=site.public_slug?"Adresse publique : "+site.public_slug:"Identifiant : "+site.slug;
  const actions=document.createElement("div");actions.className="site-card-actions";
  const link=(label,url,primary=false)=>{const a=document.createElement("a");a.className="btn "+(primary?"btn-primary":"btn-light");a.href=url;a.textContent=label;return a;};
  actions.append(link("Ouvrir le studio","studio.html?site="+encodeURIComponent(site.id),true),link("Articles et contenus","collections.html?site="+encodeURIComponent(site.id)),link("Paramètres","settings.html?site="+encodeURIComponent(site.id)));
  if(site.is_published&&site.public_slug)actions.append(link("Voir le site","site.html?slug="+encodeURIComponent(site.public_slug)));
  const edit=document.createElement("button");edit.className="btn btn-light";edit.type="button";edit.textContent="Modifier";edit.addEventListener("click",()=>editSite(site));
  const del=document.createElement("button");del.className="btn btn-danger-light";del.type="button";del.textContent="Supprimer";del.addEventListener("click",()=>deleteSite(site));
  actions.append(edit,del);card.append(top,address,actions);return card;
 }
 async function editSite(site){
  const nom=prompt("Nouveau nom du site :",site.nom);if(nom===null)return;
  const slug=prompt("Identifiant interne (lettres, chiffres et tirets) :",site.slug);if(slug===null)return;
  const clean=slugify(slug);if(!nom.trim()||clean.length<2){say(msg,"Nom ou identifiant invalide.");return;}
  const {error}=await sb.from("sites").update({nom:nom.trim(),slug:clean}).eq("id",site.id);
  if(error){say(msg,error.message);return;}say(msg,"Site modifié.",true);await load();
 }
 async function deleteSite(site){
  if(!confirm("Supprimer définitivement « "+site.nom+" » ? Ses pages, contenus, fichiers et commandes associés seront également supprimés. Cette action est irréversible."))return;
  const {error}=await sb.from("sites").delete().eq("id",site.id);
  if(error){say(msg,error.message);return;}say(msg,"Site et données associées supprimés.",true);await load();
 }
 async function load(){
  const result=await sb.from("sites").select("id,nom,slug,type_site,settings_json,public_slug,is_published,created_at").order("created_at",{ascending:false});
  if(result.error)throw result.error;sites=result.data||[];
  $("[data-site-count]").textContent=sites.length;$("[data-site-usage]").textContent=sites.length+" / "+siteLimit+" site"+(siteLimit>1?"s":"");
  list.replaceChildren();if(!sites.length){const e=document.createElement("div");e.className="empty";e.textContent="Vous n'avez pas encore créé de site. Choisissez un type de projet et créez votre premier espace.";list.append(e);}else sites.forEach(s=>list.append(siteCard(s)));
  const ids=sites.map(s=>s.id);let count=0;if(ids.length){const r=await sb.from("collections_donnees").select("id",{count:"exact",head:true}).in("site_id",ids);if(!r.error)count=r.count||0;}
  $("[data-content-count]").textContent=count;
 }
 try{
  sb=window.requireSupabase();const auth=await sb.auth.getUser();if(auth.error)throw auth.error;user=auth.data.user;if(!user){location.href="login.html";return;}
  $("[data-user-email]").textContent=user.email||"";
  const sub=await sb.from("abonnements").select("formule,statut,expiration").eq("owner_id",user.id).maybeSingle();
  if(!sub.error&&sub.data){plan=sub.data.formule;siteLimit=plan==="BUSINESS"?5:1;$("[data-plan-name]").textContent=plan;$("[data-plan-limit]").textContent=sub.data.statut==="active"?"Jusqu'à "+siteLimit+" site"+(siteLimit>1?"s":""):"Abonnement à renouveler";}
  await load();
 }catch(e){say(msg,e.message||"Impossible de charger votre espace.");}
 ["nom","type_site","design_style","primary_color","background_color"].forEach(name=>form.elements[name]?.addEventListener("input",updateLivePreview));
 ["type_site","design_style"].forEach(name=>form.elements[name]?.addEventListener("change",updateLivePreview));
 updateLivePreview();
 document.querySelectorAll("[data-template]").forEach(card=>card.addEventListener("click",()=>{const key=card.dataset.template,preset=templatePresets[key];if(!preset)return;selectedTemplate=key;const categoryByTemplate={"fashion":"boutique","restaurant":"livraison","property":"immobilier","travel":"voyage","agency":"vitrine","magazine":"blog","portfolio":"portfolio","community":"reseau_social","dating":"rencontre","media":"streaming","gaming":"jeux","saas":"saas","education":"education","finance":"finance","health":"sante","events":"evenementiel","nonprofit":"association"};if(categoryByTemplate[key])form.elements.type_site.value=categoryByTemplate[key];document.querySelectorAll("[data-template]").forEach(x=>x.classList.toggle("active",x===card));form.elements.template_design.value=key;form.elements.design_style.value=preset.style;form.elements.primary_color.value=preset.primary;form.elements.background_color.value=preset.bg;draftBlocks=preset.blocks.map((b,i)=>({...b,id:"draft-"+key+"-"+i,items:b.items?[...b.items]:undefined,images:b.images?[...b.images]:undefined}));selectedDraft=null;renderDraft();}));
 document.querySelectorAll("[data-preview-add]").forEach(btn=>btn.addEventListener("click",()=>addDraftBlock(btn.dataset.previewAdd)));
 $("[data-preview-up]").addEventListener("click",()=>{const i=draftBlocks.findIndex(x=>x.id===selectedDraft);if(i>0){[draftBlocks[i-1],draftBlocks[i]]=[draftBlocks[i],draftBlocks[i-1]];renderDraft();}});
 $("[data-preview-down]").addEventListener("click",()=>{const i=draftBlocks.findIndex(x=>x.id===selectedDraft);if(i>=0&&i<draftBlocks.length-1){[draftBlocks[i+1],draftBlocks[i]]=[draftBlocks[i],draftBlocks[i+1]];renderDraft();}});
 $("[data-preview-delete]").addEventListener("click",()=>{draftBlocks=draftBlocks.filter(x=>x.id!==selectedDraft);selectedDraft=null;renderDraft();});
 form.addEventListener("submit",async e=>{
  e.preventDefault();const btn=form.querySelector('[type="submit"]');btn.disabled=true;const status=form.querySelector("[data-message]");
  try{
   const nom=form.nom.value.trim(),slug=slugify(form.slug.value),type=form.type_site.value;
   if(!nom||slug.length<2)throw Error("Indiquez un nom et un identifiant valide.");
   const settings={site_type:type,display_name:nom,description:"Bienvenue sur "+nom,template:type,template_design:selectedTemplate,design_style:form.design_style.value,font_family:form.font_family.value,primary_color:form.primary_color.value,background_color:form.background_color.value,intro_animation:form.intro_animation.checked};
   const {data,error}=await sb.from("sites").insert({owner_id:user.id,nom,slug,type_site:type,settings_json:settings}).select("id").single();
   if(error)throw error;
   const blocks=draftBlocks.map(b=>({...b,id:crypto.randomUUID(),items:b.items?[...b.items]:undefined,images:b.images?[...b.images]:undefined}));
   const {error:pageError}=await sb.from("pages").insert({site_id:data.id,titre:"Accueil",slug:"accueil",content_json:{blocks}});
   if(pageError)throw pageError;
   form.reset();selectedTemplate="fashion";form.elements.template_design.value="fashion";document.querySelectorAll("[data-template]").forEach(x=>x.classList.toggle("active",x.dataset.template==="fashion"));draftBlocks=templatePresets.fashion.blocks.map((b,i)=>({...b,id:"draft-"+i}));selectedDraft=null;updateLivePreview();say(status,"Votre site a été créé avec les éléments de votre aperçu. Ouvrez le Studio pour continuer.",true);await load();
  }catch(err){say(status,err.message||"La création du site a échoué.");}
  finally{btn.disabled=false;}
 });
 $("[data-logout]").addEventListener("click",async()=>{await sb.auth.signOut();location.href="index.html";});
})();