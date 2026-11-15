/* Maison Noire draft. Nothing in this file sends data over the network; subscribe and order only show a "not sent" status. */
(function () {
  var catalog = window.MAISON;
  var I18N = window.MN_I18N;
  if (!catalog || !I18N) return;

  var THEME_KEY = "mn-theme";
  var LANG_KEY = "mn-lang";
  var root = document.documentElement;
  var page = document.body.getAttribute("data-page");
  var active = "all";
  var lastFocus = null;
  var openId = null;
  var modal, modalBody, modalStatus;
  var lang = I18N.resolve(read(LANG_KEY));
  var lightQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;

  function read(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function write(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* storage blocked: keep in memory only */ }
  }
  function t(key) { return I18N.t(lang, key); }

  /* ---------- Theme: system | dark | light ---------- */
  function themePref() {
    var v = read(THEME_KEY);
    return v === "dark" || v === "light" ? v : "system";
  }
  function applyTheme(pref) {
    var effective = pref === "system" ? (lightQuery && lightQuery.matches ? "light" : "dark") : pref;
    root.setAttribute("data-theme", effective);
    root.setAttribute("data-theme-pref", pref);
    root.style.colorScheme = effective;
    var select = document.getElementById("theme-select");
    if (select) select.value = pref;
  }
  function bindTheme() {
    var select = document.getElementById("theme-select");
    if (select) {
      select.addEventListener("change", function () {
        var pref = select.value === "dark" || select.value === "light" ? select.value : "system";
        write(THEME_KEY, pref);
        applyTheme(pref);
      });
    }
    if (lightQuery) {
      var onSystemChange = function () { if (themePref() === "system") applyTheme("system"); };
      if (lightQuery.addEventListener) lightQuery.addEventListener("change", onSystemChange);
      else if (lightQuery.addListener) lightQuery.addListener(onSystemChange);
    }
    applyTheme(themePref());
  }

  /* ---------- Language ---------- */
  function money(n) {
    var locale = I18N.get(lang).locale;
    try {
      return new Intl.NumberFormat(locale, { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
    } catch (e) {
      return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
    }
  }

  function buildLangMenu() {
    var select = document.getElementById("lang-select");
    if (!select) return;
    select.innerHTML = "";
    I18N.languages.forEach(function (l) {
      var option = document.createElement("option");
      option.value = l.code;
      option.textContent = l.name;
      option.lang = l.code;
      option.dir = l.dir;
      select.appendChild(option);
    });
    select.value = lang;
    select.addEventListener("change", function () {
      write(LANG_KEY, select.value);
      applyLang(select.value);
    });
  }

  function translateStatic() {
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = t(nodes[i].getAttribute("data-i18n"));
    var labelled = document.querySelectorAll("[data-i18n-aria]");
    for (var j = 0; j < labelled.length; j++) labelled[j].setAttribute("aria-label", t(labelled[j].getAttribute("data-i18n-aria")));
    var statuses = document.querySelectorAll("[data-status-key]");
    for (var k = 0; k < statuses.length; k++) {
      if (!statuses[k].hidden) statuses[k].textContent = t(statuses[k].getAttribute("data-status-key"));
    }
    var titleKey = document.body.getAttribute("data-title-key");
    document.title = titleKey ? t(titleKey) + " — Maison Noire" : "Maison Noire";
  }

  function applyLang(code) {
    lang = I18N.resolve(code);
    var meta = I18N.get(lang);
    root.lang = lang;
    root.dir = meta.dir;
    var select = document.getElementById("lang-select");
    if (select) select.value = lang;
    translateStatic();
    render();
    if (modal && !modal.hidden && openId) fillModal(openId);
    root.classList.remove("i18n-pending");
  }

  /* ---------- Catalogue ---------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function findItem(id) {
    var all = catalog.jewelry.concat(catalog.cosmetics);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  function isCosmetic(item) { return item.id.charAt(0) === "c"; }

  function compositionHtml(item) {
    if (!isCosmetic(item)) return "";
    return '<p class="accent mt-4 text-[0.68rem] uppercase tracking-[0.2em]">' + escapeHtml(t("card.composition")) + '</p>' +
      '<p class="muted mt-1 text-sm leading-relaxed">' + escapeHtml(t("p." + item.id + ".comp")) + "</p>";
  }

  function reviewsHtml(item) {
    if (!item.reviews || !item.reviews.length) return "";
    return '<p class="accent mt-4 text-[0.68rem] uppercase tracking-[0.2em]">' + escapeHtml(t("card.notes")) + "</p>" +
      item.reviews.map(function (review, i) {
        var key = "p." + item.id + ".review" + (i ? "." + (i + 1) : "");
        return '<blockquote class="review muted mt-2 text-sm"><p>' + escapeHtml(t(key)) + '</p>' +
          '<cite class="faint mt-1 block text-xs not-italic"><bdi>' + escapeHtml(review.by) + "</bdi></cite></blockquote>";
      }).join("");
  }

  function card(item) {
    return (
      '<article class="tilt-wrap">' +
        '<div class="tilt-card glass flex h-full flex-col rounded-3xl p-4" data-tilt>' +
          '<img class="product-photo" src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '" loading="lazy">' +
          '<p class="accent mt-4 text-[0.68rem] uppercase tracking-[0.22em]">' + escapeHtml(t("type." + item.type)) + "</p>" +
          '<h3 class="font-display display mt-2 text-2xl">' + escapeHtml(item.name) + "</h3>" +
          '<p class="muted mt-2 text-sm leading-relaxed">' + escapeHtml(t("p." + item.id + ".desc")) + "</p>" +
          compositionHtml(item) +
          reviewsHtml(item) +
          '<div class="mt-auto flex items-center justify-between gap-3 pt-6">' +
            '<p class="price text-sm">' + escapeHtml(money(item.price)) + "</p>" +
            '<button type="button" class="btn-ghost rounded-full px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em]" data-order="' + escapeHtml(item.id) + '">' + escapeHtml(t("card.order")) + "</button>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function listForPage() {
    if (page === "jewelry") return catalog.jewelry;
    if (page === "cosmetics") return catalog.cosmetics;
    return catalog.jewelry.concat(catalog.cosmetics).filter(function (item) { return item.featured; });
  }

  function render() {
    var mount = document.getElementById("catalog");
    if (!mount) return;
    var items = listForPage().filter(function (item) {
      return page === "home" || active === "all" || item.type === active;
    });
    if (!items.length) {
      mount.innerHTML = '<p class="faint text-sm">' + escapeHtml(t("card.empty")) + "</p>";
      return;
    }
    mount.innerHTML = items.map(card).join("");
    bindTilt(mount);
    var buttons = mount.querySelectorAll("[data-order]");
    for (var i = 0; i < buttons.length; i++) buttons[i].addEventListener("click", onOrderClick);
  }

  function onOrderClick(event) {
    openOrder(event.currentTarget.getAttribute("data-order"), event.currentTarget);
  }

  /* Tilt uses physical screen coordinates, so it follows the pointer the same way in LTR and RTL. */
  function bindTilt(scope) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var cards = scope.querySelectorAll("[data-tilt]");
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener("mousemove", onTilt);
      cards[i].addEventListener("mouseleave", function (event) {
        event.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg)";
      });
    }
  }

  function onTilt(event) {
    var el = event.currentTarget;
    var rect = el.getBoundingClientRect();
    var x = (event.clientX - rect.left) / rect.width - 0.5;
    var y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = "rotateY(" + (x * 10).toFixed(2) + "deg) rotateX(" + (-y * 10).toFixed(2) + "deg)";
  }

  /* ---------- Order modal (never sends) ---------- */
  function mountModal() {
    modal = document.createElement("div");
    modal.id = "order-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="glass modal-panel w-full max-w-lg rounded-3xl p-6" role="dialog" aria-modal="true" aria-labelledby="order-title">' +
        '<div class="flex items-start justify-between gap-4">' +
          '<div><p class="accent text-[0.68rem] uppercase tracking-[0.22em]" data-i18n="modal.kicker"></p><h2 id="order-title" class="font-display display mt-2 text-3xl"></h2></div>' +
          '<button type="button" class="btn-ghost modal-close rounded-full px-3 py-1 text-sm" data-close data-i18n="modal.close"></button>' +
        "</div>" +
        '<div id="order-copy" class="muted mt-4 text-sm leading-relaxed"></div>' +
        '<form id="order-form" class="mt-5 grid gap-3" action="javascript:void(0)" method="post" novalidate onsubmit="event.preventDefault(); return false;">' +
          '<label class="grid gap-1 text-sm"><span data-i18n="form.name"></span><input name="name" type="text" autocomplete="name" required class="field rounded-xl px-3 py-2"></label>' +
          '<label class="grid gap-1 text-sm"><span data-i18n="form.email"></span><input name="email" type="email" autocomplete="email" required class="field rounded-xl px-3 py-2"></label>' +
          '<label class="grid gap-1 text-sm"><span data-i18n="form.note"></span><textarea name="note" class="field min-h-24 rounded-xl px-3 py-2"></textarea></label>' +
          '<p class="faint text-xs" data-i18n="modal.notice"></p>' +
          '<button type="button" id="order-send" class="btn-primary justify-self-start rounded-full px-5 py-2 text-sm" data-i18n="modal.send"></button>' +
          '<p id="order-status" class="text-sm" role="status" data-status-key="modal.notSent" hidden></p>' +
        "</form>" +
      "</div>";
    document.body.appendChild(modal);
    modalBody = document.getElementById("order-copy");
    modalStatus = document.getElementById("order-status");
    modal.addEventListener("click", function (event) {
      if (event.target === modal || event.target.closest("[data-close]")) closeOrder();
    });
    document.getElementById("order-form").addEventListener("submit", function (event) { event.preventDefault(); });
    document.getElementById("order-send").addEventListener("click", showOrderNotSent);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) closeOrder();
    });
  }

  function fillModal(id) {
    var item = findItem(id);
    if (!item) return;
    document.getElementById("order-title").textContent = item.name;
    modalBody.innerHTML =
      "<p>" + escapeHtml(t("p." + item.id + ".desc")) + "</p>" +
      '<p class="mt-3"><span class="price">' + escapeHtml(money(item.price)) + '</span> <span class="faint">' + escapeHtml(t("modal.placeholder")) + "</span></p>" +
      compositionHtml(item) + reviewsHtml(item);
  }

  function openOrder(id, trigger) {
    if (!findItem(id) || !modal) return;
    openId = id;
    lastFocus = trigger || document.activeElement;
    fillModal(id);
    document.getElementById("order-form").reset();
    modalStatus.hidden = true;
    modalStatus.textContent = "";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector("[data-close]").focus();
  }

  function closeOrder() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    openId = null;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function showOrderNotSent() {
    var form = document.getElementById("order-form");
    modalStatus.hidden = true;
    modalStatus.textContent = "";
    if (!form.checkValidity()) { form.reportValidity(); return; }
    modalStatus.textContent = t("modal.notSent");
    modalStatus.hidden = false;
  }

  function bindFilters() {
    var buttons = document.querySelectorAll("[data-filter]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function (event) {
        active = event.currentTarget.getAttribute("data-filter");
        var group = document.querySelectorAll("[data-filter]");
        for (var j = 0; j < group.length; j++) {
          group[j].setAttribute("aria-pressed", group[j] === event.currentTarget ? "true" : "false");
        }
        render();
      });
    }
  }

  function bindSubscribe() {
    var form = document.getElementById("subscribe");
    var button = document.getElementById("subscribe-send");
    var status = document.getElementById("subscribe-status");
    if (!form || !button || !status) return;
    status.setAttribute("data-status-key", "list.notSent");
    form.addEventListener("submit", function (event) { event.preventDefault(); });
    button.addEventListener("click", function () {
      status.hidden = true;
      status.textContent = "";
      if (!form.checkValidity()) { form.reportValidity(); return; }
      status.textContent = t("list.notSent");
      status.hidden = false;
    });
  }

  /* Keep tabs in sync when the theme or language changes on another page. */
  window.addEventListener("storage", function (event) {
    if (event.key === THEME_KEY) applyTheme(themePref());
    if (event.key === LANG_KEY) applyLang(read(LANG_KEY));
  });

  bindTheme();
  mountModal();
  buildLangMenu();
  bindFilters();
  bindSubscribe();
  applyLang(lang);
})();
