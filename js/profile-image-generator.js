/**
 * Profile Image Generator
 * Generates professional-looking avatar and banner images dynamically
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Preload any resources
    loadFonts();
});

/**
 * Load required fonts
 */
function loadFonts() {
    // Use Web Font Loader if available
    if (window.WebFont) {
        WebFont.load({
            google: {
                families: ['Montserrat:700']
            }
        });
    }
}

/**
 * Generate a profile avatar
 * @param {string} name - The user's name
 * @param {string} elementId - The ID of the element to place the avatar in
 * @param {Object} options - Customization options
 */
function generateProfileAvatar(name, elementId, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) return false;
    
    // Default options
    const defaults = {
        size: 400,
        backgroundColor: '#3498db',
        backgroundGradient: ['#3498db', '#2980b9'],
        textColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 8,
        useGradient: true,
        usePattern: true
    };
    
    // Merge options
    const settings = Object.assign({}, defaults, options);
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = settings.size;
    canvas.height = settings.size;
    canvas.className = 'generated-avatar';
    
    // Get context for drawing
    const ctx = canvas.getContext('2d');
    
    // Draw background
    if (settings.useGradient) {
        const gradient = ctx.createLinearGradient(0, 0, settings.size, settings.size);
        gradient.addColorStop(0, settings.backgroundGradient[0]);
        gradient.addColorStop(1, settings.backgroundGradient[1]);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = settings.backgroundColor;
    }
    
    // Fill the entire canvas
    ctx.fillRect(0, 0, settings.size, settings.size);
    
    // Add decorative pattern
    if (settings.usePattern) {
        drawAvatarPattern(ctx, settings.size, settings.backgroundGradient[0]);
    }
    
    // Draw circular mask
    ctx.beginPath();
    ctx.arc(settings.size/2, settings.size/2, settings.size/2 - settings.borderWidth/2, 0, Math.PI * 2);
    ctx.lineWidth = settings.borderWidth;
    ctx.strokeStyle = settings.borderColor;
    ctx.stroke();
    
    // Get initials from name
    const initials = getInitials(name);
    
    // Style for text
    const fontSize = Math.floor(settings.size / 3);
    ctx.font = `bold ${fontSize}px Montserrat, Arial, sans-serif`;
    ctx.fillStyle = settings.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add text shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    // Draw the text
    ctx.fillText(initials, settings.size/2, settings.size/2);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    
    // Clear the element and add the canvas
    element.innerHTML = '';
    element.appendChild(canvas);
    
    // Also create a data URL for download/export
    return canvas.toDataURL('image/png');
}

/**
 * Generate a profile banner
 * @param {string} name - The user's name
 * @param {string} elementId - The ID of the element to place the banner in
 * @param {Object} options - Customization options
 */
function generateProfileBanner(name, elementId, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) return false;
    
    // Default options
    const defaults = {
        width: 1200,
        height: 300,
        backgroundGradient: ['#4b6cb7', '#182848'],
        alternateGradients: [
            ['#1a2a6c', '#b21f1f'],
            ['#8E2DE2', '#4A00E0'],
            ['#00c6ff', '#0072ff'],
            ['#396afc', '#2948ff'],
            ['#654ea3', '#eaafc8']
        ],
        textColor: '#ffffff',
        usePattern: true,
        title: 'Lochness Group Professional'
    };
    
    // Merge options
    const settings = Object.assign({}, defaults, options);
    
    // Select a gradient based on name (for consistent but various styles)
    const nameHash = simpleHash(name);
    const gradientIndex = nameHash % settings.alternateGradients.length;
    
    // Use the selected gradient
    settings.backgroundGradient = options.backgroundGradient || 
                                  settings.alternateGradients[gradientIndex] ||
                                  settings.backgroundGradient;
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = settings.width;
    canvas.height = settings.height;
    canvas.className = 'generated-banner';
    
    // Get context for drawing
    const ctx = canvas.getContext('2d');
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, settings.width, settings.height);
    gradient.addColorStop(0, settings.backgroundGradient[0]);
    gradient.addColorStop(1, settings.backgroundGradient[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, settings.width, settings.height);
    
    // Add decorative pattern based on hash of name
    if (settings.usePattern) {
        drawBannerPattern(ctx, settings.width, settings.height, nameHash);
    }
    
    // Add Lochness Group branding
    const brandText = settings.title;
    ctx.font = 'bold 36px Montserrat, Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.textAlign = 'center';
    
    // Add text shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Draw text
    ctx.fillText(brandText, settings.width/2, settings.height/2);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    
    // Clear the element and set as background
    element.innerHTML = '';
    element.style.backgroundImage = 'none';
    element.appendChild(canvas);
    
    // Also create a data URL for download/export
    return canvas.toDataURL('image/png');
}

