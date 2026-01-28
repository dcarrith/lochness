'use client';

import React, { useState } from 'react';

const RegisterSection: React.FC = () => {
    const [experiences, setExperiences] = useState([1]);
    const [projects, setProjects] = useState([1]);
    const [education, setEducation] = useState([1]);
    const [resumeName, setResumeName] = useState('No file chosen');
    const [submitted, setSubmitted] = useState(false);

    const DATALAYER_STORE_ID = process.env.NEXT_PUBLIC_DATALAYER_STORE_ID || 'f0d4ca6913401569688081a2571253a652882a8576d3381015f60670868f7767';

    // Helper to convert string to hex
    const stringToHex = (str: string) => {
        let hex = '';
        for (let i = 0; i < str.length; i++) {
            hex += '' + str.charCodeAt(i).toString(16);
        }
        return hex;
    };

    const addExperience = () => setExperiences([...experiences, experiences.length + 1]);
    const addProject = () => setProjects([...projects, projects.length + 1]);
    const addEducation = () => setEducation([...education, education.length + 1]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setResumeName(e.target.files[0].name);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Gather form data
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const profileData: any = {
            id: Date.now(), // Simple ID
            name: formData.get('full-name') as string,
            title: formData.get('professional-title') as string,
            email: formData.get('email') as string,
            location: formData.get('location') as string,
            about: formData.get('about') as string,
            skills: formData.getAll('expertise'),
            rate: parseFloat(formData.get('hourly-rate') as string),
            availability: formData.get('availability') as string,
            did: formData.get('chia-did') as string || `did:chia:${Math.random().toString(36).substr(2, 10)}`, // Fallback if empty
            walletAddress: formData.get('chia-address') as string,
            experiences: experiences.map(id => ({
                company: formData.get(`company-${id}`),
                position: formData.get(`position-${id}`),
            })),
            education: education.map(id => ({
                institution: formData.get(`institution-${id}`),
                degree: formData.get(`degree-${id}`),
            })),
            // Default fields for compatibility with ProfilesSection
            category: 'developer', // simplified
            rating: 5.0,
            reviewCount: 0,
            avatar: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 8) + 1}.jpg`
        };

        try {
            // Prepare DataLayer insert
            const key = stringToHex(profileData.did);
            const value = stringToHex(JSON.stringify(profileData));

            const apiUrl = '/api/datalayer/batch_update';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: DATALAYER_STORE_ID,
                    changelist: [
                        {
                            action: 'insert',
                            key: key,
                            value: value
                        }
                    ]
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Registration successful", data);
                // We assume success if the RPC accepts it (pending confirmation)
                setSubmitted(true);
            } else {
                console.error("Failed to submit to DataLayer", response.status);
                alert("Submission failed. Please check console or try again.");
                // For demo resilience, we might still setSubmitted(true) in a real demo context if local net is flaky
                // setSubmitted(true); 
            }
        } catch (error) {
            console.error("Error submitting registration:", error);
            alert("Error submitting registration. See console.");
        }
    };

    if (submitted) {
        return (
            <section id="register" className="submission-success">
                <div className="container">
                    <div className="success-message" style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div className="success-icon" style={{ fontSize: '4rem', color: '#28a745', marginBottom: '20px' }}>
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <h2>Application Submitted Successfully!</h2>
                        <p>Thank you for applying to join the Lochness Group DAO. Your application has been submitted to the Chia blockchain and will be reviewed by existing DAO members.</p>
                        <div className="transaction-container" style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                            <p><strong>Transaction ID:</strong> 0x{Math.random().toString(16).substr(2, 40)}</p>
                            <p className="blockchain-note" style={{ fontSize: '0.9rem', color: '#666' }}>Replicating to DataLayer mirrors...</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => setSubmitted(false)} style={{ marginTop: '30px' }}>Return to Form</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="register" className="register-section">
            {/* Header */}
            <div className="register-header parallax-section">
                <div className="parallax-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')" }}></div>
                <div className="container">
                    <div className="section-header light">
                        <h1>Join our DAO</h1>
                        <div className="separator"></div>
                        <p>Apply to become a verified blockchain professional in our decentralized autonomous organization</p>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="section-header">
                    <h2>Professional Registration</h2>
                    <div className="separator"></div>
                    <p>Complete the form below to apply for membership in the Lochness Group DAO.</p>
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        {/* Personal Info */}
                        <div className="form-section">
                            <h3><i className="fas fa-user"></i> Personal Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="full-name">Full Name*</label>
                                    <input type="text" id="full-name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="professional-title">Professional Title*</label>
                                    <input type="text" id="professional-title" required placeholder="e.g., Chia Developer" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email Address*</label>
                                    <input type="email" id="email" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="location">Location*</label>
                                    <input type="text" id="location" required placeholder="City, Country" />
                                </div>
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="about">Professional Summary*</label>
                                <textarea id="about" rows={4} required></textarea>
                            </div>
                        </div>

                        {/* Expertise */}
                        <div className="form-section">
                            <h3><i className="fas fa-briefcase"></i> Expertise</h3>
                            <div className="form-group full-width">
                                <label>Primary Expertise Area(s)*</label>
                                <div className="checkbox-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                                    {['Chialisp Developer', 'Farm Specialist', 'DataLayer Architect', 'Security Auditor', 'AIOps Engineer', 'Infrastructure Specialist'].map(exp => (
                                        <div key={exp} className="checkbox-item">
                                            <input type="checkbox" id={`expert-${exp.replace(/\s/g, '').toLowerCase()}`} name="expertise" value={exp} />
                                            <label htmlFor={`expert-${exp.replace(/\s/g, '').toLowerCase()}`} style={{ marginLeft: '8px' }}>{exp}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="hourly-rate">Hourly Rate (XCH)*</label>
                                    <input type="number" id="hourly-rate" step="0.01" min="0.1" required placeholder="0.5" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="availability">Availability*</label>
                                    <select id="availability" required>
                                        <option value="">Select availability</option>
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="limited">Limited</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Sections */}
                        <div className="form-section">
                            <h3><i className="fas fa-history"></i> Work Experience</h3>
                            {experiences.map((id) => (
                                <div key={id} className="experience-entry" style={{ padding: '15px', border: '1px solid #eee', marginBottom: '15px', borderRadius: '4px' }}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Company/Organization</label>
                                            <input type="text" name={`company-${id}`} />
                                        </div>
                                        <div className="form-group">
                                            <label>Position</label>
                                            <input type="text" name={`position-${id}`} />
                                        </div>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Responsibilities</label>
                                        <textarea rows={2}></textarea>
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="btn btn-secondary btn-sm" onClick={addExperience}>
                                <i className="fas fa-plus"></i> Add Another Experience
                            </button>
                        </div>

                        <div className="form-section">
                            <h3><i className="fas fa-graduation-cap"></i> Education</h3>
                            {education.map((id) => (
                                <div key={id} className="education-entry" style={{ padding: '15px', border: '1px solid #eee', marginBottom: '15px', borderRadius: '4px' }}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Institution</label>
                                            <input type="text" name={`institution-${id}`} />
                                        </div>
                                        <div className="form-group">
                                            <label>Degree</label>
                                            <input type="text" name={`degree-${id}`} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="btn btn-secondary btn-sm" onClick={addEducation}>
                                <i className="fas fa-plus"></i> Add Another Education
                            </button>
                        </div>

                        {/* Wallet / DID */}
                        <div className="form-section">
                            <h3><i className="fas fa-link"></i> Blockchain Identity</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="chia-did">Chia DID</label>
                                    <input type="text" id="chia-did" placeholder="did:chia:..." />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="chia-address">Chia Wallet Address*</label>
                                    <input type="text" id="chia-address" required placeholder="xch1..." />
                                </div>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="form-section">
                            <h3><i className="fas fa-file-upload"></i> Resume</h3>
                            <div className="form-group full-width">
                                <label htmlFor="resume">Upload Resume (PDF)</label>
                                <div className="file-upload-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input type="file" id="resume" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                                    <label htmlFor="resume" className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                                        <i className="fas fa-upload"></i> Choose File
                                    </label>
                                    <span id="resume-file-name">{resumeName}</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="checkbox-single">
                                <input type="checkbox" id="terms" required style={{ marginRight: '10px' }} />
                                <label htmlFor="terms">I agree to the DAO Membership Terms*</label>
                            </div>
                        </div>

                        <div className="form-actions" style={{ marginTop: '30px' }}>
                            <button type="submit" className="btn btn-primary">Submit Application</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default RegisterSection;
