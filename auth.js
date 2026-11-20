(() => {
  const form = document.querySelector("[data-auth]");
  if (!form) return;
  const msg = form.querySelector("[data-message]");
  form.addEventListener("submit", async e => {
    e.preventDefault(); msg.textContent = "";
    const submit = form.querySelector("[type=submit]"); submit.disabled = true;
    try {
      const sb = window.requireSupabase();
      const email = form.email.value.trim();
      const password = form.password.value;
      let result;
      if (form.dataset.auth === "signup") result = await sb.auth.signUp({email,password});
      else result = await sb.auth.signInWithPassword({email,password});
      if (result.error) throw result.error;
      msg.className = "success";
      msg.textContent = form.dataset.auth === "signup" ? "Compte créé. Vérifiez votre e-mail si la confirmation est activée." : "Connexion réussie. Ouverture du tableau de bord…";
      if (form.dataset.auth !== "signup") setTimeout(()=>location.href="dashboard.html",700);
    } catch(err) { msg.className="error"; msg.textContent=err.message || "Une erreur est survenue."; }
    finally { submit.disabled=false; }
  });
})();