/**
 * MODULE EXERCISES
 * Priorité 1: Descriptions d'exercices améliorées
 * Structure enrichie avec sécurité, progression, etc.
 */

const ExerciseManager = {
    /**
     * Structure enrichie d'un exercice
     */
    createExerciseTemplate() {
        return {
            id: this.generateId(),
            name: '',
            programId: '',
            phaseId: '',
            meta: '', // ex: "4 x 10 reps"

            // NOUVEAU: Descriptions améliorées
            steps: [], // Étapes d'exécution
            safetyTips: [], // Conseils de sécurité
            commonMistakes: [], // Erreurs à éviter
            progression: '', // Comment progresser
            zones: [], // Zones musculaires travaillées
            youtubeLink: '', // Lien vidéo de démonstration
            tempo: '', // Tempo exécution (ex: 3-1-2)

            // Méta-données
            difficulty: 'medium', // easy, medium, hard
            equipment: [], // Équipement nécessaire
            targetMuscles: [], // Muscles cibles
            recoveryTime: 60, // Temps de repos recommandé en secondes

            // Tracking
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
    },

    /**
     * Crée un exercice enrichi
     */
    createEnrichedExercise(data) {
        const template = this.createExerciseTemplate();
        return { ...template, ...data };
    },

    /**
     * Valide un exercice complet
     */
    validateEnrichedExercise(exercise) {
        const errors = [];

        if (!exercise.name || exercise.name.trim().length === 0) {
            errors.push('Le nom est obligatoire');
        }

        if (!exercise.steps || exercise.steps.length === 0) {
            errors.push('Au moins une étape est requise');
        }

        if (!exercise.phaseId) {
            errors.push('La phase est obligatoire');
        }

        // Recommandations de contenu
        if (!exercise.safetyTips || exercise.safetyTips.length === 0) {
            errors.push('⚠️ Ajoutez au moins un conseil de sécurité');
        }

        if (!exercise.zones || exercise.zones.length === 0) {
            errors.push('⚠️ Définissez les zones musculaires');
        }

        return errors;
    },

    /**
     * Génère le HTML d'une carte d'exercice (fidèle à l'app source) :
     *  - image lazy-loaded
     *  - objectif, étapes, warning, progression
     *  - tracker de séries (reps / charge / repos / validation)
     *  - lien YouTube
     */
    generateExerciseHTML(exercise, isDone = false) {
        const id   = this.escapeHtml(exercise.id);
        const name = this.escapeHtml(exercise.name);
        const meta = this.escapeHtml(exercise.meta || '');

        const stepsHtml = (exercise.steps || [])
            .map(s => `<li>${this.escapeHtml(s)}</li>`).join('');

        const imageHtml = exercise.mediaUrl ? `
            <div style="margin:14px 0;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);
                        border:1px solid var(--border);background:var(--card);overflow:hidden;
                        display:flex;justify-content:center;padding:10px;">
                <img src="${this.escapeHtml(exercise.mediaUrl)}" loading="lazy"
                     style="max-width:100%;max-height:240px;border-radius:8px;"
                     alt="${name}">
            </div>` : '';

        const warningHtml = exercise.warning
            ? `<div class="alert-box alert-warning">⚠️ <b>Attention :</b> ${this.escapeHtml(exercise.warning)}</div>`
            : '';

        const progressionHtml = exercise.progression
            ? `<div class="alert-box alert-info">📈 <b>Progression :</b> ${this.escapeHtml(exercise.progression)}</div>`
            : '';

        const ytUrl = 'https://www.youtube.com/results?search_query='
            + encodeURIComponent('exercice ' + exercise.name + ' comment faire');

        const seriesHtml = SeriesTracker.renderSeriesTracker(exercise.id, exercise.meta || '');

        return `<div class="exercise${isDone ? ' completed' : ''}" data-exercise-id="${id}" id="ex-${id}">
            <div class="exercise-header" onclick="toggleEx('${id}')">
                <div class="exercise-check" onclick="event.stopPropagation();toggleDone('${id}')">✓</div>
                <div class="exercise-info">
                    <div class="exercise-name">${name}</div>
                    <div class="exercise-meta">${meta}</div>
                </div>
                <div class="exercise-chevron">▾</div>
            </div>
            <div class="exercise-details">
                ${exercise.purpose ? `<p><b>Objectif :</b> ${this.escapeHtml(exercise.purpose)}</p>` : ''}
                ${imageHtml}
                <ul class="steps">${stepsHtml}</ul>
                ${warningHtml}
                ${progressionHtml}
                ${seriesHtml}
                <a class="yt-btn" href="${ytUrl}" target="_blank" rel="noopener">▶ Voir sur YouTube</a>
            </div>
        </div>`;
    },

    /**
     * Exemples d'exercices enrichis (template)
     */
    getEnrichedExamples() {
        return [
            {
                name: 'Squat au poids du corps',
                phaseId: 'phase-1',
                meta: '3 x 12 reps',
                difficulty: 'easy',
                tempo: '3-1-2 (3s descente, 1s pause, 2s montée)',
                steps: [
                    'Pieds écartés à la largeur des épaules',
                    'Regard fixe devant, dos droit',
                    'Descendre lentement en pliant les genoux',
                    'Genoux ne doivent pas dépasser les orteils',
                    'Pause courte en bas',
                    'Remontée contrôlée'
                ],
                safetyTips: [
                    'Garder le dos droit pendant toute l\'exécution',
                    'Ne pas laisser les genoux s\'effondrer vers l\'intérieur',
                    'Respirer : inspiration en descente, expiration en montée'
                ],
                commonMistakes: [
                    'Génoux qui se plient vers l\'intérieur (valgus)',
                    'Dos qui s\'arrondit',
                    'Descendre trop vite ou remonter en saccade'
                ],
                zones: ['Quadriceps', 'Fessiers', 'Ischio-jambiers'],
                progression: 'Progresser vers : goblet squat (avec poids), squat à une jambe (pistol squat)',
                youtubeLink: 'https://www.youtube.com/results?search_query=proper+squat+form',
                recoveryTime: 60
            },
            {
                name: 'Gainage frontal',
                phaseId: 'phase-1',
                meta: '3 x 30-60s',
                difficulty: 'medium',
                tempo: 'Isométrique (tenir la position)',
                steps: [
                    'Position pompe sur les avant-bras',
                    'Corps forme une ligne droite',
                    'Engager les abdominaux',
                    'Maintenir la position sans bouger',
                    'Respirer régulièrement'
                ],
                safetyTips: [
                    'Ne pas laisser les hanches s\'affaisser',
                    'Ne pas lever les fesses trop haut',
                    'Éviter d\'apnée : respirer continuellement'
                ],
                commonMistakes: [
                    'Laisser les hanches s\'effondrer vers le sol',
                    'Pencher la tête vers l\'avant',
                    'Tenir l\'apnée au lieu de respirer'
                ],
                zones: ['Abdominaux', 'Stabilisateurs lombaires'],
                progression: 'Augmenter la durée, puis passer au gainage latéral ou sur les mains',
                recoveryTime: 45
            }
        ];
    },

    /**
     * Échappe l'HTML pour éviter XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Génère un ID unique
     */
    generateId() {
        return `ex_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};
