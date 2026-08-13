"use client";

import React from 'react';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProdutorDashboard() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-800">Resumo da Propriedade</h1>
        <p className="text-slate-500 font-medium mt-1">Bem-vindo ao seu painel integrado de produção e comércio local.</p>
      </div>

      {/* Alertas da Secretaria / ATER */}
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex gap-4">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-black text-amber-900 uppercase tracking-tight">Aviso Técnico (ATER)</h3>
          <p className="text-amber-700 text-sm font-medium mt-1">
            Notamos um aumento de relatos de Varroa em apiários próximos a Serra Pelada II. Recomendamos revisão dos quadros nas próximas 48h.
          </p>
          <Button variant="outline" size="sm" className="mt-3 bg-white text-amber-700 border-amber-200 hover:bg-amber-100 rounded-xl">
            Marcar Revisão no Caderno de Campo
          </Button>
        </div>
      </div>

      {/* Cards Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-start hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">Sua Produção</h2>
          <p className="text-slate-500 text-sm mb-6 flex-1">Você tem 2 unidades produtivas ativas e 150 litros de mel previstos para colheita.</p>
          <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20">
            <Link href="/produtor/caderno-campo">Acessar Caderno de Campo</Link>
          </Button>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-start hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">Suas Ofertas</h2>
          <p className="text-slate-500 text-sm mb-6 flex-1">Você tem 1 lote ativo na vitrine pública. 2 interessados entraram em contato via WhatsApp hoje.</p>
          <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
            <Link href="/produtor/ofertas">Gerenciar Vitrine</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
