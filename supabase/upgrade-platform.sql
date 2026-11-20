-- JDNEXA — extension fonctionnelle de la plateforme
-- À exécuter une seule fois dans Supabase SQL Editor après schema.sql.
begin;

alter table public.sites
  add column if not exists public_slug text,
  add column if not exists is_published boolean not null default false,
  add column if not exists published_at timestamptz;

create unique index if not exists sites_public_slug_unique
  on public.sites (public_slug) where public_slug is not null;

create table if not exists public.abonnements (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  formule text not null default 'FREE' check (formule in ('FREE','PRO','BUSINESS')),
  statut text not null default 'active' check (statut in ('active','expired','suspended','pending')),
  cycle text not null default 'monthly' check (cycle in ('monthly','annual')),
  debut timestamptz not null default now(),
  expiration timestamptz not null default (now() + interval '30 days'),
  renouvellement_auto boolean not null default false,
  fournisseur text,
  reference_paiement text,
  updated_at timestamptz not null default now()
);

create table if not exists public.demandes_paiement (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  formule text not null check (formule in ('PRO','BUSINESS')),
  cycle text not null check (cycle in ('monthly','annual')),
  montant_xaf integer not null check (montant_xaf > 0),
  moyen text not null check (moyen in ('Airtel Money','MTN MoMo','Autre')),
  reference text,
  statut text not null default 'pending' check (statut in ('pending','approved','rejected')),
  note_admin text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists abonnements_owner_status_idx on public.abonnements(owner_id,statut,expiration);
create index if not exists demandes_paiement_owner_date_idx on public.demandes_paiement(owner_id,created_at desc);

alter table public.abonnements enable row level security;
alter table public.demandes_paiement enable row level security;

drop policy if exists "owners read own subscription" on public.abonnements;
create policy "owners read own subscription" on public.abonnements
 for select to authenticated using (owner_id=auth.uid());
drop policy if exists "owners create payment requests" on public.demandes_paiement;
create policy "owners create payment requests" on public.demandes_paiement
 for insert to authenticated with check (owner_id=auth.uid() and statut='pending');
drop policy if exists "owners read own payment requests" on public.demandes_paiement;
create policy "owners read own payment requests" on public.demandes_paiement
 for select to authenticated using (owner_id=auth.uid());
drop policy if exists "admins manage subscriptions" on public.abonnements;
create policy "admins manage subscriptions" on public.abonnements
 for all to authenticated using ((auth.jwt()->'app_metadata'->>'role')='admin')
 with check ((auth.jwt()->'app_metadata'->>'role')='admin');
drop policy if exists "admins manage payment requests" on public.demandes_paiement;
create policy "admins manage payment requests" on public.demandes_paiement
 for all to authenticated using ((auth.jwt()->'app_metadata'->>'role')='admin')
 with check ((auth.jwt()->'app_metadata'->>'role')='admin');

create or replace function public.jdnexa_create_free_subscription()
returns trigger language plpgsql security definer set search_path=public
as $$
begin
 insert into public.abonnements(owner_id,formule,statut,cycle,debut,expiration)
 values(new.id,'FREE','active','monthly',now(),now()+interval '30 days')
 on conflict(owner_id) do nothing;
 return new;
end $$;

drop trigger if exists jdnexa_auth_subscription on auth.users;
create trigger jdnexa_auth_subscription after insert on auth.users
for each row execute function public.jdnexa_create_free_subscription();

insert into public.abonnements(owner_id,formule,statut,cycle,debut,expiration)
select id,'FREE','active','monthly',now(),now()+interval '30 days'
from auth.users
on conflict(owner_id) do nothing;

create or replace function public.jdnexa_plan_limits(p_owner uuid)
returns table(formule text,site_limit integer,product_limit integer,collaborator_limit integer,ai_limit integer,subscription_active boolean)
language sql stable security definer set search_path=public
as $$
 select
  coalesce(a.formule,'FREE'),
  case coalesce(a.formule,'FREE') when 'BUSINESS' then 5 else 1 end,
  case coalesce(a.formule,'FREE') when 'BUSINESS' then 2000 when 'PRO' then 500 else 25 end,
  case coalesce(a.formule,'FREE') when 'BUSINESS' then 10 else 1 end,
  case coalesce(a.formule,'FREE') when 'BUSINESS' then 100 when 'PRO' then 30 else 3 end,
  coalesce(a.statut='active' and a.expiration>now(),false)
 from (select p_owner as owner_id) u
 left join public.abonnements a on a.owner_id=u.owner_id;
$$;
revoke all on function public.jdnexa_plan_limits(uuid) from public;
grant execute on function public.jdnexa_plan_limits(uuid) to authenticated;

create or replace function public.jdnexa_enforce_site_limit()
returns trigger language plpgsql security definer set search_path=public
as $$
declare lim integer; n integer; active boolean;
begin
 select site_limit,subscription_active into lim,active from public.jdnexa_plan_limits(new.owner_id);
 if not coalesce(active,false) then raise exception 'Votre abonnement est expiré ou suspendu. Renouvelez-le pour créer un site.'; end if;
 select count(*) into n from public.sites where owner_id=new.owner_id;
 if n>=lim then raise exception 'La limite de sites de votre formule est atteinte.'; end if;
 return new;
end $$;
drop trigger if exists jdnexa_site_limit on public.sites;
create trigger jdnexa_site_limit before insert on public.sites
for each row execute function public.jdnexa_enforce_site_limit();

create or replace function public.jdnexa_enforce_product_limit()
returns trigger language plpgsql security definer set search_path=public
as $$
declare own uuid; lim integer; n integer; active boolean;
begin
 if new.type_donnee<>'produit' then return new; end if;
 select owner_id into own from public.sites where id=new.site_id;
 select product_limit,subscription_active into lim,active from public.jdnexa_plan_limits(own);
 if not coalesce(active,false) then raise exception 'Votre abonnement est expiré ou suspendu. Renouvelez-le pour gérer vos produits.'; end if;
 select count(*) into n from public.collections_donnees c join public.sites s on s.id=c.site_id
 where s.owner_id=own and c.type_donnee='produit' and (tg_op='INSERT' or c.id<>new.id);
 if n>=lim then raise exception 'La limite de produits de votre formule est atteinte.'; end if;
 return new;
end $$;
drop trigger if exists jdnexa_product_limit on public.collections_donnees;
create trigger jdnexa_product_limit before insert or update of type_donnee,site_id on public.collections_donnees
for each row execute function public.jdnexa_enforce_product_limit();



-- Suspension effective des espaces marchands à l'expiration.
-- La lecture des informations de boutique reste disponible pour permettre le renouvellement.
create or replace function public.jdnexa_is_active_owner()
returns boolean language sql stable security definer set search_path=public
as $
 select exists(select 1 from public.abonnements a
  where a.owner_id=auth.uid() and a.statut='active' and a.expiration>now());
$;
revoke all on function public.jdnexa_is_active_owner() from public;
grant execute on function public.jdnexa_is_active_owner() to authenticated;

drop policy if exists "owners manage own sites" on public.sites;
drop policy if exists "owners read own sites" on public.sites;
create policy "owners read own sites" on public.sites for select to authenticated using(owner_id=auth.uid());
drop policy if exists "active owners create sites" on public.sites;
create policy "active owners create sites" on public.sites for insert to authenticated with check(owner_id=auth.uid() and public.jdnexa_is_active_owner());
drop policy if exists "active owners update sites" on public.sites;
create policy "active owners update sites" on public.sites for update to authenticated using(owner_id=auth.uid() and public.jdnexa_is_active_owner()) with check(owner_id=auth.uid() and public.jdnexa_is_active_owner());
drop policy if exists "active owners delete sites" on public.sites;
create policy "active owners delete sites" on public.sites for delete to authenticated using(owner_id=auth.uid() and public.jdnexa_is_active_owner());

drop policy if exists "owners manage own pages" on public.pages;
drop policy if exists "active owners manage pages" on public.pages;
create policy "active owners manage pages" on public.pages for all to authenticated
using(public.owns_site(site_id) and public.jdnexa_is_active_owner())
with check(public.owns_site(site_id) and public.jdnexa_is_active_owner());

drop policy if exists "owners manage own collections" on public.collections_donnees;
drop policy if exists "active owners manage collections" on public.collections_donnees;
create policy "active owners manage collections" on public.collections_donnees for all to authenticated
using(public.owns_site(site_id) and public.jdnexa_is_active_owner())
with check(public.owns_site(site_id) and public.jdnexa_is_active_owner());

drop policy if exists "owners manage site visitors" on public.utilisateurs_finaux;
drop policy if exists "active owners manage site visitors" on public.utilisateurs_finaux;
create policy "active owners manage site visitors" on public.utilisateurs_finaux for all to authenticated
using(public.owns_site(site_id) and public.jdnexa_is_active_owner())
with check(public.owns_site(site_id) and public.jdnexa_is_active_owner());

drop policy if exists "owners manage site interactions" on public.messages_et_commandes;
drop policy if exists "active owners manage site interactions" on public.messages_et_commandes;
create policy "active owners manage site interactions" on public.messages_et_commandes for all to authenticated
using(public.owns_site(site_id) and public.jdnexa_is_active_owner())
with check(public.owns_site(site_id) and public.jdnexa_is_active_owner());

-- Les visiteurs publics ne reçoivent jamais owner_id ni les colonnes internes.
revoke select on public.sites from anon, authenticated;
grant select (id,nom,slug,settings_json,public_slug,is_published,created_at) on public.sites to anon,authenticated;

-- Catalogue public : seules les boutiques publiées et leurs produits sont visibles.
drop policy if exists "public read published shops" on public.sites;
create policy "public read published shops" on public.sites
 for select to anon,authenticated using (is_published=true);
drop policy if exists "public read published products" on public.collections_donnees;
create policy "public read published products" on public.collections_donnees
 for select to anon,authenticated using (
  type_donnee='produit' and exists(
   select 1 from public.sites s where s.id=site_id and s.is_published=true
  )
 );
drop policy if exists "public create orders for published shops" on public.messages_et_commandes;
create policy "public create orders for published shops" on public.messages_et_commandes
 for insert to anon,authenticated with check (
  type='commande'
  and jsonb_typeof(details_json)='object'
  and length(coalesce(details_json->>'nom_client','')) between 2 and 100
  and length(coalesce(details_json->>'telephone','')) between 6 and 40
  and exists(select 1 from public.sites s where s.id=site_id and s.is_published=true)
 );

-- Espace public des médias. Les fichiers privés restent dans le dossier du propriétaire.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('jdnexa-media','jdnexa-media',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists "public read JDNEXA media" on storage.objects;
create policy "public read JDNEXA media" on storage.objects for select to anon,authenticated
using(bucket_id='jdnexa-media');
drop policy if exists "owners upload JDNEXA media" on storage.objects;
create policy "owners upload JDNEXA media" on storage.objects for insert to authenticated
with check(bucket_id='jdnexa-media' and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12});
drop policy if exists "owners update JDNEXA media" on storage.objects;
create policy "owners update JDNEXA media" on storage.objects for update to authenticated
using(bucket_id='jdnexa-media' and (storage.foldername(name))[1] in (
 select id::text from public.sites where owner_id=auth.uid()
))
with check(bucket_id='jdnexa-media' and (storage.foldername(name))[1] in (
 select id::text from public.sites where owner_id=auth.uid()
));
drop policy if exists "owners delete JDNEXA media" on storage.objects;
create policy "owners delete JDNEXA media" on storage.objects for delete to authenticated
using(bucket_id='jdnexa-media' and (storage.foldername(name))[1] in (
 select id::text from public.sites where owner_id=auth.uid()
));

grant select on public.abonnements,public.demandes_paiement to authenticated;
grant insert on public.demandes_paiement to authenticated;
commit;

 and public.owns_site(((storage.foldername(name))[1])::uuid)
 and public.jdnexa_is_active_owner());
