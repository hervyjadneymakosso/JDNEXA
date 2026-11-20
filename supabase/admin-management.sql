-- JDNEXA — fonctions sécurisées de consultation administrateur
begin;
create or replace function public.jdnexa_admin_list_users()
returns table(user_id uuid,email text,created_at timestamptz,last_sign_in_at timestamptz,site_count bigint)
language plpgsql security definer set search_path=''
as $$
begin
 if coalesce(auth.jwt()->'app_metadata'->>'role','') <> 'admin' then raise exception 'Accès administrateur requis'; end if;
 return query select u.id,u.email::text,u.created_at,u.last_sign_in_at,count(s.id)::bigint
 from auth.users u left join public.sites s on s.owner_id=u.id
 group by u.id,u.email,u.created_at,u.last_sign_in_at order by u.created_at desc;
end; $$;
create or replace function public.jdnexa_admin_list_sites()
returns table(site_id uuid,nom text,slug text,type_site text,owner_id uuid,owner_email text,created_at timestamptz,is_published boolean)
language plpgsql security definer set search_path=''
as $$
begin
 if coalesce(auth.jwt()->'app_metadata'->>'role','') <> 'admin' then raise exception 'Accès administrateur requis'; end if;
 return query select s.id,s.nom,s.slug,s.type_site,s.owner_id,u.email::text,s.created_at,s.is_published
 from public.sites s left join auth.users u on u.id=s.owner_id order by s.created_at desc;
end; $$;
revoke all on function public.jdnexa_admin_list_users() from public,anon;
revoke all on function public.jdnexa_admin_list_sites() from public,anon;
grant execute on function public.jdnexa_admin_list_users() to authenticated;
grant execute on function public.jdnexa_admin_list_sites() to authenticated;
commit;
