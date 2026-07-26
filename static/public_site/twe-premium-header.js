(() => {
  const header = document.querySelector('[data-twe-premium-header]');
  if (!header) return;

  const searchItems = [
    {id:'qr-generator', name:'QR Code Generator', type:'Tool', detail:'Create a shareable QR code in seconds.', href:'/toolbox/qr-code-generator/', keywords:'share link phone url qr create code'},
    {id:'time-zone-planner', name:'Time Zone Planner', type:'Tool', detail:'Compare meeting times with DST-aware formatting.', href:'/toolbox/time-zone-planner/', keywords:'meeting schedule toronto london time date plan'},
    {id:'reaction-timer', name:'Reaction Timer', type:'Game', detail:'A fast reflex round with local bests.', href:'/toolbox/mini-game/', keywords:'quick fun reflex game score beat'},
    {id:'trivia-quickfire', name:'Trivia Quickfire', type:'Game', detail:'A family-friendly knowledge sprint.', href:'/toolbox/trivia-quickfire/', keywords:'quiz questions knowledge fun new trivia'},
    {id:'csv-cleaner', name:'CSV Table Cleaner', type:'Tool', detail:'Turn messy CSV data into a cleaner table.', href:'/toolbox/csv-table-cleaner/', keywords:'spreadsheet data tidy rows columns csv file clean'},
    {id:'pet-home-resources', name:'Pet Home Resources', type:'Guide', detail:'Practical pet-home routines and buying guidance.', href:'/resources?category=pet-home', keywords:'pet pets dogs cats home routine guide'},
    {id:'church-community', name:'Church & Community', type:'Resource', detail:'News, events, ministry guides, and practical support.', href:'/church/', keywords:'church community events news ministry'},
    {id:'twe-store', name:'TWE Store', type:'Store', detail:'Optional digital kits, curated picks, and fit checks.', href:'/store/', keywords:'shop products kits amazon picks store buy optional'}
  ];
  const allowedIds = new Set(searchItems.map((item) => item.id));
  const storageKeys = {
    saved: 'twe-premium-saved',
    recent: 'twe-premium-recent',
    visits: 'twe-premium-visits',
    lastVisit: 'twe-premium-last-visit',
    motion: 'twe-premium-motion-paused'
  };

  const status = header.querySelector('[data-twe-status]');
  const say = (message) => { if (status) status.textContent = message; };
  const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  const readJson = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || ''); } catch { return fallback; }
  };
  const writeJson = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  };
  const cleanIds = (ids) => Array.isArray(ids) ? ids.filter((id, index) => allowedIds.has(id) && ids.indexOf(id) === index).slice(0, 12) : [];
  const getSaved = () => cleanIds(readJson(storageKeys.saved, []));
  const setSaved = (ids) => writeJson(storageKeys.saved, cleanIds(ids));
  const getRecent = () => cleanIds(readJson(storageKeys.recent, []));
  const setRecent = (ids) => writeJson(storageKeys.recent, cleanIds(ids));
  const itemById = (id) => searchItems.find((item) => item.id === id);

  const recordVisit = () => {
    const today = new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Toronto'}).format(new Date());
    try {
      if (localStorage.getItem(storageKeys.lastVisit) !== today) {
        const visits = Math.max(0, Number(localStorage.getItem(storageKeys.visits) || 0)) + 1;
        localStorage.setItem(storageKeys.visits, String(visits));
        localStorage.setItem(storageKeys.lastVisit, today);
      }
    } catch {}
  };
  recordVisit();

  const renderItemList = (container, ids, emptyText) => {
    if (!container) return;
    const items = cleanIds(ids).map(itemById).filter(Boolean);
    if (!items.length) {
      container.innerHTML = `<p class="twe-premium-empty">${emptyText}</p>`;
      return;
    }
    container.innerHTML = items.map((item) => `
      <a class="twe-premium-mini-result" href="${item.href}" data-twe-item-id="${item.id}">
        <span>${item.type}</span><strong>${item.name}</strong><small>${item.detail}</small>
      </a>`).join('');
  };
  const refreshMyTWE = () => {
    renderItemList(header.querySelector('[data-twe-saved-list]'), getSaved(), 'Save a tool, game, guide, or store item and it will appear here on this device.');
    renderItemList(header.querySelector('[data-twe-recent-list]'), getRecent(), 'Open a TWE item and recent picks will appear here locally.');
    const visits = Math.max(0, Number(localStorage.getItem(storageKeys.visits) || 0));
    const install = header.querySelector('[data-twe-install]');
    if (install) {
      const eligible = visits >= 3 && Boolean(window.matchMedia) && ('onbeforeinstallprompt' in window || 'BeforeInstallPromptEvent' in window);
      install.disabled = !eligible;
      install.textContent = eligible ? 'Install shortcut' : `Shortcut unlocks after repeat visits (${Math.min(visits, 3)}/3)`;
    }
  };

  const setCompact = () => header.classList.toggle('is-compact', window.scrollY >= 150);
  setCompact();
  window.addEventListener('scroll', setCompact, {passive: true});

  const motion = header.querySelector('[data-twe-motion-toggle]');
  const applyMotion = () => {
    const paused = localStorage.getItem(storageKeys.motion) === '1';
    header.classList.toggle('motion-paused', paused);
    if (motion) {
      motion.setAttribute('aria-pressed', paused ? 'true' : 'false');
      motion.textContent = paused ? 'Motion paused' : 'Pause motion';
    }
  };
  motion?.addEventListener('click', () => {
    const next = localStorage.getItem(storageKeys.motion) === '1' ? '0' : '1';
    try { localStorage.setItem(storageKeys.motion, next); } catch {}
    applyMotion();
    say(next === '1' ? 'Decorative header motion paused.' : 'Decorative header motion resumed.');
  });
  applyMotion();

  const searchForm = header.querySelector('[data-header-search-form]');
  const searchInput = searchForm?.querySelector('input[name="q"]');
  const resultsBox = header.querySelector('[data-twe-search-results]');
  const searchResults = header.querySelector('[data-twe-search-results-list]');
  const runSearch = (query) => {
    const q = normalize(query);
    const terms = q.split(' ').filter(Boolean);
    const matches = !terms.length ? searchItems.slice(0, 5) : searchItems.filter((item) => {
      const haystack = normalize(`${item.name} ${item.type} ${item.detail} ${item.keywords}`);
      return terms.every((term) => haystack.includes(term));
    }).slice(0, 6);
    if (!resultsBox || !searchResults) return;
    resultsBox.hidden = false;
    if (!matches.length) {
      searchResults.innerHTML = '<p class="twe-premium-empty">No exact match yet. Try a shorter phrase like “pet”, “QR”, “time”, or “trivia”, or browse Tools, Games, Resources, and Store.</p>';
      say('No matching TWE result found. Try a shorter phrase.');
      return;
    }
    searchResults.innerHTML = matches.map((item) => `
      <a class="twe-premium-search-result" href="${item.href}" data-twe-item-id="${item.id}">
        <span>${item.type}</span><strong>${item.name}</strong><small>${item.detail}</small>
      </a>`).join('');
    say(`${matches.length} TWE result${matches.length === 1 ? '' : 's'} shown for ${q || 'featured picks'}.`);
  };
  searchForm?.addEventListener('submit', (event) => {
    const value = searchInput?.value || '';
    if (!value.trim()) return;
    event.preventDefault();
    runSearch(value);
  });
  header.querySelector('[data-twe-search-close]')?.addEventListener('click', () => {
    if (resultsBox) resultsBox.hidden = true;
    searchInput?.focus();
    say('Search results closed.');
  });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      searchInput?.focus();
      searchInput?.select();
      say('Search focused. Type a task like pet guide, QR code, time zone, or trivia.');
    }
    if (event.key === 'Escape') {
      if (resultsBox && !resultsBox.hidden) {
        resultsBox.hidden = true;
        searchInput?.focus();
        say('Search results closed.');
      }
      const drawer = header.querySelector('[data-twe-drawer]');
      const trigger = header.querySelector('[data-twe-drawer-toggle]');
      if (drawer && !drawer.hidden) {
        drawer.hidden = true;
        trigger?.setAttribute('aria-expanded', 'false');
        trigger?.focus();
        say('My TWE closed.');
      }
    }
  });

  const drawer = header.querySelector('[data-twe-drawer]');
  const drawerToggle = header.querySelector('[data-twe-drawer-toggle]');
  drawerToggle?.addEventListener('click', () => {
    const open = drawer?.hidden !== false;
    if (drawer) drawer.hidden = !open;
    drawerToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    refreshMyTWE();
    if (open) drawer?.querySelector('a,button')?.focus();
    say(open ? 'My TWE opened. Saved and recent items are stored only on this device.' : 'My TWE closed.');
  });
  header.querySelector('[data-twe-save-current]')?.addEventListener('click', () => {
    const path = window.location.pathname;
    const current = searchItems.find((item) => path === new URL(item.href, window.location.origin).pathname);
    if (!current) {
      say('This page is not one of the quick-save header items yet.');
      return;
    }
    setSaved([current.id, ...getSaved()]);
    refreshMyTWE();
    say(`${current.name} saved on this device.`);
  });
  header.querySelector('[data-twe-clear]')?.addEventListener('click', () => {
    setSaved([]);
    setRecent([]);
    refreshMyTWE();
    say('My TWE saved and recent items cleared from this device.');
  });

  header.querySelectorAll('[role="tab"][data-twe-daily-tab]').forEach((tab, index, tabs) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      const current = tabs.indexOf(tab);
      let next = null;
      if (event.key === 'ArrowRight') next = tabs[(current + 1) % tabs.length];
      if (event.key === 'ArrowLeft') next = tabs[(current - 1 + tabs.length) % tabs.length];
      if (event.key === 'Home') next = tabs[0];
      if (event.key === 'End') next = tabs[tabs.length - 1];
      if (next) { event.preventDefault(); activateTab(next); next.focus(); }
    });
  });
  function activateTab(tab) {
    const id = tab.getAttribute('aria-controls');
    header.querySelectorAll('[role="tab"][data-twe-daily-tab]').forEach((candidate) => {
      candidate.setAttribute('aria-selected', candidate === tab ? 'true' : 'false');
      candidate.tabIndex = candidate === tab ? 0 : -1;
    });
    header.querySelectorAll('[role="tabpanel"][data-twe-daily-panel]').forEach((panel) => {
      panel.hidden = panel.id !== id;
    });
    say(`${tab.textContent.trim()} Daily Edge mode selected.`);
  }

  header.addEventListener('click', (event) => {
    const link = event.target.closest?.('[data-twe-item-id]');
    if (!link) return;
    const id = link.getAttribute('data-twe-item-id');
    if (!allowedIds.has(id)) return;
    setRecent([id, ...getRecent()]);
  });

  refreshMyTWE();
})();
