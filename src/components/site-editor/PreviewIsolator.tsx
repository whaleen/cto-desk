// src/components/site-editor/PreviewIsolator.tsx
import React from 'react';

interface PreviewIsolatorProps {
  theme: Record<string, string>;
  children: React.ReactNode;
}

export function PreviewIsolator({ theme, children }: PreviewIsolatorProps) {
  return (
    <div className="preview-isolator" style={theme}>
      {children}
    </div>
  );
}
