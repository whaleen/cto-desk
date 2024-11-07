// src/components/site-editor/TabContent.tsx
import { getBaseUrl } from '@/lib/domain';
import type { SiteData, TabType, SiteTheme } from '@/types/site';
import { PreviewIsolator } from './PreviewIsolator';
import { hexToHSL } from '@/utils/theme';

interface TabContentProps {
  tab: TabType;
  data: SiteData;
  theme: SiteTheme;
  onInputChange: (name: string, value: string) => void;
  onThemeChange: (key: string, value: string) => void;
}

export function TabContent({ tab, data, theme, onInputChange, onThemeChange }: TabContentProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onInputChange(e.target.name, e.target.value);
  };

  switch (tab) {
    case 'general':
      return <GeneralTab data={data} onChange={handleChange} />;
    case 'profile':
      return <ProfileTab data={data} onChange={handleChange} />;
    case 'design':
      // This is the line you need to update:
      return <DesignTab theme={theme} onThemeChange={onThemeChange} data={data} />;
    default:
      return null;
  }
}

function GeneralTab({ data, onChange }: { data: SiteData; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Site Name</span>
        </label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={onChange}
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
            value={data.subdomain}
            className="input input-bordered flex-1 rounded-l-none"
            readOnly
          />
        </div>
        <label className="label">
          <span className="label-text-alt">Site URL cannot be changed after creation</span>
        </label>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Custom Domain (Optional)</span>
        </label>
        <input
          type="text"
          name="customDomain"
          value={data.customDomain || ''}
          onChange={onChange}
          className="input input-bordered w-full"
          placeholder="example.com"
        />
      </div>
    </div>
  );
}

function ProfileTab({ data, onChange }: { data: SiteData; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) {
  return (
    <div className="space-y-4">
      {/* Profile Image Upload */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Profile Image</span>
        </label>
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-24 rounded-full bg-base-300">
              {data.profileImage && (
                <img src={data.profileImage} alt="Profile" />
              )}
            </div>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            accept="image/*"
            onChange={() => console.log('Image upload not implemented yet')}
          />
        </div>
      </div>

      {/* Banner Image Upload */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Banner Image</span>
        </label>
        <div className="w-full aspect-[3/1] relative rounded-lg overflow-hidden bg-base-300">
          {data.bannerImage && (
            <img
              src={data.bannerImage}
              alt="Banner"
              className="object-cover w-full h-full"
            />
          )}
        </div>
        <input
          type="file"
          className="file-input file-input-bordered w-full mt-2"
          accept="image/*"
          onChange={() => console.log('Image upload not implemented yet')}
        />
      </div>

      {/* Description */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          name="description"
          value={data.description || ''}
          onChange={onChange}
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
          value={data.twitterUrl || ''}
          onChange={onChange}
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
          value={data.telegramUrl || ''}
          onChange={onChange}
          className="input input-bordered w-full"
          placeholder="https://t.me/yourusername"
        />
      </div>
    </div>
  );
}

// Inside your TabContent.tsx, update the DesignTab component:

// src/components/site-editor/TabContent.tsx

function DesignTab({ theme, onThemeChange, data }: {
  theme: SiteTheme;
  onThemeChange: (key: string, value: string) => void;
  data: SiteData;
}) {
  const ColorInput = ({ label, colorKey }: { label: string; colorKey: keyof SiteTheme }) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className="join">
        <input
          type="text"
          value={theme[colorKey]}
          onChange={(e) => onThemeChange(colorKey, e.target.value)}
          className="input input-bordered join-item w-full"
        />
        <input
          type="color"
          value={theme[colorKey]}
          onChange={(e) => onThemeChange(colorKey, e.target.value)}
          className="join-item btn btn-square"
        />
      </div>
    </div>
  );

  // Create theme styles for the preview
  const previewStyles = {
    '--p': hexToHSL(theme.primary),
    '--s': hexToHSL(theme.secondary),
    '--a': hexToHSL(theme.accent),
    '--n': hexToHSL(theme.neutral),
    '--b1': hexToHSL(theme['base-100']),
    '--b2': hexToHSL(theme['base-200']),
    '--b3': hexToHSL(theme['base-300']),
    '--bc': hexToHSL(theme['base-content']),
    '--pf': hexToHSL(theme.primary),
    '--sf': hexToHSL(theme.secondary),
    '--af': hexToHSL(theme.accent),
    '--nf': hexToHSL(theme.neutral),
  } as React.CSSProperties;


  // console.log('Theme values:', theme);
  // console.log('Preview styles:', previewStyles);

  return (
    <div className="space-y-6">
      {/* <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Customize your site's colors. Changes will be reflected in real-time.</span>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorInput label="Primary Color" colorKey="primary" />
        <ColorInput label="Secondary Color" colorKey="secondary" />
        <ColorInput label="Accent Color" colorKey="accent" />
        <ColorInput label="Background Color" colorKey="base-100" />
        <ColorInput label="Base 200" colorKey="base-200" />
        <ColorInput label="Base 300" colorKey="base-300" />
      </div>

      {/* Site Preview */}
      <PreviewIsolator theme={previewStyles}>
        {/* Remove extra card wrapping and apply directly to the site preview */}
        <div className="rounded-lg overflow-hidden bg-base-100">
          <div className="relative w-full h-24 md:h-32 bg-base-200">
            {data.bannerImage ? (
              <img
                src={data.bannerImage}
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary to-secondary opacity-20" />
            )}
          </div>

          <div className="p-4">
            <div className="relative -mt-10 mb-4">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-2">
                {/* Profile Image */}
                <div className="w-20 h-20 rounded-full border-4 border-base-100 overflow-hidden bg-base-200">
                  {data.profileImage ? (
                    <img
                      src={data.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-base-300" />
                  )}
                </div>

                {/* Profile Info */}
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold mb-1 text-base-content">{data.name}</h3>
                  <p className="text-base-content/60 font-mono text-sm">
                    {data.user.wallet.slice(0, 4)}...{data.user.wallet.slice(-4)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {data.description && (
              <div className="bg-base-200 rounded-lg p-4 mb-4">
                <p className="whitespace-pre-wrap text-sm text-base-content">{data.description}</p>
              </div>
            )}

            {/* Social Links */}
            {(data.twitterUrl || data.telegramUrl) && (
              <div className="flex gap-2 mb-4">
                {data.twitterUrl && (
                  <button className="btn btn-primary btn-sm btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Twitter
                  </button>
                )}
                {data.telegramUrl && (
                  <button className="btn btn-primary btn-sm btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    Telegram
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </PreviewIsolator>
    </div>
  );
}
