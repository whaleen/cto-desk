// src/components/site-editor/PreviewIsolator.tsx
import React from 'react';

interface PreviewIsolatorProps {
  theme: React.CSSProperties;  // Change type to CSSProperties
  children: React.ReactNode;
}

export function PreviewIsolator({ theme, children }: PreviewIsolatorProps) {
  return (
    <div className="preview-isolator" style={theme}>
      {children}
    </div>
  );
}
