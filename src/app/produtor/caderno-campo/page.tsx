"use client";

import React from 'react';
import { Plus, Sprout, Bug, CloudRain, NotebookPen, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CadernoCampoPage() {
  // MOCK DATA for pilot UI
  const unidadesProdutivas = [
    { id: 1, nome: "Agroindústria Familiar (Mata)", tipo: "Processamento", tamanho: "N/A", status: "Em Operação" },
    { id: 2, nome: "Pomar de Jenipapo", tipo: "Fruticultura", tamanho: "1 hectare", status: "Saudável" },
  ];

  const registrosProducao = [
    { id: 1, cultura: "Chocolate Artesanal (70% Cacau)", unidade: "Agroindústria Familiar", plantio: "Jul 2026", previsaoColheita: "Lote Semanal", estimativa: "200 barras", status: "em andamento" },
    { id: 2, cultura: "Licor de Jenipapo", unidade: "Pomar de Jenipapo", plantio: "Jan 2026", previsaoColheita: "Dez 2026", estimativa: "150 garrafas", status: "em andamento" },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-800">Caderno de Campo</h1>
          <p className="text-slate-500 font-medium mt-1">Gestão da produção, unidades e anotações fitossanitárias.</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Nova Unidade
          </Button>
          <Button variant="outline" className="rounded-xl text-emerald-600 border-emerald-200 hover:bg-emerald-50">
            <NotebookPen className="w-4 h-4 mr-2" />
            Registrar Manejo
          </Button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Em Andamento</p>
            <p className="text-2xl font-black text-slate-800">2 Culturas</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Clima (Itapetinga)</p>
            <p className="text-2xl font-black text-slate-800">Normal</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Alertas Fitossanitários</p>
            <p className="text-2xl font-black text-slate-800">01 Ativo</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Registros de Produção */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">O que você está produzindo</h2>
          
          <div className="space-y-4">
            {registrosProducao.map(reg => (
              <div key={reg.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-emerald-600">{reg.cultura}</h3>
                    <div className="flex items-center text-sm font-bold text-slate-500 mt-1">
                      <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                      {reg.unidade}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${reg.status === 'em andamento' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                    {reg.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl mt-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Início/Plantio</p>
                    <p className="text-sm font-black text-slate-700">{reg.plantio}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prev. Colheita</p>
                    <p className="text-sm font-black text-slate-700">{reg.previsaoColheita}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimativa</p>
                    <p className="text-sm font-black text-slate-700">{reg.estimativa}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                   <Button variant="outline" size="sm" className="rounded-xl text-xs flex-1">Registrar Perda</Button>
                   <Button size="sm" className="rounded-xl text-xs bg-emerald-500 hover:bg-emerald-600 text-white flex-1 shadow-sm">Transformar em Lote (Vitrine)</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Unidades Produtivas */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Unidades Produtivas</h2>
          
          <div className="space-y-4">
            {unidadesProdutivas.map(un => (
              <div key={un.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-800">{un.nome}</h4>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Tipo: <span className="font-bold text-slate-700">{un.tipo}</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Tamanho: <span className="font-bold text-slate-700">{un.tamanho}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
