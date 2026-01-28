import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../app/page'

describe('Home Page', () => {
    it('renders the branding and hero section', () => {
        render(<Home />)
        expect(screen.getAllByText('Lochness Group').length).toBeGreaterThan(0)
        expect(screen.getByText('Decentralized Employment')).toBeInTheDocument()
    })

    it('renders the services section', () => {
        render(<Home />)
        expect(screen.getAllByText('Our Services').length).toBeGreaterThan(0);
        // Check for some service cards
        expect(screen.getByText('AI-Powered Farm Monitoring')).toBeInTheDocument();
    })

    it('toggles the mobile menu', () => {
        const { container } = render(<Home />);
        const hamburger = container.querySelector('.hamburger');
        expect(hamburger).toBeInTheDocument();

        // Initial state check (cannot easily check class without clicking, but we can verify it exists)
        // Simulating click
        if (hamburger) {
            fireEvent.click(hamburger);
            // Expect nav-links to have active class
            const navLinks = container.querySelector('.nav-links');
            expect(navLinks?.classList.contains('active')).toBe(true);
        }
    });

    it('opens and closes modals', () => {
        render(<Home />);
        const serviceCard = screen.getByText('AI-Powered Farm Monitoring').closest('.service-card');
        expect(serviceCard).toBeInTheDocument();

        if (serviceCard) {
            fireEvent.click(serviceCard);
            expect(screen.getByText(/Our AI-powered farm monitoring solution/i)).toBeInTheDocument();

            const closeBtn = screen.getByText('×');
            fireEvent.click(closeBtn);

            // Modal should be closed (removed from DOM in conditional rendering)
            expect(screen.queryByText(/Our AI-powered farm monitoring solution/i)).not.toBeInTheDocument();
        }
    })
})
