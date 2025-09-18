import contentstack, { QueryOperation } from '@contentstack/delivery-sdk';
import ContentstackLivePreview, {
  IStackSdk,
} from '@contentstack/live-preview-utils';
import Personalize from '@contentstack/personalize-edge-sdk';
import {
  getContentstackEndpoints,
  getRegionForString,
} from '@timbenniks/contentstack-endpoints';

import {
  GenericPage,
  Page,
} from './types';

const region = getRegionForString(process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as string)
const endpoints = getContentstackEndpoints(region, true)

export const stack = contentstack.stack({
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
  // Setting the region
  // if the region doesnt exist, fall back to a custom region given by the env vars
  // for internal testing purposes at Contentstack we look for a custom region in the env vars, you do not have to do this.
  region: region ? region : process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as any,
  // Setting the host for content delivery based on the region or environment variables
  // This is done for internal testing purposes at Contentstack, you can omit this if you have set a region above.
  host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_DELIVERY || endpoints && endpoints.contentDelivery,

  live_preview: {
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true',
    preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,
    // Setting the host for live preview based on the region
    // for internal testing purposes at Contentstack we look for a custom host in the env vars, you do not have to do this.
    host: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST || endpoints && endpoints.preview
  }
});

export function initLivePreview() {
  ContentstackLivePreview.init({
    ssr: true,
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true',
    mode: "builder",
    stackSdk: stack.config as IStackSdk,
    stackDetails: {
      apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
      environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
    },
    clientUrlParams: {
      // Setting the client URL parameters for live preview
      // for internal testing purposes at Contentstack we look for a custom host in the env vars, you do not have to do this.
      host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_APPLICATION || endpoints && endpoints.application

    },
    editButton: {
      enable: true,
      exclude: ["outsideLivePreviewPortal"]
    },
  });
}

export async function getPage(
  url: string, 
  contentType: string, 
  referencedContentTypes: string[],
  variantParam?: string
) {
  // Create the base entry query
  const entryCall = stack
    .contentType(contentType)
    .entry()
    .includeReference(...referencedContentTypes);

  let result;
  
  // If variant parameter is provided, convert it to variant aliases and include them
  if (variantParam) {
    try {
      const variantAliases = Personalize.variantParamToVariantAliases(variantParam);
      if (variantAliases.length > 0) {
        // Use variants on the entry call, then query
        result = await entryCall
          .variants(variantAliases)
          .query()
          .where("url", QueryOperation.EQUALS, url)
          .find<Page>();
      } else {
        // Fallback to normal query if no variants
        result = await entryCall
          .query()
          .where("url", QueryOperation.EQUALS, url)
          .find<Page>();
      }
    } catch (error) {
      console.warn('Error processing variant parameter:', error);
      // Continue with base query if variant processing fails
      result = await entryCall
        .query()
        .where("url", QueryOperation.EQUALS, url)
        .find<Page>();
    }
  } else {
    // No variants, use normal query
    result = await entryCall
      .query()
      .where("url", QueryOperation.EQUALS, url)
      .find<Page>();
  }

  if (result.entries) {
    const entry = result.entries[0]

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry, 'page', true);
    }

    return entry;
  }
}

export async function getGenericPage(
  url: string,
  referencedContentTypes: string[] = ['header', 'sections.products_section.products'],
  variantParam?: string
): Promise<GenericPage | undefined> {
  // Create the base entry query
  const entryCall = stack
    .contentType('page')
    .entry()
    .includeReference(...referencedContentTypes);

  let result;
  
  // If variant parameter is provided, convert it to variant aliases and include them
  if (variantParam) {
    try {
      const variantAliases = Personalize.variantParamToVariantAliases(variantParam);
      if (variantAliases.length > 0) {
        // Use variants on the entry call, then query
        result = await entryCall
          .variants(variantAliases)
          .query()
          .where("url", QueryOperation.EQUALS, url)
          .find<GenericPage>();
      } else {
        // Fallback to normal query if no variants
        result = await entryCall
          .query()
          .where("url", QueryOperation.EQUALS, url)
          .find<GenericPage>();
      }
    } catch (error) {
      console.warn('Error processing variant parameter:', error);
      // Continue with base query if variant processing fails
      result = await entryCall
        .query()
        .where("url", QueryOperation.EQUALS, url)
        .find<GenericPage>();
    }
  } else {
    // No variants, use normal query
    result = await entryCall
      .query()
      .where("url", QueryOperation.EQUALS, url)
      .find<GenericPage>();
  }

  if (result.entries && result.entries.length > 0) {
    const entry = result.entries[0];

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry, 'page', true);
    }

    return entry;
  }
}