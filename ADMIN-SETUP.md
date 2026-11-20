# Configuration de l'administration JDNEXA

## 1. Désigner le compte administrateur principal

Connectez-vous à Supabase avec le compte propriétaire du projet, puis ouvrez **SQL Editor**.

Exécutez la requête suivante en remplaçant l'adresse entre apostrophes par l'adresse e-mail exacte utilisée pour se connecter à JDNEXA :

```sql
update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('role', 'admin')
where lower(email) = lower('VOTRE-EMAIL-DE-CONNEXION');
```

La requête doit correspondre à un compte existant. Si aucune ligne n'est modifiée, vérifiez l'adresse e-mail dans **Authentication → Users**.

Après attribution du rôle :
1. Déconnectez-vous de JDNEXA.
2. Reconnectez-vous pour renouveler la session.
3. Ouvrez l'adresse `https://VOTRE-SITE-NETLIFY/admin.html`.

L'accès est contrôlé par le rôle `admin` contenu dans les métadonnées sécurisées du jeton Supabase. Ne stockez jamais ce rôle dans un champ de profil modifiable par l'utilisateur.

## 2. Responsabilités de l'administration

L'espace d'administration permet de consulter les demandes de paiement. Avant de confirmer une demande, vérifiez que le transfert a réellement été reçu sur le compte marchand concerné. La confirmation active la formule et sa période ; le refus conserve la demande dans l'historique.

Cette version utilise une validation manuelle. Elle ne prétend pas recevoir automatiquement les confirmations Airtel Money ou MTN MoMo.

## 3. Pages de la plateforme

- `dashboard.html` : tableau de bord du commerçant.
- `studio.html` : création et édition des pages.
- `collections.html` : produits et contenus.
- `settings.html` : paramètres de boutique, compte et renouvellement.
- `boutique.html?slug=identifiant-public` : catalogue public.
- `commandes.html` : demandes reçues par le commerçant.
- `admin.html` : gestion administrative des demandes de paiement.

## Sécurité

Ne communiquez jamais la clé Supabase `service_role` dans le navigateur, dans un fichier JavaScript public ou dans une conversation. La clé publique `anon/publishable` est celle qui doit être utilisée dans la configuration front-end avec les politiques RLS activées.
