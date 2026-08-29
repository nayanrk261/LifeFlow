import { useState, useEffect, useCallback } from 'react';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { documents as demoDocs, reminders as demoReminders, notifications as demoNotifs, familyMembers as demoFamily } from './data/mockData';

// Shell
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';

// Screens & Pages
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
import ProfilePage from './pages/ProfilePage';

function AppContent() {
  const { user, profile, isAuthenticated, isDemo, enterDemo, loading, logout } = useAuth();

  const [screen, setScreen] = useState('landing');

  // Backend state for authenticated users
  const [documents, setDocuments] = useState([]);
  const [goals, setGoals] = useState([]);
  const [remindersList, setRemindersList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);

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

  // Fetch user data when authenticated
  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated || isDemo) return;

    try {
      const [docsRes, goalsRes, remsRes, notifsRes, famRes] = await Promise.allSettled([
        api.getDocuments(),
        api.getGoals(),
        api.getReminders(),
        api.getNotifications(),
        api.getFamily(),
      ]);

      if (docsRes.status === 'fulfilled') setDocuments(docsRes.value);
      if (goalsRes.status === 'fulfilled') setGoals(goalsRes.value);
      if (remsRes.status === 'fulfilled') setRemindersList(remsRes.value);
      if (notifsRes.status === 'fulfilled') setNotifications(notifsRes.value);
      if (famRes.status === 'fulfilled') setFamilyMembers(famRes.value);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }, [isAuthenticated, isDemo]);

  useEffect(() => {
    if (isDemo) {
      setDocuments(demoDocs);
      setRemindersList(demoReminders);
      setNotifications(demoNotifs);
      setFamilyMembers(demoFamily);
    } else if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, isDemo, fetchUserData]);

  // Sync screen on login/onboarding state
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        if (!isDemo && user && !user.onboardingCompleted) {
          setScreen('onboarding');
        } else if (screen === 'landing' || screen === 'auth' || screen === 'onboarding') {
          setScreen('overview');
        }
      }
    }
  }, [isAuthenticated, isDemo, user, loading]);

  // Navigation helper
  const navigate = useCallback((dest, docId) => {
    setScreen(dest);
    if (docId) setSelectedDocId(docId);
    window.scrollTo(0, 0);
  }, []);

  // Handlers
  const handleAuthSuccess = (authUser, needsOnboarding) => {
    if (needsOnboarding) {
      setScreen('onboarding');
    } else {
      setScreen('overview');
    }
    addToast(`Welcome ${authUser.name}!`, 'success');
  };

  const handleOnboardingComplete = () => {
    setScreen('overview');
    addToast('LifeFlow setup complete!', 'success');
  };

  const handleAddDocument = async (docData) => {
    try {
      if (isDemo) {
        const newDoc = { ...docData, id: 'doc-' + Date.now() };
        setDocuments(prev => [newDoc, ...prev]);
      } else {
        const created = await api.createDocument(docData);
        setDocuments(prev => [created, ...prev]);
      }
      setShowAddDoc(false);
      addToast('Document added and analyzed', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to add document', 'error');
    }
  };

  const handleSaveGoal = async (processObj) => {
    try {
      if (isDemo) {
        addToast(`Saved ${processObj.name} to goals (Demo)`, 'success');
      } else {
        await api.createGoal({
          processType: processObj.id,
          title: processObj.name,
          category: 'General',
          progress: 50,
          requirements: processObj.reqs.map(r => ({ name: r, status: 'missing' }))
        });
        addToast(`Saved ${processObj.name} as active goal`, 'success');
        fetchUserData();
      }
    } catch (err) {
      addToast(err.message || 'Failed to save goal', 'error');
    }
  };

  const handleMarkNotifRead = async (notifId) => {
    try {
      if (!isDemo) {
        await api.markNotificationRead(notifId);
      }
      setNotifications(prev => prev.map(n => (n._id === notifId || n.id === notifId) ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400 text-[14px]">
        Loading LifeFlow...
      </div>
    );
  }

  const showShell = isAuthenticated && !['landing', 'auth', 'onboarding'].includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => navigate('auth')}
            onDemo={() => { enterDemo(); navigate('overview'); }}
          />
        );
      case 'auth':
        return <Auth onAuthSuccess={handleAuthSuccess} onBack={() => navigate('landing')} />;
      case 'onboarding':
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case 'overview':
        return <Overview documents={documents} goals={goals} navigate={navigate} onAddDoc={() => setShowAddDoc(true)} />;
      case 'documents':
        return <Documents documents={documents} navigate={navigate} onAddDoc={() => setShowAddDoc(true)} />;
      case 'doc-intelligence':
        return (
          <DocIntelligence
            document={documents.find(d => (d._id === selectedDocId || d.id === selectedDocId))}
            navigate={navigate}
            addToast={addToast}
            addReminder={() => addToast('Reminder set', 'success')}
          />
        );
      case 'attention':
        return <NeedsAttention documents={documents} navigate={navigate} />;
      case 'readiness':
        return <Readiness documents={documents} navigate={navigate} onSaveGoal={handleSaveGoal} />;
      case 'assistant':
        return <Assistant documents={documents} profile={profile} />;
      case 'generator':
        return <DocGenerator addToast={addToast} />;
      case 'reminders':
        return (
          <Reminders
            reminders={remindersList}
            toggleReminder={() => {}}
            addReminder={() => addToast('Reminder created', 'success')}
          />
        );
      case 'family':
        return <Family familyMembers={familyMembers} onRefresh={fetchUserData} addToast={addToast} />;
      case 'vault':
        return <Vault documents={documents} onAddDoc={() => setShowAddDoc(true)} />;
      case 'profile':
        return <ProfilePage navigate={navigate} addToast={addToast} />;
      case 'architecture':
        return <TechArchitecture />;
      case 'privacy':
        return <Privacy />;
      case 'competitive':
        return <Competitive />;
      default:
        return <Overview documents={documents} goals={goals} navigate={navigate} onAddDoc={() => setShowAddDoc(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617]">
      {showShell ? (
        <div className="flex h-screen overflow-hidden">
          <Sidebar screen={screen} navigate={navigate} unreadNotifCount={notifications.filter(n => !n.read).length} />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header
              profile={profile}
              notifications={notifications}
              markNotifRead={handleMarkNotifRead}
              navigate={navigate}
            />
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="max-w-6xl mx-auto fade-in">
                {renderScreen()}
              </div>
            </main>
          </div>

          <BottomNav screen={screen} navigate={navigate} />
        </div>
      ) : (
        renderScreen()
      )}

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
            className={`px-4 py-3 rounded-lg border text-sm font-medium fade-in backdrop-blur-sm shadow-lg ${
              toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
              toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
