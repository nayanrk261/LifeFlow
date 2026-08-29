import { useState, useCallback } from 'react';
import './index.css';
import { userProfile, documents as initialDocs, reminders as initialReminders, notifications as initialNotifications } from './data/mockData';

// Shell
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';

// Screens
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Overview from './components/Overview';
import Documents from './components/Documents';
import DocIntelligence from './components/DocIntelligence';
import NeedsAttention from './components/NeedsAttention';
import Readiness from './components/Readiness';
import Assistant from './components/Assistant';
import DocGenerator from './components/DocGenerator';
import Reminders from './components/Reminders';
import Family from './components/Family';
import Vault from './components/Vault';
import AddDocModal from './components/AddDocModal';
import TechArchitecture from './components/TechArchitecture';
import Privacy from './components/Privacy';
import Competitive from './components/Competitive';

function App() {
  // Auth & onboarding
  const [screen, setScreen] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [profile, setProfile] = useState(userProfile);

  // Data state
  const [documents, setDocuments] = useState(initialDocs);
  const [remindersList, setRemindersList] = useState(initialReminders);
  const [notifs, setNotifs] = useState(initialNotifications);

  // UI state
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast system
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Navigation
  const navigate = useCallback((dest, docId) => {
    setScreen(dest);
    if (docId) setSelectedDocId(docId);
    window.scrollTo(0, 0);
  }, []);

  // Demo mode — skip auth/onboarding
  const enterDemo = useCallback(() => {
    setIsLoggedIn(true);
    setOnboardingComplete(true);
    setProfile(userProfile);
    setDocuments(initialDocs);
    setRemindersList(initialReminders);
    setScreen('overview');
    addToast('Demo mode activated — viewing as Rahul Sharma', 'info');
  }, [addToast]);

  // Auth handlers
  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
    setScreen('onboarding');
  }, []);

  const handleOnboardingComplete = useCallback((profileData) => {
    setProfile(prev => ({ ...prev, ...profileData }));
    setOnboardingComplete(true);
    setScreen('overview');
    addToast('Welcome to DocAction, ' + (profileData.firstName || 'Rahul') + '!', 'success');
  }, [addToast]);

  // Reminder actions
  const toggleReminder = useCallback((id) => {
    setRemindersList(prev => prev.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  }, []);

  const addReminder = useCallback((reminder) => {
    setRemindersList(prev => [...prev, { ...reminder, id: 'rem-' + Date.now() }]);
    addToast('Reminder added', 'success');
  }, [addToast]);

  // Add document
  const handleAddDocument = useCallback((doc) => {
    setDocuments(prev => [...prev, { ...doc, id: 'doc-' + Date.now() }]);
    setShowAddDoc(false);
    addToast('Document added and analyzed', 'success');
  }, [addToast]);

  // Mark notification read
  const markNotifRead = useCallback((id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  // Determine if we should show shell (sidebar, header, bottom nav)
  const showShell = isLoggedIn && onboardingComplete && !['landing', 'auth', 'onboarding'].includes(screen);

  // Screens that show inside the app shell
  const renderScreen = () => {
    switch (screen) {
      case 'landing':
        return <LandingPage onGetStarted={() => navigate('auth')} onDemo={enterDemo} />;
      case 'auth':
        return <Auth onLogin={handleLogin} onBack={() => navigate('landing')} />;
      case 'onboarding':
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case 'overview':
        return <Overview documents={documents} profile={profile} navigate={navigate} />;
      case 'documents':
        return <Documents documents={documents} navigate={navigate} onAddDoc={() => setShowAddDoc(true)} />;
      case 'doc-intelligence':
        return <DocIntelligence document={documents.find(d => d.id === selectedDocId)} navigate={navigate} addToast={addToast} addReminder={addReminder} />;
      case 'attention':
        return <NeedsAttention documents={documents} navigate={navigate} />;
      case 'readiness':
        return <Readiness documents={documents} navigate={navigate} />;
      case 'assistant':
        return <Assistant documents={documents} profile={profile} />;
      case 'generator':
        return <DocGenerator profile={profile} addToast={addToast} />;
      case 'reminders':
        return <Reminders reminders={remindersList} toggleReminder={toggleReminder} addReminder={addReminder} />;
      case 'family':
        return <Family navigate={navigate} />;
      case 'vault':
        return <Vault documents={documents} onAddDoc={() => setShowAddDoc(true)} />;
      case 'architecture':
        return <TechArchitecture />;
      case 'privacy':
        return <Privacy />;
      case 'competitive':
        return <Competitive />;
      default:
        return <Overview documents={documents} profile={profile} navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617]">
      {showShell ? (
        <div className="flex h-screen overflow-hidden">
          {/* Desktop Sidebar */}
          <Sidebar screen={screen} navigate={navigate} profile={profile} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header
              profile={profile}
              notifications={notifs}
              markNotifRead={markNotifRead}
              navigate={navigate}
            />
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="max-w-6xl mx-auto fade-in">
                {renderScreen()}
              </div>
            </main>
          </div>

          {/* Mobile Bottom Nav */}
          <BottomNav screen={screen} navigate={navigate} />
        </div>
      ) : (
        renderScreen()
      )}

      {/* Add Document Modal */}
      {showAddDoc && (
        <AddDocModal
          onClose={() => setShowAddDoc(false)}
          onAdd={handleAddDocument}
        />
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg border text-sm font-medium fade-in backdrop-blur-sm ${
              toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
              'bg-slate-800/90 border-slate-700 text-slate-300'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
