/* ==========================================================================
   app.js — DESIGN REFERENCE (vanilla JS, no build step)
   Demonstrates the interactions specified in docs/05-interactions-accessibility.md.
   Do not ship as-is: re-implement each behaviour in the target framework.
   Sections: config · helpers · i18n · theme · menu · router · render · interactions
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- config */
  // Availability is configuration, not layout. Empty array => component hidden entirely.
  // Allowed values: "alternance" | "stage" | "emploi"
  var CONFIG = {
    availability: ["alternance"],
    // Blog is enabled because a real article exists. Set to false to hide the footer link,
    // the article teasers, the card badges and every #/blog route again.
    blog: true,
    // Demo project cards are hidden while only NetScan is real: no placeholder project is
    // published or reachable. Flip to true to show the remaining placeholder cards again.
    demoProjects: false,
    // Contact form delivery. Create a form on a static-friendly service (Formspree is
    // the default: https://formspree.io), then paste its public endpoint here, e.g.
    // "https://formspree.io/f/abcdwxyz". The endpoint is public by design — it is not
    // a secret key. Leave empty to fall back to opening the visitor's email app.
    contactEndpoint: "https://formspree.io/f/xdegopgk"
  };

  // Bilingual content. Every string is owner-supplied; FR and EN must both be filled.
  // `null` for an optional field removes the element instead of leaving a gap.

  // Education — newest first. `current: true` adds the "in progress" accent styling;
  // when `end` is null it renders "En cours / Ongoing" instead of a date.
  var EDU = [
    {
      start: { fr: "Septembre 2026", en: "September 2026" },
      end: { fr: "Juillet 2029", en: "July 2029" }, current: true,
      degree: { fr: "Cycle d'ingénieur en Informatique", en: "Engineering degree in Computer Science" },
      org: "EILCO — École d'Ingénieurs du Littoral Côte d'Opale",
      place: { fr: "Calais, France", en: "Calais, France" },
      desc: null
    },
    {
      start: { fr: "Septembre 2024", en: "September 2024" },
      end: { fr: "Juillet 2026", en: "July 2026" }, current: false,
      degree: { fr: "DUT en Infrastructure Digitale, Réseau et Sécurité", en: "University Diploma in Digital Infrastructure, Networks and Security" },
      org: "EST — École Supérieure de Technologie",
      place: { fr: "Kénitra, Maroc", en: "Kénitra, Morocco" },
      desc: null
    }
  ];

  // Experience — newest first.
  var EXP = [
    {
      period: { fr: "Mai 2026 — Juillet 2026", en: "May 2026 — July 2026" },
      role: { fr: "Stagiaire en Informatique", en: "IT Intern" },
      org: "Lear Corporation",
      place: { fr: "Kénitra, Maroc", en: "Kénitra, Morocco" },
      bullets: [
        { fr: "Conception et développement d'une application interne destinée à faciliter les opérations du département de production.",
          en: "Designed and developed an internal application to support the production department's operations." },
        { fr: "Automatisation des calculs liés aux processus de production.",
          en: "Automated the calculations used in production processes." },
        { fr: "Mise en place d'un système d'authentification et de gestion des rôles et permissions.",
          en: "Implemented authentication and a role/permission management system." },
        { fr: "Implémentation de mécanismes de sécurité et de journalisation des activités.",
          en: "Implemented security mechanisms and activity logging." }
      ]
    },
    {
      period: { fr: "Juin 2025 — Juillet 2025", en: "June 2025 — July 2025" },
      role: { fr: "Stagiaire en Sécurité des Réseaux", en: "Network Security Intern" },
      org: "Direction Provinciale de l'Éducation Nationale, du Préscolaire et des Sports",
      place: { fr: "Midelt, Maroc", en: "Midelt, Morocco" },
      bullets: [
        { fr: "Audit de l'infrastructure réseau et analyse de sa sécurité.",
          en: "Audited the network infrastructure and analysed its security." },
        { fr: "Développement d'un script Bash intégrant Nmap pour l'automatisation des scans réseau.",
          en: "Developed a Bash script integrating Nmap to automate network scans." },
        { fr: "Analyse du trafic réseau avec Wireshark et exploration des mécanismes de sécurité Cisco.",
          en: "Analysed network traffic with Wireshark and explored Cisco security mechanisms." }
      ]
    }
  ];

  // Certifications — `year` for issued, `status` for in-progress, `verify` only when a real URL exists.
  var CERTS = [
    {
      name: "Cisco Ethical Hacker", issuer: "Cisco Networking Academy",
      year: null, status: { fr: "En cours", en: "In progress" }, verify: null
    },
    {
      name: "Agile Project Management Certificate", issuer: "HP Life",
      year: "2026", status: null,
      verify: "https://www.life-global.org/certificate/675ab916-ee00-401c-ac25-c6464544ba93"
    },
    {
      name: "Digital Security Fundamentals", issuer: "Simplilearn SkillUp",
      year: "2025", status: null,
      verify: "https://www.simplilearn.com/skillup-certificate-landing?token=eyJjb3Vyc2VfaWQiOiI0NTQ2IiwiY2VydGlmaWNhdGVfdXJsIjoiaHR0cHM6XC9cL2NlcnRpZmljYXRlcy5zaW1wbGljZG4ubmV0XC9zaGFyZVwvODcyNTczOF85MTA1MDMxMTc1NDE1MDcwOTg2NC5wbmciLCJ1c2VybmFtZSI6IllvdW5lcyBTYWhyYW91aSJ9&referrer=https%3A%2F%2Flms.simplilearn.com%2Fcourses%2F7489%2FDigital%2520Security%2520Fundamentals%2Fcertificate%2Fdownload-skillup&%24web_only=true"
    }
  ];

  // Skills — chips only, no percentages. Items are plain strings, or {fr,en} when they differ.
  var SKILL_GROUPS = [
    { key: "lang", icon: "</>", items: ["Python", "C", "Bash", "HTML/CSS"] },
    { key: "os", icon: "$_", items: ["Linux", "Windows Server", "Active Directory", "GPO"] },
    { key: "net", icon: "<->", items: [
      { fr: "Segmentation réseau", en: "Network segmentation" }, "Wireshark", "Cisco Packet Tracer", "pfSense"] },
    { key: "db", icon: "DB", items: ["SQL", "Oracle SQL Developer"] },
    { key: "cyber", icon: "!#", items: [
      { fr: "Audit de vulnérabilités", en: "Vulnerability assessment" },
      { fr: "Tests d'intrusion", en: "Penetration testing" },
      "Metasploit", "Burp Suite", "Nmap"] }
  ];

  // Projects — ordered newest first by each file's `date`. Each project lives in
  // its own file under assets/js/projects/ and appends its object to window.PROJECTS.
  // `demo: true` marks a placeholder card, hidden unless CONFIG.demoProjects is true.
  // A project page renders only the fields supplied: missing name/summary/tech =>
  // visible placeholder; no links => no link list.
  var PROJECTS = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
  if (!PROJECTS.length) console.warn("No project files loaded — check the <script> tags in index.html.");

  // Newest first, from the optional ISO `date` ("YYYY-MM" or "YYYY-MM-DD").
  // Undated projects sort last; equal dates keep the file order. `n` (the number
  // shown on cards and in the terminal thumb) is derived from the final order,
  // so project files never need manual numbering.
  function projectTime(p) {
    if (!p.date) return -Infinity;
    var t = Date.parse(/^\d{4}-\d{2}$/.test(p.date) ? p.date + "-01" : p.date);
    return isNaN(t) ? -Infinity : t;
  }
  PROJECTS.sort(function (a, b) {
    var ta = projectTime(a), tb = projectTime(b);
    return ta === tb ? 0 : (ta < tb ? 1 : -1);
  });
  var projectNo = 0;
  PROJECTS.forEach(function (p) {
    if (!p.demo || CONFIG.demoProjects) { projectNo += 1; p.n = String(projectNo).padStart(2, "0"); }
    if (!p.date && !p.demo) console.warn('Project "' + p.slug + '" has no date; it sorts last.');
  });

  // Articles — one file per article under assets/js/articles/, appended to
  // window.ARTICLES. `project` links an article to a project slug; `sections`
  // holds the body blocks rendered by fillArticle(). Missing article files are
  // fine: the blog index simply shows its empty state.
  var ARTICLES = Array.isArray(window.ARTICLES) ? window.ARTICLES : [];
  function articleTime(a) {
    if (!a.date) return -Infinity;
    var t = Date.parse(/^\d{4}-\d{2}$/.test(a.date) ? a.date + "-01" : a.date);
    return isNaN(t) ? -Infinity : t;
  }
  ARTICLES.sort(function (a, b) {
    var ta = articleTime(a), tb = articleTime(b);
    return ta === tb ? 0 : (ta < tb ? 1 : -1);
  });
  function articleByProject(slug) {
    return ARTICLES.filter(function (a) { return a.project === slug; })[0] || null;
  }

  /* --------------------------------------------------------------- helpers */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var lang = root.lang === "en" ? "en" : "fr";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function t(key, vars) {
    var s = (I18N[lang] && I18N[lang][key]) || (I18N.fr && I18N.fr[key]) || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace("{" + k + "}", vars[k]); });
    return s;
  }
  function ph(key, vars) { return '<span class="ph">' + t(key, vars) + "</span>"; }
  // Resolve a bilingual value: plain string stays as-is, {fr,en} picks the active language.
  function loc(v) { return v && typeof v === "object" ? (v[lang] || v.fr) : v; }
  // Escape owner-supplied text used in HTML text nodes and attributes.
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ------------------------------------------------------------------ i18n */
  function applyI18n(scope) {
    $$("[data-i18n]", scope).forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-html]", scope).forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    $$("[data-i18n-attr]", scope).forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":"); el.setAttribute(p[0], t(p[1]));
      });
    });
  }
  function setLang(next) {
    lang = next; root.lang = next; store("lang", next);
    $$(".lang-switch__btn").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === next)); });
    applyI18n(document);
    renderDynamic();
    updateThemeLabel();
    updateCvCurrent();
    route(true);
  }

  /* ----------------------------------------------------------------- theme */
  function currentTheme() { return root.dataset.theme === "light" ? "light" : "dark"; }
  function updateThemeLabel() {
    var btn = $("#theme-toggle");
    btn.removeAttribute("aria-pressed"); // label changes instead; never both
    btn.setAttribute("aria-label", currentTheme() === "dark" ? t("theme.toLight") : t("theme.toDark"));
  }
  function setTheme(next) { root.dataset.theme = next; store("theme", next); updateThemeLabel(); }

  /* ------------------------------------------------------------------ menu */
  var menuBtn = $("#menu-btn"), menuPanel = $("#menu-panel");
  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuPanel.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    ["main", ".site-footer"].forEach(function (s) { var el = $(s); if (el) el.inert = open; });
  }
  menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menuPanel.hidden) { setMenu(false); menuBtn.focus(); }
  });
  window.addEventListener("resize", function () { if (window.innerWidth >= 1100 && !menuPanel.hidden) setMenu(false); });
  menuPanel.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });

  /* ---------------------------------------------------------------- router */
  var VIEWS = ["home", "project", "blog", "article"];
  var current = "home";
  function showView(name) {
    current = name;
    VIEWS.forEach(function (v) { $("#view-" + v).hidden = v !== name; });
  }
  function route(isLangChange) {
    var h = location.hash;
    // Blog disabled (CONFIG.blog): any #/blog route falls back to the home view,
    // so a typed or shared URL never lands on placeholder articles.
    if (!CONFIG.blog && /^#\/blog(\/|$)/.test(h)) { history.replaceState(null, "", "#about"); h = "#about"; }
    var m = h.match(/^#\/([\w-]+)(?:\/([\w-]+))?/);
    if (!m) {
      // In-page anchor inside a non-home view (TOC, citations): browser already scrolled.
      var target = h.length > 1 && document.getElementById(h.slice(1));
      if (target && !target.closest("#view-home") && target.closest(".view") && !target.closest(".view").hidden) return;
    }
    var view = "home", arg = null;
    if (m) {
      arg = m[2] || null;
      if (m[1] === "projects" && arg) view = "project";
      else if (m[1] === "blog") view = arg ? "article" : "blog";
    }
    var changed = view !== current;
    showView(view);
    var name = $(".brand__name").textContent;
    if (view === "home") {
      document.title = name + " — Portfolio";
      var id = h.replace(/^#/, "");
      var el = id && id !== "top" ? document.getElementById(id) : null;
      if (isLangChange && !changed) return;
      requestAnimationFrame(function () {
        if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        else window.scrollTo({ top: 0, behavior: reduceMotion || changed ? "auto" : "smooth" });
      });
    } else {
      if (view === "project") fillProject(arg);
      else if (view === "article") fillArticle(arg);
      var h1 = $("#view-" + view + " h1");
      document.title = (h1 ? h1.textContent : view) + " — " + name;
      if (!isLangChange) { window.scrollTo(0, 0); if (h1) h1.focus({ preventScroll: true }); }
    }
    updateSpy();
  }
  window.addEventListener("hashchange", function () { setMenu(false); route(false); });

  /* ---------------------------------------------------------------- render */
  function visibleProjects() {
    return PROJECTS.filter(function (p) { return !p.demo || CONFIG.demoProjects; });
  }
  function projectName(p) { return p.name ? loc(p.name) : t("ph.projName", { n: Number(p.n) }); }
  function thumbInner(p) {
    return '<span class="thumb__icon" aria-hidden="true">&gt;_</span>' +
      '<span class="thumb__name">' + t("thumb.a") + '<span class="b">_' + p.n + '</span><span class="caret" aria-hidden="true"></span></span>';
  }
  function thumbHTML(p) {
    if (p.thumb && p.thumb.src) {
      return '<div class="thumb thumb--img"><img src="' + esc(p.thumb.src) + '" alt="' +
        esc(p.thumb.alt ? loc(p.thumb.alt) : projectName(p)) + '"' +
        (p.thumb.w ? ' width="' + p.thumb.w + '" height="' + p.thumb.h + '"' : "") +
        ' loading="lazy" decoding="async"></div>';
    }
    return '<div class="thumb" aria-hidden="true">' + thumbInner(p) + "</div>";
  }
  function cardHTML(p, row) {
    var ctx = p.context === "group" ? t("projects.ctxGroup") : t("projects.ctxIndividual");
    var title = p.name ? esc(loc(p.name)) : ph("ph.projName", { n: Number(p.n) });
    var summary = p.summary ? esc(loc(p.summary)) : ph("ph.cardSummary");
    var tech = (p.tech && p.tech.length)
      ? p.tech.slice(0, 3).map(function (x) { return '<li class="chip">' + esc(loc(x)) + "</li>"; }).join("")
      : [0, 1, 2].map(function () { return '<li class="chip">' + ph("ph.tech") + "</li>"; }).join("");
    return '<article class="project-card' + (row ? " project-card--row" : "") + '" data-context="' + p.context + '">' +
      thumbHTML(p) +
      '<div class="project-card__body"><div class="project-card__meta"><span class="badge">' + ctx + "</span>" +
      (p.article && CONFIG.blog ? '<span class="badge badge--accent">' + t("projects.article") + "</span>" : "") + "</div>" +
      '<h3 class="project-card__title"><a href="#/projects/' + p.slug + '">' + title + "</a></h3>" +
      '<p class="project-card__summary">' + summary + "</p>" +
      '<ul class="chips project-card__tech" aria-label="' + t("pj.tech") + '">' + tech + "</ul></div></article>";
  }
  function renderProjects() {
    var list = visibleProjects();
    $("#featured-projects").innerHTML = list.filter(function (p) { return p.featured; }).map(function (p) { return cardHTML(p, true); }).join("");
    $("#project-grid").innerHTML = list.map(function (p) { return cardHTML(p, false); }).join("");
    var filter = $("#project-filter");
    if (filter) filter.hidden = list.length < 2;
    applyFilter(activeFilter, true);
  }
  function renderSkills() {
    $("#skills-grid").innerHTML = SKILL_GROUPS.map(function (g) {
      var chips = g.items.map(function (it) { return '<li class="chip">' + loc(it) + "</li>"; }).join("");
      return '<section class="skill-group"><div class="skill-group__head"><span class="skill-group__icon" aria-hidden="true">' +
        g.icon.replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</span><h3 class="skill-group__title">' + t("skills.g." + g.key) + "</h3></div>" +
        '<ul class="chips">' + chips + "</ul></section>";
    }).join("");
  }
  function renderEdu() {
    $("#edu-list").innerHTML = EDU.map(function (e) {
      var end = e.end ? loc(e.end) : (e.current ? t("common.present") : "");
      return '<li class="timeline__item' + (e.current ? " timeline__item--current" : "") + '">' +
        '<span class="timeline__period">' + loc(e.start) + " — " + end + "</span>" +
        '<div class="timeline__head"><h3 class="timeline__title">' + loc(e.degree) + "</h3></div>" +
        '<p><span class="timeline__org">' + e.org + '</span> <span class="timeline__place">· ' + loc(e.place) + "</span></p>" +
        (e.desc ? '<p class="timeline__desc">' + loc(e.desc) + "</p>" : "") + "</li>";
    }).join("");
  }
  function renderExp() {
    $("#exp-list").innerHTML = EXP.map(function (e) {
      var bullets = e.bullets.map(function (b) { return "<li>" + loc(b) + "</li>"; }).join("");
      return '<li class="timeline__item">' +
        '<span class="timeline__period">' + loc(e.period) + "</span>" +
        '<div class="timeline__head"><h3 class="timeline__title">' + loc(e.role) + '</h3><span class="timeline__org">' + e.org + "</span></div>" +
        '<p><span class="timeline__place">' + loc(e.place) + "</span></p>" +
        '<ul class="bullets">' + bullets + "</ul></li>";
    }).join("");
  }
  function renderCerts() {
    $("#cert-list").innerHTML = CERTS.map(function (c) {
      var meta = c.status
        ? '<span class="badge badge--accent">' + loc(c.status) + "</span>"
        : (c.year ? "<span>" + t("certs.issued") + " " + c.year + "</span>" : "");
      var verify = c.verify
        ? '<a class="cert__verify link link--arrow link--accent" href="' + c.verify + '" target="_blank" rel="noopener noreferrer">' + t("certs.verify") + "</a>"
        : "";
      return '<li class="cert"><div><h3 class="cert__title">' + c.name + '</h3><p class="cert__issuer">' + c.issuer +
        '</p><p class="cert__dates">' + meta + "</p></div>" + verify + "</li>";
    }).join("");
  }
  function renderAvailability() {
    var el = $("#availability");
    var active = CONFIG.availability.filter(function (k) { return k === "alternance" || k === "stage" || k === "emploi"; });
    if (!active.length) { el.hidden = true; $("#availability-text").textContent = ""; return; }
    $("#availability-text").innerHTML = "<strong>" + t("avail.prefix") + (lang === "fr" ? " :" : ":") + "</strong> " +
      active.map(function (k) { return t("avail." + k); }).join(" · ");
    el.hidden = false;
  }
  // Blog index: rendered from ARTICLES so a new article never needs HTML edits.
  function renderBlog() {
    var el = $("#blog-list"); if (!el) return;
    if (!ARTICLES.length) {
      el.innerHTML = '<li class="post-row"><p class="post-row__sub">' + t("blog.empty") + "</p></li>";
      return;
    }
    el.innerHTML = ARTICLES.map(function (a) {
      var p = PROJECTS.filter(function (x) { return x.slug === a.project; })[0];
      var project = p ? projectName(p) : "";
      return '<li class="post-row"><span class="post-row__date">' + esc(loc(a.dateLabel)) + "</span>" +
        '<div><h2 class="post-row__title"><a href="#/blog/' + esc(a.slug) + '">' + esc(loc(a.title)) + "</a></h2>" +
        '<p class="post-row__sub">' + (project ? t("blog.about") + " " + esc(project) + " · " : "") +
        esc(loc(a.readTime)) + "</p></div>" +
        '<span class="post-row__langs"><span class="badge badge--accent">FR</span><span class="badge badge--accent">EN</span></span></li>';
    }).join("");
  }

  // Article body. Each block is optional; unknown blocks are ignored rather than
  // rendered as placeholders, so an incomplete article stays readable.
  function inlineText(s) {
    // Escape first, then turn `backticked` spans into inline code.
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
  }
  function codeBlockHTML(c) {
    return '<div class="codeblock"><div class="codeblock__bar"><span>' + esc(c.label || "bash") +
      '</span><button type="button" class="codeblock__copy" data-copy>' + t("art.copy") + "</button></div>" +
      '<pre tabindex="0"><code>' + esc(c.text) + "</code></pre></div>";
  }
  function tableHTML(tb) {
    var head = loc(tb.head) || [];
    var rows = loc(tb.rows) || [];
    return '<div class="table-wrap"><table>' +
      (head.length ? "<thead><tr>" + head.map(function (h) { return '<th scope="col">' + esc(h) + "</th>"; }).join("") + "</tr></thead>" : "") +
      "<tbody>" + rows.map(function (r) {
        return "<tr>" + r.map(function (c) { return "<td>" + esc(loc(c)) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
  }
  function figureHTML(f, n) {
    // Cap a small screenshot at its native width: the reading column is wider,
    // and upscaling a 400 px capture would only make it blurry.
    var cap = f.w && f.w < 704 ? ' style="max-width:' + f.w + 'px"' : "";
    return '<figure class="figure"' + cap + '><div class="figure__frame"><img src="' + esc(f.src) + '" alt="' + esc(loc(f.alt)) + '"' +
      (f.w ? ' width="' + f.w + '" height="' + f.h + '"' : "") + ' loading="lazy" decoding="async"></div>' +
      '<figcaption><strong>' + t("art.figure", { n: n }) + "</strong> " + esc(loc(f.caption)) + "</figcaption></figure>";
  }
  // Project captures open full-size in a new tab; the frame is the link itself so
  // the whole image is a target without nesting interactive elements.
  function linkedFigureHTML(f) {
    var cap = f.w && f.w < 704 ? ' style="max-width:' + f.w + 'px"' : "";
    return '<figure class="figure"' + cap + '><a class="figure__frame" href="' + esc(f.src) + '" target="_blank" rel="noopener noreferrer">' +
      '<img src="' + esc(f.src) + '" alt="' + esc(loc(f.alt)) + '"' +
      (f.w ? ' width="' + f.w + '" height="' + f.h + '"' : "") + ' loading="lazy" decoding="async"></a>' +
      '<figcaption>' + esc(loc(f.caption)) + "</figcaption></figure>";
  }
  function articleBodyHTML(a) {
    var figNo = 0;
    return a.sections.map(function (s) {
      return '<section aria-labelledby="' + esc(s.id) + '"><h2 id="' + esc(s.id) + '">' + esc(loc(s.title)) + "</h2>" +
        s.blocks.map(function (b) {
          if (b.h3) return "<h3>" + esc(loc(b.h3)) + "</h3>";
          if (b.p) {
            var html = "<p>" + inlineText(loc(b.p));
            if (b.ref) html += ' <a class="cite" href="#src-' + b.ref + '" id="ref-' + b.ref + '" aria-label="Source ' + b.ref + '">[' + b.ref + "]</a>";
            return html + "</p>";
          }
          if (b.list) return '<ul class="list">' + loc(b.list).map(function (x) { return "<li>" + inlineText(x) + "</li>"; }).join("") + "</ul>";
          if (b.callout) {
            var ch = inlineText(loc(b.callout));
            if (b.ref) ch += ' <a class="cite" href="#src-' + b.ref + '" id="ref-' + b.ref + '" aria-label="Source ' + b.ref + '">[' + b.ref + "]</a>";
            return '<div class="callout"><span class="callout__label">' + esc(loc(b.label) || t("art.note")) + "</span>" + ch + "</div>";
          }
          if (b.code) return codeBlockHTML(b.code);
          if (b.table) return tableHTML(b.table);
          if (b.figure) { figNo += 1; return figureHTML(b.figure, figNo); }
          return "";
        }).join("") + "</section>";
    }).join("");
  }
  var currentArticle = null;
  function fillArticle(slug) {
    if (!ARTICLES.length) return;
    var a = ARTICLES.filter(function (x) { return x.slug === slug; })[0];
    if (!a) {
      a = ARTICLES[0];
      history.replaceState(null, "", "#/blog/" + a.slug);
    }
    currentArticle = a;
    var p = PROJECTS.filter(function (x) { return x.slug === a.project; })[0];

    $("#art-bc-title").textContent = loc(a.title);
    $("#art-title").textContent = loc(a.title);
    $("#art-lead").textContent = loc(a.lead);
    $("#art-meta").innerHTML = "<span>" + esc(loc(a.dateLabel)) + '</span><span aria-hidden="true">·</span>' +
      "<span>" + esc(loc(a.readTime)) + '</span><span aria-hidden="true">·</span>' +
      '<span class="badge badge--accent">' + t(a.voice === "we" ? "art.voiceWe" : "art.voiceI") + "</span>";
    $("#art-project").innerHTML = p
      ? "<span>" + t("art.project") + '</span> <a class="link link--accent" href="#/projects/' + esc(p.slug) + '">' + esc(projectName(p)) + "</a>"
      : "";
    $("#art-toc").innerHTML = a.sections.map(function (s) {
      return '<li><a href="#' + esc(s.id) + '">' + esc(loc(s.title)) + "</a></li>";
    }).join("");
    $("#art-body").innerHTML = articleBodyHTML(a);
    var sources = a.sources || [];
    $("#art-sources").innerHTML = sources.map(function (s, i) {
      return '<li id="src-' + (i + 1) + '"><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(loc(s.label)) + "</a></li>";
    }).join("");
    $("#art-sources-wrap").hidden = !sources.length;
    renderRelated();
  }
  // Related links on an article: its project, plus another article when one exists.
  // Nothing is invented: with a single article only the project card is shown.
  function renderRelated() {
    var el = $("#related-grid"); if (!el) return;
    var html = "";
    if (currentArticle) {
      var p = PROJECTS.filter(function (x) { return x.slug === currentArticle.project; })[0];
      if (p) {
        html += '<a class="article-teaser" href="#/projects/' + esc(p.slug) + '"><span class="article__meta">' + t("art.relProject") +
          '</span><span class="article-teaser__title">' + esc(projectName(p)) + "</span></a>";
      }
      var i = ARTICLES.indexOf(currentArticle);
      var other = ARTICLES[i + 1] || ARTICLES[i - 1];
      if (other) {
        html += '<a class="article-teaser" href="#/blog/' + esc(other.slug) + '"><span class="article__meta">' + t("art.relArticle") +
          '</span><span class="article-teaser__title">' + esc(loc(other.title)) + "</span></a>";
      }
    }
    el.innerHTML = html;
  }
  function demoBlocks() {
    return '<section class="detail__block"><h2>' + t("pj.goal") + '</h2><p class="prose">' + ph("ph.pjBlock") + "</p></section>" +
      '<section class="detail__block"><h2>' + t("pj.contribution") + '</h2><ul class="bullets"><li>' + ph("ph.bullet1") + "</li><li>" + ph("ph.bullet2") + "</li></ul></section>" +
      '<section class="detail__block"><h2>' + t("pj.learned") + '</h2><p class="prose">' + ph("ph.pjBlock") + "</p></section>";
  }
  function fillProject(slug) {
    var list = visibleProjects();
    if (!list.length) return;
    var p = list.filter(function (x) { return x.slug === slug; })[0];
    if (!p) {
      // Unknown or hidden slug: show the first real project and fix the URL.
      p = list[0];
      history.replaceState(null, "", "#/projects/" + p.slug);
    }
    var i = list.indexOf(p);
    var label = projectName(p);

    $("#pj-title").innerHTML = p.name ? esc(label) : ph("ph.projName", { n: Number(p.n) });
    $("#bc-project").textContent = label;
    $("#pj-lead").innerHTML = p.lead ? esc(loc(p.lead)) : ph("ph.pjSummary");

    // Header cover: only the owner's thumbnail. Without one the header stays
    // text-only instead of reserving a full 21:9 block for a decorative graphic.
    var hero = $("#pj-hero"), thumb = $("#pj-thumb");
    if (p.thumb && p.thumb.src) {
      hero.classList.add("has-media");
      thumb.hidden = false;
      thumb.innerHTML = '<a href="' + esc(p.thumb.src) + '" target="_blank" rel="noopener noreferrer"><img src="' + esc(p.thumb.src) + '" alt="' +
        esc(p.thumb.alt ? loc(p.thumb.alt) : projectName(p)) + '"' +
        (p.thumb.w ? ' width="' + p.thumb.w + '" height="' + p.thumb.h + '"' : "") +
        ' decoding="async"></a>';
    } else {
      hero.classList.remove("has-media");
      thumb.hidden = true;
      thumb.innerHTML = "";
    }

    // Context (group vs individual) is already carried by the card badge and, when the
    // project has an article, by the article's voice badge. The header does not repeat it:
    // only the "Article" marker is shown here.
    var badges = $("#pj-badges");
    badges.innerHTML = (p.article && CONFIG.blog)
      ? '<span class="badge badge--accent">' + t("projects.article") + "</span>"
      : "";
    badges.hidden = !badges.innerHTML;
    $("#pj-period").innerHTML = p.period ? esc(loc(p.period)) : ph("ph.dateRange");
    $("#pj-status").innerHTML = p.status ? esc(loc(p.status)) : ph("ph.pjStatus");

    // Key figures: only counts supplied by the owner. Optional.
    var statsEl = $("#pj-stats");
    if (p.stats && p.stats.length) {
      statsEl.hidden = false;
      statsEl.innerHTML = p.stats.map(function (s) {
        return '<li class="stat"><span class="stat__value">' + esc(loc(s.value)) + '</span><span class="stat__label">' + esc(loc(s.label)) + "</span></li>";
      }).join("");
    } else {
      statsEl.hidden = true; statsEl.innerHTML = "";
    }

    // Lifecycle strip: the method in one line. Optional.
    var phasesEl = $("#pj-phases");
    if (p.phases && p.phases.length) {
      phasesEl.hidden = false;
      phasesEl.innerHTML = p.phases.map(function (x, n) {
        return '<li class="phase"><span class="phase__num">' + ("0" + (n + 1)).slice(-2) + '</span><span>' + esc(loc(x)) + "</span></li>";
      }).join("");
    } else {
      phasesEl.hidden = true; phasesEl.innerHTML = "";
    }

    // Flexible content blocks: paragraph or bullet list, then an optional figure,
    // table, command snippet and closing paragraph, in the order supplied.
    var toc = [];
    if (p.blocks && p.blocks.length) {
      $("#pj-blocks").innerHTML = p.blocks.map(function (b, n) {
        var id = "pj-b-" + (n + 1);
        var body = "";
        if (b.body) {
          body = b.type === "list"
            ? '<ul class="bullets">' + loc(b.body).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"
            : '<p class="prose">' + esc(loc(b.body)) + "</p>";
        }
        if (b.figure) body += linkedFigureHTML(b.figure);
        if (b.table) body += tableHTML(b.table);
        if (b.code) {
          if (b.codeNote) body += '<p class="prose">' + esc(loc(b.codeNote)) + "</p>";
          body += '<div class="codeblock"><div class="codeblock__bar"><span>' + esc(b.code.label || "bash") +
            '</span><button type="button" class="codeblock__copy" data-copy>' + t("art.copy") + "</button></div>" +
            '<pre tabindex="0"><code>' + esc(b.code.text) + "</code></pre></div>";
        }
        if (b.after) body += '<p class="prose">' + esc(loc(b.after)) + "</p>";
        if (b.title) toc.push({ id: id, title: loc(b.title) });
        return '<section class="detail__block" id="' + id + '"><h2>' + esc(loc(b.title)) + "</h2>" + body + "</section>";
      }).join("");
    } else {
      $("#pj-blocks").innerHTML = demoBlocks();
    }

    // In-page table of contents in the aside; hidden when there is nothing to list.
    var tocCard = $("#pj-toc-card");
    if (toc.length > 1) {
      tocCard.hidden = false;
      $("#pj-toc").innerHTML = toc.map(function (x) {
        return '<li><a href="#' + esc(x.id) + '">' + esc(x.title) + "</a></li>";
      }).join("");
    } else {
      tocCard.hidden = true; $("#pj-toc").innerHTML = "";
    }

    $("#pj-tech").innerHTML = (p.tech && p.tech.length)
      ? p.tech.map(function (x) { return '<li class="chip">' + esc(loc(x)) + "</li>"; }).join("")
      : [0, 1, 2].map(function () { return '<li class="chip">' + ph("ph.tech") + "</li>"; }).join("");

    // Links: only real targets are rendered, never a dead "#". The related
    // article is an internal link, so it keeps the site's own navigation arrow.
    var article = (p.article && CONFIG.blog) ? articleByProject(p.slug) : null;
    var links = [];
    if (article) links.push({ href: "#/blog/" + article.slug, label: t("pj.readArticle"), internal: true });
    if (p.links) {
      if (p.links.repo) links.push({ href: p.links.repo, label: t("pj.repo") });
      if (p.links.demo) links.push({ href: p.links.demo, label: t("pj.demo") });
      if (p.links.report) links.push({ href: p.links.report, label: t("pj.report") });
    }
    $("#pj-links").innerHTML = links.length
      ? links.map(function (l) {
          return l.internal
            ? '<a href="' + esc(l.href) + '"><span>' + l.label + '</span><span aria-hidden="true">→</span></a>'
            : '<a href="' + esc(l.href) + '" target="_blank" rel="noopener noreferrer"><span>' + l.label + '</span><span aria-hidden="true">↗</span></a>';
        }).join("")
      : '<p class="form__note">' + t("pj.noLinks") + "</p>";

    // Prominent article call to action under the lead (hidden when none exists).
    var cta = $("#pj-article-cta");
    if (cta) {
      cta.hidden = !article;
      if (article) {
        var ctaLink = $("#pj-article-cta-link");
        ctaLink.href = "#/blog/" + article.slug;
        ctaLink.innerHTML = "<span>" + t("pj.readArticle") + '</span><span aria-hidden="true">→</span>';
      }
    }

    // Team (only when supplied): name + optional profile link, as an aside card.
    var teamCard = $("#pj-team-card");
    if (p.team && p.team.length) {
      teamCard.hidden = false;
      $("#pj-team").innerHTML = p.team.map(function (m) {
        var name = esc(m.name);
        return m.url
          ? '<a href="' + esc(m.url) + '" target="_blank" rel="noopener noreferrer"><span>' + name + '</span><span aria-hidden="true">↗</span></a>'
          : "<span>" + name + "</span>";
      }).join("");
    } else {
      teamCard.hidden = true;
      $("#pj-team").innerHTML = "";
    }

    // Screenshots (only when supplied).
    var gallery = $("#pj-gallery-wrap");
    if (p.gallery && p.gallery.length) {
      gallery.hidden = false;
      $("#pj-gallery").innerHTML = p.gallery.map(linkedFigureHTML).join("");
    } else {
      gallery.hidden = true;
      $("#pj-gallery").innerHTML = "";
    }

    // Disclaimer (only when supplied).
    var note = $("#pj-note");
    if (p.disclaimer) {
      note.hidden = false;
      $("#pj-note-text").textContent = loc(p.disclaimer);
    } else {
      note.hidden = true;
      $("#pj-note-text").textContent = "";
    }

    // Pager: hidden when there is only one project to navigate.
    var pager = $("#pj-pager");
    if (list.length > 1) {
      pager.hidden = false;
      var prev = list[(i + list.length - 1) % list.length], next = list[(i + 1) % list.length];
      $("#pj-prev").href = "#/projects/" + prev.slug;
      $("#pj-prev").innerHTML = '<span class="pager__label">← ' + t("pj.prev") + '</span><span class="pager__title">' + esc(projectName(prev)) + "</span>";
      $("#pj-next").href = "#/projects/" + next.slug;
      $("#pj-next").innerHTML = '<span class="pager__label">' + t("pj.next") + ' →</span><span class="pager__title">' + esc(projectName(next)) + "</span>";
    } else {
      pager.hidden = true;
      $("#pj-prev").innerHTML = ""; $("#pj-next").innerHTML = "";
    }
  }
  function renderDynamic() {
    renderProjects(); renderSkills(); renderEdu(); renderExp(); renderCerts();
    renderAvailability(); renderBlog(); renderRelated();
    var fy = $("#footer-year"); if (fy) fy.textContent = String(new Date().getFullYear());
    if (current === "project") { var m = location.hash.match(/^#\/projects\/([\w-]+)/); fillProject(m && m[1]); }
    else if (current === "article") { var am = location.hash.match(/^#\/blog\/([\w-]+)/); fillArticle(am && am[1]); }
    $$(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----------------------------------------------------------- interactions */
  // Project filter (aria-pressed toggle buttons + polite live region)
  var activeFilter = "all";
  function applyFilter(f, silent) {
    activeFilter = f;
    var shown = 0;
    $$("#project-grid .project-card").forEach(function (c) {
      var show = f === "all" || c.dataset.context === f; c.hidden = !show; if (show) shown++;
    });
    $$(".filter__btn").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.filter === f)); });
    $("#filter-status").textContent = silent ? "" : t("projects.count", { n: shown });
  }
  $$(".filter__btn").forEach(function (b) { b.addEventListener("click", function () { applyFilter(b.dataset.filter); }); });

  // Language switch + theme toggle
  $$(".lang-switch__btn").forEach(function (b) { b.addEventListener("click", function () { setLang(b.dataset.lang); }); });
  $("#theme-toggle").addEventListener("click", function () { setTheme(currentTheme() === "dark" ? "light" : "dark"); });
  document.addEventListener("click", function (e) {
    var sw = e.target.closest("[data-switch-lang]");
    if (sw) { e.preventDefault(); setLang(lang === "fr" ? "en" : "fr"); }
    var top = e.target.closest("[data-top]");
    if (top) { e.preventDefault(); location.hash = "#top"; if (current === "home") window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); }
  });

  // CV links: point at the two supplied PDFs. A link with no target shows a toast instead.
  var toastTimer;
  function toast(msg) {
    var el = $("#toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.setAttribute("role", "status");
      el.style.cssText = "position:fixed;left:50%;bottom:1.25rem;transform:translateX(-50%);z-index:80;background:var(--surface);color:var(--text);border:1px solid var(--accent-border);border-radius:8px;padding:.6rem 1rem;font-size:.875rem;box-shadow:var(--shadow-md);max-width:calc(100vw - 2rem)";
      document.body.appendChild(el); }
    el.textContent = msg; el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.hidden = true; }, 2600);
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-cv]");
    if (a) {
      var d = a.closest("details"); if (d) d.open = false;
      var href = a.getAttribute("href");
      if (!href || href === "#") { e.preventDefault(); toast(t("cv.unavailable")); }
      return;
    }
    if (e.target.closest('a[href="#"]')) e.preventDefault();
    $$("details.cv-split[open]").forEach(function (d) { if (!d.contains(e.target)) d.open = false; });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") $$("details.cv-split[open]").forEach(function (d) { d.open = false; d.querySelector("summary").focus(); });
  });
  function updateCvCurrent() { $$("[data-cv]").forEach(function (a) { a.dataset.current = String(a.dataset.cv === lang); }); }

  // Code copy
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]"); if (!b) return;
    var code = b.closest(".codeblock").querySelector("code").textContent;
    var done = function () { b.textContent = t("art.copied"); setTimeout(function () { b.textContent = t("art.copy"); }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, done); else done();
  });

  // Contact card: copy the email address, with a short visual confirmation.
  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-9999px;left:-9999px";
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy-email]");
    if (!btn) return;
    e.preventDefault();
    var text = btn.querySelector(".contact-copy__text");
    var live = $("#copy-status");
    var reset = function () {
      btn.classList.remove("is-copied");
      btn.setAttribute("aria-label", t("contact.copyEmail"));
      btn.setAttribute("title", t("contact.copyEmail"));
      if (text) text.textContent = t("contact.copy");
      if (live) live.textContent = "";
    };
    var done = function (ok) {
      if (!ok) {
        if (live) live.textContent = t("contact.copyError");
        toast(t("contact.copyError"));
        return;
      }
      btn.classList.add("is-copied");
      btn.setAttribute("aria-label", t("contact.copiedEmail"));
      btn.setAttribute("title", t("contact.copiedEmail"));
      if (text) text.textContent = t("contact.copied");
      if (live) live.textContent = t("contact.copiedEmail");
      clearTimeout(btn._copyTimer);
      btn._copyTimer = setTimeout(reset, 2000);
    };
    copyText(btn.getAttribute("data-copy-email")).then(function () { done(true); }, function () { done(false); });
  });

  // Contact form: posts to CONFIG.contactEndpoint (Formspree-compatible). With no
  // endpoint configured it opens the visitor's mail app instead — it never fakes a
  // successful submission. The endpoint is public; no secret belongs in this file.
  var contactForm = $("#contact-form");
  var formStatus = $("#form-status");
  var formSubmit = $("#form-submit");
  var formSubmitting = false;

  function contactAddress() {
    var a = $('.contact-links a[href^="mailto:"]');
    return a ? a.getAttribute("href").slice(7).split("?")[0] : "";
  }
  function contactEndpoint() {
    var url = String(CONFIG.contactEndpoint || "").trim();
    return /^https:\/\/\S+$/i.test(url) ? url : "";
  }
  function fieldError(el, key) {
    var box = $("#" + el.id + "-err");
    el.setAttribute("aria-invalid", key ? "true" : "false");
    if (box) { box.textContent = key ? t(key) : ""; box.hidden = !key; }
  }
  function setFormStatus(key, kind) {
    formStatus.textContent = key ? t(key) : "";
    formStatus.classList.toggle("is-error", kind === "error");
    formStatus.classList.toggle("is-success", kind === "success");
  }
  function validateForm() {
    var name = $("#f-name"), email = $("#f-email"), message = $("#f-msg"), bad = null;
    [name, email, message].forEach(function (el) { fieldError(el, ""); });
    if (!name.value.trim()) { fieldError(name, "form.errFieldRequired"); bad = bad || { el: name, key: "form.errRequired" }; }
    var address = email.value.trim();
    if (!address) { fieldError(email, "form.errFieldRequired"); bad = bad || { el: email, key: "form.errRequired" }; }
    else if (address.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(address)) {
      fieldError(email, "form.errEmail"); bad = bad || { el: email, key: "form.errEmail" };
    }
    if (!message.value.trim()) { fieldError(message, "form.errFieldRequired"); bad = bad || { el: message, key: "form.errRequired" }; }
    return bad;
  }
  contactForm.addEventListener("input", function (e) {
    var el = e.target;
    if (el && el.id && el.getAttribute("aria-invalid") === "true") fieldError(el, "");
    if (formStatus.textContent) setFormStatus("", "");
  });
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (formSubmitting) return;
    var bad = validateForm();
    if (bad) { setFormStatus(bad.key, "error"); bad.el.focus(); return; }
    var gotcha = $("#f-gotcha");
    if (gotcha && gotcha.value) return;
    var name = $("#f-name").value.trim();
    var email = $("#f-email").value.trim();
    var subject = $("#f-subject").value.trim();
    var message = $("#f-msg").value.trim();
    var endpoint = contactEndpoint();
    if (!endpoint) {
      var body = t("form.mailBody", { name: name, email: email, message: message });
      setFormStatus("form.mailOpening", "");
      window.location.href = "mailto:" + contactAddress() +
        "?subject=" + encodeURIComponent(subject || t("form.mailSubject")) +
        "&body=" + encodeURIComponent(body);
      return;
    }
    if (!window.fetch || !window.FormData) { setFormStatus("form.errNetwork", "error"); return; }
    formSubmitting = true;
    formSubmit.disabled = true;
    formSubmit.setAttribute("aria-busy", "true");
    var label = $("#form-submit-label");
    if (label) label.textContent = t("form.sending");
    setFormStatus("form.sending", "");
    var data = new FormData();
    data.set("name", name);
    data.set("email", email);
    // Formspree uses `subject` as the notification email's Subject header and
    // `email` as Reply-To. Keep a stable prefix so the owner can filter on it.
    var mailSubject = "[Portfolio] " + (subject || name);
    data.set("subject", mailSubject);
    data.set("message", message);
    data.set("_replyto", email);
    data.set("_subject", mailSubject);
    data.set("_language", lang);
    var finish = function () {
      formSubmitting = false;
      formSubmit.disabled = false;
      formSubmit.removeAttribute("aria-busy");
      if (label) label.textContent = t("form.send");
    };
    fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        contactForm.reset();
        setFormStatus("form.ok", "success");
      })
      .catch(function (err) {
        console.error("Contact form error:", err);
        setFormStatus("form.errSend", "error");
      })
      .then(finish, finish);
  });

  // Header border + scroll-spy + reveal
  var header = $("#site-header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var visible = {};
  var spy = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
    updateSpy();
  }, { rootMargin: "-35% 0px -55% 0px" }) : null;
  function updateSpy() {
    var id = null;
    if (current === "home") ["about", "education", "skills", "projects", "experience", "certifications", "contact"].forEach(function (s) { if (visible[s]) id = s; });
    $$("[data-section]").forEach(function (a) { if (a.dataset.section === id) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
  }
  if (spy) $$("#view-home > section").forEach(function (s) { spy.observe(s); });

  var rev = "IntersectionObserver" in window && !reduceMotion ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); rev.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  function observeReveals() { $$(".reveal").forEach(function (el) { if (rev) rev.observe(el); else el.classList.add("is-visible"); }); }

  /* ------------------------------------------------------------------ init */
  // Blog disabled: drop every link into the blog/article views (footer, project aside).
  if (!CONFIG.blog) $$("[data-blog-link]").forEach(function (el) { el.remove(); });
  $$(".lang-switch__btn").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
  applyI18n(document);
  renderDynamic();
  $$(".reveal").forEach(function (el) { el.classList.remove("is-visible"); });
  observeReveals();
  updateThemeLabel();
  updateCvCurrent();
  route(false);
})();
