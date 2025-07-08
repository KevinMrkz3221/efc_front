import React from 'react';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-light-gray overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
      <NotificationBell />
    </div>
  );
}
