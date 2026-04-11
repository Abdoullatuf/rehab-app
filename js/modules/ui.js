/**
 * MODULE UI
 * Composants réutilisables pour l'interface
 */

const UIComponents = {
    /**
     * Crée une carte statistique
     */
    createStatCard(label, value, icon = '') {
        return `
            <div class="stat-card">
                ${icon ? `<div style="font-size: 24px; margin-bottom: 8px;">${icon}</div>` : ''}
                <div class="stat-value">${value}</div>
                <div class="stat-label">${label}</div>
            </div>
        `;
    },

    /**
     * Crée un badge
     */
    createBadge(text, type = 'primary') {
        return `<span class="badge ${type}">${text}</span>`;
    },

    /**
     * Crée un bouton
     */
    createButton(text, onClick, type = 'primary') {
        return `
            <button class="btn btn-${type}" onclick="${onClick}">
                ${text}
            </button>
        `;
    },

    /**
     * Crée un champ de formulaire
     */
    createFormField(label, id, type = 'text', placeholder = '') {
        return `
            <div class="form-field">
                <label for="${id}">${label}</label>
                <input type="${type}" id="${id}" placeholder="${placeholder}">
            </div>
        `;
    },

    /**
     * Crée un tableau simple
     */
    createTable(headers, rows) {
        let html = '<table style="width: 100%; border-collapse: collapse;">';

        // En-têtes
        html += '<thead><tr>';
        headers.forEach(h => {
            html += `<th style="border-bottom: 2px solid var(--border); padding: 8px; text-align: left; font-weight: 700;">${h}</th>`;
        });
        html += '</tr></thead>';

        // Lignes
        html += '<tbody>';
        rows.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
                html += `<td style="border-bottom: 1px solid var(--border); padding: 8px;">${cell}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody>';

        html += '</table>';
        return html;
    },

    /**
     * Crée un diagramme de progrès (simple)
     */
    createProgressBar(current, max, label = '') {
        const percent = (current / max) * 100;
        return `
            <div style="margin-bottom: 12px;">
                ${label ? `<div style="font-size: 12px; font-weight: 700; margin-bottom: 4px;">${label}</div>` : ''}
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%"></div>
                </div>
                <div style="font-size: 11px; color: var(--text-light); margin-top: 4px;">
                    ${current} / ${max}
                </div>
            </div>
        `;
    },

    /**
     * Crée une liste
     */
    createList(items) {
        let html = '<ul style="margin: 0; padding-left: 20px; color: var(--text);">';
        items.forEach(item => {
            html += `<li style="margin-bottom: 6px;">${item}</li>`;
        });
        html += '</ul>';
        return html;
    },

    /**
     * Crée un mini-calendrier
     */
    createMiniCalendar(year, month) {
        // Stub - à implémenter avec Chart.js plus tard
        return '<div class="card"><p>Mini-calendrier pour ' + month + '/' + year + '</p></div>';
    },

    /**
     * Crée une alerte
     */
    createAlert(message, type = 'info') {
        return `<div class="alert-box alert-${type}">${message}</div>`;
    },

    /**
     * Crée un skeleton loader
     */
    createSkeleton(height = '100px') {
        return `
            <div class="skeleton" style="height: ${height}; border-radius: 8px; margin-bottom: 12px;"></div>
        `;
    },

    /**
     * Crée une carte avec image
     */
    createImageCard(title, description, imageUrl = '') {
        return `
            <div class="card">
                ${imageUrl ? `<img src="${imageUrl}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">` : ''}
                <div class="card-title">${title}</div>
                <div class="card-body">${description}</div>
            </div>
        `;
    }
};
