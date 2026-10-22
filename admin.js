import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, getIdToken, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, deleteField, onSnapshot, serverTimestamp, writeBatch } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = value => `GH₵${Number(value || 0).toFixed(2)}`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const slugify = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const dateFrom = value => value?.toDate ? value.toDate() : (value?._seconds ? new Date(value._seconds * 1000) : value ? new Date(value) : null);
const fmtDate = value => { const date = dateFrom(value); return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not recorded'; };
const fmtDateTime = value => { const date = dateFrom(value); return date && !Number.isNaN(date.getTime()) ? date.toLocaleString('en-GH', { dateStyle: 'medium', timeStyle: 'short' }) : 'Not recorded'; };
const initialImage = product => {
  const images = window.AYURELLE_IMAGES || {};
  const variantSet = images.variants?.[product.slug];
  if (variantSet?.colors?.[variantSet.default]?.image) return variantSet.colors[variantSet.default].image;
  return images.products?.[product.slug] || images.categories?.[product.category] || 'images/ayurelle-mark.svg';
};
const normaliseOrder = (docSnap) => ({ ...docSnap.data(), id: docSnap.id, reference: docSnap.data().reference || docSnap.id });

let app, auth, db, currentUser;
let products = [], orders = [], categories = [], messages = [], subscribers = [];
let currentView = 'dashboard';
let editingProductSlug = null, editingCategorySlug = null, activeOrder = null;
let draftImages = [];
let uploadCount = 0;
const unsubscribers = [];
let toastTimer;
let initialSnapshotKeys = new Set();

function setBusy(button, enabled, text = 'Working…') {
  if (!button) return;
  if (enabled) {
    button.dataset.originalLabel ||= button.innerHTML;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.classList.add('is-loading');
    button.innerHTML = `<span class="button-spinner" aria-hidden="true"></span><span>${esc(text)}</span>`;
  } else {
    button.disabled = false;
    button.removeAttribute('aria-busy');
    button.classList.remove('is-loading');
    button.innerHTML = button.dataset.originalLabel || button.innerHTML;
    delete button.dataset.originalLabel;
  }
}
function toast(message, type = 'success') {
  const region = $('[data-admin-toast]');
  if (!region) return;
  clearTimeout(toastTimer);
  region.innerHTML = `<div class="admin-toast ${type === 'error' ? 'is-error' : ''}"><i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i><span>${esc(message)}</span><button type="button" aria-label="Dismiss"><i class="fa-solid fa-xmark"></i></button></div>`;
  $('.admin-toast button', region)?.addEventListener('click', () => region.replaceChildren());
  toastTimer = setTimeout(() => region.replaceChildren(), 4500);
}
function setMessage(selector, text, error = false) {
  const node = $(selector);
  if (node) { node.textContent = text || ''; node.classList.toggle('is-error', !!error); }
}
function setLoading(visible, title = 'Loading your store', detail = 'Loading your latest orders and products.') {
  const overlay = $('[data-admin-loading]');
  if (!overlay) return;
  overlay.hidden = !visible;
  const heading = overlay.querySelector('strong'); const caption = overlay.querySelector('small');
  if (heading) heading.textContent = title; if (caption) caption.textContent = detail;
}
function markInitialSnapshot(key) {
  initialSnapshotKeys.add(key);
  if (['products', 'orders', 'categories'].every(item => initialSnapshotKeys.has(item))) setLoading(false);
}
function setShellVisible(visible) {
  $('[data-login-screen]').hidden = visible;
  $('[data-admin-shell]').hidden = !visible;
  if (visible) {
    const email = currentUser?.email || 'Store admin';
    $('[data-admin-user]').textContent = email;
    $('[data-admin-initials]').textContent = email.charAt(0).toUpperCase();
    $('[data-system-status]').textContent = 'Changes sync automatically';
    const accountEmail = $('[data-auth-settings-form] [name=newEmail]'); if (accountEmail) accountEmail.value = email;
    $('[data-today-label]').textContent = new Date().toLocaleDateString('en-GH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
}
function configReady() {
  const config = window.AYURELLE_FIREBASE_CONFIG || {};
  return !!(config.apiKey && config.projectId && !String(config.apiKey).includes('REPLACE_') && !String(config.projectId).includes('REPLACE_'));
}
async function checkAdmin(user) {
  const token = await user.getIdTokenResult(true);
  if (token.claims.admin === true) return true;
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    return adminDoc.exists() && adminDoc.data().active === true;
  } catch (error) {
    console.warn('Admin membership check failed:', error.message);
    return false;
  }
}

async function startApp() {
  app = initializeApp(window.AYURELLE_FIREBASE_CONFIG);
  auth = getAuth(app);
  db = getFirestore(app);
  onAuthStateChanged(auth, async user => {
    currentUser = user;
    if (!user) {
      closeRealtimeListeners();
      initialSnapshotKeys = new Set();
      setLoading(false);
      setShellVisible(false);
      return;
    }
    setLoading(true, 'Loading your store', 'Loading your latest orders and products.');
    initialSnapshotKeys = new Set();
    try {
      const authorised = await checkAdmin(user);
      if (!authorised) {
        await signOut(auth);
        setLoading(false);
        setShellVisible(false);
        setMessage('[data-login-message]', 'This email does not have access to the store dashboard. Please contact the store owner for help.', true);
        return;
      }
      setShellVisible(true);
      await seedCatalogueIfNeeded();
      subscribeRealtimeData();
      await loadStoreSettings();
      renderSetupChecklist();
    } catch (error) {
      console.error('Unable to open the store workspace:', error);
      setLoading(false);
      setShellVisible(false);
      setMessage('[data-login-message]', friendlyError(error, 'We could not open the store dashboard. Please refresh and try again.'), true);
    }
  });
}
function closeRealtimeListeners() { unsubscribers.splice(0).forEach(unsubscribe => { try { unsubscribe(); } catch {} }); }

async function seedCatalogueIfNeeded() {
  const snapshot = await getDocs(collection(db, 'products'));
  let seededProducts = false;
  if (snapshot.empty) {
    const defaults = window.AYURELLE_CATALOGUE?.list || [];
    if (!defaults.length) throw new Error('The product catalogue could not be loaded. Please refresh and try again.');
    const batch = writeBatch(db);
    defaults.forEach((product, index) => {
      const imageVariants = window.AYURELLE_IMAGES?.variants?.[product.slug] || null;
      batch.set(doc(db, 'products', product.slug), {
        ...product, images: [], imageUrl: '', useRepositoryImages: true, imageVariants,
        stock: 0, lowStockThreshold: 5, trackInventory: false, active: true, sortOrder: index + 1,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      });
    });
    await batch.commit();
    seededProducts = true;
  } else {
    const defaultsBySlug = new Map((window.AYURELLE_CATALOGUE?.list || []).map(item => [item.slug, item]));
    const batch = writeBatch(db); let edits = 0;
    snapshot.docs.forEach(docSnap => {
      const current = docSnap.data(); const slug = current.slug || docSnap.id; const updates = {};
      if (slug === 'ayur-hair-growth-oil') { updates.size = '100 ml'; updates.sizeDetail = '100 ml'; updates.variants = deleteField(); }
      if (slug === 'ayur-hair-growth-butter') { updates.size = '250 ml'; updates.sizeDetail = '250 ml'; updates.variants = deleteField(); }
      if (slug === 'ayur-silk-protein-mask') { updates.name = 'Prodiva Protein Mask'; updates.size = '250 ml'; updates.sizeDetail = '250 ml'; updates.variants = deleteField(); }
      if (slug === 'ayur-deep-conditioner') { updates.size = '250 ml'; updates.sizeDetail = '250 ml'; }
      if (slug === 'ayur-leave-in-conditioner') { updates.size = '250 ml'; updates.sizeDetail = '250 ml'; }
      if (slug === 'ayur-hair-tea') { updates.size = '200 g'; updates.sizeDetail = '200 g botanical blend'; }
      if (slug === 'ayur-scalp-detox-mist') updates.name = 'Rosemary Water Spray';
      const fallback = defaultsBySlug.get(slug);
      for (const field of ['short', 'description', 'directions', 'sizeDetail', 'scent', 'texture', 'caution']) {
        if (typeof current[field] === 'string' && /(draft|sample|placeholder|concept|to be confirmed|confirm.*before launch|owner-approved)/i.test(current[field]) && fallback?.[field]) updates[field] = fallback[field];
      }
      if (typeof current.ingredients === 'string' && /(draft example|sample formula|placeholder ingredient|to be confirmed)/i.test(current.ingredients)) updates.ingredients = '';
      if (Object.keys(updates).length) { updates.updatedAt = serverTimestamp(); batch.update(doc(db, 'products', docSnap.id), updates); edits++; }
    });
    if (edits) await batch.commit();
  }
  // Seed categories independently. A store may already have products while its
  // category collection is still empty or was cleared by an administrator.
  const fallbackCategories = Object.entries(window.AYURELLE_CATALOGUE?.categories || { sets: 'Complete Care Sets', hair: 'Hair Care Products', mens: "Men's Care", tools: 'Tools & Accessories' });
  const categorySnapshot = await getDocs(collection(db, 'categories'));
  if (categorySnapshot.empty) {
    const categoryBatch = writeBatch(db);
    fallbackCategories.forEach(([slug, name], index) => categoryBatch.set(doc(db, 'categories', slug), { slug, name, active: true, sortOrder: index + 1, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
    await categoryBatch.commit();
  }
  if (seededProducts) toast('Your product catalogue is ready. Review prices and stock levels before taking orders.');
}
function subscribeRealtimeData() {
  closeRealtimeListeners();
  unsubscribers.push(onSnapshot(collection(db, 'products'), snap => {
    products = snap.docs.map(d => ({ ...d.data(), id: d.id, slug: d.data().slug || d.id })).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0) || String(a.name).localeCompare(String(b.name)));
    renderAll(); markInitialSnapshot('products');
  }, err => { console.warn('Products did not load:', err.message); markInitialSnapshot('products'); toast('Some product information could not be loaded. Check your connection and refresh.', 'error'); }) );
  unsubscribers.push(onSnapshot(collection(db, 'orders'), snap => {
    orders = snap.docs.map(normaliseOrder).sort((a, b) => (dateFrom(b.createdAt)?.getTime() || 0) - (dateFrom(a.createdAt)?.getTime() || 0));
    renderAll(); markInitialSnapshot('orders');
  }, err => { console.warn('Orders did not load:', err.message); markInitialSnapshot('orders'); toast('Orders could not be refreshed. Please check your connection and try again.', 'error'); }) );
  unsubscribers.push(onSnapshot(collection(db, 'categories'), snap => {
    categories = snap.docs.map(d => ({ ...d.data(), id: d.id, slug: d.data().slug || d.id })).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0) || String(a.name).localeCompare(String(b.name)));
    renderAll(); markInitialSnapshot('categories');
  }, err => { console.warn('Categories did not load:', err.message); markInitialSnapshot('categories'); toast('Categories could not be refreshed. Please check your connection and try again.', 'error'); }) );
  unsubscribers.push(onSnapshot(collection(db, 'contact_messages'), snap => {
    messages = snap.docs.map(d => ({ ...d.data(), id: d.id })).sort((a, b) => (dateFrom(b.createdAt)?.getTime() || 0) - (dateFrom(a.createdAt)?.getTime() || 0));
    renderMessages(); renderNavCounts();
  }, err => console.warn('Message sync:', err.message)));
  unsubscribers.push(onSnapshot(collection(db, 'newsletter_subscribers'), snap => {
    subscribers = snap.docs.map(d => ({ ...d.data(), id: d.id })).sort((a, b) => (dateFrom(b.subscribedAt)?.getTime() || 0) - (dateFrom(a.subscribedAt)?.getTime() || 0));
    renderSubscribers();
  }, err => console.warn('Subscribers sync:', err.message)));
}

function renderAll() {
  renderNavCounts(); renderDashboard(); renderProducts(); renderInventory(); renderOrders(); renderCategories(); renderAnalytics(); renderCategorySelects(); renderMessages(); renderSubscribers();
}
function renderNavCounts() {
  $('[data-nav-products]').textContent = products.length;
  $('[data-nav-lowstock]').textContent = products.filter(p => p.trackInventory && Number(p.stock || 0) <= Number(p.lowStockThreshold ?? 5)).length;
  $('[data-nav-orders]').textContent = orders.filter(o => !['delivered', 'cancelled', 'refunded'].includes(String(o.status).toLowerCase())).length;
  $('[data-nav-messages]').textContent = messages.filter(m => m.status !== 'read' && m.status !== 'closed').length;
}
function paidOrdersWithin(days = 30) {
  const paid = orders.filter(order => order.paymentStatus === 'paid');
  if (days === 'all') return paid;
  const cutoff = Date.now() - Number(days) * 24 * 60 * 60 * 1000;
  return paid.filter(order => (dateFrom(order.paidAt || order.createdAt)?.getTime() || 0) >= cutoff);
}
function lowStockProducts() { return products.filter(p => p.trackInventory && Number(p.stock || 0) <= Number(p.lowStockThreshold ?? 5)); }
function statusClass(status) { return String(status || 'pending').toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''); }
function paymentPill(order) {
  const status = order.paymentStatus || 'pending';
  const good = status === 'paid';
  return `<span class="admin-status-pill ${good ? 'status-paid' : status === 'failed' ? 'status-failed' : 'status-pending'}"><i></i>${esc(status)}</span>`;
}
function fulfillmentPill(status) { return `<span class="admin-status-pill status-${statusClass(status)}"><i></i>${esc(status || 'pending')}</span>`; }
function renderDashboard() {
  const paid = orders.filter(o => o.paymentStatus === 'paid');
  const sales = paid.reduce((sum, order) => sum + Number(order.amountDue || 0), 0);
  const lowStock = lowStockProducts();
  $('[data-kpi-sales]').textContent = money(sales);
  $('[data-kpi-orders]').textContent = String(orders.length);
  $('[data-kpi-orders-note]').textContent = `${orders.filter(o => !['delivered', 'cancelled', 'refunded'].includes(String(o.status).toLowerCase())).length} awaiting fulfilment`;
  $('[data-kpi-products]').textContent = String(products.length);
  $('[data-kpi-products-note]').textContent = `${products.filter(p => p.active !== false).length} active listings`;
  $('[data-kpi-lowstock]').textContent = String(lowStock.length);
  const recent = $('[data-recent-orders]');
  const latest = orders.slice(0, 5);
  recent.innerHTML = latest.length ? latest.map(order => `<button type="button" class="admin-recent-order" data-open-order="${esc(order.reference)}"><span class="admin-recent-order-mark"><i class="fa-solid fa-bag-shopping"></i></span><span class="admin-recent-order-copy"><strong>${esc(order.customer?.name || 'Customer')}</strong><small>${esc(order.reference)} · ${fmtDate(order.createdAt)}</small></span><span class="admin-recent-order-value"><strong>${money(order.amountDue)}</strong><small>${esc(order.status || 'pending')}</small></span></button>`).join('') : '<div class="admin-empty-inline">No orders yet. Confirmed orders will appear here.</div>';
  renderSalesChart($('[data-sales-chart]'), $('[data-chart-axis]'), Number($('[data-sales-period]').value || 30), $('[data-chart-total]'));
}
function salesBucketData(days) {
  const now = new Date();
  const data = [];
  const max = days === 365 ? 12 : Math.min(Number(days), 90);
  if (days === 365) {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const revenue = orders.filter(o => o.paymentStatus === 'paid').filter(o => { const dt = dateFrom(o.paidAt || o.createdAt); return dt && dt >= d && dt < end; }).reduce((sum, o) => sum + Number(o.amountDue || 0), 0);
      data.push({ label: d.toLocaleDateString('en-GH', { month: 'short' }), value: revenue });
    }
  } else {
    for (let i = max - 1; i >= 0; i--) {
      const d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(now.getDate() - i);
      const next = new Date(d); next.setDate(d.getDate() + 1);
      const revenue = orders.filter(o => o.paymentStatus === 'paid').filter(o => { const dt = dateFrom(o.paidAt || o.createdAt); return dt && dt >= d && dt < next; }).reduce((sum, o) => sum + Number(o.amountDue || 0), 0);
      data.push({ label: max <= 7 ? d.toLocaleDateString('en-GH', { weekday: 'short' }) : d.toLocaleDateString('en-GH', { day: 'numeric', month: 'short' }), value: revenue });
    }
  }
  return data;
}
function renderSalesChart(container, axis, days, totalNode) {
  if (!container) return;
  const data = salesBucketData(days);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (totalNode) totalNode.textContent = money(total);
  const maxValue = Math.max(1, ...data.map(d => d.value));
  const w = 740, h = 230, padX = 18, padY = 18;
  const usableW = w - padX * 2, usableH = h - padY * 2;
  const points = data.map((item, i) => ({ x: padX + (data.length <= 1 ? 0 : i * usableW / (data.length - 1)), y: h - padY - (item.value / maxValue) * usableH, ...item }));
  const path = points.map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
  const area = `${path} L ${points[points.length - 1]?.x || padX} ${h - padY} L ${padX} ${h - padY} Z`;
  const grid = [0, 1, 2, 3].map(i => { const y = padY + i * usableH / 3; return `<line x1="${padX}" y1="${y}" x2="${w-padX}" y2="${y}" stroke="#e8e2d4" stroke-dasharray="3 6"/><text x="0" y="${y+4}" fill="#899184" font-size="9">${i === 0 ? 'GH₵' + Math.round(maxValue) : i === 1 ? 'GH₵' + Math.round(maxValue*2/3) : i === 2 ? 'GH₵' + Math.round(maxValue/3) : '0'}</text>`; }).join('');
  const markers = points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3.1" fill="#d8bb61" stroke="#173a25" stroke-width="1.4"><title>${esc(p.label)}: ${money(p.value)}</title></circle>`).join('');
  container.innerHTML = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Paid sales trend over selected period" preserveAspectRatio="none">${grid}<path d="${area}" fill="#d8e1d5" opacity=".56"/><path d="${path}" fill="none" stroke="#1f4a2e" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>${markers}</svg>`;
  if (axis) {
    const labels = data.length > 14 ? data.filter((_, i) => i % Math.ceil(data.length / 8) === 0 || i === data.length - 1) : data;
    axis.innerHTML = labels.map(item => `<span>${esc(item.label)}</span>`).join('');
  }
}
function filteredProducts(inventory = false) {
  const search = String($('[data-product-search]')?.value || '').trim().toLowerCase();
  const category = $('[data-product-filter-category]')?.value || 'all';
  const active = $('[data-product-filter-active]')?.value || 'all';
  return products.filter(p => {
    const matchSearch = !search || [p.name, p.slug, p.short, p.description, p.category].join(' ').toLowerCase().includes(search);
    const matchCategory = category === 'all' || p.category === category;
    const matchActive = active === 'all' || (active === 'active' ? p.active !== false : p.active === false);
    return matchSearch && matchCategory && matchActive && (!inventory || !!p.trackInventory);
  });
}
function renderProducts() {
  const tbody = $('[data-products-table]');
  if (!tbody) return;
  const results = filteredProducts(false);
  tbody.innerHTML = results.length ? results.map(p => `<tr class="admin-clickable-row" data-edit-product="${esc(p.slug)}" tabindex="0" aria-label="Edit ${esc(p.name)}"><td><div class="admin-table-product"><span class="admin-table-product-image"><img src="${esc(p.useRepositoryImages ? initialImage(p) : p.images?.[0] || p.imageUrl || initialImage(p))}" alt="" loading="lazy"></span><span><strong>${esc(p.name)}</strong><small>${esc(p.slug)}</small></span></div></td><td><span class="admin-category-label">${esc(categoryName(p.category))}</span></td><td><strong>${money(minPrice(p))}</strong>${p.variants?.length ? '<small class="admin-table-sub">From</small>' : ''}</td><td>${inventoryLabel(p)}</td><td><span class="admin-listing-pill ${p.active === false ? 'is-hidden' : 'is-active'}"><i></i>${p.active === false ? 'Hidden' : 'Active'}</span></td><td><button type="button" class="admin-row-action" data-edit-product="${esc(p.slug)}" aria-label="Edit ${esc(p.name)}"><i class="fa-solid fa-arrow-up-right-from-square"></i></button></td></tr>`).join('') : '<tr><td colspan="6"><div class="admin-empty-table">No products match those filters.</div></td></tr>';
  $('[data-products-count]').textContent = `${results.length} of ${products.length} products`;
}
function minPrice(p) { return Array.isArray(p.variants) && p.variants.length ? Math.min(...p.variants.map(v => Number(v.price) || 0)) : Number(p.price || 0); }
function inventoryLabel(p) {
  if (!p.trackInventory) return '<span class="admin-stock-label stock-untracked">Not tracked</span>';
  const stock = Number(p.stock || 0), low = Number(p.lowStockThreshold ?? 5);
  return `<span class="admin-stock-label ${stock <= 0 ? 'stock-out' : stock <= low ? 'stock-low' : 'stock-good'}"><i></i>${stock <= 0 ? 'Out of stock' : stock <= low ? `${stock} left` : `${stock} in stock`}</span>`;
}
function renderInventory() {
  const tbody = $('[data-inventory-table]');
  if (!tbody) return;
  const query = String($('[data-inventory-search]')?.value || '').trim().toLowerCase();
  const tracked = products.filter(p => p.trackInventory);
  const low = lowStockProducts();
  $('[data-inv-tracked]').textContent = tracked.length;
  $('[data-inv-units]').textContent = tracked.reduce((sum,p) => sum + Math.max(0, Number(p.stock || 0)), 0);
  $('[data-inv-low]').textContent = low.length;
  $('[data-inv-out]').textContent = tracked.filter(p => Number(p.stock || 0) <= 0).length;
  const results = products.filter(p => !query || [p.name,p.slug].join(' ').toLowerCase().includes(query));
  tbody.innerHTML = results.length ? results.map(p => `<tr class="admin-clickable-row" data-edit-product="${esc(p.slug)}" tabindex="0" aria-label="Edit ${esc(p.name)}"><td><div class="admin-table-product"><span class="admin-table-product-image"><img src="${esc(p.useRepositoryImages ? initialImage(p) : p.images?.[0] || p.imageUrl || initialImage(p))}" alt="" loading="lazy"></span><span><strong>${esc(p.name)}</strong><small>${esc(p.slug)}</small></span></div></td><td><label class="admin-switch"><input type="checkbox" data-stock-track="${esc(p.slug)}" ${p.trackInventory ? 'checked' : ''}><span></span><small>${p.trackInventory ? 'On' : 'Off'}</small></label></td><td><input class="admin-inline-number" type="number" min="0" step="1" value="${Number(p.stock || 0)}" data-stock-value="${esc(p.slug)}" ${p.trackInventory ? '' : 'disabled'} aria-label="Stock count for ${esc(p.name)}"></td><td><input class="admin-inline-number" type="number" min="0" step="1" value="${Number(p.lowStockThreshold ?? 5)}" data-stock-threshold="${esc(p.slug)}" aria-label="Low stock alert for ${esc(p.name)}"></td><td><button class="admin-row-action" type="button" data-edit-product="${esc(p.slug)}" aria-label="Edit ${esc(p.name)}"><i class="fa-solid fa-pen"></i></button></td></tr>`).join('') : '<tr><td colspan="5"><div class="admin-empty-table">No matching products.</div></td></tr>';
}
function populateProductCategoryFilter() {
  const options = categories.map(category => `<option value="${esc(category.slug)}">${esc(category.name)}</option>`).join('');
  const filter = $('[data-product-filter-category]');
  if (filter) { const value = filter.value || 'all'; filter.innerHTML = `<option value="all">All categories</option>${options}`; filter.value = categories.some(c => c.slug === value) ? value : 'all'; }
  const editor = $('[data-editor-category]');
  if (editor) { const selected = editor.value; editor.innerHTML = categories.map(category => `<option value="${esc(category.slug)}" ${category.active === false ? 'disabled' : ''}>${esc(category.name)}${category.active === false ? ' (hidden)' : ''}</option>`).join(''); if (categories.some(c => c.slug === selected)) editor.value = selected; }
}
function categoryName(slug) { return categories.find(c => c.slug === slug)?.name || window.AYURELLE_CATALOGUE?.categories?.[slug] || slug || 'Uncategorised'; }
function renderOrders() {
  const tbody = $('[data-orders-table]');
  if (!tbody) return;
  const search = String($('[data-order-search]')?.value || '').trim().toLowerCase();
  const filter = $('[data-order-filter]')?.value || 'all';
  const payment = $('[data-payment-filter]')?.value || 'all';
  const results = orders.filter(order => {
    const matchesText = !search || [order.reference, order.customer?.name, order.customer?.email, order.customer?.phone].join(' ').toLowerCase().includes(search);
    return matchesText && (filter === 'all' || String(order.status || '').toLowerCase() === filter) && (payment === 'all' || String(order.paymentStatus || 'pending').toLowerCase() === payment);
  });
  tbody.innerHTML = results.length ? results.map(order => `<tr class="admin-clickable-row" data-open-order="${esc(order.reference)}" tabindex="0" aria-label="Open order ${esc(order.reference)}"><td><button type="button" class="admin-order-ref" data-open-order="${esc(order.reference)}">${esc(order.reference)}</button><small class="admin-table-sub">${(order.items || []).reduce((sum,item) => sum + Number(item.qty || 0), 0)} units</small></td><td><div class="admin-customer-cell"><strong>${esc(order.customer?.name || 'Customer')}</strong><small>${esc(order.customer?.email || order.customer?.phone || 'No contact details')}</small></div></td><td>${fmtDate(order.createdAt)}</td><td><strong>${money(order.amountDue)}</strong></td><td>${paymentPill(order)}</td><td>${fulfillmentPill(order.status)}</td><td><button type="button" class="admin-row-action" data-open-order="${esc(order.reference)}" aria-label="View order ${esc(order.reference)}"><i class="fa-solid fa-arrow-up-right-from-square"></i></button></td></tr>`).join('') : '<tr><td colspan="7"><div class="admin-empty-table">No orders match your filters.</div></td></tr>';
  $('[data-orders-count]').textContent = `${results.length} orders`;
}
function renderCategories() {
  const node = $('[data-categories-list]');
  if (!node) return;
  node.innerHTML = categories.length ? categories.map((category, index) => {
    const count = products.filter(p => p.category === category.slug).length;
    return `<article class="admin-category-card"><div class="admin-category-card-top"><span class="admin-category-number">${index + 1}</span><span class="admin-category-state ${category.active === false ? 'is-hidden' : 'is-active'}"><i></i>${category.active === false ? 'Hidden' : 'Active'}</span></div><div class="admin-category-symbol"><i class="fa-solid ${category.slug === 'sets' ? 'fa-box-open' : category.slug === 'hair' ? 'fa-leaf' : category.slug === 'mens' ? 'fa-user-tie' : category.slug === 'tools' ? 'fa-scissors' : 'fa-layer-group'}"></i></div><h2>${esc(category.name)}</h2><p>${count} product${count === 1 ? '' : 's'} in this category</p><div class="admin-category-card-bottom"><code>${esc(category.slug)}</code><button type="button" class="admin-secondary-button" data-edit-category="${esc(category.slug)}">Edit category <i class="fa-solid fa-arrow-up-right-from-square"></i></button></div></article>`;
  }).join('') : '<div class="admin-panel admin-empty-inline">No categories yet. Add your first category above.</div>';
}
function renderAnalytics() {
  const period = $('[data-analytics-period]')?.value || '30';
  const paid = paidOrdersWithin(period);
  const revenue = paid.reduce((sum, order) => sum + Number(order.amountDue || 0), 0);
  const units = paid.reduce((sum, order) => sum + (order.items || []).reduce((n,item) => n + Number(item.qty || 0), 0), 0);
  $('[data-analytics-revenue]').textContent = money(revenue);
  $('[data-analytics-average]').textContent = money(paid.length ? revenue / paid.length : 0);
  $('[data-analytics-orders]').textContent = String(paid.length);
  $('[data-analytics-units]').textContent = String(units);
  renderSalesChart($('[data-analytics-chart]'), null, period === 'all' ? 365 : Number(period), null);
  const tally = new Map();
  paid.forEach(order => (order.items || []).forEach(item => tally.set(item.slug, (tally.get(item.slug) || 0) + Number(item.qty || 0))));
  const top = [...tally.entries()].sort((a,b) => b[1]-a[1]).slice(0,6);
  $('[data-top-products]').innerHTML = top.length ? top.map(([slug,qty],i) => `<div class="admin-ranked-row"><span class="admin-rank">${i+1}</span><div><strong>${esc(products.find(p => p.slug === slug)?.name || slug)}</strong><small>${qty} unit${qty === 1 ? '' : 's'} sold</small></div><span class="admin-ranked-value">${qty}</span></div>`).join('') : '<div class="admin-empty-inline">Product performance will appear after successful orders.</div>';
  const statusTally = new Map(); orders.forEach(order => { const key = order.status || 'pending'; statusTally.set(key, (statusTally.get(key) || 0) + 1); });
  $('[data-order-mix]').innerHTML = statusTally.size ? [...statusTally.entries()].sort((a,b) => b[1]-a[1]).map(([status,count]) => `<div class="admin-ranked-row"><span class="admin-rank"><i class="fa-solid fa-circle" style="font-size:7px"></i></span><div><strong>${esc(status)}</strong><small>${Math.round(count / Math.max(orders.length,1) * 100)}% of orders</small></div><span class="admin-ranked-value">${count}</span></div>`).join('') : '<div class="admin-empty-inline">There are no orders to analyse yet.</div>';
}
function renderMessages() {
  const tbody = $('[data-messages-table]'); if (!tbody) return;
  tbody.innerHTML = messages.length ? messages.map(message => `<tr><td>${fmtDateTime(message.createdAt)}</td><td><div class="admin-customer-cell"><strong>${esc(message.name)}</strong><small>${esc(message.email)}</small></div></td><td>${esc(message.topic)}</td><td><span class="admin-message-preview" title="${esc(message.message)}">${esc(message.message)}</span></td><td>${fulfillmentPill(message.status || 'new')}</td><td><div class="admin-inline-actions"><a class="admin-row-action" href="mailto:${encodeURIComponent(message.email || '')}?subject=${encodeURIComponent('Re: Ayurélle enquiry') }" aria-label="Reply to message"><i class="fa-solid fa-reply"></i></a><button class="admin-row-action" type="button" data-message-read="${esc(message.id)}" aria-label="Mark message read"><i class="fa-solid fa-check"></i></button></div></td></tr>`).join('') : '<tr><td colspan="6"><div class="admin-empty-table">No website enquiries yet.</div></td></tr>';
}
function renderSubscribers() {
  const tbody = $('[data-subscribers-table]'); if (!tbody) return;
  $('[data-subscriber-count]').textContent = subscribers.length;
  $('[data-subscriber-active]').textContent = subscribers.filter(s => s.status === 'subscribed').length;
  tbody.innerHTML = subscribers.length ? subscribers.map(sub => `<tr><td><strong>${esc(sub.email)}</strong></td><td>${esc(sub.source || 'Website')}</td><td>${fmtDate(sub.subscribedAt)}</td><td>${fulfillmentPill(sub.status || 'subscribed')}</td><td><button class="admin-row-action" type="button" data-toggle-subscriber="${esc(sub.id)}" data-next-status="${sub.status === 'subscribed' ? 'unsubscribed' : 'subscribed'}" aria-label="Toggle subscription"><i class="fa-solid ${sub.status === 'subscribed' ? 'fa-user-minus' : 'fa-user-plus'}"></i></button></td></tr>`).join('') : '<tr><td colspan="5"><div class="admin-empty-table">No newsletter subscribers yet.</div></td></tr>';
}
function renderSetupChecklist() {
  const node = $('[data-setup-checklist]'); if (!node) return;
  const tasks = [
    ['Store details', 'Check the contact information, pickup address and collection days.'],
    ['Product catalogue', 'Review product names, descriptions, prices, sizes and ingredients.'],
    ['Stock levels', 'Enter current quantities and turn on stock tracking where needed.'],
    ['Online payments', 'Ask your website support person to confirm online payments are connected.'],
    ['Customer emails', 'Ask your website support person to confirm order confirmations and status updates are sending.']
  ];
  node.innerHTML = tasks.map((task,i) => `<div class="admin-checklist-row"><span>${i+1}</span><div><strong>${esc(task[0])}</strong><small>${esc(task[1])}</small></div><i class="fa-regular fa-circle"></i></div>`).join('');
}

