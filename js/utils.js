// UTILS

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

function showToast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '•'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = 'all .3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function formatCurrency(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n || 0);
}

function setupModalClose(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(modalId); });
}

function initSidebar(currentView, currentUser, navItems) {
  navItems.forEach(item => {
    const el = document.querySelector(`[data-view="${item}"]`);
    if (el) {
      el.addEventListener('click', () => {
        navItems.forEach(v => {
          document.querySelector(`[data-view="${v}"]`)?.classList.remove('active');
          const view = document.getElementById(`view-${v}`);
          if (view) view.classList.remove('active');
        });
        el.classList.add('active');
        const view = document.getElementById(`view-${item}`);
        if (view) view.classList.add('active');
      });
    }
  });
}
