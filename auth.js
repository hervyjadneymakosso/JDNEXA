(() => {
  const form = document.querySelector("[data-auth]");
  if (!form) return;

  const msg = form.querySelector("[data-message]");
  const submit = form.querySelector("[type=submit]");
  const destination = "dashboard.html";

  // Vérifie la session à l'ouverture ET lorsque le navigateur restaure
  // cette page depuis son cache après un retour arrière.
  let redirecting = false;
  async function continueIfConnected() {
    if (redirecting) return;
    try {
      const sb = window.requireSupabase();
      const { data, error } = await sb.auth.getSession();
      if (error) throw error;
      if (data.session) {
        redirecting = true;
        location.replace(destination);
      }
    } catch (err) {
      console.error("Vérification de session JDNEXA :", err);
    }
  }

  continueIfConnected();
  window.addEventListener("pageshow", continueIfConnected);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") continueIfConnected();
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    msg.textContent = "";
    submit.disabled = true;
    submit.textContent = form.dataset.auth === "signup" ? "Création du compte…" : "Connexion…";

    try {
      const sb = window.requireSupabase();
      const email = form.email.value.trim();
      const password = form.password.value;
      let result;

      if (form.dataset.auth === "signup") {
        result = await sb.auth.signUp({ email, password });
        if (result.error) throw result.error;
        if (result.data.session) {
          location.replace(destination);
        } else {
          location.replace("signup-success.html");
        }
        return;
      }

      result = await sb.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      location.replace(destination);
    } catch (err) {
      msg.className = "error";
      msg.textContent = err.message || "Une erreur est survenue.";
      submit.disabled = false;
      submit.textContent = form.dataset.auth === "signup" ? "Créer mon compte" : "Se connecter";
    }
  });
})();
