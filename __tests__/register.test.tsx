
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterSection from '../app/components/RegisterSection';

// Mock fetch and scroll
global.fetch = jest.fn();
window.scrollTo = jest.fn();

describe('RegisterSection Multi-Step Wizard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the first step initially', () => {
        render(<RegisterSection />);
        expect(screen.getByText('Join our DAO')).toBeInTheDocument();
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
        // Should not see Step 2 content yet
        expect(screen.queryByText('Expertise & Availability')).not.toBeInTheDocument();
    });

    it('validates step 1 and prevents navigation if empty', () => {
        render(<RegisterSection />);
        const nextBtn = screen.getByText('Next step');

        // Mock alert
        window.alert = jest.fn();

        fireEvent.click(nextBtn);
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('required fields'));
        expect(screen.getByText('Personal Information')).toBeInTheDocument(); // Still on step 1
    });

    it('completes the full wizard flow and submits', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, tx_id: '12345' }),
        });

        render(<RegisterSection />);

        // --- Step 1: Personal Info ---
        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Wizard User' } });
        fireEvent.change(screen.getByLabelText(/Professional Title/i), { target: { value: 'Wizard Dev' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'wizard@example.com' } });
        fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Oz' } });
        fireEvent.change(screen.getByLabelText(/Professional Summary/i), { target: { value: 'A magical dev' } });

        fireEvent.click(screen.getByText('Next step'));

        // --- Step 2: Expertise ---
        await waitFor(() => expect(screen.getByText('Expertise & Availability')).toBeInTheDocument());

        // Select a skill
        const skillCheckbox = screen.getByLabelText('Chialisp Developer');
        fireEvent.click(skillCheckbox);

        // Rate & Availability
        fireEvent.change(screen.getByLabelText(/Hourly Rate/i), { target: { value: '2.5' } });
        fireEvent.change(screen.getByLabelText(/Availability/i), { target: { value: 'part-time' } });

        fireEvent.click(screen.getByText('Next step'));

        // --- Step 3: Experience (Optional) ---
        await waitFor(() => expect(screen.getByText('Work & Education (Optional)')).toBeInTheDocument());
        // Just skip adding specific experience for this test to keep it simple, or add one if needed
        fireEvent.click(screen.getByText('Next step'));

        // --- Step 4: Identity ---
        await waitFor(() => expect(screen.getByText('Identity & Confirmation')).toBeInTheDocument());

        fireEvent.change(screen.getByLabelText(/Chia Wallet Address/i), { target: { value: 'xch1wizard' } });
        fireEvent.click(screen.getByLabelText(/I agree to the DAO Membership Terms/i));

        // Submit
        const submitBtn = screen.getByText('Submit Application');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/datalayer/batch_update', expect.any(Object));
        });

        // Verify Payload
        const fetchArgs = (global.fetch as jest.Mock).mock.calls[0];
        const body = JSON.parse(fetchArgs[1].body);
        const submittedData = JSON.parse(Buffer.from(body.changelist[0].value, 'hex').toString());

        expect(submittedData.name).toBe('Wizard User');
        expect(submittedData.skills).toContain('Chialisp Developer');
        expect(submittedData.availability).toBe('part-time');
        expect(submittedData.walletAddress).toBe('xch1wizard');
    });
});
