/**
 * DataLayer Registration Module
 * Handles storing and retrieving registration data from Chia DataLayer
 */

// Constants
const REGISTRATION_SINGLETON_ID = "1eca2d73e8c5741748de08fb3fcf7bd43b1d70fe23d90c452168a7aa9c3a37b2"; // Example ID, should be replaced with actual singleton ID
const REGISTRATION_DATA_KEY = "application_data";
const REGISTRATION_STATUS_KEY = "application_status";
const REGISTRATION_VOTES_KEY = "member_votes";

// Application statuses
const APPLICATION_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    NEEDS_INFO: "needs_info"
};

/**
 * Prepares registration data for DataLayer storage
 * @param {Object} formData - The form data object
 * @returns {Object} - Formatted data for DataLayer storage
 */
function prepareRegistrationData(formData) {
    // Create unique application ID based on applicant name and timestamp
    const applicationId = createApplicationId(formData['full-name']);
    
    // Format the data for DataLayer storage
    const registrationData = {
        applicationId: applicationId,
        timestamp: new Date().toISOString(),
        status: APPLICATION_STATUS.PENDING,
        personalInfo: {
            fullName: formData['full-name'],
            professionalTitle: formData['professional-title'],
            email: formData['email'],
            phone: formData['phone'] || null,
            location: formData['location'],
            languages: formData['languages'].split(',').map(lang => lang.trim()),
            summary: formData['about']
        },
        expertise: collectExpertiseData(formData),
        skills: collectSkillsData(formData),
        experience: collectExperienceData(formData),
        projects: collectProjectsData(formData),
        education: collectEducationData(formData),
        blockchain: {
            chiaAddress: formData['chia-address'],
            chiaDid: formData['chia-did'] || null,
        },
        externalLinks: {
            portfolio: formData['portfolio-url'] || null,
            github: formData['github'] || null,
            linkedin: formData['linkedin'] || null
        }
    };
    
    return registrationData;
}

/**
 * Creates a unique application ID
 * @param {string} fullName - The applicant's full name
 * @returns {string} - A unique application ID
 */
function createApplicationId(fullName) {
    const nameHash = simpleHash(fullName).toString(16);
    const timestamp = Date.now().toString(16);
    return `app_${nameHash}_${timestamp}`;
}

/**
 * Collects expertise data from form fields
 */
function collectExpertiseData(formData) {
    // Get checked expertise areas
    const expertiseAreas = [];
    const expertiseMap = {
        'developer': 'Chialisp Developer',
        'farming': 'Farm Specialist',
        'data': 'DataLayer Architect',
        'security': 'Security Auditor',
        'aiops': 'AIOps Engineer',
        'infrastructure': 'Infrastructure Specialist'
    };
    
    // Handle both array and single value cases
    if (Array.isArray(formData['expertise'])) {
        formData['expertise'].forEach(area => {
            if (expertiseMap[area]) {
                expertiseAreas.push(expertiseMap[area]);
            }
        });
    } else if (formData['expertise']) {
        if (expertiseMap[formData['expertise']]) {
            expertiseAreas.push(expertiseMap[formData['expertise']]);
        }
    }
    
    return {
        areas: expertiseAreas,
        hourlyRate: parseFloat(formData['hourly-rate']),
        availability: formData['availability']
    };
}

/**
 * Collects skills data from form fields
 */
function collectSkillsData(formData) {
    return {
        technical: formData['skills'].split(',').map(skill => skill.trim()),
        tools: formData['tools'] ? formData['tools'].split(',').map(tool => tool.trim()) : [],
        certifications: formData['certifications'] || null
    };
}

/**
 * Collects work experience data from form fields
 */
function collectExperienceData(formData) {
    const experiences = [];
    let index = 1;
    
    // Collect all work experiences
    while (formData[`company-${index}`]) {
        experiences.push({
            company: formData[`company-${index}`],
            position: formData[`position-${index}`],
            startDate: formData[`start-date-${index}`],
            endDate: formData[`current-${index}`] === 'on' ? 'Present' : formData[`end-date-${index}`],
            responsibilities: formData[`responsibilities-${index}`]
        });
        index++;
    }
    
    return experiences;
}

