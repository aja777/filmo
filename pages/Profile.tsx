
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Settings, CreditCard, Clock, Heart, MessageSquare, Headphones, LogOut, ChevronLeft, Crown, Edit2, Shield, Bell, Moon, Sun, X, CheckCircle, AlertCircle, User as UserIcon, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { MOCK_TRANSACTIONS } from '../constants';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout, loading, isAuthenticated } = useAuth();
  
  const [showTransactions, setShowTransactions] = useState(false);
  
  // Login Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!username || !password) {
        setLoginError('نام کاربری و رمز عبور الزامی است');
        return;
    }
    const result = await login(username, password);
    if (!result.success) {
        setLoginError(result.message || 'خطا در ورود');
    }
  };

  // Helper to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // If not logged in, show login form
  if (!isAuthenticated && !loading) {
      return (
          <Layout>
              <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6 md:pl-64">
                  <div className="w-full max-w-sm bg-dark-surface p-8 rounded-3xl border border-separator shadow-2xl">
                      <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                              <UserIcon size={32} />
                          </div>
                      </div>
                      <h2 className="text-2xl font-bold text-center mb-2 text-content-primary">ورود به حساب کاربری</h2>
                      <p className="text-center text-content-secondary text-sm mb-8">برای دسترسی به پروفایل و اشتراک خود وارد شوید</p>
                      
                      {loginError && (
                          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-xs mb-4 text-center">
                              {loginError}
                          </div>
                      )}

                      <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-content-secondary mr-1">نام کاربری / ایمیل</label>
                              <div className="relative">
                                  <UserIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-secondary" />
                                  <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-dark-bg border border-separator rounded-xl py-3 pr-10 pl-4 text-content-primary focus:border-primary focus:outline-none transition-colors"
                                    placeholder="example@mail.com"
                                  />
                              </div>
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-content-secondary mr-1">رمز عبور</label>
                              <div className="relative">
                                  <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-secondary" />
                                  <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-dark-bg border border-separator rounded-xl py-3 pr-10 pl-4 text-content-primary focus:border-primary focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                  />
                              </div>
                          </div>
                          <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-95 mt-4"
                          >
                              {loading ? 'در حال ورود...' : 'ورود'}
                          </button>
                      </form>
                  </div>
              </div>
          </Layout>
      );
  }

  if (loading) return (
      <Layout>
          <div className="flex items-center justify-center min-h-screen md:pl-64">
              <span className="text-primary">Loading...</span>
          </div>
      </Layout>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-dark-bg text-content-primary pb-24 md:pl-64 transition-colors duration-300 relative">
        {/* Header */}
        <div className="p-6 pb-2">
            <h1 className="text-2xl font-bold">پروفایل کاربری</h1>
        </div>

        <div className="p-4 space-y-6">
            {/* User Info Card */}
            <div className="bg-dark-surface p-6 rounded-2xl flex items-center space-x-4 space-x-reverse border border-separator relative overflow-hidden transition-colors">
                 {/* Decor */}
                 <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

                 <div className="relative z-10">
                     <div className="w-20 h-20 rounded-full bg-dark-card border-2 border-primary/50 p-1">
                         <img src={user?.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                     </div>
                     <button className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full border-2 border-dark-surface text-white shadow-lg active:scale-95 transition-transform">
                         <Edit2 size={12} />
                     </button>
                 </div>
                 
                 <div className="flex-1 z-10">
                     <h2 className="text-xl font-bold mb-1">{user?.name}</h2>
                     <p className="text-content-secondary text-sm dir-ltr text-right font-mono">{user?.email}</p>
                 </div>
            </div>

            {/* VIP Subscription Card */}
            <div className={`p-[1px] rounded-2xl shadow-lg transition-all ${user?.subscription.active ? 'bg-gradient-to-r from-green-500 via-green-600 to-green-800 shadow-green-900/20' : 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 shadow-amber-900/20'}`}>
                <div className="bg-dark-surface/80 backdrop-blur-md p-5 rounded-2xl flex flex-col justify-between h-full relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                            <div className={`flex items-center space-x-2 space-x-reverse mb-1 ${user?.subscription.active ? 'text-green-400' : 'text-amber-400'}`}>
                                 <Crown size={20} className={user?.subscription.active ? "fill-green-400" : "fill-amber-400"} />
                                 <span className="font-bold text-lg">{user?.subscription.active ? 'اشتراک فعال است' : 'اشتراک ویژه'}</span>
                            </div>
                            
                            {user?.subscription.active ? (
                                <div className="mt-1">
                                    <p className="text-xs text-content-secondary mb-1">اعتبار تا:</p>
                                    <p className="text-sm font-bold text-green-500 font-mono tracking-wide">
                                        {user.subscription.expires_at}
                                    </p>
                                    <p className="text-[10px] text-content-secondary mt-1">
                                        ({user.subscription.expires_hum})
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xs text-amber-200/80 mt-1">هنوز اشتراک تهیه نکرده‌اید</p>
                            )}
                        </div>
                        
                        {user?.subscription.active && (
                            <div className="bg-green-500/10 p-2 rounded-full border border-green-500/20">
                                <CheckCircle size={24} className="text-green-500" />
                            </div>
                        )}
                    </div>

                    <button 
                        className={`w-full py-3 rounded-xl text-xs font-extrabold active:scale-95 transition-all shadow-lg flex items-center justify-center space-x-2 space-x-reverse ${
                            user?.subscription.active 
                            ? 'bg-green-600 hover:bg-green-500 text-white' 
                            : 'bg-white text-amber-950 hover:bg-amber-100'
                        }`}
                    >
                        <span>{user?.subscription.active ? 'تمدید اشتراک' : 'خرید اشتراک'}</span>
                        {user?.subscription.active && <span className="text-[10px] bg-white/20 px-1.5 rounded ml-1">+ تمدید به مدت فعلی</span>}
                    </button>
                </div>
            </div>

            {/* Menu Groups */}
            <div className="space-y-4">
                <h3 className="text-sm text-content-secondary font-bold px-2">فعالیت‌ها</h3>
                <div className="bg-dark-surface rounded-2xl border border-separator overflow-hidden transition-colors">
                    <MenuItem icon={<Clock size={20} />} label="تاریخچه تماشا" onClick={() => {}} />
                    <MenuItem icon={<Heart size={20} />} label="لیست علاقه‌مندی‌ها" onClick={() => navigate('/saved')} />
                    <MenuItem icon={<CreditCard size={20} />} label="مدیریت تراکنش‌ها (پرداخت ها)" onClick={() => setShowTransactions(true)} />
                    <MenuItem icon={<MessageSquare size={20} />} label="نظرات ثبت شده" onClick={() => {}} />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm text-content-secondary font-bold px-2">تنظیمات و پشتیبانی</h3>
                <div className="bg-dark-surface rounded-2xl border border-separator overflow-hidden transition-colors">
                    <MenuItem 
                        icon={theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />} 
                        label={theme === 'dark' ? 'حالت روز' : 'حالت شب'} 
                        onClick={toggleTheme}
                        badge={theme === 'dark' ? 'خاموش' : 'روشن'}
                    />
                    <MenuItem icon={<Shield size={20} />} label="حریم خصوصی و امنیت" onClick={() => {}} />
                    <MenuItem icon={<Bell size={20} />} label="اعلان‌ها" onClick={() => {}} badge="2" />
                    <MenuItem icon={<Headphones size={20} />} label="پشتیبانی آنلاین" onClick={() => {}} />
                    <MenuItem icon={<Settings size={20} />} label="تنظیمات برنامه" onClick={() => {}} />
                    
                    <div className="p-1 mt-1">
                        <button onClick={logout} className="w-full flex items-center justify-between p-4 text-red-500 hover:bg-red-500/10 transition-colors rounded-xl group">
                            <div className="flex items-center space-x-3 space-x-reverse">
                                <LogOut size={20} className="group-active:scale-90 transition-transform" />
                                <span className="font-medium">خروج از حساب کاربری</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            
            <p className="text-center text-content-secondary text-xs mt-6 font-mono">KiaMovie App v2.0.0</p>
        </div>

        {/* Transactions Modal (Using Mock Data for now as API didn't provide tx endpoint) */}
        {showTransactions && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
                <div className="bg-dark-surface w-full md:w-[500px] h-[80vh] md:h-auto md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col animate-slideUp">
                    <div className="p-4 border-b border-separator flex justify-between items-center">
                        <h3 className="font-bold text-lg">سوابق پرداخت</h3>
                        <button onClick={() => setShowTransactions(false)} className="p-2 hover:bg-content-primary/10 rounded-full">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {MOCK_TRANSACTIONS.map((tx) => (
                            <div key={tx.id} className="bg-dark-card p-4 rounded-xl border border-separator flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm mb-1">{tx.title}</p>
                                    <p className="text-xs text-content-secondary font-mono">{formatDate(tx.date)}</p>
                                    <p className="text-[10px] text-content-secondary mt-1">کد پیگیری: {tx.refId}</p>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-content-primary">{tx.amount.toLocaleString()} تومان</p>
                                    <div className={`text-[10px] mt-1 flex items-center justify-end ${tx.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                        {tx.status === 'success' ? (
                                            <>
                                                <CheckCircle size={10} className="mr-1" /> موفق
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle size={10} className="mr-1" /> ناموفق
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

      </div>
    </Layout>
  );
};

const MenuItem = ({ icon, label, onClick, badge }: { icon: React.ReactNode, label: string, onClick: () => void, badge?: string }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 border-b border-separator last:border-0 hover:bg-content-primary/5 transition-colors group active:bg-content-primary/10">
        <div className="flex items-center space-x-3 space-x-reverse text-content-secondary group-hover:text-content-primary transition-colors">
            <div className="text-content-secondary group-hover:text-primary transition-colors">
                {icon}
            </div>
            <span className="font-medium text-sm">{label}</span>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
            {badge && (
                <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px]">
                    {badge}
                </span>
            )}
            <ChevronLeft size={16} className="text-content-secondary group-hover:text-primary transition-colors transform group-hover:-translate-x-1" />
        </div>
    </button>
);

export default Profile;
