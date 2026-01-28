'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock Data Generator (Simplified version of js/profiles.js logic)
const generateMockProfiles = () => {
    const categories = ['developer', 'farming', 'data', 'security', 'aiops', 'infrastructure'];
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Skyler', 'Dakota', 'Cameron', 'Jamie', 'Hayden', 'Jesse'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White'];
    const titles: Record<string, string[]> = {
        developer: ['Chialisp Developer', 'Smart Contract Engineer', 'Chia dApp Developer'],
        farming: ['Farm Optimization Specialist', 'Chia Farming Expert', 'Plotting Efficiency Specialist'],
        data: ['DataLayer Architect', 'DataLayer Integration Specialist', 'Chia Data Solutions Expert'],
        security: ['Security Auditor', 'Smart Contract Security Expert', 'Blockchain Security Specialist'],
        aiops: ['AIOps Engineer', 'AI Operations Specialist', 'ML Infrastructure Engineer'],
        infrastructure: ['Infrastructure Specialist', 'DevOps Engineer', 'Chia Node Specialist']
    };
    const skillsList: Record<string, string[]> = {
        developer: ['Chialisp', 'Smart Contracts', 'CLVM', 'DeFi', 'NFTs', 'dApps'],
        farming: ['Farm Monitoring', 'Plotting', 'Hardware Optimization', 'Yield Analysis', 'Network Health'],
        data: ['DataLayer', 'Data Modeling', 'Integration', 'Mirroring', 'API Development'],
        security: ['Security Auditing', 'Vulnerability Assessment', 'Penetration Testing', 'Code Review'],
        aiops: ['Machine Learning', 'Predictive Analytics', 'Automation', 'Monitoring', 'Observability'],
        infrastructure: ['DevOps', 'Terraform', 'Docker', 'Kubernetes', 'AWS', 'High Availability']
    };
    const rates: Record<string, number[]> = {
        developer: [0.4, 0.5, 0.6],
        farming: [0.25, 0.3, 0.4],
        data: [0.5, 0.6, 0.7],
        security: [0.6, 0.75, 0.9],
        aiops: [0.7, 0.8, 0.9],
        infrastructure: [0.3, 0.4, 0.5]
    };

    return Array.from({ length: 50 }, (_, i) => {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const title = titles[category][Math.floor(Math.random() * titles[category].length)];
        const categorySkills = skillsList[category];
        const numSkills = Math.floor(Math.random() * 3) + 2;
        const selectedSkills: string[] = [];
        for (let j = 0; j < numSkills; j++) {
            const skill = categorySkills[Math.floor(Math.random() * categorySkills.length)];
            if (!selectedSkills.includes(skill)) selectedSkills.push(skill);
        }
        const rate = rates[category][Math.floor(Math.random() * rates[category].length)];
        const availability = i % 10 === 0 ? 'unavailable' : (i % 3 === 0 ? 'limited' : 'available');
        const rating = (4 + (Math.random() * 1)).toFixed(1);
        const reviewCount = Math.floor(Math.random() * 50) + 5;
        const did = `did:chia:${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;

        return {
            id: i + 1,
            did,
            name: `${firstName} ${lastName}`,
            title,
            category,
            skills: selectedSkills,
            rate,
            availability,
            rating: parseFloat(rating),
            reviewCount,
            avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${(i % 70) + 1}.jpg`
        };
    });
};

interface Profile {
    id: number;
    did: string;
    name: string;
    title: string;
    category: string;
    skills: string[];
    rate: number;
    availability: string;
    rating: number;
    reviewCount: number;
    avatar: string;
}

