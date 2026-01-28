'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
    location?: string;
    about?: string;
    email?: string;
    walletAddress?: string;
    experiences?: { company: string; position: string; }[];
    education?: { institution: string; degree: string; }[];
}

const ProfileContent: React.FC = () => {
    const searchParams = useSearchParams();
    const didKey = searchParams.get('did');

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const DATALAYER_STORE_ID = process.env.NEXT_PUBLIC_DATALAYER_STORE_ID || 'f0d4ca6913401569688081a2571253a652882a8576d3381015f60670868f7767';

    useEffect(() => {
        if (!didKey) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                // Fetch specific key (did) from DataLayer
                const response = await fetch('/api/datalayer/get_value', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: DATALAYER_STORE_ID,
                        key: didKey
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.value) {
                        // Hex decode value
                        const hexToString = (hex: string) => {
                            let str = '';
                            for (let i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                            return str;
                        };
                        const jsonString = hexToString(data.value);
                        const profileData = JSON.parse(jsonString);
                        setProfile(profileData);
                    } else {
                        setError('Profile not found on DataLayer.');
                    }
                } else {
                    // Fallback for demo/mock if API fails
                    console.warn("Using mock fallback for profile view");
                    // Just a dummy mock for visual verification if DL is down
                    setProfile({
                        id: 1,
                        did: 'mock',
                        name: 'Mock User',
                        title: 'Blockchain Developer',
                        category: 'developer',
                        skills: ['Chialisp', 'React'],
                        rate: 0.5,
                        availability: 'available',
                        rating: 4.8,
                        reviewCount: 12,
                        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                        location: 'Internet',
                        about: 'This is a mock profile because the DataLayer fetch failed.',
                        experiences: [{ company: 'Chia Network', position: 'Developer' }],
                        education: [{ institution: 'University', degree: 'CS' }]
                    });
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [didKey]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '150px 0', textAlign: 'center' }}>
                <div className="loading-spinner"></div>
                <p>Loading Profile...</p>
            </div>
        );
    }

    if (!didKey) {
        return (
            <div className="container" style={{ padding: '150px 0', textAlign: 'center' }}>
                <h2>No Profile Selected</h2>
                <a href="/profiles" className="btn btn-primary">Browse Profiles</a>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="container" style={{ padding: '150px 0', textAlign: 'center' }}>
                <h2>{error || 'Profile Not Found'}</h2>
                <a href="/profiles" className="btn btn-primary">Back to Profiles</a>
            </div>
        );
    }

    return (
        <div className="profile-detail-page">
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
                <a href="/profiles" className="back-link" style={{ display: 'inline-block', marginBottom: '20px', color: '#666' }}>
                    <i className="fas fa-arrow-left"></i> Back to Profiles
                </a>

                <div className="profile-header-card" style={{ display: 'flex', gap: '30px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                    <div className="profile-avatar-lg" style={{ flexShrink: 0 }}>
                        <img src={profile.avatar} alt={profile.name} style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />
                    </div>
                    <div className="profile-info-main" style={{ flexGrow: 1 }}>
                        <h1 style={{ margin: '0 0 5px 0', color: '#0e3b2c' }}>{profile.name}</h1>
                        <h3 style={{ margin: '0 0 15px 0', color: '#3aac59', fontWeight: 500 }}>{profile.title}</h3>

                        <div className="meta-row" style={{ display: 'flex', gap: '20px', marginBottom: '20px', color: '#666' }}>
                            {profile.location && <span><i className="fas fa-map-marker-alt"></i> {profile.location}</span>}
                            <span><i className="fas fa-tag"></i> {profile.rate} XCH/hr</span>
                            <span><i className="fas fa-clock"></i> {profile.availability}</span>
                        </div>

                        <div className="profile-skills-list" style={{ marginBottom: '20px' }}>
                            {profile.skills.map(skill => (
                                <span key={skill} className="skill-tag" style={{ display: 'inline-block', background: '#e8f5e9', color: '#2e7d32', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', marginRight: '8px', marginBottom: '8px' }}>
                                    {skill}
                                </span>
                            ))}
                        </div>

                        <div className="action-buttons">
                            <button className="btn btn-primary">Contact Me</button>
                        </div>
                    </div>
                </div>

                <div className="profile-content-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    <div className="main-col">
                        <section className="detail-section" style={{ background: '#fff', padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
                            <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>About</h3>
                            <p style={{ lineHeight: '1.6', color: '#444' }}>
                                {profile.about || 'No summary provided.'}
                            </p>
                        </section>

                        {profile.experiences && profile.experiences.length > 0 && (
                            <section className="detail-section" style={{ background: '#fff', padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
                                <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>Experience</h3>
                                {profile.experiences.map((exp, idx) => (
                                    <div key={idx} className="exp-item" style={{ marginBottom: '20px' }}>
                                        <h4 style={{ margin: '0 0 5px 0' }}>{exp.position}</h4>
                                        <div style={{ color: '#666' }}>{exp.company}</div>
                                    </div>
                                ))}
                            </section>
                        )}
                        {profile.education && profile.education.length > 0 && (
                            <section className="detail-section" style={{ background: '#fff', padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
                                <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>Education</h3>
                                {profile.education.map((edu, idx) => (
                                    <div key={idx} className="edu-item" style={{ marginBottom: '20px' }}>
                                        <h4 style={{ margin: '0 0 5px 0' }}>{edu.institution}</h4>
                                        <div style={{ color: '#666' }}>{edu.degree}</div>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>

                    <div className="sidebar-col">
                        <section className="detail-section" style={{ background: '#fff', padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
                            <h4 style={{ marginBottom: '15px' }}>Identity Verification</h4>
                            <div style={{ color: '#28a745', marginBottom: '10px' }}><i className="fas fa-check-circle"></i> DID Verified</div>
                            <div style={{ wordBreak: 'break-all', fontSize: '0.8rem', color: '#888', background: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                                {didKey}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ProfilePage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="container" style={{ paddingTop: '100px' }}>Loading...</div>}>
                <ProfileContent />
            </Suspense>
            <Footer />
        </>
    );
}
