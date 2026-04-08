import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx';

const Home = lazy(() => import('./pages/Home.jsx').then((m) => ({ default: m.Home })));
const Explore = lazy(() => import('./pages/Explore.jsx').then((m) => ({ default: m.Explore })));
const DestinationDetail = lazy(() =>
  import('./pages/DestinationDetail.jsx').then((m) => ({ default: m.DestinationDetail }))
);
const Planner = lazy(() => import('./pages/Planner.jsx').then((m) => ({ default: m.Planner })));
const MapExplorer = lazy(() => import('./pages/MapExplorer.jsx').then((m) => ({ default: m.MapExplorer })));
const Hotels = lazy(() => import('./pages/Hotels.jsx').then((m) => ({ default: m.Hotels })));
const HotelDetail = lazy(() => import('./pages/HotelDetail.jsx').then((m) => ({ default: m.HotelDetail })));
const Food = lazy(() => import('./pages/Food.jsx').then((m) => ({ default: m.Food })));
const Blog = lazy(() => import('./pages/Blog.jsx').then((m) => ({ default: m.Blog })));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx').then((m) => ({ default: m.BlogPost })));
const BudgetTools = lazy(() => import('./pages/BudgetTools.jsx').then((m) => ({ default: m.BudgetTools })));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx').then((m) => ({ default: m.Dashboard })));
const Reviews = lazy(() => import('./pages/Reviews.jsx').then((m) => ({ default: m.Reviews })));
const Auth = lazy(() => import('./pages/Auth.jsx').then((m) => ({ default: m.Auth })));
const ShareTrip = lazy(() => import('./pages/ShareTrip.jsx').then((m) => ({ default: m.ShareTrip })));
const Contact = lazy(() => import('./pages/Contact.jsx').then((m) => ({ default: m.Contact })));

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="spinner" />
    </div>
  );
}

/**
 * Application routes and lazy-loaded pages.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/destination/:id" element={<DestinationDetail />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/map" element={<MapExplorer />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/food" element={<Food />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/tools/budget" element={<BudgetTools />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/share/trip/:token" element={<ShareTrip />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
