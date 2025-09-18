'use client';

import Image from 'next/image';

import { BannerCTA } from './BannerCTA';
import { usePersonalizeImpression } from './PersonalizeProvider';

interface BannerProps {
  banner: {
    banner_image: {
      url: string;
      title: string;
      $?: any;
    };
    banner_text: string;
    cta_text: string;
    $?: any;
  };
}

export function Banner({ banner }: BannerProps) {
  // Trigger impression for experience short UID '0' when banner renders
  usePersonalizeImpression('0');

  return (
    <section className="relative h-96 overflow-hidden">
      {/* Background Image */}
      {banner.banner_image && (
        <div className="absolute inset-0">
          <Image
            src={banner.banner_image.url}
            alt={banner.banner_image.title}
            fill
            // className="object-cover"
            priority
            {...(banner.banner_image?.$ && banner.banner_image?.$.url)}
          />
        </div>
      )}

      {/* Banner Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white">
          <h2 className="text-5xl md:text-6xl font-bold mb-8" {...(banner?.$ && banner?.$.banner_text)}>
            {banner.banner_text}
          </h2>
          <BannerCTA 
            ctaText={banner.cta_text}
            ctaAttributes={banner?.$ && banner?.$.cta_text}
          />
        </div>
      </div>
    </section>
  );
}
