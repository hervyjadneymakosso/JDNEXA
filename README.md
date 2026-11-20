# JDNEXA — kit de démarrage de la plateforme

**Connect. Trade. Grow.** — JDN Agency

Cette archive contient une base fonctionnelle front-end et le schéma Supabase pour démarrer JDNEXA depuis Acode, VS Code ou un hébergeur statique.

## Contenu
- `index.html` : page d'accueil marketing responsive.
- `login.html`, `signup.html` : authentification Supabase.
- `dashboard.html` : création et liste des sites.
- `studio.html` : studio visuel avec ajout, édition, déplacement, duplication, suppression, sauvegarde JSON dans `pages.content_json` et export JSON.
- `collections.html` : CRUD de base pour produits, articles, annonces et profils.
- `privacy.html`, `terms.html` : modèles de pages légales à compléter.
- `supabase/schema.sql` : 5 tables, index et politiques RLS.
- `robots.txt`, `sitemap.xml`, `_redirects` : fichiers de déploiement.
- `assets/` : favicon et image Open Graph vectorielles légères.

## Installation
1. Créez un projet Supabase.
2. Ouvrez **SQL Editor** dans Supabase et exécutez `supabase/schema.sql`.
3. Dans Supabase > Project Settings > API, copiez l'URL du projet et la clé `anon`/`publishable`.
4. Remplacez les deux valeurs dans `js/config.js`. Seules l'URL et la clé publique anon/publishable sont autorisées dans le navigateur. **Ne collez jamais `service_role`, mot de passe de base de données, secret CinetPay ou secret Cloudinary dans ce projet front-end.**
5. Activez la confirmation e-mail selon votre choix dans Supabase Auth et configurez les URL de redirection autorisées.
6. Ouvrez le dossier avec Acode et prévisualisez via un serveur local. Pour l'authentification, évitez `file://`; utilisez un hébergement HTTPS ou un serveur local.
7. Déployez le dossier sur Netlify, GitHub Pages ou un hébergeur HTTPS. Sur Netlify, `_redirects` active le forçage HTTPS.

## Configuration facultative
- Mesure d'audience : renseignez `GA_MEASUREMENT_ID` dans `js/config.js`. Le script ne se charge qu'après acceptation du bandeau.
- `SITE_URL` dans `js/config.js`, `sitemap.xml` et la balise canonical doivent être remplacés par le vrai domaine.
- Les images de démonstration utilisent un placeholder externe. Remplacez-les par vos images optimisées et renseignez toujours `alt`.

## Sécurité : limites à traiter avant production
- Le formulaire d'inscription publique des visiteurs, le chat et les commandes doivent passer par une Edge Function/API serveur avec validation, CAPTCHA ou honeypot côté serveur, limitation de débit et journalisation. Le navigateur ne doit pas recevoir de droits privilégiés.
- Les politiques RLS actuelles isolent les données par propriétaire de site. Elles ne rendent pas les données des visiteurs publiques.
- Le studio actuel sauvegarde les blocs JSON et permet leur réorganisation; ce n'est pas encore un éditeur drag-and-drop libre ni un moteur de publication multi-domaines.
- Les pages de confidentialité et conditions sont des modèles, pas un avis juridique. Complétez les coordonnées, durées de conservation, prestataires et règles applicables.
- Les paiements CinetPay, le stockage Cloudinary, le chat temps réel, les abonnements et la publication des sites ne sont pas activés dans cette version.
- Le bandeau de consentement est une base simple. Vérifiez les exigences légales de chaque pays ciblé.

## Performance et accessibilité
CSS et JS locaux, images de marque en SVG, images de contenu chargées en lazy loading, dimensions fluides, formulaires avec contraintes HTML, navigation mobile, contraste bleu/blanc et textes alternatifs. Testez le domaine déployé avec Lighthouse/PageSpeed avant diffusion.

## Dépannage
- « Configurez SUPABASE… » : les clés de `js/config.js` ne sont pas renseignées.
- Erreur RLS : vérifiez que le script SQL a été exécuté et que l'utilisateur est connecté au compte propriétaire du site.
- Pas de site dans le studio : créez d'abord un site dans le tableau de bord.
