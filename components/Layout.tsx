import React from 'react';
import { NavTab } from '../types';
import { Home, Search, Sparkles, Bookmark, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = (): NavTab => {
    const path = location.pathname;
    if (path === '/') return NavTab.HOME;
    if (path === '/search') return NavTab.SEARCH;
    if (path === '/ai') return NavTab.AI_GENIUS;
    if (path === '/saved') return NavTab.SAVED;
    if (path === '/profile') return NavTab.PROFILE;
    return NavTab.HOME;
  };

  const activeTab = getActiveTab();

  const handleNav = (tab: NavTab, path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-content-primary pb-20 transition-colors duration-300">
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto md:max-w-full md:pb-0 safe-bottom">
         {children}
      </main>

      {/* Bottom Navigation Bar - Mobile App Style */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-surface/95 backdrop-blur-lg border-t border-separator pb-safe z-50 md:hidden transition-colors">
        <div className="flex justify-around items-center h-16">
          <NavItem 
            icon={<Home size={24} />} 
            label="خانه" 
            isActive={activeTab === NavTab.HOME} 
            onClick={() => handleNav(NavTab.HOME, '/')} 
          />
          <NavItem 
            icon={<Search size={24} />} 
            label="جستجو" 
            isActive={activeTab === NavTab.SEARCH} 
            onClick={() => handleNav(NavTab.SEARCH, '/search')} 
          />
          <div className="relative -top-5">
             <button 
                onClick={() => handleNav(NavTab.AI_GENIUS, '/ai')}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/40 transition-transform active:scale-95 ${activeTab === NavTab.AI_GENIUS ? 'bg-content-primary text-primary' : 'bg-primary text-white'}`}
             >
                <Sparkles size={28} fill={activeTab === NavTab.AI_GENIUS ? "currentColor" : "none"} />
             </button>
          </div>
          <NavItem 
            icon={<Bookmark size={24} />} 
            label="ذخیره" 
            isActive={activeTab === NavTab.SAVED} 
            onClick={() => handleNav(NavTab.SAVED, '/saved')} 
          />
          <NavItem 
            icon={<User size={24} />} 
            label="پروفایل" 
            isActive={activeTab === NavTab.PROFILE} 
            onClick={() => handleNav(NavTab.PROFILE, '/profile')} 
          />
        </div>
      </div>

      {/* Desktop Sidebar Placeholder (Hidden on mobile) */}
      <div className="hidden md:flex fixed top-0 right-0 h-full w-64 bg-dark-surface border-l border-separator flex-col p-6 z-40 transition-colors">
        <h1 className="text-2xl font-bold text-primary mb-10">KiaMovie</h1>
        <div className="space-y-4">
             <SidebarItem icon={<Home />} label="خانه" active={activeTab === NavTab.HOME} onClick={() => handleNav(NavTab.HOME, '/')} />
             <SidebarItem icon={<Search />} label="جستجو" active={activeTab === NavTab.SEARCH} onClick={() => handleNav(NavTab.SEARCH, '/search')} />
             <SidebarItem icon={<Sparkles />} label="هوش مصنوعی" active={activeTab === NavTab.AI_GENIUS} onClick={() => handleNav(NavTab.AI_GENIUS, '/ai')} />
             <SidebarItem icon={<Bookmark />} label="لیست تماشا" active={activeTab === NavTab.SAVED} onClick={() => handleNav(NavTab.SAVED, '/saved')} />
             <SidebarItem icon={<User />} label="پروفایل کاربری" active={activeTab === NavTab.PROFILE} onClick={() => handleNav(NavTab.PROFILE, '/profile')} />
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactElement, label: string, isActive: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 w-16 transition-colors ${isActive ? 'text-primary' : 'text-content-secondary hover:text-content-primary'}`}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { 
      strokeWidth: isActive ? 2.5 : 2,
      fill: isActive ? "currentColor" : "none",
      className: isActive ? "opacity-100" : "opacity-80"
    })}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`flex items-center space-x-3 space-x-reverse w-full p-3 rounded-xl transition-all ${active ? 'bg-primary/10 text-primary font-bold' : 'text-content-secondary hover:bg-content-primary/5'}`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default Layout;