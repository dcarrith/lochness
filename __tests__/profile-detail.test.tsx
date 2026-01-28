
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProfilePage from '../app/profile/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useSearchParams: () => ({
        get: (key: string) => {
            if (key === 'did') return '6469643a636869613a74657374'; // hex for did:chia:test
            return null;
        }
    })
}));

// Mock Navbar/Footer to simplify test
jest.mock('../app/components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('../app/components/Footer', () => () => <div data-testid="footer">Footer</div>);

global.fetch = jest.fn();

describe('Profile Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches and displays profile data based on DID param', async () => {
        const mockProfile = {
            id: 99,
            did: 'did:chia:test',
            name: 'Detail User',
            title: 'Expert',
            category: 'security',
            skills: ['Auditing'],
            rate: 2,
            availability: 'limited',
            rating: 5,
            reviewCount: 5,
            avatar: 'avatar.jpg',
            about: 'About me text'
        };

        const profileJson = JSON.stringify(mockProfile);
        let hexProfile = '';
        for (let i = 0; i < profileJson.length; i++) {
            hexProfile += profileJson.charCodeAt(i).toString(16).padStart(2, '0');
        }

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: true,
                value: hexProfile
            }),
        });

        render(<ProfilePage />);

        // Should render loading first (impl detail) or directly if fast

        await waitFor(() => {
            expect(screen.getByText('Detail User')).toBeInTheDocument();
            expect(screen.getByText('About me text')).toBeInTheDocument();
        });

        expect(global.fetch).toHaveBeenCalledWith('/api/datalayer/get_value', expect.objectContaining({
            body: expect.stringContaining('6469643a636869613a74657374') // key in request
        }));
    });
});
