/* ==========================================================================
   Hidden demo projects
   Placeholder cards, hidden while CONFIG.demoProjects is false.
   One project per file. Each file appends its object to window.PROJECTS;
   index.html loads these files before app.js, which then sorts them by `date`
   (newest first). See README.md in this folder.
   ========================================================================== */

(window.PROJECTS = window.PROJECTS || []).push(
  // Undated on purpose: placeholders sort after real projects, in file order.
  { slug: "project-02", context: "group", featured: false, article: false, demo: true },
  { slug: "project-03", context: "individual", featured: false, article: false, demo: true },
  { slug: "project-04", context: "individual", featured: false, article: false, demo: true },
  { slug: "project-05", context: "group", featured: false, article: false, demo: true },
  { slug: "project-06", context: "individual", featured: false, article: false, demo: true }
);
