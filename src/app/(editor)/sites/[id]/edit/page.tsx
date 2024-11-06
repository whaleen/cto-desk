// src/app/(editor)/sites/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useWalletStore } from '@/stores/useWalletStore';
import { getBaseUrl } from '@/lib/domain';
import { SiteThemePreview } from '@/components/SiteThemePreview';

// Move interfaces and constants to separate file
import { SiteData, defaultTheme, TabType } from '@/types/site';
import { TabNav } from '@/components/site-editor/TabNav';
import { TabContent } from '@/components/site-editor/TabContent';

export default function EditSite() {
  const params = useParams();
  const router = useRouter();
  const { wallet, isConnected } = useWalletStore();

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [formData, setFormData] = useState<SiteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Single effect for data fetching
  useEffect(() => {
    async function loadSite() {
      if (!isConnected || !wallet) return;

      try {
        const response = await fetch(`/api/sites/${params.id}`, {
          headers: { 'x-wallet-address': wallet }
        });

        if (!response.ok) throw new Error('Failed to load site');

        const data = await response.json();
        setFormData(data.site);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load site');
      }
    }

    loadSite();
  }, [params.id, isConnected, wallet]);

  // Form handlers
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleThemeChange = (key: string, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        theme: { ...prev.theme, [key]: value }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/sites/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet || ''
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update site');

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update site');
    } finally {
      setIsSaving(false);
    }
  };

  // Early returns for loading/error states
  if (!isConnected) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <h1 className="text-2xl font-bold">Connect your wallet to continue</h1>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="loading loading-spinner loading-lg" />
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Edit Site</h2>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

          <form onSubmit={handleSubmit} className="mt-4">
            <TabContent
              tab={activeTab}
              data={formData}
              theme={formData.theme || defaultTheme}
              onInputChange={handleInputChange}
              onThemeChange={handleThemeChange}
            />

            <div className="card-actions justify-end mt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${isSaving ? 'loading' : ''}`}
                disabled={isSaving}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
