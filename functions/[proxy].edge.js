/**
 * Contentstack Launch Edge Function for Personalization
 * Based on official Contentstack Launch documentation:
 * https://www.contentstack.com/docs/personalize/setup-nextjs-website-with-personalize-launch
 */
 
/**
 * This edge function is used to proxy the request to the origin server.
 * It is used to add the variant parameter to the URL and set the cookies for visitor identification.
 * It is also used to fetch the personalized content from the origin server.
 * 
 * NOTE: This is used when the app is deployed on Contentstack Launch.
 * For local development, use the middleware.ts file.
 */

import Personalize from '@contentstack/personalize-edge-sdk';

export default async function handler(request, context) {
  // Exclude asset calls - we don't need to invoke proxy logic for Next.js assets
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip processing for static assets, API routes, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/_next/image/') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.') // Skip files with extensions (js, css, png, etc.)
  ) {
    return fetch(request);
  }

  try {
    const parsedUrl = new URL(request.url);

    // Set custom edge API URL if provided (for different Contentstack regions)
    if (context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL) {
      Personalize.setEdgeApiUrl(context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL);
    }

    // Initialize the Personalize Edge SDK
    const personalizeSdk = await Personalize.init(context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID, {
      request,
    });

    // Get the variant parameter from the SDK
    const variantParam = personalizeSdk.getVariantParam();

    // Set the variant parameter as a query param in the URL
    parsedUrl.searchParams.set(personalizeSdk.VARIANT_QUERY_PARAM, variantParam);

    // Rewrite the request with the modified URL
    const modifiedRequest = new Request(parsedUrl.toString(), request);
    const response = await fetch(modifiedRequest);

    // Create a new response to modify headers
    const modifiedResponse = new Response(response.body, response);

    // Add cookies to the response for visitor identification
    await personalizeSdk.addStateToResponse(modifiedResponse);

    // Ensure that the response is not cached on the browser
    modifiedResponse.headers.set('cache-control', 'no-store');

    return modifiedResponse;
  } catch (error) {
    console.error('Error in Contentstack Launch edge function:', error);
    // Fall back to original request if personalization fails
    return fetch(request);
  }
}
