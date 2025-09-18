import {
  NextRequest,
  NextResponse,
} from 'next/server';

import Personalize from '@contentstack/personalize-edge-sdk';

export default async function middleware(req: NextRequest) {
  const projectUid = process.env.NEXT_PUBLIC_PERSONALIZATION_PROJECT_UID as string;

  try {
    // Set the Personalize Edge API URL. Set the right URL based on your Contentstack Region.
    // Get your URL here: https://www.contentstack.com/docs/developers/apis/personalize-edge-api#base-url
    if (process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL) {
      Personalize.setEdgeApiUrl(process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL);
    }

    // Initialize the SDK and pass the request to let Personalize know about the context.
    // The Personalize Edge SDK extracts information such as url, referrer, cookies, etc.
    // to identify the visitor and personalize based on the context.
    const personalizeSdk = await Personalize.init(projectUid, {
      request: req,
    });

    // Get the variant parameter from the SDK
    const variantParam = personalizeSdk.getVariantParam();
    const parsedUrl = new URL(req.url);

    // Set the variant parameter as a query param in the URL
    parsedUrl.searchParams.set(personalizeSdk.VARIANT_QUERY_PARAM, variantParam);

    // Rewrite the request with the modified URL.
    // This is done to ensure that the variant parameter is passed to the origin server.
    // The origin server can then use the variant parameter to fetch the personalized content.
    const response = NextResponse.rewrite(parsedUrl);

    // Add cookies to the response for visitor identification.
    // These cookies are then used to maintain the visitor across sessions.
    personalizeSdk.addStateToResponse(response);

    return response;
  } catch (error) {
    console.error('Personalize middleware error:', error);
    // Fall back to normal response if personalization fails
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
