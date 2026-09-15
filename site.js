(() => {
  const button = document.querySelector(".theme-toggle");
  if (!button) return;
  const preference = window.matchMedia("(prefers-color-scheme: dark)");
  let selected;
  try {
    selected = localStorage.getItem("portfolio-theme");
  } catch {
    /* Storage is optional. */
  }
  function update() {
    const dark = selected ? selected === "dark" : preference.matches;
    if (selected) document.documentElement.dataset.theme = selected;
    button.textContent = dark ? "Light mode ↗" : "Dark mode ↗";
    button.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} mode`);
  }
  button.addEventListener("click", () => {
    selected = (selected ? selected === "dark" : preference.matches) ? "light" : "dark";
    try {
      localStorage.setItem("portfolio-theme", selected);
    } catch {
      /* Use in-memory preference. */
    }
    update();
  });
  preference.addEventListener("change", update);
  update();
})();
