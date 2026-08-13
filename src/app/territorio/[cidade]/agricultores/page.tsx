"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Leaf, Search, MapPin, Star, Filter, MessageCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AgricultoresPage({ params }: { params: { cidade: string } }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Format city name
  const cidadeFormatada = params.cidade
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // MOCK DATA PARA APRESENTAÇÃO DO SIMPECAL
  let produtorDestaque = null;
  let categoriasMock = [];

  if (params.cidade === 'caatiba') {
    produtorDestaque = {
      nome: "Produtores de Serra Pelada II",
      especialidade: "Cacau, Doces e Bebidas Artesanais",
      selos: ["Agricultura Familiar"]
    };

    categoriasMock = [
      {
        nome: "Café, cacau e derivados",
        produtos: [
          {
            id: 1,
            nome: "Chocolate Artesanal (70% Cacau)",
            descricao: "Produzido com amêndoas selecionadas da cabruca de Serra Pelada II.",
            preco: "R$ 15,00",
            unidade: "barra",
            imagem: "🍫",
            produtor: "Associação Serra Pelada II",
            whatsapp: "5577991726710"
          }
        ]
      },
      {
        nome: "Polpas, sucos e bebidas",
        produtos: [
          {
            id: 2,
            nome: "Licor de Jenipapo",
            descricao: "Receita tradicional com frutas nativas da região.",
            preco: "R$ 25,50",
            unidade: "garrafa",
            imagem: "🍾",
            produtor: "Associação Serra Pelada II",
            whatsapp: "5577991726710"
          }
        ]
      }
    ];
  } else {
    // Other cities generic fallback
    categoriasMock = [
      {
        nome: "Hortaliças e verduras",
        produtos: [
          {
            id: 3,
            nome: "Alface Crespa Orgânica",
            descricao: "Cultivada sem agrotóxicos na beira do rio.",
            preco: "R$ 3,50",
            unidade: "pé",
            imagem: "🥬",
            produtor: "Sítio Esperança",
            whatsapp: "5577991726710"
          }
        ]
      }
    ];
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Território */}
      <div className="bg-emerald-900 text-white pb-12 pt-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-emerald-400 mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-bold tracking-widest uppercase">{cidadeFormatada}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
            Vitrine
          </h1>
          <p className="text-emerald-100/80 max-w-2xl text-lg leading-relaxed">
            Conecte-se diretamente com quem produz. Compre alimentos frescos e artesanais e fortaleça a economia do seu município.
          </p>

          {produtorDestaque && (
            <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-[2rem] inline-block">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-bold tracking-widest uppercase text-sm text-amber-400">Destaque da Região</span>
              </div>
              <h2 className="text-2xl font-black">{produtorDestaque.nome}</h2>
              <p className="text-emerald-200 mt-1">{produtorDestaque.especialidade}</p>
              <div className="flex gap-2 mt-4">
                {produtorDestaque.selos.map((selo: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest">
                    {selo}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar de Filtros */}
          <div className="w-full md:w-72 space-y-4">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-slate-800 tracking-tight text-lg">Buscar</h3>
                <Filter className="w-5 h-5 text-emerald-500" />
              </div>
              
              <div className="relative mb-6">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="O que você procura?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block pl-10 p-2.5"
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Como funciona?</h4>
                <div className="flex gap-3 text-sm text-slate-600 bg-emerald-50 p-4 rounded-2xl">
                  <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p>A Vitrine conecta você direto ao produtor. Clique em "Solicitar" para combinar a entrega via WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Produtos Categorizados */}
          <div className="flex-1 space-y-12">
            {categoriasMock.map((categoria, catIdx) => {
              const produtosFiltrados = categoria.produtos.filter(p => 
                p.nome.toLowerCase().includes(searchTerm.toLowerCase())
              );
              
              if (produtosFiltrados.length === 0) return null;

              return (
                <div key={catIdx}>
                  <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                    {categoria.nome}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {produtosFiltrados.map((produto) => (
                      <div key={produto.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col group overflow-hidden">
                        <div className="h-32 bg-emerald-50/50 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                          {produto.imagem}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-black text-slate-800 leading-tight text-lg">{produto.nome}</h3>
                          </div>
                          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{produto.descricao}</p>
                          
                          <div className="mt-auto">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                {produto.produtor.charAt(0)}
                              </div>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest line-clamp-1">{produto.produtor}</span>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                              <div>
                                <p className="text-2xl font-black text-emerald-600">{produto.preco}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/{produto.unidade}</p>
                              </div>
                              <Button 
                                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20"
                                onClick={() => {
                                  const msg = encodeURIComponent(`Olá! Vi o produto ${produto.nome} na Vitrine de ${cidadeFormatada} e gostaria de fazer um pedido.`);
                                  window.open(`https://wa.me/${produto.whatsapp}?text=${msg}`, '_blank');
                                }}
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Solicitar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {categoriasMock.every(cat => cat.produtos.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase())).length === 0) && (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 border-dashed">
                <Leaf className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-black text-slate-800 mb-1">Nenhum produto encontrado</h3>
                <p className="text-slate-500">Tente buscar com outros termos.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