/**
 * Collects project data from form fields
 */
function collectProjectsData(formData) {
    const projects = [];
    let index = 1;
    
    // Collect all projects
    while (formData[`project-name-${index}`]) {
        // Only add project if it has a name
        if (formData[`project-name-${index}`].trim()) {
            projects.push({
                name: formData[`project-name-${index}`],
                role: formData[`project-role-${index}`] || null,
                description: formData[`project-description-${index}`] || null,
                url: formData[`project-url-${index}`] || null
            });
        }
        index++;
    }
    
    return projects;
}

/**
 * Collects education data from form fields
 */
function collectEducationData(formData) {
    const education = [];
    let index = 1;
    
    // Collect all education entries
    while (formData[`institution-${index}`]) {
        // Only add education if it has an institution
        if (formData[`institution-${index}`].trim()) {
            education.push({
                institution: formData[`institution-${index}`],
                degree: formData[`degree-${index}`] || null,
                startDate: formData[`edu-start-date-${index}`] || null,
                endDate: formData[`edu-end-date-${index}`] || null,
                fieldOfStudy: formData[`field-of-study-${index}`] || null
            });
        }
        index++;
    }
    
    return education;
}

/**
 * Submits registration data to Chia DataLayer
 * @param {Object} registrationData - The formatted registration data
 * @returns {Promise} - Promise resolving to the DataLayer transaction result
 */
async function submitToDataLayer(registrationData) {
    try {
        // Check if DataLayerUtils is available
        if (!window.DataLayerUtils || typeof window.DataLayerUtils.queryDataLayerMirror !== 'function') {
            throw new Error('DataLayer utilities not available');
        }

        // Get available mirrors
        const mirrors = window.DataLayerUtils.getAvailableMirrors();
        if (!mirrors || mirrors.length === 0) {
            throw new Error('No DataLayer mirrors available');
        }

        // Use the first available mirror
        const mirror = mirrors[0];
        console.log(`Submitting registration to DataLayer via mirror: ${mirror}`);

        // Convert registration data to a JSON string
        const registrationJson = JSON.stringify(registrationData);

        // Create the DataLayer update object
        const updateData = {
            singleton_id: REGISTRATION_SINGLETON_ID,
            data_key: `${REGISTRATION_DATA_KEY}_${registrationData.applicationId}`,
            data_value: registrationJson
        };

        // Submit the update to DataLayer
        const result = await window.DataLayerUtils.submitDataLayerUpdate(
            mirror,
            updateData.singleton_id,
            updateData.data_key,
            updateData.data_value
        );

        return {
            success: true,
            transactionId: result.transactionId || "simulation_txid_" + Date.now(),
            message: "Registration submitted to DataLayer successfully"
        };
    } catch (error) {
        console.error("Error submitting to DataLayer:", error);
        return {
            success: false,
            error: error.message || "Unknown error submitting to DataLayer"
        };
    }
}

/**
 * Checks if a registration already exists for a given email or Chia address
 * @param {string} email - The applicant's email
 * @param {string} chiaAddress - The applicant's Chia address
 * @returns {Promise<boolean>} - Whether a registration already exists
 */
async function checkExistingRegistration(email, chiaAddress) {
    try {
        // This would need to be implemented to query DataLayer for existing registrations
        // For now, we'll simulate this with a mock implementation
        return false; // No existing registration found
    } catch (error) {
        console.error("Error checking existing registration:", error);
        throw error;
    }
}

/**
 * Simple hash function (copied from profile.js)
 * @param {string} str - The string to hash
 * @returns {number} - The hash value
 */
function simpleHash(str) {
    try {
        // Early return for empty or non-string inputs
        if (!str || typeof str !== 'string') return 0;
        
        let hash = 0;
        // Use a standard djb2 hash algorithm
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    } catch (error) {
        console.error("Error in simpleHash:", error);
        return 0;
    }
}

// Export functions for use in other modules
window.DataLayerRegistration = {
    prepareRegistrationData,
    submitToDataLayer,
    checkExistingRegistration,
    APPLICATION_STATUS
};
