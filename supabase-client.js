/* Supabase JS v2. Auth et base de données. Les autorisations réelles sont définies dans supabase/schema.sql. */
(() => {
  const cfg = window.JDNEXA_CONFIG || {};
  const ready = cfg.SUPABASE_URL?.startsWith("https://") &&
    !cfg.SUPABASE_URL.includes("VOTRE-PROJET") &&
    cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.includes("VOTRE_CLE");

  window.jdnexaReady = Boolean(ready);

  // La session reste enregistrée sur l'appareil après fermeture ou retour
  // et se renouvelle automatiquement tant qu'elle reste valide.
  window.sb = ready && window.supabase
    ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage
        }
      })
    : null;

  window.requireSupabase = () => {
    if (!window.sb) throw new Error("Configurez SUPABASE_URL et SUPABASE_ANON_KEY dans config.js, puis exécutez schema.sql et supabase/upgrade-platform.sql.");
    return window.sb;
  };
})();
