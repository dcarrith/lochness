/**
 * Chia DataLayer Utilities
 * Handles connections to and interactions with multiple Chia DataLayer mirrors
 */

// DataLayer mirrors configuration
const DATALAYER_MIRRORS = {
    // Default mirrors operated by Lochness Group
    primary: "https://datalayer1.lochnessgroup.com",
    secondary: "https://datalayer2.lochnessgroup.com",
    
    // Community mirrors (examples)
    community1: "https://chia-datalayer-mirror.example.com",
    community2: "https://datalayer.chiaxyz.org",
    
    // Local mirror (if user is running their own node)
    local: "https://localhost:8562"
};

// Fallback in case all mirrors fail
const FALLBACK_ENDPOINT = "https://datalayer-fallback.lochnessgroup.com";

/**
 * Get available DataLayer mirrors
 * @returns {Array} List of available mirror endpoints
 */
function getAvailableMirrors() {
    // In a real implementation, this would detect which mirrors are accessible
    // For now, we'll return all configured mirrors
    return Object.values(DATALAYER_MIRRORS);
}

/**
 * Test connection to a DataLayer mirror
 * @param {string} mirrorUrl - URL of the mirror to test
 * @returns {Promise<boolean>} True if connection successful
 */
async function testMirrorConnection(mirrorUrl) {
    try {
        const response = await fetch(`${mirrorUrl}/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            mode: 'cors',
            // In a real implementation, this would need proper timeout handling
            timeout: 3000
        });
        
        return response.ok;
    } catch (error) {
        console.warn(`Mirror ${mirrorUrl} unreachable:`, error);
        return false;
    }
}

/**
 * Get the best mirror to use for a specific profile
 * @param {Object} profileMetadata - Profile metadata containing mirror information
 * @returns {string} URL of the best mirror to use
 */
async function getBestMirrorForProfile(profileMetadata) {
    if (!profileMetadata) {
        console.warn('No profile metadata provided, using primary mirror');
        return DATALAYER_MIRRORS.primary;
    }
    
    // If profile specifies mirrors, try those first
    if (profileMetadata.mirrors && Array.isArray(profileMetadata.mirrors) && profileMetadata.mirrors.length > 0) {
        // Try each specified mirror
        for (const mirror of profileMetadata.mirrors) {
            if (await testMirrorConnection(mirror)) {
                return mirror;
            }
        }
    }
    
    // If profile preferred mirrors failed or weren't specified, try known mirrors
    const availableMirrors = getAvailableMirrors();
    for (const mirror of availableMirrors) {
        if (await testMirrorConnection(mirror)) {
            return mirror;
        }
    }
    
    // If all else fails, return the fallback endpoint
    console.warn('All mirrors failed, using fallback endpoint');
    return FALLBACK_ENDPOINT;
}

/**
 * Query a DataLayer mirror for profile data
 * @param {string} did - The DID of the profile to query
 * @param {string} mirrorUrl - URL of the mirror to query
 * @returns {Promise<Object>} Profile data
 */
async function queryProfileFromMirror(did, mirrorUrl) {
    try {
        if (!did) {
            throw new Error('DID is required');
        }
        
        // Log which mirror we're using
        console.log(`Querying profile ${did} from mirror: ${mirrorUrl}`);
        
        // In a real implementation, this would make proper API calls to the Chia DataLayer
        // For example: `${mirrorUrl}/api/datalayer/profiles/${did}`
        const response = await fetch(`${mirrorUrl}/api/profiles/${did}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`Mirror returned status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error querying profile from mirror ${mirrorUrl}:`, error);
        throw error;
    }
}

/**
 * Get profile data from the DataLayer
 * @param {string} did - The DID of the profile to retrieve
 * @param {Object} [profileMetadata] - Optional metadata containing mirror information
 * @returns {Promise<Object>} Profile data
 */
async function getProfileFromDataLayer(did, profileMetadata = null) {
    try {
        // Get the best mirror for this profile
        const mirrorUrl = await getBestMirrorForProfile(profileMetadata);
        
        // Query the profile from the mirror
        return await queryProfileFromMirror(did, mirrorUrl);
    } catch (error) {
        console.error('Failed to get profile from DataLayer:', error);
        
        // For demo purposes, return mock profile data if all queries fail
        return getMockProfileData(did);
    }
}

