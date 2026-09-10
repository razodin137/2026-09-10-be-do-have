'use strict';

const BE_CHIPS = ['Fruitful', 'Present', 'Steady', 'Kind', 'Courageous', 'Grateful', 'Faithful', 'Wise', 'Generous'];

const $ = (id) => document.getElementById(id);

let offset = 0; // 0 = today, negative = back, positive = ahead
let data = blank();

function isoLocal (d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function dateFor (off) {
  const d = new Date();
  d.setDate(d.getDate() + off);
  return d;
}

function keyFor (off) {
  return 'bedo:v1:' + isoLocal(dateFor(off));
}

function blank () {
  return {
    be: '',
    dos: [
      { text: '', done: false },
      { text: '', done: false },
      { text: '', done: false }
    ],
    have: ''
  };
}

function load () {
  let raw = null;
  try { raw = localStorage.getItem(keyFor(offset)); } catch (e) { raw = null; }
  data = blank();
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        data.be = typeof parsed.be === 'string' ? parsed.be : '';
        data.have = typeof parsed.have === 'string' ? parsed.have : '';
        if (Array.isArray(parsed.dos)) {
          data.dos = parsed.dos
            .filter((d) => d && typeof d === 'object')
            .map((d) => ({ text: typeof d.text === 'string' ? d.text : '', done: !!d.done }));
        }
        while (data.dos.length < 3) data.dos.push({ text: '', done: false });
      }
    } catch (e) { data = blank(); }
  }
}

function save () {
  try { localStorage.setItem(keyFor(offset), JSON.stringify(data)); } catch (e) { /* storage unavailable */ }
}

function dateLabel () {
  const d = dateFor(offset);
  const s = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const tag = offset === 0 ? 'Today' : offset < 0 ? `${-offset}d back` : `${offset}d ahead`;
  return `${tag} — ${s}`;
}

function buildChips () {
  const wrap = $('chips');
  BE_CHIPS.forEach((c) => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = c;
    b.addEventListener('click', () => {
      $('beInput').value = c;
      data.be = c;
      save();
    });
    wrap.appendChild(b);
  });
}

function renderDos () {
  const ul = $('doList');
  ul.innerHTML = '';
  data.dos.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'dorow' + (item.done ? ' done' : '');

    const check = document.createElement('button');
    check.className = 'check' + (item.done ? ' on' : '');
    check.textContent = '✓';
    check.title = 'Mark done';
    check.addEventListener('click', () => {
      item.done = !item.done;
      save();
      render();
    });

    const text = document.createElement('input');
    text.className = 'dtext';
    text.placeholder = '…';
    text.maxLength = 80;
    text.value = item.text;
    text.addEventListener('input', () => {
      item.text = text.value;
      save();
    });

    li.appendChild(check);
    li.appendChild(text);
    ul.appendChild(li);
  });
}

function render () {
  $('dateLabel').textContent = dateLabel();
  $('beInput').value = data.be;
  $('haveInput').value = data.have;
  renderDos();
}

function setOffset (delta) {
  offset += delta;
  load();
  render();
}

$('prevDay').addEventListener('click', () => setOffset(-1));
$('nextDay').addEventListener('click', () => setOffset(1));
$('dateLabel').addEventListener('click', () => { offset = 0; load(); render(); });
$('addDo').addEventListener('click', () => {
  data.dos.push({ text: '', done: false });
  save();
  renderDos();
});
$('beInput').addEventListener('input', (e) => { data.be = e.target.value; save(); });
$('haveInput').addEventListener('input', (e) => { data.have = e.target.value; save(); });

buildChips();
load();
render();