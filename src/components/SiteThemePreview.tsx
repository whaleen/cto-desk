// src/components/SiteThemePreview.tsx
'use client';

interface ThemePreviewProps {
  theme?: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    'base-100': string;
    'base-200': string;
    'base-300': string;
    'base-content': string;
  };
}

export function SiteThemePreview({ theme }: ThemePreviewProps) {
  return (
    <div className="border rounded-lg p-4">
      {/* Inject theme styles */}
      <style jsx>{`
        .theme-preview {
          --p: ${theme?.primary || '#570df8'};
          --s: ${theme?.secondary || '#f000b8'};
          --a: ${theme?.accent || '#37cdbe'};
          --n: ${theme?.neutral || '#3d4451'};
          --b1: ${theme?.['base-100'] || '#ffffff'};
          --b2: ${theme?.['base-200'] || '#f2f2f2'};
          --b3: ${theme?.['base-300'] || '#e5e6e6'};
          --bc: ${theme?.['base-content'] || '#1f2937'};
          --pf: ${theme?.primary || '#570df8'};
          --sf: ${theme?.secondary || '#f000b8'};
          --af: ${theme?.accent || '#37cdbe'};
          --nf: ${theme?.neutral || '#3d4451'};
        }
      `}</style>

      <div className="theme-preview p-4 bg-base-100 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-accent">Accent Button</button>
          <button className="btn">Neutral Button</button>
        </div>
        <div className="divider">Content Preview</div>
        <div className="space-y-4">
          <div className="bg-base-200 p-4 rounded-lg">
            <h1 className="text-2xl font-bold">Heading Example</h1>
            <p>This is how your content will look with the selected colors.</p>
          </div>
          <div className="bg-base-300 p-4 rounded-lg">
            <div className="flex gap-2">
              <div className="badge badge-primary">Primary</div>
              <div className="badge badge-secondary">Secondary</div>
              <div className="badge badge-accent">Accent</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
