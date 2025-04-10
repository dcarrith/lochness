/**
 * DeEmp Professional Profile JavaScript
 * Handles loading and displaying professional profiles from Chia offer files
 */

// Global error handler for UI elements
function showError(message, isAlert = false) {
    console.error('Error:', message);
    
    // Try to use error display element
    const errorElement = document.getElementById('upload-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Scroll to error
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (isAlert) {
        // Fallback to alert
        alert(message);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Generate default profile images on load
    generateDefaultProfileImages();
    // DOM Elements
    const offerFileInput = document.getElementById('offer-file');
    const offerUrlInput = document.getElementById('offer-url');
    const parseOfferBtn = document.getElementById('parse-offer-btn');
    const fileNameDisplay = document.getElementById('file-name');
    const uploadError = document.getElementById('upload-error');
    const verifyButton = document.getElementById('verify-button');
    const contactButton = document.getElementById('contact-button');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const verificationModal = document.getElementById('verification-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const verificationCloseBtn = document.getElementById('verification-close-btn');
    
    // Tabs Functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // File input change handler
    offerFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
            readAndParseOfferFile(file);
        } else {
            fileNameDisplay.textContent = 'No file selected';
        }
    });
    
    // Parse offer button click handler
    parseOfferBtn.addEventListener('click', function() {
        const offerUrl = offerUrlInput.value.trim();
        if (offerUrl) {
            parseOfferUrl(offerUrl);
        } else {
            showError('Please enter a valid Chia offer URL or text');
        }
    });
    
    // Verify button click handler with error handling
    if (verifyButton) {
        verifyButton.addEventListener('click', function() {
            verifyCredentials();
        });
    } else {
        console.warn('Verify button not found');
    }
    
    /**
     * Verify credentials using the Chia blockchain
     */
    function verifyCredentials() {
        try {
            // Get the DID value with error handling
            const didElement = document.getElementById('profile-did-value');
            if (!didElement) {
                console.warn('DID element not found');
                showError('Cannot verify: DID information is missing', true);
                return;
            }
            
            const didValue = didElement.textContent;
            
            // Show the verification modal with error handling
            const modal = document.getElementById('verification-modal');
            if (!modal) {
                console.error('Verification modal not found');
                showError('Verification cannot be completed due to a technical issue', true);
                return;
            }
            
            modal.style.display = 'block';
            
            // Reset the verification UI
            resetVerificationUI();
            
            // Start the verification process
            runVerificationProcess(didValue);
        } catch (error) {
            console.error('Error in verification process:', error);
            showError('Verification process failed: ' + error.message, true);
        }
    }
    
    /**
     * Reset the verification UI to initial state
     */
    function resetVerificationUI() {
        // Hide the result and show the steps
        document.getElementById('verification-steps').style.display = 'block';
        document.getElementById('verification-result').style.display = 'none';
        
        // Reset all steps to waiting state
        const steps = document.querySelectorAll('.verification-step');
        steps.forEach(step => {
            step.classList.remove('active', 'completed', 'failed');
            const statusText = step.querySelector('.status-text');
            if (statusText) {
                if (step.getAttribute('data-step') === 'connecting') {
                    statusText.textContent = 'Establishing connection...';
                } else {
                    statusText.textContent = 'Waiting to verify...';
                }
            }
        });
        
        // Reset success/error icons
        document.querySelector('.success-icon').style.display = 'block';
        document.querySelector('.error-icon').style.display = 'none';
    }
    
    /**
     * Safely get DOM element with error handling
     * @param {string} selector - CSS selector for the element
     * @param {string} context - Description of what we're looking for (for error messages)
     * @returns {Element|null} - The found element or null if not found
     */
    function safeQuerySelector(selector, context = 'element') {
        try {
            const element = document.querySelector(selector);
            if (!element) {
                console.warn(`${context} not found: ${selector}`);
            }
            return element;
        } catch (error) {
            console.error(`Error finding ${context}: ${error.message}`);
            return null;
        }
    }
    
    /**
     * Run the verification process for a given DID
     * @param {string} didValue - The DID to verify
     */
    function runVerificationProcess(didValue) {
        // Get all verification steps with error handling
        const connectingStep = safeQuerySelector('.verification-step[data-step="connecting"]', 'Connecting step');
        const didStep = safeQuerySelector('.verification-step[data-step="did"]', 'DID step');
        const credentialsStep = safeQuerySelector('.verification-step[data-step="credentials"]', 'Credentials step');
        const integrityStep = safeQuerySelector('.verification-step[data-step="integrity"]', 'Integrity step');
        
        // Check if required elements exist
        if (!connectingStep || !didStep || !credentialsStep || !integrityStep) {
            console.error('Cannot run verification process: required elements are missing');
            const errorMessage = 'Verification process cannot be completed due to a technical issue. Please try again later.';
            showError(errorMessage);
            return;
        }
        
        // Mark connecting step as active
        connectingStep.classList.add('active');
        
        // Get status text element with error handling
        const connectingStatusText = connectingStep.querySelector('.status-text');
        if (!connectingStatusText) {
            console.warn('Status text element not found in connecting step');
        }
        
        // Simulate connecting to the blockchain
        setTimeout(() => {
            try {
                // Mark connecting as completed
                connectingStep.classList.remove('active');
                connectingStep.classList.add('completed');
                
                if (connectingStatusText) {
                    connectingStatusText.textContent = 'Connected successfully';
                }
            
                // Start DID verification
                didStep.classList.add('active');
                const didStatusText = didStep.querySelector('.status-text');
                if (didStatusText) {
                    didStatusText.textContent = 'Validating DID...';
                }
            
            // Simulate DID verification
            setTimeout(() => {
                // Check if DID is valid (for demo, we'll say yes if it has "chia" in it)
                const isDidValid = didValue.includes('chia');
                
                if (isDidValid) {
                    // DID is valid
                    didStep.classList.remove('active');
                    didStep.classList.add('completed');
                    
                    const didStatusText = didStep.querySelector('.status-text');
                    if (didStatusText) {
                        didStatusText.textContent = 'DID verified on blockchain';
                    }
                    
                    // Start credentials verification
                    credentialsStep.classList.add('active');
                    const credentialsStatusText = credentialsStep.querySelector('.status-text');
                    if (credentialsStatusText) {
                        credentialsStatusText.textContent = 'Checking credentials...';
                    }
                    
                    // Simulate credentials verification
                    setTimeout(() => {
                        // Credentials are valid
                        credentialsStep.classList.remove('active');
                        credentialsStep.classList.add('completed');
                        
                        const credStatusText = credentialsStep.querySelector('.status-text');
                        if (credStatusText) {
                            credStatusText.textContent = 'Credentials validated';
                        }
                        
                        // Start integrity check
                        integrityStep.classList.add('active');
                        const integrityStatusText = integrityStep.querySelector('.status-text');
                        if (integrityStatusText) {
                            integrityStatusText.textContent = 'Verifying signatures...';
                        }
                        
                        // Simulate integrity check
                        setTimeout(() => {
                            // Integrity check passed
                            integrityStep.classList.remove('active');
                            integrityStep.classList.add('completed');
                            
                            const integStatusText = integrityStep.querySelector('.status-text');
                            if (integStatusText) {
                                integStatusText.textContent = 'Integrity verified';
                            }
                            
                            // Show verification result after a short delay
                            setTimeout(() => {
                                showVerificationResult(true, {
                                    issuer: 'Chia Network',
                                    date: 'March 15, 2023',
                                    confirmation: 'Confirmed on block 1234567',
                                    signature: 'Valid'
                                });
                            }, 500);
                            
                        }, 1800); // Integrity check time
                        
                    }, 2000); // Credentials verification time
                    
                } else {
                    // DID is invalid
                    didStep.classList.remove('active');
                    didStep.classList.add('failed');
                    
                    const didStatusText = didStep.querySelector('.status-text');
                    if (didStatusText) {
                        didStatusText.textContent = 'DID verification failed';
                    }
                    
                    // Show verification result with error after a short delay
                    setTimeout(() => {
                        showVerificationResult(false, {
                            error: 'The provided DID could not be verified on the Chia blockchain.'
                        });
                    }, 500);
                }
                
            }, 2500); // DID verification time
            
        }, 2000); // Connection time
    }
    
    /**
     * Simple hash function for strings
     * @param {string} str - The string to hash
     * @returns {number} A numeric hash of the string
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
     * Show the verification result
     * @param {boolean} success - Whether verification was successful
     * @param {Object} details - The verification details
     */
    function showVerificationResult(success, details) {
        try {
            // Get elements with error handling
            const stepsContainer = document.getElementById('verification-steps');
            const resultContainer = document.getElementById('verification-result');
            
            if (!stepsContainer || !resultContainer) {
                console.error('Verification result containers not found');
                return;
            }
            
            // Hide the steps and show the result
            stepsContainer.style.display = 'none';
            resultContainer.style.display = 'block';
            
            const resultTitle = safeQuerySelector('.result-title', 'Result title');
            const resultMessage = safeQuerySelector('.result-message', 'Result message');
            const successIcon = safeQuerySelector('.success-icon', 'Success icon');
            const errorIcon = safeQuerySelector('.error-icon', 'Error icon');
            const credentialDetails = safeQuerySelector('.credential-details', 'Credential details');
            const explorerLink = document.getElementById('verification-explorer-link');
            
            // If any essential elements are missing, show a generic error
            if (!resultTitle || !resultMessage || !successIcon || !errorIcon) {
                console.error('Essential verification result elements not found');
                alert('There was a problem displaying verification results. Please try again.');
                return;
            }
        
            if (success) {
                // Show success UI
                if (resultTitle) resultTitle.textContent = 'Verification Complete';
                if (resultMessage) resultMessage.textContent = 'All credentials verified successfully!';
                if (successIcon) successIcon.style.display = 'block';
                if (errorIcon) errorIcon.style.display = 'none';
                if (credentialDetails) credentialDetails.style.display = 'block';
                
                // Fill in credential details
                const issuerElement = document.getElementById('credential-issuer');
                const dateElement = document.getElementById('credential-date');
                const confirmationElement = document.getElementById('credential-confirmation');
                const signatureElement = document.getElementById('credential-signature');
                
                if (issuerElement) issuerElement.textContent = details.issuer;
                if (dateElement) dateElement.textContent = details.date;
                if (confirmationElement) confirmationElement.textContent = details.confirmation;
                if (signatureElement) signatureElement.textContent = details.signature;
                
                // Set explorer link
                if (explorerLink) {
                    const didElement = document.getElementById('profile-did-value');
                    const didValue = didElement ? didElement.textContent : 'unknown';
                    explorerLink.href = `https://www.chiaexplorer.com/blockchain/coin/${simpleHash(didValue)}`;
                    explorerLink.style.display = 'inline-block';
                }
            
            } else {
                // Show error UI
                if (resultTitle) resultTitle.textContent = 'Verification Failed';
                if (resultMessage) resultMessage.textContent = details.error || 'Unknown verification error';
                if (successIcon) successIcon.style.display = 'none';
                if (errorIcon) errorIcon.style.display = 'block';
                if (credentialDetails) credentialDetails.style.display = 'none';
                if (explorerLink) explorerLink.style.display = 'none';
            }
        } catch (error) {
            console.error('Error showing verification result:', error);
            alert('There was a problem displaying verification results. Please try again.');
        }
    }
    
    // Contact button click handler
    contactButton.addEventListener('click', function() {
        // Scroll to contact form
        const contactSection = document.querySelector('footer');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Modal close button click handlers with better error handling
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            if (verificationModal) {
                verificationModal.style.display = 'none';
            }
        });
    } else {
        console.warn('Modal close button not found');
    }
    
    if (verificationCloseBtn) {
        verificationCloseBtn.addEventListener('click', function() {
            if (verificationModal) {
                verificationModal.style.display = 'none';
            }
        });
    } else {
        console.warn('Verification close button not found');
    }
    
    // Close modal when clicking outside the content
    if (verificationModal) {
        window.addEventListener('click', function(event) {
            if (event.target === verificationModal) {
                verificationModal.style.display = 'none';
            }
        });
    } else {
        console.warn('Verification modal not found, cannot add click listener');
    }
    
    // Check for offer parameter in URL
    checkForOfferInUrl();
    
    // Load sample profile data if available
    loadSampleProfileData();
    
    /**
     * Read and parse an offer file
     * @param {File} file - The offer file to read
     */
    function readAndParseOfferFile(file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const offerContent = event.target.result;
                parseOfferContent(offerContent);
            } catch (error) {
                showError('Error reading offer file: ' + error.message);
            }
        };
        
        reader.onerror = function() {
            showError('Error reading the file');
        };
        
        reader.readAsText(file);
    }
    
    /**
     * Parse an offer URL or text
     * @param {string} offerUrl - The offer URL or text to parse
     */
    function parseOfferUrl(offerUrl) {
        try {
            // Show loading indication
            showLoadingState(true);
            
            // In a real implementation, this would make an API call to parse the offer URL
            // For now, we'll extract employment details and show confirmation
            if (offerUrl.startsWith('offer1') || offerUrl.includes('offer1')) {
                extractEmploymentOfferDetails(offerUrl);
            } else {
                showError('Invalid offer format. Offer must begin with "offer1"');
                showLoadingState(false);
            }
        } catch (error) {
            showError('Error parsing offer URL: ' + error.message);
            showLoadingState(false);
        }
    }
    
    /**
     * Parse offer content
     * @param {string} offerContent - The content of the offer file
     */
    function parseOfferContent(offerContent) {
        try {
            // Show loading indication
            showLoadingState(true);
            
            // Check if the offer starts with 'offer1' to simulate offer validation
            if (offerContent.startsWith('offer1') || offerContent.includes('offer1')) {
                // Extract employment details from the offer file
                extractEmploymentOfferDetails(offerContent);
            } else {
                showError('Invalid offer format. Offer must begin with "offer1"');
                showLoadingState(false);
            }
        } catch (error) {
            showError('Error parsing offer content: ' + error.message);
            showLoadingState(false);
        }
    }
    
    /**
     * Check if an offer parameter exists in the URL
     */
    function checkForOfferInUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const offerParam = urlParams.get('offer');
        
        if (offerParam) {
            offerUrlInput.value = offerParam;
            parseOfferUrl(offerParam);
        }
    }
    
    /**
     * Show an error message
     * @param {string} message - The error message to display
     */
    function showError(message) {
        uploadError.textContent = message;
    }
    
    /**
     * Shows or hides loading state
     * @param {boolean} isLoading - Whether to show or hide loading state
     */
    function showLoadingState(isLoading) {
        // Implement loading indicator if needed
        // For now, we'll just disable the button during loading
        if (parseOfferBtn) {
            parseOfferBtn.disabled = isLoading;
            parseOfferBtn.innerHTML = isLoading ? 
                '<i class="fas fa-spinner fa-spin"></i> Loading...' : 
                'Load Profile';
        }
    }
    
    /**
     * Extract employment offer details from offer content
     * @param {string} offerContent - The offer content to parse
     */
    function extractEmploymentOfferDetails(offerContent) {
        try {
            // In a real implementation, this would properly decode the Chia offer
            // For now, we'll extract simulated data based on the offer content
            
            // Generate deterministic details based on the offer content hash
            const offerHash = simpleHash(offerContent);
            
            // Determine position type based on offer content
            let position, rate, term, skills;
            
            if (offerContent.includes('farm') || offerContent.includes('tractor')) {
                position = "Farm Optimization Specialist";
                rate = "0.3 XCH per hour";
                term = "15 hours";
                skills = ["Chia Farming", "Performance Optimization", "Hardware Configuration"];
            } else if (offerContent.includes('code') || offerContent.includes('dev') || offerContent.includes('chialisp')) {
                position = "Chialisp Smart Contract Developer";
                rate = "0.5 XCH per hour";
                term = "20 hours";
                skills = ["Chialisp", "Smart Contracts", "Security Auditing"];
            } else if (offerContent.includes('data') || offerContent.includes('layer')) {
                position = "DataLayer Solution Architect";
                rate = "0.6 XCH per hour";
                term = "25 hours";
                skills = ["DataLayer", "System Architecture", "Integration"];
            } else {
                // Default case - generate details based on hash
                const positions = ["Blockchain Consultant", "AIOps Engineer", "Infrastructure Specialist"];
                const rates = ["0.4 XCH per hour", "0.35 XCH per hour", "0.45 XCH per hour"];
                const terms = ["18 hours", "22 hours", "16 hours"];
                const skillSets = [
                    ["Blockchain", "Consulting", "Strategy"],
                    ["AI", "Operations", "Automation"],
                    ["Infrastructure", "DevOps", "Scaling"]
                ];
                
                const index = offerHash % 3;
                position = positions[index];
                rate = rates[index];
                term = terms[index];
                skills = skillSets[index];
            }
            
            // Calculate expiration date (30 days from now)
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            const formattedExpiration = expirationDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Calculate days remaining for the display
            const currentDate = new Date();
            const daysRemaining = Math.ceil((expirationDate - currentDate) / (1000 * 60 * 60 * 24));
            
            // Display the confirmation UI with extracted details
            displayOfferConfirmation({
                position,
                rate,
                term,
                skills,
                expiration: formattedExpiration,
                daysRemaining: daysRemaining,
                offerContent // Store the original offer for submission
            });
            
            // Hide loading state
            showLoadingState(false);
            
        } catch (error) {
            console.error('Error extracting offer details:', error);
            showError('Could not extract employment details from offer');
            showLoadingState(false);
        }
    }
    
    /**
     * Display the offer confirmation UI
     * @param {Object} offerDetails - The extracted offer details
     */
    function displayOfferConfirmation(offerDetails) {
        // Get the confirmation container
        const confirmationContainer = document.getElementById('offer-confirmation');
        if (!confirmationContainer) return;
        
        // Fill in the offer details
        document.getElementById('offer-position').textContent = offerDetails.position;
        document.getElementById('offer-rate').textContent = offerDetails.rate;
        document.getElementById('offer-term').textContent = offerDetails.term;
        
        // Set expiration date with appropriate styling
        const expirationElement = document.getElementById('offer-expiration');
        expirationElement.textContent = offerDetails.expiration;
        
        // Apply color based on days remaining
        expirationElement.className = ''; // Clear existing classes
        if (offerDetails.daysRemaining <= 3) {
            expirationElement.classList.add('expires-critical');
        } else if (offerDetails.daysRemaining <= 10) {
            expirationElement.classList.add('expires-soon');
        } else {
            expirationElement.classList.add('expires-normal');
        }
        
        // Add skills tags
        const skillsContainer = document.getElementById('offer-skills');
        skillsContainer.innerHTML = '';
        offerDetails.skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            skillsContainer.appendChild(skillTag);
        });
        
        // Show the confirmation container
        confirmationContainer.style.display = 'block';
        
        // Scroll to the confirmation section
        confirmationContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Store offer details for submission
        confirmationContainer.dataset.offerContent = offerDetails.offerContent;
        
        // Add event listeners for confirmation buttons
        setupConfirmationButtons(offerDetails);
    }
    
    /**
     * Setup event listeners for confirmation buttons
     * @param {Object} offerDetails - The offer details
     */
    function setupConfirmationButtons(offerDetails) {
        const submitBtn = document.getElementById('submit-offer-btn');
        const cancelBtn = document.getElementById('cancel-offer-btn');
        
        // Remove any existing event listeners
        if (submitBtn._offerListener) {
            submitBtn.removeEventListener('click', submitBtn._offerListener);
        }
        if (cancelBtn._offerListener) {
            cancelBtn.removeEventListener('click', cancelBtn._offerListener);
        }
        
        // Submit button handler
        submitBtn._offerListener = () => {
            submitEmploymentOffer(offerDetails);
        };
        submitBtn.addEventListener('click', submitBtn._offerListener);
        
        // Cancel button handler
        cancelBtn._offerListener = () => {
            document.getElementById('offer-confirmation').style.display = 'none';
        };
        cancelBtn.addEventListener('click', cancelBtn._offerListener);
    }
    
    /**
     * Submit the employment offer
     * @param {Object} offerDetails - The offer details to submit
     */
    function submitEmploymentOffer(offerDetails) {
        try {
            // Show loading state
            const submitBtn = document.getElementById('submit-offer-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            }
            
            // In a real implementation, this would send the offer to a server
            // For now, we'll simulate a successful submission
            setTimeout(() => {
                // Hide the confirmation panel
                document.getElementById('offer-confirmation').style.display = 'none';
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Employment Offer Submitted!</h3>
                    <p>Your offer for <strong>${offerDetails.position}</strong> has been successfully submitted.</p>
                    <p>The offer will expire on <strong class="${offerDetails.daysRemaining <= 3 ? 'expires-critical' : 
                        offerDetails.daysRemaining <= 10 ? 'expires-soon' : 'expires-normal'}">${offerDetails.expiration}</strong>.</p>
                `;
                
                // Add to the uploader container
                const uploaderContainer = document.querySelector('.uploader-container');
                if (uploaderContainer) {
                    // Clear previous content
                    uploaderContainer.innerHTML = '';
                    uploaderContainer.appendChild(successMessage);
                    
                    // Add a button to submit another offer
                    const newOfferBtn = document.createElement('button');
                    newOfferBtn.className = 'btn btn-primary';
                    newOfferBtn.innerHTML = '<i class="fas fa-plus"></i> Submit Another Offer';
                    newOfferBtn.style.marginTop = '20px';
                    newOfferBtn.addEventListener('click', () => {
                        window.location.reload();
                    });
                    
                    uploaderContainer.appendChild(newOfferBtn);
                }
                
                // Reset form if needed
                offerUrlInput.value = '';
                fileNameDisplay.textContent = 'No file selected';
                
                // Log details to console (in a real app, this would be sent to the server)
                console.log('Employment offer submitted:', offerDetails);
                
            }, 1500); // Simulate server processing time
            
        } catch (error) {
            console.error('Error submitting offer:', error);
            showError('Failed to submit employment offer: ' + error.message);
            
            // Re-enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Offer';
            }
        }
    }
    
    /**
     * Load sample profile data for demonstration
     */
    function loadSampleProfileData() {
        // Sample profile data
        const profileData = {
            did: 'did:chia:1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
            name: 'Alex Morgan',
            title: 'Senior Chia Blockchain Engineer & AIOps Specialist',
            summary: 'Experienced blockchain engineer specializing in Chia network architecture, Chialisp smart contract development, and AI-powered operational solutions. With over 5 years in distributed systems and 3 years focused exclusively on Chia blockchain, I bring deep expertise in optimizing farm operations, developing secure smart contracts, and implementing enterprise-grade blockchain solutions.',
            avatar: 'images/profile-avatar.jpg',
            banner: 'images/profile-banner.jpg',
            location: 'San Francisco, CA',
            availability: 'available', // available, unavailable, limited
            responseTime: 'Usually within 4 hours',
            languages: ['English (Native)', 'Spanish (Proficient)', 'Python (Fluent)', 'Chialisp (Expert)'],
            ratings: {
                score: 4.8,
                count: 37
            },
            skills: [
                { name: 'Chialisp Development', level: 95, years: 3 },
                { name: 'Chia Farming', level: 90, years: 4 },
                { name: 'Smart Contract Security', level: 85, years: 5 },
                { name: 'AIOps', level: 80, years: 3 },
                { name: 'DataLayer Architecture', level: 85, years: 2 },
                { name: 'Infrastructure as Code', level: 75, years: 4 },
                { name: 'Blockchain Integration', level: 90, years: 5 },
                { name: 'Performance Optimization', level: 85, years: 6 }
            ],
            certifications: [
                {
                    name: 'Certified Chia Developer',
                    issuer: 'Chia Network',
                    date: 'March 2023',
                    logo: 'images/chia-logo.png',
                    verifyUrl: '#'
                },
                {
                    name: 'Advanced Smart Contract Security',
                    issuer: 'Blockchain Security Alliance',
                    date: 'November 2022',
                    logo: 'images/security-cert.png',
                    verifyUrl: '#'
                },
                {
                    name: 'AI Engineering Certification',
                    issuer: 'Deep Learning Institute',
                    date: 'May 2021',
                    logo: 'images/ai-cert.png',
                    verifyUrl: '#'
                }
            ],
            tools: [
                { name: 'Chia CLI', icon: 'fa-terminal' },
                { name: 'Terraform', icon: 'fa-code-branch' },
                { name: 'Docker', icon: 'fa-docker' },
                { name: 'Kubernetes', icon: 'fa-cubes' },
                { name: 'TensorFlow', icon: 'fa-brain' },
                { name: 'Git', icon: 'fa-code-branch' },
                { name: 'VS Code', icon: 'fa-code' },
                { name: 'AWS', icon: 'fa-cloud' }
            ],
            experience: [
                {
                    role: 'Lead Blockchain Engineer',
                    company: 'ChiaVerse Solutions',
                    location: 'San Francisco, CA',
                    startDate: 'June 2022',
                    endDate: 'Present',
                    description: 'Lead a team developing enterprise blockchain solutions using Chia technology. Architect and implement DataLayer applications for supply chain clients. Optimize Chia farming operations for institutional clients, increasing yield by 30% on average.'
                },
                {
                    role: 'Smart Contract Developer',
                    company: 'DeFi Protocol Labs',
                    location: 'Remote',
                    startDate: 'March 2020',
                    endDate: 'May 2022',
                    description: 'Developed and audited Chialisp smart contracts for decentralized finance applications. Implemented advanced security measures to protect against common vulnerabilities. Created a automated testing framework for Chialisp contracts that reduced bug rate by 45%.'
                },
                {
                    role: 'Blockchain Systems Engineer',
                    company: 'Distributed Systems Inc.',
                    location: 'Seattle, WA',
                    startDate: 'January 2018',
                    endDate: 'February 2020',
                    description: 'Designed and implemented distributed systems using various blockchain technologies. Early adopter of Chia blockchain, developing infrastructure automation tools and monitoring solutions. Led the migration of legacy blockchain systems to more sustainable alternatives.'
                }
            ],
            projects: [
                {
                    name: 'FarmGuard AI',
                    category: 'AIOps',
                    description: 'An AI-powered monitoring and optimization system for Chia farms that uses machine learning to predict and prevent issues before they affect farming efficiency.',
                    image: 'images/project-1.jpg',
                    link: '#'
                },
                {
                    name: 'ChiaTrack Supply Chain',
                    category: 'Enterprise',
                    description: 'A supply chain tracking solution built on Chia DataLayer that provides immutable records of product journeys from manufacturing to retail.',
                    image: 'images/project-2.jpg',
                    link: '#'
                },
                {
                    name: 'Chialisp Security Scanner',
                    category: 'Security',
                    description: 'An automated tool that scans Chialisp smart contracts for security vulnerabilities and suggests improvements based on best practices.',
                    image: 'images/project-3.jpg',
                    link: '#'
                },
                {
                    name: 'Terraform Chia Provider',
                    category: 'Infrastructure',
                    description: 'A Terraform provider for automating the deployment and management of Chia blockchain infrastructure on various cloud platforms.',
                    image: 'images/project-4.jpg',
                    link: '#'
                }
            ],
            education: [
                {
                    degree: 'Master of Science in Computer Science',
                    institution: 'Stanford University',
                    location: 'Stanford, CA',
                    startDate: '2015',
                    endDate: '2017',
                    description: 'Specialized in distributed systems and cryptography. Thesis on optimization algorithms for blockchain consensus mechanisms.',
                    logo: 'images/stanford-logo.png'
                },
                {
                    degree: 'Bachelor of Science in Computer Engineering',
                    institution: 'University of Washington',
                    location: 'Seattle, WA',
                    startDate: '2011',
                    endDate: '2015',
                    description: 'Graduated with honors. Focus on software engineering and computer architecture.',
                    logo: 'images/uw-logo.png'
                }
            ],
            contracts: [
                {
                    title: 'Farm Optimization Specialist',
                    icon: 'fa-tractor',
                    rate: '0.3 XCH/hour',
                    minHours: '15 hours',
                    availability: 'Within 48 hours',
                    puzzle: 'p2_delegation_puzzle_hash...',
                    description: 'I will analyze your Chia farm setup and implement optimizations to improve efficiency, reduce response times, and maximize rewards.',
                    offerFile: 'farm-specialist.offer'
                },
                {
                    title: 'Chialisp Smart Contract Developer',
                    icon: 'fa-code',
                    rate: '0.5 XCH/hour',
                    minHours: '20 hours',
                    availability: 'Within 72 hours',
                    puzzle: 'p2_delegation_puzzle_hash...',
                    description: 'Custom smart contract development for your specific use case, with security best practices and thorough documentation.',
                    offerFile: 'developer.offer'
                },
                {
                    title: 'DataLayer Solution Architect',
                    icon: 'fa-database',
                    rate: '0.6 XCH/hour',
                    minHours: '25 hours',
                    availability: 'Within 1 week',
                    puzzle: 'p2_delegation_puzzle_hash...',
                    description: 'End-to-end design and implementation of DataLayer solutions for your business needs, including data modeling and integration.',
                    offerFile: 'datalayer.offer'
                }
            ]
        };
        
        // Render profile data
        renderProfile(profileData);
    }
    
    /**
     * Create a fallback QR code using an external service
     * @param {HTMLElement} element - The element to append the QR code to
     * @param {string} text - The text to encode in the QR code
     */
    function createFallbackQRCode(element, text) {
        if (!element) {
            console.warn('Cannot create fallback QR code: container element is null');
            return;
        }
        
        try {
            // Clear existing content
            element.innerHTML = '';
            
            // First try with local placeholder - more reliable than external API
            const img = document.createElement('img');
            img.src = getPlaceholder('QR_CODE');
            img.alt = 'QR Code';
            img.width = 200;
            img.height = 200;
            
            // Add text overlay to indicate this is a placeholder
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.color = '#555';
            overlay.style.backgroundColor = 'rgba(255,255,255,0.7)';
            overlay.style.borderRadius = '5px';
            overlay.style.fontSize = '12px';
            overlay.style.textAlign = 'center';
            overlay.style.padding = '5px';
            overlay.textContent = 'Sample QR Code\n(For demonstration)';
            
            // Create a wrapper with relative positioning
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.width = '200px';
            wrapper.style.height = '200px';
            
            wrapper.appendChild(img);
            wrapper.appendChild(overlay);
            element.appendChild(wrapper);
            
        } catch (error) {
            console.warn('Error creating fallback QR code:', error);
            element.innerHTML = `<div style="width:200px;height:200px;display:flex;align-items:center;justify-content:center;border:1px solid #ddd;font-size:12px;text-align:center;">QR Code<br>Unavailable</div>`;
        }
    }

    /**
     * Generate default profile images
     */
    function generateDefaultProfileImages() {
        // Generate a default avatar with LG (Lochness Group) initials
        try {
            if (typeof generateProfileAvatar === 'function') {
                generateProfileAvatar('Lochness Group', 'profile-avatar');
            } else {
                // Fallback if profile image generator is not available
                const avatarElement = document.getElementById('profile-avatar');
                if (avatarElement) {
                    avatarElement.innerHTML = `
                        <div style="width: 100%; height: 100%; background-color: #3498db; display: flex; justify-content: center; align-items: center; color: white; font-size: 36px; font-weight: bold; border-radius: 50%;">
                            LG
                        </div>
                    `;
                }
            }
        } catch (error) {
            console.warn('Error generating profile image:', error);
            // Fallback in case of error
            const avatarElement = document.getElementById('profile-avatar');
            if (avatarElement) {
                avatarElement.innerHTML = `
                    <div style="width: 100%; height: 100%; background-color: #3498db; display: flex; justify-content: center; align-items: center; color: white; font-size: 36px; font-weight: bold; border-radius: 50%;">
                        ${profile ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'LG'}
                    </div>
                `;
            }
        }
    }

    /**
     * Render profile data to the page
     * @param {Object} profile - The profile data to render
     */
    function renderProfile(profile) {
        // Generate profile avatar
        if (typeof generateProfileAvatar === 'function') {
            generateProfileAvatar(profile.name, 'profile-avatar');
        } else {
            // Fallback to static image if generator not available
            const avatarElement = document.getElementById('profile-avatar');
            if (avatarElement) {
                avatarElement.innerHTML = `<img src="${profile.avatar}" alt="${profile.name}">`;
            }
        }
        
        // Set basic profile info safely with error handling
        const elements = {
            'profile-name': profile.name || 'Unknown Name',
            'profile-title': profile.title || 'Professional',
            'profile-did-value': profile.did || 'did:chia:unknown'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
        
        // Set overview information
        document.getElementById('profile-summary').textContent = profile.summary;
        document.getElementById('profile-location').textContent = profile.location;
        document.getElementById('profile-response-time').textContent = profile.responseTime;
        
        // Set ratings
        const ratingsElement = document.getElementById('profile-ratings');
        if (ratingsElement) {
            const ratingScore = ratingsElement.querySelector('.rating-score');
            const ratingCount = ratingsElement.querySelector('.rating-count');
            if (ratingScore && ratingCount) {
                ratingScore.textContent = profile.ratings.score;
                ratingCount.textContent = `(${profile.ratings.count} reviews)`;
            }
        }
        
        // Set availability
        const availabilityElement = document.getElementById('profile-availability');
        if (availabilityElement) {
            const statusElement = availabilityElement.querySelector('.availability-status');
            if (statusElement) {
                statusElement.textContent = profile.availability === 'available' ? 'Available for work' : 
                                          profile.availability === 'limited' ? 'Limited availability' : 'Not available';
                statusElement.classList.add(profile.availability);
            }
        }
        
        // Set languages
        const languagesElement = document.getElementById('profile-languages');
        if (languagesElement) {
            languagesElement.innerHTML = profile.languages.map(lang => `<li>${lang}</li>`).join('');
        }
        
        // Render skills
        renderSkills(profile.skills);
        
        // Render certifications
        renderCertifications(profile.certifications);
        
        // Render tools
        renderTools(profile.tools);
        
        // Render work experience
        renderWorkExperience(profile.experience);
        
        // Render projects
        renderProjects(profile.projects);
        
        // Render education
        renderEducation(profile.education);
        
        // Render contracts
        renderContracts(profile.contracts);
    }
    
    /**
     * Render skills to the page
     * @param {Array} skills - The skills to render
     */
    function renderSkills(skills) {
        const skillsContainer = document.getElementById('skills-container');
        if (!skillsContainer) return;
        
        skillsContainer.innerHTML = '';
        
        skills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
                <div class="skill-name">${skill.name}</div>
                <div class="skill-level">
                    <div class="skill-level-fill" style="width: ${skill.level}%"></div>
                </div>
                <div class="skill-years">${skill.years} year${skill.years !== 1 ? 's' : ''} experience</div>
            `;
            
            skillsContainer.appendChild(skillCard);
        });
    }
    
    /**
     * Render certifications to the page
     * @param {Array} certifications - The certifications to render
     */
    function renderCertifications(certifications) {
        const certsContainer = document.getElementById('certifications-container');
        if (!certsContainer) return;
        
        certsContainer.innerHTML = '';
        
        certifications.forEach(cert => {
            const certCard = document.createElement('div');
            certCard.className = 'certification-card';
            certCard.innerHTML = `
                <div class="certification-logo">
                    <img src="${cert.logo}" alt="${cert.name}" onerror="this.src=getPlaceholder('CERTIFICATION'); this.style.width='80px'; this.style.height='80px';">
                </div>
                <div class="certification-details">
                    <div class="certification-name">${cert.name}</div>
                    <div class="certification-issuer">${cert.issuer}</div>
                    <div class="certification-date">Issued ${cert.date}</div>
                    <a href="${cert.verifyUrl}" class="certification-verify">
                        <i class="fas fa-check-circle"></i> Verify
                    </a>
                </div>
            `;
            
            certsContainer.appendChild(certCard);
        });
    }
    
    /**
     * Render tools to the page
     * @param {Array} tools - The tools to render
     */
    function renderTools(tools) {
        const toolsContainer = document.getElementById('tools-container');
        if (!toolsContainer) return;
        
        toolsContainer.innerHTML = '';
        
        tools.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            
            let iconHtml = '';
            try {
                if (tool.icon && tool.icon.startsWith('fa-')) {
                    iconHtml = `<i class="fas ${tool.icon}"></i>`;
                } else if (tool.icon) {
                    iconHtml = `<img src="${tool.icon}" alt="${tool.name}" onerror="this.src=getPlaceholder('TOOL'); this.style.width='24px'; this.style.height='24px';">`;
                } else {
                    iconHtml = `<i class="fas fa-tools" onerror="this.outerHTML='<span>🛠️</span>';"></i>`;
                }
            } catch (error) {
                console.warn('Error creating tool icon:', error);
                iconHtml = `<i class="fas fa-tools"></i>`;
            }
            
            toolCard.innerHTML = `
                <div class="tool-icon">
                    ${iconHtml}
                </div>
                <div class="tool-name">${tool.name}</div>
            `;
            
            toolsContainer.appendChild(toolCard);
        });
    }
    
    /**
     * Render work experience to the page
     * @param {Array} experience - The work experience to render
     */
    function renderWorkExperience(experience) {
        const experienceContainer = document.getElementById('work-experience-timeline');
        if (!experienceContainer) return;
        
        experienceContainer.innerHTML = '';
        
        experience.forEach(job => {
            const jobItem = document.createElement('div');
            jobItem.className = 'timeline-item';
            jobItem.innerHTML = `
                <div class="timeline-date">${job.startDate} - ${job.endDate}</div>
                <h4 class="timeline-role">${job.role}</h4>
                <div class="timeline-company">${job.company} | ${job.location}</div>
                <p class="timeline-description">${job.description}</p>
            `;
            
            experienceContainer.appendChild(jobItem);
        });
    }
    
    /**
     * Render projects to the page
     * @param {Array} projects - The projects to render
     */
    function renderProjects(projects) {
        const projectsContainer = document.getElementById('projects-container');
        if (!projectsContainer) return;
        
        projectsContainer.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-img">
                    <img src="${project.image}" alt="${project.name}" onerror="this.src=getPlaceholder('PROJECT'); this.style.width='100%'; this.style.height='auto';">
                </div>
                <div class="project-details">
                    <h4 class="project-name">${project.name}</h4>
                    <span class="project-category">${project.category}</span>
                    <p class="project-description">${project.description}</p>
                    <a href="${project.link}" class="project-link">
                        <i class="fas fa-external-link-alt"></i> View Project
                    </a>
                </div>
            `;
            
            projectsContainer.appendChild(projectCard);
        });
    }
    
    /**
     * Render education to the page
     * @param {Array} education - The education to render
     */
    function renderEducation(education) {
        const educationContainer = document.getElementById('education-container');
        if (!educationContainer) return;
        
        educationContainer.innerHTML = '';
        
        education.forEach(edu => {
            const eduItem = document.createElement('div');
            eduItem.className = 'education-item';
            eduItem.innerHTML = `
                <div class="education-logo">
                    <img src="${edu.logo}" alt="${edu.institution}" onerror="this.src=getPlaceholder('EDUCATION'); this.style.width='80px'; this.style.height='80px';">
                </div>
                <div class="education-details">
                    <h4 class="education-degree">${edu.degree}</h4>
                    <div class="education-institution">${edu.institution} | ${edu.location}</div>
                    <div class="education-dates">${edu.startDate} - ${edu.endDate}</div>
                    <p class="education-description">${edu.description}</p>
                </div>
            `;
            
            educationContainer.appendChild(eduItem);
        });
    }
    
    /**
     * Render smart contracts to the page
     * @param {Array} contracts - The contracts to render
     */
    function renderContracts(contracts) {
        const contractsContainer = document.getElementById('contracts-container');
        if (!contractsContainer) return;
        
        contractsContainer.innerHTML = '';
        
        contracts.forEach(contract => {
            const contractCard = document.createElement('div');
            contractCard.className = 'contract-card';
            contractCard.innerHTML = `
                <div class="contract-header">
                    <h3 class="contract-title">
                        <i class="fas ${contract.icon}"></i>
                        ${contract.title}
                    </h3>
                </div>
                <div class="contract-body">
                    <div class="contract-qr-container">
                        <div class="contract-qr-code" id="qr-${contract.title.toLowerCase().replace(/\s+/g, '-')}"></div>
                    </div>
                    <div class="contract-details">
                        <div class="contract-detail">
                            <span class="detail-label">Rate:</span>
                            <span class="detail-value">${contract.rate}</span>
                        </div>
                        <div class="contract-detail">
                            <span class="detail-label">Minimum Term:</span>
                            <span class="detail-value">${contract.minHours}</span>
                        </div>
                        <div class="contract-detail">
                            <span class="detail-label">Availability:</span>
                            <span class="detail-value">${contract.availability}</span>
                        </div>
                    </div>
                    <p class="contract-description">${contract.description}</p>
                    <div class="contract-actions">
                        <a href="${contract.offerFile}" class="btn btn-primary">
                            <i class="fas fa-download"></i> Download Offer
                        </a>
                        <button class="btn btn-secondary copy-puzzle" data-puzzle="${contract.puzzle}">
                            <i class="fas fa-copy"></i> Copy Puzzle
                        </button>
                    </div>
                </div>
            `;
            
            contractsContainer.appendChild(contractCard);
            
            // Generate QR code for this contract
            // Defer QR code generation to ensure DOM is fully updated
            setTimeout(() => {
                try {
                    const qrElementId = `qr-${contract.title.toLowerCase().replace(/\s+/g, '-')}`;
                    const qrContainer = document.getElementById(qrElementId);
                    
                    if (!qrContainer) {
                        console.warn(`QR container not found: #${qrElementId}`);
                        return;
                    }
                    
                    // Add a loading placeholder
                    qrContainer.innerHTML = '<div style="width:200px;height:200px;display:flex;align-items:center;justify-content:center;background:#f5f5f5;">Loading QR...</div>';
                    
                    // Ensure QRCode is available before using it
                    if (typeof QRCode === 'function') {
                        try {
                            // Clear container before creating QR code
                            qrContainer.innerHTML = '';
                            
                            new QRCode(qrContainer, {
                                text: `offer1${contract.puzzle.substring(0, 20)}...`,
                                width: 200,
                                height: 200,
                                colorDark: "#000000",
                                colorLight: "#ffffff",
                                correctLevel: QRCode.CorrectLevel.H
                            });
                        } catch (qrError) {
                            console.warn(`Error generating QR code with library: ${qrError.message}`);
                            createFallbackQRCode(qrContainer, `offer1${contract.puzzle.substring(0, 20)}...`);
                        }
                    } else {
                        // Fallback if QRCode library is not available
                        console.log('QRCode library not available, using fallback');
                        createFallbackQRCode(qrContainer, `offer1${contract.puzzle.substring(0, 20)}...`);
                    }
                } catch (error) {
                    console.error('Fatal error in QR code generation:', error);
                }
            }, 100); // Short delay to ensure DOM is ready
        });
        
        // Add event listeners for copy puzzle buttons
        document.querySelectorAll('.copy-puzzle').forEach(button => {
            button.addEventListener('click', function() {
                const puzzle = this.getAttribute('data-puzzle');
                navigator.clipboard.writeText(puzzle).then(() => {
                    // Change button text temporarily
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                });
            });
        });
    }
});
