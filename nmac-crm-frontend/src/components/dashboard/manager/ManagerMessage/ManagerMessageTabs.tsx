import React from 'react';

type TabType = 'Message History' | 'Compose Message'|'Templates';

interface Props {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

const tabs: TabType[] = ['Message History', 'Compose Message','Templates'];

const ManagerMessageTabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="w-full overflow-x-auto no-scrollbar">
            <div className="inline-flex gap-2 mb-6 bg-gray-200 px-0.5 py-0.5 rounded-3xl flex-nowrap">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-full text-md font-medium whitespace-nowrap transition-colors ${
                            activeTab === tab
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'bg-transparent text-gray-600 hover:bg-white/50'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ManagerMessageTabs;
