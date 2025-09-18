'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import Personalize from '@contentstack/personalize-edge-sdk';
import { Sdk } from '@contentstack/personalize-edge-sdk/dist/sdk';

let sdkInstance: Sdk | null = null;

export async function getPersonalizeInstance() {
  if (!Personalize.getInitializationStatus()) {
    const projectUid = process.env.NEXT_PUBLIC_PERSONALIZATION_PROJECT_UID;
    if (projectUid) {
      sdkInstance = await Personalize.init(projectUid);
    }
  }
  return sdkInstance;
}

const PersonalizeContext = createContext<Sdk | null>(null);

export function PersonalizeProvider({ children }: { children: React.ReactNode }) {
  const [sdk, setSdk] = useState<Sdk | null>(null);

  useEffect(() => {
    getPersonalizeInstance().then(setSdk).catch(console.error);
  }, []);

  return (
    <PersonalizeContext.Provider value={sdk}>
      {children}
    </PersonalizeContext.Provider>
  );
}

export function usePersonalize() {
  return useContext(PersonalizeContext);
}

/**
 * Hook to trigger impression events for experiences
 * @param experienceShortUid - The short UID of the experience from Personalize UI
 */
export function usePersonalizeImpression(experienceShortUid: string) {
  const { triggerImpression } = usePersonalizeEvents();

  useEffect(() => {
    if (triggerImpression && experienceShortUid) {
      triggerImpression(experienceShortUid).catch(console.error);
    }
  }, [triggerImpression, experienceShortUid]);
}

/**
 * Hook to trigger personalization events and impressions
 */
export function usePersonalizeEvents() {
  const sdk = usePersonalize();

  const triggerEvent = async (eventKey: string) => {
    if (sdk) {
      await sdk.triggerEvent(eventKey);
    }
  };

  const triggerImpression = async (experienceShortUid: string) => {
    if (sdk) {
      await sdk.triggerImpression(experienceShortUid);
    }
  };

  return { triggerEvent, triggerImpression };
}

/**
 * Hook to set user attributes for personalization
 */
export function usePersonalizeAttributes() {
  const sdk = usePersonalize();

  const setAttribute = async (attributes: Record<string, any>) => {
    if (sdk) {
      await sdk.set(attributes);
    }
  };

  return { setAttribute };
}
