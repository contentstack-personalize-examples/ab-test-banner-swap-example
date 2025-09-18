'use client';

import Link from 'next/link';

import { usePersonalizeEvents } from './PersonalizeProvider';

interface BannerCTAProps {
  ctaText: string;
  ctaAttributes?: any;
}

export function BannerCTA({ ctaText, ctaAttributes }: BannerCTAProps) {
  const { triggerEvent } = usePersonalizeEvents();

  const handleClick = async () => {
    try {
      await triggerEvent('deals_banner_cta_click');
      console.log('✅ Personalize event triggered: deals_banner_cta_click');
    } catch (error) {
      console.error('❌ Error triggering personalize event:', error);
    }
  };

  return (
    <Link 
      href="/deals"
      className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
      onClick={handleClick}
      {...ctaAttributes}
    >
      {ctaText}
    </Link>
  );
}
