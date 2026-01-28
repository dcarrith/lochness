'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className={`navbar ${scrolled || !isHomePage ? 'scrolled' : ''} ${isMenuOpen ? 'active' : ''}`}>
            <div className="container">
                <div className="logo">
                    <img src="/images/lochness-logo.svg" alt="Lochness Group Logo" />
                    <span>Lochness Group</span>
                </div>
                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link href="/#home" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link href="/#about" onClick={() => setIsMenuOpen(false)}>About</Link>
                    <Link href="/#services" onClick={() => setIsMenuOpen(false)}>Services</Link>
                    <Link href="/#enterprise" onClick={() => setIsMenuOpen(false)}>Enterprise</Link>
                    <Link href="/#contracts" onClick={() => setIsMenuOpen(false)}>Contracts</Link>
                    <Link href="/profiles" onClick={() => setIsMenuOpen(false)}>Profiles</Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>Join</Link>
                    <Link href="/#contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                </div>
                <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
}
