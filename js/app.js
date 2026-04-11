/**
 * APP PRINCIPALE
 * Orchestrate tous les modules
 */

// ─── État des exercices complétés (par date) ──────────────────────────────────
const completedExercises = {};  // { 'YYYY-MM-DD': ['exId', ...] }

function today() {
    return new Date().toISOString().split('T')[0];
}

/** Toggle l'ouverture/fermeture d'une carte exercice */
function toggleEx(id) {
    const el = document.getElementById('ex-' + id);
    if (el) el.classList.toggle('open');
}

/** Toggle l'état "complété" d'un exercice */
function toggleDone(id) {
    const t = today();
    if (!completedExercises[t]) completedExercises[t] = [];
    const arr = completedExercises[t];
    const idx = arr.indexOf(id);
    if (idx > -1) arr.splice(idx, 1); else arr.push(id);
    // Mise à jour visuelle de toutes les occurrences (programme + séance)
    ['ex-', 'sex-'].forEach(prefix => {
        const el = document.getElementById(prefix + id);
        if (el) el.classList.toggle('completed', arr.includes(id));
    });
    // Persist
    try {
        StorageManager.setSetting('completedExercises', JSON.stringify(completedExercises));
    } catch (e) {}
    if (window.app?.renderSeance) window.app.renderSeance();
    if (window.app?.updateHeaderProgress) window.app.updateHeaderProgress();
}

// ─── Timer global (décompte, comme l'app source) ──────────────────────────────
let _timerIv = null, _timerSec = 0, _timerTarget = 0, _timerRunning = false, _timerDown = false;

