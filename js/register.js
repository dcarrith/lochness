document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const registrationForm = document.getElementById('registration-form');
    const addExperienceBtn = document.getElementById('add-experience');
    const addProjectBtn = document.getElementById('add-project');
    const addEducationBtn = document.getElementById('add-education');
    const resumeInput = document.getElementById('resume');
    const resumeFileName = document.getElementById('resume-file-name');
    const saveDraftBtn = document.getElementById('save-draft');
    const submissionSuccess = document.getElementById('submission-success');
    
    // Experience counter
    let experienceCounter = 1;
    let projectCounter = 1;
    let educationCounter = 1;
    
    // Initialize form with saved draft if available
    loadSavedDraft();
    
    // Event listeners
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', addExperienceField);
    }
    
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', addProjectField);
    }
    
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', addEducationField);
    }
    
    if (resumeInput) {
        resumeInput.addEventListener('change', updateFileName);
    }
    
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', saveDraft);
    }
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleFormSubmit);
        
        // Add event listeners to current job checkboxes
        document.querySelectorAll('[id^="current-"]').forEach(checkbox => {
            checkbox.addEventListener('change', toggleEndDateField);
        });
    }
    
    // Add Experience Field
    function addExperienceField() {
        experienceCounter++;
        const experienceContainer = document.getElementById('experience-container');
        
        const newExperience = document.createElement('div');
        newExperience.className = 'experience-entry';
        newExperience.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="company-${experienceCounter}">Company/Organization*</label>
                    <input type="text" id="company-${experienceCounter}" name="company-${experienceCounter}" required>
                </div>
                <div class="form-group">
                    <label for="position-${experienceCounter}">Position*</label>
                    <input type="text" id="position-${experienceCounter}" name="position-${experienceCounter}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="start-date-${experienceCounter}">Start Date*</label>
                    <input type="month" id="start-date-${experienceCounter}" name="start-date-${experienceCounter}" required>
                </div>
                <div class="form-group">
                    <label for="end-date-${experienceCounter}">End Date</label>
                    <input type="month" id="end-date-${experienceCounter}" name="end-date-${experienceCounter}">
                    <div class="checkbox-single">
                        <input type="checkbox" id="current-${experienceCounter}" name="current-${experienceCounter}">
                        <label for="current-${experienceCounter}">I currently work here</label>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group full-width">
                    <label for="responsibilities-${experienceCounter}">Key Responsibilities & Achievements*</label>
                    <textarea id="responsibilities-${experienceCounter}" name="responsibilities-${experienceCounter}" rows="3" required></textarea>
                </div>
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-entry" data-entry-type="experience">
                <i class="fas fa-trash"></i> Remove
            </button>
        `;
        
        experienceContainer.appendChild(newExperience);
        
        // Add event listener to current checkbox
        const currentCheckbox = document.getElementById(`current-${experienceCounter}`);
        if (currentCheckbox) {
            currentCheckbox.addEventListener('change', toggleEndDateField);
        }
        
        // Add event listener to remove button
        const removeBtn = newExperience.querySelector('.remove-entry');
        if (removeBtn) {
            removeBtn.addEventListener('click', removeEntry);
        }
    }
    
    // Add Project Field
    function addProjectField() {
        projectCounter++;
        const projectsContainer = document.getElementById('projects-container');
        
        const newProject = document.createElement('div');
        newProject.className = 'project-entry';
        newProject.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="project-name-${projectCounter}">Project Name</label>
                    <input type="text" id="project-name-${projectCounter}" name="project-name-${projectCounter}">
                </div>
                <div class="form-group">
                    <label for="project-role-${projectCounter}">Your Role</label>
                    <input type="text" id="project-role-${projectCounter}" name="project-role-${projectCounter}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group full-width">
                    <label for="project-description-${projectCounter}">Project Description</label>
                    <textarea id="project-description-${projectCounter}" name="project-description-${projectCounter}" rows="3"></textarea>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group full-width">
                    <label for="project-url-${projectCounter}">Project URL/Repository</label>
                    <input type="url" id="project-url-${projectCounter}" name="project-url-${projectCounter}" placeholder="https://...">
                </div>
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-entry" data-entry-type="project">
                <i class="fas fa-trash"></i> Remove
            </button>
        `;
        
        projectsContainer.appendChild(newProject);
        
        // Add event listener to remove button
        const removeBtn = newProject.querySelector('.remove-entry');
        if (removeBtn) {
            removeBtn.addEventListener('click', removeEntry);
        }
    }
    
    // Add Education Field
    function addEducationField() {
        educationCounter++;
        const educationContainer = document.getElementById('education-container');
        
        const newEducation = document.createElement('div');
        newEducation.className = 'education-entry';
        newEducation.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="institution-${educationCounter}">Institution</label>
                    <input type="text" id="institution-${educationCounter}" name="institution-${educationCounter}">
                </div>
                <div class="form-group">
                    <label for="degree-${educationCounter}">Degree/Certification</label>
                    <input type="text" id="degree-${educationCounter}" name="degree-${educationCounter}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="edu-start-date-${educationCounter}">Start Date</label>
                    <input type="month" id="edu-start-date-${educationCounter}" name="edu-start-date-${educationCounter}">
                </div>
                <div class="form-group">
                    <label for="edu-end-date-${educationCounter}">End Date</label>
                    <input type="month" id="edu-end-date-${educationCounter}" name="edu-end-date-${educationCounter}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group full-width">
                    <label for="field-of-study-${educationCounter}">Field of Study</label>
                    <input type="text" id="field-of-study-${educationCounter}" name="field-of-study-${educationCounter}">
                </div>
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-entry" data-entry-type="education">
                <i class="fas fa-trash"></i> Remove
            </button>
        `;
        
        educationContainer.appendChild(newEducation);
        
        // Add event listener to remove button
        const removeBtn = newEducation.querySelector('.remove-entry');
        if (removeBtn) {
            removeBtn.addEventListener('click', removeEntry);
        }
    }
    
    // Update file name display
    function updateFileName() {
        if (resumeInput.files.length > 0) {
            resumeFileName.textContent = resumeInput.files[0].name;
        } else {
            resumeFileName.textContent = 'No file chosen';
        }
    }
    
    // Toggle end date field based on current job checkbox
    function toggleEndDateField(e) {
        const checkbox = e.target;
        const checkboxId = checkbox.id;
        const endDateId = checkboxId.replace('current', 'end-date');
        const endDateField = document.getElementById(endDateId);
        
        if (endDateField) {
            endDateField.disabled = checkbox.checked;
            if (checkbox.checked) {
                endDateField.value = '';
            }
        }
    }
    
    // Remove entry (experience, project, education)
    function removeEntry(e) {
        const button = e.target.closest('.remove-entry');
        const entryType = button.getAttribute('data-entry-type');
        const entryElement = button.closest(`.${entryType}-entry`);
        
        if (entryElement) {
            entryElement.remove();
        }
    }
    
    // Save form draft
    function saveDraft() {
        const formData = new FormData(registrationForm);
        const formObject = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Convert to JSON and store in localStorage
        localStorage.setItem('registrationDraft', JSON.stringify(formObject));
        
        // Show confirmation message
        showNotification('Draft saved successfully!', 'success');
    }
    
    // Load saved draft
    function loadSavedDraft() {
        const savedDraft = localStorage.getItem('registrationDraft');
        
        if (savedDraft && registrationForm) {
            const formObject = JSON.parse(savedDraft);
            
            // Populate simple form fields
            for (const key in formObject) {
                const field = registrationForm.elements[key];
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = formObject[key] === 'on';
                    } else {
                        field.value = formObject[key];
                    }
                }
            }
            
            // Handle expertise checkboxes
            const expertiseValues = formObject['expertise'] || [];
            if (typeof expertiseValues === 'string') {
                document.querySelector(`input[name="expertise"][value="${expertiseValues}"]`).checked = true;
            } else {
                expertiseValues.forEach(value => {
                    const checkbox = document.querySelector(`input[name="expertise"][value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            
            // Check for multiple experiences, projects, and education entries
            const keys = Object.keys(formObject);
            
            // Count experiences
            const experienceNums = keys
                .filter(key => key.startsWith('company-'))
                .map(key => parseInt(key.split('-')[1]))
                .filter(num => num > 1);
            
            // Add experience fields as needed
            const maxExperience = Math.max(0, ...experienceNums);
            for (let i = 1; i < maxExperience; i++) {
                addExperienceField();
            }
            
            // Count projects
            const projectNums = keys
                .filter(key => key.startsWith('project-name-'))
                .map(key => parseInt(key.split('-')[2]))
                .filter(num => num > 1);
            
            // Add project fields as needed
            const maxProject = Math.max(0, ...projectNums);
            for (let i = 1; i < maxProject; i++) {
                addProjectField();
            }
            
            // Count education
            const educationNums = keys
                .filter(key => key.startsWith('institution-'))
                .map(key => parseInt(key.split('-')[1]))
                .filter(num => num > 1);
            
            // Add education fields as needed
            const maxEducation = Math.max(0, ...educationNums);
            for (let i = 1; i < maxEducation; i++) {
                addEducationField();
            }
            
            // Apply the "current job" checkbox functionality
            document.querySelectorAll('[id^="current-"]').forEach(checkbox => {
                if (checkbox.checked) {
                    const endDateId = checkbox.id.replace('current', 'end-date');
                    const endDateField = document.getElementById(endDateId);
                    if (endDateField) {
                        endDateField.disabled = true;
                    }
                }
            });
        }
    }
    
    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate the form
        if (!validateForm()) {
            return;
        }
        
        try {
            // Show loading state
            showLoadingState(true);
            
            // Collect form data
            const formData = new FormData(registrationForm);
            const formObject = {};
            
            formData.forEach((value, key) => {
                // If a checkbox is not checked, it won't be in the FormData
                // If we already have this key, it might be a multi-select value
                if (formObject[key]) {
                    // If it's already an array, push to it
                    if (Array.isArray(formObject[key])) {
                        formObject[key].push(value);
                    } else {
                        // Convert to array with both values
                        formObject[key] = [formObject[key], value];
                    }
                } else {
                    formObject[key] = value;
                }
            });
            
            // Check if DataLayer integration is available
            if (!window.DataLayerRegistration) {
                throw new Error('DataLayer registration module not loaded');
            }
            
            // Check for existing registration
            const emailExists = await window.DataLayerRegistration.checkExistingRegistration(
                formObject['email'],
                formObject['chia-address']
            );
            
            if (emailExists) {
                throw new Error('An application with this email or Chia address already exists');
            }
            
            // Prepare data for DataLayer
            const registrationData = window.DataLayerRegistration.prepareRegistrationData(formObject);
            
            // Submit to DataLayer
            const result = await window.DataLayerRegistration.submitToDataLayer(registrationData);
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to submit application to the blockchain');
            }
            
            // Store transaction ID in session storage for reference
            sessionStorage.setItem('registrationTxId', result.transactionId);
            sessionStorage.setItem('registrationData', JSON.stringify({
                name: formObject['full-name'],
                email: formObject['email'],
                timestamp: new Date().toISOString()
            }));
            
            // Clear the saved draft
            localStorage.removeItem('registrationDraft');
            
            // Show success message
            registrationForm.style.display = 'none';
            if (submissionSuccess) {
                // Update success message with transaction details and replication status
                updateSuccessMessage(result);
                
                submissionSuccess.style.display = 'block';
                
                // Scroll to the success message
                submissionSuccess.scrollIntoView({ behavior: 'smooth' });
            }
            
        } catch (error) {
            console.error('Error submitting application:', error);
            showNotification(error.message || 'An error occurred while submitting your application. Please try again.', 'error');
        } finally {
            showLoadingState(false);
        }
    }
    
    // Update success message with transaction details
    function updateSuccessMessage(result) {
        const txIdElement = document.getElementById('transaction-id');
        const txContainer = document.getElementById('transaction-container');
        
        if (txIdElement && result) {
            const transactionId = typeof result === 'string' ? result : result.transactionId;
            
            if (transactionId) {
                txIdElement.textContent = transactionId;
                
                // Make the transaction ID container visible
                if (txContainer) {
                    txContainer.style.display = 'block';
                    
                    // If we have mirror information, add it to the message
                    if (result.mirrorCount && result.successCount) {
                        // Remove existing replication note if it exists
                        const existingNote = txContainer.querySelector('.replication-status');
                        if (existingNote) {
                            existingNote.remove();
                        }
                        
                        const replicationNote = document.createElement('p');
                        replicationNote.className = 'blockchain-note replication-status';
                        replicationNote.innerHTML = `<strong>Replication Status:</strong> Your application was successfully submitted to ${result.successCount} out of ${result.mirrorCount} available DataLayer mirrors for enhanced reliability.`;
                        txContainer.appendChild(replicationNote);
                    }
                }
            }
        }
    }
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Check required fields
        const requiredFields = registrationForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                highlightInvalidField(field, 'This field is required');
            } else {
                removeInvalidHighlight(field);
            }
        });
        
        // Check expertise checkboxes
        const expertiseChecked = Array.from(
            document.querySelectorAll('input[name="expertise"]:checked')
        ).length > 0;
        
        if (!expertiseChecked) {
            isValid = false;
            showNotification('Please select at least one expertise area', 'error');
        }
        
        // Validate email format
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim() && !isValidEmail(emailField.value)) {
            isValid = false;
            highlightInvalidField(emailField, 'Please enter a valid email address');
        }
        
        // Validate Chia address format (simple validation)
        const chiaAddressField = document.getElementById('chia-address');
        if (chiaAddressField && chiaAddressField.value.trim() && !chiaAddressField.value.trim().startsWith('xch1')) {
            isValid = false;
            highlightInvalidField(chiaAddressField, 'Chia address should start with xch1');
        }
        
        return isValid;
    }
    
    // Email validation
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Highlight invalid field
    function highlightInvalidField(field, message) {
        field.classList.add('invalid');
        
        // Check if error message already exists
        let errorMessage = field.nextElementSibling;
        if (!errorMessage || !errorMessage.classList.contains('error-message')) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            field.parentNode.insertBefore(errorMessage, field.nextSibling);
        }
        
        errorMessage.textContent = message;
    }
    
    // Remove invalid highlight
    function removeInvalidHighlight(field) {
        field.classList.remove('invalid');
        
        // Remove error message if it exists
        const errorMessage = field.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.remove();
        }
    }
    
    // Show notification
    function showNotification(message, type) {
        // Check if notification container exists
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Add close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', function() {
            notification.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Add CSS for notifications and form validation
    const style = document.createElement('style');
    style.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        .notification {
            margin-bottom: 10px;
            padding: 15px;
            border-radius: 5px;
            width: 300px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
            animation: slideIn 0.3s ease;
        }
        
        .notification.success {
            background-color: #d4edda;
            border-left: 4px solid #28a745;
            color: #155724;
        }
        
        .notification.error {
            background-color: #f8d7da;
            border-left: 4px solid #dc3545;
            color: #721c24;
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: inherit;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .invalid {
            border-color: #dc3545 !important;
        }
        
        .error-message {
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 5px;
        }
        
        .btn-danger {
            background-color: #dc3545;
            color: white;
            border: none;
        }
        
        .btn-danger:hover {
            background-color: #c82333;
        }
        
        .remove-entry {
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);
});
