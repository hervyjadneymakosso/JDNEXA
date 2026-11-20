-- JDNEXA — types de sites et contenus étendus
-- À exécuter dans Supabase SQL Editor après upgrade-platform.sql.
begin;
alter table public.sites add column if not exists type_site text not null default 'boutique';
alter table public.sites drop constraint if exists sites_type_site_check;
alter table public.sites add constraint sites_type_site_check check(type_site in ('boutique','blog','portfolio','entreprise','logiciels','services','actualites','communaute','personnalise'));
alter table public.collections_donnees drop constraint if exists collections_donnees_type_donnee_check;
alter table public.collections_donnees add constraint collections_donnees_type_donnee_check check(type_donnee in ('article','produit','annonce','profil_rencontre','logiciel','dessin','service','media'));
create index if not exists idx_sites_owner_created on public.sites(owner_id,created_at desc);
create index if not exists idx_collections_site_created on public.collections_donnees(site_id,date_creation desc);
drop policy if exists "public read published products" on public.collections_donnees;
drop policy if exists "public read published content" on public.collections_donnees;
create policy "public read published content" on public.collections_donnees for select to anon,authenticated
 using(exists(select 1 from public.sites s where s.id=site_id and s.is_published=true));
drop policy if exists "public read published pages" on public.pages;
create policy "public read published pages" on public.pages for select to anon,authenticated
 using(exists(select 1 from public.sites s where s.id=site_id and s.is_published=true));
commit;