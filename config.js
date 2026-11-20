/* Configuration publique de JDNEXA.
   Ne jamais placer ici une clé service_role, un secret de paiement ou une clé privée.
   Les règles ci-dessous servent à l'affichage. Les contrôles d'abonnement doivent être
   appliqués côté serveur/base de données pour empêcher toute modification depuis le navigateur. */
window.JDNEXA_CONFIG = {
  SUPABASE_URL: "https://jzqlkbbzvqxdvsnnkpjz.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_VeYoNCBHVMdA7F6Gx-Masw_W9szc2dv",
  SITE_URL: window.location.origin,
  GA_MEASUREMENT_ID: ""
};

window.JDNEXA_BILLING = {
  currency: "XAF",
  trial: {
    enabled: true,
    durationDays: 30,
    plan: "FREE"
  },
  plans: {
    FREE: {
      name: "Découverte",
      monthlyPrice: 0,
      annualPrice: 0,
      productLimit: 25,
      shopLimit: 1,
      collaboratorLimit: 1,
      aiDesignerMonthlyLimit: 3
    },
    PRO: {
      name: "Développement",
      monthlyPrice: 1000,
      annualPrice: 10000,
      productLimit: 500,
      shopLimit: 1,
      collaboratorLimit: 1,
      aiDesignerMonthlyLimit: 30
    },
    BUSINESS: {
      name: "Équipe",
      monthlyPrice: 2500,
      annualPrice: 25000,
      productLimit: 2000,
      shopLimit: 5,
      collaboratorLimit: 10,
      aiDesignerMonthlyLimit: 100
    }
  },
  subscription: {
    periods: ["monthly", "annual"],
    manualRenewal: true,
    automaticRenewal: "only_if_supported_and_explicitly_authorized",
    activateOnlyAfterConfirmedPayment: true,
    suspendAccessAtExpiry: true,
    restoreAccessAfterConfirmedPayment: true,
    deleteContentAtExpiry: false,
    gracePeriodDays: 0
  }
};