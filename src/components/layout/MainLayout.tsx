'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileDrawer } from './MobileDrawer';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Header */}
      <MobileHeader 
        onMenuOpen={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMenuOpen={mobileMenuOpen}
      />

      {/* Mobile Drawer */}
      <MobileDrawer 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <motion.div
        initial={false}
        animate={{ 
          marginLeft: isMobile ? 0 : (sidebarCollapsed ? 80 : 280)
        }}
        className="min-h-screen flex flex-col transition-all duration-300"
      >
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block">
          <Header />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-auto">
          {children}
        </main>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
