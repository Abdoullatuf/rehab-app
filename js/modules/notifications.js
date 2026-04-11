/**
 * MODULE NOTIFICATIONS
 * Gestion centralisée des toasts et feedbacks visuels
 */

const NotificationManager = {
    // Queue pour éviter les toasts qui se chevauchent
    queue: [],
    isShowing: false,

    /**
     * Affiche un toast de succès
     */
    success(message, duration = 2000) {
        this.show(message, 'success', '✓', duration);
    },

    /**
     * Affiche un toast d'erreur
     */
    error(message, duration = 3000) {
        this.show(message, 'error', '❌', duration);
    },

    /**
     * Affiche un toast d'avertissement
     */
    warn(message, duration = 3000) {
        this.show(message, 'warning', '⚠️', duration);
    },

    /**
     * Affiche un toast d'info
     */
    info(message, duration = 2000) {
        this.show(message, 'info', 'ℹ️', duration);
    },

    /**
     * Méthode généralisée pour afficher un toast
     */
    show(message, type = 'info', icon = '', duration = 2000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span style="margin-right: 8px;">${icon}</span> ${message}`;

        document.body.appendChild(toast);

        // Animation d'entrée
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease forwards';
        }, 10);

        // Suppression après la durée spécifiée
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Affiche un loader/skeleton
     */
    showLoader(message = 'Chargement...') {
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        loader.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 12px; text-align: center;">
                <div style="width: 40px; height: 40px; border: 4px solid #0891B2; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loader);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Masque le loader
     */
    hideLoader() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => loader.remove(), 300);
        }
    },

    /**
     * Affiche un dialogue de confirmation
     */
    async confirm(message, title = 'Confirmation') {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            `;

            const content = document.createElement('div');
            content.style.cssText = `
                background: var(--card);
                color: var(--text);
                padding: 24px;
                border-radius: 12px;
                max-width: 400px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            `;

            content.innerHTML = `
                <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">${title}</h3>
                <p style="margin-bottom: 20px; color: var(--text-light);">${message}</p>
                <div style="display: flex; gap: 10px;">
                    <button id="confirm-cancel" style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg); cursor: pointer; font-weight: 600;">Annuler</button>
                    <button id="confirm-ok" style="flex: 1; padding: 10px; border-radius: 8px; border: none; background: #0891B2; color: white; cursor: pointer; font-weight: 600;">Confirmer</button>
                </div>
            `;

            dialog.appendChild(content);
            document.body.appendChild(dialog);

            content.querySelector('#confirm-ok').onclick = () => {
                dialog.remove();
                resolve(true);
            };

            content.querySelector('#confirm-cancel').onclick = () => {
                dialog.remove();
                resolve(false);
            };
        });
    },

    /**
     * Affiche une alerte/avertissement en haut
     */
    alert(message, type = 'warning') {
        const alert = document.createElement('div');
        alert.className = `alert-box alert-${type}`;
        alert.style.cssText = `
            position: fixed;
            top: 80px;
            left: 16px;
            right: 16px;
            z-index: 999;
            max-width: 600px;
            margin: 0 auto;
        `;
        alert.textContent = message;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }, 4000);
    }
};
