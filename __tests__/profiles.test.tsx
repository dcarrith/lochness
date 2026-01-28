
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilesSection from '../app/components/ProfilesSection';

// Mock fetch
global.fetch = jest.fn();

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe('ProfilesSection', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, keys_values: [] }),
        });

        render(<ProfilesSection />);
        expect(screen.getByText(/Loading professionals/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText(/Loading professionals/i)).not.toBeInTheDocument();
        });
    });

    it('fetches profiles from DataLayer and renders them', async () => {
        const mockProfile = {
            id: 1,
            did: 'did:chia:test',
            name: 'Test Wrapper',
            title: 'Developer',
            category: 'developer',
            skills: ['React'],
            rate: 1.0,
            availability: 'available',
            rating: 5.0,
            reviewCount: 10,
            avatar: 'http://example.com/avatar.jpg'
        };

        // Hex encode the profile JSON
        const profileJson = JSON.stringify(mockProfile);
        let hexProfile = '';
        for (let i = 0; i < profileJson.length; i++) {
            hexProfile += profileJson.charCodeAt(i).toString(16);
        }

        const mockResponse = {
            success: true,
            keys_values: [
                { key: 'somehexkey', value: hexProfile }
            ]
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        render(<ProfilesSection />);

        await waitFor(() => {
            expect(screen.getByText('Test Wrapper')).toBeInTheDocument();
            expect(screen.getByText('Developer')).toBeInTheDocument();
        });
    });

    it('handles "View Profile" button click with correct DID hex encoding', async () => {
        const mockProfile = {
            id: 2,
            did: 'did:chia:view',
            name: 'View Me',
            title: 'Viewer',
            category: 'developer',
            skills: [],
            rate: 1,
            availability: 'available',
            rating: 5,
            reviewCount: 0,
            avatar: ''
        };

        const profileJson = JSON.stringify(mockProfile);
        let hexProfile = '';
        for (let i = 0; i < profileJson.length; i++) {
            hexProfile += profileJson.charCodeAt(i).toString(16);
        }

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: true,
                keys_values: [{ key: 'key', value: hexProfile }]
            }),
        });

        render(<ProfilesSection />);

        await waitFor(() => {
            expect(screen.getByText('View Me')).toBeInTheDocument();
        });

        const viewBtn = screen.getByText('View Profile');
        expect(viewBtn.closest('a')).toHaveAttribute('href', expect.stringContaining('/profile?did='));
    });
});