const ProfilesSection: React.FC = () => {
    const router = useRouter(); // Initialize router
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState('all');
    const [minRating, setMinRating] = useState(0);
    const [availability, setAvailability] = useState('all');
    const [maxRate, setMaxRate] = useState(100);
    const [sortBy, setSortBy] = useState('rating');
    const [currentPage, setCurrentPage] = useState(1);
    const profilesPerPage = 12;

    const DATALAYER_STORE_ID = process.env.NEXT_PUBLIC_DATALAYER_STORE_ID || 'f0d4ca6913401569688081a2571253a652882a8576d3381015f60670868f7767'; // Default or Env

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Determine API URL based on environment (local dev vs prod/k8s)
                // In k8s/docker, nginx proxies /api/datalayer to the RPC service
                // Local dev needs a fallback or assumption that /api/datalayer is available (e.g. via proxy in next.config or manual setup)
                // For this implementation, we assume the Nginx proxy is the primary method.
                const apiUrl = '/api/datalayer/get_keys_values';

                // Note: The RPC endpoint usually expects a POST with the method in the body if generic, 
                // or specific endpoints. Chia RPC structure typically: POST /get_keys_values
                // We configured the proxy to pass to root, so we append the command.

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: DATALAYER_STORE_ID
                    })
                });

                if (!response.ok) {
                    console.warn("DataLayer fetch failed, falling back to mock data");
                    const mockData = generateMockProfiles();
                    setProfiles(mockData);
                    setFilteredProfiles(mockData);
                    return;
                }

                const data = await response.json();

                if (data.success && data.keys_values) {
                    // Transform DataLayer KV pairs to Profile objects
                    // Assumption: Value is a JSON string of the profile
                    const loadedProfiles: Profile[] = data.keys_values.map((kv: any) => {
                        try {
                            // Hex to string decoding might be needed if values are hex encoded
                            // Typically DL returns hex strings.
                            const hexToString = (hex: string) => {
                                let str = '';
                                for (let i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                                return str;
                            };

                            const jsonString = hexToString(kv.value);
                            return JSON.parse(jsonString);
                        } catch (e) {
                            console.error("Failed to parse profile", e);
                            return null;
                        }
                    }).filter((p: any) => p !== null);

                    setProfiles(loadedProfiles);
                    setFilteredProfiles(loadedProfiles);
                } else {
                    console.warn("DataLayer response invalid", data);
                    const mockData = generateMockProfiles();
                    setProfiles(mockData);
                    setFilteredProfiles(mockData);
                }

            } catch (error) {
                console.error("Error loading profiles:", error);
                const mockData = generateMockProfiles();
                setProfiles(mockData);
                setFilteredProfiles(mockData);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        // Apply Filters
        let result = profiles.filter(profile => {
            // Search
            if (searchText) {
                const searchLower = searchText.toLowerCase();
                const nameMatch = profile.name.toLowerCase().includes(searchLower);
                const titleMatch = profile.title.toLowerCase().includes(searchLower);
                const skillsMatch = profile.skills.some(skill => skill.toLowerCase().includes(searchLower));
                if (!(nameMatch || titleMatch || skillsMatch)) return false;
            }
            // Category
            if (category !== 'all' && profile.category !== category) return false;
            // Rating
            if (profile.rating < minRating) return false;
            // Availability
            if (availability !== 'all' && profile.availability !== availability) return false;
            // Rate
            if (profile.rate > maxRate) return false;

            return true;
        });

        // Sort
        switch (sortBy) {
            case 'rating': result.sort((a, b) => b.rating - a.rating); break;
            case 'rate-low': result.sort((a, b) => a.rate - b.rate); break;
            case 'rate-high': result.sort((a, b) => b.rate - a.rate); break;
            case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
        }

        setFilteredProfiles(result);
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [searchText, category, minRating, availability, maxRate, sortBy, profiles]);

    // Pagination
    const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
    const displayProfiles = filteredProfiles.slice((currentPage - 1) * profilesPerPage, currentPage * profilesPerPage);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Triggered via state change in useEffect
    };

    return (
        <section id="profiles" className="profiles-section">
            {/* Header */}
            <div className="profiles-header parallax-section">
                <div className="parallax-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')" }}></div>
                <div className="container">
                    <div className="section-header light">
                        <h1>Professional Profiles</h1>
                        <div className="separator"></div>
                        <p>Connect with verified blockchain professionals through Chia's decentralized identity system</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="search-filter">
                <div className="container">
                    <div className="search-container">
                        <form onSubmit={handleSearch} className="search-input-container">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search by name or skills (e.g., Chialisp, Farming)"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </form>
                        <button className="btn btn-primary search-btn" onClick={handleSearch}>Search</button>
                    </div>

                    <div className="filters-container">
                        <div className="filter-group">
                            <label htmlFor="category-filter">Category</label>
                            <select id="category-filter" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="all">All Categories</option>
                                <option value="developer">Smart Contract Developer</option>
                                <option value="farming">Farm Specialist</option>
                                <option value="data">DataLayer Architect</option>
                                <option value="security">Security Auditor</option>
                                <option value="aiops">AIOps Engineer</option>
                                <option value="infrastructure">Infrastructure Specialist</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="rating-filter">Min Rating</label>
                            <select id="rating-filter" value={minRating} onChange={(e) => setMinRating(parseFloat(e.target.value))}>
                                <option value="0">Any Rating</option>
                                <option value="4.5">4.5 & Up</option>
                                <option value="4.0">4.0 & Up</option>
                                <option value="3.5">3.5 & Up</option>
                                <option value="3.0">3.0 & Up</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="availability-filter">Availability</label>
                            <select id="availability-filter" value={availability} onChange={(e) => setAvailability(e.target.value)}>
                                <option value="all">All</option>
                                <option value="available">Available Now</option>
                                <option value="limited">Limited Availability</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="rate-filter">Max Rate (XCH/hr)</label>
                            <select id="rate-filter" value={maxRate} onChange={(e) => setMaxRate(parseFloat(e.target.value))}>
                                <option value="100">Any Rate</option>
                                <option value="0.3">0.3 XCH</option>
                                <option value="0.5">0.5 XCH</option>
                                <option value="0.8">0.8 XCH</option>
                                <option value="1.0">1.0 XCH</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="profiles-grid">
                <div className="container">
                    <div className="grid-controls">
                        <div className="results-count">
                            Showing <span>{filteredProfiles.length}</span> professionals
                        </div>
                        <div className="sort-controls">
                            <label htmlFor="sort-select">Sort by:</label>
                            <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="rating">Rating (High to Low)</option>
                                <option value="rate-low">Rate (Low to High)</option>
                                <option value="rate-high">Rate (High to Low)</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container" style={{ textAlign: 'center', padding: '40px' }}>
                            <div className="loading-spinner"></div>
                            <p>Loading professionals from Chia DataLayer...</p>
                        </div>
                    ) : (
                        <>
                            {filteredProfiles.length === 0 ? (
                                <div className="empty-results" style={{ textAlign: 'center', padding: '40px' }}>
                                    <i className="fas fa-search" style={{ fontSize: '2rem', color: '#ccc' }}></i>
                                    <h3>No professionals found</h3>
                                    <p>Try adjusting your search filters.</p>
                                    <button className="btn btn-primary" onClick={() => {
                                        setSearchText('');
                                        setCategory('all');
                                        setMinRating(0);
                                        setAvailability('all');
                                        setMaxRate(100);
                                    }}>Reset Filters</button>
                                </div>
                            ) : (
                                <div className="profiles-container">
                                    {displayProfiles.map(profile => (
                                        <div key={profile.id} className="profile-card">
                                            <div className="profile-card-header">
                                                <div className="profile-avatar">
                                                    <img src={profile.avatar} alt={profile.name} />
                                                </div>
                                                <div className="profile-card-rating">
                                                    <span className="rating-score">{profile.rating}</span>
                                                    <div className="rating-stars">
                                                        <i className="fas fa-star"></i>
                                                    </div>
                                                    <span className="rating-count">({profile.reviewCount})</span>
                                                </div>
                                            </div>
                                            <div className="profile-card-body">
                                                <h3 className="profile-name">{profile.name}</h3>
                                                <div className="profile-title">{profile.title}</div>
                                                <div className="profile-skills">
                                                    {profile.skills.slice(0, 3).map(skill => (
                                                        <span key={skill} className="skill-tag">{skill}</span>
                                                    ))}
                                                </div>
                                                <div className="profile-rate">
                                                    <i className="fas fa-tag"></i> <span className="rate-value">{profile.rate} XCH/hr</span>
                                                </div>
                                                <div className={`profile-availability ${profile.availability}`}>
                                                    <i className="fas fa-clock"></i> {profile.availability === 'available' ? 'Available Now' : profile.availability === 'limited' ? 'Limited' : 'Unavailable'}
                                                </div>
                                            </div>
                                            <div className="profile-card-footer">
                                                <Link
                                                    href={`/profile?did=${(() => {
                                                        let hexDid = '';
                                                        for (let i = 0; i < profile.did.length; i++) {
                                                            hexDid += profile.did.charCodeAt(i).toString(16).padStart(2, '0');
                                                        }
                                                        return hexDid;
                                                    })()}`}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    View Profile
                                                </Link>
                                                <button className="btn btn-secondary btn-sm contact-btn" type="button">
                                                    <i className="fas fa-envelope"></i> Contact
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <div className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                                        <i className="fas fa-chevron-left"></i>
                                    </div>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(pageNum => (
                                        <div
                                            key={pageNum}
                                            className={`pagination-item ${pageNum === currentPage ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(pageNum)}
                                        >
                                            {pageNum}
                                        </div>
                                    ))}
                                    <div className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                                        <i className="fas fa-chevron-right"></i>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProfilesSection;
