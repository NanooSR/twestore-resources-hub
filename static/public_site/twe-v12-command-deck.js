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
      id: "tools",
      label: "Tools",
      eyebrow: "Get something done",
      description: "Fast practical helpers",
      preview: "QR · calculate · convert",
      href: "/toolbox/tools/",
      icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 17.5h20a5 5 0 0 1 5 5v12.3A5.2 5.2 0 0 1 33.8 40H14.2A5.2 5.2 0 0 1 9 34.8V22.5a5 5 0 0 1 5-5Z"/><path d="M18 17.5v-3.2A4.3 4.3 0 0 1 22.3 10h3.4a4.3 4.3 0 0 1 4.3 4.3v3.2M9 27h30M20.5 24.8v4.4h7v-4.4"/><circle class="v12-orbit" cx="24" cy="24" r="20"/></svg>',
    },
    {
      id: "games",
      label: "Games",
      eyebrow: "Take a good break",
      description: "Replayable browser games",
      preview: "Reaction · trivia · sudoku",
      href: "/toolbox/games/",
      icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 18h18c5.7 0 9.3 14.7 5.5 18.2-2.1 2-5.2-.2-8.2-4.2H17.7c-3 4-6.1 6.2-8.2 4.2C5.7 32.7 9.3 18 15 18Z"/><path d="M17 23v8M13 27h8"/><circle cx="31.5" cy="25" r="1.7"/><circle cx="35" cy="29" r="1.7"/><rect class="v12-tile" x="19" y="12" width="10" height="4" rx="2"/></svg>',
    },
    {
      id: "resources",
      label: "Resources",
      eyebrow: "Find a clear answer",
      description: "Guides for real decisions",
      preview: "Buying · pets · community",
      href: "/resources/",
      icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><path class="v12-page" d="M8 12.5c6.1-2 11.4-1.1 16 2.6v25c-4.6-3.7-9.9-4.6-16-2.6v-25Z"/><path class="v12-page" d="M40 12.5c-6.1-2-11.4-1.1-16 2.6v25c4.6-3.7 9.9-4.6 16-2.6v-25Z"/><path d="M12.5 18.5c3.2-.5 5.8 0 8 1.6M12.5 24c3.2-.5 5.8 0 8 1.6M35.5 18.5c-3.2-.5-5.8 0-8 1.6M35.5 24c-3.2-.5-5.8 0-8 1.6"/></svg>',
    },
    {
      id: "store",
      label: "TWE Store",
      eyebrow: "Browse when you want",
      description: "Curated and optional",
      preview: "Kits · picks · fit checks",
      href: "/store/",
      icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M11 18h26l-2.2 21H13.2L11 18Z"/><path d="M18 19v-4a6 6 0 0 1 12 0v4"/><path class="v12-glint" d="m34 8 1.2 3.1L38 12l-2.8 1-1.2 3-1.1-3-2.9-1 2.9-.9L34 8Z"/></svg>',
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
    return "home";
  }

  function activeDestination(path) {
    if (GAME_PATHS.has(path)) return "games";
    if (path.startsWith("/toolbox")) return "tools";
    if (path.startsWith("/resources") || path.startsWith("/church"))
      return "resources";
    if (
      path.startsWith("/store") ||
      path.startsWith("/amazon-store") ||
      path.startsWith("/collections")
    ) {
      return "store";
    }
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
    card.setAttribute(
      "aria-label",
      `${destination.label}: ${destination.description}`,
    );

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
    deck.setAttribute("role", "navigation");
    deck.setAttribute("aria-label", "Explore The Watchers Edge");

    addBrandStory(nav);

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
    return `
      <a href="${destination.href}" data-twe-v12-destination="${destination.id}"${current}>
        <span class="twe-v12-bridge-icon" aria-hidden="true">${destination.icon}</span>
        <span><small>${destination.eyebrow}</small><strong>${destination.label}</strong></span>
        <span class="twe-v12-bridge-arrow" aria-hidden="true">→</span>
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
      { test: (path) => path.startsWith("/store"), label: "TWE Store" },
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

  function setMotionState() {
    const button = document.querySelector("[data-twe-motion-toggle]");
    if (!button) return;
    document.documentElement.dataset.tweV12Motion =
      button.getAttribute("aria-pressed") === "true" ? "paused" : "running";
  }

  function syncCompactHeader() {
    const wide = window.matchMedia("(min-width: 1181px)").matches;
    document.querySelectorAll("[data-twe-premium-header]").forEach((header) => {
      header.classList.toggle("is-compact", wide && window.scrollY > 180);
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
    setMotionState();
    syncCompactHeader();

    const motionButton = document.querySelector("[data-twe-motion-toggle]");
    motionButton?.addEventListener("click", () =>
      window.requestAnimationFrame(setMotionState),
    );
    window.addEventListener("scroll", () => window.requestAnimationFrame(syncCompactHeader), { passive: true });
    window.addEventListener("resize", () => window.requestAnimationFrame(syncCompactHeader));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
