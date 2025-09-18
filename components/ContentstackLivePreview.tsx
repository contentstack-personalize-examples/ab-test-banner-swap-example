"use client";

import React, { useEffect } from 'react';

import { initLivePreview } from '@/lib/contentstack';

export function ContentstackLivePreview({
  children,
}: {
  children?: React.ReactNode;
}) {
  const livePreviewEnabled =
    process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === "true";

  useEffect(() => {
    if (livePreviewEnabled) {
      initLivePreview();
    }
  }, [livePreviewEnabled]);

  return <>{children}</>;
}
