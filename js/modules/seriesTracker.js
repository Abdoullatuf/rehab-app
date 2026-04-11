/**
 * MODULE SERIES TRACKER
 * Suivi des séries par exercice : reps, charge, repos, validation.
 * Porté fidèlement depuis l'app source (rehab-app/index.html).
 * Stockage : in-memory + IndexedDB (table `notes`).
 */

// Cache en mémoire  { exId: { date: { sets: [...] } } }
const _seriesCache = {};

const SeriesTracker = {

    // ─── Utilitaires ─────────────────────────────────────────────────────────

    today() {
        return new Date().toISOString().split('T')[0];
    },

    fmt(s) {
        return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    },

    esc(v) {
        if (v === null || v === undefined) return '';
        const d = document.createElement('div');
        d.textContent = String(v);
        return d.innerHTML;
    },

    ytUrl(name) {
        return 'https://www.youtube.com/results?search_query=' + encodeURIComponent('exercice ' + name + ' comment faire');
    },

    /** Extrait le nombre de séries par défaut depuis la chaîne meta */
    parseDefaultSets(meta) {
        if (!meta) return 3;
        const m = meta.match(/(\d+)\s*[×xX]/);
        return m ? parseInt(m[1]) : 3;
    },

    // ─── Données ─────────────────────────────────────────────────────────────

    getSeriesData(exId, date) {
        date = date || this.today();
        if (!_seriesCache[exId] || !_seriesCache[exId][date]) return null;
        const raw = _seriesCache[exId][date];
        if (typeof raw === 'string') return null;
        return raw;
    },

    saveSeriesData(exId, date, data) {
        if (!_seriesCache[exId]) _seriesCache[exId] = {};
        _seriesCache[exId][date] = data;
        // Persistance Dexie
        try {
            db.notes.put({
                id: `${exId}_${date}`,
                exerciseId: exId,
                date: date,
                data: JSON.stringify(data)
            });
        } catch (e) { /* silencieux */ }
    },

    /** Charge les données persistées depuis Dexie au démarrage */
    async loadFromDB(exId) {
        try {
            const t = this.today();
            const rec = await db.notes.get(`${exId}_${t}`);
            if (rec && rec.data) {
                if (!_seriesCache[exId]) _seriesCache[exId] = {};
                _seriesCache[exId][t] = JSON.parse(rec.data);
            }
        } catch (e) { /* silencieux */ }
    },

    getLastSeriesData(exId) {
        if (!_seriesCache[exId]) return null;
        const t = this.today();
        const dates = Object.keys(_seriesCache[exId]).sort().reverse();
        for (const d of dates) {
            if (d === t) continue;
            const raw = _seriesCache[exId][d];
            if (raw && typeof raw === 'object' && raw.sets) return { date: d, data: raw };
        }
        return null;
    },

    // ─── Opérations sur les séries ────────────────────────────────────────────

    saveSeriesField(exId, setIdx, field, value) {
        const t = this.today();
        let data = this.getSeriesData(exId, t);
        if (!data) data = { sets: [] };
        while (data.sets.length <= setIdx) data.sets.push({ reps: '', charge: '', repos: '' });
        data.sets[setIdx][field] = value;
        this.saveSeriesData(exId, t, data);
        // Mise à jour visuelle de la classe .filled
        const input = document.querySelector(`[data-series-id="${exId}-${setIdx}-${field}"]`);
        if (input) input.classList.toggle('filled', value !== '');
    },

    addSeriesRow(exId) {
        const t = this.today();
        let data = this.getSeriesData(exId, t);
        if (!data) data = { sets: [] };
        data.sets.push({ reps: '', charge: '', repos: '' });
        this.saveSeriesData(exId, t, data);
        this.refreshSeriesTracker(exId);
    },

    removeSeriesRow(exId, setIdx) {
        const t = this.today();
        let data = this.getSeriesData(exId, t);
        if (!data || !data.sets[setIdx]) return;
        data.sets.splice(setIdx, 1);
        this.saveSeriesData(exId, t, data);
        this.refreshSeriesTracker(exId);
    },

    validateSeries(exId, setIdx) {
        const t = this.today();
        let data = this.getSeriesData(exId, t);
        if (!data) data = { sets: [] };
        while (data.sets.length <= setIdx) data.sets.push({ reps: '', charge: '', repos: '', done: false });
        // Toggle done
        data.sets[setIdx].done = !data.sets[setIdx].done;
        this.saveSeriesData(exId, t, data);
        if (data.sets[setIdx].done) {
            const reposVal = parseInt(data.sets[setIdx].repos);
            if (reposVal > 0) {
                this.startRestTimer(exId, setIdx + 1, reposVal);
            }
        } else {
            if (this._restTimerExId === exId) this.skipRestTimer(exId);
        }
        this.refreshSeriesTracker(exId);
    },

    refreshSeriesTracker(exId) {
        document.querySelectorAll(`.series-tracker[data-ex="${exId}"]`).forEach(el => {
            const meta = el.dataset.meta || '';
            el.outerHTML = this.renderSeriesTracker(exId, meta);
        });
        // Restaure le banner de repos si le timer tourne encore
        if (this._restTimerExId === exId) {
            document.querySelectorAll(`.rest-banner[data-ex="${exId}"]`).forEach(b => {
                b.style.display = 'flex';
            });
        }
    },

    // ─── Timer de repos ───────────────────────────────────────────────────────

    _restTimerInterval: null,
    _restTimerExId: null,

    startRestTimer(exId, serieNum, seconds) {
        // Arrête tout timer précédent
        if (this._restTimerInterval) {
            clearInterval(this._restTimerInterval);
            this._restTimerInterval = null;
            if (this._restTimerExId) {
                document.querySelectorAll(`.rest-banner[data-ex="${this._restTimerExId}"]`).forEach(b => {
                    b.style.display = 'none';
                    b.classList.remove('done');
                });
            }
        }
        this._restTimerExId = exId;
        let remaining = seconds;
        // Affiche le banner
        document.querySelectorAll(`.rest-banner[data-ex="${exId}"]`).forEach(b => {
            b.style.display = 'flex';
            b.classList.remove('done');
            b.querySelector('.rest-serie-label').textContent = 'Série ' + serieNum + ' terminée';
            b.querySelector('.rest-countdown').textContent = this.fmt(remaining);
        });
        this._restTimerInterval = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(this._restTimerInterval);
                this._restTimerInterval = null;
                document.querySelectorAll(`.rest-banner[data-ex="${exId}"]`).forEach(b => {
                    b.querySelector('.rest-countdown').textContent = '✅ Go !';
                    b.classList.add('done');
                });
                // Vibration + son
                if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.connect(g); g.connect(ctx.destination);
                    osc.frequency.value = 880; g.gain.value = 0.3;
                    osc.start();
                    setTimeout(() => { osc.stop(); ctx.close(); }, 600);
                } catch (e) {}
            } else {
                document.querySelectorAll(`.rest-banner[data-ex="${exId}"]`).forEach(b => {
                    b.querySelector('.rest-countdown').textContent = this.fmt(remaining);
                });
            }
        }, 1000);
    },

    skipRestTimer(exId) {
        if (this._restTimerInterval) { clearInterval(this._restTimerInterval); this._restTimerInterval = null; }
        this._restTimerExId = null;
        document.querySelectorAll(`.rest-banner[data-ex="${exId}"]`).forEach(b => {
            b.style.display = 'none';
            b.classList.remove('done');
        });
    },

    // ─── Rendu HTML ───────────────────────────────────────────────────────────

    renderSeriesTracker(exId, meta) {
        const t = this.today();
        let data = this.getSeriesData(exId, t);
        const defaultSets = this.parseDefaultSets(meta);
        if (!data) {
            data = { sets: [] };
            for (let i = 0; i < defaultSets; i++) data.sets.push({ reps: '', charge: '', repos: '' });
        }
        const last = this.getLastSeriesData(exId);

        let rows = '';
        data.sets.forEach((s, i) => {
            const rFilled = s.reps   !== '' ? ' filled' : '';
            const cFilled = s.charge !== '' ? ' filled' : '';
            const tFilled = s.repos  !== '' ? ' filled' : '';
            const isDone = s.done === true;
            rows += `<tr${isDone ? ' class="series-done"' : ''}>
                <td>${i + 1}</td>
                <td><input type="number" inputmode="numeric" class="series-input${rFilled}"
                    data-series-id="${this.esc(exId)}-${i}-reps"
                    placeholder="—" value="${this.esc(s.reps)}" min="0"
                    oninput="SeriesTracker.saveSeriesField('${this.esc(exId)}',${i},'reps',this.value)"></td>
                <td><input type="number" inputmode="decimal" class="series-input${cFilled}"
                    data-series-id="${this.esc(exId)}-${i}-charge"
                    placeholder="—" value="${this.esc(s.charge)}" min="0" step="0.5"
                    oninput="SeriesTracker.saveSeriesField('${this.esc(exId)}',${i},'charge',this.value)"></td>
                <td><input type="number" inputmode="numeric" class="series-input${tFilled}"
                    data-series-id="${this.esc(exId)}-${i}-repos"
                    placeholder="—" value="${this.esc(s.repos)}" min="0" step="5"
                    oninput="SeriesTracker.saveSeriesField('${this.esc(exId)}',${i},'repos',this.value)"></td>
                <td style="white-space:nowrap">
                    <button class="series-validate-btn${isDone ? ' done' : ''}"
                        onclick="SeriesTracker.validateSeries('${this.esc(exId)}',${i})"
                        title="${isDone ? 'Annuler' : 'Valider la série'}">✓</button>
                    <button class="series-row-remove"
                        onclick="SeriesTracker.removeSeriesRow('${this.esc(exId)}',${i})"
                        title="Supprimer">×</button>
                </td>
            </tr>`;
        });

        let lastHtml = '';
        if (last && last.data && last.data.sets) {
            const summary = last.data.sets.map((s, i) =>
                `S${i + 1}: ${s.reps || '—'} reps × ${s.charge || '—'} kg, repos ${s.repos || '—'}s`
            ).join(' | ');
            lastHtml = `<div class="series-last-session">📅 <b>Dernière séance</b>
                <span style="font-size:10px">(${this.esc(last.date)})</span><br>${this.esc(summary)}</div>`;
        }

        return `<div class="series-tracker" data-ex="${this.esc(exId)}" data-meta="${this.esc(meta)}">
            <label class="series-tracker-label">📊 Suivi des séries</label>
            <table class="series-table">
                <thead><tr>
                    <th>#</th>
                    <th>Reps</th>
                    <th>Charge (kg)</th>
                    <th>Repos (s)</th>
                    <th></th>
                </tr></thead>
                <tbody>${rows}</tbody>
            </table>
            <button class="series-add-btn" onclick="SeriesTracker.addSeriesRow('${this.esc(exId)}')">＋ Ajouter une série</button>
            <div class="rest-banner" data-ex="${this.esc(exId)}">
                <div class="rest-banner-left">
                    <div class="rest-label">⏱ Temps de repos</div>
                    <div class="rest-serie-label"></div>
                </div>
                <div class="rest-countdown">00:00</div>
                <button class="rest-skip-btn" onclick="SeriesTracker.skipRestTimer('${this.esc(exId)}')">Passer →</button>
            </div>
            ${lastHtml}
        </div>`;
    }
};
