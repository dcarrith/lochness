'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Modal from './components/Modal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');
    const [formResponse, setFormResponse] = useState('');

    const testimonials = [
        {
            text: "Lochness Group's AIOps platform has revolutionized how we manage our Chia farming operation. Our farming efficiency increased by 28%, and we've seen a significant boost in XCH rewards.",
            author: "Sarah Johnson",
            role: "CTO, GreenFarm Collective",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80"
        }
    ];

    // Auto-advance testimonials
    useEffect(() => {
        if (testimonials.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    const openModal = (modalId: string) => {
        setActiveModal(modalId);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const service = formData.get('service') as string;

        let responseMessage = '';

        switch (service) {
            case 'farm-monitoring':
                responseMessage = 'We\'ll help you optimize your Chia farming operation!';
                break;
            case 'chialisp-security':
                responseMessage = 'Our Chialisp security experts will be in touch to discuss your smart contract needs.';
                break;
            case 'farming-analytics':
                responseMessage = 'We\'ll analyze your farming setup to help maximize your XCH rewards.';
                break;
            case 'smart-contracts':
                responseMessage = 'Our Chialisp developers will contact you about your smart contract project.';
                break;
            case 'datalayer-rad':
                responseMessage = 'Our DataLayer specialists will contact you to discuss your rapid application development needs.';
                break;
            case 'enterprise-provenance':
                responseMessage = 'Our enterprise blockchain team will reach out to discuss how we can implement provenance and transparency solutions for your business.';
                break;
            case 'infrastructure-as-code':
                responseMessage = 'Our infrastructure specialists will contact you to discuss automating your Chia blockchain infrastructure deployment and management.';
                break;
            case 'performance-optimization':
                responseMessage = 'Our performance engineering team will reach out to help optimize your Chia operations for maximum efficiency and throughput.';
                break;
            default:
                responseMessage = 'We\'ll get back to you shortly about your Chia blockchain needs.';
        }

        setFormResponse(`Thank you for your message, ${name}! ${responseMessage} We'll reach out to you at ${email} within 24 hours.`);
        setFormStatus('success');
    };

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <section id="home" className="hero parallax-section">
                <div className="parallax-bg" style={{ backgroundImage: "url('/images/blocks.avif')" }}></div>
                <div className="container">
                    <div className="hero-flex-container">
                        <div className="hero-content">
                            <h1>Decentralized Employment</h1>
                            <p>We are a group of professional degens who pair ourselves with AIs to supercharge our already outstanding skillsets to help you transform your business.</p>
                            <div className="cta-buttons">
                                <a href="#services" className="btn btn-primary">Our Solutions</a>
                                <a href="#contracts" className="btn btn-secondary">Get Started</a>
                            </div>
                        </div>
                        <div className="lochness-wordcloud">
                            {/* Head and neck */}
                            <span className="word w-large head">Chia</span>
                            <span className="word w-medium neck1">Blockchain</span>
                            <span className="word w-small neck2">Security</span>
                            <span className="word w-medium neck3">DataLayer</span>

                            {/* Body */}
                            <span className="word w-xlarge body1">AIOps</span>
                            <span className="word w-large body2">Smart Contracts</span>
                            <span className="word w-medium body3">Chialisp</span>
                            <span className="word w-small body4">Analytics</span>
                            <span className="word w-medium body5">Farming</span>
                            <span className="word w-small body6">DePin</span>
                            <span className="word w-medium body7">DApps</span>

                            {/* Humps */}
                            <span className="word w-large hump1">Provenance</span>
                            <span className="word w-medium hump2">Transparency</span>
                            <span className="word w-small hump3">RAD</span>
                            <span className="word w-medium hump4">NFTs</span>
                            <span className="word w-small hump5">Clawback</span>
                            <span className="word w-medium hump6">Art</span>
                            <span className="word w-small hump7">Royalties</span>

                            {/* Tail */}
                            <span className="word w-medium tail1">Enterprise</span>
                            <span className="word w-small tail2">Decentralized</span>
                            <span className="word w-xsmall tail3">Immutable</span>
                            <span className="word w-small tail4">Vaults</span>
                            <span className="word w-xsmall tail5">Custody</span>
                            <span className="word w-medium tail6">Zero Knowledge</span>
                            <span className="word w-small tail7">Zero Trust</span>
                            <span className="word w-medium tail8">IaC</span>
                            <span className="word w-small tail9">High-Availability</span>

                            {/* Legs/Flippers */}
                            <span className="word w-small leg1">Monitoring</span>
                            <span className="word w-xsmall leg2">Automation</span>
                            <span className="word w-small leg3">AI</span>
                            <span className="word w-xsmall leg4">XCH</span>
                            <span className="word w-small leg5">Offer Files</span>
                            <span className="word w-xsmall leg6">DeFi</span>
                            <span className="word w-small leg7">P2P</span>
                            <span className="word w-xsmall leg8">Pooling</span>
                            <span className="word w-medium leg9">Performance</span>
                            <span className="word w-small leg10">Self-Healing</span>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
                <div className="scroll-indicator">
                    <span>Scroll Down</span>
                    <i className="fas fa-chevron-down"></i>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about">
                <div className="container">
                    <div className="section-header">
                        <h2>About Lochness Group</h2>
                        <div className="separator"></div>
                    </div>
                    <div className="about-content">
                        <div className="about-text">
                            <p>Lochness Group is a decentralized autonomous organization (DAO) that utilizes the Chia Blockchain's next-generation peer-to-peer Blockchain technology to create a decentralized employment model to attract top-tier talent.</p>
                            <p>Founded by a Chia farmer with twenty-two years of experience in the IT industry who was tired of working for a centralized organization where they bill the client twice the rate they paid him.</p>
                        </div>
                        <div className="about-stats">
                            <div className="stat-item">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">Employee Owned</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">Decentralized</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">Peer-to-Peer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="services parallax-section">
                <div className="parallax-bg"></div>
                <div className="container">
                    <div className="section-header light">
                        <h2>Our Services</h2>
                        <div className="separator"></div>
                    </div>
                    <div className="services-grid">
                        {[
                            { id: 'modal-farm-monitoring', icon: 'fa-robot', title: 'AI-Powered Farm Monitoring', desc: 'Continuous monitoring of Chia farms with intelligent anomaly detection and automated response systems to maximize farming efficiency.' },
                            { id: 'modal-chialisp-security', icon: 'fa-shield-alt', title: 'Chialisp Security', desc: 'Advanced security protocols and threat detection to protect Chia smart contracts and blockchain infrastructure from vulnerabilities.' },
                            { id: 'modal-farming-analytics', icon: 'fa-chart-line', title: 'Farming Predictive Analytics', desc: 'Leverage machine learning to forecast farming yields, optimize plot management, and prevent downtime in your Chia farming operation.' },
                            { id: 'modal-smart-contracts', icon: 'fa-cogs', title: 'Smart Contract Operations', desc: 'Streamline Chia smart contract development with intelligent automation, testing frameworks, and deployment optimization.' },
                            { id: 'modal-datalayer-rad', icon: 'fa-database', title: 'DataLayer RAD', desc: 'AI-powered rapid application development utilizing Chia DataLayer for decentralized data storage and management solutions.' },
                            { id: 'modal-enterprise-provenance', icon: 'fa-fingerprint', title: 'Enterprise Provenance', desc: 'Blockchain-based tracking and verification solutions for enterprise supply chains, product authentication, and regulatory compliance.' },
                            { id: 'modal-infrastructure-as-code', icon: 'fa-server', title: 'Infrastructure as Code', desc: 'Automated deployment and management of Chia blockchain infrastructure using modern IaC tools, ensuring consistency, scalability, and disaster recovery.' },
                            { id: 'modal-performance-optimization', icon: 'fa-tachometer-alt', title: 'Performance Optimization', desc: 'Comprehensive analysis and tuning of Chia nodes, farming operations, and smart contracts to maximize throughput, minimize latency, and reduce resource usage.' },
                        ].map((service, index) => (
                            <div key={index} className="service-card" onClick={() => openModal(service.id)}>
                                <div className="service-icon">
                                    <i className={`fas ${service.icon}`}></i>
                                </div>
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                                <div className="service-card-overlay">
                                    <span>Learn More</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enterprise Solutions Section */}
            <section id="enterprise" className="enterprise">
                <div className="container">
                    <div className="section-header">
                        <h2>Enterprise Blockchain Solutions</h2>
                        <div className="separator"></div>
                    </div>
                    <div className="enterprise-content">
                        <div className="enterprise-info">
                            <h3>Provenance &amp; Transparency Solutions</h3>
                            <p>Lochness Group provides enterprise-grade blockchain solutions that leverage Chia's sustainable blockchain to create immutable records for supply chain tracking, product authentication, and regulatory compliance.</p>

                            <div className="enterprise-features">
                                <div className="enterprise-feature" onClick={() => openModal('modal-supply-chain')}>
                                    <div className="feature-icon">
                                        <i className="fas fa-route"></i>
                                    </div>
                                    <div className="feature-content">
                                        <h4>Supply Chain Traceability</h4>
                                        <p>Track products from origin to consumer with immutable blockchain records. Our solution integrates with existing ERP systems and provides real-time visibility across your entire supply chain.</p>
                                    </div>
                                    <div className="feature-overlay">
                                        <span>Learn More</span>
                                    </div>
                                </div>

                                <div className="enterprise-feature" onClick={() => openModal('modal-product-authentication')}>
                                    <div className="feature-icon">
                                        <i className="fas fa-certificate"></i>
                                    </div>
                                    <div className="feature-content">
                                        <h4>Product Authentication</h4>
                                        <p>Combat counterfeiting with blockchain-verified product authenticity. Each product receives a unique digital identity on the Chia blockchain that consumers can verify instantly.</p>
                                    </div>
                                    <div className="feature-overlay">
                                        <span>Learn More</span>
                                    </div>
                                </div>

                                <div className="enterprise-feature" onClick={() => openModal('modal-regulatory-compliance')}>
                                    <div className="feature-icon">
                                        <i className="fas fa-file-contract"></i>
                                    </div>
                                    <div className="feature-content">
                                        <h4>Regulatory Compliance</h4>
                                        <p>Simplify compliance reporting with automated, tamper-proof record keeping. Our solutions help meet requirements for industries including pharmaceuticals, food safety, and luxury goods.</p>
                                    </div>
                                    <div className="feature-overlay">
                                        <span>Learn More</span>
                                    </div>
                                </div>

                                <div className="enterprise-feature" onClick={() => openModal('modal-sustainable-blockchain')}>
                                    <div className="feature-icon">
                                        <i className="fas fa-leaf"></i>
                                    </div>
                                    <div className="feature-content">
                                        <h4>Sustainable Blockchain</h4>
                                        <p>Unlike energy-intensive blockchains, Chia's proof of space and time consensus mechanism provides enterprise-grade security with minimal environmental impact.</p>
                                    </div>
                                    <div className="feature-overlay">
                                        <span>Learn More</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="enterprise-cta">
                            <div className="cta-card">
                                <h4>Ready for Enterprise Blockchain?</h4>
                                <p>Our team of experts will work with you to design and implement a custom blockchain solution tailored to your specific business needs.</p>
                                <a href="#contact" className="btn btn-primary">Schedule Consultation</a>
                            </div>
                            <div className="case-studies">
                                <h4>Success Stories</h4>
                                <div className="case-study" onClick={() => openModal('modal-case-study-1')}>
                                    <div className="case-logo">
                                        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=100&q=80" alt="Global Foods Inc." />
                                    </div>
                                    <div className="case-content">
                                        <h5>Global Foods Inc.</h5>
                                        <p>Implemented farm-to-table traceability for organic produce, increasing consumer trust by 45%.</p>
                                        <span className="read-more">Read Case Study</span>
                                    </div>
                                </div>
                                <div className="case-study" onClick={() => openModal('modal-case-study-2')}>
                                    <div className="case-logo">
                                        <img src="https://images.unsplash.com/photo-1588117260148-b47818741c74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=100&q=80" alt="LuxBrands" />
                                    </div>
                                    <div className="case-content">
                                        <h5>LuxBrands</h5>
                                        <p>Reduced counterfeit products by 80% with blockchain authentication for luxury accessories.</p>
                                        <span className="read-more">Read Case Study</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contracts Section */}
            <section id="contracts" className="contracts parallax-section">
                <div className="parallax-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')" }}></div>
                <div className="container">
                    <div className="section-header light">
                        <h2>Employment Contracts</h2>
                        <div className="separator"></div>
                    </div>
                    <div className="contracts-intro">
                        <p>Access our network of verified specialists through secure, blockchain-based smart contracts. Our Decentralized Employment platform connects you with expert contractors for your rapid application development needs.</p>
                    </div>
                    <div className="contracts-grid">
                        {[
                            { id: 'modal-farm-specialist', icon: 'fa-tractor', title: 'Chia Farm Specialist', desc: 'Expert optimization of Chia farming operations', rate: '15 XCH/hour', term: '40 hours' },
                            { id: 'modal-chialisp-developer', icon: 'fa-code', title: 'Chialisp Developer', desc: 'Smart contract development and optimization', rate: '21 XCH/hour', term: '40 hours' },
                            { id: 'modal-security-auditor', icon: 'fa-shield-alt', title: 'Security Auditor', desc: 'Comprehensive security audits for Chialisp contracts', rate: '17 XCH/hour', term: '15 hours' },
                            { id: 'modal-datalayer-architect', icon: 'fa-database', title: 'DataLayer Architect', desc: 'Design and implementation of DataLayer solutions', rate: '19 XCH/hour', term: '25 hours' },
                            { id: 'modal-aiops-engineer', icon: 'fa-robot', title: 'AIOps Engineer', desc: 'Implementation of AI-powered operational solutions', rate: '23 XCH/hour', term: '40 hours' },
                            { id: 'modal-infrastructure-specialist', icon: 'fa-server', title: 'Infrastructure Engineer', desc: 'Design and deployment of highly-available infrastructure', rate: '25 XCH/hour', term: '80 hours' }
                        ].map((contract, index) => (
                            <div key={index} className="contract-card" onClick={() => openModal(contract.id)}>
                                <div className="contract-icon">
                                    <i className={`fas ${contract.icon}`}></i>
                                </div>
                                <div className="contract-content">
                                    <h3>{contract.title}</h3>
                                    <p>{contract.desc}</p>
                                    <div className="contract-details">
                                        <div className="contract-detail">
                                            <span className="detail-label">Rate:</span>
                                            <span className="detail-value">{contract.rate}</span>
                                        </div>
                                        <div className="contract-detail">
                                            <span className="detail-label">Min. Term:</span>
                                            <span className="detail-value">{contract.term}</span>
                                        </div>
                                    </div>
                                    {/* QR Code placeholder or static image could go here, but modal has the real one */}
                                    <span className="btn btn-secondary btn-sm download-offer" onClick={(e) => { e.stopPropagation(); openModal(contract.id); /* Navigate to modal for download */ }}>View Offer</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="contracts-info">
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-info-circle"></i>
                            </div>
                            <div className="info-content">
                                <h4>How the contracts work</h4>
                                <ol>
                                    <li><strong>Download Offer File:</strong> Select the specialist that matches your needs and download the corresponding Chia offer file.</li>
                                    <li><strong>Accept Offer:</strong> Use your Chia wallet to accept the offer, which creates an escrow smart contract.</li>
                                    <li><strong>Work Begins:</strong> Once the contract is established, your specialist will contact you to begin work.</li>
                                    <li><strong>Milestone Payments:</strong> Funds are released from escrow as work milestones are completed and verified.</li>
                                    <li><strong>Contract Completion:</strong> Upon successful completion, final payment is released and the contract is closed.</li>
                                </ol>
                            </div>
                        </div>
                        <div className="custom-contract">
                            <h4>Want to submit an offer?</h4>
                            <p></p>
                            <a href="#contact" className="btn btn-primary">Submit an offer.</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials parallax-section">
                <div className="parallax-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')" }}></div>
                <div className="container">
                    <div className="section-header light">
                        <h2>What Our Clients Say</h2>
                        <div className="separator"></div>
                    </div>
                    <div className="testimonial-slider">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className={`testimonial-slide ${index === currentTestimonial ? 'active' : ''}`}>
                                <div className="testimonial-content">
                                    <p>"{testimonial.text}"</p>
                                    <div className="testimonial-author">
                                        <img src={testimonial.image} alt="Client" />
                                        <div>
                                            <h4>{testimonial.author}</h4>
                                            <span>{testimonial.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact">
                <div className="container">
                    <div className="section-header">
                        <h2>Get in Touch</h2>
                        <div className="separator"></div>
                    </div>
                    <div className="contact-content">
                        <div className="contact-info">
                            <h3>Ready to transform your Chia operations?</h3>
                            <p>Our team of experts is ready to help you implement cutting-edge AIOps solutions for your Chia farming and smart contract development.</p>
                            <div className="contact-details">
                                <div className="contact-item">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>123 Blockchain Avenue, San Francisco, CA 94105</span>
                                </div>
                                <div className="contact-item">
                                    <i className="fas fa-envelope"></i>
                                    <span>info@lochnessgroup.com</span>
                                </div>
                                <div className="contact-item">
                                    <i className="fas fa-phone"></i>
                                    <span>+1 (415) 555-0123</span>
                                </div>
                            </div>
                            <div className="social-links">
                                <a href="#"><i className="fab fa-twitter"></i></a>
                                <a href="#"><i className="fab fa-linkedin-in"></i></a>
                                <a href="#"><i className="fab fa-github"></i></a>
                                <a href="#"><i className="fab fa-discord"></i></a>
                            </div>
                        </div>
                        <div className="contact-form">
                            {formStatus === 'success' ? (
                                <div className="success-message">
                                    <h3 style={{ color: '#4CAF50' }}>Message Sent!</h3>
                                    <p>{formResponse}</p>
                                    <button onClick={() => setFormStatus('idle')} className="btn btn-primary" style={{ marginTop: '20px' }}>Send Another</button>
                                </div>
                            ) : (
                                <form id="contactForm" onSubmit={handleFormSubmit}>
                                    <div className="form-group">
                                        <input type="text" id="name" name="name" placeholder="Your Name" required />
                                    </div>
                                    <div className="form-group">
                                        <input type="email" id="email" name="email" placeholder="Your Email" required />
                                    </div>
                                    <div className="form-group">
                                        <select id="service" name="service" defaultValue="">
                                            <option value="" disabled>Select Service</option>
                                            <option value="farm-monitoring">Farm Monitoring</option>
                                            <option value="chialisp-security">Chialisp Security</option>
                                            <option value="farming-analytics">Farming Analytics</option>
                                            <option value="smart-contracts">Smart Contract Development</option>
                                            <option value="datalayer-rad">DataLayer RAD</option>
                                            <option value="enterprise-provenance">Enterprise Provenance</option>
                                            <option value="infrastructure-as-code">Infrastructure as Code</option>
                                            <option value="performance-optimization">Performance Optimization</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <textarea id="message" name="message" placeholder="Your Message" required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Send Message</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>


            <Footer />

            <Modal modalId={activeModal} isOpen={!!activeModal} onClose={closeModal} />
        </>
    );
}
