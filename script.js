/* ============================================================
   Synced Lyrics & LRC Studio
   ============================================================ */

// ---------- State ----------
const player = {
  audio: null,
  lines: [],        // [{ time, text, el }]
  activeIndex: -1,
  repeatOn: false,
};

const generator = {
  audio: null,
  plainLines: [],
  syncedLines: [],   // [{ time, text }]
  index: 0,
  active: false,
};

let currentLang = 'en';

// ---------- i18n ----------
const translations = {
  en: {
    tabPlayer: 'Player',
    tabGenerator: 'LRC Generator',
    playerTitle: 'Synced Lyrics Player',
    playerStep1: '1. Select Audio File (MP3)',
    playerStep2: '2. Paste LRC Text (with timestamps)',
    generatorTitle: 'LRC File Generator',
    genStep1: '1. Select Audio File (MP3)',
    genStep2: '2. Paste Plain Lyrics (line by line)',
    chooseAudio: 'Choose Audio File',
    noFile: 'No file chosen',
    speedLabel: 'Speed:',
    repeatOff: 'Repeat Line: OFF',
    repeatOn: 'Repeat Line: ON',
    loadLyrics: 'Load Lyrics',
    fullscreen: '📺 Fullscreen',
    playerEmpty: 'Load audio and lyrics to start...',
    startSyncing: 'Start Syncing',
    stopSyncing: 'Stop Syncing',
    resetSync: 'Reset Sync',
    syncHint: '💡 Press <strong>(Spacebar)</strong> while playing to tag each line!',
    syncProgressTitle: 'Sync Progress',
    recording: 'Recording',
    syncEmpty: 'Lines will appear here during sync...',
    finalLrcTitle: '3. Final LRC Result',
    copyLrc: 'Copy Final LRC',
    downloadLrc: '💾 Download .lrc File',
    toastNoAudio: 'Please choose an audio file first.',
    toastNoLyrics: 'Please paste some LRC lyrics first.',
    toastNoPlain: 'Please paste plain lyrics first.',
    toastLoaded: 'Lyrics loaded.',
    toastCopied: 'Copied to clipboard.',
    toastDownloaded: 'LRC file downloaded.',
    toastAllTagged: 'All lines tagged! 🎉',
    syncDone: 'Synced',
    tabLibrary: 'Library',
    saveToLibrary: 'Save this song to your library',
    coverOptional: 'Cover (optional)',
    saveBtn: 'Save',
    titlePlaceholder: 'Song title',
    libraryTitle: 'Your Library',
    librarySubtitle: 'Click a cover to jump straight to its synced lyrics — no re-uploading, no re-syncing.',
    libraryEmpty: 'No songs saved yet. Sync or load a song, then hit "Save" to add it here.',
    toastSaved: 'Saved to your library.',
    toastNeedTitle: 'Give the song a title first.',
    toastNeedAudioForSave: 'Load an audio file before saving.',
    toastNeedLrcForSave: 'Nothing to save yet — load or finish syncing lyrics first.',
    playBtn: 'Play',
    deleteBtn: 'Delete',
    confirmDelete: 'Remove this song from your library?',
    toastDeleted: 'Removed from library.',
    libStorageNote: 'Saved songs are stored only in this browser (IndexedDB) — they won\'t follow you to another device or browser.',
  },
  ar: {
    tabPlayer: 'المشغّل',
    tabGenerator: 'منشئ LRC',
    playerTitle: 'مشغّل الكلمات المتزامنة',
    playerStep1: '١. اختر ملف الصوت (MP3)',
    playerStep2: '٢. الصق نص LRC (مع الطوابع الزمنية)',
    generatorTitle: 'منشئ ملفات LRC',
    genStep1: '١. اختر ملف الصوت (MP3)',
    genStep2: '٢. الصق الكلمات بدون طوابع زمنية (سطر بسطر)',
    chooseAudio: 'اختر ملف الصوت',
    noFile: 'لم يتم اختيار ملف',
    speedLabel: 'السرعة:',
    repeatOff: 'تكرار السطر: متوقف',
    repeatOn: 'تكرار السطر: مفعّل',
    loadLyrics: 'تحميل الكلمات',
    fullscreen: '📺 ملء الشاشة',
    playerEmpty: 'حمّل الصوت والكلمات للبدء...',
    startSyncing: 'ابدأ المزامنة',
    stopSyncing: 'أوقف المزامنة',
    resetSync: 'إعادة تعيين',
    syncHint: '💡 اضغط <strong>(مسافة)</strong> أثناء التشغيل لوضع طابع لكل سطر!',
    syncProgressTitle: 'تقدّم المزامنة',
    recording: 'تسجيل',
    syncEmpty: 'ستظهر الأسطر هنا أثناء المزامنة...',
    finalLrcTitle: '٣. نتيجة LRC النهائية',
    copyLrc: 'نسخ LRC',
    downloadLrc: '💾 تنزيل ملف .lrc',
    toastNoAudio: 'اختر ملف صوت أولاً.',
    toastNoLyrics: 'الصق كلمات LRC أولاً.',
    toastNoPlain: 'الصق الكلمات أولاً.',
    toastLoaded: 'تم تحميل الكلمات.',
    toastCopied: 'تم النسخ إلى الحافظة.',
    toastDownloaded: 'تم تنزيل ملف LRC.',
    toastAllTagged: 'تم وضع طابع لكل الأسطر! 🎉',
    syncDone: 'تمت المزامنة',
    tabLibrary: 'المكتبة',
    saveToLibrary: 'احفظ هذه الأغنية في مكتبتك',
    coverOptional: 'صورة الغلاف (اختياري)',
    saveBtn: 'حفظ',
    titlePlaceholder: 'عنوان الأغنية',
    libraryTitle: 'مكتبتك',
    librarySubtitle: 'اضغط على الغلاف للانتقال مباشرة إلى كلماتها المتزامنة — بدون رفع أو مزامنة من جديد.',
    libraryEmpty: 'لا توجد أغاني محفوظة بعد. زامن أو حمّل أغنية ثم اضغط "حفظ" لإضافتها هنا.',
    toastSaved: 'تم الحفظ في مكتبتك.',
    toastNeedTitle: 'أعط الأغنية عنواناً أولاً.',
    toastNeedAudioForSave: 'حمّل ملف صوت قبل الحفظ.',
    toastNeedLrcForSave: 'لا يوجد شيء للحفظ بعد — حمّل أو أنهِ مزامنة الكلمات أولاً.',
    playBtn: 'تشغيل',
    deleteBtn: 'حذف',
    confirmDelete: 'هل تريد إزالة هذه الأغنية من مكتبتك؟',
    toastDeleted: 'تمت الإزالة من المكتبة.',
    libStorageNote: 'الأغاني المحفوظة مخزّنة فقط في هذا المتصفح (IndexedDB) — لن تظهر في جهاز أو متصفح آخر.',
  },
  ru: {
    tabPlayer: 'Плеер',
    tabGenerator: 'Генератор LRC',
    playerTitle: 'Плеер синхронизированного текста',
    playerStep1: '1. Выберите аудиофайл (MP3)',
    playerStep2: '2. Вставьте текст LRC (с таймкодами)',
    generatorTitle: 'Генератор файлов LRC',
    genStep1: '1. Выберите аудиофайл (MP3)',
    genStep2: '2. Вставьте текст построчно (без таймкодов)',
    chooseAudio: 'Выбрать файл',
    noFile: 'Файл не выбран',
    speedLabel: 'Скорость:',
    repeatOff: 'Повтор строки: ВЫКЛ',
    repeatOn: 'Повтор строки: ВКЛ',
    loadLyrics: 'Загрузить текст',
    fullscreen: '📺 Во весь экран',
    playerEmpty: 'Загрузите аудио и текст, чтобы начать...',
    startSyncing: 'Начать синхронизацию',
    stopSyncing: 'Остановить синхронизацию',
    resetSync: 'Сбросить',
    syncHint: '💡 Нажимайте <strong>(Пробел)</strong> во время воспроизведения, чтобы отметить каждую строку!',
    syncProgressTitle: 'Ход синхронизации',
    recording: 'Запись',
    syncEmpty: 'Строки будут появляться здесь во время синхронизации...',
    finalLrcTitle: '3. Итоговый файл LRC',
    copyLrc: 'Копировать LRC',
    downloadLrc: '💾 Скачать файл .lrc',
    toastNoAudio: 'Сначала выберите аудиофайл.',
    toastNoLyrics: 'Сначала вставьте текст LRC.',
    toastNoPlain: 'Сначала вставьте текст песни.',
    toastLoaded: 'Текст загружен.',
    toastCopied: 'Скопировано в буфер обмена.',
    toastDownloaded: 'Файл LRC скачан.',
    toastAllTagged: 'Все строки отмечены! 🎉',
    syncDone: 'Синхронизировано',
    tabLibrary: 'Библиотека',
    saveToLibrary: 'Сохранить эту песню в библиотеку',
    coverOptional: 'Обложка (необязательно)',
    saveBtn: 'Сохранить',
    titlePlaceholder: 'Название песни',
    libraryTitle: 'Ваша библиотека',
    librarySubtitle: 'Нажмите на обложку, чтобы сразу перейти к синхронизированному тексту — без повторной загрузки и синхронизации.',
    libraryEmpty: 'Пока нет сохранённых песен. Синхронизируйте или загрузите песню, затем нажмите «Сохранить».',
    toastSaved: 'Сохранено в библиотеке.',
    toastNeedTitle: 'Сначала дайте песне название.',
    toastNeedAudioForSave: 'Сначала загрузите аудиофайл.',
    toastNeedLrcForSave: 'Пока нечего сохранять — сначала загрузите или завершите синхронизацию текста.',
    playBtn: 'Играть',
    deleteBtn: 'Удалить',
    confirmDelete: 'Удалить эту песню из библиотеки?',
    toastDeleted: 'Удалено из библиотеки.',
    libStorageNote: 'Сохранённые песни хранятся только в этом браузере (IndexedDB) — они не будут доступны на другом устройстве или в другом браузере.',
  },
};

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key;
}

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  const idx = { en: 0, ar: 1, ru: 2 }[lang];
  document.querySelectorAll('.lang-btn')[idx].classList.add('active');

  document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!translations[lang] || !(key in translations[lang]) ) return;
    // repeat button / start-sync button carry dynamic state, handle separately
    if (el.id === 'repeat-btn') return;
    if (el.id === 'start-sync-btn') return;
    el.innerHTML = t(key);
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (translations[lang] && key in translations[lang]) el.placeholder = t(key);
  });

  renderLibrary();

  // Re-apply dynamic button labels with current state
  const repeatBtn = document.getElementById('repeat-btn');
  repeatBtn.textContent = player.repeatOn ? t('repeatOn') : t('repeatOff');

  const startBtn = document.getElementById('start-sync-btn');
  startBtn.textContent = generator.active ? t('stopSyncing') : t('startSyncing');

  updateSyncPreview();
}

