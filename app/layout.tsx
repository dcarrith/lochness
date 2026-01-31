import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://lochness.group'),
    title: 'Lochness Group - a Decentralized Autonomous Organization (DAO)',
    description: 'Lochness Group is a decentralized autonomous organization (DAO) that utilizes the Chia Blockchain to create a decentralized employment model.',
    keywords: ['Chia', 'Blockchain', 'Decentralized Autonomous Organization', 'DAO', 'Decentralized Employment', 'Smart Contracts', 'Chialisp', 'AIOps', 'DataLayer', 'Lochness Group'],
    openGraph: {
        title: 'Lochness Group - a Decentralized Autonomous Organization (DAO)',
        description: 'Lochness Group is a decentralized autonomous organization (DAO) that utilizes the Chia Blockchain to create a decentralized employment and ownership model.',
        url: 'https://lochness.group',
        siteName: 'Lochness Group',
        images: [
            {
                url: '/images/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Lochness Group Logo',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Lochness Group - a Decentralized Autonomous Organization (DAO)',
        description: 'Lochness Group is a decentralized autonomous organization (DAO) that utilizes the Chia Blockchain to create a decentralized employmentand ownership model.',
        images: ['/images/og-image.png'],
        creator: '@lochnessgroup',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
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
                <link rel="stylesheet" href="/css/profile-verification.css" />
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
