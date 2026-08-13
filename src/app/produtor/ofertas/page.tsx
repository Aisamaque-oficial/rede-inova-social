"use client";

import React from 'react';
import { Plus, Store, Tag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfertasPage() {
  // MOCK DATA
  const lotes = [
    { id: 1, produto: "Mel de Uruçu (Pote de Vidro)", categoria: "Mel e derivados", quantidade: "50 potes", preco: 45.00, unidadeVenda: "pote 500g", status: "ativo" },
    { id: 2, produto: "Mandioca Branca Descascada", categoria: "Raízes e Tubérculos", quantidade: "0 kg", preco: 4.50, unidadeVenda: "kg", status: "esgotado" },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-800">Minha Vitrine</h1>
          <p className="text-slate-500 font-medium mt-1">Gerencie os lotes que estão visíveis para os compradores.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Novo Lote de Venda
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 text-blue-700">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm font-medium">
          <strong>Atenção:</strong> Lembre-se que você só deve disponibilizar na vitrine aquilo que você tem em estoque ou pronto para entrega imediata.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lotes.map(lote => (
          <div key={lote.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 leading-tight">{lote.produto}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lote.categoria}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Disponível</p>
                <p className={`text-lg font-black ${lote.status === 'esgotado' ? 'text-red-500' : 'text-slate-700'}`}>
                  {lote.quantidade}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preço</p>
                <p className="text-xl font-black text-emerald-600">
                  R$ {lote.preco.toFixed(2).replace('.', ',')} <span className="text-xs text-slate-400 font-bold">/{lote.unidadeVenda}</span>
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                lote.status === 'ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {lote.status}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl text-xs h-8">Editar Preço</Button>
                <Button variant="outline" size="sm" className="rounded-xl text-xs h-8">Pausar Oferta</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
