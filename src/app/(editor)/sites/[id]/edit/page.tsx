// src/app/(editor)/sites/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Add useParams
import { useWallet } from '@solana/wallet-adapter-react';
import { getBaseUrl } from '@/lib/domain';
import { SiteThemePreview } from '@/components/SiteThemePreview';
import { useWalletStore } from '@/stores/useWalletStore';


type TabType = 'general' | 'profile' | 'design';

interface SiteData {
  id: string;
  name: string;
  subdomain: string;
  customDomain: string | null;
  profileImage: string | null;
  bannerImage: string | null;
  description: string | null;
  twitterUrl: string | null;
  telegramUrl: string | null;
  user: {
    wallet: string;
  };
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

// Add default theme
const defaultTheme = {
  primary: '#570df8',
  secondary: '#f000b8',
  accent: '#37cdbe',
  neutral: '#3d4451',
  'base-100': '#ffffff',
  'base-200': '#f2f2f2',
  'base-300': '#e5e6e6',
  'base-content': '#1f2937'
};

export default function EditSite() {  // Remove params prop
  const params = useParams();
  const siteId = params.id as string;
  const router = useRouter();
  const { isConnected, wallet } = useWalletStore();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SiteData | null>(null);

  useEffect(() => {
    if (siteId && isConnected && wallet) {
      fetchSiteData();
    }
  }, [siteId, isConnected, wallet]);

  const fetchSiteData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        headers: {
          'x-wallet-address': wallet || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch site data');
      }

      setFormData(data.site);
    } catch (err) {
      console.error('Error in fetchSiteData:', err);
      setError(err instanceof Error ? err.message : 'Failed to load site data');
    } finally {
      setLoading(false);
    }
  };



  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };

  const renderGeneralTab = () => (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Site Name</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData?.name || ''}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Site URL</span>
        </label>
        <div className="flex items-center">
          <div className="input input-bordered bg-base-300 flex-none px-3 flex items-center h-12">
            {getBaseUrl()}/
          </div>
          <input
            type="text"
            name="subdomain"
            value={formData?.subdomain || ''}
            className="input input-bordered flex-1 rounded-l-none"
          />
        </div>
        <label className="label">
          <span className="label-text-alt">
            Site URL cannot be changed after creation
          </span>
        </label>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Custom Domain (Optional)</span>
        </label>
        <input
          type="text"
          name="customDomain"
          value={formData?.customDomain || ''}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="example.com"
        />
        <label className="label">
          <span className="label-text-alt">
            Enter your custom domain if you want to use one
          </span>
        </label>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-4">
      {/* Profile Image Upload */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Profile Image</span>
        </label>
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-24 rounded-full bg-base-300">
              {formData?.profileImage && (
                <img src={formData.profileImage} alt="Profile" />
              )}
            </div>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            accept="image/*"
            onChange={async (e) => {
              // Image upload handler will go here
              console.log('Image upload not implemented yet');
            }}
          />
        </div>
      </div>

      {/* Banner Image Upload */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Banner Image</span>
        </label>
        <div className="w-full aspect-[3/1] relative rounded-lg overflow-hidden bg-base-300">
          {formData?.bannerImage && (
            <img
              src={formData.bannerImage}
              alt="Banner"
              className="object-cover w-full h-full"
            />
          )}
        </div>
        <input
          type="file"
          className="file-input file-input-bordered w-full mt-2"
          accept="image/*"
          onChange={async (e) => {
            // Image upload handler will go here
            console.log('Image upload not implemented yet');
          }}
        />
      </div>

      {/* Description */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          name="description"
          value={formData?.description || ''}
          onChange={handleInputChange}
          className="textarea textarea-bordered h-24"
          placeholder="Tell visitors about yourself or your site..."
        />
      </div>

      {/* Social Links */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Twitter URL</span>
        </label>
        <input
          type="url"
          name="twitterUrl"
          value={formData?.twitterUrl || ''}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="https://twitter.com/yourusername"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Telegram URL</span>
        </label>
        <input
          type="url"
          name="telegramUrl"
          value={formData?.telegramUrl || ''}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          placeholder="https://t.me/yourusername"
        />
      </div>
    </div>
  );

  // Add this new function to your component
  const renderDesignTab = () => (
    <div className="space-y-6">
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Customize your site's colors. Changes will be reflected in real-time.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary Color */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Primary Color</span>
          </label>
          <div className="join">
            <input
              type="text"
              value={formData?.theme?.primary || defaultTheme.primary}
              onChange={(e) => handleThemeChange('primary', e.target.value)}
              className="input input-bordered join-item w-full"
            />
            <input
              type="color"
              value={formData?.theme?.primary || defaultTheme.primary}
              onChange={(e) => handleThemeChange('primary', e.target.value)}
              className="join-item btn btn-square"
            />
          </div>
        </div>

        {/* Secondary Color */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Secondary Color</span>
          </label>
          <div className="join">
            <input
              type="text"
              value={formData?.theme?.secondary || defaultTheme.secondary}
              onChange={(e) => handleThemeChange('secondary', e.target.value)}
              className="input input-bordered join-item w-full"
            />
            <input
              type="color"
              value={formData?.theme?.secondary || defaultTheme.secondary}
              onChange={(e) => handleThemeChange('secondary', e.target.value)}
              className="join-item btn btn-square"
            />
          </div>
        </div>

        {/* Accent Color */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Accent Color</span>
          </label>
          <div className="join">
            <input
              type="text"
              value={formData?.theme?.accent || defaultTheme.accent}
              onChange={(e) => handleThemeChange('accent', e.target.value)}
              className="input input-bordered join-item w-full"
            />
            <input
              type="color"
              value={formData?.theme?.accent || defaultTheme.accent}
              onChange={(e) => handleThemeChange('accent', e.target.value)}
              className="join-item btn btn-square"
            />
          </div>
        </div>

        {/* Base Colors */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Background Color</span>
          </label>
          <div className="join">
            <input
              type="text"
              value={formData?.theme?.['base-100'] || defaultTheme['base-100']}
              onChange={(e) => handleThemeChange('base-100', e.target.value)}
              className="input input-bordered join-item w-full"
            />
            <input
              type="color"
              value={formData?.theme?.['base-100'] || defaultTheme['base-100']}
              onChange={(e) => handleThemeChange('base-100', e.target.value)}
              className="join-item btn btn-square"
            />
          </div>
        </div>
      </div>

      {/* Theme Preview */}
      <div
        className="card bg-base-200 shadow-xl mt-8"
        style={{
          '--p': formData?.theme?.primary || defaultTheme.primary,
          '--s': formData?.theme?.secondary || defaultTheme.secondary,
          '--a': formData?.theme?.accent || defaultTheme.accent,
          '--n': formData?.theme?.neutral || defaultTheme.neutral,
          '--b1': formData?.theme?.['base-100'] || defaultTheme['base-100'],
          '--b2': formData?.theme?.['base-200'] || defaultTheme['base-200'],
          '--b3': formData?.theme?.['base-300'] || defaultTheme['base-300'],
        } as React.CSSProperties}
      >
        <div className="card-body">
          <h3 className="card-title">Theme Preview</h3>
          <SiteThemePreview theme={formData?.theme || defaultTheme} />
        </div>
      </div>
    </div>
  );

  const handleThemeChange = (key: string, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        theme: {
          ...prev.theme,
          [key]: value
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet || ''
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update site');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update site');
    } finally {
      setSaving(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-4">Connect your wallet to continue</h1>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-4">Site not found</h1>
          </div>
        </div>
      </div>
    );
  }

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

          <div className="tabs tabs-boxed bg-base-300">  {/* Add bg-base-300 for better contrast */}
            <button
              className={`tab ${activeTab === 'general' ? 'tab-active' : ''} hover:bg-base-100`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button
              className={`tab ${activeTab === 'profile' ? 'tab-active' : ''} hover:bg-base-100`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`tab ${activeTab === 'design' ? 'tab-active' : ''} hover:bg-base-100`}
              onClick={() => setActiveTab('design')}
            >
              Design
            </button>
          </div>


          <form onSubmit={handleSubmit} className="mt-4">
            {activeTab === 'general' && renderGeneralTab()}
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'design' && renderDesignTab()}

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
                className={`btn btn-primary ${saving ? 'loading' : ''}`}
                disabled={saving}
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
