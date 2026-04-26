import type { StaticImageData } from 'next/image';

export interface SupporterLogo {
  id: string;
  alt: string;
  src: string | StaticImageData;
}

export const supporterLogos: SupporterLogo[] = [
    { id: 'logo_ifbaiano', alt: 'IF Baiano Logo', src: '/images/logo_ifbaiano.png' },
    { id: 'logo_cnpq', alt: 'CNPq Logo', src: '/images/cnpq2.png' },
    { id: 'logo_lidah', alt: 'LIDAH Logo', src: '/images/logo_lidah.png' },
    { id: 'logo_proex', alt: 'PROEX Logo', src: '/images/logo_proex.png' },
    { id: 'logo_uesb', alt: 'UESB Logo', src: '/images/logo_uesb.png' },
];
