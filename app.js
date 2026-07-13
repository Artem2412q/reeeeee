(() => {
  'use strict';

  const STORAGE_KEY = 'magnit-dp-manual-v20';
  const LEGACY_KEYS = ['magnit-dp-manual-v19', 'magnit-dp-manual-v18', 'magnit-dp-manual-v17', 'magnit-dp-state-v14', 'magnit-dp-state-v13', 'magnit-dp-state-v12'];
  const MAX_SKU = 5;
  const MAX_DEFECTS = 6;
  const AUTH_SESSION_KEY = 'magnit-dp-auth-v20';
  const AUTH_USER_B64 = 'bWFnbml0X2Rw';
  const AUTH_PASS_B64 = 'MTUwMjkxODQ=';

  const STEP_GROUPS = [
    { id: 0, title: 'Замер ВПТ', short: 'ВПТ', description: 'Фиксация фотографии и внутриплодной температуры.' },
    { id: 1, title: 'Подготовка', short: 'Подготовка', description: 'Проверка заявки и размещения категорий.' },
    { id: 2, title: 'Выкладка тарных единиц', short: 'Тара', description: 'Контроль расположения выборки относительно камеры.' },
    { id: 3, title: 'Проверка весов', short: 'Весы', description: 'Исправность и обнуление весов.' },
    { id: 4, title: 'Контрольное взвешивание выборки', short: 'Взвешивание', description: 'Подтверждение контрольного взвешивания.' },
    { id: 5, title: 'Выкладка выборки на стол', short: 'Выкладка', description: 'Взвешивание тары и раскладка товара в один слой.' },
    { id: 6, title: 'Определение сорта / цветности', short: 'Цветность', description: 'Выполняется только при включённом контроле цветности.' },
    { id: 7, title: 'Сортировка на категории', short: 'Категории', description: 'Осмотр, распределение по категориям и контроль ошибок.' },
    { id: 8, title: 'Разрушающий контроль и измерения', short: 'Измерения', description: 'Разрушающий контроль выполняется всегда. Плотность и Brix включаются вручную.' },
    { id: 9, title: 'Контрольное взвешивание категорий', short: 'Категории', description: 'Взвешивание тары и каждой категории товара.' },
    { id: 10, title: 'Очистка рабочего пространства', short: 'Завершение', description: 'Освобождение стола после завершения контроля.' },
  ];

  const QUESTIONS = [
    { code: '0.1', row: 18, step: 0, text: 'Есть фото замера ВПТ', type: 'yesno' },
    { code: '1.1', row: 21, step: 1, text: 'Акт ТМЦ расположен на столе', type: 'yesno' },
    { code: '1.2', row: 22, step: 1, text: 'Таблички категорий разложены на столе', type: 'yesno' },
    { code: '2.1', row: 24, step: 2, text: 'Выборка расположена к камере скотчем', type: 'yesno' },
    { code: '2.2', row: 25, step: 2, text: 'Скотч виден на каждой тарной единице', type: 'yesno' },
    { code: '3.1', row: 26, step: 3, text: 'Весы исправны, включены и работают', type: 'yesno' },
    { code: '3.3', row: 27, step: 3, text: 'Сделано обнуление прибора', type: 'yesno' },
    { code: '4.1', row: 28, step: 4, text: 'Контрольное взвешивание произведено', type: 'yesno' },
    { code: '5.1', row: 29, step: 5, text: 'Пустая тара из выборки взвешена', type: 'yesno' },
    { code: '5.2', row: 30, step: 5, text: 'Каждая единица товара разложена на стол в один слой', type: 'yesno' },
    { code: '5.3', row: 31, step: 5, text: 'Сколько раз выборка была выложена на стол в один слой', type: 'number', min: 0, unit: 'раз' },
    { code: '6.1', row: 32, step: 6, text: 'Проверен веером цветности', type: 'yesno', feature: 'requiresColor' },
    { code: '6.2', row: 33, step: 6, text: 'Веер цветности расположен по центру стола и не закрывает товарные единицы', type: 'yesno', feature: 'requiresColor' },
    { code: '7.1', row: 34, step: 7, text: 'Каждая товарная единица осмотрена со всех сторон', type: 'yesno' },
    { code: '7.2', row: 35, step: 7, text: 'Единицы товара разложены по ячейкам с табличками в один слой', type: 'yesno' },
    { code: '7.3', row: 36, step: 7, text: 'Единицы товара в ячейках соответствуют категории / табличке', type: 'yesno' },
    { code: '7.4', row: 37, step: 7, text: 'Количество ошибок на качество', type: 'number', min: 0, unit: 'ошибок' },
    { code: '7.5', row: 38, step: 7, text: 'Замер лимитирующих дефектов / калибра сделан корректно на камеру', type: 'yesno' },
    { code: '8.1', row: 39, step: 8, text: 'Разрушающий контроль выполнен корректно — не менее 2% от общей выборки категории качества', type: 'yesno' },
    { code: '8.4', row: 40, step: 8, text: 'Измерение плотности сделано корректно по инструкции и бизнес-процессу', type: 'yesno', feature: 'requiresDensity' },
    { code: '8.5', row: 41, step: 8, text: 'Прибор плотности расположен на столе с единицей товара', type: 'yesno', feature: 'requiresDensity' },
    { code: '8.7', row: 42, step: 8, text: 'Замер сахара Brix сделан корректно по инструкции и бизнес-процессу', type: 'yesno', feature: 'requiresBrix' },
    { code: '8.8', row: 43, step: 8, text: 'Прибор Brix расположен на столе с единицей товара', type: 'yesno', feature: 'requiresBrix' },
    { code: '9.1', row: 45, step: 9, text: 'Весы исправны, включены и работают', type: 'yesno' },
    { code: '9.4', row: 46, step: 9, text: 'Взвешана тара, сделано обнуление весов', type: 'yesno' },
    { code: '9.6', row: 47, step: 9, text: 'Взвешена каждая категория товара в таре: брак, нестандарт, некалибр, осыпь', type: 'yesno' },
    { code: '10.1', row: 48, step: 10, text: 'Стол очищен от выборки', type: 'yesno' },
  ];

  const PAGE_META = {
    shipment: ['Этап 1 из 5', 'Приёмка'],
    products: ['Этап 2 из 5', 'Товары'],
    checklist: ['Этап 3 из 5', 'Пошаговый чек-лист'],
    defects: ['Этап 4 из 5', 'Реестр дефектов'],
    summary: ['Этап 5 из 5', 'Итоги и выгрузка'],
  };

  const FEATURE_LABELS = {
    requiresColor: ['Цветность', 'Добавляет контроль веером цветности в чек-лист'],
    requiresDensity: ['Плотность / пенетрация', 'Добавляет контроль измерения плотности в чек-лист'],
    requiresBrix: ['Brix', 'Добавляет контроль сахара Brix в чек-лист'],
  };

  const defaultSku = () => ({
    id: globalThis.crypto?.randomUUID?.() || `sku-${Date.now()}-${Math.random()}`,
    code: '', name: '', vpt: '', sampleMass: '', defectMass: '', nonstandardMass: '', debrisMass: '', caliberMass: '',
    wasteLimit: '', apmError: 'no', comment: '', requiresColor: false, requiresDensity: false, requiresBrix: false,
    checklist: {}, defects: [],
  });

  const defaultState = () => ({
    version: 20,
    shipment: {
      id: '', rc: '', date: todayInput(), supplier: '', format: 'Онлайн', mokk: '', dpId: '',
      connectionTime: '', acceptanceStart: '', acceptanceEnd: '', reportEnd: '',
    },
    skus: [defaultSku()],
    notes: '',
    ui: {
      page: 'shipment', currentSku: 0, checkStep: 0, theme: 'light', defectSearch: '', defectSeverity: 'all', defectVisual: 'all',
      notesOpen: false, notesPinned: true, notesMinimized: false, notesPosition: null,
    },
    updatedAt: new Date().toISOString(),
  });

  let state = loadState();
  let saveTimer = null;
  let dragState = null;
  let activeExportAbortController = null;
  let exportCancelled = false;

  const appShell = document.querySelector('.app-shell');
  const mobileNav = document.querySelector('.mobile-nav');
  const loginOverlay = document.getElementById('loginOverlay');
  const pageContent = document.getElementById('pageContent');
  const notesPanel = document.getElementById('notesPanel');
  const notesTextarea = document.getElementById('notesTextarea');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const loadingOverlay = document.getElementById('loadingOverlay');
  let authenticated = sessionStorage.getItem(AUTH_SESSION_KEY) === '1';

  function decodeBase64(value) {
    try { return atob(value); } catch (_) { return ''; }
  }

  function setAuthenticated(isAuth) {
    authenticated = Boolean(isAuth);
    sessionStorage.setItem(AUTH_SESSION_KEY, authenticated ? '1' : '0');
    document.body.classList.toggle('auth-locked', !authenticated);
    loginOverlay.hidden = authenticated;
    appShell.hidden = !authenticated;
    if (mobileNav) mobileNav.hidden = !authenticated;
    if (!authenticated) {
      notesPanel.classList.remove('open');
      modalBackdrop.hidden = true;
      loadingOverlay.hidden = true;
    }
    if (authenticated) {
      render();
      updateNotesPanel();
    }
  }

  function handleLoginSubmit(event) {
    event.preventDefault();
    const userInput = document.getElementById('loginUsername');
    const passInput = document.getElementById('loginPassword');
    const errorEl = document.getElementById('loginError');
    const login = (userInput?.value || '').trim();
    const password = passInput?.value || '';
    const loginOk = login === decodeBase64(AUTH_USER_B64);
    const passOk = password === decodeBase64(AUTH_PASS_B64);
    if (!loginOk || !passOk) {
      if (errorEl) errorEl.textContent = 'Неверный логин или пароль.';
      passInput?.focus();
      passInput?.select?.();
      return;
    }
    if (errorEl) errorEl.textContent = '';
    if (userInput) userInput.value = '';
    if (passInput) passInput.value = '';
    setAuthenticated(true);
    toast('Авторизация выполнена.', 'success');
  }

  function logout() {
    if (!authenticated) return;
    if (!confirm('Выйти из системы?')) return;
    setAuthenticated(false);
    const errorEl = document.getElementById('loginError');
    if (errorEl) errorEl.textContent = '';
    document.getElementById('loginForm')?.reset();
    document.getElementById('loginUsername')?.focus();
  }

  function initAuth() {
    document.getElementById('loginForm')?.addEventListener('submit', handleLoginSubmit);
    document.getElementById('togglePassword')?.addEventListener('click', () => {
      const input = document.getElementById('loginPassword');
      const btn = document.getElementById('togglePassword');
      if (!input || !btn) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Скрыть' : 'Показать';
      btn.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
    });
    ['logoutButton', 'logoutSidebar'].forEach(id => document.getElementById(id)?.addEventListener('click', logout));
    document.body.classList.toggle('auth-locked', !authenticated);
    loginOverlay.hidden = authenticated;
    appShell.hidden = !authenticated;
    if (mobileNav) mobileNav.hidden = !authenticated;
    if (!authenticated) setTimeout(() => document.getElementById('loginUsername')?.focus(), 60);
  }

  function todayInput() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function nowLocalInput() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function checklistDateTimeFromTime(value) {
    if (!value) return '';
    const time = String(value).length === 5 ? `${value}:00` : String(value);
    return `${state.shipment.date || todayInput()}T${time}`;
  }

  function timeOnly(value) {
    if (!value) return '';
    const match = String(value).match(/(?:T|^)(\d{2}:\d{2}(?::\d{2})?)/);
    if (match) return match[1].length === 5 ? `${match[1]}:00` : match[1];
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('ru-RU', { hour12: false });
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  }
  const escapeAttr = escapeHtml;
  function numeric(value) {
    if (value === '' || value === null || value === undefined) return 0;
    const n = Number(String(value).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  }
  function hasNumber(value) { return value !== '' && value !== null && value !== undefined && Number.isFinite(Number(String(value).replace(',', '.'))); }
  function displayNumber(value, digits = 2) {
    return hasNumber(value) ? new Intl.NumberFormat('ru-RU', { maximumFractionDigits: digits }).format(numeric(value)) : '—';
  }
  function percent(part, total) { return numeric(total) > 0 ? numeric(part) / numeric(total) * 100 : 0; }
  function formatPercent(value) { return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(Number(value) || 0)}%`; }
  function formatDateTime(value) {
    if (!value) return 'Не указано';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? 'Не указано' : new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(d);
  }
  function formatDuration(start, end) {
    if (!start || !end) return '00:00:00';
    const ms = Math.max(0, new Date(end) - new Date(start));
    if (!Number.isFinite(ms)) return '00:00:00';
    const seconds = Math.floor(ms / 1000);
    return `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function migrateSku(raw = {}) {
    return {
      ...defaultSku(),
      code: raw.code || '', name: raw.name || '', vpt: raw.vpt || '', sampleMass: raw.sampleMass ?? '',
      defectMass: raw.defectMass ?? '', nonstandardMass: raw.nonstandardMass ?? '', debrisMass: raw.debrisMass ?? '',
      caliberMass: raw.caliberMass ?? '', wasteLimit: raw.wasteLimit ?? '', apmError: raw.apmError || 'no', comment: raw.comment || '',
      requiresColor: Boolean(raw.requiresColor), requiresDensity: Boolean(raw.requiresDensity), requiresBrix: Boolean(raw.requiresBrix),
      checklist: raw.checklist && typeof raw.checklist === 'object' ? raw.checklist : {},
      defects: Array.isArray(raw.defects) ? raw.defects.slice(0, MAX_DEFECTS).map(d => {
        const savedCategory = d?.severity;
        const severity = savedCategory === 'defect' || savedCategory === 'nonstandard'
          ? savedCategory
          : savedCategory === 'critical' ? 'defect' : 'nonstandard';
        const visual = d?.visual === 'yes' ? 'yes' : d?.visual ? 'no' : '';
        return { type: '', visual, count: '', severity, comment: '', ...d, visual, severity };
      }) : [],
    };
  }

  function loadState() {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        for (const key of LEGACY_KEYS) {
          raw = localStorage.getItem(key);
          if (raw) break;
        }
      }
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const base = defaultState();
      return {
        ...base,
        ...parsed,
        version: 20,
        shipment: { ...base.shipment, ...(parsed.shipment || {}), format: ['Онлайн', 'Архив'].includes(parsed.shipment?.format) ? parsed.shipment.format : 'Онлайн' },
        skus: Array.isArray(parsed.skus) && parsed.skus.length ? parsed.skus.slice(0, MAX_SKU).map(migrateSku) : [defaultSku()],
        ui: { ...base.ui, ...(parsed.ui || {}), page: PAGE_META[parsed.ui?.page] ? parsed.ui.page : 'shipment' },
      };
    } catch (error) {
      console.warn('Не удалось прочитать сохранение', error);
      return defaultState();
    }
  }

  function scheduleSave() {
    state.updatedAt = new Date().toISOString();
    const el = document.getElementById('saveState');
    el?.classList.add('saving');
    if (el?.querySelector('b')) el.querySelector('b').textContent = 'Сохраняем…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      el?.classList.remove('saving');
      if (el?.querySelector('b')) el.querySelector('b').textContent = 'Сохранено';
      updateGlobalProgress();
    }, 220);
  }
  function saveNow() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

  function getSkuLabel(sku, index) { return sku.name || sku.code || `Товар ${index + 1}`; }
  function isApplicable(sku, question) { return !question.feature || Boolean(sku[question.feature]); }
  function getAnswer(sku, code) { return { status: '', value: '', time: '', comment: '', ...(sku.checklist?.[code] || {}) }; }
  function isAnswered(sku, question) {
    if (!isApplicable(sku, question)) return true;
    const a = getAnswer(sku, question.code);
    return question.type === 'number' ? a.value !== '' : Boolean(a.status);
  }
  function questionsForStep(sku, stepId) { return QUESTIONS.filter(q => q.step === stepId && isApplicable(sku, q)); }
  function getStepState(sku, stepId) {
    const qs = questionsForStep(sku, stepId);
    if (!qs.length) return 'skipped';
    const done = qs.filter(q => isAnswered(sku, q)).length;
    return done === qs.length ? 'done' : done ? 'partial' : 'empty';
  }
  function getChecklistStats() {
    let total = 0; let done = 0;
    state.skus.forEach(sku => QUESTIONS.forEach(q => {
      if (!isApplicable(sku, q)) return;
      total += 1;
      if (isAnswered(sku, q)) done += 1;
    }));
    return { total, done, percent: total ? Math.round(done / total * 100) : 0 };
  }
  function getCompletion() {
    let total = 5; let done = 0;
    const s = state.shipment;
    if (s.id.trim() && s.rc.trim() && s.supplier.trim() && s.date && s.dpId.trim()) done += 1;
    if (state.skus.length && state.skus.every(x => x.code.trim() && x.name.trim() && numeric(x.sampleMass) > 0)) done += 1;
    const stats = getChecklistStats();
    if (stats.total && stats.done === stats.total) done += 1;
    if (state.skus.every(x => Array.isArray(x.defects))) done += 1;
    if (s.acceptanceEnd && s.reportEnd) done += 1;
    return { total, done, percent: Math.round(done / total * 100) };
  }
  function getValidation() {
    const errors = []; const warnings = [];
    const s = state.shipment;
    if (!s.supplier.trim()) errors.push('Не указано название поставщика.');
    if (!s.id.trim()) errors.push('Не указан номер заявки / поставки.');
    if (!s.rc.trim()) errors.push('Не указан РЦ.');
    if (!s.date) errors.push('Не указана дата приёмки.');
    if (!s.dpId.trim()) warnings.push('Не указан ДП (ID).');
    state.skus.forEach((sku, index) => {
      const label = `Товар ${index + 1}`;
      if (!sku.code.trim()) errors.push(`${label}: не указан код товара.`);
      if (!sku.name.trim()) errors.push(`${label}: не указано название.`);
      if (numeric(sku.sampleMass) <= 0) errors.push(`${getSkuLabel(sku, index)}: масса выборки должна быть больше нуля.`);
      const incomplete = QUESTIONS.filter(q => isApplicable(sku, q) && !isAnswered(sku, q));
      if (incomplete.length) warnings.push(`${getSkuLabel(sku, index)}: не заполнено пунктов чек-листа — ${incomplete.length}.`);
    });
    if (!s.acceptanceEnd) warnings.push('Не зафиксировано окончание приёмки.');
    if (!s.reportEnd) warnings.push('Не зафиксировано окончание заполнения отчёта.');
    return { errors, warnings };
  }

  function setNavCheck(name, complete) {
    const el = document.getElementById(`navCheck${name}`);
    if (el) el.textContent = complete ? '✓' : '·';
  }
  function updateGlobalProgress() {
    const c = getCompletion();
    document.getElementById('sidebarProgressText').textContent = `${c.percent}%`;
    document.getElementById('sidebarProgressFill').style.width = `${c.percent}%`;
    document.getElementById('sidebarProgressHint').textContent = c.percent === 100 ? 'Данные готовы к выгрузке' : `${c.done} из ${c.total} разделов завершено`;
    const s = state.shipment;
    setNavCheck('Shipment', Boolean(s.id.trim() && s.rc.trim() && s.supplier.trim() && s.date));
    setNavCheck('Products', state.skus.every(x => x.code.trim() && x.name.trim() && numeric(x.sampleMass) > 0));
    const stats = getChecklistStats();
    setNavCheck('Checklist', stats.total > 0 && stats.done === stats.total);
    setNavCheck('Defects', true);
    setNavCheck('Summary', Boolean(s.acceptanceEnd && s.reportEnd));
  }

  function setPage(page) {
    if (!PAGE_META[page]) return;
    state.ui.page = page;
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarBackdrop')?.classList.remove('open');
    scheduleSave();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function render() {
    document.documentElement.dataset.theme = state.ui.theme;
    const [eyebrow, title] = PAGE_META[state.ui.page];
    document.getElementById('pageEyebrow').textContent = eyebrow;
    document.getElementById('pageTitle').textContent = title;
    document.querySelectorAll('[data-page]').forEach(el => el.classList.toggle('active', el.dataset.page === state.ui.page));
    const renderer = { shipment: renderShipment, products: renderProducts, checklist: renderChecklist, defects: renderDefects, summary: renderSummary }[state.ui.page];
    const nextMarkup = renderer();
    if (pageContent.innerHTML !== nextMarkup) pageContent.innerHTML = nextMarkup;
    updateGlobalProgress();
    updateNotesPanel();
  }

  function pageHeading(title, description, actions = '') {
    return `<div class="page-heading"><div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p></div><div class="page-heading-actions">${actions}</div></div>`;
  }
  function field(label, path, value, type = 'text', options = {}) {
    const required = options.required ? '<span class="required">*</span>' : '';
    const suffix = options.suffix ? `<span class="input-suffix">${escapeHtml(options.suffix)}</span>` : '';
    return `<div class="field"><label>${escapeHtml(label)} ${required}</label><div class="${suffix ? 'input-group' : ''}"><input class="input" type="${type}" data-field="${escapeAttr(path)}" value="${escapeAttr(value ?? '')}" ${options.placeholder ? `placeholder="${escapeAttr(options.placeholder)}"` : ''} ${options.min !== undefined ? `min="${options.min}"` : ''} ${options.step ? `step="${options.step}"` : ''} />${suffix}</div>${options.hint ? `<span class="field-hint">${escapeHtml(options.hint)}</span>` : ''}</div>`;
  }
  function selectField(label, path, value, options, required = false) {
    return `<div class="field"><label>${escapeHtml(label)} ${required ? '<span class="required">*</span>' : ''}</label><select class="select" data-field="${escapeAttr(path)}">${options.map(o => `<option value="${escapeAttr(o.value)}" ${o.value === value ? 'selected' : ''}>${escapeHtml(o.label)}</option>`).join('')}</select></div>`;
  }
  function timerCard(label, key, hint) {
    const value = state.shipment[key];
    return `<div class="timer-card"><span>${escapeHtml(label)}</span><strong class="timer-value">${escapeHtml(value ? timeOnly(value) : '—:—:—')}</strong><div class="timer-actions"><input class="input" type="datetime-local" step="1" data-field="shipment.${key}" value="${escapeAttr(value || '')}" /><button class="button button-ghost button-small" data-action="set-time" data-time-key="${key}">Сейчас</button></div><small class="field-hint">${escapeHtml(hint)}</small></div>`;
  }

  function renderShipment() {
    const s = state.shipment;
    return `${pageHeading('Данные поставки', 'Заполните реквизиты вручную. Никакие внешние нормативы и справочники не используются.', '<button class="button button-primary" data-page="products">К товарам →</button>')}
      <div class="content-stack">
        <div class="notice">Сайт работает как чистая форма заполнения: коды, наименования, допуски, контроли и результаты вводятся сотрудником вручную.</div>
        <section class="card card-pad">
          <div class="section-head"><div><h3 class="card-title">Основные сведения</h3><p class="card-subtitle">Данные попадут в обе формы Excel.</p></div></div>
          <div class="grid grid-3">
            ${field('Номер заявки / поставки', 'shipment.id', s.id, 'text', { required: true, placeholder: 'Например: 828389Y8827878' })}
            ${field('РЦ', 'shipment.rc', s.rc, 'text', { required: true, placeholder: 'Наименование РЦ' })}
            ${field('Дата приёмки', 'shipment.date', s.date, 'date', { required: true })}
            ${field('Поставщик', 'shipment.supplier', s.supplier, 'text', { required: true, placeholder: 'Полное наименование' })}
            ${selectField('Формат приёмки', 'shipment.format', s.format, [{ value: 'Онлайн', label: 'Онлайн' }, { value: 'Архив', label: 'Архив' }], true)}
            ${field('МОКК', 'shipment.mokk', s.mokk, 'text', { placeholder: 'ФИО или идентификатор' })}
            ${field('ДП (ID)', 'shipment.dpId', s.dpId, 'text', { required: true, placeholder: 'ФИО / ID сотрудника' })}
          </div>
        </section>
        <section class="card card-pad">
          <div class="section-head"><div><h3 class="card-title">Начало работы</h3><p class="card-subtitle">Окончание приёмки и отчёта фиксируется на странице итогов.</p></div></div>
          <div class="timer-grid">
            ${timerCard('Время подключения', 'connectionTime', 'Переносится в верхнюю часть Excel.')}
            ${timerCard('Начало приёмки', 'acceptanceStart', 'Можно зафиксировать отдельно от подключения.')}
            <div class="timer-card"><span>Текущее время</span><strong class="timer-value" id="liveClock">${new Date().toLocaleTimeString('ru-RU')}</strong><button class="button button-primary" data-action="start-acceptance">Зафиксировать начало</button><small class="field-hint">Заполнит пустые поля начала текущим временем.</small></div>
          </div>
        </section>
      </div>`;
  }

  function skuField(label, index, key, value, type = 'text', options = {}) {
    const suffix = options.suffix ? `<span class="input-suffix">${escapeHtml(options.suffix)}</span>` : '';
    return `<div class="field"><label>${escapeHtml(label)} ${options.required ? '<span class="required">*</span>' : ''}</label><div class="${suffix ? 'input-group' : ''}"><input class="input" type="${type}" data-sku="${index}" data-sku-field="${key}" value="${escapeAttr(value ?? '')}" ${options.placeholder ? `placeholder="${escapeAttr(options.placeholder)}"` : ''} ${options.min !== undefined ? `min="${options.min}"` : ''} ${options.step ? `step="${options.step}"` : ''}/>${suffix}</div>${options.hint ? `<span class="field-hint">${escapeHtml(options.hint)}</span>` : ''}</div>`;
  }
  function featureSwitch(index, key, active) {
    const [label, hint] = FEATURE_LABELS[key];
    return `<button type="button" class="control-switch ${active ? 'active' : ''}" data-action="toggle-feature" data-sku="${index}" data-feature="${key}" aria-pressed="${active}"><span class="control-copy"><strong>${escapeHtml(label)}</strong><small>${escapeHtml(hint)}</small></span><span class="switch" aria-hidden="true"></span></button>`;
  }
  function measureCard(label, index, key, value) {
    return `<div class="measure-card"><label>${escapeHtml(label)}</label><div class="input-group"><input class="input" inputmode="decimal" type="number" min="0" step="0.001" data-sku="${index}" data-sku-field="${key}" value="${escapeAttr(value ?? '')}"/><span class="input-suffix">кг/шт</span></div></div>`;
  }

  function renderProductCard(sku, index) {
    const waste = percent(sku.defectMass, sku.sampleMass);
    const nonstandard = percent(sku.nonstandardMass, sku.sampleMass);
    const debris = percent(sku.debrisMass, sku.sampleMass);
    const caliber = percent(sku.caliberMass, sku.sampleMass);
    return `<article class="card product-card" data-product-card="${index}">
      <div class="product-card-head">
        <div class="product-title"><span class="product-number">${index + 1}</span><div><strong>${escapeHtml(getSkuLabel(sku, index))}</strong><span>${escapeHtml(sku.code ? `Код ${sku.code}` : 'Код не указан')}</span></div></div>
        <div class="button-row">
          <button class="button button-ghost button-small" data-action="move-sku" data-sku="${index}" data-delta="-1" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button class="button button-ghost button-small" data-action="move-sku" data-sku="${index}" data-delta="1" ${index === state.skus.length - 1 ? 'disabled' : ''}>↓</button>
          <button class="button button-danger button-small" data-action="remove-sku" data-sku="${index}" ${state.skus.length === 1 ? 'disabled' : ''}>Удалить</button>
        </div>
      </div>
      <div class="product-card-body">
        <div class="subsection">
          <div class="subsection-title">Товарная позиция</div>
          <div class="grid grid-3">
            ${skuField('Код товара / SKU', index, 'code', sku.code, 'text', { required: true, placeholder: 'Введите код вручную' })}
            ${skuField('Название товара', index, 'name', sku.name, 'text', { required: true, placeholder: 'Полное название позиции' })}
            ${skuField('ВПТ', index, 'vpt', sku.vpt, 'number', { step: '0.1', suffix: '°C', placeholder: '0,0' })}
            <div class="field"><label>Ошибки в АРМ ДП</label><select class="select" data-sku="${index}" data-sku-field="apmError"><option value="no" ${sku.apmError !== 'yes' ? 'selected' : ''}>Нет</option><option value="yes" ${sku.apmError === 'yes' ? 'selected' : ''}>Да</option></select></div>
          </div>
        </div>
        <div class="subsection">
          <div class="subsection-title">Массы и категории</div>
          <div class="measure-grid">
            ${measureCard('Масса выборки', index, 'sampleMass', sku.sampleMass)}
            ${measureCard('Брак', index, 'defectMass', sku.defectMass)}
            ${measureCard('Нестандарт', index, 'nonstandardMass', sku.nonstandardMass)}
            ${measureCard('Осыпь / листья / земля', index, 'debrisMass', sku.debrisMass)}
            ${measureCard('Калибр', index, 'caliberMass', sku.caliberMass)}
          </div>
          <div class="kpi-grid">
            <div class="kpi"><span>Брак</span><strong>${formatPercent(waste)}</strong><small>расчёт от массы выборки</small></div>
            <div class="kpi"><span>Нестандарт</span><strong>${formatPercent(nonstandard)}</strong><small>расчёт от массы выборки</small></div>
            <div class="kpi"><span>Осыпь</span><strong>${formatPercent(debris)}</strong><small>расчёт от массы выборки</small></div>
            <div class="kpi"><span>Калибр</span><strong>${formatPercent(caliber)}</strong><small>расчёт от массы выборки</small></div>
          </div>
        </div>
        <div class="subsection">
          <div class="subsection-title">Контроли чек-листа</div>
          <div class="control-switches">${featureSwitch(index, 'requiresColor', sku.requiresColor)}${featureSwitch(index, 'requiresDensity', sku.requiresDensity)}${featureSwitch(index, 'requiresBrix', sku.requiresBrix)}</div>
          <div class="notice">Включённый контроль добавляет соответствующие пункты в чек-лист. Числовые значения Brix и плотности на сайте не вводятся — фиксируются выполнение, время и комментарий.</div>
        </div>
        <div class="subsection">
          <div class="subsection-title">Комментарий к товару</div>
          <textarea class="textarea" data-sku="${index}" data-sku-field="comment" placeholder="Комментарий, который должен попасть в верхнюю таблицу Excel…">${escapeHtml(sku.comment || '')}</textarea>
        </div>
      </div>
    </article>`;
  }

  function renderProducts() {
    return `${pageHeading('Товары и ручные параметры', 'Добавьте до пяти товарных позиций. Все параметры и контроли задаются вручную.', `<button class="button button-primary" data-action="add-sku" ${state.skus.length >= MAX_SKU ? 'disabled' : ''}>+ Добавить товар</button>`)}
      <div class="content-stack">
        <div class="product-toolbar"><div class="notice">Активные контроли влияют только на состав пошагового чек-листа.</div><span class="field-hint">${state.skus.length} из ${MAX_SKU} товаров</span></div>
        <div class="product-list">${state.skus.map(renderProductCard).join('')}</div>
        <div class="button-row"><button class="button button-ghost" data-page="shipment">← К приёмке</button><button class="button button-primary" data-page="checklist">К чек-листу →</button></div>
      </div>`;
  }

  function renderSkuTabs() {
    return `<div class="sku-tabs">${state.skus.map((sku, index) => `<button class="sku-tab ${state.ui.currentSku === index ? 'active' : ''}" data-action="select-sku" data-sku="${index}"><span>${index + 1}</span><b>${escapeHtml(getSkuLabel(sku, index))}</b></button>`).join('')}</div>`;
  }

  function renderQuestion(sku, skuIndex, question) {
    const answer = getAnswer(sku, question.code);
    if (question.type === 'number') {
      const timeDisabled = question.code === '7.4' && numeric(answer.value) <= 0;
      return `<article class="question-card ${answer.value !== '' ? 'is-complete' : ''}">
        <div class="question-top"><span class="question-code">${question.code}</span><div class="question-text">${escapeHtml(question.text)}</div></div>
        <div class="number-answer">
          <div class="input-group"><input class="input" type="number" min="${question.min ?? 0}" step="1" data-answer-value data-sku="${skuIndex}" data-code="${question.code}" value="${escapeAttr(answer.value ?? '')}" placeholder="Введите значение"/><span class="input-suffix">${escapeHtml(question.unit || '')}</span></div>
          <input class="input" type="time" step="1" data-answer-time data-sku="${skuIndex}" data-code="${question.code}" value="${escapeAttr(timeOnly(answer.time))}" ${timeDisabled ? 'disabled' : ''}/>
          <input class="input" type="text" data-answer-comment data-sku="${skuIndex}" data-code="${question.code}" value="${escapeAttr(answer.comment || '')}" placeholder="Комментарий"/>
        </div>
        ${question.code === '7.4' ? '<span class="field-hint">При значении 0 время не фиксируется. При значении 1 и выше время ставится автоматически.</span>' : ''}
      </article>`;
    }
    return `<article class="question-card ${answer.status ? `is-${answer.status}` : ''}">
      <div class="question-top"><span class="question-code">${question.code}</span><div class="question-text">${escapeHtml(question.text)}</div></div>
      <div class="answer-grid">
        <button class="answer-button yes ${answer.status === 'yes' ? 'active' : ''}" data-action="answer-status" data-status="yes" data-sku="${skuIndex}" data-code="${question.code}">✓ Выполнено</button>
        <button class="answer-button no ${answer.status === 'no' ? 'active' : ''}" data-action="answer-status" data-status="no" data-sku="${skuIndex}" data-code="${question.code}">× Не выполнено</button>
        <button class="answer-button na ${answer.status === 'na' ? 'active' : ''}" data-action="answer-status" data-status="na" data-sku="${skuIndex}" data-code="${question.code}">— Не контролируется</button>
      </div>
      <div class="answer-details">
        <input class="input" type="time" step="1" data-answer-time data-sku="${skuIndex}" data-code="${question.code}" value="${escapeAttr(timeOnly(answer.time))}" ${answer.status === 'na' ? 'disabled' : ''}/>
        <input class="input" type="text" data-answer-comment data-sku="${skuIndex}" data-code="${question.code}" value="${escapeAttr(answer.comment || '')}" placeholder="Комментарий к пункту" ${answer.status === 'na' ? 'disabled' : ''}/>
      </div>
    </article>`;
  }

  function renderChecklist() {
    state.ui.currentSku = Math.min(state.ui.currentSku, state.skus.length - 1);
    const skuIndex = state.ui.currentSku;
    const sku = state.skus[skuIndex];
    const step = STEP_GROUPS[state.ui.checkStep] || STEP_GROUPS[0];
    const questions = questionsForStep(sku, step.id);
    const stats = getChecklistStats();
    return `${pageHeading('Пошаговый чек-лист', 'Отмечайте крупными кнопками. Время фиксируется автоматически, но его можно скорректировать вручную.', `<span class="button button-ghost checklist-progress-chip" data-checklist-progress>${stats.done} / ${stats.total} · ${stats.percent}%</span>`)}
      <div class="content-stack">
        ${renderSkuTabs()}
        <div class="check-layout">
          <aside class="step-list">${STEP_GROUPS.map((item, index) => {
            const status = getStepState(sku, item.id);
            return `<button class="step-button ${index === state.ui.checkStep ? 'active' : ''}" data-action="select-step" data-step="${index}"><span class="step-number">${index + 1}</span><span class="step-label">${escapeHtml(item.short)}</span><span class="step-status ${status === 'done' ? 'done' : ''}">${status === 'done' ? '✓' : status === 'partial' ? '◐' : status === 'skipped' ? '—' : '·'}</span></button>`;
          }).join('')}</aside>
          <div class="check-main">
            <div class="step-head"><div class="step-head-row"><div><span class="eyebrow">Шаг ${step.id + 1} из ${STEP_GROUPS.length}</span><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.description)}</p></div><span class="step-counter">${escapeHtml(getSkuLabel(sku, skuIndex))}</span></div></div>
            <div class="question-list">${questions.length ? questions.map(q => renderQuestion(sku, skuIndex, q)).join('') : '<div class="card empty-state"><strong>Контроль выключен</strong>Для этой товарной позиции на шаге нет активных пунктов.</div>'}</div>
            <div class="step-nav"><button class="button button-ghost" data-action="previous-step" ${state.ui.checkStep === 0 ? 'disabled' : ''}>← Предыдущий шаг</button><button class="button button-primary" data-action="next-step">${state.ui.checkStep === STEP_GROUPS.length - 1 ? 'К реестру дефектов →' : 'Следующий шаг →'}</button></div>
          </div>
        </div>
      </div>`;
  }

  function visualLabel(value) { return ({ yes: 'Видно', no: 'Не видно' })[value] || 'Не выбрано'; }
  function severityLabel(value) { return ({ defect: 'Брак', nonstandard: 'Нестандарт' })[value] || 'Брак'; }
  function filteredDefects(sku) {
    const query = state.ui.defectSearch.trim().toLowerCase();
    return sku.defects.map((d, index) => ({ d, index })).filter(({ d }) => {
      const searchOk = !query || `${d.type} ${d.comment}`.toLowerCase().includes(query);
      const severityOk = state.ui.defectSeverity === 'all' || d.severity === state.ui.defectSeverity;
      const visualOk = state.ui.defectVisual === 'all' || d.visual === state.ui.defectVisual;
      return searchOk && severityOk && visualOk;
    });
  }

  function renderDefects() {
    state.ui.currentSku = Math.min(state.ui.currentSku, state.skus.length - 1);
    const skuIndex = state.ui.currentSku;
    const sku = state.skus[skuIndex];
    const rows = filteredDefects(sku);
    const total = sku.defects.reduce((sum, d) => sum + numeric(d.count), 0);
    return `${pageHeading('Реестр дефектов', 'Укажите категорию «Брак» или «Нестандарт», видимость по камере, количество единиц и комментарий. Процентная доля не используется.', `<button class="button button-primary" data-action="add-defect" ${sku.defects.length >= MAX_DEFECTS ? 'disabled' : ''}>+ Добавить дефект</button>`)}
      <div class="content-stack">
        ${renderSkuTabs()}
        <div class="kpi-grid">
          <div class="kpi"><span>Записей</span><strong>${sku.defects.length}</strong><small>максимум ${MAX_DEFECTS}</small></div>
          <div class="kpi"><span>Дефектных единиц</span><strong>${displayNumber(total, 0)}</strong><small>сумма по реестру</small></div>
          <div class="kpi"><span>Ошибки на качество</span><strong>${displayNumber(getAnswer(sku, '7.4').value, 0)}</strong><small>отдельный пункт чек-листа</small></div>
          <div class="kpi"><span>Товар</span><strong style="font-size:16px">${escapeHtml(getSkuLabel(sku, skuIndex))}</strong><small>${escapeHtml(sku.code || 'код не указан')}</small></div>
        </div>
        <section class="card table-shell">
          <div class="table-toolbar">
            <input class="input" type="search" data-ui-field="defectSearch" value="${escapeAttr(state.ui.defectSearch)}" placeholder="Поиск по дефекту или комментарию"/>
            <select class="select" data-ui-field="defectSeverity"><option value="all">Все категории</option><option value="defect" ${state.ui.defectSeverity === 'defect' ? 'selected' : ''}>Брак</option><option value="nonstandard" ${state.ui.defectSeverity === 'nonstandard' ? 'selected' : ''}>Нестандарт</option></select>
            <select class="select" data-ui-field="defectVisual"><option value="all">Любая видимость</option><option value="yes" ${state.ui.defectVisual === 'yes' ? 'selected' : ''}>Видно</option><option value="no" ${state.ui.defectVisual === 'no' ? 'selected' : ''}>Не видно</option></select>
            <button class="button button-ghost" data-action="clear-defect-filters">Сбросить</button>
          </div>
          <div class="table-scroll">
            ${rows.length ? `<table class="data-table"><thead><tr><th>Тип дефекта</th><th>Визуальная оценка</th><th>Кол-во единиц</th><th>Категория</th><th>Комментарий ДП</th><th></th></tr></thead><tbody>${rows.map(({ d, index }) => `<tr>
              <td data-label="Тип дефекта"><input class="input" data-defect-field="type" data-defect="${index}" data-sku="${skuIndex}" value="${escapeAttr(d.type || '')}" placeholder="Название дефекта"/></td>
              <td data-label="Видимость"><select class="select" data-defect-field="visual" data-defect="${index}" data-sku="${skuIndex}"><option value="">Не выбрано</option><option value="yes" ${d.visual === 'yes' ? 'selected' : ''}>Видно</option><option value="no" ${d.visual === 'no' ? 'selected' : ''}>Не видно</option></select></td>
              <td data-label="Количество"><input class="input" type="number" min="0" step="1" data-defect-field="count" data-defect="${index}" data-sku="${skuIndex}" value="${escapeAttr(d.count ?? '')}" placeholder="0"/></td>
              <td data-label="Категория"><select class="select" data-defect-field="severity" data-defect="${index}" data-sku="${skuIndex}"><option value="defect" ${d.severity === 'defect' ? 'selected' : ''}>Брак</option><option value="nonstandard" ${d.severity === 'nonstandard' ? 'selected' : ''}>Нестандарт</option></select></td>
              <td data-label="Комментарий"><input class="input" data-defect-field="comment" data-defect="${index}" data-sku="${skuIndex}" value="${escapeAttr(d.comment || '')}" placeholder="Комментарий"/></td>
              <td data-label="Действия"><div class="row-actions"><button class="button button-danger button-small" data-action="remove-defect" data-defect="${index}" data-sku="${skuIndex}">Удалить</button></div></td>
            </tr>`).join('')}</tbody></table>` : '<div class="empty-state"><strong>Нет записей по выбранным фильтрам</strong>Добавьте дефект или измените фильтры.</div>'}
          </div>
        </section>
        <div class="button-row"><button class="button button-ghost" data-page="checklist">← К чек-листу</button><button class="button button-primary" data-page="summary">К итогам →</button></div>
      </div>`;
  }

  function kpi(label, value, hint, cls = '') { return `<div class="kpi"><span>${escapeHtml(label)}</span><strong class="${cls}">${escapeHtml(value)}</strong><small>${escapeHtml(hint)}</small></div>`; }
  function renderSummary() {
    const c = getCompletion();
    const stats = getChecklistStats();
    const defectTotal = state.skus.reduce((sum, sku) => sum + sku.defects.reduce((s, d) => s + numeric(d.count), 0), 0);
    const s = state.shipment;
    return `${pageHeading('Итоги и выгрузка', 'Проверьте данные, зафиксируйте окончание приёмки и сформируйте нужную форму Excel.', '')}
      <div class="content-stack">
        <div class="kpi-grid">
          ${kpi('Готовность', `${c.percent}%`, `${c.done} из ${c.total} разделов`, c.percent === 100 ? 'status-good' : 'status-warn')}
          ${kpi('Товаров', String(state.skus.length), `максимум ${MAX_SKU}`)}
          ${kpi('Чек-лист', `${stats.done}/${stats.total}`, `${stats.percent}% заполнено`, stats.percent === 100 ? 'status-good' : 'status-warn')}
          ${kpi('Дефектных единиц', displayNumber(defectTotal, 0), `${state.skus.reduce((sum, sku) => sum + sku.defects.length, 0)} записей`)}
        </div>
        <section class="card card-pad">
          <div class="section-head"><div><h3 class="card-title">Завершение приёмки</h3><p class="card-subtitle">Эти значения переносятся в расчёт времени итоговой таблицы.</p></div></div>
          <div class="timer-grid">
            ${timerCard('Окончание приёмки', 'acceptanceEnd', 'Время завершения контроля по поставке.')}
            ${timerCard('Отчёт заполнен', 'reportEnd', 'Время завершения заполнения отчёта.')}
            <div class="timer-card"><span>Продолжительность</span><strong class="timer-value">${formatDuration(s.connectionTime || s.acceptanceStart, s.reportEnd)}</strong><div class="summary-list"><div class="summary-row"><span>Приёмка</span><strong>${formatDuration(s.acceptanceStart || s.connectionTime, s.acceptanceEnd)}</strong></div><div class="summary-row"><span>Заполнение отчёта</span><strong>${formatDuration(s.acceptanceEnd, s.reportEnd)}</strong></div></div></div>
          </div>
        </section>
        <div class="summary-grid">
          <section class="card card-pad">
            <div class="section-head"><div><h3 class="card-title">Сводка</h3><p class="card-subtitle">Основные реквизиты и заполненность товаров.</p></div></div>
            <div class="summary-list">
              <div class="summary-row"><span>Поставщик</span><strong>${escapeHtml(s.supplier || 'Не указан')}</strong></div>
              <div class="summary-row"><span>Номер заявки</span><strong>${escapeHtml(s.id || 'Не указан')}</strong></div>
              <div class="summary-row"><span>РЦ</span><strong>${escapeHtml(s.rc || 'Не указан')}</strong></div>
              <div class="summary-row"><span>Формат</span><strong>${escapeHtml(s.format)}</strong></div>
              ${state.skus.map((sku, index) => `<div class="summary-row"><span>${index + 1}. ${escapeHtml(getSkuLabel(sku, index))}</span><strong>${QUESTIONS.filter(q => isApplicable(sku, q) && isAnswered(sku, q)).length}/${QUESTIONS.filter(q => isApplicable(sku, q)).length}</strong></div>`).join('')}
            </div>
            <div class="button-row" style="margin-top:18px;justify-content:flex-start"><button class="button button-ghost" data-action="download-backup">Скачать резервную копию</button><label class="button button-ghost" style="cursor:pointer">Восстановить JSON<input type="file" accept="application/json" data-action="import-backup" hidden/></label><button class="button button-danger" data-action="new-acceptance">Новая приёмка</button></div>
          </section>
          <section class="card card-pad export-panel">
            <div class="section-head"><div><h3 class="card-title">Выгрузить Excel</h3><p class="card-subtitle">Обе формы заполняются из одного чек-листа.</p></div></div>
            <div class="export-choice">
              <button class="export-button" data-action="request-export" data-export-type="new"><span><strong>Excel — новый</strong><span>Текущая рабочая форма</span></span><b class="export-arrow">→</b></button>
              <button class="export-button" data-action="request-export" data-export-type="old"><span><strong>Excel — старый</strong><span>Присланный исходный шаблон</span></span><b class="export-arrow">→</b></button>
            </div>
            <div class="notice" style="margin-top:14px">Имя файла: <strong>${escapeHtml(buildChecklistFilename(s))}</strong></div>
          </section>
        </div>
      </div>`;
  }

  function setPath(path, value) {
    const parts = path.split('.'); let target = state;
    while (parts.length > 1) target = target[parts.shift()];
    target[parts[0]] = value;
  }
  function updateAnswer(skuIndex, code, patch) {
    const sku = state.skus[skuIndex];
    if (!sku) return;
    sku.checklist[code] = { status: '', value: '', time: '', comment: '', ...(sku.checklist[code] || {}), ...patch };
    scheduleSave();
  }

  function handleInput(event) {
    if (!authenticated) return;
    const el = event.target;
    if (el.dataset.field) { setPath(el.dataset.field, el.value); scheduleSave(); if (el.dataset.field.startsWith('shipment.')) updateGlobalProgress(); return; }
    if (el.dataset.skuField !== undefined) {
      const sku = state.skus[Number(el.dataset.sku)]; if (!sku) return;
      sku[el.dataset.skuField] = el.value; scheduleSave();
      return;
    }
    if (el.dataset.answerValue !== undefined) {
      const skuIndex = Number(el.dataset.sku); const code = el.dataset.code; const value = el.value; const answer = getAnswer(state.skus[skuIndex], code);
      const shouldTime = value !== '' && (code !== '7.4' || numeric(value) > 0);
      const nextTime = shouldTime ? (answer.time || nowLocalInput()) : '';
      updateAnswer(skuIndex, code, { value, time: nextTime });
      const timeInput = document.querySelector(`[data-answer-time][data-sku="${skuIndex}"][data-code="${code}"]`);
      if (timeInput) { timeInput.disabled = code === '7.4' && numeric(value) <= 0; timeInput.value = timeOnly(nextTime); }
      const card = el.closest('.question-card');
      if (card) card.classList.toggle('is-complete', value !== '');
      refreshChecklistChrome();
      return;
    }
    if (el.dataset.answerTime !== undefined) { updateAnswer(Number(el.dataset.sku), el.dataset.code, { time: checklistDateTimeFromTime(el.value) }); return; }
    if (el.dataset.answerComment !== undefined) { updateAnswer(Number(el.dataset.sku), el.dataset.code, { comment: el.value }); return; }
    if (el.dataset.defectField) {
      const sku = state.skus[Number(el.dataset.sku)]; const defect = sku?.defects?.[Number(el.dataset.defect)]; if (!defect) return;
      defect[el.dataset.defectField] = el.value; scheduleSave(); return;
    }
    if (el.dataset.uiField) { state.ui[el.dataset.uiField] = el.value; scheduleSave(); return; }
    if (el === notesTextarea) { state.notes = el.value; scheduleSave(); }
  }

  let renderTimer = null;
  function debounceRender() { clearTimeout(renderTimer); renderTimer = setTimeout(render, 180); }

  function handleChange(event) {
    if (!authenticated) return;
    const el = event.target;
    if (el.dataset.field) { setPath(el.dataset.field, el.value); scheduleSave(); updateGlobalProgress(); return; }
    if (el.dataset.skuField !== undefined) { const sku = state.skus[Number(el.dataset.sku)]; if (sku) sku[el.dataset.skuField] = el.value; scheduleSave(); updateGlobalProgress(); return; }
    if (el.dataset.defectField) {
      const d = state.skus[Number(el.dataset.sku)]?.defects?.[Number(el.dataset.defect)];
      if (d) d[el.dataset.defectField] = el.value;
      scheduleSave();
      return;
    }
    if (el.dataset.uiField) { state.ui[el.dataset.uiField] = el.value; scheduleSave(); render(); return; }
    if (el.matches('input[data-action="import-backup"]') && el.files?.[0]) importBackup(el.files[0]);
  }

  function refreshChecklistChrome() {
    if (state.ui.page !== 'checklist') return;
    const sku = state.skus[state.ui.currentSku];
    if (!sku) return;
    document.querySelectorAll('.step-button[data-step]').forEach(stepButton => {
      const stepId = Number(stepButton.dataset.step);
      const status = getStepState(sku, stepId);
      const statusEl = stepButton.querySelector('.step-status');
      if (!statusEl) return;
      statusEl.classList.toggle('done', status === 'done');
      statusEl.textContent = status === 'done' ? '✓' : status === 'partial' ? '◐' : status === 'skipped' ? '—' : '·';
    });
    const stats = getChecklistStats();
    const progressEl = document.querySelector('[data-checklist-progress]');
    if (progressEl) progressEl.textContent = `${stats.done} / ${stats.total} · ${stats.percent}%`;
    updateGlobalProgress();
  }

  function applyAnswerStatusWithoutRender(button, skuIndex, code, status, time, comment) {
    const card = button.closest('.question-card');
    if (!card) return;
    card.classList.remove('is-yes', 'is-no', 'is-na');
    if (status) card.classList.add(`is-${status}`);
    card.querySelectorAll('.answer-button').forEach(answerButton => {
      const active = answerButton.dataset.status === status;
      answerButton.classList.toggle('active', active);
    });
    const timeInput = card.querySelector('[data-answer-time]');
    const commentInput = card.querySelector('[data-answer-comment]');
    const disabled = status === 'na';
    if (timeInput) { timeInput.disabled = disabled; timeInput.value = disabled ? '' : timeOnly(time); }
    if (commentInput) { commentInput.disabled = disabled; if (disabled) commentInput.value = ''; else if (commentInput.value !== (comment || '')) commentInput.value = comment || ''; }
    refreshChecklistChrome();
  }

  async function handleClick(event) {
    if (!authenticated) return;
    const pageButton = event.target.closest('[data-page]');
    if (pageButton) { setPage(pageButton.dataset.page); return; }
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'add-sku') { if (state.skus.length < MAX_SKU) { state.skus.push(defaultSku()); state.ui.currentSku = state.skus.length - 1; scheduleSave(); render(); } }
    if (action === 'remove-sku') { const i = Number(button.dataset.sku); if (state.skus.length > 1 && confirm(`Удалить ${getSkuLabel(state.skus[i], i)}?`)) { state.skus.splice(i, 1); state.ui.currentSku = Math.min(state.ui.currentSku, state.skus.length - 1); scheduleSave(); render(); } }
    if (action === 'move-sku') { moveSku(Number(button.dataset.sku), Number(button.dataset.delta)); }
    if (action === 'toggle-feature') { const sku = state.skus[Number(button.dataset.sku)]; const key = button.dataset.feature; if (sku && key in FEATURE_LABELS) { sku[key] = !sku[key]; if (!sku[key]) QUESTIONS.filter(q => q.feature === key).forEach(q => { delete sku.checklist[q.code]; }); scheduleSave(); button.classList.toggle('active', sku[key]); button.setAttribute('aria-pressed', String(sku[key])); updateGlobalProgress(); } }
    if (action === 'select-sku') { state.ui.currentSku = Number(button.dataset.sku); scheduleSave(); render(); }
    if (action === 'select-step') { state.ui.checkStep = Number(button.dataset.step); scheduleSave(); render(); }
    if (action === 'previous-step') { state.ui.checkStep = Math.max(0, state.ui.checkStep - 1); scheduleSave(); render(); }
    if (action === 'next-step') { if (state.ui.checkStep >= STEP_GROUPS.length - 1) setPage('defects'); else { state.ui.checkStep += 1; scheduleSave(); render(); } }
    if (action === 'answer-status') {
      const skuIndex = Number(button.dataset.sku); const code = button.dataset.code; const status = button.dataset.status; const current = getAnswer(state.skus[skuIndex], code);
      const time = status === 'na' ? '' : (current.time || nowLocalInput());
      const comment = status === 'na' ? '' : current.comment;
      updateAnswer(skuIndex, code, { status, time, comment });
      applyAnswerStatusWithoutRender(button, skuIndex, code, status, time, comment);
    }
    if (action === 'add-defect') { const sku = state.skus[state.ui.currentSku]; if (sku && sku.defects.length < MAX_DEFECTS) { sku.defects.push({ type: '', visual: '', count: '', severity: 'defect', comment: '' }); scheduleSave(); render(); } }
    if (action === 'remove-defect') { const sku = state.skus[Number(button.dataset.sku)]; const index = Number(button.dataset.defect); if (sku && confirm('Удалить запись о дефекте?')) { sku.defects.splice(index, 1); scheduleSave(); render(); } }
    if (action === 'clear-defect-filters') { state.ui.defectSearch = ''; state.ui.defectSeverity = 'all'; state.ui.defectVisual = 'all'; scheduleSave(); render(); }
    if (action === 'set-time') { state.shipment[button.dataset.timeKey] = nowLocalInput(); scheduleSave(); render(); }
    if (action === 'start-acceptance') { const now = nowLocalInput(); if (!state.shipment.connectionTime) state.shipment.connectionTime = now; if (!state.shipment.acceptanceStart) state.shipment.acceptanceStart = now; scheduleSave(); render(); toast('Начало приёмки зафиксировано.', 'success'); }
    if (action === 'request-export') requestExport(button.dataset.exportType || 'new');
    if (action === 'download-backup') downloadBackup();
    if (action === 'new-acceptance') newAcceptance();
  }

  function moveSku(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= state.skus.length) return;
    [state.skus[index], state.skus[target]] = [state.skus[target], state.skus[index]];
    state.ui.currentSku = target; scheduleSave(); render();
  }

  function downloadBackup() {
    saveNow();
    downloadBlob(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json;charset=utf-8' }), `резервная_копия_${sanitizeFilename(state.shipment.id || 'черновик')}.json`);
    toast('Резервная копия сохранена.', 'success');
  }
  async function importBackup(file) {
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed?.shipment || !Array.isArray(parsed?.skus)) throw new Error('Неверная структура');
      const base = defaultState();
      state = { ...base, ...parsed, version: 20, shipment: { ...base.shipment, ...parsed.shipment }, skus: parsed.skus.slice(0, MAX_SKU).map(migrateSku), ui: { ...base.ui, ...(parsed.ui || {}) } };
      saveNow(); render(); toast('Данные восстановлены.', 'success');
    } catch (error) { console.error(error); toast('Не удалось восстановить резервную копию.', 'error'); }
  }
  function newAcceptance() {
    if (!confirm('Начать новую приёмку? Текущие данные будут удалены.')) return;
    const theme = state.ui.theme; const pos = state.ui.notesPosition;
    state = defaultState(); state.ui.theme = theme; state.ui.notesPosition = pos; saveNow(); render(); toast('Создана новая приёмка.', 'success');
  }

  function buildExportState() {
    return {
      ...state,
      shipment: { ...state.shipment },
      skus: state.skus.map(sku => ({
        ...sku,
        checklist: Object.fromEntries(Object.entries(sku.checklist || {}).map(([code, answer]) => {
          const question = QUESTIONS.find(q => q.code === code);
          const applicable = !question || isApplicable(sku, question);
          if (!applicable || answer.status === 'na') return [code, { ...answer, status: '', time: '', comment: '' }];
          if (code === '7.4' && numeric(answer.value) <= 0) return [code, { ...answer, time: '' }];
          return [code, { ...answer }];
        })),
        defects: (sku.defects || []).slice(0, MAX_DEFECTS).map(d => ({ ...d })),
      })),
    };
  }

  function requestExport(exportType = 'new') {
    const validation = getValidation();
    if (!validation.errors.length && !validation.warnings.length) { exportExcel(exportType); return; }
    document.getElementById('modalBody').innerHTML = `<div class="issue-list">${validation.errors.map(x => `<div class="issue error">${escapeHtml(x)}</div>`).join('')}${validation.warnings.map(x => `<div class="issue">${escapeHtml(x)}</div>`).join('')}</div>`;
    const footer = document.getElementById('modalFooter');
    footer.innerHTML = `<button class="button button-ghost" id="validationCancel">Вернуться</button>${validation.errors.length ? '' : `<button class="button button-primary" id="validationExport">Выгрузить с предупреждениями</button>`}`;
    modalBackdrop.hidden = false;
    document.getElementById('validationCancel').onclick = closeModal;
    if (!validation.errors.length) document.getElementById('validationExport').onclick = () => { closeModal(); exportExcel(exportType); };
  }
  function closeModal() { modalBackdrop.hidden = true; }

  function localizedStatus(status) { return ({ yes: 'да', no: 'нет' })[status] || ''; }
  function localizedVisual(value) { return ({ yes: 'да', no: 'нет' })[value] || ''; }
  function base64ToArrayBuffer(base64) { const binary = atob(base64); const bytes = new Uint8Array(binary.length); for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i); return bytes.buffer; }
  function dateFromInput(value) { if (!value) return null; const d = new Date(value); return Number.isNaN(d.getTime()) ? null : d; }
  function numberOrBlank(value) { if (value === '' || value === null || value === undefined) return ''; const n = Number(String(value).replace(',', '.')); return Number.isFinite(n) ? n : ''; }
  function setExportLoading(show, status = 'Подготавливаем шаблон…', percent = 10, title = '') {
    loadingOverlay.hidden = !show;
    document.getElementById('loadingStatus').textContent = status;
    document.getElementById('loadingTitle').textContent = title || 'Формируем Excel';
    document.getElementById('loadingProgressBar').style.width = `${Math.max(4, Math.min(100, Number(percent) || 0))}%`;
  }
  function cancelExport() { exportCancelled = true; activeExportAbortController?.abort(); activeExportAbortController = null; setExportLoading(false); toast('Формирование Excel отменено.', 'error'); }

  async function exportExcel(exportType = 'new') {
    const normalizedType = exportType === 'old' ? 'old' : 'new';
    const label = normalizedType === 'old' ? 'старую форму' : 'новую форму';
    exportCancelled = false; saveNow(); const exportState = buildExportState();
    setExportLoading(true, `Проверяем способ формирования: ${label}…`, 8, `Формируем ${label}`);
    let serverError = null;
    if (location.protocol !== 'file:') {
      const controller = new AbortController(); activeExportAbortController = controller; const timer = setTimeout(() => controller.abort(), 25000);
      try {
        setExportLoading(true, `Заполняем ${label}…`, 38, `Формируем ${label}`);
        const response = await fetch('./api/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: exportState, exportType: normalizedType }), signal: controller.signal, cache: 'no-store' });
        if (!response.ok) { let message = `Ошибка сервера ${response.status}`; try { message = (await response.json()).error || message; } catch (_) {} throw new Error(message); }
        const blob = await response.blob(); if (exportCancelled) return; if (blob.size < 1000) throw new Error('Сервер вернул пустой файл');
        setExportLoading(true, 'Файл готов. Начинаем скачивание…', 96, `Формируем ${label}`);
        downloadBlob(blob, buildChecklistFilename(state.shipment));
        setExportLoading(false); toast('Excel сформирован.', 'success', 5000); return;
      } catch (error) { serverError = error; console.warn('Серверный экспорт недоступен', error); }
      finally { clearTimeout(timer); if (activeExportAbortController === controller) activeExportAbortController = null; }
    }
    if (exportCancelled) return;
    try {
      setExportLoading(true, `Создаём ${label} в браузере…`, 20, `Формируем ${label}`);
      await exportExcelSafeBrowser(exportState, normalizedType);
      setExportLoading(false); toast(`Excel сформирован.${serverError ? ' Использован резервный режим.' : ''}`, 'success', 6000);
    } catch (error) { setExportLoading(false); console.error(error); toast(`Не удалось сформировать Excel: ${error?.message || error}`, 'error', 9000); }
  }

  function fillExactTemplateWorkbook(workbook, exportState) {
    const ws = workbook.getWorksheet('Чек лист_ДП_Отчет') || workbook.worksheets[0];
    if (!ws) throw new Error('Не найден основной лист шаблона.');
    workbook.calcProperties.fullCalcOnLoad = true; workbook.calcProperties.forceFullCalc = true; workbook.calcProperties.calcMode = 'auto';
    const s = exportState.shipment || {};
    const startTime = dateFromInput(s.connectionTime || s.acceptanceStart);
    const acceptanceEnd = dateFromInput(s.acceptanceEnd);
    const reportEnd = dateFromInput(s.reportEnd);
    ws.getCell('D2').value = startTime || null; if (startTime) ws.getCell('D2').numFmt = 'hh:mm:ss';
    ws.getCell('K70').value = reportEnd || null; if (reportEnd) ws.getCell('K70').numFmt = 'hh:mm:ss';
    if (acceptanceEnd) { const cell = ws.getCell('K54'); cell.value = { formula: 'MAX(K52:AR52)', result: acceptanceEnd }; cell.numFmt = 'hh:mm:ss'; }
    const summaryColumns = ['C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','X','AA','AB'];
    const statusCols = ['J','Q','X','AE','AL']; const timeCols = ['K','R','Y','AF','AM']; const commentCols = ['L','S','Z','AG','AN'];
    const defectCols = [{ type: 'J', visual: 'L', count: 'N', comment: 'O' }, { type: 'Q', visual: 'S', count: 'U', comment: 'V' }, { type: 'X', visual: 'Z', count: 'AB', comment: 'AC' }, { type: 'AE', visual: 'AG', count: 'AI', comment: 'AJ' }, { type: 'AL', visual: 'AN', count: 'AP', comment: 'AQ' }];
    const characteristicRanges = ['J61:K66','Q61:R66','X61:Y66','AE61:AF66','AL61:AM66'];
    for (let i = 0; i < MAX_SKU; i++) {
      const row = 5 + i; const sku = exportState.skus?.[i];
      const values = sku ? [s.id || '', s.rc || '', s.date ? new Date(`${s.date}T00:00:00`) : null, s.supplier || '', sku.code || '', sku.name || '', s.format || '', s.mokk || '', s.dpId || '', sku.vpt || '', numberOrBlank(sku.sampleMass), numberOrBlank(sku.defectMass), numberOrBlank(sku.nonstandardMass), numberOrBlank(sku.debrisMass), numberOrBlank(sku.caliberMass), null, sku.apmError === 'yes' ? 'да' : 'нет', sku.comment || ''] : Array(summaryColumns.length).fill(null);
      summaryColumns.forEach((col, idx) => { const cell = ws.getCell(`${col}${row}`); const value = values[idx]; cell.value = value === '' ? null : value; if (col === 'E' && value) cell.numFmt = 'dd.mm.yyyy'; });
      ws.getCell(`R${row}`).value = sku && numberOrBlank(sku.wasteLimit) !== '' ? numberOrBlank(sku.wasteLimit) : null;
      ws.getCell(`${['J','Q','X','AE','AL'][i]}16`).value = { formula: `H${row}`, result: sku?.name || '' };
      QUESTIONS.forEach(q => {
        const statusCell = ws.getCell(`${statusCols[i]}${q.row}`); const timeCell = ws.getCell(`${timeCols[i]}${q.row}`); const commentCell = ws.getCell(`${commentCols[i]}${q.row}`);
        if (!sku) { statusCell.value = null; timeCell.value = null; commentCell.value = null; return; }
        const answer = sku.checklist?.[q.code] || {}; const applicable = isApplicable(sku, q); const skipped = !applicable || answer.status === 'na';
        statusCell.value = q.type === 'number' ? (numberOrBlank(answer.value) === '' ? null : numberOrBlank(answer.value)) : (skipped ? null : localizedStatus(answer.status));
        const allowTime = applicable && !skipped && !(q.code === '7.4' && numeric(answer.value) <= 0);
        const dt = allowTime ? dateFromInput(answer.time) : null; timeCell.value = dt || null; if (dt) timeCell.numFmt = 'hh:mm:ss';
        commentCell.value = applicable && !skipped ? (answer.comment || null) : null;
      });
      const cols = defectCols[i];
      for (let d = 0; d < MAX_DEFECTS; d++) {
        const target = 61 + d; const defect = sku?.defects?.[d];
        ws.getCell(`${cols.type}${target}`).value = defect?.type || null;
        ws.getCell(`${cols.visual}${target}`).value = localizedVisual(defect?.visual) || null;
        const count = defect ? numberOrBlank(defect.count) : '';
        ws.getCell(`${cols.count}${target}`).value = count === '' ? null : count;
        ws.getCell(`${cols.comment}${target}`).value = defect?.comment || null;
      }
      const characteristicText = (sku?.defects || []).slice(0, MAX_DEFECTS).map(d => String(d.type || '').trim()).filter(Boolean).join(', ');
      ws.getCell(`Y${row}`).value = sku ? { formula: `_xlfn.TEXTJOIN(", ",TRUE,${characteristicRanges[i]})`, result: characteristicText } : null;
    }
  }

  function promiseWithTimeout(promise, ms, message) { let timer; const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), ms); }); return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)); }
  async function exportExcelSafeBrowser(exportState, exportType = 'new') {
    if (!window.ExcelJS) throw new Error('Не загрузился модуль ExcelJS.');
    const templateBase64 = exportType === 'old' ? globalThis.OLD_TEMPLATE_XLSX_BASE64 : globalThis.TEMPLATE_XLSX_BASE64;
    if (!templateBase64) throw new Error('Не загрузился Excel-шаблон.');
    const workbook = new ExcelJS.Workbook();
    setExportLoading(true, 'Открываем Excel-шаблон…', 30);
    await promiseWithTimeout(workbook.xlsx.load(base64ToArrayBuffer(templateBase64)), 18000, 'Не удалось открыть Excel-шаблон.');
    if (exportCancelled) return;
    setExportLoading(true, 'Заполняем данные, чек-лист и дефекты…', 62);
    fillExactTemplateWorkbook(workbook, exportState);
    setExportLoading(true, 'Сохраняем таблицу…', 84);
    const out = await promiseWithTimeout(workbook.xlsx.writeBuffer(), 25000, 'Превышено время сохранения Excel.');
    if (exportCancelled) return;
    downloadBlob(new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), buildChecklistFilename(state.shipment));
  }

  function sanitizeFilename(value) { return String(value || '').replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, '_').slice(0, 80) || 'файл'; }
  function sanitizeFilenamePart(value) { return String(value || '').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120); }
  function buildChecklistFilename(shipment = {}) {
    const base = [sanitizeFilenamePart(shipment.supplier), sanitizeFilenamePart(shipment.id)].filter(Boolean).join(' ') || 'Чек-лист';
    return `${base}.xlsx`;
  }
  function downloadBlob(blob, filename) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1600); }
  function toast(message, type = '', duration = 3500) { const el = document.createElement('div'); el.className = `toast ${type}`; el.textContent = message; document.getElementById('toastContainer').appendChild(el); setTimeout(() => el.remove(), duration); }

  function openNotes() { state.ui.notesOpen = true; scheduleSave(); updateNotesPanel(); setTimeout(() => notesTextarea.focus(), 0); }
  function updateNotesPanel() {
    notesPanel.classList.toggle('open', state.ui.notesOpen); notesPanel.classList.toggle('minimized', state.ui.notesMinimized);
    document.getElementById('notesPin').classList.toggle('active', state.ui.notesPinned);
    document.getElementById('notesPinStatus').textContent = state.ui.notesPinned ? 'Закреплены' : 'Не закреплены';
    if (document.activeElement !== notesTextarea) notesTextarea.value = state.notes || '';
    if (state.ui.notesPosition && window.innerWidth > 820) { notesPanel.style.left = `${state.ui.notesPosition.x}px`; notesPanel.style.top = `${state.ui.notesPosition.y}px`; notesPanel.style.right = 'auto'; notesPanel.style.bottom = 'auto'; }
  }
  function initNotesDragging() {
    const handle = document.getElementById('notesDragHandle');
    handle.addEventListener('pointerdown', event => { if (event.target.closest('button') || window.innerWidth <= 820 || !state.ui.notesPinned) return; const rect = notesPanel.getBoundingClientRect(); dragState = { x: event.clientX - rect.left, y: event.clientY - rect.top }; handle.setPointerCapture(event.pointerId); });
    handle.addEventListener('pointermove', event => { if (!dragState) return; const x = Math.max(8, Math.min(window.innerWidth - notesPanel.offsetWidth - 8, event.clientX - dragState.x)); const y = Math.max(8, Math.min(window.innerHeight - 56, event.clientY - dragState.y)); notesPanel.style.left = `${x}px`; notesPanel.style.top = `${y}px`; notesPanel.style.right = 'auto'; notesPanel.style.bottom = 'auto'; state.ui.notesPosition = { x, y }; });
    handle.addEventListener('pointerup', event => { if (!dragState) return; dragState = null; try { handle.releasePointerCapture(event.pointerId); } catch (_) {} scheduleSave(); });
  }

  function bindStaticEvents() {
    document.addEventListener('click', handleClick);
    document.addEventListener('input', handleInput);
    document.addEventListener('change', handleChange);
    document.getElementById('menuToggle').addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('open');
      document.getElementById('sidebarBackdrop')?.classList.toggle('open', sidebar.classList.contains('open'));
    });
    document.getElementById('sidebarBackdrop')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebarBackdrop').classList.remove('open');
    });
    document.getElementById('themeToggle').addEventListener('click', () => { state.ui.theme = state.ui.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = state.ui.theme; scheduleSave(); });
    ['openNotesSidebar','openNotesTop'].forEach(id => document.getElementById(id)?.addEventListener('click', openNotes));
    document.getElementById('notesClose').addEventListener('click', () => { state.ui.notesOpen = false; scheduleSave(); updateNotesPanel(); });
    document.getElementById('notesMinimize').addEventListener('click', () => { state.ui.notesMinimized = !state.ui.notesMinimized; scheduleSave(); updateNotesPanel(); });
    document.getElementById('notesPin').addEventListener('click', () => { state.ui.notesPinned = !state.ui.notesPinned; scheduleSave(); updateNotesPanel(); });
    document.getElementById('notesTimestamp').addEventListener('click', () => { const stamp = `[${new Date().toLocaleString('ru-RU')}] `; state.notes = `${state.notes || ''}${state.notes ? '\n' : ''}${stamp}`; scheduleSave(); updateNotesPanel(); notesTextarea.focus(); });
    document.getElementById('clearNotes').addEventListener('click', () => { if (confirm('Очистить заметки?')) { state.notes = ''; scheduleSave(); updateNotesPanel(); } });
    document.getElementById('modalClose').addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
    document.getElementById('loadingCancel').addEventListener('click', cancelExport);
    ['exportNewSidebar','exportNewTop'].forEach(id => document.getElementById(id)?.addEventListener('click', () => requestExport('new')));
    ['exportOldSidebar','exportOldTop'].forEach(id => document.getElementById(id)?.addEventListener('click', () => requestExport('old')));
    window.addEventListener('resize', () => { if (window.innerWidth <= 820) { notesPanel.style.left = ''; notesPanel.style.top = ''; notesPanel.style.right = ''; notesPanel.style.bottom = ''; } });
    initNotesDragging();
    setInterval(() => { const el = document.getElementById('liveClock'); if (el) el.textContent = new Date().toLocaleTimeString('ru-RU'); }, 1000);
  }

  bindStaticEvents();
  initAuth();
  if (authenticated) render(); else document.documentElement.dataset.theme = state.ui.theme;
})();
