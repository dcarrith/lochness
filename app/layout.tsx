import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://lochness.group:8888'),
    title: 'Lochness Group | Decentralized Employment',
    description: 'Lochness Group is a decentralized autonomous organization (DAO) that utilizes the Chia Blockchain.',
};

export const viewport = {
    width: 'device-width',
    initialScale: 1.0,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="/css/styles.css" />
                <link rel="stylesheet" href="/css/contracts.css" />
                <link rel="stylesheet" href="/css/responsive.css" />
                <link rel="stylesheet" href="/css/profile.css" />
                <link rel="stylesheet" href="/css/profiles.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                {children}
                {/* Scripts that were at the end of body */}
                <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js" async></script>
            </body>
        </html>
    );
}