function setView(name) {
  if (!$(`[data-admin-view="${name}"]`)) return;
  currentView = name;
  $$('.admin-view').forEach(view => view.classList.toggle('is-current', view.dataset.adminView === name));
  $$('[data-view]').forEach(button => button.classList.toggle('is-active', button.dataset.view === name));
  const labels = { dashboard: 'Overview', products: 'Products', inventory: 'Inventory', orders: 'Orders', analytics: 'Sales analytics', categories: 'Categories', messages: 'Messages', subscribers: 'Subscribers', settings: 'Store settings', account: 'Sign-in details' };
  $('[data-current-view]').textContent = labels[name] || name;
  $('[data-admin-sidebar]').classList.remove('is-open');
  document.body.classList.remove('admin-nav-open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function renderCategorySelects() { populateProductCategoryFilter(); }
function cleanForJson(product) {
  const copy = { ...product }; delete copy.id; delete copy.createdAt; delete copy.updatedAt;
  return JSON.parse(JSON.stringify(copy));
}
function parseJsonField(value, fallback, label) {
  if (!String(value || '').trim()) return fallback;
  try { return JSON.parse(value); } catch { throw new Error(`${label} must be valid JSON.`); }
}
function fillProductForm(product = null) {
  const form = $('[data-product-form]');
  form.reset();
  editingProductSlug = product?.slug || null;
  draftImages = product && !product.useRepositoryImages ? [...(product.images || (product.imageUrl ? [product.imageUrl] : []))] : [];
  populateProductCategoryFilter();
  const title = $('[data-product-dialog-title]');
  title.innerHTML = product ? `Edit <em>product.</em>` : `New <em>product.</em>`;
  $('[data-delete-product]').hidden = !product;
  const set = (name, value) => { if (form.elements[name]) form.elements[name].value = value ?? ''; };
  set('name', product?.name || ''); set('slug', product?.slug || ''); set('category', product?.category || categories.find(c => c.active !== false)?.slug || 'hair');
  set('price', product?.price ?? ''); set('size', product?.size || ''); set('stock', product?.stock ?? 0); set('lowStockThreshold', product?.lowStockThreshold ?? 5);
  set('active', String(product?.active !== false)); form.elements.trackInventory.checked = !!product?.trackInventory;
  set('short', product?.short || ''); set('description', product?.description || ''); set('ingredients', product?.ingredients || ''); set('directions', product?.directions || ''); set('sizeDetail', product?.sizeDetail || ''); set('texture', product?.texture || ''); set('scent', product?.scent || ''); set('badge', product?.badge || ''); set('caution', product?.caution || ''); set('highlights', (product?.highlights || []).join('\n')); set('contains', (product?.contains || []).map(item => typeof item === 'string' ? item : item.slug).join('\n'));
  set('images', draftImages.join('\n')); form.elements.useRepositoryImages.checked = product ? !!product.useRepositoryImages : true;
  set('variantsJson', JSON.stringify(product?.variants || [], null, 2));
  const imageVariants = product?.imageVariants || (product && window.AYURELLE_IMAGES?.variants?.[product.slug]) || {};
  set('imageVariantsJson', JSON.stringify(imageVariants, null, 2));
  set('advancedJson', JSON.stringify(product ? cleanForJson(product) : { slug: '', name: '', category: 'hair', price: 0, size: '', short: '', description: '', ingredients: '', directions: '', highlights: [], contains: [], active: true, stock: 0, trackInventory: false }, null, 2));
  renderDraftImages();
  renderSetContentsPicker(product);
  updateSetPickerVisibility();
  updateRepositoryImageState();
  setMessage('[data-product-form-feedback]', '');
  $('[data-product-dialog]').showModal();
}

function renderSetContentsPicker(product = null) {
  const picker = $('[data-set-picker]');
  const form = $('[data-product-form]');
  if (!picker || !form) return;
  const selected = new Set(String(form.elements.contains.value || '').split('\n').map(value => value.trim()).filter(Boolean));
  picker.innerHTML = products.filter(item => item.category !== 'sets' && item.slug !== editingProductSlug).map(item => {
    const image = item.useRepositoryImages ? initialImage(item) : item.images?.[0] || item.imageUrl || initialImage(item);
    return `<label class="admin-set-option"><input type="checkbox" value="${esc(item.slug)}" ${selected.has(item.slug) ? 'checked' : ''}><img src="${esc(image)}" alt="" loading="lazy"><span><strong>${esc(item.name)}</strong><small>${money(minPrice(item))} · ${esc(item.size || 'Standard size')}</small></span><i class="fa-solid fa-check" aria-hidden="true"></i></label>`;
  }).join('') || '<p class="admin-set-picker-empty">Add a few products before creating a complete care set.</p>';
  picker.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.addEventListener('change', syncSetContents));
  syncSetContents();
}
function syncSetContents() {
  const form = $('[data-product-form]'); if (!form) return;
  form.elements.contains.value = $$('[data-set-picker] input:checked').map(input => input.value).join('\n');
}
function updateSetPickerVisibility() {
  const wrap = $('[data-set-picker-wrap]');
  if (wrap) wrap.hidden = $('[data-editor-category]')?.value !== 'sets';
}

function updateRepositoryImageState() {
  const useRepo = $('[data-use-repo-images]').checked;
  const productSlug = $('[data-product-form]').elements.slug.value || editingProductSlug;
  const note = useRepo ? 'Using the original product photos supplied with the website.' : `${draftImages.length} image${draftImages.length === 1 ? '' : 's'} ready to save.`;
  let text = $('[data-repo-image-note]');
  if (!text) { text = document.createElement('p'); text.className = 'admin-image-note'; text.dataset.repoImageNote = ''; $('[data-image-controls], .admin-image-controls')?.prepend(text); }
  text.textContent = useRepo ? note : note;
  if (useRepo) { draftImages = []; $('[data-product-form]').elements.images.value = ''; renderDraftImages(); }
}
function renderDraftImages() {
  const grid = $('[data-image-grid]'); if (!grid) return;
  grid.innerHTML = draftImages.length ? draftImages.map((url,index) => `<figure class="admin-image-preview"><img src="${esc(url)}" alt="Uploaded product view ${index+1}" loading="lazy"><span>Image ${index+1}${index === 0 ? ' · Cover' : ''}</span><button type="button" data-remove-image="${index}" aria-label="Remove image ${index+1}"><i class="fa-solid fa-xmark"></i></button></figure>`).join('') : '<div class="admin-image-empty"><i class="fa-regular fa-images"></i><span>No custom images selected. Repository imagery will be used if enabled.</span></div>';
  $('[data-product-form]').elements.images.value = draftImages.join('\n');
}
async function getUploadSignature(file) {
  const token = await getIdToken(currentUser, true);
  const response = await fetch('/.netlify/functions/cloudinary-sign', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ fileName: file.name }) });
  const signature = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(signature.error || 'Could not prepare upload.');
  return signature;
}
function cloudinaryUpload(file, sign, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${encodeURIComponent(sign.cloudName)}/image/upload`);
    xhr.upload.onprogress = event => { if (event.lengthComputable && onProgress) onProgress(Math.round(event.loaded / event.total * 100)); };
    xhr.onload = () => {
      let result = {}; try { result = JSON.parse(xhr.responseText || '{}'); } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && result.secure_url) resolve(result);
      else reject(new Error(result.error?.message || `Cloudinary upload failed (${xhr.status}).`));
    };
    xhr.onerror = () => reject(new Error('Network error while uploading to Cloudinary.'));
    xhr.onabort = () => reject(new Error('Image upload was cancelled.'));
    const body = new FormData(); body.append('file', file); body.append('api_key', sign.apiKey); body.append('timestamp', String(sign.timestamp)); body.append('folder', sign.folder); body.append('public_id', sign.publicId); body.append('overwrite', 'true'); body.append('signature', sign.signature);
    xhr.send(body);
  });
}
async function handleImageFiles(files) {
  const accepted = [...files].filter(file => file.type.startsWith('image/'));
  if (!accepted.length) { toast('Choose image files such as JPG, PNG or WebP.', 'error'); return; }
  if (accepted.some(file => file.size > 12 * 1024 * 1024)) { toast('Each image must be 12 MB or smaller.', 'error'); return; }
  if (draftImages.length + accepted.length > 12) { toast('A product can have up to 12 images in the gallery.', 'error'); return; }
  uploadCount += accepted.length;
  const zone = $('[data-upload-zone]'); zone.classList.add('is-uploading'); zone.dataset.uploadStatus = `Uploading ${accepted.length} image${accepted.length === 1 ? '' : 's'}…`;
  const browseButton = $('[data-browse-images]'); if (browseButton) setBusy(browseButton, true, 'Uploading…');
  $('[data-use-repo-images]').checked = false;
  try {
    const settled = await Promise.allSettled(accepted.map(async file => {
      const signature = await getUploadSignature(file);
      const uploaded = await cloudinaryUpload(file, signature, percent => { zone.dataset.uploadStatus = `Uploading ${file.name} · ${percent}%`; });
      return uploaded.secure_url;
    }));
    const results = settled.filter(item => item.status === 'fulfilled').map(item => item.value);
    const failures = settled.filter(item => item.status === 'rejected');
    draftImages.push(...results);
    $('[data-product-form]').elements.images.value = draftImages.join('\n');
    renderDraftImages(); updateRepositoryImageState();
    if (results.length) toast(`${results.length} image${results.length === 1 ? '' : 's'} uploaded to Cloudinary. Save the product to publish them.${failures.length ? ` ${failures.length} upload${failures.length === 1 ? '' : 's'} failed.` : ''}`, failures.length ? 'error' : 'success');
    else if (failures.length) throw new Error(failures[0].reason?.message || 'Image upload failed.');
  } catch (error) {
    toast(error.message || 'Image upload failed.', 'error');
  } finally {
    uploadCount = Math.max(0, uploadCount - accepted.length);
    zone.classList.remove('is-uploading'); delete zone.dataset.uploadStatus;
    if (browseButton) setBusy(browseButton, false);
  }
}
function saveProduct(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('[type="submit"]');
  (async () => {
    setBusy(button, true, 'Saving product…');
    setMessage('[data-product-form-feedback]', 'Saving your product…');
    try {
      const raw = parseJsonField(form.elements.advancedJson.value, {}, 'Entire product document');
      const variants = parseJsonField(form.elements.variantsJson.value, [], 'Size variants');
      const imageVariants = parseJsonField(form.elements.imageVariantsJson.value, {}, 'Colour variant images');
      if (!Array.isArray(variants)) throw new Error('Size variants JSON must be an array.');
      if (typeof imageVariants !== 'object' || Array.isArray(imageVariants)) throw new Error('Colour variant images JSON must be an object.');
      const slug = slugify(form.elements.slug.value);
      if (!slug) throw new Error('Enter a valid product slug.');
      const useRepositoryImages = form.elements.useRepositoryImages.checked;
      const images = useRepositoryImages ? [] : [...new Set(draftImages.length ? draftImages : String(form.elements.images.value || '').split('\n').map(v => v.trim()).filter(Boolean))];
      for (const url of images) if (!/^https:\/\//i.test(url)) throw new Error('Every custom image URL must start with https://.');
      const product = {
        ...raw,
        slug, name: form.elements.name.value.trim(), category: form.elements.category.value,
        price: Number(form.elements.price.value), size: form.elements.size.value.trim(),
        stock: Math.max(0, Number(form.elements.stock.value) || 0), lowStockThreshold: Math.max(0, Number(form.elements.lowStockThreshold.value) || 0),
        active: form.elements.active.value === 'true', trackInventory: form.elements.trackInventory.checked,
        short: form.elements.short.value.trim(), description: form.elements.description.value.trim(),
        ingredients: form.elements.ingredients.value.trim(), directions: form.elements.directions.value.trim(),
        sizeDetail: form.elements.sizeDetail.value.trim(), texture: form.elements.texture.value.trim(), scent: form.elements.scent.value.trim(), badge: form.elements.badge.value.trim(), caution: form.elements.caution.value.trim(),
        highlights: form.elements.highlights.value.split('\n').map(v => v.trim()).filter(Boolean),
        contains: form.elements.contains.value.split('\n').map(v => v.trim()).filter(Boolean).map(value => ({ slug: value })),
        variants, imageVariants, images, imageUrl: images[0] || '', useRepositoryImages,
        updatedAt: serverTimestamp()
      };
      if (!product.name || !product.short || !product.description || !Number.isFinite(product.price) || product.price < 0) throw new Error('Please complete the required name, description and price fields.');
      if (slug !== editingProductSlug && products.some(p => p.slug === slug)) throw new Error('That product slug already exists. Choose a unique slug.');
      if (editingProductSlug && slug !== editingProductSlug) {
        const batch = writeBatch(db); batch.set(doc(db, 'products', slug), { ...product, createdAt: raw.createdAt || serverTimestamp() }); batch.delete(doc(db, 'products', editingProductSlug)); await batch.commit();
      } else {
        if (!editingProductSlug) product.createdAt = serverTimestamp();
        await setDoc(doc(db, 'products', slug), product, { merge: true });
      }
      $('[data-product-dialog]').close(); toast(`${product.name} saved. The storefront will pick up the changes.`);
    } catch (error) { setMessage('[data-product-form-feedback]', friendlyError(error, 'We could not save this product. Please check your connection and try again.'), true); }
    finally { setBusy(button, false); }
  })();
}
async function deleteProduct() {
  if (!editingProductSlug) return;
  const existing = products.find(p => p.slug === editingProductSlug);
  if (!confirm(`Delete “${existing?.name || editingProductSlug}” permanently? This cannot be undone.`)) return;
  const button = $('[data-delete-product]'); setBusy(button, true, 'Deleting…');
  try { await deleteDoc(doc(db, 'products', editingProductSlug)); $('[data-product-dialog]').close(); toast('Product deleted from the catalogue.'); }
  catch (error) { setMessage('[data-product-form-feedback]', friendlyError(error, 'We could not delete this product. Please try again.'), true); }
  finally { setBusy(button, false); }
}
function fillOrderDialog(reference) {
  activeOrder = orders.find(order => order.reference === reference);
  if (!activeOrder) return;
  $('[data-order-dialog-ref]').textContent = activeOrder.reference;
  $('[data-order-dialog-subtitle]').textContent = `${activeOrder.customer?.name || 'Customer'} · Placed ${fmtDateTime(activeOrder.createdAt)}`;
  const order = activeOrder;
  const delivery = order.delivery || {};
  const pickup = delivery.method === 'pickup';
  const scheduled = delivery.scheduledDate || delivery.requestedDate || '';
  const scheduledLabel = scheduled && /^\d{4}-\d{2}-\d{2}$/.test(scheduled) ? new Intl.DateTimeFormat('en-GH', { timeZone: 'Africa/Accra', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${scheduled}T12:00:00Z`)) : (delivery.scheduledDay || delivery.requestedDay || 'To be confirmed');
  const address = pickup ? (delivery.pickupAddress || 'Ville Afrique, North Kaneshie') : [delivery.address, [delivery.city, delivery.region].filter(Boolean).join(', ')].filter(Boolean).join(' · ');
  $('[data-order-dialog-body]').innerHTML = `<div class="admin-order-dialog-status"><div>${paymentPill(order)}<small>${esc(order.paymentProvider || 'Secure online payment')}</small></div><div>${fulfillmentPill(order.status)}<small>Current order status</small></div></div><div class="admin-order-info-grid"><div><span>Customer</span><strong>${esc(order.customer?.name || 'Customer')}</strong><a href="mailto:${encodeURIComponent(order.customer?.email || '')}">${esc(order.customer?.email || 'No email provided')}</a><a href="tel:${esc(order.customer?.phone || '')}">${esc(order.customer?.phone || 'No phone provided')}</a></div><div><span>${pickup ? 'Pickup details' : 'Delivery details'}</span><strong>${esc(pickup ? 'Pickup · Ville Afrique' : 'Home delivery')}</strong><small><b>Scheduled for:</b> ${esc(scheduledLabel)}</small><small><b>${pickup ? 'Pickup address' : 'Address'}:</b> ${esc(address || 'To be confirmed')}</small>${pickup ? `<small>${esc(delivery.pickupInstructions || 'Please wait for our confirmation before travelling to collect your order.')}</small>` : `<small>${esc(delivery.deliveryNote || 'Delivery charges are confirmed separately after the location is reviewed.')}</small>`}${delivery.notes ? `<small>Order note: ${esc(delivery.notes)}</small>` : ''}</div></div><div class="admin-order-lines"><div class="admin-order-section-heading"><div><span>ORDER CONTENTS</span><h3>Items in this order</h3></div><small>${(order.items || []).reduce((sum,item) => sum + Number(item.qty || 0), 0)} item(s)</small></div>${(order.items || []).map(item => `<div class="admin-order-line"><img class="admin-order-item-image" src="${esc(item.image || initialImage({ slug: item.slug, category: item.category }))}" alt="${esc(item.name)}" loading="lazy"><span><strong>${esc(item.name)}</strong><small>${esc([item.size, item.colorLabel || item.color].filter(Boolean).join(' · '))} · Qty ${Number(item.qty || 1)}</small></span><b>${money(item.lineTotal ?? Number(item.price) * Number(item.qty))}</b></div>`).join('')}</div><div class="admin-order-totals"><div><span>Subtotal</span><strong>${money(order.subtotal)}</strong></div><div><span>Processing fee</span><strong>${money(order.processingFee)}</strong></div><div class="admin-order-paid-total"><span>Paid today</span><strong>${money(order.amountDue)}</strong></div><small>${pickup ? 'Pickup is arranged for the date above. The team will confirm before collection.' : 'Delivery fee is not included in the payment. Confirm it separately with the customer.'}</small></div>`;
  $('[data-order-status-select]').value = order.status || 'processing';
  setMessage('[data-order-update-feedback]', '');
  $('[data-order-dialog]').showModal();
}
async function saveOrderStatus() {
  if (!activeOrder) return;
  const status = $('[data-order-status-select]').value;
  const button = $('[data-save-order-status]'); setBusy(button, true, 'Updating order…'); setMessage('[data-order-update-feedback]', 'Updating status and notifying the customer…');
  try {
    const token = await getIdToken(currentUser, true);
    const response = await fetch('/.netlify/functions/order-status', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ reference: activeOrder.reference, status }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Could not update order status.');
    setMessage('[data-order-update-feedback]', data.message || 'Order status updated.');
    toast(data.message || 'Order updated.');
  } catch (error) { setMessage('[data-order-update-feedback]', friendlyError(error, 'We could not update this order right now. Please try again.'), true); }
  finally { setBusy(button, false); }
}

