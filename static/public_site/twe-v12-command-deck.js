/**
 * TWE Living Command Deck V12
 *
 * Progressive enhancement for the current exported public-site markup.
 * Final production templates should render the same structure server-side.
 */
(() => {
  "use strict";

  const DESTINATIONS = [
    {
      id: "tools", label: "Tools", eyebrow: "Get something done",
      description: "Open practical browser tools for everyday tasks.", preview: "QR · calculate · convert", href: "/toolbox/tools/",
      icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 17.5h20a5 5 0 0 1 5 5v12.3A5.2 5.2 0 0 1 33.8 40H14.2A5.2 5.2 0 0 1 9 34.8V22.5a5 5 0 0 1 5-5Z"/><path d="M18 17.5v-3.2A4.3 4.3 0 0 1 22.3 10h3.4a4.3 4.3 0 0 1 4.3 4.3v3.2M9 27h30"/></svg>',
    },
    {
      id: "games", label: "Games", eyebrow: "Take a good break",
      description: "Play short browser games with no setup.", preview: "Reaction · trivia · puzzles", href: "/toolbox/games/",
      icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 18h18c5.7 0 9.3 14.7 5.5 18.2-2.1 2-5.2-.2-8.2-4.2H17.7c-3 4-6.1 6.2-8.2 4.2C5.7 32.7 9.3 18 15 18Z"/><path d="M17 23v8M13 27h8"/><circle cx="31.5" cy="25" r="1.7"/><circle cx="35" cy="29" r="1.7"/></svg>',
    },
    {
      id: "resources", label: "Resources", eyebrow: "Find a clear answer",
      description: "Read buying guides and practical advice by real need.", preview: "Buying · pets · research", href: "/resources/",
      icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 12.5c6.1-2 11.4-1.1 16 2.6v25c-4.6-3.7-9.9-4.6-16-2.6v-25Z"/><path d="M40 12.5c-6.1-2-11.4-1.1-16 2.6v25c4.6-3.7 9.9-4.6 16-2.6v-25Z"/></svg>',
    },
    {
      id: "store", label: "TWEStore", eyebrow: "Browse when you want",
      description: "Compare optional digital kits and curated shopping paths.", preview: "Kits · picks · fit checks", href: "/store/",
      icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M11 18h26l-2.2 21H13.2L11 18Z"/><path d="M18 19v-4a6 6 0 0 1 12 0v4"/><path d="m34 8 1.2 3.1L38 12l-2.8 1-1.2 3-1.1-3-2.9-1 2.9-.9L34 8Z"/></svg>',
    },
    {
      id: "pawsome", label: "TWE Pawsome Pet Gear Hub", eyebrow: "Pet care & gear",
      description: "Read practical pet gear, routine, and home-care guides.", preview: "Blogger · opens in a new tab", href: "https://pawsomepetgearhub.blogspot.com/", external: true,
      icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="15" cy="17" r="4"/><circle cx="25" cy="13" r="4"/><circle cx="35" cy="17" r="4"/><path d="M14 32c0-7 5-12 10-12s10 5 10 12c0 5-4 8-10 8s-10-3-10-8Z"/></svg>',
    },
    {
      id: "church-hub", label: "TWE Church Hub", eyebrow: "Church & ministry",
      description: "Read church supply, event, and ministry setup guides.", preview: "Blogger · opens in a new tab", href: "https://thewatchersedgechurchsupplies.blogspot.com/", external: true,
      icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 7v13M18 13h12M11 40V22l13-8 13 8v18M20 40V29h8v11"/></svg>',
    },
    {
      id: "start", label: "Start Here", eyebrow: "Need a first step?",
      description: "Choose the right tool, guide, store, church, or support path.", preview: "Orient · decide · continue", href: "/start-here/",
      icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="16"/><path d="m19 29 4-10 10-4-4 10-10 4Z"/><circle cx="24" cy="24" r="2"/></svg>',
    },
    {
      id: "collections", label: "Collections", eyebrow: "Browse by goal",
      description: "Compare curated options by goal, platform, or outcome.", preview: "Bundles · paths · use cases", href: "/collections/",
      icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="10" width="30" height="11" rx="3"/><rect x="9" y="27" width="30" height="11" rx="3"/><path d="M16 21v6M32 21v6"/></svg>',
    },
  ];

  const PATH = window.location.pathname.replace(/\/+$/, "") || "/";
  const GAME_PATHS = new Set([
    "/toolbox/games",
    "/toolbox/memory-match",
    "/toolbox/minesweeper",
    "/toolbox/mini-game",
    "/toolbox/sliding-puzzle",
    "/toolbox/snake",
    "/toolbox/sudoku-mini",
    "/toolbox/trivia-quickfire",
    "/toolbox/twenty-forty-eight",
    "/toolbox/typing-sprint",
    "/toolbox/word-ladder",
  ]);

  function routeKind(path) {
    if (path === "/") return "home";
    if (path.startsWith("/toolbox")) return "toolbox";
    if (path.startsWith("/store/") && path !== "/store") return "product";
    if (
      path === "/store" ||
      path === "/store-browse" ||
      path === "/amazon-store"
    )
      return "store";
    if (path.startsWith("/resources")) return "resources";
    if (path.startsWith("/collections")) return "collections";
    if (path.startsWith("/start-here")) return "start";
    if (
      path.startsWith("/support") ||
      path.startsWith("/contact") ||
      path.startsWith("/privacy") ||
      path.startsWith("/terms") ||
      path.startsWith("/affiliate-disclosure")
    ) {
      return "support";
    }
    return "route";
  }

  function activeDestination(path) {
    if (path.startsWith("/church") || path.startsWith("/support")) return "";
    if (GAME_PATHS.has(path)) return "games";
    if (path.startsWith("/toolbox")) return "tools";
    if (path.startsWith("/resources")) return "resources";
    if (path.startsWith("/start-here")) return "start";
    if (path.startsWith("/collections")) return "collections";
    if (path.startsWith("/store") || path.startsWith("/amazon-store")) return "store";
    return "";
  }

  const kind = routeKind(PATH);
  const active = activeDestination(PATH);

  function makeIcon(destination) {
    const icon = document.createElement("span");
    icon.className = "twe-v12-destination-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = destination.icon;
    return icon;
  }

  function makeArrow() {
    const arrow = document.createElement("span");
    arrow.className = "twe-v12-destination-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.innerHTML =
      '<svg viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4"/></svg>';
    return arrow;
  }

  function enhanceDestination(card, destination) {
    card.dataset.accent = destination.id;
    card.dataset.tweV12Destination = destination.id;
    card.removeAttribute("data-icon");

    if (!card.querySelector(".twe-v12-destination-icon")) {
      card.prepend(makeIcon(destination));
    }
    if (!card.querySelector(".twe-v12-destination-arrow")) {
      card.append(makeArrow());
    }

    if (destination.id === active) {
      card.classList.add("is-current");
      card.setAttribute("aria-current", "page");
    } else {
      card.classList.remove("is-current");
      card.removeAttribute("aria-current");
    }
  }

  function addBrandStory(nav) {
    if (nav.querySelector(".twe-v12-brand-story")) return;

    const story = document.createElement("section");
    story.className = "twe-v12-brand-story";
    story.setAttribute("aria-label", "The Watchers Edge promise");
    story.innerHTML = `
      <span class="twe-v12-eyebrow"><i aria-hidden="true"></i>A useful win, every day</span>
      <strong class="twe-v12-story-title">Make today <em>a little easier.</em></strong>
      <p>Finish a task, take a good break, or find a clear answer. Your fastest path stays visible—and never requires an account.</p>
      <div class="twe-v12-value-pulse" aria-label="Site value">
        <span><b>25</b><small>free experiences</small></span>
        <span><b>Fresh</b><small>useful picks</small></span>
        <span><b>0</b><small>sign-ins required</small></span>
      </div>`;

    const brand = nav.querySelector(".brand");
    brand?.insertAdjacentElement("afterend", story);
  }

  function enhanceMainHeader(header) {
    const nav = header.querySelector("nav.nav");
    const deck = header.querySelector(".twe-premium-destinations");
    if (!nav || !deck) return;

    header.dataset.tweV12Layout = kind === "home" ? "home" : "route";

    if (kind === "home") addBrandStory(nav);

    const cards = [...deck.querySelectorAll(".twe-destination-card")];
    DESTINATIONS.forEach((destination, index) => {
      const card =
        cards.find((item) => item.dataset.accent === destination.id) ||
        cards[index];
      if (card) enhanceDestination(card, destination);
    });
  }

  function destinationMarkup(destination) {
    const current =
      destination.id === active
        ? ' aria-current="page" class="is-current"'
        : "";
    const external = destination.external
      ? ' target="_blank" rel="noopener sponsored nofollow"'
      : "";
    return `
      <a href="${destination.href}" data-twe-v12-destination="${destination.id}"${current}${external}>
        <span class="twe-v12-bridge-icon" aria-hidden="true">${destination.icon}</span>
        <span><small>${destination.eyebrow}</small><strong>${destination.label}</strong></span>
        <span class="twe-v12-bridge-arrow" aria-hidden="true">${destination.external ? "↗" : "→"}</span>
      </a>`;
  }

  function enhanceToolboxBridge(bridge) {
    [...bridge.querySelectorAll("a[data-twe-v12-destination]")].forEach((link) => {
      const isCurrent = link.dataset.tweV12Destination === active;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function addToolboxBridge() {
    const shell = document.querySelector(".toolbox-shell");
    const brandStrip = shell?.querySelector(".toolbox-brand-strip");
    if (!shell || !brandStrip) return;
    const existing = shell.querySelector(".twe-v12-toolbox-bridge");
    if (existing) {
      enhanceToolboxBridge(existing);
      return;
    }

    const bridge = document.createElement("nav");
    bridge.className = "twe-v12-toolbox-bridge";
    bridge.setAttribute("aria-label", "Explore The Watchers Edge");
    bridge.innerHTML = DESTINATIONS.map(destinationMarkup).join("");
    enhanceToolboxBridge(bridge);
    brandStrip.insertAdjacentElement("afterend", bridge);
  }

  function labelLivingPaths() {
    const home = document.querySelector(".twe-living-home");
    if (!home) return;

    const directMap = [
      { test: (path) => GAME_PATHS.has(path), label: "Games" },
      { test: (path) => path.startsWith("/toolbox"), label: "Tools" },
      { test: (path) => path.startsWith("/resources"), label: "Resources" },
      { test: (path) => path.startsWith("/store"), label: "TWEStore" },
      { test: (path) => path.startsWith("/start-here"), label: "Start Here" },
      { test: (path) => path.startsWith("/collections"), label: "Collections" },
    ];

    [...home.querySelectorAll("a")].forEach((link) => {
      const href = link.getAttribute("href") || "";
      const path = new URL(href, window.location.origin).pathname.replace(/\/+$/, "") || "/";
      const item = directMap.find((candidate) => candidate.test(path));
      if (!item || link.querySelector(".twe-v12-path-label")) return;
      const label = document.createElement("span");
      label.className = "twe-v12-path-label";
      label.textContent = item.label;
      link.prepend(label);
    });
  }

  function syncCompactHeader() {
    // Google ecosystem SOL evidence repair 2026-07-28:
    // Do not mutate the premium header into/out of is-compact at load or scroll time.
    // Lighthouse attributed large CLS to the header band after this V12 enhancer ran.
    // Route compactness is rendered statically via is-route-compact; runtime scroll
    // compacting is intentionally disabled to preserve layout stability.
    document.querySelectorAll("[data-twe-premium-header]").forEach((header) => {
      header.classList.remove("is-compact");
      const slot = header.closest("[data-twe-header-slot]");
      slot?.classList.remove("is-header-slot-ready");
      slot?.style.removeProperty("--twe-header-slot-height");
    });
  }

  function init() {
    document.documentElement.dataset.tweV12 = "ready";
    document.body.classList.add(`twe-v12-route-${kind}`);

    document
      .querySelectorAll("[data-twe-premium-header]")
      .forEach(enhanceMainHeader);
    addToolboxBridge();
    labelLivingPaths();
    syncCompactHeader();

    window.addEventListener("scroll", () => window.requestAnimationFrame(syncCompactHeader), { passive: true });
    window.addEventListener("resize", () => window.requestAnimationFrame(() => {
      document.querySelectorAll("[data-twe-header-slot]").forEach((slot) => {
        slot.classList.remove("is-header-slot-ready");
        slot.style.removeProperty("--twe-header-slot-height");
      });
      syncCompactHeader();
    }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
