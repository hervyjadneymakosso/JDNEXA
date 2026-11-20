/* Supabase JS v2. Auth et base de données. Les autorisations réelles sont définies dans supabase/schema.sql. */
(() => {
  const cfg = window.JDNEXA_CONFIG || {};
  const ready = cfg.SUPABASE_URL?.startsWith("https://") &&
    !cfg.SUPABASE_URL.includes("VOTRE-PROJET") &&
    cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.includes("VOTRE_CLE");
  window.jdnexaReady = Boolean(ready);
  window.sb = ready && window.supabase ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
  window.requireSupabase = () => {
    if (!window.sb) throw new Error("Configurez SUPABASE_URL et SUPABASE_ANON_KEY dans js/config.js, puis exécutez supabase/schema.sql.");
    return window.sb;
  };
})();