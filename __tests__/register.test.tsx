
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterSection from '../app/components/RegisterSection';

// Mock fetch
global.fetch = jest.fn();

describe('RegisterSection', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the registration form', () => {
        render(<RegisterSection />);
        expect(screen.getByText('Join our DAO')).toBeInTheDocument();
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    });

    it('submits form data to DataLayer', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, tx_id: '123' }),
        });

        render(<RegisterSection />);

        // Fill out form
        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'New User' } });
        fireEvent.change(screen.getByLabelText(/Professional Title/i), { target: { value: 'Dev' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Test City' } });
        fireEvent.change(screen.getByLabelText(/Professional Summary/i), { target: { value: 'Test summary' } });
        fireEvent.change(screen.getByLabelText(/Hourly Rate/i), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Availability/i), { target: { value: 'full-time' } });
        fireEvent.change(screen.getByLabelText(/Chia Wallet Address/i), { target: { value: 'xch1test' } });
        fireEvent.click(screen.getByLabelText(/I agree to the DAO Membership Terms/i));

        const submitBtn = screen.getByText('Submit Application');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            // Should call fetch
            expect(global.fetch).toHaveBeenCalledWith('/api/datalayer/batch_update', expect.any(Object));
        });

        // Verify payload structure
        const fetchArgs = (global.fetch as jest.Mock).mock.calls[0];
        const body = JSON.parse(fetchArgs[1].body);
        expect(body.changelist[0].action).toBe('insert');
        expect(body.id).toBeDefined();
    });
});
