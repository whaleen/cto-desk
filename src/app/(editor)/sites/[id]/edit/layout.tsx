// src/app/(editor)/sites/[id]/edit/layout.tsx
'use client';

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <div data-theme="light" className="min-h-screen bg-base-100">
          {children}
        </div>
      </body>
    </html>
  );
}
