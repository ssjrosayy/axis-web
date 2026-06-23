const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const nav = $("#site-nav");
const navToggle = $(".nav-toggle");

const stepText = [
  "We turn broad ideas into a clear project scope, timeline, and first technical plan.",
  "We choose the right architecture, integrations, hardware plan, and launch path before heavy development starts.",
  "We build in visible stages, test the work, and keep the team aligned on progress.",
  "We deploy the system, monitor real usage, fix issues, and plan the next improvements.",
];

navToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  $(".material-symbols-outlined", navToggle).textContent = open ? "close" : "menu";
});

$$(".site-nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    nav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    const icon = $(".material-symbols-outlined", navToggle);
    if (icon) icon.textContent = "menu";
    
    const href = link.getAttribute("href");
    if (href?.startsWith("#")) {
      e.preventDefault();
      const target = $(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const section = entry.target.dataset.section;
      $$(".site-nav a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${section}`);
      });
    });
  },
  { rootMargin: "-42% 0px -50% 0px" }
);

$$(".section-watch").forEach((section) => sectionObserver.observe(section));

const revealItems = [
  ...$$(".section-title"),
  ...$$(".project-row"),
  ...$$(".showcase-top"),
  ...$$(".showcase-panel"),
  ...$$(".feature-copy"),
  ...$$(".feature-image"),
  ...$$(".service-grid article"),
  ...$$(".visual-copy"),
  ...$$(".visual-grid"),
  ...$$(".timeline li"),
  $(".step-output"),
  ...$$(".contact > div"),
  $(".contact-form"),
].filter(Boolean);

revealItems.forEach((item) => item.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      } else {
        entry.target.classList.remove("in-view");
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const showcaseObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const key = entry.target.dataset.showcasePanel;
      $$("[data-showcase-link]").forEach((link) => {
        link.classList.toggle("active", link.dataset.showcaseLink === key);
      });
    });
  },
  { threshold: 0.55 }
);

$$("[data-showcase-panel]").forEach((panel) => showcaseObserver.observe(panel));

$$("[data-step]").forEach((button) => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.step);
    $$("[data-step]").forEach((step) => step.classList.toggle("active", step === button));
    $("[data-step-output]").textContent = stepText[index];
  });
});

$("[data-contact-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const note = $("[data-form-note]");
  note.textContent = `Thanks, ${data.get("name")}. Your ${data.get("type").toLowerCase()} brief is ready to review.`;
  form.reset();
});

$("[data-back-top]")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  nav?.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
});
