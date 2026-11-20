-- JDNEXA — moteur multi-types de sites et personnalisation visuelle
-- À exécuter dans Supabase SQL Editor après upgrade-platform.sql.
begin;

alter table public.sites
  add column if not exists type_site text not null default 'vitrine',
  add column if not exists settings_json jsonb not null default '{}'::jsonb;

alter table public.sites drop constraint if exists sites_type_site_check;
alter table public.sites add constraint sites_type_site_check check (type_site in (
 'boutique','marketplace','rencontre','reseau_social','blog','streaming','jeux',
 'vitrine','portfolio','emploi','education','forum','annonces','voyage',
 'immobilier','finance','sante','administration','comparateur','wiki',
 'recherche','messagerie','saas','crowdfunding','association','livraison',
 'cloud','evenementiel','landing'
));

do $$
declare c record;
begin
 for c in
  select conname from pg_constraint
  where conrelid='public.collections_donnees'::regclass and contype='c'
    and pg_get_constraintdef(oid) ilike '%type_donnee%'
 loop
  execute format('alter table public.collections_donnees drop constraint %I',c.conname);
 end loop;
end $$;

alter table public.collections_donnees
 add constraint collections_donnees_type_donnee_check check (type_donnee in (
  'article','produit','annonce','profil_rencontre','logiciel','dessin',
  'service','media','evenement','cours','offre_emploi','bien_immobilier',
  'episode','jeu','discussion','fichier','campagne','restaurant','autre'
 ));

-- Les pages et contenus d'un site publié sont consultables publiquement.
drop policy if exists "public read published pages" on public.pages;
create policy "public read published pages" on public.pages for select to anon,authenticated
 using (exists(select 1 from public.sites s where s.id=site_id and s.is_published=true));

drop policy if exists "public read published site content" on public.collections_donnees;
create policy "public read published site content" on public.collections_donnees for select to anon,authenticated
 using (
  type_donnee <> 'profil_rencontre'
  and exists(select 1 from public.sites s where s.id=site_id and s.is_published=true)
 );

revoke select on public.sites from anon,authenticated;
grant select(id,nom,slug,type_site,settings_json,public_slug,is_published,created_at)
 on public.sites to anon,authenticated;
grant select on public.pages,public.collections_donnees to anon,authenticated;

commit;
