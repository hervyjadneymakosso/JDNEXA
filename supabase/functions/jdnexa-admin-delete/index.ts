import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "Méthode non autorisée." }, 405);

  try {
    const url = Deno.env.get("SUPABASE_URL");
    const anon = Deno.env.get("SUPABASE_ANON_KEY");
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anon || !service) return reply({ error: "Configuration serveur Supabase incomplète." }, 500);

    const authorization = req.headers.get("Authorization") || "";
    if (!authorization.startsWith("Bearer ")) return reply({ error: "Connexion administrateur requise." }, 401);

    const caller = createClient(url, anon, { global: { headers: { Authorization: authorization } } });
    const { data: identity, error: identityError } = await caller.auth.getUser();
    const currentUser = identity?.user;
    if (identityError || !currentUser || currentUser.app_metadata?.role !== "admin") {
      return reply({ error: "Accès réservé aux administrateurs." }, 403);
    }

    const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
    const body = await req.json().catch(() => ({}));
    const action = body?.action;
    const id = typeof body?.id === "string" ? body.id : "";
    if (!id) return reply({ error: "Identifiant manquant." }, 400);

    if (action === "delete_user" && id === currentUser.id) {
      return reply({ error: "Votre compte administrateur actuel est protégé." }, 400);
    }

    let siteIds: string[] = [];
    if (action === "delete_site") {
      const { data, error } = await admin.from("sites").select("id").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) return reply({ error: "Site introuvable." }, 404);
      siteIds = [data.id];
    } else if (action === "delete_user") {
      const { data: target, error: targetError } = await admin.auth.admin.getUserById(id);
      if (targetError || !target?.user) return reply({ error: "Compte introuvable." }, 404);
      if (target.user.app_metadata?.role === "admin") {
        return reply({ error: "La suppression d'un autre compte administrateur est bloquée par sécurité." }, 400);
      }
      const { data, error } = await admin.from("sites").select("id").eq("owner_id", id);
      if (error) throw error;
      siteIds = (data || []).map((site: { id: string }) => site.id);
    } else {
      return reply({ error: "Action inconnue." }, 400);
    }

    // Les médias sont rangés dans jdnexa-media/<identifiant_du_site>/...
    async function listFiles(prefix: string): Promise<string[]> {
      const paths: string[] = [];
      let offset = 0;
      while (true) {
        const { data, error } = await admin.storage.from("jdnexa-media").list(prefix, { limit: 100, offset });
        if (error) throw error;
        if (!data?.length) break;
        for (const item of data) {
          const path = prefix + "/" + item.name;
          if (item.id === null) paths.push(...await listFiles(path));
          else paths.push(path);
        }
        if (data.length < 100) break;
        offset += data.length;
      }
      return paths;
    }

    for (const siteId of siteIds) {
      const paths = await listFiles(siteId);
      for (let i = 0; i < paths.length; i += 100) {
        const { error } = await admin.storage.from("jdnexa-media").remove(paths.slice(i, i + 100));
        if (error) throw error;
      }
    }

    if (action === "delete_site") {
      const { error } = await admin.from("sites").delete().eq("id", id);
      if (error) throw error;
      return reply({ success: true, message: "Site supprimé définitivement avec ses pages, contenus, commandes et médias." });
    }

    // La clé étrangère owner_id -> auth.users(id) ON DELETE CASCADE supprime
    // les sites et leurs données liées ; les abonnements/demandes sont également en cascade.
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) throw error;
    return reply({ success: true, message: "Compte supprimé définitivement avec ses sites, données associées et médias." });
  } catch (error) {
    console.error("JDNEXA admin delete:", error);
    return reply({ error: error instanceof Error ? error.message : "La suppression définitive a échoué." }, 500);
  }
});
