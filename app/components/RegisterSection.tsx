'use client';

import React, { useState } from 'react';

const RegisterSection: React.FC = () => {
    // Current Wizard Step (1: Personal, 2: Expertise, 3: Experience, 4: Identity)
    const [currentStep, setCurrentStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Data State
    const [formData, setFormData] = useState({
        name: '', title: '', email: '', location: '', about: '',
        skills: [] as string[],
        rate: '', availability: '',
        chiaDid: '', walletAddress: '',
        resumeName: 'No file chosen',
        terms: false
    });

    const [experiences, setExperiences] = useState([{ id: 1, company: '', position: '', description: '' }]);
    const [education, setEducation] = useState([{ id: 1, institution: '', degree: '' }]);

    const DATALAYER_STORE_ID = process.env.NEXT_PUBLIC_DATALAYER_STORE_ID || 'f0d4ca6913401569688081a2571253a652882a8576d3381015f60670868f7767';

    // Helper: Convert string to hex
    const stringToHex = (str: string) => {
        let hex = '';
        for (let i = 0; i < str.length; i++) {
            hex += '' + str.charCodeAt(i).toString(16);
        }
        return hex;
    };

    // --- State Updates ---
    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleExperienceChange = (id: number, field: string, value: string) => {
        setExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };

    const addExperience = () => setExperiences([...experiences, { id: Date.now(), company: '', position: '', description: '' }]);

    const handleEducationChange = (id: number, field: string, value: string) => {
        setEducation(prev => prev.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
    };

    const addEducation = () => setEducation([...education, { id: Date.now(), institution: '', degree: '' }]);

    const handleSkillChange = (skill: string) => {
        setFormData(prev => {
            const skills = prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill];
            return { ...prev, skills };
        });
    };

    // --- Navigation ---
    const nextStep = () => {
        // Basic validation before processing
        if (currentStep === 1 && (!formData.name || !formData.email)) {
            alert('Please fill in required fields (Name, Email).');
            return;
        }
        if (currentStep === 2 && (!formData.availability || formData.skills.length === 0)) {
            alert('Please select availability and at least one skill.');
            return;
        }
        setCurrentStep(prev => Math.min(prev + 1, 4));
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    // --- Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.terms) {
            alert("Please accept the terms.");
            return;
        }

        setIsSubmitting(true);

        const profileData = {
            id: Date.now(),
            name: formData.name,
            title: formData.title,
            email: formData.email,
            location: formData.location,
            about: formData.about,
            skills: formData.skills,
            rate: parseFloat(formData.rate) || 0,
            availability: formData.availability,
            did: formData.chiaDid || `did:chia:${Math.random().toString(36).substr(2, 10)}`,
            walletAddress: formData.walletAddress,
            experiences: experiences.map(({ company, position }) => ({ company, position })),
            education: education.map(({ institution, degree }) => ({ institution, degree })),
            category: 'developer',
            rating: 5.0,
            reviewCount: 0,
            avatar: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 8) + 1}.jpg`
        };

        try {
            const key = stringToHex(profileData.did);
            const value = stringToHex(JSON.stringify(profileData));
            const apiUrl = '/api/datalayer/batch_update';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: DATALAYER_STORE_ID,
                    changelist: [{ action: 'insert', key: key, value: value }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Registration successful", data);
                setSubmitted(true);
            } else {
                console.error("Failed to submit to DataLayer", response.status);
                alert("Submission failed. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting registration:", error);
            alert("Error submitting registration.");
        } finally {
            setIsSubmitting(false);
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
                        <p>Thank you for applying to join the Lochness Group DAO. Your metadata has been written to the Chia DataLayer.</p>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/profiles'} style={{ marginTop: '30px' }}>Browse Profiles</button>
                    </div>
                </div>
            </section>
        );
    }

    // --- Render Wizard Steps ---
    const renderStep1 = () => (
        <div className="form-section fade-in">
            <h3><i className="fas fa-user"></i> Personal Information</h3>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="full-name">Full Name*</label>
                    <input type="text" id="full-name" value={formData.name} onChange={(e) => updateField('name', e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="professional-title">Professional Title*</label>
                    <input type="text" id="professional-title" value={formData.title} onChange={(e) => updateField('title', e.target.value)} required placeholder="e.g., Chia Developer" />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="email">Email Address*</label>
                    <input type="email" id="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location*</label>
                    <input type="text" id="location" value={formData.location} onChange={(e) => updateField('location', e.target.value)} required placeholder="City, Country" />
                </div>
            </div>
            <div className="form-group full-width">
                <label htmlFor="about">Professional Summary*</label>
                <textarea id="about" rows={4} value={formData.about} onChange={(e) => updateField('about', e.target.value)} required></textarea>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="form-section fade-in">
            <h3><i className="fas fa-briefcase"></i> Expertise & Availability</h3>
            <div className="form-group full-width">
                <label>Primary Expertise Area(s)*</label>
                <div className="checkbox-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                    {['Chialisp Developer', 'Farm Specialist', 'DataLayer Architect', 'Security Auditor', 'AIOps Engineer', 'Infrastructure Specialist'].map(exp => (
                        <div key={exp} className="checkbox-item">
                            <input
                                type="checkbox"
                                id={`expert-${exp.replace(/\s/g, '').toLowerCase()}`}
                                checked={formData.skills.includes(exp)}
                                onChange={() => handleSkillChange(exp)}
                            />
                            <label htmlFor={`expert-${exp.replace(/\s/g, '').toLowerCase()}`} style={{ marginLeft: '8px' }}>{exp}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="hourly-rate">Hourly Rate (XCH)*</label>
                    <input type="number" id="hourly-rate" step="0.01" value={formData.rate} onChange={(e) => updateField('rate', e.target.value)} required placeholder="0.5" />
                </div>
                <div className="form-group">
                    <label htmlFor="availability">Availability*</label>
                    <select id="availability" value={formData.availability} onChange={(e) => updateField('availability', e.target.value)} required>
                        <option value="">Select availability</option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="limited">Limited</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="form-section fade-in">
            <h3><i className="fas fa-history"></i> Work & Education (Optional)</h3>
            {/* Experience */}
            <h4 style={{ marginTop: '20px', color: '#555' }}>Experience</h4>
            {experiences.map((exp, index) => (
                <div key={exp.id} className="experience-entry" style={{ padding: '15px', border: '1px solid #eee', marginBottom: '15px', borderRadius: '4px' }}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Company</label>
                            <input type="text" value={exp.company} onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Position</label>
                            <input type="text" value={exp.position} onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)} />
                        </div>
                    </div>
                </div>
            ))}
            <button type="button" className="btn btn-secondary btn-sm" onClick={addExperience}>+ Add Experience</button>

            {/* Education */}
            <h4 style={{ marginTop: '30px', color: '#555' }}>Education</h4>
            {education.map((edu) => (
                <div key={edu.id} className="education-entry" style={{ padding: '15px', border: '1px solid #eee', marginBottom: '15px', borderRadius: '4px' }}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Institution</label>
                            <input type="text" value={edu.institution} onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Degree</label>
                            <input type="text" value={edu.degree} onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)} />
                        </div>
                    </div>
                </div>
            ))}
            <button type="button" className="btn btn-secondary btn-sm" onClick={addEducation}>+ Add Education</button>
        </div>
    );

    const renderStep4 = () => (
        <div className="form-section fade-in">
            <h3><i className="fas fa-link"></i> Identity & Confirmation</h3>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="chia-did">Chia DID (Optional)</label>
                    <input type="text" id="chia-did" value={formData.chiaDid} onChange={(e) => updateField('chiaDid', e.target.value)} placeholder="did:chia:..." />
                </div>
                <div className="form-group">
                    <label htmlFor="chia-address">Chia Wallet Address*</label>
                    <input type="text" id="chia-address" value={formData.walletAddress} onChange={(e) => updateField('walletAddress', e.target.value)} required placeholder="xch1..." />
                </div>
            </div>

            <div className="form-section">
                <div className="checkbox-single">
                    <input type="checkbox" id="terms" checked={formData.terms} onChange={(e) => updateField('terms', e.target.checked)} required />
                    <label htmlFor="terms" style={{ marginLeft: '10px' }}>I agree to the DAO Membership Terms*</label>
                </div>
            </div>
        </div>
    );

    return (
        <section id="register" className="register-section">
            <div className="register-header parallax-section">
                <div className="container">
                    <div className="section-header light">
                        <h1>Join our DAO</h1>
                        <p>Complete the steps below to apply for membership.</p>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Stepper */}
                <div className="wizard-progress" style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '10px' }}>
                    {[1, 2, 3, 4].map(step => (
                        <div key={step} style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: step <= currentStep ? '#3498db' : '#e0e0e0',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 'bold'
                        }}>
                            {step}
                        </div>
                    ))}
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}

                        <div className="form-actions" style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                            {currentStep > 1 ? (
                                <button type="button" className="btn btn-secondary" onClick={prevStep}>Back</button>
                            ) : <div></div>}

                            {currentStep < 4 ? (
                                <button type="button" className="btn btn-primary" onClick={nextStep}>Next step</button>
                            ) : (
                                <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default RegisterSection;