/**
 * Draw a decorative pattern on the avatar
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} size - Canvas size
 * @param {string} color - Base color for patterns
 */
function drawAvatarPattern(ctx, size, color) {
    // Save context state
    ctx.save();
    
    // Pattern styling
    ctx.strokeStyle = lightenColor(color, 20);
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    
    // Draw geometric pattern
    const patternSize = size / 8;
    
    // Draw diagonal lines
    for (let i = -size; i < size * 2; i += patternSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
        ctx.stroke();
    }
    
    // Draw circular patterns
    ctx.globalAlpha = 0.2;
    const circles = 3;
    for (let i = 1; i <= circles; i++) {
        ctx.beginPath();
        ctx.arc(size/2, size/2, (size/2) * (i/circles) * 0.8, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Restore context state
    ctx.restore();
}

/**
 * Draw a decorative pattern on the banner
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} seed - Seed for pattern variations
 */
function drawBannerPattern(ctx, width, height, seed) {
    // Save context state
    ctx.save();
    
    // Select pattern type based on seed
    const patternType = seed % 4;
    
    // Pattern styling
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    switch (patternType) {
        case 0: // Circles
            for (let i = 0; i < 10; i++) {
                const x = (seed % 10) * width / 10 + (i * width / 5);
                const y = height * 0.5;
                const radius = 10 + (seed % 5) * 20 + i * 10;
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
            break;
            
        case 1: // Grid
            const gridSize = 30;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
            break;
            
        case 2: // Diagonal lines
            const lineSpacing = 50;
            for (let i = -height; i < width + height; i += lineSpacing) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + height, height);
                ctx.stroke();
            }
            break;
            
        case 3: // Dots
            for (let x = 0; x < width; x += 60) {
                for (let y = 0; y < height; y += 60) {
                    // Offset every other row
                    const offsetX = (y % 120 === 0) ? 30 : 0;
                    
                    ctx.beginPath();
                    ctx.arc(x + offsetX, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            break;
    }
    
    // Add geometric shape based on seed
    if (seed % 3 === 0) {
        // Large translucent circle
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.arc(width * 0.8, height * 0.5, height * 0.8, 0, Math.PI * 2);
        ctx.fill();
    } else if (seed % 3 === 1) {
        // Triangle
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.moveTo(width * 0.2, height * 0.8);
        ctx.lineTo(width * 0.8, height * 0.8);
        ctx.lineTo(width * 0.5, height * 0.2);
        ctx.closePath();
        ctx.fill();
    } else {
        // Squares
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(width * 0.7, height * 0.2, width * 0.2, height * 0.6);
        ctx.fillRect(width * 0.1, height * 0.3, width * 0.15, height * 0.4);
    }
    
    // Restore context state
    ctx.restore();
}

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (1-2 characters)
 */
function getInitials(name) {
    if (!name) return '?';
    
    const words = name.trim().split(/\s+/);
    
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate a simple hash from a string
 * @param {string} str - Input string
 * @returns {number} A hash number
 */
function simpleHash(str) {
    if (!str) return 0;
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Lighten a color by a percentage
 * @param {string} color - Hex color code
 * @param {number} percent - Percentage to lighten
 * @returns {string} Lightened color
 */
function lightenColor(color, percent) {
    // Remove # if present
    let hex = color.replace('#', '');
    
    // Convert to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Lighten
    r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
    
    // Convert back to hex
    return '#' + 
        r.toString(16).padStart(2, '0') + 
        g.toString(16).padStart(2, '0') + 
        b.toString(16).padStart(2, '0');
}
