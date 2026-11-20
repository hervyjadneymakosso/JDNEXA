# Activation de la plateforme JDNEXA

Le schéma initial est dans `schema.sql`. L'extension fonctionnelle est dans `supabase/upgrade-platform.sql`.

## Mise à niveau de la base

Comme le schéma initial a déjà été exécuté dans ce projet, ouvrez Supabase → SQL Editor, ouvrez le fichier `supabase/upgrade-platform.sql` dans GitHub, copiez son contenu complet dans une nouvelle requête SQL puis exécutez-le une seule fois.

Cette extension ajoute :
- abonnements FREE, PRO et BUSINESS et période de démarrage de 30 jours ;
- limites serveur de boutiques et de produits ;
- suspension des fonctions de gestion à l'expiration, sans supprimer les données ;
- publication des boutiques et lecture publique limitée aux boutiques publiées ;
- stockage des photos de produits dans le bucket `jdnexa-media` ;
- demandes de commandes publiques ;
- demandes de renouvellement manuel et espace d'administration protégé par rôle.

## Accès administrateur

Suivez le fichier `ADMIN-SETUP.md` pour attribuer le rôle administrateur au compte propriétaire.

## Pages principales

- `dashboard.html` : sites et espace de travail.
- `studio.html` : construction des pages.
- `collections.html` : gestion des produits, photos et contenus.
- `settings.html` : publication, coordonnées, compte et renouvellement.
- `boutique.html?slug=identifiant` : catalogue public.
- `commandes.html` : demandes de commande reçues.
- `admin.html` : validation administrative des paiements.

Les paiements sont suivis manuellement dans cette version. L'administrateur doit confirmer la réception effective d'un transfert avant d'activer un abonnement. Aucun paiement Airtel Money ou MTN MoMo automatique n'est simulé ; l'automatisation nécessite les accès marchands et les notifications officielles du prestataire.
