"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Leaf, LogOut, Menu, X, LayoutDashboard, NotebookPen, Store, Package, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function ProdutorLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // MOCK USER for now
  const user = {
    nome: "João Produtor",
    propriedade: "Sítio Mel D'Ouro",
    cidade: "Itapetinga"
  };

  const navItems = [
    { name: 'Visão Geral', href: '/produtor/dashboard', icon: LayoutDashboard },
    { name: 'Caderno de Campo', href: '/produtor/caderno-campo', icon: NotebookPen },
    { name: 'Minhas Ofertas (Vitrine)', href: '/produtor/ofertas', icon: Store },
    { name: 'Pedidos Recebidos', href: '/produtor/pedidos', icon: Package },
    { name: 'Perfil da Propriedade', href: '/produtor/perfil', icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/comercio-local/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/produtor/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-sm uppercase tracking-widest text-slate-800">Meu Painel</h1>
              <p className="text-[10px] text-emerald-600 font-bold tracking-wider">PRODUTOR</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 pb-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Módulos</p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
              {user.nome.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{user.nome}</p>
              <p className="text-xs text-slate-500">{user.propriedade}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair do Sistema
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="font-black text-sm uppercase tracking-widest text-slate-800">Painel</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 bg-slate-50 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
