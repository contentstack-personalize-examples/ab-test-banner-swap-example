import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { Header } from '@/components/Header';
import { SectionRenderer } from '@/components/SectionRenderer';
import {
  getGenericPage,
  stack,
} from '@/lib/contentstack';

interface DynamicPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<any>;
}

export default async function DynamicPage({ params, searchParams }: DynamicPageProps) {
  await headers();
  const { slug } = await params;
  const { live_preview, entry_uid, content_type_uid, personalize_variants } = await searchParams;

  if (live_preview) {
    stack.livePreviewQuery({
      live_preview,
      contentTypeUid: content_type_uid || '',
      entryUid: entry_uid || '',
    });
  }

  // Construct the URL with leading slash
  const url = `/${slug}`;
  
  // Fetch the page data from Contentstack
  const page = await getGenericPage(url, ['header', 'sections.products_section.products'], personalize_variants);
  
  // If no page found, return 404
  if (!page) {
    notFound();
  }

  // Extract header data
  const header = page?.header?.[0];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      {header && <Header header={header} />}

      {/* Page Title - Hidden but useful for SEO */}
      <h1 className="sr-only">{page.title}</h1>

      {/* Main Content */}
      <main>
        {/* Live Preview Debug Info */}
        {live_preview && (
          <section className="bg-yellow-100 border-l-4 border-yellow-500 p-4 m-4">
            <h3 className="font-bold text-yellow-800 mb-2">Live Preview Mode</h3>
            <ul className="text-sm text-yellow-700">
              <li>
                live_preview_hash: <code className="bg-yellow-200 px-1 rounded">{live_preview}</code>
              </li>
              <li>
                content_type_uid: <code className="bg-yellow-200 px-1 rounded">{content_type_uid}</code>
              </li>
              <li>
                entry_uid: <code className="bg-yellow-200 px-1 rounded">{entry_uid}</code>
              </li>
              <li>
                page_url: <code className="bg-yellow-200 px-1 rounded">{url}</code>
              </li>
            </ul>
          </section>
        )}

        {/* Dynamic Sections */}
        {page.sections && page.sections.length > 0 ? (
          page.sections.map((section, index) => (
            <SectionRenderer 
              key={`section-${index}`}
              section={section} 
              index={index} 
            />
          ))
        ) : (
          <div className="py-16 text-center">
            <p className="text-white text-lg">No content sections found for this page.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = `/${slug}`;
  
  try {
    const page = await getGenericPage(url);
    
    if (!page) {
      return {
        title: 'Page Not Found',
      };
    }

    return {
      title: page.title,
      description: `${page.title} - CSPRSNLZ`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Page Not Found',
    };
  }
}