function setTimer(s, btn) {
    resetTimer();
    _timerTarget = s; _timerSec = s; _timerDown = true;
    _updateTimerDisplay();
    document.getElementById('timerLabel').textContent = 'Prêt — ' + _fmtTimer(s);
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}
function toggleTimer() { _timerRunning ? _pauseTimer() : _startTimer(); }
function _startTimer() {
    _timerRunning = true;
    const btn = document.getElementById('timerStartBtn');
    btn.textContent = 'Pause';
    btn.className = 'timer-btn timer-btn-pause';
    document.getElementById('timerLabel').textContent = 'En cours…';
    document.getElementById('timerDisplay').classList.remove('done');
    _timerIv = setInterval(() => {
        if (_timerDown) {
            _timerSec--;
            if (_timerSec <= 0) {
                _timerSec = 0;
                _pauseTimer();
                document.getElementById('timerLabel').textContent = '✅ Terminé !';
                document.getElementById('timerDisplay').classList.add('done');
                const b = document.getElementById('timerStartBtn');
                b.textContent = 'Démarrer'; b.className = 'timer-btn timer-btn-start';
                if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = ctx.createOscillator(), g = ctx.createGain();
                    osc.connect(g); g.connect(ctx.destination);
                    osc.frequency.value = 880; g.gain.value = 0.3;
                    osc.start(); setTimeout(() => { osc.stop(); ctx.close(); }, 600);
                } catch (e) {}
            }
        } else { _timerSec++; }
        _updateTimerDisplay();
    }, 1000);
}
function _pauseTimer() {
    _timerRunning = false; clearInterval(_timerIv);
    const b = document.getElementById('timerStartBtn');
    b.textContent = 'Reprendre'; b.className = 'timer-btn timer-btn-start';
}
function resetTimer() {
    _pauseTimer();
    _timerSec = _timerTarget || 0; _timerDown = _timerTarget > 0;
    _updateTimerDisplay();
    document.getElementById('timerLabel').textContent = 'Prêt';
    document.getElementById('timerDisplay').classList.remove('done');
    const b = document.getElementById('timerStartBtn');
    b.textContent = 'Démarrer'; b.className = 'timer-btn timer-btn-start';
}
function _updateTimerDisplay() {
    document.getElementById('timerDisplay').textContent = _fmtTimer(_timerSec);
}
function _fmtTimer(s) {
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

const app = {
    currentProgram: null,
    currentPhase: 1,

    /**
     * Initialise l'app
     */
    async init() {
        console.log('Initialisation MonProg v4...');

        this.bindCloudEvents();
        this.registerServiceWorker();

        await SeedManager.seedIfEmpty();
        await this.loadPrograms();
        await this.restoreTheme();
        await this.restoreWorkoutStateFromStorage({ rerender: true });

        if (typeof SyncService !== 'undefined') {
            SyncService.start();
        }

        await this.updateCloudStatus();
        NotificationManager.success('Application prete');
    },

    /**
     * Charge les programmes dans le select
     */
    async loadPrograms() {
        const programs = await StorageManager.getPrograms();
        const select = document.getElementById('programSelect');
        const current = select.value;

        select.innerHTML = '<option value="">Sélectionner un programme...</option>';
        programs.forEach(prog => {
            const opt = document.createElement('option');
            opt.value = prog.id;
            opt.textContent = prog.name;
            select.appendChild(opt);
        });

        // Restaure la sélection
        if (current) select.value = current;
        const savedProg = await StorageManager.getSetting('currentProgram');
        if (savedProg && !current) {
            select.value = savedProg;
            if (select.value) await this.selectProgram(savedProg);
        }
    },

    /**
     * Sélectionne un programme
     */
    async updateHeaderProgress() {
        const subtitle = document.getElementById('headerSubtitle');
        const progressFill = document.getElementById('progressFill');
        const progressTxt = document.getElementById('progressTxt');
        if (!subtitle || !progressFill || !progressTxt) return;

        const defaultSubtitle = subtitle.dataset.defaultText || subtitle.textContent || 'Programme';
        if (!subtitle.dataset.defaultText) subtitle.dataset.defaultText = defaultSubtitle;

        if (!this.currentProgram) {
            subtitle.textContent = defaultSubtitle;
            progressFill.style.width = '0%';
            progressTxt.textContent = '0% du programme';
            return;
        }

        const prog = this.currentProgram;
        subtitle.textContent = prog.description || prog.goal || prog.name || 'Programme en cours';

        const phases = Array.isArray(prog.phases) ? prog.phases : [];
        const phaseSets = [];
        for (const ph of phases) {
            const exercises = await StorageManager.getExercisesByPhase(prog.id, ph.id);
            if (exercises.length) phaseSets.push(exercises.map(ex => ex.id));
        }

        const duration = parseInt(prog.duration, 10);
        const sessionsPerWeek = parseInt(prog.sessionsPerWeek || 0, 10);
        const estimatedSessions = duration > 0 && sessionsPerWeek > 0 ? duration * sessionsPerWeek : 0;
        const totalSessions = estimatedSessions || phaseSets.length || 1;

        const completedSessions = Object.values(completedExercises).reduce((count, done) => {
            if (!Array.isArray(done) || !done.length) return count;
            const hasCompleteSession = phaseSets.some(exerciseIds =>
                exerciseIds.length && exerciseIds.every(exerciseId => done.includes(exerciseId))
            );
            return count + (hasCompleteSession ? 1 : 0);
        }, 0);

        const pct = Math.min(100, Math.round((completedSessions / totalSessions) * 100));
        progressFill.style.width = pct + '%';
        progressTxt.textContent = pct + '% du programme';
    },

    /**
     * Selectionne un programme
     */
    async selectProgram(programId) {
        if (!programId) {
            this.currentProgram = null;
            document.getElementById('programmeContainer').innerHTML = '<div class="empty-state">Selectionnez un programme</div>';
            document.getElementById('seanceInfo').innerHTML = '';
            document.getElementById('seanceExercises').innerHTML = '';
            const rotationBanner = document.getElementById('rotationBanner');
            if (rotationBanner) rotationBanner.style.display = 'none';
            const seanceDone = document.getElementById('seanceDone');
            if (seanceDone) seanceDone.style.display = 'none';
            await this.updateHeaderProgress();
            return;
        }
        this.currentProgram = await StorageManager.getProgram(programId);
        await StorageManager.setSetting('currentProgram', programId);
        await this.renderProgram();
        await this.renderSeance();
    },

    /**
     * Affiche le programme complet (onglet Programme)
     */
    async renderProgram() {
        if (!this.currentProgram) return;
        const prog = this.currentProgram;
        const container = document.getElementById('programmeContainer');
        const done = completedExercises[today()] || [];

        // Disclaimer si nécessaire
        const disc = document.getElementById('disclaimer');
        if (disc) disc.style.display = prog.disclaimer ? 'block' : 'none';

        let html = '';
        const phases = prog.phases || [];
        for (const ph of phases) {
            const col = ph.color || '#0891B2';
            const exercises = await StorageManager.getExercisesByPhase(prog.id, ph.id);
            html += `<div style="margin-bottom:28px">
                <span class="phase-badge" style="background:${col}">Phase ${ph.id} — Semaines ${ph.weeks || ''}</span>
                <div class="card">
                    <div class="card-title">${ph.name}</div>
                    <div class="card-body">
                        ${ph.description ? ph.description + '<br>' : ''}
                        ${ph.frequency ? `<b>Fréquence :</b> ${ph.frequency}` : ''}
                        ${ph.rule ? `<br><b>Règle d'or :</b> ${ph.rule}` : ''}
                    </div>
                </div>`;
            if (!exercises.length) {
                html += `<div class="card empty-state">Exercices à venir…</div>`;
            } else {
                exercises.forEach(ex => {
                    html += ExerciseManager.generateExerciseHTML(ex, done.includes(ex.id));
                });
            }
            html += '</div>';
        }
        container.innerHTML = html;
    },

    /**
     * Affiche les exercices de la phase active (onglet Séance)
     */
    async renderSeance() {
        if (!this.currentProgram) return;
        const prog = this.currentProgram;
        const phases = prog.phases || [];

        // Boutons de sélection de phase
        const phaseBtns = document.getElementById('phaseBtns');
        if (phaseBtns) {
            phaseBtns.innerHTML = phases.map(ph =>
                `<button class="phase-btn${ph.id === this.currentPhase ? ' active' : ''}"
                    onclick="app.setPhase(${ph.id})">${ph.id === 1 ? 'A' : ph.id === 2 ? 'B' : ph.id === 3 ? 'C' : 'Phase ' + ph.id}</button>`
            ).join('');
        }

        const ph = phases.find(p => p.id === this.currentPhase) || phases[0];
        if (!ph) return;

        const col = ph.color || '#0891B2';
        const exercises = await StorageManager.getExercisesByPhase(prog.id, ph.id);
        const done = completedExercises[today()] || [];
        const completedCount = exercises.filter(ex => done.includes(ex.id)).length;

        // Info séance
        const seanceInfo = document.getElementById('seanceInfo');
        if (seanceInfo) {
            seanceInfo.innerHTML = `
                <div class="card" style="border-left:4px solid ${col}">
                    <div class="card-title">${ph.name}</div>
                    <div class="card-body">
                        ${ph.description ? ph.description + '<br>' : ''}
                        ${ph.frequency ? `<b>Fréquence :</b> ${ph.frequency}` : ''}
                        ${ph.rule ? `<br><b>Règle :</b> ${ph.rule}` : ''}
                    </div>
                </div>
                <div class="session-summary-grid">
                    <div class="micro-stat"><div class="micro-stat-value">${completedCount}/${exercises.length}</div><div class="micro-stat-label">Exercices cochés</div></div>
                    <div class="micro-stat"><div class="micro-stat-value">${prog.duration || '—'} sem.</div><div class="micro-stat-label">Durée programme</div></div>
                </div>`;
        }

        // Exercices
        const exContainer = document.getElementById('seanceExercises');
        if (exContainer) {
            if (!exercises.length) {
                exContainer.innerHTML = '<div class="empty-state">Aucun exercice pour cette phase</div>';
            } else {
                let html = '';
                exercises.forEach(ex => {
                    // En séance : détails toujours ouverts (classe 'open' par défaut)
                    const card = ExerciseManager.generateExerciseHTML(ex, done.includes(ex.id));
                    html += card.replace('id="ex-', 'id="sex-').replace('onclick="toggleEx(', 'onclick="toggleSeanceEx(');
                });
                exContainer.innerHTML = html;
                // Ouvrir tous les exercices dans la vue séance
                exContainer.querySelectorAll('.exercise').forEach(el => el.classList.add('open'));
            }
            // Vérifie si séance terminée
            this.checkSeanceDone(exercises, done);
        }

        // Rotation banner
        this.renderRotationBanner();
        await this.updateHeaderProgress();
    },

    setPhase(n) {
        this.currentPhase = n;
        StorageManager.setSetting('currentPhase', n);
        this.renderSeance();
    },

    checkSeanceDone(exercises, done) {
        const el = document.getElementById('seanceDone');
        if (!el) return;
        if (!exercises.length) {
            el.style.display = 'none';
            return;
        }
        const allDone = exercises.every(ex => done.includes(ex.id));
        el.style.display = allDone ? 'block' : 'none';
    },

    renderRotationBanner() {
        const c = document.getElementById('rotationBanner');
        if (!c || !this.currentProgram) { if (c) c.style.display = 'none'; return; }
        const phases = this.currentProgram.phases || [];
        if (phases.length < 2) { c.style.display = 'none'; return; }
        const labels = ['A', 'B', 'C', 'D', 'E'];
        const cur = phases.find(p => p.id === this.currentPhase) || phases[0];
        const nextId = (cur.id % phases.length) + 1;
        const next = phases.find(p => p.id === nextId) || phases[0];
        const curLabel = labels[(cur.id - 1) % labels.length];
        const nextLabel = labels[(next.id - 1) % labels.length];
        c.style.display = 'flex';
        c.innerHTML = `
            <div class="rotation-badge">${curLabel}</div>
            <div class="rotation-info">
                <div class="rotation-label">Séance en cours</div>
                <div class="rotation-title">${cur.name}</div>
                <div class="rotation-sub">Prochaine : <b>Séance ${nextLabel}</b></div>
            </div>
            <button onclick="app.setPhase(${nextId})" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:white;border-radius:8px;padding:8px 12px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap">→ ${nextLabel}</button>`;
    },

    /**
     * Affiche une section
     */
    showSection(sectionId, button) {
        document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
        document.getElementById(`section-${sectionId}`).classList.add('active');
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        if (button) button.classList.add('active');
        if (sectionId === 'suivi') this.renderSuivi();
        if (sectionId === 'admin') {
            this.renderAdmin();
            this.updateCloudStatus();
        }
    },

    /**
     * Toggle du thème sombre
     */
    async toggleTheme() {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';

        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        await StorageManager.setSetting('theme', isDark ? 'light' : 'dark');

        NotificationManager.info(isDark ? '☀️ Mode clair' : '🌙 Mode sombre');
    },

    /**
     * Restaure le thème
     */
    async restoreTheme() {
        const theme = await StorageManager.getSetting('theme', 'light');
        document.documentElement.setAttribute('data-theme', theme);
    },

    bindCloudEvents() {
        if (this._cloudEventsBound) return;
        this._cloudEventsBound = true;
        window.addEventListener('cloud-auth-changed', async () => { await this.updateCloudStatus(); });
        window.addEventListener('cloud-sync-complete', async () => { await this.restoreWorkoutStateFromStorage({ rerender: true }); await this.updateCloudStatus(); });
        window.addEventListener('online', () => this.updateCloudStatus());
        window.addEventListener('offline', () => this.updateCloudStatus());
    },

    async restoreWorkoutStateFromStorage(options = {}) {
        const rerender = !!options.rerender;
        try {
            const saved = await StorageManager.getSetting('completedExercises');
            Object.keys(completedExercises).forEach(key => delete completedExercises[key]);
            if (saved) Object.assign(completedExercises, JSON.parse(saved));
        } catch (err) {
            console.warn('restoreWorkoutStateFromStorage.completedExercises:', err);
        }
        const savedPhase = parseInt(await StorageManager.getSetting('currentPhase', 1), 10);
        this.currentPhase = Number.isFinite(savedPhase) && savedPhase > 0 ? savedPhase : 1;
        const savedProgram = await StorageManager.getSetting('currentProgram');
        const select = document.getElementById('programSelect');
        if (savedProgram && select) select.value = savedProgram;
        this.currentProgram = savedProgram ? await StorageManager.getProgram(savedProgram) : null;
        if (rerender) {
            if (this.currentProgram) {
                await this.renderProgram();
                await this.renderSeance();
            }
            this.renderSuivi();
        }
        await this.updateHeaderProgress();
    },

    async updateCloudStatus() {
        const badge = document.getElementById('cloudStatusBadge');
        const userLabel = document.getElementById('cloudUserLabel');
        const note = document.getElementById('cloudSyncNote');
        const googleBtn = document.getElementById('cloudGoogleBtn');
        const syncBtn = document.getElementById('cloudSyncBtn');
        const signOutBtn = document.getElementById('cloudSignOutBtn');
        const status = typeof FirebaseManager !== 'undefined' && FirebaseManager.getAuthStatus ? FirebaseManager.getAuthStatus() : { configured: false, initialized: false, online: navigator.onLine, user: null };
        if (badge) { badge.style.display = 'inline-flex'; badge.style.alignItems = 'center'; badge.style.gap = '6px'; badge.style.padding = '6px 10px'; badge.style.borderRadius = '999px'; badge.style.fontSize = '11px'; badge.style.fontWeight = '800'; badge.style.textTransform = 'uppercase'; badge.style.letterSpacing = '0.3px'; }
        if (!status.configured) {
            if (badge) { badge.textContent = 'Cloud indisponible'; badge.style.background = '#fee2e2'; badge.style.color = '#b91c1c'; }
            if (userLabel) userLabel.textContent = 'Firebase non configure';
            if (note) note.textContent = 'Renseignez la configuration Firebase pour activer la synchronisation smartphone.';
            if (googleBtn) googleBtn.style.display = 'none';
            if (syncBtn) syncBtn.disabled = true;
            if (signOutBtn) signOutBtn.style.display = 'none';
            return;
        }
        if (status.user && !status.user.isAnonymous) {
            if (badge) { badge.textContent = status.online ? 'Cloud connecte' : 'Cloud hors ligne'; badge.style.background = status.online ? '#dcfce7' : '#fef3c7'; badge.style.color = status.online ? '#166534' : '#92400e'; }
            if (userLabel) userLabel.textContent = status.user.email || status.user.displayName || status.user.uid;
            if (note) note.textContent = status.online ? 'Utilisez le meme compte Google sur PC et smartphone. La synchronisation automatique tourne toutes les 30 secondes et au retour reseau.' : 'Hors ligne: les donnees restent en local et repartiront vers le cloud au retour reseau.';
            if (googleBtn) googleBtn.style.display = 'none';
            if (syncBtn) syncBtn.disabled = !status.online;
            if (signOutBtn) signOutBtn.style.display = 'inline-flex';
            return;
        }
        if (badge) { badge.textContent = 'Mode local'; badge.style.background = '#e0f2fe'; badge.style.color = '#0c4a6e'; }
        if (userLabel) userLabel.textContent = 'Connectez Google pour partager la progression';
        if (note) note.textContent = 'Sans connexion Google, les seances restent sur cet appareil uniquement. Utilisez le meme compte Google sur tous vos appareils pour la salle de sport.';
        if (googleBtn) googleBtn.style.display = 'inline-flex';
        if (syncBtn) syncBtn.disabled = true;
        if (signOutBtn) signOutBtn.style.display = 'none';
    },

    async connectGoogle() { if (typeof FirebaseManager === 'undefined') return; await FirebaseManager.signInWithGoogle(); },
    async disconnectCloud() { if (typeof FirebaseManager === 'undefined') return; await FirebaseManager.signOut(); await this.updateCloudStatus(); },
    async manualCloudSync() { if (typeof SyncService !== 'undefined') { await SyncService.fullSync(); } else if (typeof FirebaseManager !== 'undefined') { await FirebaseManager.syncToCloud(); await FirebaseManager.syncFromCloud(); } await this.updateCloudStatus(); },
    registerServiceWorker() {
        if (this._serviceWorkerRegistered) return;
        this._serviceWorkerRegistered = true;
        if (!('serviceWorker' in navigator)) return;

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });

        navigator.serviceWorker.register('service-worker.js').then(registration => {
            const activateWaitingWorker = () => {
                if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                }
            };

            if (registration.waiting) activateWaitingWorker();

            registration.addEventListener('updatefound', () => {
                const installing = registration.installing;
                if (!installing) return;
                installing.addEventListener('statechange', () => {
                    if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                        activateWaitingWorker();
                    }
                });
            });

            registration.update().catch(err => {
                console.warn('Mise a jour du service worker impossible:', err);
            });
        }).catch(err => {
            console.warn('Service worker non enregistre:', err);
        });
    },

    /**
     * Rendu page Suivi
     */
    async renderSuivi() {
        const today = new Date().toISOString().split('T')[0];
        const allProgress = await StorageManager.getAllProgress?.() || [];
        const sessions = new Set(allProgress.map(p => p.date)).size;
        const el = s => document.getElementById(s);
        if (el('statSessions')) el('statSessions').textContent = sessions;
        // Calendrier
        this.renderCalendar(allProgress);
    },

    renderCalendar(progressList) {
        const cal = document.getElementById('calendar');
        if (!cal) return;
        const now = new Date();
        const y = now.getFullYear(), m = now.getMonth();
        const firstDay = new Date(y, m, 1);
        const lastDay = new Date(y, m + 1, 0);
        const t = today();
        const activeDates = new Set((progressList || []).map(p => p.date));
        let html = ['L','M','M','J','V','S','D'].map(d => `<div class="cal-head">${d}</div>`).join('');
        let start = firstDay.getDay() - 1; if (start < 0) start = 6;
        for (let i = 0; i < start; i++) html += `<div class="cal-day empty"></div>`;
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const cls = ['cal-day', activeDates.has(ds) ? 'done' : '', ds === t ? 'today' : ''].join(' ');
            html += `<div class="${cls}">${d}</div>`;
        }
        cal.innerHTML = html;
    },

    /**
     * Rendu page Admin
     */
    async renderAdmin() {
        const list = document.getElementById('adminExList');
        const progName = document.getElementById('adminProgName');
        if (!this.currentProgram) {
            if (list) list.innerHTML = '<div class="empty-state">Aucun programme actif</div>';
            return;
        }
        if (progName) progName.textContent = this.currentProgram.name;
        const phases = this.currentProgram.phases || [];
        let html = '';
        for (const ph of phases) {
            const exercises = await StorageManager.getExercisesByPhase(this.currentProgram.id, ph.id);
            html += `<div style="margin-bottom:14px">
                <div style="font-size:11px;font-weight:800;text-transform:uppercase;color:var(--text-light);margin-bottom:6px">Phase ${ph.id} — ${ph.name}</div>`;
            exercises.forEach(ex => {
                html += `<div class="ex-row"><span>${ex.name}</span></div>`;
            });
            html += '</div>';
        }
        if (list) list.innerHTML = html || '<div class="empty-state">Aucun exercice</div>';
        const cnt = document.getElementById('adminProgCount');
        if (cnt) cnt.textContent = phases.reduce((acc, ph) => acc, 0);
    },

    /**
     * Réinitialise toutes les données
     */
    async resetAll() {
        if (!confirm('⚠️ Réinitialiser TOUTES les données ? Cette action est irréversible.')) return;
        await db.delete();
        location.reload();
    },

    refreshStats() {
        this.renderSuivi();
    }
};

// Fonctions globales pour l'onglet Séance (exercices ouverts par défaut)
function toggleSeanceEx(id) {
    const el = document.getElementById('sex-' + id);
    if (el) el.classList.toggle('open');
}

// Initialise quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
