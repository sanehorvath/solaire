// js/mail.js — Module Mail (stub Microsoft 365)

const Mail = {
  init(user) {
    this.user = user;
    this.render();
  },

  render() {
    const container = document.getElementById('mail-section');
    if (!container) return;

    container.innerHTML = `
      <div class="card" style="margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="font-size:36px">📬</div>
          <div>
            <div style="font-size:15px;font-weight:600;margin-bottom:4px">Intégration Microsoft 365</div>
            <div style="font-size:13px;color:var(--text-muted)">La connexion aux boîtes mail sera activée après configuration de l'API Microsoft Graph.</div>
          </div>
          <div style="margin-left:auto">
            <span class="badge" style="background:var(--orange-dim);color:var(--orange)">⏳ À configurer</span>
          </div>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom:20px">
        <div class="card">
          <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">Boîtes mail configurées</div>
          ${this.renderMailbox('contact@solaire-brand.com', 'Boîte de contact', false)}
          ${this.renderMailbox('sane@solaire-brand.com', 'Sane — Direction', false)}
          ${this.renderMailbox('commercial@solaire-brand.com', 'Équipe commerciale', false)}
        </div>
        <div class="card">
          <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">Étapes d'intégration</div>
          ${this.renderStep(1, 'Acheter domaine @solaire-brand.com', true)}
          ${this.renderStep(2, 'Configurer Microsoft 365 Business', false)}
          ${this.renderStep(3, 'Créer les boîtes mail', false)}
          ${this.renderStep(4, 'Configurer API Microsoft Graph', false)}
          ${this.renderStep(5, 'Connecter au dashboard', false)}
        </div>
      </div>

      <div class="card" style="background:var(--bg3);border-style:dashed">
        <div style="text-align:center;padding:20px">
          <div style="font-size:24px;margin-bottom:8px">🔧</div>
          <div style="font-size:14px;font-weight:500;margin-bottom:6px">Aperçu de l'interface mail</div>
          <div style="font-size:12px;color:var(--text-muted);max-width:400px;margin:0 auto 16px">
            Une fois l'API Microsoft Graph configurée, vous pourrez lire et envoyer des emails directement depuis ce dashboard.
          </div>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <div style="padding:8px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:12px;color:var(--text-muted)">📥 Boîte de réception</div>
            <div style="padding:8px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:12px;color:var(--text-muted)">📤 Envoyés</div>
            <div style="padding:8px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:12px;color:var(--text-muted)">📝 Composer</div>
            <div style="padding:8px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:12px;color:var(--text-muted)">🔍 Rechercher</div>
          </div>
        </div>
      </div>
    `;
  },

  renderMailbox(email, label, connected) {
    return `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
        <div style="width:8px;height:8px;border-radius:50%;background:${connected ? 'var(--green)' : 'var(--text-muted)'};flex-shrink:0"></div>
        <div>
          <div style="font-size:13px;font-weight:500">${email}</div>
          <div style="font-size:11px;color:var(--text-muted)">${label}</div>
        </div>
        <span class="badge ${connected ? 'badge-done' : ''}" style="${!connected ? 'background:rgba(107,114,128,.15);color:var(--text-muted)' : ''};margin-left:auto">
          ${connected ? '✓ Connectée' : 'Non connectée'}
        </span>
      </div>
    `;
  },

  renderStep(num, label, done) {
    return `
      <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="width:22px;height:22px;border-radius:50%;background:${done ? 'var(--green)' : 'var(--bg3)'};
          border:1px solid ${done ? 'var(--green)' : 'var(--border)'};
          display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;
          color:${done ? '#fff' : 'var(--text-muted)'};flex-shrink:0">
          ${done ? '✓' : num}
        </div>
        <span style="font-size:13px;color:${done ? 'var(--text)' : 'var(--text-muted)'}${done ? ';text-decoration:line-through' : ''}">${label}</span>
      </div>
    `;
  }
};
