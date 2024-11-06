// src/app/(editor)/sites/[id]/edit/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useWalletStore } from '@/stores/useWalletStore';
import { getBaseUrl } from '@/lib/domain';
import { SiteThemePreview } from '@/components/SiteThemePreview';
import { SiteData, defaultTheme, TabType } from '@/types/site';
import { TabNav } from '@/components/site-editor/TabNav';
import { TabContent } from '@/components/site-editor/TabContent';


export default function EditSite() {
  const params = useParams();
  const router = useRouter();
  const { wallet, isConnected, isInitialized } = useWalletStore();

  console.log('EditSite Render:', {
    wallet,
    isConnected,
    isInitialized,
    id: params.id
  });

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [formData, setFormData] = useState<SiteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  const handleInputChange = useCallback((name: string, value: string) => {
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  }, []);

  const handleThemeChange = useCallback((key: string, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        theme: { ...(prev.theme || defaultTheme), [key]: value }
      };
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !wallet) return;

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(`/api/sites/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update site');
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Error saving:', err);
      setError(err instanceof Error ? err.message : 'Failed to save site');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    console.log('UseEffect Triggered:', {
      wallet,
      isConnected,
      isInitialized,
      id: params.id
    });

    if (!isInitialized || !wallet || !isConnected) {
      console.log('Early return:', {
        isInitialized,
        wallet,
        isConnected
      });
      setIsLoading(false);
      return;
    }

    let ignore = false;

    async function loadSite() {
      console.log('Loading site data...');
      try {
        const response = await fetch(`/api/sites/${params.id}`, {
          headers: { 'x-wallet-address': wallet }
        });

        const data = await response.json();
        console.log('Response:', data);

        if (!ignore) {
          if (!response.ok) {
            throw new Error(data.error || 'Failed to load site');
          }

          setFormData(data.site);
        }
      } catch (err) {
        console.error('Load error:', err);
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load site');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadSite();

    return () => {
      ignore = true;
    };
  }, [params.id, wallet, isConnected, isInitialized]);


  // Single loading/error state check
  if (!isConnected || !wallet) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <h1 className="text-2xl font-bold">Connect your wallet to continue</h1>
        </div>
      </div>
    );
  }

  if (isLoading || !formData) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="loading loading-spinner loading-lg" />
        </div>
      </div>
    );
  }

  // Main render...
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
