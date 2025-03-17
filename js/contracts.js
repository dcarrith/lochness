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
    
    // Handle QR code clicks to open QR code modal
    const qrContainers = document.querySelectorAll('.contract-qr-container, .modal-qr-container');
    const qrModal = document.getElementById('qr-code-modal');
    
    // Check if QR modal elements exist before trying to use them
    if (qrModal) {
        if (qrContainers.length > 0) {
            qrContainers.forEach(container => {
                container.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('QR container clicked');
                    
                    // Find the closest contract card or modal to get the specialist info
                    const contractCard = this.closest('.contract-card');
                    const contractModal = this.closest('.modal-content');
                    
                    let specialistType, rate, term, offerFile;
                    let specialistKey;
                    
                    if (contractCard) {
                        console.log('Found contract card');
                        // Get info from contract card
                        specialistType = contractCard.querySelector('h3').textContent;
                        rate = contractCard.querySelector('.detail-value').textContent;
                        term = contractCard.querySelectorAll('.detail-value')[1].textContent;
                        offerFile = contractCard.querySelector('.download-offer').getAttribute('data-offer');
                        
                        // Get the QR code data
                        const qrCodeId = contractCard.querySelector('.qr-code').id;
                        specialistKey = qrCodeId.replace('qr-', '');
                        console.log('Specialist key:', specialistKey);
                    } else if (contractModal) {
                        console.log('Found contract modal');
                        // Get info from contract modal
                        specialistType = contractModal.querySelector('.modal-header h3').textContent;
                        const detailRows = contractModal.querySelectorAll('.detail-row');
                        rate = detailRows[0].querySelector('.detail-value').textContent;
                        term = detailRows[1].querySelector('.detail-value').textContent;
                        offerFile = contractModal.querySelector('.download-offer').getAttribute('data-offer');
                        
                        // Get the QR code data
                        const qrCodeId = contractModal.querySelector('.qr-code-large').id;
                        specialistKey = qrCodeId.replace('modal-qr-', '');
                        console.log('Specialist key:', specialistKey);
                    }
                    
                    // Update QR modal with specialist info
                    const titleElement = document.getElementById('qr-specialist-title');
                    const rateElement = document.getElementById('qr-rate');
                    const termElement = document.getElementById('qr-term');
                    const downloadElement = document.getElementById('qr-download-link');
                    const largeQrElement = document.getElementById('large-qr-code');
                    
                    if (titleElement) titleElement.textContent = specialistType;
                    if (rateElement) rateElement.textContent = rate;
                    if (termElement) termElement.textContent = term;
                    if (downloadElement) downloadElement.setAttribute('data-offer', offerFile);
                    
                    // Generate large QR code
                    if (largeQrElement && specialistKey) {
                        console.log('Generating large QR code');
                        generateLargeQRCode(specialistKey, largeQrElement);
                    }
                    
                    // Open the QR code modal
                    console.log('Opening QR modal');
                    qrModal.classList.add('active');
                    document.body.classList.add('modal-open');
                });
            });
        }
    
    } // Close the if(qrModal) block that was missing its closing bracket
    
    // Add event listeners for QR modal if it exists
    if (qrModal) {
        // Close QR code modal when clicking the close button
        const qrModalClose = qrModal.querySelector('.modal-close');
        if (qrModalClose) {
            qrModalClose.addEventListener('click', function() {
                qrModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            });
        }
        
        // Close QR code modal when clicking outside the content
        qrModal.addEventListener('click', function(e) {
            if (e.target === this) {
                qrModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
        
        // Handle download button in QR modal
        const qrDownloadLink = document.getElementById('qr-download-link');
        if (qrDownloadLink) {
            qrDownloadLink.addEventListener('click', function(e) {
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
        }
    }
    
    // Make QR codes clickable after they're generated
    function makeQRCodesClickable() {
        // Find all QR code images inside containers, excluding those in embedded-qr containers
        const qrImages = document.querySelectorAll('.contract-qr-container img, .modal-qr-container:not(.embedded-qr .modal-qr-container) img');
        
        qrImages.forEach(img => {
            // Skip if the image is inside an embedded-qr container
            if (img.closest('.embedded-qr')) {
                img.style.cursor = 'default';
                return;
            }
            
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Find the closest container
                const container = this.closest('.contract-qr-container, .modal-qr-container');
                if (container) {
                    // Trigger a click on the container
                    container.click();
                }
            });
        });
        
        console.log('Made QR codes clickable:', qrImages.length);
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
                    
                    // Create new QR code
                    new QRCode(qrElement, {
                        text: offerData[key],
                        width: 100,
                        height: 100,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                    
                    console.log(`Generated QR code for ${key}`);
                    
                    // Make the QR code clickable after a short delay
                    setTimeout(() => {
                        const img = qrElement.querySelector('img');
                        if (img) {
                            img.style.cursor = 'pointer';
                            img.addEventListener('click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                qrElement.parentElement.click();
                            });
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
                    
                    // Create new QR code
                    new QRCode(modalQrElement, {
                        text: offerData[key],
                        width: 200,
                        height: 200,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                    
                    console.log(`Generated modal QR code for ${key}`);
                    
                    // Make the QR code in modal non-clickable (just for display)
                    setTimeout(() => {
                        const img = modalQrElement.querySelector('img');
                        if (img) {
                            // Only make it non-clickable if it's in the embedded-qr container
                            if (modalQrElement.closest('.embedded-qr')) {
                                img.style.cursor = 'default';
                            } else {
                                img.style.cursor = 'pointer';
                                img.addEventListener('click', function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    modalQrElement.parentElement.click();
                                });
                            }
                        }
                    }, 100);
                } catch (error) {
                    console.error(`Error generating modal QR code for ${key}:`, error);
                }
            } else {
                console.warn(`Modal QR element not found for ${key}`);
            }
        });
        
        // Make QR codes clickable (except those in embedded-qr containers)
        setTimeout(() => {
            makeQRCodesClickable();
        }, 500);
    }
    
    // Function to generate a large QR code for the QR modal
    function generateLargeQRCode(specialistKey, element) {
        // Check if element exists
        if (!element) {
            console.error('QR code element not found');
            return;
        }
        
        console.log('Generating QR code for key:', specialistKey);
        
        // Clear any existing QR code
        element.innerHTML = '';
        
        // Sample offer URLs (in a real implementation, these would be actual Chia offer URLs)
        const offerData = {
            'farm-specialist': 'offer1qqr83wcuu2rykcmqvpsxvgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgr83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgr83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
            'chialisp-dev': 'offer1qqp83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgp83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgp83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
            'security-audit': 'offer1qqz83wcuu2rykcmqvpsxzgqqymnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgz83wcuu2rykcmqvpsxzgqqymnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgz83wcuu2rykcmqvpsxzgqqymnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
            'datalayer-architect': 'offer1qqv83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgv83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgv83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
            'aiops-engineer': 'offer1qqq83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgq83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgq83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
            'infrastructure-specialist': 'offer1qqy83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgy83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgy83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx'
        };
        
        // Check if QRCode library is available
        if (typeof QRCode === 'undefined') {
            console.error('QRCode library not loaded, using fallback');
            createFallbackQRCode(element, `Chia offer for ${specialistKey}`);
            return;
        }
        
        try {
            // Generate the large QR code
            if (offerData[specialistKey]) {
                console.log('Creating QR code with text:', offerData[specialistKey].substring(0, 20) + '...');
                
                // Create a new QR code
                new QRCode(element, {
                    text: offerData[specialistKey],
                    width: 300,
                    height: 300,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
                
                console.log('QR code created successfully');
                
                // Make the QR code clickable after a short delay
                setTimeout(() => {
                    const img = element.querySelector('img');
                    if (img) {
                        img.style.cursor = 'pointer';
                    }
                }, 100);
            } else {
                console.error('No offer data found for key:', specialistKey);
                // Fallback to a generic QR code
                createFallbackQRCode(element, `Chia offer for ${specialistKey}`);
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            // Fallback to a generic QR code
            createFallbackQRCode(element, `Chia offer for ${specialistKey}`);
        }
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
