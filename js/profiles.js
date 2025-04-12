/**
 * Profiles.js - Handles loading, displaying, and filtering professional profiles from Chia DataLayer
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('profile-search');
    const searchBtn = document.querySelector('.search-btn');
    const categoryFilter = document.getElementById('category-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const availabilityFilter = document.getElementById('availability-filter');
    const rateFilter = document.getElementById('rate-filter');
    const sortSelect = document.getElementById('sort-select');
    const filterTagsContainer = document.getElementById('filter-tags');
    const resultsCountElement = document.getElementById('results-count');
    const profilesContainer = document.getElementById('profiles-container');
    const paginationContainer = document.getElementById('pagination');
    const loadingSection = document.getElementById('loading-section');
    const emptyResults = document.getElementById('empty-results');
    const connectionError = document.getElementById('connection-error');
    const resetFiltersBtn = document.querySelector('.reset-filters-btn');
    const retryConnectionBtn = document.querySelector('.retry-btn');
    
    // State variables
    let allProfiles = [];
    let filteredProfiles = [];
    let currentPage = 1;
    const profilesPerPage = 12;
    let activeFilters = {};
    
    // Initialize the page
    initProfilesPage();
    
    /**
     * Initialize the profiles page
     */
    function initProfilesPage() {
        // Set initial UI state
        showLoading(true);
        showEmptyResults(false);
        showConnectionError(false);
        
        // Load profiles data
        loadProfilesFromDataLayer()
            .then(profiles => {
                allProfiles = profiles;
                filteredProfiles = [...profiles];
                
                // Initial render
                renderProfiles();
                showLoading(false);
                
                // Add event listeners
                setupEventListeners();
            })
            .catch(error => {
                console.error('Error loading profiles:', error);
                showLoading(false);
                showConnectionError(true);
            });
    }
    
    /**
     * Set up event listeners for filters, search, etc.
     */
    function setupEventListeners() {
        // Search button
        searchBtn.addEventListener('click', applyFilters);
        
        // Enter key in search input
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                applyFilters();
            }
        });
        
        // Filter changes
        categoryFilter.addEventListener('change', applyFilters);
        ratingFilter.addEventListener('change', applyFilters);
        availabilityFilter.addEventListener('change', applyFilters);
        rateFilter.addEventListener('change', applyFilters);
        
        // Sort change
        sortSelect.addEventListener('change', function() {
            sortProfiles();
            renderProfiles();
        });
        
        // Reset filters button
        resetFiltersBtn.addEventListener('click', resetFilters);
        
        // Retry connection button
        retryConnectionBtn.addEventListener('click', retryConnection);
        
        // Filter tags (event delegation)
        filterTagsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-tag') || e.target.parentElement.classList.contains('remove-tag')) {
                const tagElement = e.target.closest('.filter-tag');
                if (tagElement) {
                    const filterType = tagElement.dataset.filterType;
                    removeFilter(filterType);
                }
            }
        });
        
        // Contact buttons (event delegation)
        profilesContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('contact-btn') || e.target.closest('.contact-btn')) {
                const profileCard = e.target.closest('.profile-card');
                if (profileCard) {
                    const did = profileCard.dataset.did;
                    contactProfessional(did);
                }
            }
        });
    }
    
    /**
     * Load profiles from Chia DataLayer
     * @returns {Promise<Array>} Promise resolving to array of profiles
     */
    async function loadProfilesFromDataLayer() {
        try {
            // Use DataLayerUtils if available, otherwise fall back to mock data
            if (window.DataLayerUtils && typeof window.DataLayerUtils.queryProfilesFromDataLayer === 'function') {
                console.log('Fetching profiles from Chia DataLayer mirrors...');
                
                // Get filters from URL query parameters if any
                const urlParams = new URLSearchParams(window.location.search);
                const initialFilters = {};
                
                if (urlParams.has('search')) initialFilters.search = urlParams.get('search');
                if (urlParams.has('category')) initialFilters.category = urlParams.get('category');
                if (urlParams.has('rating')) initialFilters.minRating = parseFloat(urlParams.get('rating'));
                if (urlParams.has('availability')) initialFilters.availability = urlParams.get('availability');
                if (urlParams.has('rate')) initialFilters.maxRate = parseFloat(urlParams.get('rate'));
                
                // Query profiles with these filters
                return await window.DataLayerUtils.queryProfilesFromDataLayer(initialFilters);
            } else {
                console.warn('DataLayerUtils not available, using mock data');
                
                // For this prototype, use a simulated network request
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(generateMockProfiles());
                    }, 1500);
                });
            }
        } catch (error) {
            console.error('Error fetching from DataLayer:', error);
            throw error;
        }
    }
    
    /**
     * Generate mock profiles data for demonstration
     * @returns {Array} Array of profile objects
     */
    function generateMockProfiles() {
        const categories = ['developer', 'farming', 'data', 'security', 'aiops', 'infrastructure'];
        const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Skyler', 'Dakota', 'Cameron', 'Jamie', 'Hayden', 'Jesse'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White'];
        const titles = {
            developer: ['Chialisp Developer', 'Smart Contract Engineer', 'Chia dApp Developer'],
            farming: ['Farm Optimization Specialist', 'Chia Farming Expert', 'Plotting Efficiency Specialist'],
            data: ['DataLayer Architect', 'DataLayer Integration Specialist', 'Chia Data Solutions Expert'],
            security: ['Security Auditor', 'Smart Contract Security Expert', 'Blockchain Security Specialist'],
            aiops: ['AIOps Engineer', 'AI Operations Specialist', 'ML Infrastructure Engineer'],
            infrastructure: ['Infrastructure Specialist', 'DevOps Engineer', 'Chia Node Specialist']
        };
        const skills = {
            developer: ['Chialisp', 'Smart Contracts', 'CLVM', 'DeFi', 'NFTs', 'dApps'],
            farming: ['Farm Monitoring', 'Plotting', 'Hardware Optimization', 'Yield Analysis', 'Network Health'],
            data: ['DataLayer', 'Data Modeling', 'Integration', 'Mirroring', 'API Development'],
            security: ['Security Auditing', 'Vulnerability Assessment', 'Penetration Testing', 'Code Review'],
            aiops: ['Machine Learning', 'Predictive Analytics', 'Automation', 'Monitoring', 'Observability'],
            infrastructure: ['DevOps', 'Terraform', 'Docker', 'Kubernetes', 'AWS', 'High Availability']
        };
        const rates = {
            developer: [0.4, 0.5, 0.6],
            farming: [0.25, 0.3, 0.4],
            data: [0.5, 0.6, 0.7],
            security: [0.6, 0.75, 0.9],
            aiops: [0.7, 0.8, 0.9],
            infrastructure: [0.3, 0.4, 0.5]
        };
        const availability = ['available', 'limited', 'unavailable'];
        
        // Generate 50 mock profiles
        return Array.from({ length: 50 }, (_, i) => {
            // Pick a random category
            const category = categories[Math.floor(Math.random() * categories.length)];
            // Generate a random name
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            // Generate a title based on category
            const title = titles[category][Math.floor(Math.random() * titles[category].length)];
            // Generate random skills based on category
            const categorySkills = skills[category];
            const numSkills = Math.floor(Math.random() * 3) + 2; // 2-4 skills
            const selectedSkills = [];
            for (let j = 0; j < numSkills; j++) {
                const skill = categorySkills[Math.floor(Math.random() * categorySkills.length)];
                if (!selectedSkills.includes(skill)) {
                    selectedSkills.push(skill);
                }
            }
            // Generate a random rate based on category
            const rate = rates[category][Math.floor(Math.random() * rates[category].length)];
            // Generate a random availability
            const availabilityStatus = availability[Math.floor(Math.random() * (i % 10 === 0 ? 3 : 2))]; // Make most available or limited
            // Generate a random rating (weighted toward higher ratings)
            const rating = (4 + (Math.random() * 1)).toFixed(1);
            const reviewCount = Math.floor(Math.random() * 50) + 5;
            
            // Generate a random DID
            const did = `did:chia:${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
            
            return {
                id: i + 1,
                did: did,
                name: `${firstName} ${lastName}`,
                title: title,
                category: category,
                skills: selectedSkills,
                rate: rate,
                availability: availabilityStatus,
                rating: parseFloat(rating),
                reviewCount: reviewCount,
                avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${(i % 70) + 1}.jpg`
            };
        });
    }
    
    /**
     * Apply filters to the profiles data
     */
    function applyFilters() {
        // Get filter values
        const searchText = searchInput.value.trim().toLowerCase();
        const category = categoryFilter.value;
        const minRating = parseFloat(ratingFilter.value);
        const availability = availabilityFilter.value;
        const maxRate = parseFloat(rateFilter.value);
        
        // Clear existing filter tags
        activeFilters = {};
        
        // Apply search filter
        if (searchText) {
            activeFilters.search = searchText;
        }
        
        // Apply category filter
        if (category !== 'all') {
            activeFilters.category = category;
        }
        
        // Apply rating filter
        if (minRating > 0) {
            activeFilters.rating = minRating;
        }
        
        // Apply availability filter
        if (availability !== 'all') {
            activeFilters.availability = availability;
        }
        
        // Apply rate filter
        if (maxRate < 100) {
            activeFilters.rate = maxRate;
        }
        
        // Filter the profiles
        filteredProfiles = allProfiles.filter(profile => {
            // Search text filter
            if (activeFilters.search) {
                const nameMatch = profile.name.toLowerCase().includes(activeFilters.search);
                const titleMatch = profile.title.toLowerCase().includes(activeFilters.search);
                const skillsMatch = profile.skills.some(skill => skill.toLowerCase().includes(activeFilters.search));
                if (!(nameMatch || titleMatch || skillsMatch)) {
                    return false;
                }
            }
            
            // Category filter
            if (activeFilters.category && profile.category !== activeFilters.category) {
                return false;
            }
            
            // Rating filter
            if (activeFilters.rating && profile.rating < activeFilters.rating) {
                return false;
            }
            
            // Availability filter
            if (activeFilters.availability && profile.availability !== activeFilters.availability) {
                return false;
            }
            
            // Rate filter
            if (activeFilters.rate && profile.rate > activeFilters.rate) {
                return false;
            }
            
            return true;
        });
        
        // Reset to first page
        currentPage = 1;
        
        // Sort the filtered profiles
        sortProfiles();
        
        // Update the UI
        renderFilterTags();
        renderProfiles();
    }
    
    /**
     * Sort the filtered profiles based on the selected sort option
     */
    function sortProfiles() {
        const sortBy = sortSelect.value;
        
        switch (sortBy) {
            case 'rating':
                filteredProfiles.sort((a, b) => b.rating - a.rating);
                break;
            case 'rate-low':
                filteredProfiles.sort((a, b) => a.rate - b.rate);
                break;
            case 'rate-high':
                filteredProfiles.sort((a, b) => b.rate - a.rate);
                break;
            case 'name':
                filteredProfiles.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }
    
    /**
     * Render filter tags based on active filters
     */
    function renderFilterTags() {
        filterTagsContainer.innerHTML = '';
        
        // Create tags for each active filter
        Object.entries(activeFilters).forEach(([type, value]) => {
            let tagLabel;
            
            switch (type) {
                case 'search':
                    tagLabel = `Search: ${value}`;
                    break;
                case 'category':
                    tagLabel = `Category: ${getCategoryDisplayName(value)}`;
                    break;
                case 'rating':
                    tagLabel = `Rating: ${value}+ Stars`;
                    break;
                case 'availability':
                    tagLabel = `Availability: ${value === 'available' ? 'Available Now' : 'Limited'}`;
                    break;
                case 'rate':
                    tagLabel = `Max Rate: ${value} XCH`;
                    break;
            }
            
            const tagElement = document.createElement('div');
            tagElement.className = 'filter-tag';
            tagElement.dataset.filterType = type;
            tagElement.innerHTML = `
                ${tagLabel}
                <span class="remove-tag">×</span>
            `;
            
            filterTagsContainer.appendChild(tagElement);
        });
    }
    
    /**
     * Get a display name for a category value
     * @param {string} category - The category value
     * @returns {string} The display name for the category
     */
    function getCategoryDisplayName(category) {
        const displayNames = {
            'developer': 'Smart Contract Developer',
            'farming': 'Farm Specialist',
            'data': 'DataLayer Architect',
            'security': 'Security Auditor',
            'aiops': 'AIOps Engineer',
            'infrastructure': 'Infrastructure Specialist'
        };
        
        return displayNames[category] || category;
    }
    
    /**
     * Remove a filter and re-apply the remaining filters
     * @param {string} filterType - The type of filter to remove
     */
    function removeFilter(filterType) {
        // Reset the corresponding filter input
        switch (filterType) {
            case 'search':
                searchInput.value = '';
                break;
            case 'category':
                categoryFilter.value = 'all';
                break;
            case 'rating':
                ratingFilter.value = '0';
                break;
            case 'availability':
                availabilityFilter.value = 'all';
                break;
            case 'rate':
                rateFilter.value = '100';
                break;
        }
        
        // Re-apply the filters
        applyFilters();
    }
    
    /**
     * Reset all filters to their default values
     */
    function resetFilters() {
        searchInput.value = '';
        categoryFilter.value = 'all';
        ratingFilter.value = '0';
        availabilityFilter.value = 'all';
        rateFilter.value = '100';
        
        // Re-apply filters (which will now clear everything)
        applyFilters();
    }
    
    /**
     * Retry connection to DataLayer
     */
    function retryConnection() {
        showConnectionError(false);
        showLoading(true);
        
        loadProfilesFromDataLayer()
            .then(profiles => {
                allProfiles = profiles;
                filteredProfiles = [...profiles];
                
                renderProfiles();
                showLoading(false);
            })
            .catch(error => {
                console.error('Error loading profiles:', error);
                showLoading(false);
                showConnectionError(true);
            });
    }
    
    /**
     * Render the profile cards to the page
     */
    function renderProfiles() {
        // Calculate pagination values
        const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
        const startIndex = (currentPage - 1) * profilesPerPage;
        const endIndex = Math.min(startIndex + profilesPerPage, filteredProfiles.length);
        const currentProfiles = filteredProfiles.slice(startIndex, endIndex);
        
        // Update results count
        resultsCountElement.textContent = filteredProfiles.length;
        
        // Clear existing profiles
        profilesContainer.innerHTML = '';
        
        // Show empty results message if no profiles match filters
        if (filteredProfiles.length === 0) {
            showEmptyResults(true);
            return;
        } else {
            showEmptyResults(false);
        }
        
        // Create profile cards
        currentProfiles.forEach(profile => {
            const profileCard = createProfileCard(profile);
            profilesContainer.appendChild(profileCard);
        });
        
        // Render pagination
        renderPagination(totalPages);
    }
    
    /**
     * Create a profile card element
     * @param {Object} profile - The profile data
     * @returns {HTMLElement} The profile card element
     */
    function createProfileCard(profile) {
        // Clone the template
        const template = document.getElementById('profile-card-template');
        const profileCard = document.importNode(template.content, true).querySelector('.profile-card');
        
        // Set data attributes
        profileCard.dataset.did = profile.did;
        profileCard.dataset.id = profile.id;
        
        // Include DataLayer metadata for mirror selection
        if (profile.dataLayerMetadata) {
            // Store DataLayer metadata as a serialized data attribute
            profileCard.dataset.mirrors = JSON.stringify(profile.dataLayerMetadata.mirrors || []);
            profileCard.dataset.storeId = profile.dataLayerMetadata.storeId || '';
        }
        
        // Fill in the profile data
        const avatar = profileCard.querySelector('.profile-avatar');
        const name = profileCard.querySelector('.profile-name');
        const title = profileCard.querySelector('.profile-title');
        const skills = profileCard.querySelector('.profile-skills');
        const rate = profileCard.querySelector('.rate-value');
        const availability = profileCard.querySelector('.profile-availability');
        const ratingScore = profileCard.querySelector('.rating-score');
        const ratingCount = profileCard.querySelector('.rating-count');
        const viewProfileLink = profileCard.querySelector('.btn-primary');
        
        // Set the avatar
        avatar.innerHTML = `<img src="${profile.avatar}" alt="${profile.name}" onerror="this.src=getPlaceholder('AVATAR');">`;
        
        // Set the name and title
        name.textContent = profile.name;
        title.textContent = profile.title;
        
        // Set the skills
        skills.innerHTML = '';
        profile.skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            skills.appendChild(skillTag);
        });
        
        // Set the rate
        rate.textContent = `${profile.rate} XCH/hr`;
        
        // Set the availability
        availability.className = `profile-availability ${profile.availability}`;
        availability.innerHTML = `<i class="fas fa-clock"></i> ${profile.availability === 'available' ? 'Available Now' : profile.availability === 'limited' ? 'Limited Availability' : 'Not Available'}`;
        
        // Set the rating
        ratingScore.textContent = profile.rating;
        ratingCount.textContent = `(${profile.reviewCount})`;
        
        // Set up stars
        const stars = profileCard.querySelectorAll('.rating-stars i');
        stars.forEach((star, index) => {
            if (index < Math.floor(profile.rating)) {
                // Full star
                star.className = 'fas fa-star';
            } else if (index < profile.rating) {
                // Half star
                star.className = 'fas fa-star-half-alt';
            } else {
                // Empty star
                star.className = 'far fa-star';
            }
        });
        
        // Set the view profile link
        viewProfileLink.href = `profile.html?did=${profile.did}`;
        
        return profileCard;
    }
    
    /**
     * Render the pagination controls
     * @param {number} totalPages - The total number of pages
     */
    function renderPagination(totalPages) {
        // Clear existing pagination
        paginationContainer.innerHTML = '';
        
        // Don't show pagination for one page or less
        if (totalPages <= 1) return;
        
        // Create pagination items
        
        // Previous button
        const prevButton = document.createElement('div');
        prevButton.className = `pagination-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        if (currentPage > 1) {
            prevButton.addEventListener('click', () => {
                currentPage--;
                renderProfiles();
                // Scroll to top of profiles section
                document.querySelector('.profiles-grid').scrollIntoView({ behavior: 'smooth' });
            });
        }
        paginationContainer.appendChild(prevButton);
        
        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // First page (if not visible)
        if (startPage > 1) {
            const firstPage = document.createElement('div');
            firstPage.className = 'pagination-item';
            firstPage.textContent = '1';
            firstPage.addEventListener('click', () => {
                currentPage = 1;
                renderProfiles();
                document.querySelector('.profiles-grid').scrollIntoView({ behavior: 'smooth' });
            });
            paginationContainer.appendChild(firstPage);
            
            // Ellipsis if needed
            if (startPage > 2) {
                const ellipsis = document.createElement('div');
                ellipsis.className = 'pagination-item disabled';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('div');
            pageItem.className = `pagination-item ${i === currentPage ? 'active' : ''}`;
            pageItem.textContent = i.toString();
            
            if (i !== currentPage) {
                pageItem.addEventListener('click', () => {
                    currentPage = i;
                    renderProfiles();
                    document.querySelector('.profiles-grid').scrollIntoView({ behavior: 'smooth' });
                });
            }
            
            paginationContainer.appendChild(pageItem);
        }
        
        // Last page (if not visible)
        if (endPage < totalPages) {
            // Ellipsis if needed
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('div');
                ellipsis.className = 'pagination-item disabled';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
            
            const lastPage = document.createElement('div');
            lastPage.className = 'pagination-item';
            lastPage.textContent = totalPages.toString();
            lastPage.addEventListener('click', () => {
                currentPage = totalPages;
                renderProfiles();
                document.querySelector('.profiles-grid').scrollIntoView({ behavior: 'smooth' });
            });
            paginationContainer.appendChild(lastPage);
        }
        
        // Next button
        const nextButton = document.createElement('div');
        nextButton.className = `pagination-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        if (currentPage < totalPages) {
            nextButton.addEventListener('click', () => {
                currentPage++;
                renderProfiles();
                document.querySelector('.profiles-grid').scrollIntoView({ behavior: 'smooth' });
            });
        }
        paginationContainer.appendChild(nextButton);
    }
    
    /**
     * Contact a professional (open email or contact form)
     * @param {string} did - The DID of the professional to contact
     */
    function contactProfessional(did) {
        // Find the profile card element to get the DataLayer metadata
        const profileCard = document.querySelector(`.profile-card[data-did="${did}"]`);
        
        if (!profileCard) {
            // If card not found, just navigate to profile without mirror info
            window.location.href = `profile.html?did=${did}#contact`;
            return;
        }
        
        // Get DataLayer metadata from the card
        const mirrors = profileCard.dataset.mirrors || '';
        const storeId = profileCard.dataset.storeId || '';
        
        // Build the URL with mirror information
        let profileUrl = `profile.html?did=${did}`;
        
        // Add DataLayer metadata as query parameters
        if (mirrors) {
            profileUrl += `&mirrors=${encodeURIComponent(mirrors)}`;
        }
        if (storeId) {
            profileUrl += `&storeId=${encodeURIComponent(storeId)}`;
        }
        
        // Navigate to the profile page with the contact section
        window.location.href = `${profileUrl}#contact`;
    }
    
    /**
     * Show or hide the loading section
     * @param {boolean} show - Whether to show or hide the loading section
     */
    function showLoading(show) {
        loadingSection.style.display = show ? 'block' : 'none';
        profilesContainer.style.display = show ? 'none' : 'grid';
        paginationContainer.style.display = show ? 'none' : 'flex';
    }
    
    /**
     * Show or hide the empty results message
     * @param {boolean} show - Whether to show or hide the empty results message
     */
    function showEmptyResults(show) {
        emptyResults.style.display = show ? 'block' : 'none';
        profilesContainer.style.display = show ? 'none' : 'grid';
        paginationContainer.style.display = show ? 'none' : 'flex';
    }
    
    /**
     * Show or hide the connection error message
     * @param {boolean} show - Whether to show or hide the connection error message
     */
    function showConnectionError(show) {
        connectionError.style.display = show ? 'block' : 'none';
        profilesContainer.style.display = show ? 'none' : 'grid';
        paginationContainer.style.display = show ? 'none' : 'flex';
    }
});
