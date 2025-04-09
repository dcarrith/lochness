/**
 * DeEmp Professional Profile JavaScript
 * Handles loading and displaying professional profiles from Chia offer files
 */

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
    
    // Verify button click handler
    verifyButton.addEventListener('click', function() {
        alert('Verification process would connect to the Chia blockchain to verify the DID and credentials.');
    });
    
    // Contact button click handler
    contactButton.addEventListener('click', function() {
        // Scroll to contact form
        const contactSection = document.querySelector('footer');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
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
            // In a real implementation, this would make an API call to parse the offer URL
            // For now, we'll simulate it with sample data
            parseOfferContent(offerUrl);
        } catch (error) {
            showError('Error parsing offer URL: ' + error.message);
        }
    }
    
    /**
     * Parse offer content
     * @param {string} offerContent - The content of the offer file
     */
    function parseOfferContent(offerContent) {
        try {
            // In a real implementation, this would decode the Chia offer
            // For demonstration, we'll use sample data
            
            // Check if the offer starts with 'offer1' to simulate offer validation
            if (offerContent.startsWith('offer1') || offerContent.includes('offer1')) {
                loadSampleProfileData();
                // Hide the upload error if previously shown
                uploadError.textContent = '';
                
                // Show success message
                alert('Profile loaded successfully!');
                
                // Scroll to top of profile
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                showError('Invalid offer format. Offer must begin with "offer1"');
            }
        } catch (error) {
            showError('Error parsing offer content: ' + error.message);
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
     * Generate default profile images
     */
    function generateDefaultProfileImages() {
        // Generate a default avatar with LG (Lochness Group) initials
        if (typeof generateProfileAvatar === 'function') {
            generateProfileAvatar('Lochness Group', 'profile-avatar');
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
        
        // Set basic profile info
        document.getElementById('profile-name').textContent = profile.name;
        document.getElementById('profile-title').textContent = profile.title;
        document.getElementById('profile-did-value').textContent = profile.did;
        
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
                    <img src="${cert.logo}" alt="${cert.name}">
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
            
            const iconHtml = tool.icon.startsWith('fa-') 
                ? `<i class="fas ${tool.icon}"></i>` 
                : `<img src="${tool.icon}" alt="${tool.name}">`;
            
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
                    <img src="${project.image}" alt="${project.name}">
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
                    <img src="${edu.logo}" alt="${edu.institution}">
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
            setTimeout(() => {
                const qrContainer = document.getElementById(`qr-${contract.title.toLowerCase().replace(/\s+/g, '-')}`);
                if (qrContainer && window.QRCode) {
                    new QRCode(qrContainer, {
                        text: `offer1${contract.puzzle.substring(0, 20)}...`,
                        width: 200,
                        height: 200,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }
            }, 100);
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
