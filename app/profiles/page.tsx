'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfilesSection from '../components/ProfilesSection';

export default function Profiles() {
    return (
        <>
            <Navbar />
            <main style={{ marginTop: '80px' }}> {/* Add margin for fixed navbar */}
                <ProfilesSection />
            </main>
            <Footer />
        </>
    );
}
