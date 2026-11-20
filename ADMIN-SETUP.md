# Configuration de l'administration JDNEXA

## Accorder le rôle administrateur

Dans Supabase, ouvrir **SQL Editor** puis exécuter cette requête en remplaçant l'adresse par celle du compte propriétaire de JDNEXA :

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'VOTRE-ADRESSE-EMAIL';
```

Déconnectez-vous ensuite de JDNEXA puis reconnectez-vous pour obtenir un nouveau jeton contenant le rôle administrateur.

L'espace d'administration est accessible à l'adresse :

`https://VOTRE-SITE-NETLIFY/admin.html`

Les règles RLS vérifient le rôle stocké dans les métadonnées sécurisées du compte. Ne remplacez pas ce mécanisme par un champ modifiable depuis le navigateur.

## Traitement des paiements

Les demandes déposées dans Paramètres apparaissent dans Administration. L'administrateur doit vérifier la réception effective du paiement Airtel Money ou MTN MoMo avant de confirmer. La confirmation active la formule et sa période. Cette version gère le suivi manuel ; aucune confirmation automatique d'opérateur n'est simulée.

## Publication des boutiques

Le propriétaire choisit un identifiant public dans Paramètres et active la publication. L'adresse est :

`boutique.html?slug=identifiant-public`

Les produits publiés sont lisibles publiquement. Les visiteurs peuvent transmettre une demande de commande ; le propriétaire les retrouve dans Commandes.
