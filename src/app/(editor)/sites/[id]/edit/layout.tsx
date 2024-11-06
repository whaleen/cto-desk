// src/app/(editor)/sites/[id]/edit/layout.tsx
'use client';

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="light" className="min-h-screen bg-base-100">
      {children}
    </div>
  );
}
