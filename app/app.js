// Leonida Trophy Guide: checklist, filters, spoiler mode, roadmap and export/import.
// The trophy data lives in data/trophies.json (official names, descriptions, grades
// plus a guide in our own words and its sources); the roadmap in data/roadmap.json.
// Everything runs offline: the only requests are the two JSON files under app/.

const STORE_KEY = 'gta6-trophy-tracker-v1';
const SPOILER_KEY = 'gta6-trophy-spoilers-v1';

const trophyList = document.getElementById('trophyList');
const roadmapList = document.getElementById('roadmapList');
const roadmapIntro = document.getElementById('roadmapIntro');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const gradeBreakdown = document.getElementById('gradeBreakdown');
const searchInput = document.getElementById('searchInput');
const gradeSelect = document.getElementById('gradeSelect');
const showSelect = document.getElementById('showSelect');
const spoilerToggle = document.getElementById('spoilerToggle');
const filterNote = document.getElementById('filterNote');
const emptyNote = document.getElementById('emptyNote');
const listHeading = document.getElementById('listHeading');

const params = new URLSearchParams(location.search);
const demoIds = params.get('demo') === '1' ? [2, 3, 8, 15, 20, 21, 35, 42] : [];

let earned = new Set(JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]'));
for (const id of demoIds) earned.add(id);
let spoilersHidden = params.get('spoilers') === 'off'
  ? false
  : params.get('spoilers') === 'on'
    ? true
    : localStorage.getItem(SPOILER_KEY) !== 'off';
spoilerToggle.checked = spoilersHidden;

let kind = params.get('kind') ?? 'all';
let trophies = [];
let roadmap = { intro: '', stages: [] };
let openId = Number(params.get('open') ?? 0) || null;

const KIND_LABEL = {
  all: 'All trophies', story: 'Story', missable: 'Missable',
  collectibles: 'Collectibles', activities: 'Activities',
  platinum: 'Platinum & 100%', online: 'Online',
};
const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };

