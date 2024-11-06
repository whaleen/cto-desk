// src/app/[site]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { SiteTheme } from './theme';

// Reserved paths that users cannot use
const RESERVED_PATHS = [
  'admin',
  'api',
  'dashboard',
  'login',
  'signup',
  'faq',
  'contact',
  'about',
  'terms',
  'privacy',
  'help',
  'settings',
  'profile',
  'search',
  'portfolio',
  // Add any other reserved paths here
];

export async function generateStaticParams() {
  const sites = await prisma.site.findMany({
    select: { subdomain: true },
  });
  return sites.map((site) => ({
    site: site.subdomain,
  }));
}

// This function can be exported to be reused in the API
export function isValidSitePath(path: string): boolean {
  return (
    // Check if path is not reserved
    !RESERVED_PATHS.includes(path.toLowerCase()) &&
    // Check if path matches our allowed pattern
    /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(path) &&
    // Prevent consecutive hyphens
    !path.includes('--')
  );
}

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
  theme: any; // We'll type this properly when we implement themes
  user: {
    wallet: string;
  };
}

export default async function SitePage({
  params: { site },
}: {
  params: { site: string };
}) {
  // Check if this is a reserved path
  if (RESERVED_PATHS.includes(site.toLowerCase())) {
    notFound();
  }

  const sitePage = await prisma.site.findUnique({
    where: { subdomain: site },
    include: {
      user: {
        select: {
          wallet: true,
        },
      },
    },
  });


  if (!sitePage) {
    notFound();
  }

  return (
    <div
      data-theme={sitePage.theme?.name || "light"}
      className="min-h-screen"
    >
      {/* Banner Section */}
      <div className="relative w-full h-48 md:h-64 bg-base-200">
        {sitePage.bannerImage ? (
          <img
            src={sitePage.bannerImage}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary to-secondary opacity-20" />
        )}
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full border-4 border-base-100 overflow-hidden bg-base-200">
              {sitePage.profileImage ? (
                <img
                  src={sitePage.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-base-300" />
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{sitePage.name}</h1>
              <p className="text-base-content/60 font-mono">
                {sitePage.user.wallet.slice(0, 4)}...{sitePage.user.wallet.slice(-4)}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {sitePage.description && (
          <div className="card bg-base-200 mb-8">
            <div className="card-body">
              <p className="whitespace-pre-wrap">{sitePage.description}</p>
            </div>
          </div>
        )}

        {/* Social Links */}
        {(sitePage.twitterUrl || sitePage.telegramUrl) && (
          <div className="flex gap-4 mb-8">
            {sitePage.twitterUrl && (
              <a
                href={sitePage.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-outline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 mr-2 fill-current"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Twitter
              </a>
            )}
            {sitePage.telegramUrl && (
              <a
                href={sitePage.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-outline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 mr-2 fill-current"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Telegram
              </a>
            )}
          </div>
        )}

        {/* Components will be rendered here in future updates */}
        <div className="space-y-8">
          {/* Component blocks will go here */}
        </div>
      </div>
    </div>
  );
}
