import { TabType } from "@/types/site";

// src/components/site-editor/TabNav.tsx
interface TabNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="tabs tabs-boxed bg-base-300">
      <button
        className={`tab ${activeTab === 'general' ? 'tab-active' : ''} hover:bg-base-100`}
        onClick={() => onTabChange('general')}
      >
        General
      </button>
      <button
        className={`tab ${activeTab === 'profile' ? 'tab-active' : ''} hover:bg-base-100`}
        onClick={() => onTabChange('profile')}
      >
        Profile
      </button>
      <button
        className={`tab ${activeTab === 'design' ? 'tab-active' : ''} hover:bg-base-100`}
        onClick={() => onTabChange('design')}
      >
        Design
      </button>
    </div>
  );
}
