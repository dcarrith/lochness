/**
 * Placeholders - SVG data URIs for fallback images
 * This eliminates 404 errors when images aren't found
 */

// Initialize placeholders as early as possible for fast access
(function() {
    // SVG placeholder constants as Base64 data URIs
    window.PLACEHOLDERS = {
        AVATAR: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM0OThkYiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCAxNHYyYTIgMiAwIDAgMS0yIDJIMTRhMiAyIDAgMCAxLTItMnYtMiI+PC9wYXRoPjxyZWN0IHg9IjgiIHk9IjIiIHdpZHRoPSI4IiBoZWlnaHQ9IjEyIiByeD0iMiI+PC9yZWN0PjxwYXRoIGQ9Ik00IDE0djJhMiAyIDAgMCAwIDIgMkg4YTIgMiAwIDAgMCAyLTJ2LTIiPjwvcGF0aD48cGF0aCBkPSJNOCAwdjIiPjwvcGF0aD48cGF0aCBkPSJNMTYgMHYyIj48L3BhdGg+PHBhdGggZD0iTTEyIDE0djYiPjwvcGF0aD48cGF0aCBkPSJNOCAyMGg4Ij48L3BhdGg+PC9zdmc+',
        CERTIFICATION: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzNDk4ZGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjgiIHI9IjciPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjguMjEgMTMuODkgNyAyMyAxMiAyMCAxNyAyMyAxNS43OSAxMy44OCI+PC9wb2x5bGluZT48L3N2Zz4=',
        EDUCATION: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzNDk4ZGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNCAxOWE3IDMgMCAwIDEgMTYgMCI+PC9wYXRoPjxwYXRoIGQ9Ik0xMiAyYTQgNCAwIDAgMCA0IDR2NmE0IDQgMCAwIDEtOCAwVjZhNCA0IDAgMCAwIDQtNHoiPjwvcGF0aD48L3N2Zz4=',
        PROJECT: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM0OThkYiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5Z29uIHBvaW50cz0iMTIgMiAyIDcgMTIgMTIgMjIgNyAxMiAyIj48L3BvbHlnb24+PHBvbHlsaW5lIHBvaW50cz0iMiAxNyAxMiAyMiAyMiAxNyI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPSIyIDEyIDEyIDE3IDIyIDEyIj48L3BvbHlsaW5lPjwvc3ZnPg==',
        TOOL: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzNDk4ZGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTQuNyA2LjNhMSAxIDAgMCAwIDEuNCAxLjRsNC05YTEgMSAwIDAgMC0xLjQtMS40bC00IDAiPjwvcGF0aD48cGF0aCBkPSJNMTUgNyBhMiAyIDAgMCAxLTIgMiBzLTEtLjQtMS0xIGMuMy0uNi41LTEgLjUtMSBzLTEuOSAxLTMgMmMtMS45IDEuOS0yIDMuOC0xIDQuOCI+PC9wYXRoPjxwYXRoIGQ9Ik05IDE3IHMuOS0uNyAyLTEiPjwvcGF0aD48cGF0aCBkPSJNMTIgMTZWOSI+PC9wYXRoPjxwYXRoIGQ9Ik04IDE3IC0uNy45LTEuMjAxTTggNFYyIE0xNiA0VjJNMTcgMTJhNSA1IDAgMCAwLTUgNW0tNC00YS45MjkuOTI5IDAgMCAxLS45Mi45MyI+PC9wYXRoPjwvc3ZnPg==',
        QR_CODE: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSI3IiBoZWlnaHQ9IjciPjwvcmVjdD48cmVjdCB4PSIxNCIgeT0iMyIgd2lkdGg9IjciIGhlaWdodD0iNyI+PC9yZWN0PjxyZWN0IHg9IjMiIHk9IjE0IiB3aWR0aD0iNyIgaGVpZ2h0PSI3Ij48L3JlY3Q+PHJlY3QgeD0iMTQiIHk9IjE0IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIj48L3JlY3Q+PHJlY3QgeD0iMTgiIHk9IjE0IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIj48L3JlY3Q+PHJlY3QgeD0iMTQiIHk9IjE4IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIj48L3JlY3Q+PHJlY3QgeD0iMTgiIHk9IjE4IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIj48L3JlY3Q+PC9zdmc+',
        ICON: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzNDk4ZGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI5Ij48L2NpcmNsZT48cGF0aCBkPSJNOSAxMmgxMiI+PC9wYXRoPjxwYXRoIGQ9Ik0xMiA5djYiPjwvcGF0aD48L3N2Zz4='
    };
    
    // Preload placeholders to prevent accessing before defined
    for (const key in window.PLACEHOLDERS) {
        const img = new Image();
        img.src = window.PLACEHOLDERS[key];
    }
})();

/**
 * Get a placeholder SVG as a data URI with error handling
 * @param {string} type - The type of placeholder to get (AVATAR, CERTIFICATION, etc)
 * @returns {string} - The data URI for the placeholder SVG
 */
function getPlaceholder(type) {
    if (!window.PLACEHOLDERS) {
        console.error('PLACEHOLDERS not defined yet!');
        // Return a basic empty SVG as emergency fallback
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjwvc3ZnPg==';
    }
    
    return window.PLACEHOLDERS[type] || window.PLACEHOLDERS.AVATAR;
}

/**
 * Apply placeholder to an element (creates and appends img)
 * @param {Element} element - The element to append the placeholder to
 * @param {string} type - The type of placeholder
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels
 */
function applyPlaceholder(element, type, width = 100, height = 100) {
    if (!element) {
        console.warn('Cannot apply placeholder to null element');
        return;
    }
    
    try {
        // Clear existing content
        element.innerHTML = '';
        
        // Create img with placeholder
        const img = new Image();
        img.src = getPlaceholder(type);
        img.alt = type?.toLowerCase() || 'placeholder';
        img.width = width;
        img.height = height;
        img.style.maxWidth = '100%';
        
        element.appendChild(img);
    } catch (error) {
        console.warn('Error applying placeholder:', error);
    }
}

// Make functions available globally
window.getPlaceholder = getPlaceholder;
window.applyPlaceholder = applyPlaceholder;