// ---------- Toast ----------
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

// ---------- Tab Switching ----------
const TAB_INDEX = { player: 0, generator: 1, library: 2 };
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));

  document.querySelectorAll('.tab-btn')[TAB_INDEX[tabName]].classList.add('active');
  document.getElementById(`${tabName}-view`).classList.add('active');

  if (tabName === 'library') renderLibrary();
}

// ---------- Setup on load ----------
document.addEventListener('DOMContentLoaded', () => {
  player.audio = document.getElementById('audio-element');
  generator.audio = document.getElementById('gen-audio-element');

  // File pickers -> object URLs
  document.getElementById('player-audio-file').addEventListener('change', function (e) {
    const file = e.target.files[0];
    document.getElementById('player-file-name').textContent = file ? file.name : t('noFile');
    if (file) {
      player.audio.src = URL.createObjectURL(file);
      const titleInput = document.getElementById('player-save-title');
      if (titleInput && !titleInput.value.trim()) {
        titleInput.value = file.name.replace(/\.[^/.]+$/, '');
      }
    }
  });

  document.getElementById('gen-audio-file').addEventListener('change', function (e) {
    const file = e.target.files[0];
    document.getElementById('gen-file-name').textContent = file ? file.name : t('noFile');
    if (file) {
      generator.audio.src = URL.createObjectURL(file);
      const titleInput = document.getElementById('gen-save-title');
      if (titleInput && !titleInput.value.trim()) {
        titleInput.value = file.name.replace(/\.[^/.]+$/, '');
      }
    }
  });

  // Player: highlight active line as audio plays
  player.audio.addEventListener('timeupdate', onPlayerTimeUpdate);

  // Generator: spacebar tagging
  document.addEventListener('keydown', handleSyncKeydown);
});

