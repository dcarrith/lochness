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
        const largeQrCode = document.getElementById('large-qr-code');
        const qrSpecialistTitle = document.getElementById('qr-specialist-title');
        const qrRate = document.getElementById('qr-rate');
        const qrTerm = document.getElementById('qr-term');
        const qrDownloadLink = document.getElementById('qr-download-link');
        
        if (qrContainers.length > 0) {
        qrContainers.forEach(container => {
            container.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Find the closest contract card or modal to get the specialist info
                const contractCard = this.closest('.contract-card');
                const contractModal = this.closest('.modal-content');
                
                let specialistType, rate, term, offerFile;
                let specialistKey;
                
                if (contractCard) {
                    // Get info from contract card
                    specialistType = contractCard.querySelector('h3').textContent;
                    rate = contractCard.querySelector('.detail-value').textContent;
                    term = contractCard.querySelectorAll('.detail-value')[1].textContent;
                    offerFile = contractCard.querySelector('.download-offer').getAttribute('data-offer');
                    
                    // Get the QR code data
                    const qrCodeId = contractCard.querySelector('.qr-code').id;
                    specialistKey = qrCodeId.replace('qr-', '');
                } else if (contractModal) {
                    // Get info from contract modal
                    specialistType = contractModal.querySelector('.modal-header h3').textContent;
                    const detailRows = contractModal.querySelectorAll('.detail-row');
                    rate = detailRows[0].querySelector('.detail-value').textContent;
                    term = detailRows[1].querySelector('.detail-value').textContent;
                    offerFile = contractModal.querySelector('.download-offer').getAttribute('data-offer');
                    
                    // Get the QR code data
                    const qrCodeId = contractModal.querySelector('.qr-code-large').id;
                    specialistKey = qrCodeId.replace('modal-qr-', '');
                }
                
                // Update QR modal with specialist info
                document.getElementById('qr-specialist-title').textContent = specialistType;
                document.getElementById('qr-rate').textContent = rate;
                document.getElementById('qr-term').textContent = term;
                document.getElementById('qr-download-link').setAttribute('data-offer', offerFile);
                
                // Generate large QR code
                generateLargeQRCode(specialistKey, document.getElementById('large-qr-code'));
                
                // Open the QR code modal
                qrModal.classList.add('active');
                document.body.classList.add('modal-open');
            });
        });
    }
    
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
                } catch (error) {
                    console.error(`Error generating modal QR code for ${key}:`, error);
                }
            } else {
                console.warn(`Modal QR element not found for ${key}`);
            }
        });
    }
    
    // Function to generate a large QR code for the QR modal
    function generateLargeQRCode(specialistKey, element) {
        // Check if element exists
        if (!element) {
            console.error('QR code element not found');
            return;
        }
        
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
        
        try {
            // Generate the large QR code
            if (offerData[specialistKey]) {
                new QRCode(element, {
                    text: offerData[specialistKey],
                    width: 300,
                    height: 300,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
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
    }
});