/**
 * Get mock profile data for demonstration
 * @param {string} did - The DID to generate mock data for
 * @returns {Object} Mock profile data
 */
function getMockProfileData(did) {
    // This simulates profile data for demo purposes
    // In a real application, this would be fetched from the Chia DataLayer
    return {
        did: did || 'did:chia:1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
        name: 'Alex Morgan',
        title: 'Senior Chia Blockchain Engineer & AIOps Specialist',
        summary: 'Experienced blockchain engineer specializing in Chia network architecture, Chialisp smart contract development, and AI-powered operational solutions.',
        avatar: 'images/profile-avatar.jpg',
        banner: 'images/profile-banner.jpg',
        location: 'San Francisco, CA',
        rating: 4.9,
        reviewCount: 42,
        availability: 'available',
        responseTime: 'Usually within 3 hours',
        languages: ['English', 'Spanish', 'Python', 'Chialisp', 'Rust'],
        rate: 0.5,
        skills: [
            { name: 'Chialisp', level: 95 },
            { name: 'Smart Contracts', level: 90 },
            { name: 'Blockchain Architecture', level: 85 },
            { name: 'Distributed Systems', level: 88 },
            { name: 'AIOps', level: 92 }
        ],
        certifications: [
            { name: 'Chia Network Certified Developer', issuer: 'Chia Network', year: 2022, icon: 'fa-certificate' },
            { name: 'Advanced Distributed Systems Engineering', issuer: 'UC Berkeley', year: 2021, icon: 'fa-university' }
        ],
        experience: [
            { role: 'Lead Blockchain Engineer', company: 'Distributed Ledger Technologies', period: '2021 - Present', description: 'Architecting Chia-based solutions for enterprise clients...' },
            { role: 'Smart Contract Developer', company: 'ChainLogic Systems', period: '2019 - 2021', description: 'Developed secure smart contracts for decentralized applications...' }
        ],
        education: [
            { degree: 'M.S. Computer Science', institution: 'Stanford University', year: '2019', specialization: 'Distributed Systems' }
        ],
        contracts: [
            { type: 'hourly', title: 'Hourly Consulting', rate: '0.5 XCH/hr', minimumHours: 5, description: 'Expert consultation on Chia blockchain implementation and optimization.' },
            { type: 'fixed', title: 'Smart Contract Development', price: '10 XCH', deliverables: 'Custom Chialisp smart contract with documentation and testing.', description: 'End-to-end smart contract development with security review.' }
        ],
        // Metadata about which mirrors host this profile
        dataLayerMetadata: {
            storeId: `0x${did.slice(-40)}`, // Simulated store ID derived from the DID
            mirrors: [
                `https://datalayer${parseInt(did.slice(-2), 16) % 3 + 1}.lochnessgroup.com`, // Deterministic mirror selection
                `https://mirror.chiaxyz.org/${did.slice(9, 15)}`
            ],
            lastUpdated: new Date().toISOString()
        }
    };
}

/**
 * Query DataLayer for profiles matching filter criteria
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} List of profile summaries
 */
async function queryProfilesFromDataLayer(filters = {}) {
    try {
        console.log('Querying profiles with filters:', filters);
        
        // Get available mirrors
        const mirrors = getAvailableMirrors();
        
        // In a real implementation, this would query multiple mirrors with proper
        // load balancing, merge results, and deduplicate profiles
        // For now, we'll use the primary mirror
        
        const primaryMirror = mirrors[0];
        console.log(`Querying profiles from mirror: ${primaryMirror}`);
        
        // Construct query parameters based on filters
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.minRating) queryParams.append('minRating', filters.minRating);
        if (filters.availability) queryParams.append('availability', filters.availability);
        if (filters.maxRate) queryParams.append('maxRate', filters.maxRate);
        
        // In a real implementation, this would be a proper API call
        const response = await fetch(`${primaryMirror}/api/profiles?${queryParams.toString()}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`Mirror returned status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error querying profiles from DataLayer:', error);
        
        // For demo purposes, return mock profiles if DataLayer query fails
        return generateMockProfiles();
    }
}

// Export functions for use in other modules
window.DataLayerUtils = {
    getAvailableMirrors,
    testMirrorConnection,
    getBestMirrorForProfile,
    getProfileFromDataLayer,
    queryProfilesFromDataLayer
};
