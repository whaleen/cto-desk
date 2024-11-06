// src/components/site-editor/TabContent.tsx
import { getBaseUrl } from '@/lib/domain';
import { SiteThemePreview } from '@/components/SiteThemePreview';
import type { SiteData, TabType, SiteTheme } from '@/types/site';

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
      return <DesignTab theme={theme} onThemeChange={onThemeChange} />;
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

function DesignTab({ theme, onThemeChange }: { theme: SiteTheme; onThemeChange: (key: string, value: string) => void }) {
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

  return (
    <div className="space-y-6">
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Customize your site's colors. Changes will be reflected in real-time.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorInput label="Primary Color" colorKey="primary" />
        <ColorInput label="Secondary Color" colorKey="secondary" />
        <ColorInput label="Accent Color" colorKey="accent" />
        <ColorInput label="Background Color" colorKey="base-100" />
      </div>

      {/* Theme Preview */}
      <div
        className="card bg-base-200 shadow-xl mt-8"
        style={{
          '--p': theme.primary,
          '--s': theme.secondary,
          '--a': theme.accent,
          '--n': theme.neutral,
          '--b1': theme['base-100'],
          '--b2': theme['base-200'],
          '--b3': theme['base-300'],
        } as React.CSSProperties}
      >
        <div className="card-body">
          <h3 className="card-title">Theme Preview</h3>
          <SiteThemePreview theme={theme} />
        </div>
      </div>
    </div>
  );
}
