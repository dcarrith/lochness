
import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '../app/layout';
import nextConfig from '../next.config';

// Mock child component since we only care about Layout's head
const MockChild = () => <div>App Content</div>;

describe('Asset Rendering (Environment Agnostic)', () => {

    it('uses relative paths for manual CSS links in RootLayout', () => {
        // We render the layout. Note: Layouts are server components in App Router,
        // but for unit testing pure JSX output, we can often render them if they don't use async server data directly.
        // If it fails due to async, we might need a different approach, but let's try direct render first.

        render(
            <RootLayout>
                <MockChild />
            </RootLayout>
        );

        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach((link) => {
            const href = link.getAttribute('href');
            // Check for relative paths (no leading slash) or external links (http/https)
            // Invalid: /css/styles.css
            // Valid: css/styles.css OR https://...

            const isExternal = href?.startsWith('http') || href?.startsWith('//');
            const isRelative = !href?.startsWith('/');

            if (!isExternal) {
                expect(isRelative).toBe(true);
                // tailored message for easier debugging
                if (!isRelative) {
                    console.error(`Found absolute path for asset: ${href}. This will fail on GitHub Pages subpaths.`);
                }
            }
        });
    });

    it('next.config.js is configured for static export', () => {
        expect(nextConfig.output).toBe('export');
    });

    it('next.config.js disables image optimization', () => {
        expect(nextConfig.images?.unoptimized).toBe(true);
    });
});
