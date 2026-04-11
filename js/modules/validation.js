/**
 * MODULE VALIDATION
 * Validations centralisées pour l'app
 * Priorité 1: Validations côté client
 */

const Validation = {
    // Règles de validation
    rules: {
        weight: { min: 0, max: 1000, name: "Poids" },
        reps: { min: 0, max: 100, name: "Reps" },
        sets: { min: 1, max: 50, name: "Séries" },
        painLevel: { min: 0, max: 10, name: "Douleur" },
        duration: { min: 0, max: 3600, name: "Durée" },
    },

    /**
     * Valide un exercice complété
     * @param {Object} data - {weight, reps, sets, painLevel, duration}
     * @returns {Object} {valid: bool, errors: [], warnings: []}
     */
    validateExerciseCompletion(data) {
        const result = { valid: true, errors: [], warnings: [] };

        // Poids
        if (data.weight !== undefined) {
            if (data.weight < this.rules.weight.min) {
                result.errors.push("⚠️ Le poids ne peut pas être négatif");
                result.valid = false;
            }
            if (data.weight > this.rules.weight.max) {
                result.errors.push(`⚠️ Le poids ne peut pas dépasser ${this.rules.weight.max}kg`);
                result.valid = false;
            }
        }

        // Reps
        if (data.reps !== undefined) {
            if (data.reps < this.rules.reps.min) {
                result.errors.push("⚠️ Le nombre de reps doit être supérieur à 0");
                result.valid = false;
            }
            if (data.reps > this.rules.reps.max) {
                result.errors.push(`⚠️ Le nombre de reps semble invalide (${data.reps})`);
                result.valid = false;
            }
        }

        // Séries
        if (data.sets !== undefined) {
            if (data.sets < this.rules.sets.min || data.sets > this.rules.sets.max) {
                result.errors.push("⚠️ Nombre de séries invalide");
                result.valid = false;
            }
        }

        // Douleur
        if (data.painLevel !== undefined) {
            if (data.painLevel < this.rules.painLevel.min || data.painLevel > this.rules.painLevel.max) {
                result.errors.push("⚠️ La douleur doit être entre 0 et 10");
                result.valid = false;
            }
            if (data.painLevel >= 8) {
                result.warnings.push("⚠️ Douleur élevée : consultez votre kinésithérapeute si cela persiste");
            }
        }

        return result;
    },

    /**
     * Détecte les anomalies de progression
     * @param {Object} current - données actuelles
     * @param {Object} previous - données précédentes
     * @returns {Array} warnings
     */
    detectProgressionAnomalies(current, previous) {
        const warnings = [];

        if (!previous) return warnings;

        // Perte de force significative
        if (current.weight && previous.weight) {
            const drop = ((previous.weight - current.weight) / previous.weight) * 100;
            if (drop > 20) {
                warnings.push(`📉 Baisse de force détectée (-${drop.toFixed(0)}%)`);
            }
        }

        // Douleur augmentée
        if (current.painLevel && previous.painLevel) {
            const increase = current.painLevel - previous.painLevel;
            if (increase >= 3) {
                warnings.push(`🔴 Douleur augmentée de ${increase} points`);
            }
        }

        // Surcharge possible
        if (current.weight && current.reps && previous.weight) {
            const currentVolume = (current.weight || 0) * (current.reps || 0);
            const previousVolume = previous.weight * (previous.reps || 0);
            if (currentVolume > previousVolume * 1.3) {
                warnings.push("⚡ Augmentation importante du volume : assurez-vous d'être prêt");
            }
        }

        return warnings;
    },

    /**
     * Valide les données d'un exercice avant création/édition
     * @param {Object} exercise
     * @returns {Array} erreurs
     */
    validateExerciseDefinition(exercise) {
        const errors = [];

        if (!exercise.name || exercise.name.trim().length === 0) {
            errors.push("Le nom de l'exercice est obligatoire");
        }

        if (!exercise.phaseId) {
            errors.push("Vous devez sélectionner une phase");
        }

        if (!exercise.steps || exercise.steps.length === 0) {
            errors.push("L'exercice doit avoir au moins une étape");
        }

        return errors;
    },

    /**
     * Valide les données utilisateur
     * @param {Object} userData
     * @returns {Object} {valid: bool, errors: []}
     */
    validateUserData(userData) {
        const result = { valid: true, errors: [] };

        if (userData.email && !this.isValidEmail(userData.email)) {
            result.errors.push("Email invalide");
            result.valid = false;
        }

        if (userData.age && (userData.age < 0 || userData.age > 120)) {
            result.errors.push("Âge invalide");
            result.valid = false;
        }

        return result;
    },

    /**
     * Valide un email
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Affiche les erreurs dans l'UI
     */
    showErrors(errors, container) {
        if (!errors || errors.length === 0) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert-box alert-warning';
        errorDiv.innerHTML = errors.map(e => `<p>❌ ${e}</p>`).join('');

        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    },

    /**
     * Affiche les avertissements
     */
    showWarnings(warnings, container) {
        if (!warnings || warnings.length === 0) return;

        warnings.forEach(warning => {
            NotificationManager.warn(warning);
        });
    }
};
