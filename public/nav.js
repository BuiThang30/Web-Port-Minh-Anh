(function () {
  const BRAND = { label: "Minh Anh's Folio", href: "/home" };

  const PAGES = [
    { key: "about",     label: "About Me",    href: "/about" },
    { key: "gallery",   label: "Art Gallery", href: "/gallery" },
    { key: "music",     label: "Music",       href: "/music" },
    { key: "academics", label: "Academics",   href: "/academics" },
    { key: "community", label: "Community",   href: "/community" },
    { key: "epilouge",  label: "Epilouge",    href: "/epilouge" },
  ];

  const MOBILE_MAX = 768;

  const nav = document.getElementById("site-nav");
  if (!nav) return;

  const fromUrl = location.pathname.split("/").filter(Boolean)[0]?.replace(/\.html$/, "");
  const active = nav.dataset.active || fromUrl;
  nav.dataset.active = active || "";
  document.body.prepend(nav);

  nav.innerHTML = `
    <div class="nav__inner">
      <a class="nav__brand" href="${BRAND.href}">${BRAND.label}</a>

      <button class="nav__toggle" type="button"
              aria-label="Mở menu" aria-expanded="false" aria-controls="nav-menu">
        <span></span><span></span><span></span>
      </button>

      <ul class="nav__links" id="nav-menu">
        ${PAGES.map((p) => `
          <li>
            <a class="nav__link--${p.key}${p.key === active ? " is-active" : ""}"
               href="${p.href}"
               ${p.key === active ? 'aria-current="page"' : ""}>${p.label}</a>
          </li>`).join("")}
      </ul>
    </div>
  `;

  const toggle = nav.querySelector(".nav__toggle");

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => setOpen(false))
  );

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  window.matchMedia(`(min-width: ${MOBILE_MAX + 1}px)`).addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
})();