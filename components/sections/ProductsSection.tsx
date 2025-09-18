import Image from 'next/image';

import { ProductsSection as ProductsSectionType } from '@/lib/types';

interface ProductsSectionProps {
  section: ProductsSectionType;
  sectionIndex: number;
}

export function ProductsSection({ section }: ProductsSectionProps) {
  return (
    <section className="bg-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 
          className="text-3xl font-bold text-white mb-12 text-left"
          {...(section?.$ && section?.$.section_heading)}
        >
          {section.section_heading}
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {section.products.map((product) => (
            <div 
              key={product.uid}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center p-4">
                {product.image && (
                  <Image
                    src={product.image.url}
                    alt={product.image.title}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                    {...(product.image?.$ && product.image?.$.url)}
                  />
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Product Name */}
                <h3 
                  className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2"
                  {...(product?.$ && product?.$.title)}
                >
                  {product.title}
                </h3>
                
                {/* Star Rating */}
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">(4.5)</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-red-500 line-through">
                      ${Math.round(product.price * 1.4)}
                    </span>
                    <span 
                      className="text-lg font-bold text-red-600"
                      {...(product?.$ && product?.$.price)}
                    >
                      ${product.price}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