function saveProgress() {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}
function saveSpoilers() {
  localStorage.setItem(SPOILER_KEY, spoilersHidden ? 'on' : 'off');
}
function byId(id) {
  return trophies.find((t) => t.id === id);
}
function trophyIsMasked(t) {
  return spoilersHidden && t.kind === 'story' && !earned.has(t.id);
}
function trophyMatches(t) {
  if (kind === 'missable' && !t.missable) return false;
  if (kind === 'online') return false;
  if (kind !== 'all' && kind !== 'missable' && kind !== 'online' && t.kind !== kind) return false;
  if (gradeSelect.value !== 'all' && t.grade !== gradeSelect.value) return false;
  if (showSelect.value === 'todo' && earned.has(t.id)) return false;
  if (showSelect.value === 'earned' && !earned.has(t.id)) return false;
  const q = searchInput.value.trim().toLowerCase();
  if (q) {
    const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function badge(text, cls) {
  const s = document.createElement('span');
  s.className = `badge ${cls}`;
  s.textContent = text;
  return s;
}

function renderProgress() {
  const total = trophies.length;
  const done = trophies.filter((t) => earned.has(t.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${done} of ${total} earned · ${pct}%`;
  const parts = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const all = trophies.filter((t) => t.grade === g).length;
    const got = trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
    return `${GRADE_LABEL[g]} ${got}/${all}`;
  });
  gradeBreakdown.textContent = parts.join(' · ');
}

function renderRoadmap() {
  roadmapIntro.textContent = roadmap.intro ?? '';
  roadmapList.replaceChildren();
  for (const stage of roadmap.stages ?? []) {
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.textContent = `Stage ${stage.step}: ${stage.title}`;
    const p = document.createElement('p');
    p.textContent = stage.text;
    li.append(h, p);
    const chips = document.createElement('div');
    chips.className = 'roadmap-trophies';
    for (const id of stage.trophies ?? []) {
      const t = byId(id);
      if (!t) continue;
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = earned.has(id) ? `✓ ${t.name}` : t.name;
      if (earned.has(id)) b.classList.add('earned');
      b.addEventListener('click', () => {
        kind = 'all';
        gradeSelect.value = 'all';
        showSelect.value = 'all';
        searchInput.value = '';
        syncKindChips();
        renderTrophies();
        const card = document.getElementById(`trophy-${id}`);
        if (card) {
          card.scrollIntoView({ block: 'center' });
          card.querySelector('details')?.setAttribute('open', '');
        }
      });
      chips.append(b);
    }
    if (chips.childElementCount) li.append(chips);
    roadmapList.append(li);
  }
}

function renderTrophies() {
  renderProgress();
  const shown = trophies.filter(trophyMatches);
  trophyList.replaceChildren();
  emptyNote.hidden = shown.length > 0;
  if (kind === 'online') {
    filterNote.textContent = 'There are no online trophies — all 55 unlock in single-player. Nothing to show here.';
  } else {
    filterNote.textContent = `Showing ${shown.length} of ${trophies.length} trophies` +
      (kind !== 'all' ? ` · ${KIND_LABEL[kind]}` : '') +
      (gradeSelect.value !== 'all' ? ` · ${GRADE_LABEL[gradeSelect.value]}` : '') +
      (searchInput.value.trim() ? ` · matching “${searchInput.value.trim()}”` : '') + '.';
  }
  listHeading.textContent = kind === 'all' ? 'Checklist' : `${KIND_LABEL[kind]} trophies`;
  for (const t of shown) {
    const card = document.createElement('article');
    card.className = 'trophy' + (earned.has(t.id) ? ' earned' : '');
    card.id = `trophy-${t.id}`;
    const head = document.createElement('div');
    head.className = 'trophy-head';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id);
      else earned.delete(t.id);
      saveProgress();
      renderTrophies();
      renderRoadmap();
    });
    const title = document.createElement('div');
    title.className = 'trophy-title';
    const name = document.createElement('h3');
    const masked = trophyIsMasked(t);
    name.textContent = masked ? 'Hidden story trophy' : t.name;
    const official = document.createElement('p');
    official.className = 'official';
    official.textContent = masked
      ? 'Earn this trophy in the game to reveal its name and description.'
      : t.description;
    const badges = document.createElement('div');
    badges.className = 'badges';
    badges.append(badge(GRADE_LABEL[t.grade], t.grade));
    badges.append(badge(KIND_LABEL[t.kind] ?? t.kind, 'kind'));
    if (t.missable) badges.append(badge('⚠ Missable', 'missable'));
    if (t.hidden) badges.append(badge('Hidden', 'hidden'));
    if (t.count) badges.append(badge(`Target: ${t.count.toLocaleString('en-US')}`, 'count'));
    title.append(name, official, badges);
    head.append(box, title);
    card.append(head);
    if (masked) {
      const mask = document.createElement('p');
      mask.className = 'spoiler-mask';
      mask.textContent = 'Spoiler hidden — tick the box once you have earned this trophy, or switch the spoiler setting off, to read its guide.';
      card.append(mask);
    } else {
      const details = document.createElement('details');
      if (openId === t.id) details.open = true;
      const summary = document.createElement('summary');
      summary.textContent = 'How to get it — guide & sources';
      const guide = document.createElement('p');
      guide.className = 'guide-text';
      guide.textContent = t.guide;
      const sources = document.createElement('p');
      sources.className = 'sources';
      sources.textContent = 'Sources: ';
      for (const s of t.sources ?? []) {
        const a = document.createElement('a');
        a.href = s.url;
        a.textContent = s.name;
        a.rel = 'noopener';
        sources.append(a);
      }
      details.append(summary, guide, sources);
      card.append(details);
    }
    trophyList.append(card);
  }
}

function syncKindChips() {
  for (const chip of document.querySelectorAll('#kindChips .chip')) {
    chip.classList.toggle('active', chip.dataset.kind === kind);
  }
}

document.getElementById('kindChips').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  kind = chip.dataset.kind;
  syncKindChips();
  renderTrophies();
});
searchInput.addEventListener('input', renderTrophies);
gradeSelect.addEventListener('change', renderTrophies);
showSelect.addEventListener('change', renderTrophies);
spoilerToggle.addEventListener('change', () => {
  spoilersHidden = spoilerToggle.checked;
  saveSpoilers();
  renderTrophies();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b) }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('importInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(ids)) throw new Error('bad file');
    earned = new Set(ids.filter((id) => Number.isInteger(id) && byId(id)));
    saveProgress();
    renderTrophies();
    renderRoadmap();
  } catch {
    filterNote.textContent = 'That file could not be imported — it is not a progress export from this guide.';
  }
  e.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (window.confirm('Clear all ticked trophies?')) {
    earned = new Set();
    saveProgress();
    renderTrophies();
    renderRoadmap();
  }
});

async function loadData() {
  const [trophyDoc, roadmapDoc] = await Promise.all([
    (await fetch('data/trophies.json')).json(),
    (await fetch('data/roadmap.json')).json(),
  ]);
  trophies = trophyDoc.trophies;
  roadmap = roadmapDoc;
  syncKindChips();
  renderRoadmap();
  renderTrophies();
  if (params.get('view') === 'roadmap') {
    document.getElementById('roadmap').scrollIntoView();
  } else if (params.get('view') === 'list') {
    document.getElementById('listHeading').scrollIntoView();
  } else if (openId) {
    const card = document.getElementById(`trophy-${openId}`);
    if (card) card.scrollIntoView({ block: 'center' });
  }
}

loadData().catch((err) => {
  trophyList.textContent = `Could not load the trophy data: ${err.message}`;
});
