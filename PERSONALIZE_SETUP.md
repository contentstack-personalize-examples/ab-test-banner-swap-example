# Contentstack Personalize Setup Guide

This guide documents the Contentstack Personalize implementation in this Next.js SSR application, following the [official Contentstack Personalize for Next.js guide](https://www.contentstack.com/docs/personalize/setup-nextjs-website-with-personalize-launch).

## What's Been Implemented

### 1. Next.js Proxy Setup (`proxy.ts`)

The proxy (Next.js 16's replacement for middleware) intercepts all requests and:

- Initializes the Personalize Edge SDK with your project UID
- Fetches the User Manifest containing variant selections for each experience
- Adds variant parameters to the URL as query parameters
- Sets cookies for visitor identification across requests

**Note**: The proxy works on Vercel and locally, but not on Contentstack Launch. It only runs when `USE_NEXT_MIDDLEWARE=true` is set.

### 1b. Launch Edge Proxy (`/functions/[proxy].edge.js`)

For Contentstack Launch deployment, the edge proxy provides the same functionality as `proxy.ts`:

- **Required Location**: `/functions/[proxy].edge.js` (exact path required)
- **API Pattern**: Uses `context.env` for environment variables and direct `fetch()` calls  
- **Auto-routing**: Automatically handles all requests, no configuration needed
- **Asset Exclusion**: Skips processing for static files, API routes, and Next.js internals
- **Documentation**: Based on [official Launch guide](https://www.contentstack.com/docs/personalize/setup-nextjs-website-with-personalize-launch)
- **Usage**: Automatically used when deployed on Launch, proxy.ts used for local development

### 2. Personalized Content Delivery (`lib/contentstack.ts`)

The `getPage` and `getGenericPage` functions support:

- Accepting variant parameters from `proxy.ts` or the Launch edge proxy
- Converting variant parameters to variant aliases using `Personalize.variantParamToVariantAliases()`
- Fetching personalized content variants instead of base entries when variants are available

### 3. Page Component (`app/page.tsx`)

The home page component:

- Extracts the `personalize_variants` parameter from search params
- Passes it to the `getPage` function for personalized content delivery

### 4. Client-Side User Action Tracking (`components/PersonalizeProvider.tsx`)

React Context and specialized hooks for:

- **PersonalizeProvider**: Initializes the Personalize SDK on the client side
- **usePersonalizeEvents()**: Triggers impression and conversion events
- **usePersonalizeAttributes()**: Sets user attributes
- **usePersonalizeImpression()**: Automatically triggers impression events on component mount

### 5. Dynamic Pages (`app/[slug]/page.tsx`)

Dynamic routing system for Contentstack pages:

- **Generic page content model**: Supports modular blocks and sections
- **Section rendering**: Flexible component system for different pages
- **Full personalization**: All dynamic pages support personalized content variants

## Configuration

### Environment Variables

The following environment variables are required for both `proxy.ts` and the Launch edge proxy:

```bash
# Required: Your Contentstack Personalize project UID
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID=<YOUR_PERSONALIZE_PROJECT_UID>

# Optional: Custom edge API URL for different regions
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL=https://personalize-edge.contentstack.com
```

### Optional Regional Configuration

For different Contentstack regions, you can set:

```bash
# Europe
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL=https://eu-personalize-edge.contentstack.com

# Azure North America
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL=https://azure-na-personalize-edge.contentstack.com

# Azure Europe
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL=https://azure-eu-personalize-edge.contentstack.com

# GCP North America
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL=https://gcp-na-personalize-edge.contentstack.com

# Australia
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL=https://au-personalize-edge.contentstack.com
```

## How It Works

### Middleware Flow (Vercel, Local Development)
1. **Request Flow**: User visits the site → Middleware intercepts → Personalize SDK fetches user manifest → Variant parameters added to URL
2. **Content Delivery**: Page component receives variant parameters → Passes to `getPage()` → Contentstack returns personalized content
3. **Rendering**: Page renders with personalized content variants

### Edge Proxy Flow (Contentstack Launch)
1. **Request Flow**: User visits the site → Launch Edge Proxy intercepts → Personalize SDK fetches user manifest → Variant parameters added to URL
2. **Content Delivery**: Page component receives variant parameters → Passes to `getPage()` → Contentstack returns personalized content
3. **Rendering**: Page renders with personalized content variants

## Platform Compatibility

| Platform | Solution | Status |
|----------|----------|--------|
| **Vercel** | `proxy.ts` | ✅ Fully supported |
| **Local Development** | `proxy.ts` | ✅ Fully supported |
| **Contentstack Launch** | `/functions/[proxy].edge.js` | ✅ **Official Launch support** |
| **Other Platforms** | Custom edge functions or client-side fallback | ⚠️ Platform-dependent |

## Example Usage

### Basic Implementation

The current setup automatically personalizes content for the home page. No additional code needed.

### Adding Client-Side Personalization

1. **Wrap your app with PersonalizeProvider**:

```tsx
// app/layout.tsx
import { PersonalizeProvider } from '@/components/PersonalizeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PersonalizeProvider>{children}</PersonalizeProvider>
      </body>
    </html>
  );
}
```

2. **Track impressions for experiences**:

```tsx
'use client';
import { usePersonalizeImpression } from '@/components/PersonalizeProvider';

export function BannerComponent() {
  // Replace 'banner_exp' with your actual experience short UID from Personalize UI
  usePersonalizeImpression('banner_exp');

  return <div>Your banner content</div>;
}
```

3. **Set user attributes**:

```tsx
'use client';
import { usePersonalizeAttributes } from '@/components/PersonalizeProvider';

export function UserForm() {
  const { setAttribute } = usePersonalizeAttributes();

  const handleFormSubmit = async (formData: any) => {
    // Set user attributes
    await setAttribute({
      age: formData.age,
      interests: formData.interests,
      location: formData.location,
    });
  };

  return <form onSubmit={handleFormSubmit}>{/* Your form fields */}</form>;
}
```

4. **Trigger personalization events**:

```tsx
'use client';
import { usePersonalizeEvents } from '@/components/PersonalizeProvider';

export function InteractiveComponent() {
  const { triggerEvent, triggerImpression } = usePersonalizeEvents();

  const handleButtonClick = async () => {
    // Trigger conversion event
    await triggerEvent('button_clicked');
  };

  const handleViewProduct = async () => {
    // Trigger impression for specific experience
    await triggerImpression('product_view_exp');
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Click Me</button>
      <button onClick={handleViewProduct}>View Product</button>
    </div>
  );
}
```

## Deployment

### Vercel Deployment
- Uses `proxy.ts` (set `USE_NEXT_MIDDLEWARE=true` to enable it)
- Set environment variables in Vercel dashboard
- Deploy as usual with `vercel deploy`

### Contentstack Launch Deployment
1. **Ensure Edge Proxy is Present**: Verify `/functions/[proxy].edge.js` exists in your project
2. **Set Environment Variables**: Configure the required environment variables in Launch project settings
3. **Deploy**: Push your code to Launch - the edge proxy will automatically handle personalization
4. **Verify**: Check that requests are being intercepted and personalized

## Testing Personalization

1. **View in Personalize Dashboard**: Check the Experiences section in your Contentstack Personalize project
2. **Browser Developer Tools**:
   - Check Network tab for calls to the Personalize Edge API
   - Check cookies for personalization state
   - Check URL parameters for variant information
3. **Content Variants**: Create different content variants in Contentstack and test audience targeting

## Troubleshooting

- **No personalization happening**:
  - Check that `NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID` is set correctly
  - Ensure that the experiences are 'Active' in the Personalize Dashboard
  - Ensure that the Entry Variants are published in the CMS
  - For Launch: Verify that `/functions/[proxy].edge.js` is deployed correctly
- **Console errors**: Check proxy logs and ensure the Personalize project is properly configured
- **Variants not loading**: Verify that experiences are published and audience rules are configured

## Resources

- [Contentstack Personalize Documentation](https://www.contentstack.com/docs/personalize/)
- [Next.js Personalize Setup Guide](https://www.contentstack.com/docs/personalize/setup-nextjs-website-with-personalize-launch)
- [Personalize Edge SDK Reference](https://www.contentstack.com/docs/developers/personalize-edge-sdk/)
