// Contracts functionality
document.addEventListener('DOMContentLoaded', function() {
    // Generate QR codes for each contract
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
    const largeQrCode = document.getElementById('large-qr-code');
    const qrSpecialistTitle = document.getElementById('qr-specialist-title');
    const qrRate = document.getElementById('qr-rate');
    const qrTerm = document.getElementById('qr-term');
    const qrDownloadLink = document.getElementById('qr-download-link');
    
    qrContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Find the closest contract card or modal to get the specialist info
            const contractCard = this.closest('.contract-card');
            const contractModal = this.closest('.modal-content');
            
            let specialistType, rate, term, offerFile;
            
            if (contractCard) {
                // Get info from contract card
                specialistType = contractCard.querySelector('h3').textContent;
                rate = contractCard.querySelector('.detail-value').textContent;
                term = contractCard.querySelectorAll('.detail-value')[1].textContent;
                offerFile = contractCard.querySelector('.download-offer').getAttribute('data-offer');
                
                // Get the QR code data
                const qrCodeId = contractCard.querySelector('.qr-code').id;
                const specialistKey = qrCodeId.replace('qr-', '');
                
                // Generate large QR code
                generateLargeQRCode(specialistKey, largeQrCode);
            } else if (contractModal) {
                // Get info from contract modal
                specialistType = contractModal.querySelector('.modal-header h3').textContent;
                const detailRows = contractModal.querySelectorAll('.detail-row');
                rate = detailRows[0].querySelector('.detail-value').textContent;
                term = detailRows[1].querySelector('.detail-value').textContent;
                offerFile = contractModal.querySelector('.download-offer').getAttribute('data-offer');
                
                // Get the QR code data
                const qrCodeId = contractModal.querySelector('.qr-code-large').id;
                const specialistKey = qrCodeId.replace('modal-qr-', '');
                
                // Generate large QR code
                generateLargeQRCode(specialistKey, largeQrCode);
            }
            
            // Update QR modal with specialist info
            qrSpecialistTitle.textContent = specialistType;
            qrRate.textContent = rate;
            qrTerm.textContent = term;
            qrDownloadLink.setAttribute('data-offer', offerFile);
            
            // Open the QR code modal
            qrModal.classList.add('active');
            document.body.classList.add('modal-open');
        });
    });
    
    // Close QR code modal when clicking the close button
    const qrModalClose = qrModal.querySelector('.modal-close');
    qrModalClose.addEventListener('click', function() {
        qrModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    });
    
    // Close QR code modal when clicking outside the content
    qrModal.addEventListener('click', function(e) {
        if (e.target === this) {
            qrModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    });
    
    // Handle download button in QR modal
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
                new QRCode(qrElement, {
                    text: offerData[key],
                    width: 100,
                    height: 100,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
            
            // Also generate for modal elements
            const modalQrElement = document.getElementById(`modal-qr-${key}`);
            if (modalQrElement) {
                new QRCode(modalQrElement, {
                    text: offerData[key],
                    width: 200,
                    height: 200,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        });
    }
    
    // Function to generate a large QR code for the QR modal
    function generateLargeQRCode(specialistKey, element) {
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
        }
    }
});
