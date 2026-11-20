(() => {
  const $ = (s, root=document) => root.querySelector(s);
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
  const menu = $(".menu-toggle");
  if (menu) menu.addEventListener("click", () => $(".topbar")?.classList.toggle("menu-open"));
  const banner = $("#cookie-banner");
  const consent = localStorage.getItem("jdnexa_cookie_consent");
  if (banner && !consent) banner.hidden = false;
  document.querySelectorAll("[data-cookie]").forEach(btn => btn.addEventListener("click", () => {
    const value = btn.dataset.cookie === "accept" ? "accepted" : "rejected";
    localStorage.setItem("jdnexa_cookie_consent", value);
    if (banner) banner.hidden = true;
    if (value === "accepted") loadAnalytics();
  }));
  function loadAnalytics(){
    const id = window.JDNEXA_CONFIG?.GA_MEASUREMENT_ID;
    if (!id || window.__jdnexaAnalyticsLoaded) return;
    window.__jdnexaAnalyticsLoaded = true;
    const s = document.createElement("script"); s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);};
    window.gtag("js", new Date()); window.gtag("config", id, { anonymize_ip: true });
  }
  if (consent === "accepted") loadAnalytics();
  window.JDNEXA = { $ };
})();