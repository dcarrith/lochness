// Contracts functionality
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the page to fully load before generating QR codes
    window.addEventListener('load', function() {
        console.log('Window loaded, generating QR codes...');
        setTimeout(generateContractQRCodes, 500); // Add a small delay to ensure DOM is ready
    });
    
    // Also try to generate QR codes immediately
    generateContractQRCodes();
    
    // Handle offer file downloads
    const offerButtons = document.querySelectorAll('.download-offer');
    
    offerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const offerFile = this.getAttribute('data-offer');
            
            // In a real implementation, this would download the actual offer file
            // For now, we'll show an alert
            alert(`Downloading ${offerFile}. In a production environment, this would download a Chia offer file that you can accept in your wallet.`);
            
            // Track the download event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download_offer', {
                    'offer_file': offerFile
                });
            }
        });
    });
    
    // Handle contract card clicks to open modals
    const contractCards = document.querySelectorAll('.contract-card');
    
    contractCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if the click was on the download button or QR code
            if (e.target.closest('.download-offer') || e.target.closest('.contract-qr-container')) {
                return;
            }
            
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('modal-open');
            }
        });
    });
    
    // QR code containers are now just for display
    const qrContainers = document.querySelectorAll('.contract-qr-container, .modal-qr-container');
    
    if (qrContainers.length > 0) {
        qrContainers.forEach(container => {
            // Make the container non-clickable
            container.style.cursor = 'default';
            container.style.pointerEvents = 'none';
        });
    }
    
    // Make QR codes non-clickable
    function makeQRCodesClickable() {
        // Find all QR code images inside containers
        const qrImages = document.querySelectorAll('.contract-qr-container img, .modal-qr-container img');
        
        qrImages.forEach(img => {
            // Make all QR codes non-clickable
            img.style.cursor = 'default';
            img.style.pointerEvents = 'none';
        });
        
        console.log('Made QR codes non-clickable:', qrImages.length);
    }
    
    // Function to generate QR codes for all contracts
    function generateContractQRCodes() {
        // Check if QRCode library is available
        if (typeof QRCode === 'undefined') {
            console.error('QRCode library not loaded');
            return;
        }
        
        // Sample offer URLs (in a real implementation, these would be actual Chia offer URLs)
        const offerData = {
            'farm-specialist': 'offer1qqr83wcuu2rykcmqvpsxvgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgr83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgr83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
            'chialisp-dev': 'offer1qqp83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgp83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgp83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
            'security-audit': 'offer1qqz83wcuu2rykcmqvpsxzgqqymnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgz83wcuu2rykcmqvpsxzgqqymnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgz83wcuu2rykcmqvpsxzgqqymnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
            'datalayer-architect': 'offer1qqv83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgv83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgv83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
            'aiops-engineer': 'offer1qqq83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgq83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgq83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
            'infrastructure-specialist': 'offer1qqy83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgy83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgy83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx'
        };
        
        // Generate QR codes for card elements
        Object.keys(offerData).forEach(key => {
            const qrElement = document.getElementById(`qr-${key}`);
            if (qrElement) {
                try {
                    // Clear any existing content
                    qrElement.innerHTML = '';
                    
                    // Clear any existing content
                    qrElement.innerHTML = '';
                    
                    // Create new QR code
                    try {
                        new QRCode(qrElement, {
                            text: offerData[key],
                            width: 200,
                            height: 200,
                            colorDark: "#000000",
                            colorLight: "#ffffff",
                            correctLevel: QRCode.CorrectLevel.H
                        });
                        
                        // Ensure the QR code is visible
                        const img = qrElement.querySelector('img');
                        if (img) {
                            img.style.width = '100%';
                            img.style.height = 'auto';
                            img.style.display = 'block';
                            console.log(`QR code image created successfully for ${key}`);
                        } else {
                            console.error(`QR code image not found after creation for ${key}`);
                            createFallbackQRCode(qrElement, offerData[key]);
                        }
                    } catch (error) {
                        console.error(`Error creating QR code for ${key}:`, error);
                        createFallbackQRCode(qrElement, offerData[key]);
                    }
                    
                    console.log(`Generated QR code for ${key}`);
                    
                    // Make the QR code non-clickable
                    setTimeout(() => {
                        const img = qrElement.querySelector('img');
                        if (img) {
                            img.style.cursor = 'default';
                            img.style.pointerEvents = 'none';
                        }
                    }, 100);
                } catch (error) {
                    console.error(`Error generating QR code for ${key}:`, error);
                }
            } else {
                console.warn(`QR element not found for ${key}`);
            }
            
            // Also generate for modal elements
            const modalQrElement = document.getElementById(`modal-qr-${key}`);
            if (modalQrElement) {
                try {
                    // Clear any existing content
                    modalQrElement.innerHTML = '';
                    
                    // Clear any existing content
                    modalQrElement.innerHTML = '';
                    
                    // Create new QR code with fixed size of 300x300
                    try {
                        new QRCode(modalQrElement, {
                            text: offerData[key],
                            width: 300,
                            height: 300,
                            colorDark: "#000000",
                            colorLight: "#ffffff",
                            correctLevel: QRCode.CorrectLevel.H
                        });
                        
                        // Ensure the QR code is visible
                        const img = modalQrElement.querySelector('img');
                        if (img) {
                            img.style.width = '100%';
                            img.style.height = 'auto';
                            img.style.display = 'block';
                            console.log('QR code image created successfully');
                        } else {
                            console.error('QR code image not found after creation');
                            createFallbackQRCode(modalQrElement, offerData[key]);
                        }
                    } catch (error) {
                        console.error('Error creating QR code:', error);
                        createFallbackQRCode(modalQrElement, offerData[key]);
                    }
                    
                    console.log(`Generated modal QR code for ${key}`);
                    
                    // Make the QR code in modal non-clickable (just for display)
                    setTimeout(() => {
                        const img = modalQrElement.querySelector('img');
                        if (img) {
                            // Make modal QR codes non-clickable
                            img.style.cursor = 'default';
                            img.style.pointerEvents = 'none';
                            // Remove any existing click event listeners
                            img.replaceWith(img.cloneNode(true));
                        }
                    }, 100);
                } catch (error) {
                    console.error(`Error generating modal QR code for ${key}:`, error);
                }
            } else {
                console.warn(`Modal QR element not found for ${key}`);
            }
        });
        
        // Make all QR codes non-clickable
        setTimeout(() => {
            makeQRCodesClickable();
        }, 500);
    }
    
    
    // Fallback function to create a simple QR code image
    function createFallbackQRCode(element, text) {
        // Create a fallback QR code using an image
        const img = document.createElement('img');
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
        img.alt = 'QR Code';
        img.width = 300;
        img.height = 300;
        element.appendChild(img);
    }
});
