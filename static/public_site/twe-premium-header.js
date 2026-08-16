(() => {
  const header = document.querySelector('[data-twe-premium-header]');
  if (!header) return;

  const searchItems = [
    {id:'qr-generator', name:'QR Code Generator', type:'Tool', detail:'Create a shareable QR code in seconds.', href:'/toolbox/qr-code-generator/', keywords:'share link phone url qr create code'},
    {id:'time-zone-planner', name:'Time Zone Planner', type:'Tool', detail:'Compare meeting times with DST-aware formatting.', href:'/toolbox/time-zone-planner/', keywords:'meeting schedule toronto london time date plan'},
    {id:'reaction-timer', name:'Reaction Timer', type:'Game', detail:'A fast reflex round with local bests.', href:'/toolbox/mini-game/', keywords:'quick fun reflex game score beat'},
    {id:'trivia-quickfire', name:'Trivia Quickfire', type:'Game', detail:'A family-friendly knowledge sprint.', href:'/toolbox/trivia-quickfire/', keywords:'quiz questions knowledge fun new trivia'},
    {id:'random-chooser', name:'Random Chooser', type:'Tool', detail:'Paste options and pick fairly, with duplicate cleanup and draw-bag choices.', href:'/toolbox/random-chooser/', keywords:'random chooser choice picker decide decision options draw bag raffle select'},
    {id:'safe-sweep', name:'Safe Sweep', type:'Game', detail:'First-click-safe minesweeper with reveal and flag modes.', href:'/toolbox/minesweeper/', keywords:'safe sweep minesweeper mine mines flag reveal board puzzle game'},
    {id:'text-tools', name:'Writing & Planning Tools', type:'Tool', detail:'Lightweight text helpers and quick decision tools.', href:'/toolbox/tools/', keywords:'writing words text helper planning decision cleanup'},
    {id:'csv-cleaner', name:'CSV Table Cleaner', type:'Tool', detail:'Turn messy CSV data into a cleaner table.', href:'/toolbox/csv-table-cleaner/', keywords:'spreadsheet data tidy rows columns csv file clean'},
    {id:'pet-home-resources', name:'Pet-home Resources', type:'Guide', detail:'Practical pet-home routines and buying guidance.', href:'/resources?category=pet-home', keywords:'pet pets dogs cats home routine guide'},
    {id:'church-community', name:'Church & Ministry Guide', type:'Resource', detail:'Church supplies, ministry setup guides, and practical support.', href:'/church/', keywords:'church ministry supplies setup guide'},
    {id:'twe-store', name:'TWEStore', type:'Store', detail:'Optional digital kits, curated picks, and fit checks.', href:'/store/', keywords:'shop products kits amazon picks store buy optional'}
  ];

  const status = header.querySelector('[data-twe-status]');
  const say = (message) => { if (status) status.textContent = message; };
  const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

  // Route-level compactness is rendered statically; scrolling must not rewrite layout.
  header.classList.remove('is-compact');

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
      searchResults.innerHTML = '<p class="twe-premium-empty">No exact match yet. Try a shorter phrase like “pet”, “QR”, “time”, or “trivia”, or browse Tools, Games, Resources, and TWEStore.</p>';
      say('No matching TWE result found. Try a shorter phrase.');
      return;
    }
    searchResults.innerHTML = matches.map((item) => `
      <a class="twe-premium-search-result" href="${item.href}" data-twe-item-id="${item.id}">
        <span>${item.type}</span><strong>${item.name}</strong><small>${item.detail}</small>
      </a>`).join('');
    say(`${matches.length} TWE result${matches.length === 1 ? '' : 's'} shown for ${q || 'featured picks'}.`);
  };

  const closeSearchResults = () => {
    if (resultsBox) resultsBox.hidden = true;
    if (searchResults) searchResults.innerHTML = '';
    if (searchInput) searchInput.value = '';
    say('');
  };

  searchForm?.addEventListener('submit', (event) => {
    const value = searchInput?.value || '';
    if (!value.trim()) return;
    event.preventDefault();
    runSearch(value);
  });

  header.querySelector('[data-twe-search-close]')?.addEventListener('click', () => {
    closeSearchResults();
    searchInput?.focus();
  });

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      searchInput?.focus();
      searchInput?.select();
      say('Search focused. Type a task like pet guide, QR code, time zone, or trivia.');
    }
    if (event.key === 'Escape' && resultsBox && !resultsBox.hidden) {
      closeSearchResults();
      searchInput?.focus();
    }
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
})();
