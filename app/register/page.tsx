'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterSection from '../components/RegisterSection';

export default function Register() {
    return (
        <>
            <Navbar />
            <main style={{ marginTop: '80px' }}>
                <RegisterSection />
            </main>
            <Footer />
        </>
    );
}
