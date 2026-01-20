import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Receipt,
  FileText,
  Settings,
  LogOut,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Products', href: '/products' },
  { icon: Receipt, label: 'Billing', href: '/billing' },
  { icon: FileText, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 z-50',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
          <Leaf className="w-6 h-6 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="font-bold text-lg text-sidebar-foreground">AgroStock</h1>
            <p className="text-xs text-sidebar-foreground/60">Inventory System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'nav-link',
                isActive && 'active',
                collapsed && 'justify-center px-3'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="px-3 py-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
            collapsed && 'px-3'
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <Link to="/login">
          <Button
            variant="ghost"
            className={cn(
              'w-full text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10',
              collapsed ? 'px-3' : 'justify-start'
            )}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </Link>
      </div>
    </aside>
  );
}