// ---------- Speed Controls ----------
function setSpeed(speed, btn) {
  if (player.audio) player.audio.playbackRate = speed;
  if (btn) {
    document.querySelectorAll('#player-speed-group .btn-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

function setGenSpeed(speed, btn) {
  if (generator.audio) generator.audio.playbackRate = speed;
  if (btn) {
    document.querySelectorAll('#gen-speed-group .btn-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

// ---------- Seek / Repeat / Fullscreen (Player) ----------
function seekAudio(deltaSeconds) {
  if (!player.audio) return;
  player.audio.currentTime = Math.max(0, player.audio.currentTime + deltaSeconds);
}

function toggleRepeat() {
  player.repeatOn = !player.repeatOn;
  const btn = document.getElementById('repeat-btn');
  btn.textContent = player.repeatOn ? t('repeatOn') : t('repeatOff');
  btn.classList.toggle('active', player.repeatOn);
}

function toggleFullscreen() {
  const container = document.getElementById('lyrics-container');
  container.classList.toggle('fullscreen-mode');
}

// ---------- LRC Parsing (Player) ----------
function parseLRC(raw) {
  const timeTag = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
  const lines = raw.split('\n');
  const result = [];

  lines.forEach(line => {
    const tags = [...line.matchAll(timeTag)];
    if (tags.length === 0) return;
    const text = line.replace(timeTag, '').trim();
    if (!text) return;
    tags.forEach(tag => {
      const min = parseInt(tag[1], 10);
      const sec = parseInt(tag[2], 10);
      let frac = tag[3] ? tag[3] : '0';
      frac = frac.length === 1 ? frac + '00' : frac.length === 2 ? frac + '0' : frac;
      const ms = parseInt(frac, 10);
      const time = min * 60 + sec + ms / 1000;
      result.push({ time, text });
    });
  });

  result.sort((a, b) => a.time - b.time);
  return result;
}

function loadLyrics() {
  const raw = document.getElementById('lrc-input').value;
  if (!player.audio || !player.audio.src) {
    showToast(t('toastNoAudio'));
  }
  if (!raw.trim()) {
    showToast(t('toastNoLyrics'));
    return;
  }

  const parsed = parseLRC(raw);
  const container = document.getElementById('lyrics-container');
  container.innerHTML = '';
  container.classList.remove('fullscreen-mode');

  if (parsed.length === 0) {
    container.innerHTML = `<div class="empty-state">${t('toastNoLyrics')}</div>`;
    return;
  }

  player.lines = parsed.map((line, i) => {
    const el = document.createElement('div');
    el.className = 'lyric-line';
    el.textContent = line.text;
    el.dataset.time = line.time;
    el.addEventListener('click', () => {
      if (player.audio) {
        player.audio.currentTime = line.time;
        player.audio.play().catch(() => {});
      }
    });
    container.appendChild(el);
    return { ...line, el };
  });

  player.activeIndex = -1;
  showToast(t('toastLoaded'));
}

function onPlayerTimeUpdate() {
  if (!player.lines.length) return;
  const currentTime = player.audio.currentTime;

  // Find the last line whose time <= currentTime
  let idx = -1;
  for (let i = 0; i < player.lines.length; i++) {
    if (player.lines[i].time <= currentTime) idx = i;
    else break;
  }

  // Repeat-line mode: loop back once we cross into the next line
  if (player.repeatOn && player.activeIndex !== -1 && idx > player.activeIndex) {
    player.audio.currentTime = player.lines[player.activeIndex].time;
    return;
  }

  if (idx !== player.activeIndex) {
    if (player.activeIndex >= 0 && player.lines[player.activeIndex]) {
      player.lines[player.activeIndex].el.classList.remove('active-line');
    }
    if (idx >= 0) {
      const activeEl = player.lines[idx].el;
      activeEl.classList.add('active-line');
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    player.activeIndex = idx;
  }
}

// ---------- Generator: Syncing ----------
function startSyncing() {
  if (!generator.audio || !generator.audio.src) {
    showToast(t('toastNoAudio'));
    return;
  }

  if (generator.active) {
    // Acts as "stop"
    stopSyncing();
    return;
  }

  const raw = document.getElementById('plain-lyrics-input').value;
  const plain = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (plain.length === 0) {
    showToast(t('toastNoPlain'));
    return;
  }

  generator.plainLines = plain;
  generator.syncedLines = [];
  generator.index = 0;
  generator.active = true;

  document.getElementById('start-sync-btn').textContent = t('stopSyncing');
  document.getElementById('rec-indicator').classList.remove('hidden');
  document.getElementById('final-lrc-output').value = '';

  generator.audio.currentTime = 0;
  generator.audio.play().catch(() => {});

  updateSyncPreview();
}

function stopSyncing(silent) {
  generator.active = false;
  document.getElementById('start-sync-btn').textContent = t('startSyncing');
  document.getElementById('rec-indicator').classList.add('hidden');
  if (generator.audio) generator.audio.pause();
  buildFinalLRC();
}

function handleSyncKeydown(e) {
  if (e.code !== 'Space' && e.key !== ' ') return;
  if (!generator.active) return;

  // Don't hijack space if user is typing in a textarea/input
  const tag = document.activeElement.tagName;
  if (tag === 'TEXTAREA' || tag === 'INPUT') return;

  e.preventDefault();

  if (generator.index >= generator.plainLines.length) return;

  const time = generator.audio.currentTime;
  const text = generator.plainLines[generator.index];
  generator.syncedLines.push({ time, text });
  generator.index++;

  updateSyncPreview();
  buildFinalLRC();

  if (generator.index >= generator.plainLines.length) {
    showToast(t('toastAllTagged'));
    stopSyncing();
  }
}

function updateSyncPreview() {
  const box = document.getElementById('sync-preview');
  const fill = document.getElementById('progress-fill');
  const total = generator.plainLines.length;

  if (total === 0) {
    box.innerHTML = `<span class="empty-state">${t('syncEmpty')}</span>`;
    fill.style.width = '0%';
    return;
  }

  const done = generator.index;
  const pct = Math.round((done / total) * 100);
  fill.style.width = pct + '%';

  if (done >= total) {
    box.innerHTML = `<div class="preview-done">${t('syncDone')} — ${total}/${total}</div>`;
    return;
  }

  const current = generator.plainLines[done] || '';
  const next = generator.plainLines[done + 1] || '';

  box.innerHTML = `
    <div class="preview-count">${done}/${total}</div>
    <div class="preview-current">▶ ${escapeHTML(current)}</div>
    ${next ? `<div class="preview-next">${escapeHTML(next)}</div>` : ''}
  `;
}

function resetSync() {
  generator.active = false;
  generator.plainLines = [];
  generator.syncedLines = [];
  generator.index = 0;
  if (generator.audio) {
    generator.audio.pause();
    generator.audio.currentTime = 0;
  }
  document.getElementById('start-sync-btn').textContent = t('startSyncing');
  document.getElementById('rec-indicator').classList.add('hidden');
  document.getElementById('sync-preview').innerHTML = `<span class="empty-state">${t('syncEmpty')}</span>`;
  document.getElementById('progress-fill').style.width = '0%';
  document.getElementById('final-lrc-output').value = '';
}

function formatLRCTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const cs = Math.floor((seconds - Math.floor(seconds)) * 100);
  return `[${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}]`;
}

function buildFinalLRC() {
  const output = generator.syncedLines
    .map(line => `${formatLRCTime(line.time)} ${line.text}`)
    .join('\n');
  document.getElementById('final-lrc-output').value = output;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
// Library — songs saved once, replayed instantly with lyrics
// Stored locally in this browser via IndexedDB (audio + cover
// as Blobs, lyrics as text). Nothing leaves the device.
// ============================================================
const DB_NAME = 'lrcStudioLibrary';
const DB_VERSION = 1;
const STORE_NAME = 'songs';
let dbPromise = null;

function openLibraryDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function dbAddSong(song) {
  const db = await openLibraryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(song);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGetAllSongs() {
  const db = await openLibraryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function dbGetSong(id) {
  const db = await openLibraryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function dbDeleteSong(id) {
  const db = await openLibraryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ---------- Save from Player tab ----------
async function saveFromPlayer() {
  const titleInput = document.getElementById('player-save-title');
  const coverInput = document.getElementById('player-save-cover');
  const title = titleInput.value.trim();
  const lrcText = document.getElementById('lrc-input').value.trim();
  const fileInput = document.getElementById('player-audio-file');
  const audioFile = fileInput.files[0];

  if (!title) { showToast(t('toastNeedTitle')); return; }
  if (!audioFile) { showToast(t('toastNeedAudioForSave')); return; }
  if (!lrcText) { showToast(t('toastNeedLrcForSave')); return; }

  await persistSong({
    title,
    audioBlob: audioFile,
    audioType: audioFile.type || 'audio/mpeg',
    lrcText,
    coverBlob: coverInput.files[0] || null,
  });

  titleInput.value = '';
  coverInput.value = '';
  showToast(t('toastSaved'));
}

// ---------- Save from Generator tab ----------
async function saveFromGenerator() {
  const titleInput = document.getElementById('gen-save-title');
  const coverInput = document.getElementById('gen-save-cover');
  const title = titleInput.value.trim();
  const lrcText = document.getElementById('final-lrc-output').value.trim();
  const fileInput = document.getElementById('gen-audio-file');
  const audioFile = fileInput.files[0];

  if (!title) { showToast(t('toastNeedTitle')); return; }
  if (!audioFile) { showToast(t('toastNeedAudioForSave')); return; }
  if (!lrcText) { showToast(t('toastNeedLrcForSave')); return; }

  await persistSong({
    title,
    audioBlob: audioFile,
    audioType: audioFile.type || 'audio/mpeg',
    lrcText,
    coverBlob: coverInput.files[0] || null,
  });

  titleInput.value = '';
  coverInput.value = '';
  showToast(t('toastSaved'));
}

async function persistSong({ title, audioBlob, audioType, lrcText, coverBlob }) {
  const song = {
    title,
    addedAt: Date.now(),
    audioBlob,
    audioType,
    lrcText,
    coverBlob: coverBlob || null,
    coverType: coverBlob ? coverBlob.type : null,
  };
  await dbAddSong(song);
}

// ---------- Render library grid ----------
async function renderLibrary() {
  const grid = document.getElementById('library-grid');
  if (!grid) return;
  const songs = await dbGetAllSongs();
  const countEl = document.getElementById('library-count');
  if (countEl) countEl.textContent = songs.length ? String(songs.length) : '';

  if (songs.length === 0) {
    grid.innerHTML = `<div class="empty-state">${t('libraryEmpty')}</div>`;
    return;
  }

  songs.sort((a, b) => b.addedAt - a.addedAt);
  grid.innerHTML = '';

  songs.forEach(song => {
    const card = document.createElement('div');
    card.className = 'library-card';

    const coverWrap = document.createElement('div');
    coverWrap.className = 'library-cover';
    if (song.coverBlob) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(song.coverBlob);
      coverWrap.appendChild(img);
    } else {
      coverWrap.innerHTML = defaultCoverSVG();
    }
    coverWrap.addEventListener('click', () => playFromLibrary(song.id));

    const meta = document.createElement('div');
    meta.className = 'library-meta';

    const titleEl = document.createElement('div');
    titleEl.className = 'library-title';
    titleEl.textContent = song.title;

    const btnRow = document.createElement('div');
    btnRow.className = 'library-btn-row';

    const playBtn = document.createElement('button');
    playBtn.className = 'btn-primary mini-save-btn';
    playBtn.textContent = t('playBtn');
    playBtn.onclick = () => playFromLibrary(song.id);

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-danger mini-save-btn';
    delBtn.textContent = t('deleteBtn');
    delBtn.onclick = () => deleteFromLibrary(song.id);

    btnRow.appendChild(playBtn);
    btnRow.appendChild(delBtn);
    meta.appendChild(titleEl);
    meta.appendChild(btnRow);

    card.appendChild(coverWrap);
    card.appendChild(meta);
    grid.appendChild(card);
  });
}

function defaultCoverSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="default-cover-icon">
    <path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>
  </svg>`;
}

async function playFromLibrary(id) {
  const song = await dbGetSong(id);
  if (!song) return;

  const url = URL.createObjectURL(song.audioBlob);
  player.audio.src = url;
  document.getElementById('lrc-input').value = song.lrcText;
  document.getElementById('player-file-name').textContent = song.title;
  document.getElementById('player-save-title').value = song.title;

  switchTab('player');
  loadLyrics();
  player.audio.play().catch(() => {});
}

async function deleteFromLibrary(id) {
  if (!confirm(t('confirmDelete'))) return;
  await dbDeleteSong(id);
  showToast(t('toastDeleted'));
  renderLibrary();
}

// ---------- Copy / Download ----------
function copyLRC() {
  const output = document.getElementById('final-lrc-output');
  if (!output.value.trim()) return;
  navigator.clipboard.writeText(output.value).then(() => {
    showToast(t('toastCopied'));
  }).catch(() => {
    output.select();
    document.execCommand('copy');
    showToast(t('toastCopied'));
  });
}

function downloadLRC() {
  const output = document.getElementById('final-lrc-output').value;
  if (!output.trim()) return;

  const genFileInput = document.getElementById('gen-audio-file');
  let filename = 'lyrics.lrc';
  if (genFileInput.files[0]) {
    filename = genFileInput.files[0].name.replace(/\.[^/.]+$/, '') + '.lrc';
  }

  const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(t('toastDownloaded'));
}
