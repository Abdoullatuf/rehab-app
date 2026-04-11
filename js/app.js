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
async function toggleDone(id) {
    const t = today();
    if (!completedExercises[t]) completedExercises[t] = [];
    const arr = completedExercises[t];
    const idx = arr.indexOf(id);
    if (idx > -1) arr.splice(idx, 1); else arr.push(id);
    const isDone = arr.includes(id);
    // Mise a jour visuelle de toutes les occurrences (programme + seance)
    ['ex-', 'sex-'].forEach(prefix => {
        const el = document.getElementById(prefix + id);
        if (el) el.classList.toggle('completed', isDone);
    });
    // Persist
    try {
        await StorageManager.setSetting('completedExercises', JSON.stringify(completedExercises));
    } catch (e) {}
    if (window.app?.renderSeance) await window.app.renderSeance();
    if (window.app?.updateHeaderProgress) await window.app.updateHeaderProgress();
    if (window.app?.syncExerciseProgress) await window.app.syncExerciseProgress(id, isDone);
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

    async syncExerciseProgress(exerciseId, isDone) {
        const date = today();
        const recordId = `${exerciseId}_${date}`;
        try {
            if (!isDone) {
                await db.progress.delete(recordId);
                if (StorageManager.addToSyncQueue) {
                    await StorageManager.addToSyncQueue('progress', 'delete', { id: recordId, exerciseId, date });
                }
            } else {
                const summary = this.summarizeSeriesData(SeriesTracker.getSeriesData ? SeriesTracker.getSeriesData(exerciseId, date) : null);
                const record = {
                    id: recordId,
                    exerciseId,
                    date,
                    timestamp: Date.now(),
                    sets: summary.totalSets || 0,
                    completedSets: summary.completedSets || 0,
                    reps: summary.maxReps || 0,
                    totalReps: summary.totalReps || 0,
                    weight: summary.maxLoad || 0,
                    totalVolume: summary.totalVolume || 0
                };
                await db.progress.put(record);
                if (StorageManager.addToSyncQueue) {
                    await StorageManager.addToSyncQueue('progress', 'update', { ...record, updatedAt: Date.now() });
                }
            }
        } catch (err) {
            console.warn('syncExerciseProgress:', err);
        }

        const suiviPane = document.getElementById('section-suivi');
        if (suiviPane && suiviPane.classList.contains('active')) {
            await this.renderSuivi();
        }
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
    ensureSuiviLayout() {
        const pane = document.getElementById('section-suivi');
        if (!pane) return null;
        if (!pane.dataset.enhancedSuivi) {
            this.destroySuiviCharts();
            pane.innerHTML = `
                <div class="section-title">📊 Suivi & Progression</div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📅</div>
                        <div class="stat-value" id="statSessions">0</div><div class="stat-label">Séances</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-value" id="statStreak">0</div><div class="stat-label">Streak (Jours)</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">✅</div>
                        <div class="stat-value" id="statExercisesDone">0</div><div class="stat-label">Exercices Validés</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📈</div>
                        <div class="stat-value" id="statVolume">0</div><div class="stat-label">Volume Total (kg)</div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">Calendrier d'activité</div>
                    <div class="cal-grid" id="calendar"></div>
                    <div style="display:flex;justify-content:flex-end;gap:4px;margin-top:8px;font-size:10px;color:var(--text-light);align-items:center;">
                        Moins <div class="cal-day" style="width:12px;height:12px;border-radius:2px"></div>
                        <div class="cal-day heat-1" style="width:12px;height:12px;border-radius:2px"></div>
                        <div class="cal-day heat-2" style="width:12px;height:12px;border-radius:2px"></div>
                        <div class="cal-day heat-3" style="width:12px;height:12px;border-radius:2px"></div> Plus
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">Répartition Musculaire</div>
                    <div class="card-body" id="suiviZonesMeta">Analyse de l'équilibre du travail sur les groupes musculaires.</div>
                    
                    <!-- Radar Canvas -->
                    <div style="position:relative;height:250px;margin:16px 0"><canvas id="suiviRadarChart" aria-label="Graphique radar d'equilibre musculaire"></canvas></div>
                </div>
                <div style="display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:12px">
                    <div class="card" style="margin-bottom:0">
                        <div class="card-title">Regularite sur 14 jours</div>
                        <div style="position:relative;height:220px;margin-top:12px"><canvas id="suiviSessionsChart" aria-label="Graphique des seances recentes"></canvas></div>
                    </div>
                    <div class="card" style="margin-bottom:0">
                        <div class="card-title">Charge / effort par seance</div>
                        <div style="position:relative;height:220px;margin-top:12px"><canvas id="suiviVolumeChart" aria-label="Graphique du volume par seance"></canvas></div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">Historique recent</div>
                    <div class="card-body" id="suiviHistoryMeta">Aucune seance enregistree pour le moment.</div>
                    <div id="suiviHistory"></div>
                </div>`;
            pane.dataset.enhancedSuivi = 'true';
        }
        return pane;
    },

    escapeHtml(value) {
        const div = document.createElement('div');
        div.textContent = value == null ? '' : String(value);
        return div.innerHTML;
    },

    parseSuiviDate(dateStr) {
        if (!dateStr || typeof dateStr !== 'string') return null;
        const parts = dateStr.split('-').map(part => parseInt(part, 10));
        if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
        return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0);
    },

    formatSuiviDate(dateStr, options = { day: '2-digit', month: 'short' }) {
        const date = this.parseSuiviDate(dateStr);
        if (!date) return dateStr || '';
        return date.toLocaleDateString('fr-FR', options);
    },

    formatCompactNumber(value) {
        const num = Number(value || 0);
        if (!Number.isFinite(num) || num <= 0) return '0';
        if (num >= 10000) return Math.round(num / 1000) + 'k';
        if (num >= 1000) return (Math.round(num / 100) / 10) + 'k';
        return String(Math.round(num));
    },

    summarizeSeriesData(data) {
        const summary = {
            hasActivity: false,
            totalSets: 0,
            completedSets: 0,
            totalReps: 0,
            totalVolume: 0,
            maxLoad: 0,
            maxReps: 0
        };
        if (!data || !Array.isArray(data.sets)) return summary;

        data.sets.forEach(set => {
            const repsRaw = set && set.reps != null ? String(set.reps).trim() : '';
            const loadRaw = set && set.charge != null ? String(set.charge).trim() : '';
            const restRaw = set && set.repos != null ? String(set.repos).trim() : '';
            const done = !!(set && set.done);
            const hasValues = repsRaw !== '' || loadRaw !== '' || restRaw !== '';
            if (!hasValues && !done) return;

            const reps = Number.parseFloat(repsRaw) || 0;
            const load = Number.parseFloat(loadRaw) || 0;

            summary.hasActivity = true;
            summary.totalSets += 1;
            if (done) summary.completedSets += 1;
            summary.totalReps += reps;
            summary.totalVolume += reps * load;
            summary.maxLoad = Math.max(summary.maxLoad, load);
            summary.maxReps = Math.max(summary.maxReps, reps);
        });

        return summary;
    },

    getRelevantExercises(allExercises = []) {
        if (!this.currentProgram) return allExercises || [];
        return (allExercises || []).filter(exercise => exercise.programId === this.currentProgram.id);
    },

﻿
    normalizeText(value) {
        return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    },

    zoneDefinitions() {
        return [
            { id: 'shoulders', label: 'Epaules' },
            { id: 'chest', label: 'Pectoraux' },
            { id: 'biceps', label: 'Biceps' },
            { id: 'triceps', label: 'Triceps' },
            { id: 'forearms', label: 'Avant-bras' },
            { id: 'upperBack', label: 'Haut du dos' },
            { id: 'lowerBack', label: 'Bas du dos' },
            { id: 'core', label: 'Abdos / tronc' },
            { id: 'glutes', label: 'Fessiers' },
            { id: 'quads', label: 'Quadriceps' },
            { id: 'hamstrings', label: 'Ischios' },
            { id: 'calves', label: 'Mollets' }
        ];
    },

    mapExplicitZone(label) {
        const text = this.normalizeText(label);
        const found = new Set();
        [
            [['epaule', 'deltoide'], ['shoulders']],
            [['pector', 'chest'], ['chest']],
            [['biceps'], ['biceps']],
            [['triceps'], ['triceps']],
            [['avant-bras', 'avant bras', 'forearm'], ['forearms']],
            [['haut du dos', 'dors', 'omoplate', 'trap'], ['upperBack']],
            [['lomb', 'bas du dos'], ['lowerBack']],
            [['abdo', 'tronc', 'core', 'oblique', 'gainage'], ['core']],
            [['fess', 'glute'], ['glutes']],
            [['quadriceps', 'quadri'], ['quads']],
            [['ischio', 'hamstring'], ['hamstrings']],
            [['mollet', 'calf'], ['calves']]
        ].forEach(([tokens, zones]) => {
            if (tokens.some(token => text.includes(token))) zones.forEach(zone => found.add(zone));
        });
        return [...found];
    },

    inferExerciseZones(exercise) {
        if (!exercise) return [];
        const explicit = [];
        if (Array.isArray(exercise.zones)) explicit.push(...exercise.zones);
        if (Array.isArray(exercise.targetMuscles)) explicit.push(...exercise.targetMuscles);
        const mapped = new Set();
        explicit.forEach(label => this.mapExplicitZone(label).forEach(zone => mapped.add(zone)));
        if (mapped.size) return [...mapped];

        const text = this.normalizeText([
            exercise.name,
            exercise.purpose,
            exercise.meta,
            ...(Array.isArray(exercise.steps) ? exercise.steps : [])
        ].join(' '));
        const found = new Set();
        [
            [['pompe', 'pushup', 'developpe', 'bench press', 'chest press'], ['chest', 'shoulders', 'triceps']],
            [['rowing', 'tirage', 'traction', 'pullup', 'pull up', 'lat pulldown', 'poulie'], ['upperBack', 'biceps']],
            [['elevation laterale', 'elevations laterales', 'epaules', 'deltoide'], ['shoulders']],
            [['curl biceps', 'biceps curl', 'curl'], ['biceps']],
            [['triceps', 'dips'], ['triceps']],
            [['squat', 'leg press', 'presse', 'hack squat', 'fente', 'split squat'], ['quads', 'glutes']],
            [['leg curl', 'ischio', 'nordic'], ['hamstrings']],
            [['hip thrust', 'pont fessier', 'glute bridge'], ['glutes', 'hamstrings']],
            [['souleve de terre', 'deadlift'], ['lowerBack', 'glutes', 'hamstrings']],
            [['planche', 'gainage', 'pallof', 'abdo', 'core', 'tronc', 'oblique'], ['core']],
            [['mollet', 'calf'], ['calves']],
            [['bird dog'], ['core', 'lowerBack']],
            [['cardio', 'velo', 'elliptique'], ['quads', 'calves', 'core']]
        ].forEach(([tokens, zones]) => {
            if (tokens.some(token => text.includes(token))) zones.forEach(zone => found.add(zone));
        });
        return [...found];
    },

    buildZoneStats(sessions, exerciseMap) {
        const stats = this.zoneDefinitions().map(zone => ({ ...zone, score: 0 }));
        const byId = new Map(stats.map(zone => [zone.id, zone]));
        sessions.slice(0, 12).forEach(session => {
            session.exercises.forEach(metric => {
                const zones = this.inferExerciseZones(exerciseMap.get(metric.exerciseId));
                const weight = Math.max(metric.completedSets || 0, metric.totalSets || 0, metric.done ? 1 : 0);
                if (!weight) return;
                zones.forEach(zoneId => {
                    const zone = byId.get(zoneId);
                    if (zone) zone.score += weight;
                });
            });
        });
        const maxScore = Math.max(...stats.map(zone => zone.score), 0) || 1;
        return stats.map(zone => ({ ...zone, intensity: zone.score / maxScore }));
    },

    getZoneColor(zone) {
        if (!zone || zone.score <= 0) return 'rgba(148,163,184,0.18)';
        if (zone.intensity >= 0.75) return '#10b981';
        if (zone.intensity >= 0.45) return '#22c55e';
        if (zone.intensity >= 0.2) return '#f59e0b';
        return '#f97316';
    },


    createSuiviSession(date) {
        return { date, exercises: new Map() };
    },

    getSuiviMetric(session, exerciseId, exerciseMap) {
        if (!session.exercises.has(exerciseId)) {
            const exercise = exerciseMap.get(exerciseId);
            session.exercises.set(exerciseId, {
                exerciseId,
                name: exercise && exercise.name ? exercise.name : 'Exercice',
                done: false,
                totalSets: 0,
                completedSets: 0,
                totalReps: 0,
                totalVolume: 0,
                maxLoad: 0,
                sourceNotes: false,
                sourceProgress: false,
                sourceCompleted: false
            });
        }
        return session.exercises.get(exerciseId);
    },

    buildSuiviSessions({ completedMap, progressList, noteRows, exerciseMap, scopedExerciseIds }) {
        const sessions = new Map();
        const inScope = exerciseId => !scopedExerciseIds.size || scopedExerciseIds.has(exerciseId);
        const ensureSession = date => {
            if (!sessions.has(date)) sessions.set(date, this.createSuiviSession(date));
            return sessions.get(date);
        };

        Object.entries(completedMap || {}).forEach(([date, exerciseIds]) => {
            (exerciseIds || []).forEach(exerciseId => {
                if (!exerciseId || !inScope(exerciseId)) return;
                const metric = this.getSuiviMetric(ensureSession(date), exerciseId, exerciseMap);
                metric.done = true;
                metric.sourceCompleted = true;
            });
        });

        (noteRows || []).forEach(note => {
            if (!note || !note.exerciseId || !note.date || !inScope(note.exerciseId)) return;
            let parsed = null;
            try {
                parsed = note.data ? JSON.parse(note.data) : null;
            } catch (err) {
                return;
            }
            const summary = this.summarizeSeriesData(parsed);
            if (!summary.hasActivity) return;
            const metric = this.getSuiviMetric(ensureSession(note.date), note.exerciseId, exerciseMap);
            metric.sourceNotes = true;
            metric.totalSets = Math.max(metric.totalSets, summary.totalSets);
            metric.completedSets = Math.max(metric.completedSets, summary.completedSets);
            metric.totalReps = Math.max(metric.totalReps, summary.totalReps);
            metric.totalVolume = Math.max(metric.totalVolume, summary.totalVolume);
            metric.maxLoad = Math.max(metric.maxLoad, summary.maxLoad);
            if (summary.completedSets > 0) metric.done = true;
        });

        (progressList || []).forEach(progress => {
            if (!progress || !progress.exerciseId || !progress.date || !inScope(progress.exerciseId)) return;
            const metric = this.getSuiviMetric(ensureSession(progress.date), progress.exerciseId, exerciseMap);
            metric.sourceProgress = true;
            metric.done = true;
            if (!metric.sourceNotes) {
                metric.totalSets = Math.max(metric.totalSets, Number(progress.completedSets ?? progress.sets ?? 0) || 0);
                metric.completedSets = Math.max(metric.completedSets, Number(progress.completedSets ?? progress.sets ?? 0) || 0);
                metric.totalReps = Math.max(metric.totalReps, Number(progress.totalReps ?? progress.reps ?? 0) || 0);
                metric.totalVolume = Math.max(metric.totalVolume, Number(progress.totalVolume ?? 0) || 0);
            }
            metric.maxLoad = Math.max(metric.maxLoad, Number(progress.weight || 0) || 0);
        });

        return Array.from(sessions.values()).map(session => {
            const exercises = Array.from(session.exercises.values())
                .filter(metric => metric.done || metric.sourceNotes || metric.sourceProgress || metric.sourceCompleted)
                .sort((a, b) => (Number(b.done) - Number(a.done)) || (b.totalVolume - a.totalVolume) || a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));

            const totals = exercises.reduce((acc, metric) => {
                acc.exerciseCount += 1;
                acc.completedCount += metric.done ? 1 : 0;
                acc.totalSets += metric.totalSets;
                acc.completedSets += metric.completedSets;
                acc.totalReps += metric.totalReps;
                acc.totalVolume += metric.totalVolume;
                acc.maxLoad = Math.max(acc.maxLoad, metric.maxLoad);
                return acc;
            }, { exerciseCount: 0, completedCount: 0, totalSets: 0, completedSets: 0, totalReps: 0, totalVolume: 0, maxLoad: 0 });

            return {
                date: session.date,
                exercises,
                exerciseCount: totals.exerciseCount,
                completedCount: totals.completedCount,
                totalSets: totals.totalSets,
                completedSets: totals.completedSets,
                totalReps: totals.totalReps,
                totalVolume: Math.round(totals.totalVolume),
                maxLoad: totals.maxLoad,
                tracked: exercises.some(metric => metric.sourceNotes || metric.sourceProgress)
            };
        }).sort((a, b) => b.date.localeCompare(a.date));
    },

    calculateCurrentStreak(sessions) {
        if (!sessions.length) return 0;
        const uniqueDates = [...new Set(sessions.map(session => session.date))].sort((a, b) => b.localeCompare(a));
        const latest = uniqueDates[0];
        const todayStr = today();
        const yesterdayDate = this.parseSuiviDate(todayStr);
        if (!yesterdayDate) return 0;
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayStr = [
            yesterdayDate.getFullYear(),
            String(yesterdayDate.getMonth() + 1).padStart(2, '0'),
            String(yesterdayDate.getDate()).padStart(2, '0')
        ].join('-');
        if (latest !== todayStr && latest !== yesterdayStr) return 0;

        let streak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
            const previous = this.parseSuiviDate(uniqueDates[i - 1]);
            const current = this.parseSuiviDate(uniqueDates[i]);
            if (!previous || !current) break;
            const diffDays = Math.round((previous - current) / 86400000);
            if (diffDays != 1) break;
            streak += 1;
        }
        return streak;
    },

    destroySuiviCharts() {
        if (!this._suiviCharts) {
            this._suiviCharts = {};
            return;
        }
        Object.values(this._suiviCharts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') chart.destroy();
        });
        this._suiviCharts = {};
    },

    renderSuiviCharts(sessions, exerciseMap) {
        this.destroySuiviCharts();
        if (typeof Chart === 'undefined') return;

        const sessionsCanvas = document.getElementById('suiviSessionsChart');
        const volumeCanvas = document.getElementById('suiviVolumeChart');
        const radarCanvas = document.getElementById('suiviRadarChart');
        
        if (sessionsCanvas) {

        const byDate = new Map(sessions.map(session => [session.date, session]));
        const recentDays = [];
        const todayDate = this.parseSuiviDate(today());
        if (!todayDate) return;

        for (let offset = 13; offset >= 0; offset--) {
            const day = new Date(todayDate);
            day.setDate(day.getDate() - offset);
            const key = [
                day.getFullYear(),
                String(day.getMonth() + 1).padStart(2, '0'),
                String(day.getDate()).padStart(2, '0')
            ].join('-');
            const session = byDate.get(key);
            recentDays.push({
                label: day.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
                value: session ? session.exerciseCount : 0
            });
        }

        const recentSessions = [...sessions]
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-10)
            .map(session => ({
                label: this.formatSuiviDate(session.date, { day: '2-digit', month: '2-digit' }),
                value: session.totalVolume || session.totalReps || session.completedCount
            }));

        this._suiviCharts.sessions = new Chart(sessionsCanvas, {
            type: 'bar',
            data: {
                labels: recentDays.map(point => point.label),
                datasets: [{
                    label: 'Exercices coches',
                    data: recentDays.map(point => point.value),
                    backgroundColor: 'rgba(8,145,178,0.75)',
                    borderRadius: 6,
                    maxBarThickness: 24
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { maxRotation: 0, minRotation: 0 } },
                    y: { beginAtZero: true, ticks: { precision: 0, stepSize: 1 } }
                }
            }
        });

        this._suiviCharts.volume = new Chart(volumeCanvas, {
            type: 'line',
            data: {
                labels: recentSessions.map(point => point.label),
                datasets: [{
                    label: 'Charge / effort',
                    data: recentSessions.map(point => point.value),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16,185,129,0.18)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { maxRotation: 0, minRotation: 0 } },
                    y: { beginAtZero: true }
                }
            }
        });
        } // End of if (sessionsCanvas)

        // 3. RADAR CHART (Equilibre Musculaire)
        if (radarCanvas && exerciseMap) {
            const zones = this.buildZoneStats(sessions, exerciseMap);
            // On affiche toutes les zones pour avoir une forme de radar constante
            const activeZones = zones;
            
            if (activeZones.length > 0) {
                this._suiviCharts.radar = new Chart(radarCanvas, {
                    type: 'radar',
                    data: {
                        labels: activeZones.map(z => z.label),
                        datasets: [{
                            label: 'Intensité',
                            data: activeZones.map(z => z.score),
                            backgroundColor: 'rgba(8, 145, 178, 0.2)',
                            borderColor: '#0891B2',
                            pointBackgroundColor: '#10b981',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: '#10b981',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                beginAtZero: true,
                                angleLines: { color: 'rgba(148,163,184,0.2)' },
                                grid: { color: 'rgba(148,163,184,0.2)' },
                                pointLabels: { font: { size: 10, weight: 'bold' }, color: '#64748b' },
                                ticks: { display: false }
                            }
                        },
                        plugins: { legend: { display: false } }
                    }
                });
            }
        }
    },

    renderSuiviHistory(sessions) {
        const meta = document.getElementById('suiviHistoryMeta');
        const container = document.getElementById('suiviHistory');
        if (!meta || !container) return;

        if (!sessions.length) {
            meta.textContent = 'Aucune seance enregistree pour le moment.';
            container.innerHTML = '<div class="empty-state">Commencez a cocher vos exercices et remplir vos series pour alimenter le suivi.</div>';
            return;
        }

        meta.textContent = `${sessions.length} seance(s) enregistree(s). Derniere seance le ${this.formatSuiviDate(sessions[0].date, { weekday: 'long', day: '2-digit', month: 'long' })}.`;
        container.innerHTML = sessions.slice(0, 8).map(session => {
            const summaryParts = [];
            summaryParts.push(`${session.completedCount}/${session.exerciseCount} exercice(s)`);
            if (session.completedSets > 0) summaryParts.push(`${session.completedSets} serie(s) validee(s)`);
            if (session.totalReps > 0) summaryParts.push(`${session.totalReps} reps`);
            if (session.totalVolume > 0) summaryParts.push(`${this.formatCompactNumber(session.totalVolume)} kg volume`);

            const detailsHtml = session.exercises.map(metric => {
                const detailParts = [];
                if (metric.completedSets > 0) detailParts.push(`${metric.completedSets} serie(s)`);
                else if (metric.totalSets > 0) detailParts.push(`${metric.totalSets} entree(s)`);
                if (metric.totalReps > 0) detailParts.push(`${metric.totalReps} reps`);
                if (metric.maxLoad > 0) detailParts.push(`${metric.maxLoad} kg max`);
                if (!detailParts.length) detailParts.push(metric.done ? 'Coche' : 'Activite detectee');

                return `<div style="padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--bg);min-width:0">
                    <div style="font-size:12px;font-weight:700;color:var(--text)">${this.escapeHtml(metric.name)}</div>
                    <div style="font-size:11px;color:var(--text-light);margin-top:4px">${this.escapeHtml(detailParts.join(' - '))}</div>
                </div>`;
            }).join('');

            return `<div style="padding:14px 0;border-top:1px solid var(--border)">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start">
                    <div>
                        <div style="font-size:14px;font-weight:800;color:var(--text)">${this.escapeHtml(this.formatSuiviDate(session.date, { weekday: 'long', day: '2-digit', month: 'long' }))}</div>
                        <div style="font-size:12px;color:var(--text-light);margin-top:4px">${this.escapeHtml(summaryParts.join(' - '))}</div>
                    </div>
                    <div style="font-size:12px;font-weight:700;color:#0891B2;white-space:nowrap">${session.tracked ? 'detail dispo' : 'cochee'}</div>
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin-top:12px">${detailsHtml}</div>
            </div>`;
        }).join('');
    },

    async renderSuivi() {
        this.ensureSuiviLayout();

        const exercises = await db.exercises.toArray().catch(() => []);
        const relevantExercises = this.getRelevantExercises(exercises);
        const exerciseMap = new Map(relevantExercises.map(exercise => [exercise.id, exercise]));
        const scopedExerciseIds = new Set(relevantExercises.map(exercise => exercise.id));
        const progressList = await StorageManager.getAllProgress?.() || [];
        const noteRows = await db.notes.toArray().catch(() => []);
        const sessions = this.buildSuiviSessions({
            completedMap: completedExercises,
            progressList,
            noteRows,
            exerciseMap,
            scopedExerciseIds
        });

        const statSessions = document.getElementById('statSessions');
        const statStreak = document.getElementById('statStreak');
        const statExercisesDone = document.getElementById('statExercisesDone');
        const statVolume = document.getElementById('statVolume');

        if (statSessions) statSessions.textContent = sessions.length;
        if (statStreak) statStreak.textContent = this.calculateCurrentStreak(sessions);
        if (statExercisesDone) statExercisesDone.textContent = sessions.reduce((sum, session) => sum + session.completedCount, 0);
        if (statVolume) statVolume.textContent = this.formatCompactNumber(sessions.reduce((sum, session) => sum + session.totalVolume, 0));

        this.renderCalendar(sessions);
        this.renderSuiviCharts(sessions, exerciseMap);
        this.renderSuiviHistory(sessions);
    },

    renderCalendar(sessions) {
        const cal = document.getElementById('calendar');
        if (!cal) return;
        const now = new Date();
        const y = now.getFullYear(), m = now.getMonth();
        const firstDay = new Date(y, m, 1);
        const lastDay = new Date(y, m + 1, 0);
        const t = today();
        
        const sessionsByDate = new Map((sessions || []).map(s => [s.date, s]));
        
        let html = ['L','M','M','J','V','S','D'].map(d => `<div class="cal-head">${d}</div>`).join('');
        let start = firstDay.getDay() - 1; if (start < 0) start = 6;
        for (let i = 0; i < start; i++) html += `<div class="cal-day empty"></div>`;
        
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const s = sessionsByDate.get(ds);
            let heatClass = '';
            
            if (s) {
                // Determine heat level based on number of completed exercises
                if (s.completedCount >= 5) { heatClass = 'heat-3'; }
                else if (s.completedCount >= 3) { heatClass = 'heat-2'; }
                else if (s.completedCount > 0) { heatClass = 'heat-1'; }
                else if (s.exerciseCount > 0) { heatClass = 'done'; } // just tracked, not fully done
            }
            
            const cls = ['cal-day', heatClass, ds === t ? 'today' : ''].join(' ').trim();
            html += `<div class="${cls}" title="${s ? s.completedCount + ' exos validés' : ''}">${d}</div>`;
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
