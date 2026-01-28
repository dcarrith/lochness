'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <img src="/images/lochness-logo-white.svg" alt="Lochness Group Logo" />
                        <span>Lochness Group</span>
                    </div>
                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Company</h4>
                            <Link href="/profiles">About Us</Link>
                            <Link href="/profiles">Team</Link>
                            <Link href="/register">Join Our DAO</Link>
                            <Link href="/register">Careers</Link>
                            <Link href="/#contact">Press</Link>
                        </div>
                        <div className="footer-column">
                            <h4>Services</h4>
                            <Link href="/#services">Farm Monitoring</Link>
                            <Link href="/#services">Chialisp Security</Link>
                            <Link href="/#services">Farming Analytics</Link>
                            <Link href="/#services">Smart Contract Development</Link>
                            <Link href="/#services">DataLayer RAD</Link>
                            <Link href="/#services">Enterprise Provenance</Link>
                            <Link href="/#services">Infrastructure as Code</Link>
                            <Link href="/#services">Performance Optimization</Link>
                            <Link href="/#contracts">DeEmp Contracts</Link>
                        </div>
                        <div className="footer-column">
                            <h4>Resources</h4>
                            <a href="#">Blog</a>
                            <a href="#">Whitepapers</a>
                            <a href="#">Documentation</a>
                            <a href="#">API</a>
                        </div>
                        <div className="footer-column">
                            <h4>Legal</h4>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                            <a href="#">GDPR</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 Lochness Group. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
