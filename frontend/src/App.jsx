import { useState, useEffect, useCallback } from 'react';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { documents as demoDocs, reminders as demoReminders, notifications as demoNotifs } from './data/mockData';

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
import AskLifeFlowModal from './components/AskLifeFlowModal';
import GoalDetail from './components/GoalDetail';
import TechArchitecture from './components/TechArchitecture';
import Privacy from './components/Privacy';
import Competitive from './components/Competitive';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';

function AppContent() {
  const { user, profile, isAuthenticated, isDemo, enterDemo, loading } = useAuth();

  const [screen, setScreen] = useState('landing');

  // Backend state for authenticated users
  const [documents, setDocuments] = useState([]);
  const [goals, setGoals] = useState([]);
  const [remindersList, setRemindersList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [familyData, setFamilyData] = useState({
    manualMembers: [],
    connectedMembers: [],
    pendingOutbound: [],
    incomingRequests: [],
  });

  // UI state
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [showAskLifeFlow, setShowAskLifeFlow] = useState(false);
  const [askLifeFlowQuery, setAskLifeFlowQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
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
      if (famRes.status === 'fulfilled') setFamilyData(famRes.value);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }, [isAuthenticated, isDemo]);

  useEffect(() => {
    if (isDemo) {
      setDocuments(demoDocs);
      setRemindersList(demoReminders);
      setNotifications(demoNotifs);
      setFamilyData({
        manualMembers: [],
        connectedMembers: [
          { _id: 'c1', userId: 'u2', connectionId: 'c1', name: 'Suresh Sharma', email: 'suresh@demo.com', relationship: 'Father', sharedDocumentsCount: 2 }
        ],
        pendingOutbound: [],
        incomingRequests: [],
      });
      setGoals([
        {
          _id: 'g-demo-1',
          id: 'g-demo-1',
          title: 'Scholarship Application Preparation',
          category: 'Education',
          originalUserRequest: 'I want to apply for a scholarship.',
          readinessScore: 80,
          nextBestAction: 'Obtain your income certificate before continuing. This is the only missing required document.',
          aiExplanation: 'You are mostly ready to begin your scholarship application. Your identity, academic, and bank documents are available in your vault. The main missing item is your income certificate.',
          requirements: [
            { name: 'Aadhaar Card', status: 'available', required: true },
            { name: 'Academic Marksheet', status: 'available', required: true },
            { name: 'Bank Passbook', status: 'available', required: true },
            { name: 'Income Certificate', status: 'missing', required: true },
            { name: 'Passport Photo', status: 'optional', required: false }
          ],
          actions: [
            { _id: 'a1', title: 'Complete student profile', status: 'Completed', priority: 'high' },
            { _id: 'a2', title: 'Upload academic marksheet', status: 'Completed', priority: 'high' },
            { _id: 'a3', title: 'Obtain income certificate', status: 'Not Started', priority: 'high' },
            { _id: 'a4', title: 'Submit scholarship application', status: 'Not Started', priority: 'medium' }
          ]
        }
      ]);
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
  const navigate = useCallback((dest, paramId) => {
    if (dest === 'ask-lifeflow') {
      setShowAskLifeFlow(true);
      setAskLifeFlowQuery('');
      return;
    }
    setScreen(dest);
    if (dest === 'doc-intelligence' && paramId) setSelectedDocId(paramId);
    if (dest === 'goal-detail' && paramId) setSelectedGoalId(paramId);
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

  const handleOnboardingComplete = async () => {
    await fetchUserData();
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
        fetchUserData();
      }
      setShowAddDoc(false);
      addToast('Document added and analyzed', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to add document', 'error');
    }
  };

  const handleOpenAskLifeFlow = (query = '') => {
    setAskLifeFlowQuery(query);
    setShowAskLifeFlow(true);
  };

  const handleSaveAnalyzedGoal = async (analyzedGoal) => {
    try {
      if (isDemo) {
        const newDemoGoal = {
          ...analyzedGoal,
          _id: 'goal-demo-' + Date.now(),
          id: 'goal-demo-' + Date.now(),
        };
        setGoals(prev => [newDemoGoal, ...prev]);
        setSelectedGoalId(newDemoGoal._id);
        setScreen('goal-detail');
        addToast(`Goal "${analyzedGoal.title}" created successfully!`, 'success');
      } else {
        const createdGoal = await api.createGoal(analyzedGoal);
        setGoals(prev => [createdGoal, ...prev]);
        setSelectedGoalId(createdGoal._id);
        setScreen('goal-detail');
        addToast(`Goal "${analyzedGoal.title}" created successfully!`, 'success');
        fetchUserData();
      }
    } catch (err) {
      addToast(err.message || 'Failed to save goal', 'error');
    }
  };

  const handleUpdateActionStatus = async (goalId, actionId, status) => {
    try {
      if (isDemo) {
        setGoals(prev => prev.map(g => {
          if (g._id === goalId || g.id === goalId) {
            const updatedActions = (g.actions || []).map(a =>
              (a._id === actionId || a.id === actionId) ? { ...a, status } : a
            );
            return { ...g, actions: updatedActions };
          }
          return g;
        }));
      } else {
        const updatedGoal = await api.updateActionStatus(goalId, actionId, status);
        setGoals(prev => prev.map(g => (g._id === goalId || g.id === goalId) ? updatedGoal : g));
      }
      addToast('Action status updated', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update action step', 'error');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      if (isDemo) {
        setGoals(prev => prev.filter(g => g._id !== goalId && g.id !== goalId));
      } else {
        await api.deleteGoal(goalId);
        setGoals(prev => prev.filter(g => g._id !== goalId && g.id !== goalId));
      }
      addToast('Goal removed', 'info');
      setScreen('overview');
    } catch (err) {
      addToast(err.message || 'Failed to delete goal', 'error');
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

  const handleMarkAllNotifsRead = async () => {
    try {
      if (!isDemo) {
        await Promise.all(notifications.filter(n => !n.read).map(n => api.markNotificationRead(n._id || n.id)));
      }
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      addToast('All notifications marked as read', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptFamilyRequest = async (connectionId) => {
    try {
      if (!isDemo) {
        await api.acceptFamilyRequest(connectionId);
        fetchUserData();
      }
      addToast('Family connection accepted!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to accept connection', 'error');
    }
  };

  const handleDeclineFamilyRequest = async (connectionId) => {
    try {
      if (!isDemo) {
        await api.declineFamilyRequest(connectionId);
        fetchUserData();
      }
      addToast('Family connection declined', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to decline connection', 'error');
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

  const currentGoal = goals.find(g => String(g._id || g.id) === String(selectedGoalId)) || goals[0];

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
        return (
          <Overview
            documents={documents}
            goals={goals}
            navigate={navigate}
            onAddDoc={() => setShowAddDoc(true)}
            onOpenAskLifeFlow={handleOpenAskLifeFlow}
            onSelectGoal={(g) => navigate('goal-detail', g._id || g.id)}
          />
        );
      case 'goal-detail':
        return (
          <GoalDetail
            goal={currentGoal}
            navigate={navigate}
            onUpdateActionStatus={handleUpdateActionStatus}
            onDeleteGoal={handleDeleteGoal}
            onAddDoc={() => setShowAddDoc(true)}
            addToast={addToast}
          />
        );
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
        return <Readiness documents={documents} navigate={navigate} onSaveGoal={handleSaveAnalyzedGoal} />;
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
        return (
          <Family
            familyData={familyData}
            userDocuments={documents}
            onRefresh={fetchUserData}
            addToast={addToast}
          />
        );
      case 'vault':
        return <Vault documents={documents} onAddDoc={() => setShowAddDoc(true)} onRefresh={fetchUserData} addToast={addToast} />;
      case 'profile':
        return <ProfilePage navigate={navigate} addToast={addToast} />;
      case 'notifications':
        return (
          <NotificationsPage
            notifications={notifications}
            markNotifRead={handleMarkNotifRead}
            markAllNotifsRead={handleMarkAllNotifsRead}
            navigate={navigate}
            onAcceptFamilyRequest={handleAcceptFamilyRequest}
            onDeclineFamilyRequest={handleDeclineFamilyRequest}
          />
        );
      case 'architecture':
        return <TechArchitecture />;
      case 'privacy':
        return <Privacy />;
      case 'competitive':
        return <Competitive />;
      default:
        return (
          <Overview
            documents={documents}
            goals={goals}
            navigate={navigate}
            onAddDoc={() => setShowAddDoc(true)}
            onOpenAskLifeFlow={handleOpenAskLifeFlow}
            onSelectGoal={(g) => navigate('goal-detail', g._id || g.id)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617]">
      {showShell ? (
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            screen={screen}
            navigate={(s, p) => { setMobileOpen(false); navigate(s, p); }}
            unreadNotifCount={notifications.filter(n => !n.read).length}
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header
              screen={screen}
              profile={profile}
              notifications={notifications}
              markNotifRead={handleMarkNotifRead}
              markAllNotifsRead={handleMarkAllNotifsRead}
              navigate={(s, p) => { setMobileOpen(false); navigate(s, p); }}
              onToggleMobileMenu={() => setMobileOpen(prev => !prev)}
              onAcceptFamilyRequest={handleAcceptFamilyRequest}
              onDeclineFamilyRequest={handleDeclineFamilyRequest}
            />
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="max-w-6xl mx-auto fade-in">
                {renderScreen()}
              </div>
            </main>
          </div>

          <BottomNav screen={screen} navigate={(s, p) => { setMobileOpen(false); navigate(s, p); }} />
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

      {showAskLifeFlow && (
        <AskLifeFlowModal
          initialQuery={askLifeFlowQuery}
          onClose={() => setShowAskLifeFlow(false)}
          onSaveGoal={handleSaveAnalyzedGoal}
          isDemo={isDemo}
          userDocs={documents}
          goals={goals}
          familyData={familyData}
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
