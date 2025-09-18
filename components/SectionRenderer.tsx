import { Section } from '@/lib/types';

import { ProductsSection } from './sections/ProductsSection';

interface SectionRendererProps {
  section: Section;
  index: number;
}

export function SectionRenderer({ section, index }: SectionRendererProps) {
  // Render different section types based on what's available in the section
  if (section.products_section) {
    return (
      <ProductsSection 
        section={section.products_section} 
        sectionIndex={index}
      />
    );
  }

  // Add more section types here as you create them
  // if (section.hero_section) {
  //   return <HeroSection section={section.hero_section} sectionIndex={index} />;
  // }
  
  // if (section.text_section) {
  //   return <TextSection section={section.text_section} sectionIndex={index} />;
  // }

  // Fallback for unknown section types
  return (
    <div className="py-8 px-4 bg-gray-100">
      <p className="text-center text-gray-500">
        Unknown section type at index {index}
      </p>
    </div>
  );
}
