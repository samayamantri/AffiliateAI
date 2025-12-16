'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <MainLayout>
      {/* Full height minus header on mobile, full screen on desktop */}
      <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-7rem)] -mx-4 md:-mx-6 -mb-24 md:-mb-6 -mt-4 md:-mt-0">
        <ChatInterface />
      </div>
    </MainLayout>
  );
}
