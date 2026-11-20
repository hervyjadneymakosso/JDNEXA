# JDNEXA — Créateur universel de sites

## Fonctions de la base multi-sites
- Chaque compte dispose de son espace privé et de ses propres sites.
- Chaque site possède son type, ses pages, ses contenus, son adresse publique et son identité visuelle.
- Le propriétaire peut créer, modifier et supprimer ses sites dans les limites de sa formule.
- Les pages sont modifiables dans le Studio visuel.
- Les contenus peuvent être ajoutés, modifiés et supprimés : produits, articles, logiciels, dessins, services, médias, annonces, profils et ressources spécialisées.
- Les sites publiés exposent leurs pages et contenus publics, sans exposer les identifiants privés des propriétaires.
- Le formulaire de création propose les 29 catégories demandées et des choix de design, couleurs, police et animation d'introduction.

## Catégories proposées
E-commerce, marketplace, rencontre, réseau social, blog/magazine/actualités, streaming, jeux, vitrine d'entreprise, portfolio, emploi/recrutement, éducation/e-learning, forum, petites annonces, voyage/réservation, immobilier, finance/paiement, santé, administration, comparateur, wiki, moteur de recherche, messagerie/webmail, SaaS, crowdfunding, association/ONG, livraison/restauration, cloud, événementiel/billetterie et landing page.

## Activation Supabase
Après les migrations déjà exécutées, ouvrir Supabase > SQL Editor, créer une nouvelle requête, coller le contenu de `supabase/upgrade-universal-builder.sql`, puis exécuter.
Cette migration ajoute le type de site, élargit les types de contenus et autorise la lecture publique des pages/contenus des sites publiés.

## Limites fonctionnelles à distinguer
La plateforme fournit le socle de création multi-sites, les pages, le contenu, les thèmes et la publication. Les fonctions avancées propres à chaque catégorie (paiement bancaire réel, messagerie temps réel, streaming avec stockage/transcodage, visioconférence, réservation avec disponibilité, moteur de recherche indexé, jeu multijoueur, dossiers médicaux, opérations financières, etc.) nécessitent des modules dédiés, des fournisseurs/API adaptés et des règles de sécurité spécifiques. Elles ne sont pas activées automatiquement par le seul choix d'une catégorie.

## Sécurité
Ne jamais placer une clé Supabase `service_role` dans les fichiers du navigateur. Les visiteurs ne doivent pas recevoir les données privées des membres. Les profils de rencontre ne sont pas rendus publics automatiquement par la politique de lecture générique.
