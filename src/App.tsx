import React, { useState, useEffect } from 'react';
import { SiteSettings, HomepageContent } from './types/database';
import { getSettings, getHomepageContent, getAdminSession, logoutAdmin, AdminUser } from './lib/db';
import { ToastProvider, useToast } from './components/common/Toast';

// Layout
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { CollectionsPage } from './pages/public/CollectionsPage';
import { CollectionDetailPage } from './pages/public/CollectionDetailPage';
import { DesignsPage } from './pages/public/DesignsPage';
import { DesignDetailPage } from './pages/public/DesignDetailPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { ContactPage } from './pages/public/ContactPage';
import { BookAppointmentPage } from './pages/public/BookAppointmentPage';
import { CustomOrderPage } from './pages/public/CustomOrderPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { TermsPage } from './pages/public/TermsPage';
import { ThankYouPage } from './pages/public/ThankYouPage';

// Admin System
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminHomepageContentPage } from './pages/admin/AdminHomepageContentPage';
import { AdminAboutContentPage } from './pages/admin/AdminAboutContentPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminCollectionsPage } from './pages/admin/AdminCollectionsPage';
import { AdminDesignsPage } from './pages/admin/AdminDesignsPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';

import { CoutureProvider } from './context/CoutureContext';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { LookbookDrawer } from './components/common/LookbookDrawer';
import { MeasurementGuideModal } from './components/common/MeasurementGuideModal';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname || '/' : '/';
  });

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [homepage, setHomepage] = useState<HomepageContent | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminSection, setAdminSection] = useState<string>('dashboard');
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Sync browser URL history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Load initial settings and check active admin session
  useEffect(() => {
    async function init() {
      try {
        const [s, h, user] = await Promise.all([
          getSettings(),
          getHomepageContent(),
          getAdminSession(),
        ]);
        setSettings(s);
        setHomepage(h);
        setAdminUser(user);

        // Update document title dynamically
        if (s?.meta_title) {
          document.title = s.meta_title;
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setAuthChecking(false);
      }
    }
    init();
  }, []);

  // Update dynamic SEO title and favicon when settings change
  useEffect(() => {
    if (settings) {
      if (settings.meta_title) {
        document.title = settings.meta_title;
      }
      if (settings.favicon_url) {
        const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (favicon) favicon.href = settings.favicon_url;
      }
    }
  }, [settings]);

  // Handle Logout
  const handleLogout = async () => {
    await logoutAdmin();
    setAdminUser(null);
    navigate('/admin');
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  // Handle Admin Routing
  if (isAdminRoute) {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-[#141210] flex items-center justify-center text-stone-400 text-xs">
          Verifying security session...
        </div>
      );
    }

    // If not authenticated, always display Admin Login Page
    if (!adminUser) {
      return (
        <AdminLoginPage
          onLoginSuccess={(user) => {
            setAdminUser(user);
            navigate('/admin/dashboard');
          }}
          onBackToSite={() => navigate('/')}
        />
      );
    }

    // Determine current admin subsection from path or state
    let activeSec = adminSection;
    if (currentPath === '/admin' || currentPath === '/admin/dashboard') activeSec = 'dashboard';
    else if (currentPath === '/admin/homepage') activeSec = 'homepage';
    else if (currentPath === '/admin/about') activeSec = 'about';
    else if (currentPath === '/admin/services') activeSec = 'services';
    else if (currentPath === '/admin/collections') activeSec = 'collections';
    else if (currentPath === '/admin/designs') activeSec = 'designs';
    else if (currentPath === '/admin/gallery') activeSec = 'gallery';
    else if (currentPath === '/admin/appointments') activeSec = 'appointments';
    else if (currentPath === '/admin/orders') activeSec = 'orders';
    else if (currentPath === '/admin/messages') activeSec = 'messages';
    else if (currentPath === '/admin/media') activeSec = 'media';
    else if (currentPath === '/admin/settings') activeSec = 'settings';
    else if (currentPath === '/admin/profile') activeSec = 'profile';

    const handleAdminNavigateSection = (sec: string) => {
      setAdminSection(sec);
      navigate(`/admin/${sec}`);
    };

    return (
      <AdminLayout
        currentAdmin={adminUser}
        currentSection={activeSec}
        onNavigateSection={handleAdminNavigateSection}
        onLogout={handleLogout}
      >
        {activeSec === 'dashboard' && (
          <AdminDashboardPage onNavigateSection={handleAdminNavigateSection} />
        )}
        {activeSec === 'homepage' && <AdminHomepageContentPage />}
        {activeSec === 'about' && <AdminAboutContentPage />}
        {activeSec === 'services' && <AdminServicesPage />}
        {activeSec === 'collections' && <AdminCollectionsPage />}
        {activeSec === 'designs' && <AdminDesignsPage />}
        {activeSec === 'gallery' && <AdminGalleryPage />}
        {activeSec === 'appointments' && <AdminAppointmentsPage />}
        {activeSec === 'orders' && <AdminOrdersPage />}
        {activeSec === 'messages' && <AdminMessagesPage />}
        {activeSec === 'media' && <AdminMediaPage />}
        {activeSec === 'settings' && <AdminSettingsPage />}
        {activeSec === 'profile' && (
          <AdminProfilePage currentAdmin={adminUser} onLogout={handleLogout} />
        )}
      </AdminLayout>
    );
  }

  // Fallback while initial settings load
  if (!settings || !homepage) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-stone-500 font-serif text-lg">
        Loading Kaur Couture Atelier...
      </div>
    );
  }

  // Public Routes Resolver
  const renderPublicPage = () => {
    if (currentPath === '/') {
      return <HomePage settings={settings} homepage={homepage} onNavigate={navigate} />;
    }
    if (currentPath === '/about') {
      return <AboutPage settings={settings} onNavigate={navigate} />;
    }
    if (currentPath === '/collections') {
      return <CollectionsPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/collections/')) {
      const slug = currentPath.replace('/collections/', '').split('/')[0];
      return <CollectionDetailPage slug={slug} settings={settings} onNavigate={navigate} />;
    }
    if (currentPath === '/designs') {
      return <DesignsPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/designs/')) {
      const slug = currentPath.replace('/designs/', '').split('/')[0];
      return <DesignDetailPage slug={slug} settings={settings} onNavigate={navigate} />;
    }
    if (currentPath === '/services') {
      return <ServicesPage onNavigate={navigate} />;
    }
    if (currentPath === '/gallery') {
      return <GalleryPage onNavigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage settings={settings} onNavigate={navigate} />;
    }
    if (currentPath === '/book-appointment') {
      return <BookAppointmentPage settings={settings} onNavigate={navigate} />;
    }
    if (currentPath === '/custom-order') {
      return <CustomOrderPage settings={settings} onNavigate={navigate} />;
    }
    if (currentPath === '/privacy-policy') {
      return <PrivacyPolicyPage settings={settings} onNavigate={navigate} />;
    }
    if (currentPath === '/terms') {
      return <TermsPage settings={settings} onNavigate={navigate} />;
    }
    if (currentPath === '/thank-you') {
      return <ThankYouPage settings={settings} onNavigate={navigate} />;
    }

    // 404 fallback
    return (
      <div className="py-32 text-center max-w-md mx-auto space-y-4 px-4">
        <h2 className="font-serif text-4xl text-[#58111A]">Page Not Found</h2>
        <p className="text-xs text-stone-500">
          The requested page does not exist or may have moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded"
        >
          Return to Boutique Home
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1917]">
      {/* Public Header */}
      <Header settings={settings} currentPath={currentPath} onNavigate={navigate} />

      {/* Main Public Content */}
      <main className="flex-1">{renderPublicPage()}</main>

      {/* Public Footer */}
      <Footer settings={settings} onNavigate={navigate} />

      {/* Slide-out Lookbook Drawer */}
      <LookbookDrawer settings={settings} onNavigate={navigate} />

      {/* Global Bespoke Measurement Guide Modal */}
      <MeasurementGuideModal />

      {/* Floating WhatsApp Button to chat with ANMOL KAUR */}
      {settings && <FloatingWhatsAppButton settings={settings} />}

      {/* Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CoutureProvider>
        <AppContent />
      </CoutureProvider>
    </ToastProvider>
  );
}