async function createCategory(event) {
  event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('[type="submit"]'); setBusy(button, true, 'Adding…');
  try {
    const name = form.elements.name.value.trim(); const slug = slugify(form.elements.slug.value);
    if (!name || !slug) throw new Error('Enter a category name and URL slug.');
    if (categories.some(c => c.slug === slug)) throw new Error('That category slug already exists.');
    await setDoc(doc(db, 'categories', slug), { slug, name, active: true, sortOrder: categories.length + 1, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    form.reset(); toast('Category created.');
  } catch (error) { toast(error.message, 'error'); }
  finally { setBusy(button, false); }
}
function fillCategoryDialog(slug) {
  const category = categories.find(c => c.slug === slug); if (!category) return;
  editingCategorySlug = slug; const form = $('[data-category-edit-form]');
  form.elements.originalSlug.value = slug; form.elements.name.value = category.name; form.elements.slug.value = category.slug; form.elements.active.checked = category.active !== false;
  setMessage('[data-category-edit-feedback]', ''); $('[data-category-dialog]').showModal();
}
async function saveCategory(event) {
  event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('[type="submit"]'); setBusy(button, true, 'Saving…');
  try {
    const oldSlug = form.elements.originalSlug.value; const name = form.elements.name.value.trim(); const slug = slugify(form.elements.slug.value || name);
    if (!name || !slug) throw new Error('Enter a category name.');
    if (slug !== oldSlug && categories.some(c => c.slug === slug)) throw new Error('A category with that name already exists. Try a different name.');
    const updates = { slug, name, active: form.elements.active.checked, updatedAt: serverTimestamp() };
    if (slug !== oldSlug) {
      const batch = writeBatch(db); batch.set(doc(db, 'categories', slug), { ...updates, sortOrder: categories.find(c => c.slug === oldSlug)?.sortOrder || categories.length + 1, createdAt: serverTimestamp() }); batch.delete(doc(db, 'categories', oldSlug));
      products.filter(p => p.category === oldSlug).forEach(p => batch.update(doc(db, 'products', p.slug), { category: slug, updatedAt: serverTimestamp() })); await batch.commit();
    } else await updateDoc(doc(db, 'categories', oldSlug), updates);
    $('[data-category-dialog]').close(); toast('Category saved.');
  } catch (error) { setMessage('[data-category-edit-feedback]', error.message, true); }
  finally { setBusy(button, false); }
}
async function deleteCategory() {
  if (!editingCategorySlug) return;
  const count = products.filter(p => p.category === editingCategorySlug).length;
  const alternatives = categories.filter(c => c.slug !== editingCategorySlug && c.active !== false);
  const destination = alternatives.find(c => c.slug === 'hair') || alternatives[0];
  const prompt = count ? `This category contains ${count} product(s). Remove it and move them to “${destination?.name || 'Uncategorised'}”?` : 'Remove this category permanently?';
  if (!confirm(prompt)) return;
  const button = $('[data-delete-category]'); setBusy(button, true, 'Removing…');
  try {
    const batch = writeBatch(db);
    if (destination) products.filter(p => p.category === editingCategorySlug).forEach(p => batch.update(doc(db, 'products', p.slug), { category: destination.slug, updatedAt: serverTimestamp() }));
    batch.delete(doc(db, 'categories', editingCategorySlug)); await batch.commit();
    $('[data-category-dialog]').close(); toast('Category removed.');
  } catch (error) { setMessage('[data-category-edit-feedback]', error.message, true); }
  finally { setBusy(button, false); }
}
async function loadStoreSettings() {
  try {
    const snap = await getDoc(doc(db, 'settings', 'store'));
    if (!snap.exists()) return;
    const data = snap.data(); const form = $('[data-settings-form]');
    Object.keys(data).forEach(key => { if (form.elements[key]) form.elements[key].value = data[key] ?? ''; });
  } catch (error) { console.warn('Store settings could not be loaded:', error.message); }
}
async function saveSettings(event) {
  event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('[type="submit"]'); setBusy(button, true, 'Saving settings…');
  try {
    const payload = Object.fromEntries(new FormData(form).entries()); payload.updatedAt = serverTimestamp(); payload.updatedBy = currentUser.email || currentUser.uid;
    await setDoc(doc(db, 'settings', 'store'), payload, { merge: true }); setMessage('[data-settings-feedback]', 'Store preferences saved.'); toast('Store settings saved.');
  } catch (error) { setMessage('[data-settings-feedback]', friendlyError(error, 'We could not save your store settings. Please try again.'), true); }
  finally { setBusy(button, false); }
}

async function saveSignInDetails(event) {
  event.preventDefault();
  const form = event.currentTarget; const button = form.querySelector('[type="submit"]');
  const currentPassword = form.elements.currentPassword.value;
  const newEmail = form.elements.newEmail.value.trim();
  const newPassword = form.elements.newPassword.value;
  const confirmation = form.elements.confirmPassword.value;
  if (!currentUser || !currentUser.email) { setMessage('[data-auth-settings-feedback]', 'Please sign in again before changing these details.', true); return; }
  if (!newEmail && !newPassword) { setMessage('[data-auth-settings-feedback]', 'Enter a new email address or a new password to continue.', true); return; }
  if (newPassword && newPassword.length < 8) { setMessage('[data-auth-settings-feedback]', 'Your new password must have at least 8 characters.', true); return; }
  if (newPassword && newPassword !== confirmation) { setMessage('[data-auth-settings-feedback]', 'The new passwords do not match.', true); return; }
  setBusy(button, true, 'Saving sign-in details…'); setMessage('[data-auth-settings-feedback]', 'Checking your current password…');
  try {
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    if (newEmail && newEmail.toLowerCase() !== String(currentUser.email).toLowerCase()) await updateEmail(currentUser, newEmail);
    if (newPassword) await updatePassword(currentUser, newPassword);
    const emailNode = $('[data-admin-user]'); if (emailNode) emailNode.textContent = currentUser.email || newEmail;
    form.elements.currentPassword.value = ''; form.elements.newPassword.value = ''; form.elements.confirmPassword.value = '';
    form.elements.newEmail.value = currentUser.email || newEmail;
    setMessage('[data-auth-settings-feedback]', 'Your sign-in details have been updated. Keep them somewhere safe.');
    toast('Sign-in details updated.');
  } catch (error) {
    console.warn('Sign-in details update failed:', error);
    setMessage('[data-auth-settings-feedback]', friendlyError(error, 'We could not update those details. Check your current password and try again.'), true);
  } finally { setBusy(button, false); }
}

function downloadCSV(filename, rows) {
  const csv = rows.map(row => row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
}
function exportOrders() {
  const rows = [['Reference','Created','Customer','Email','Phone','Subtotal','Processing fee','Paid total','Payment status','Order status','Region','City','Address','Items']];
  orders.forEach(o => rows.push([o.reference, fmtDateTime(o.createdAt), o.customer?.name, o.customer?.email, o.customer?.phone, o.subtotal, o.processingFee, o.amountDue, o.paymentStatus, o.status, o.delivery?.region, o.delivery?.city, o.delivery?.address, (o.items || []).map(i => `${i.name} x ${i.qty}`).join('; ')]));
  downloadCSV('ayurelle-orders.csv', rows);
}
function exportInventory() {
  const rows = [['Product','Slug','Category','Tracked','Stock','Low-stock threshold','Active']];
  products.forEach(p => rows.push([p.name,p.slug,categoryName(p.category),p.trackInventory,Number(p.stock||0),Number(p.lowStockThreshold??5),p.active!==false]));
  downloadCSV('ayurelle-inventory.csv', rows);
}
function exportSubscribers() {
  downloadCSV('ayurelle-subscribers.csv', [['Email','Status','Source','Subscribed at'], ...subscribers.map(s => [s.email,s.status,s.source,fmtDateTime(s.subscribedAt)])]);
}

function bindEvents() {
  $('[data-login-form]').addEventListener('submit', async event => {
    event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('[type="submit"]');
    if (!configReady()) { setMessage('[data-login-message]', 'Sign-in is not ready yet. Please contact the person who set up your store.', true); return; }
    setBusy(button, true, 'Signing in…'); setMessage('[data-login-message]', 'Checking your credentials…');
    try { await signInWithEmailAndPassword(auth, form.elements.email.value.trim(), form.elements.password.value); setMessage('[data-login-message]', ''); }
    catch (error) { setMessage('[data-login-message]', friendlyAuthError(error), true); }
    finally { setBusy(button, false); }
  });
  $('[data-logout]').addEventListener('click', async () => { closeRealtimeListeners(); await signOut(auth); toast('You have signed out.'); });
  $('[data-refresh]').addEventListener('click', () => renderAll());
  $$('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
  $$('[data-new-product]').forEach(button => button.addEventListener('click', () => fillProductForm()));
  $$('[data-go-inventory]').forEach(button => button.addEventListener('click', () => setView('inventory')));
  $$('[data-go-orders]').forEach(button => button.addEventListener('click', () => setView('orders')));
  $$('[data-go-categories]').forEach(button => button.addEventListener('click', () => setView('categories')));
  $$('[data-go-settings]').forEach(button => button.addEventListener('click', () => setView('settings')));
  $$('[data-close-product]').forEach(button => button.addEventListener('click', () => $('[data-product-dialog]').close()));
  $$('[data-close-order]').forEach(button => button.addEventListener('click', () => $('[data-order-dialog]').close()));
  $$('[data-close-category]').forEach(button => button.addEventListener('click', () => $('[data-category-dialog]').close()));
  $('[data-product-form]').addEventListener('submit', saveProduct);
  $('[data-delete-product]').addEventListener('click', deleteProduct);
  $('[data-category-form]').addEventListener('submit', createCategory);
  $('[data-category-edit-form]').addEventListener('submit', saveCategory);
  $('[data-delete-category]').addEventListener('click', deleteCategory);
  $('[data-settings-form]').addEventListener('submit', saveSettings);
  $('[data-auth-settings-form]').addEventListener('submit', saveSignInDetails);
  $('[data-save-order-status]').addEventListener('click', saveOrderStatus);
  $('[data-sales-period]').addEventListener('change', renderDashboard);
  $('[data-analytics-period]').addEventListener('change', renderAnalytics);
  $('[data-product-search]').addEventListener('input', renderProducts);
  $('[data-product-filter-category]').addEventListener('change', renderProducts);
  $('[data-product-filter-active]').addEventListener('change', renderProducts);
  $('[data-order-search]').addEventListener('input', renderOrders);
  $('[data-order-filter]').addEventListener('change', renderOrders);
  $('[data-payment-filter]').addEventListener('change', renderOrders);
  $('[data-inventory-search]').addEventListener('input', renderInventory);
  $('[data-export-orders]').addEventListener('click', exportOrders);
  $('[data-download-inventory]').addEventListener('click', exportInventory);
  $('[data-export-subscribers]').addEventListener('click', exportSubscribers);
  $('[data-admin-menu]').addEventListener('click', () => { const sidebar = $('[data-admin-sidebar]'); const open = !sidebar.classList.contains('is-open'); sidebar.classList.toggle('is-open', open); document.body.classList.toggle('admin-nav-open', open); $('[data-admin-menu]').setAttribute('aria-expanded', String(open)); });
  $$('[data-admin-view] button[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
  $('[data-product-form]').elements.name.addEventListener('input', event => { if (!editingProductSlug) $('[data-product-form]').elements.slug.value = slugify(event.target.value); });
  $('[data-editor-category]').addEventListener('change', () => { updateSetPickerVisibility(); renderSetContentsPicker(); });
  $('[data-product-form]').elements.useRepositoryImages.addEventListener('change', updateRepositoryImageState);
  $('[data-product-form]').elements.images.addEventListener('input', event => { draftImages = event.target.value.split('\n').map(v => v.trim()).filter(Boolean); renderDraftImages(); });
  $('[data-browse-images]').addEventListener('click', event => { event.stopPropagation(); $('[data-image-file]').click(); });
  $('[data-upload-zone]').addEventListener('click', event => { if (event.target.closest('button') || event.target.matches('input')) return; $('[data-image-file]').click(); });
  $('[data-upload-zone]').addEventListener('keydown', event => { if (['Enter',' '].includes(event.key) && !event.target.matches('button,input')) { event.preventDefault(); $('[data-image-file]').click(); } });
  $('[data-image-file]').addEventListener('change', event => { if (event.target.files?.length) handleImageFiles(event.target.files); event.target.value = ''; });
  const zone = $('[data-upload-zone]');
  zone.addEventListener('dragover', event => { event.preventDefault(); zone.classList.add('is-dragging'); });
  zone.addEventListener('dragleave', event => { if (!zone.contains(event.relatedTarget)) zone.classList.remove('is-dragging'); });
  zone.addEventListener('drop', event => { event.preventDefault(); zone.classList.remove('is-dragging'); if (event.dataTransfer?.files?.length) handleImageFiles(event.dataTransfer.files); });
  zone.addEventListener('paste', event => {
    const items = [...(event.clipboardData?.items || [])];
    const files = items.map(item => item.getAsFile?.()).filter(Boolean);
    if (files.length) { event.preventDefault(); event.stopPropagation(); handleImageFiles(files); return; }
    const text = event.clipboardData?.getData('text/plain') || '';
    const urls = text.split(/\s+/).filter(url => /^https:\/\//i.test(url) && /\.(jpe?g|png|webp|avif)(\?.*)?$/i.test(url));
    if (urls.length) { event.preventDefault(); draftImages.push(...urls); $('[data-use-repo-images]').checked = false; renderDraftImages(); updateRepositoryImageState(); toast(`${urls.length} image URL(s) added. Save to keep them.`); }
  });
  document.addEventListener('paste', event => {
    if (!$('[data-product-dialog]').open || !zone.contains(document.activeElement)) return;
    const files = [...(event.clipboardData?.items || [])].map(item => item.getAsFile?.()).filter(Boolean);
    if (files.length) { event.preventDefault(); handleImageFiles(files); }
  });
  document.addEventListener('keydown', event => {
    if (!['Enter', ' '].includes(event.key)) return;
    const row = event.target.closest('tr.admin-clickable-row');
    if (!row || event.target.closest('button,a,input,select,textarea')) return;
    event.preventDefault();
    if (row.dataset.editProduct) fillProductForm(products.find(product => product.slug === row.dataset.editProduct));
    else if (row.dataset.openOrder) fillOrderDialog(row.dataset.openOrder);
  });
  document.addEventListener('click', event => {
    const edit = event.target.closest('[data-edit-product]'); if (edit) { if (edit.matches('tr') && event.target.closest('button,input,select,textarea,a')) return; fillProductForm(products.find(p => p.slug === edit.dataset.editProduct)); return; }
    const openOrder = event.target.closest('[data-open-order]'); if (openOrder) { fillOrderDialog(openOrder.dataset.openOrder); return; }
    const editCategory = event.target.closest('[data-edit-category]'); if (editCategory) { fillCategoryDialog(editCategory.dataset.editCategory); return; }
    const removeImage = event.target.closest('[data-remove-image]'); if (removeImage) { draftImages.splice(Number(removeImage.dataset.removeImage),1); $('[data-use-repo-images]').checked = draftImages.length === 0; renderDraftImages(); updateRepositoryImageState(); return; }
    const toggleSubscriber = event.target.closest('[data-toggle-subscriber]'); if (toggleSubscriber) { updateDoc(doc(db,'newsletter_subscribers',toggleSubscriber.dataset.toggleSubscriber), { status: toggleSubscriber.dataset.nextStatus, updatedAt: serverTimestamp() }).then(() => toast('Subscription status updated.')).catch(error => toast(error.message,'error')); return; }
    const readMessage = event.target.closest('[data-message-read]'); if (readMessage) { updateDoc(doc(db,'contact_messages',readMessage.dataset.messageRead), { status: 'read', readAt: serverTimestamp() }).then(() => toast('Message marked as read.')).catch(error => toast(error.message,'error')); }
  });
  document.addEventListener('change', async event => {
    const track = event.target.closest('[data-stock-track]');
    if (track) {
      const product = products.find(p => p.slug === track.dataset.stockTrack); if (!product) return;
      try { await updateDoc(doc(db,'products',product.slug), { trackInventory: track.checked, updatedAt: serverTimestamp() }); toast(`${product.name}: inventory tracking ${track.checked ? 'enabled' : 'disabled'}.`); }
      catch (error) { toast(error.message,'error'); }
      return;
    }
    const stock = event.target.closest('[data-stock-value]');
    if (stock) {
      const slug = stock.dataset.stockValue; const value = Math.max(0, Math.floor(Number(stock.value) || 0)); stock.disabled = true;
      try { await updateDoc(doc(db,'products',slug), { stock: value, updatedAt: serverTimestamp() }); toast('Stock quantity updated.'); }
      catch (error) { toast(error.message,'error'); stock.disabled = false; }
      return;
    }
    const threshold = event.target.closest('[data-stock-threshold]');
    if (threshold) {
      const slug = threshold.dataset.stockThreshold; const value = Math.max(0, Math.floor(Number(threshold.value) || 0)); threshold.disabled = true;
      try { await updateDoc(doc(db,'products',slug), { lowStockThreshold: value, updatedAt: serverTimestamp() }); toast('Low-stock alert saved.'); }
      catch (error) { toast(error.message,'error'); threshold.disabled = false; }
    }
  });
  document.addEventListener('click', event => { if (!document.body.classList.contains('admin-nav-open')) return; if ($('[data-admin-sidebar]').contains(event.target) || $('[data-admin-menu]').contains(event.target)) return; $('[data-admin-sidebar]').classList.remove('is-open'); document.body.classList.remove('admin-nav-open'); $('[data-admin-menu]').setAttribute('aria-expanded', 'false'); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { $('[data-admin-sidebar]')?.classList.remove('is-open'); document.body.classList.remove('admin-nav-open'); $('[data-admin-menu]')?.setAttribute('aria-expanded', 'false'); } });
}
function friendlyError(error, fallback = 'We could not complete that change. Please check your connection and try again.') {
  const code = String(error?.code || '');
  if (code.includes('permission-denied') || code.includes('unauthenticated') || code.includes('auth/requires-recent-login')) return 'For your security, please sign in again and retry that change.';
  if (code.includes('network') || /network|offline/i.test(error?.message || '')) return 'Please check your internet connection and try again.';
  if (code.includes('email-already-in-use')) return 'That email address is already linked to another account.';
  if (code.includes('weak-password')) return 'Choose a stronger password with at least 8 characters.';
  if (code.includes('invalid-email')) return 'Please enter a valid email address.';
  return fallback;
}
function friendlyAuthError(error) {
  const code = error?.code || '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found') || code.includes('invalid-login-credentials')) return 'Email or password was not recognised.';
  if (code.includes('too-many-requests')) return 'There have been too many attempts. Please wait a moment and try again.';
  if (code.includes('network-request-failed')) return 'Please check your internet connection and try again.';
  return 'We could not sign you in. Please check your details and try again.';
}

bindEvents();
if (!configReady()) {
  setLoading(false);
  setMessage('[data-login-message]', 'Sign-in is not ready yet. Please contact the person who set up your store.', true);
} else {
  try { await startApp(); }
  catch (error) { console.error('Sign-in service could not start:', error); setLoading(false); setMessage('[data-login-message]', 'We could not open sign-in right now. Please refresh or contact the store owner.', true); }
}
