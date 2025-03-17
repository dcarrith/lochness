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
});