drop policy if exists "owners update JDNEXA media" on storage.objects;
create policy "owners update JDNEXA media" on storage.objects for update to authenticated
using(bucket_id='jdnexa-media' and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})
with check(bucket_id='jdnexa-media' and (storage.foldername(name))[1] in (
 select id::text from public.sites where owner_id=auth.uid()
));
drop policy if exists "owners delete JDNEXA media" on storage.objects;
create policy "owners delete JDNEXA media" on storage.objects for delete to authenticated
using(bucket_id='jdnexa-media' and (storage.foldername(name))[1] in (
 select id::text from public.sites where owner_id=auth.uid()
));

grant select on public.abonnements,public.demandes_paiement to authenticated;
grant insert on public.demandes_paiement to authenticated;
commit;

 and public.owns_site(((storage.foldername(name))[1])::uuid)
 and public.jdnexa_is_active_owner())
with check(bucket_id='jdnexa-media' and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12});
drop policy if exists "owners delete JDNEXA media" on storage.objects;
create policy "owners delete JDNEXA media" on storage.objects for delete to authenticated
using(bucket_id='jdnexa-media' and (storage.foldername(name))[1] in (
 select id::text from public.sites where owner_id=auth.uid()
));

grant select on public.abonnements,public.demandes_paiement to authenticated;
grant insert on public.demandes_paiement to authenticated;
commit;

 and public.owns_site(((storage.foldername(name))[1])::uuid)
 and public.jdnexa_is_active_owner());
drop policy if exists "owners delete JDNEXA media" on storage.objects;
create policy "owners delete JDNEXA media" on storage.objects for delete to authenticated
using(bucket_id='jdnexa-media' and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12});

grant select on public.abonnements,public.demandes_paiement to authenticated;
grant insert on public.demandes_paiement to authenticated;
commit;

 and public.owns_site(((storage.foldername(name))[1])::uuid)
 and public.jdnexa_is_active_owner());

grant select on public.abonnements,public.demandes_paiement to authenticated;
grant insert on public.demandes_paiement to authenticated;
commit;
