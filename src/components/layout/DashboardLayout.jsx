import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Menu } from 'lucide-react';

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-h-screen transition-all duration-300 ml-0 md:ml-64">

        <div className="p-6 lg:p-8">
          {/* mobile hamburger */}
          <button
            className="md:hidden mb-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          {children}
        </div>
      </main>
    </div>
  );
}
