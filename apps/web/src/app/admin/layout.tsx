'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleGuard } from '@/components/role-guard';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/courses', label: 'Courses', icon: '📚' },
  { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { href: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { href: '/admin/support', label: 'Support Tickets', icon: '🎫' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="flex min-h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-slate-200 bg-slate-900 text-white">
          <div className="px-5 py-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Admin Panel
            </h2>
          </div>
          <nav className="space-y-1 px-3 pb-6">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-slate-50">{children}</main>
      </div>
    </RoleGuard>
  );
}
