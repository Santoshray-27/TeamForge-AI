import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Landing } from './pages/Landing/index';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { HackBot } from './components/features/HackBot';
import { useAuthStore } from './store/authStore';

// Lazy load heavy pages
const Dashboard = lazy(() =>
  import('./pages/Dashboard/index').then((m) => ({ default: m.Dashboard }))
);
const TeamMatching = lazy(() =>
  import('./pages/TeamMatching/index').then((m) => ({
    default: m.TeamMatching,
  }))
);
const GitHubAnalyzer = lazy(() =>
  import('./pages/GitHubAnalyzer/index').then((m) => ({
    default: m.GitHubAnalyzer,
  }))
);
const TeamChemistry = lazy(() =>
  import('./pages/TeamChemistry/index').then((m) => ({
    default: m.TeamChemistry,
  }))
);
const GapAnalyzer = lazy(() =>
  import('./pages/GapAnalyzer/index').then((m) => ({
    default: m.GapAnalyzer,
  }))
);
const ReadinessAnalyzer = lazy(() =>
  import('./pages/ReadinessAnalyzer/index').then((m) => ({
    default: m.ReadinessAnalyzer,
  }))
);
const Upskilling = lazy(() =>
  import('./pages/Upskilling/index').then((m) => ({ default: m.Upskilling }))
);

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 animate-ping opacity-20" />
      </div>
      <div className="text-center">
        <p className="text-white font-semibold">Loading TeamForge AI</p>
        <p className="text-gray-500 text-sm mt-1">
          Preparing your workspace...
        </p>
      </div>
    </div>
  </div>
);

// Not Found Page
const NotFound = () => (
  <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
    <div className="text-center">
      <div className="text-8xl font-black gradient-text mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
      <p className="text-gray-400 mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

// App wrapper with HackBot
function AppContent() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/team-matching"
            element={
              <Suspense fallback={<PageLoader />}>
                <TeamMatching />
              </Suspense>
            }
          />
          <Route
            path="/github-analyzer"
            element={
              <Suspense fallback={<PageLoader />}>
                <GitHubAnalyzer />
              </Suspense>
            }
          />
          <Route
            path="/team-chemistry"
            element={
              <Suspense fallback={<PageLoader />}>
                <TeamChemistry />
              </Suspense>
            }
          />
          <Route
            path="/gap-analyzer"
            element={
              <Suspense fallback={<PageLoader />}>
                <GapAnalyzer />
              </Suspense>
            }
          />
          <Route
            path="/readiness"
            element={
              <Suspense fallback={<PageLoader />}>
                <ReadinessAnalyzer />
              </Suspense>
            }
          />
          <Route
            path="/upskilling"
            element={
              <Suspense fallback={<PageLoader />}>
                <Upskilling />
              </Suspense>
            }
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* HackBot - visible when authenticated */}
      {isAuthenticated && <HackBot />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#ffffff',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#ffffff' },
            duration: 3000,
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
            duration: 4000,
          },
        }}
      />
      <AppContent />
    </BrowserRouter>
  );
}