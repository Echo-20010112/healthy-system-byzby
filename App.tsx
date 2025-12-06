import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, History, FileText } from 'lucide-react';
import { getLast30DaysRecords, getRecords } from './services/storageService';
import Dashboard from './components/Dashboard';
import CheckInForm from './components/CheckInForm';
import HistoryTimeline from './components/HistoryTimeline';
import MonthlyReport from './components/MonthlyReport';

enum Tab {
  DASHBOARD = 'dashboard',
  CHECKIN = 'checkin',
  HISTORY = 'history',
  REPORT = 'report'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [dataVersion, setDataVersion] = useState(0); // Trigger re-renders when data changes

  useEffect(() => {
    // Initial data loading or setup can go here
    
    const handleStorageUpdate = () => {
        setDataVersion(prev => prev + 1);
    };
    
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }, []);

  // Fetch data based on context
  const dashboardData = getLast30DaysRecords();
  const allHistoryData = getRecords();

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return <Dashboard records={dashboardData} />;
      case Tab.CHECKIN:
        return <CheckInForm />;
      case Tab.HISTORY:
        return <HistoryTimeline records={allHistoryData} />;
      case Tab.REPORT:
        return <MonthlyReport records={dashboardData} />;
      default:
        return <Dashboard records={dashboardData} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
        <div>
           <h1 className="text-xl font-black tracking-tight text-gray-900">日常<span className="text-emerald-500">助手</span></h1>
           <p className="text-xs text-gray-400 font-medium">个人记录管家</p>
        </div>
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
            ME
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-100 flex justify-around items-center px-2 py-3 sticky bottom-0 z-20 pb-safe">
        <NavButton 
          active={activeTab === Tab.DASHBOARD} 
          onClick={() => setActiveTab(Tab.DASHBOARD)} 
          icon={<LayoutDashboard className="w-6 h-6" />} 
          label="概览" 
        />
        <NavButton 
          active={activeTab === Tab.CHECKIN} 
          onClick={() => setActiveTab(Tab.CHECKIN)} 
          icon={<PlusCircle className="w-6 h-6" />} 
          label="打卡" 
        />
        <NavButton 
          active={activeTab === Tab.HISTORY} 
          onClick={() => setActiveTab(Tab.HISTORY)} 
          icon={<History className="w-6 h-6" />} 
          label="历史" 
        />
        <NavButton 
          active={activeTab === Tab.REPORT} 
          onClick={() => setActiveTab(Tab.REPORT)} 
          icon={<FileText className="w-6 h-6" />} 
          label="汇报" 
        />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({active, onClick, icon, label}) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full py-1 transition-colors ${active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
  >
    <div className={`p-1 rounded-xl transition-all ${active ? 'bg-gray-100' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-medium mt-1 ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
  </button>
);

export default App;