/**
 * SERVICE EXERCICES
 * Logique métier pour la gestion des exercices
 */

const ExerciseService = {

    /**
     * Récupère tous les exercices d'une phase
     */
    async getByPhase(programId, phaseId) {
        try {
            const exercises = await StorageManager.getExercisesByPhase(programId, phaseId);
            return exercises || [];
        } catch (err) {
            console.error('ExerciseService.getByPhase:', err);
            return [];
        }
    },

    /**
     * Sauvegarde un exercice avec validation
     */
    async save(exercise) {
        const errors = ExerciseManager.validateEnrichedExercise(exercise);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
        return await StorageManager.saveExercise(exercise);
    },

    /**
     * Enregistre une complétion d'exercice
     */
    async complete(exerciseId, data) {
        const validation = Validation.validateExerciseCompletion(data);
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }

        // Alertes douleur
        validation.warnings.forEach(w => NotificationManager.warn(w));

        const progress = {
            exerciseId,
            date: new Date().toISOString().split('T')[0],
            ...data,
            timestamp: Date.now()
        };

        return await StorageManager.saveProgress(progress);
    },

    /**
     * Récupère l'historique de progression d'un exercice
     */
    async getHistory(exerciseId) {
        try {
            const all = await StorageManager.getProgression(exerciseId);
            return (all || []).sort((a, b) => b.timestamp - a.timestamp);
        } catch (err) {
            console.error('ExerciseService.getHistory:', err);
            return [];
        }
    },

    /**
     * Génère le HTML de la carte d'exercice
     */
    renderCard(exercise, onComplete) {
        const html = ExerciseManager.generateExerciseHTML(exercise);
        return html;
    }
};
