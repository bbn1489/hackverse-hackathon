import React, { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Lock, Unlock, Mail, BarChart3, User, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const FocusLockApp: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<'welcome'|'login'|'dashboard'|'lock'|'guardian'>('welcome');
  const [userType, setUserType] = useState<'student'|'guardian'|null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [screenTime, setScreenTime] = useState<number>(0);
  const [dailyLimit, setDailyLimit] = useState<number>(120);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>('');
  const [storedOtp, setStoredOtp] = useState<string>('');
  const [guardianEmail, setGuardianEmail] = useState<string>('guardian@example.com');
  const [userName, setUserName] = useState<string>('');
  const [notification, setNotification] = useState<{type: 'success'|'error'|'warning'|'info'; message: string} | null>(null);

  const weeklyData: {day: string; minutes: number}[] = [
    { day: 'Mon', minutes: 95 },
    { day: 'Tue', minutes: 142 },
    { day: 'Wed', minutes: 88 },
    { day: 'Thu', minutes: 135 },
    { day: 'Fri', minutes: 156 },
    { day: 'Sat', minutes: 180 },
    { day: 'Sun', minutes: screenTime }
  ];

  const unlockHistory: {time: string; date: string; status: 'Approved'|'Denied' }[] = [
    { time: '2:30 PM', date: 'Today', status: 'Approved' },
    { time: '5:45 PM', date: 'Yesterday', status: 'Approved' },
    { time: '3:20 PM', date: '2 days ago', status: 'Denied' }
  ];

  useEffect(() => {
    // Start a timer while on the dashboard and not locked. We intentionally
    // omit `screenTime` from deps because we update it via functional setState
    // inside the interval. This avoids recreating the interval on every tick.
    if (currentPage === 'dashboard' && !isLocked) {
      const timer = setInterval(() => {
        setScreenTime(prev => {
          const newTime = prev + 1;
          const percentage = (newTime / dailyLimit) * 100;

          if (percentage >= 80 && percentage < 100 && !notification) {
            showNotification('warning', 'Warning: 80% of daily limit reached!');
          }

          if (newTime >= dailyLimit) {
            triggerLock();
            return newTime;
          }
          return newTime;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [currentPage, isLocked, dailyLimit]);

  const showNotification = (type: 'success'|'error'|'warning'|'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const triggerLock = () => {
    setIsLocked(true);
    setCurrentPage('lock');
    requestOTP();
    showNotification('error', 'Screen time limit reached! Device locked.');
  };

  const requestOTP = (): void => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setStoredOtp(otp);
    setOtpSent(true);
    showNotification('info', `OTP sent to ${guardianEmail}`);
    console.log('OTP for testing:', otp);
  };

  const verifyOTP = (): void => {
    if (otpInput === storedOtp) {
      setIsLocked(false);
      setOtpInput('');
      setOtpSent(false);
      setCurrentPage('dashboard');
      showNotification('success', 'Device unlocked successfully!');
    } else {
      showNotification('error', 'Invalid OTP. Please try again.');
    }
  };

  const WelcomePage = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <div className={`max-w-md w-full ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300`}>
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent`}>
            FocusLock
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Take control of your screen time
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              setUserType('student');
              setCurrentPage('login');
            }}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <User className="w-5 h-5" />
            <span>Student Login</span>
          </button>
          
          <button
            onClick={() => {
              setUserType('guardian');
              setCurrentPage('guardian');
            }}
            className={`w-full py-4 px-6 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2`}
          >
            <Shield className="w-5 h-5" />
            <span>Guardian Portal</span>
          </button>
        </div>
      </div>
    </div>
  );

  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <div className={`max-w-md w-full ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl p-8`}>
        <button
          onClick={() => setCurrentPage('welcome')}
          className={`mb-4 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
        >
          ← Back
        </button>
        
        <h2 className="text-3xl font-bold mb-6">Student Login</h2>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          
          <input
            type="email"
            placeholder="Guardian's Email"
            value={guardianEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGuardianEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          
          <input
            type="number"
            placeholder="Daily Limit (minutes)"
            value={dailyLimit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDailyLimit(Number(e.target.value))}
            className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          
          <button
            onClick={() => {
              if (userName && guardianEmail) {
                setCurrentPage('dashboard');
                showNotification('success', 'Welcome to FocusLock!');
              }
            }}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            Start Session
          </button>
        </div>
      </div>
    </div>
  );

  const Dashboard = () => {
    const percentage = (screenTime / dailyLimit) * 100;
    
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <nav className={`${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg p-4`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-purple-500" />
              <h1 className="text-2xl font-bold">FocusLock</h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Welcome back, {userName || 'User'}!</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track your screen time and stay focused
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-purple-500" />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Today</span>
              </div>
              <h3 className="text-4xl font-bold mb-2">{screenTime} min</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                of {dailyLimit} min limit
              </p>
              <div className="mt-4 bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 text-blue-500" />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weekly Avg</span>
              </div>
              <h3 className="text-4xl font-bold mb-2">128 min</h3>
              <p className={`text-sm ${percentage >= 80 ? 'text-yellow-500' : 'text-green-500'}`}>
                {percentage >= 80 ? '↑ 12% from last week' : '↓ 8% from last week'}
              </p>
            </div>

            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                {isLocked ? <Lock className="w-8 h-8 text-red-500" /> : <Unlock className="w-8 h-8 text-green-500" />}
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</span>
              </div>
              <h3 className="text-4xl font-bold mb-2">{isLocked ? 'Locked' : 'Active'}</h3>
              <p className={`text-sm ${isLocked ? 'text-red-500' : 'text-green-500'}`}>
                {isLocked ? 'Device is locked' : 'All systems operational'}
              </p>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 shadow-lg mb-6`}>
            <h3 className="text-xl font-bold mb-4">Weekly Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="day" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="minutes" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const LockScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-600 via-red-500 to-orange-500">
      <div className={`max-w-md w-full ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl p-8`}>
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-red-500 rounded-full mb-4 animate-pulse">
            <Lock className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Device Locked</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            You've reached your daily screen time limit
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-4 mb-6`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time used today</span>
            <span className="text-lg font-bold">{screenTime} min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily limit</span>
            <span className="text-lg font-bold">{dailyLimit} min</span>
          </div>
        </div>

        {otpSent && (
          <div className={`${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} border border-blue-500 rounded-xl p-4 mb-6 flex items-start space-x-3`}>
            <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold mb-1">OTP Sent</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Check {guardianEmail} for the unlock code
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otpInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtpInput(e.target.value)}
            maxLength={6}
            className={`w-full px-4 py-3 rounded-xl text-center text-2xl tracking-widest ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />

          <button
            onClick={verifyOTP}
            disabled={otpInput.length !== 6}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Unlock Device
          </button>

          <button
            onClick={requestOTP}
            className={`w-full py-3 px-6 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl font-semibold transition-all duration-200`}
          >
            Resend OTP
          </button>
        </div>

        <p className={`text-xs text-center mt-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Testing OTP: {storedOtp}
        </p>
      </div>
    </div>
  );

  const GuardianPortal = () => (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <nav className={`${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg p-4`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-purple-500" />
            <h1 className="text-2xl font-bold">Guardian Portal</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setCurrentPage('welcome')}
              className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Welcome, Guardian</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Monitor and manage screen time for your child
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
            <h3 className="text-xl font-bold mb-4">Child's Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name:</span>
                <span className="font-semibold">{userName || 'Student'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Today's Usage:</span>
                <span className="font-semibold">{screenTime} / {dailyLimit} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status:</span>
                <span className={`font-semibold ${isLocked ? 'text-red-500' : 'text-green-500'}`}>
                  {isLocked ? 'Locked' : 'Active'}
                </span>
              </div>
              <div className="mt-4 bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    (screenTime / dailyLimit) * 100 >= 100 ? 'bg-red-500' : 
                    (screenTime / dailyLimit) * 100 >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((screenTime / dailyLimit) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  requestOTP();
                  showNotification('success', 'New OTP generated and sent!');
                }}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>Generate New OTP</span>
              </button>
              
              <button
                onClick={() => {
                  setScreenTime(0);
                  setIsLocked(false);
                  showNotification('success', 'Screen time reset successfully!');
                }}
                className={`w-full py-3 px-6 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl font-semibold transition-all duration-200`}
              >
                Reset Screen Time
              </button>
            </div>

            {otpSent && (
              <div className={`mt-4 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} border border-blue-500 rounded-xl p-4`}>
                <p className="text-sm font-semibold mb-1">Current OTP</p>
                <p className="text-2xl font-mono font-bold tracking-wider">{storedOtp}</p>
              </div>
            )}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <h3 className="text-xl font-bold mb-4">Unlock History</h3>
          <div className="space-y-3">
            {unlockHistory.map((item, idx) => (
              <div key={idx} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div>
                  <p className="font-semibold">{item.time}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item.status === 'Approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-xl shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' :
            notification.type === 'error' ? 'bg-red-500' :
            notification.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          } text-white`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {notification.type === 'warning' && <AlertCircle className="w-5 h-5" />}
            {notification.type === 'info' && <Mail className="w-5 h-5" />}
            <span className="font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      {currentPage === 'welcome' && <WelcomePage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'lock' && <LockScreen />}
      {currentPage === 'guardian' && <GuardianPortal />}
    </div>
  );
};

export default FocusLockApp;