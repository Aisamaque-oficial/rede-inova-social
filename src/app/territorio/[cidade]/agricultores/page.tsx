"use client";

import React, { useState } from 'react';
import { Leaf, Search, MapPin, Star, Filter, MessageCircle, Coffee, Wheat, Carrot, Apple, Hexagon, Milk, Egg, Beef, Droplets, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AgricultoresPage({ params }: { params: { cidade: string } }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  
  // Format city name
  const cidadeFormatada = params.cidade
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // MOCK DATA PARA APRESENTAÇÃO DO SIMPECAL
  let produtorDestaque = null;

  if (params.cidade === 'caatiba') {
    produtorDestaque = {
      nome: "Produtores de Serra Pelada II",
      especialidade: "Cacau, Doces e Bebidas Artesanais",
      selos: ["Agricultura Familiar"]
    };
  }

  // All 10 categories requested by the user
  const categoriasMock = [
    {
      nome: "Grãos, cereais e leguminosas",
      icone: Wheat,
      produtos: []
    },
    {
      nome: "Raízes, tubérculos e derivados",
      icone: Leaf,
      produtos: []
    },
    {
      nome: "Hortaliças e verduras",
      icone: Carrot,
      produtos: []
    },
    {
      nome: "Frutas",
      icone: Apple,
      produtos: []
    },
    {
      nome: "Café, cacau e derivados",
      icone: Coffee,
      produtos: params.cidade === 'caatiba' ? [
        {
          id: 1,
          nome: "Chocolate Artesanal (70% Cacau)",
          descricao: "Produzido com amêndoas selecionadas da cabruca de Serra Pelada II.",
          preco: "R$ 15,00",
          unidade: "barra",
          produtor: "Associação Serra Pelada II",
          whatsapp: "5577991726710"
        }
      ] : []
    },
    {
      nome: "Mel e produtos das abelhas",
      icone: Hexagon,
      produtos: []
    },
    {
      nome: "Leite e derivados",
      icone: Milk,
      produtos: []
    },
    {
      nome: "Ovos e origem animal",
      icone: Egg,
      produtos: []
    },
    {
      nome: "Carnes e derivados",
      icone: Beef,
      produtos: []
    },
    {
      nome: "Polpas, sucos e bebidas",
      icone: Droplets,
      produtos: params.cidade === 'caatiba' ? [
        {
          id: 2,
          nome: "Licor de Jenipapo",
          descricao: "Receita tradicional com frutas nativas da região. Perfeito para festas.",
          preco: "R$ 25,50",
          unidade: "garrafa",
          produtor: "Associação Serra Pelada II",
          whatsapp: "5577991726710"
        }
      ] : []
    }
  ];

  const categoriasComFiltro = categoriasMock.map(cat => ({
    ...cat,
    produtos: cat.produtos.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.produtos.length > 0 || searchTerm === '');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Território (Professional Design) */}
      <div className="bg-slate-900 text-white pb-16 pt-10 px-6 lg:px-8 border-b-4 border-emerald-600">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-emerald-400 mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">{cidadeFormatada}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
            Vitrine do Território
          </h1>
          <p className="text-slate-300 max-w-2xl text-lg leading-relaxed font-light">
            Conecte-se diretamente com quem produz. Adquira produtos frescos, autênticos e impulsione o desenvolvimento sustentável da sua região.
          </p>

          {produtorDestaque && (
            <div className="mt-10 bg-slate-800 border border-slate-700 p-6 rounded-xl inline-block max-w-lg w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold tracking-wider uppercase text-[10px] text-amber-500">Destaque Local</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{produtorDestaque.nome}</h2>
              <p className="text-slate-400 text-sm">{produtorDestaque.especialidade}</p>
              <div className="flex gap-2 mt-4">
                {produtorDestaque.selos.map((selo: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold uppercase tracking-widest">
                    {selo}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-6 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar de Filtros (Professional) */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Busca & Filtros</h3>
                <Filter className="w-4 h-4 text-slate-400" />
              </div>
              
              <div className="relative mb-6">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Nome do produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 block pl-10 p-2.5 transition-colors"
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Instruções</h4>
                <div className="text-sm text-slate-600 leading-relaxed">
                  <p>Selecione uma categoria ao lado para explorar os produtos. Todos os contatos e negociações são realizados diretamente com o produtor via WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Principal */}
          <div className="flex-1">
            {!categoriaSelecionada ? (
              // MODO 1: MOSTRAR GRID DE CATEGORIAS (Professional Layout)
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Categorias Disponíveis</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoriasComFiltro.map((categoria, idx) => {
                    const totalProdutos = categoria.produtos.length;
                    const Icon = categoria.icone;
                    const temProduto = totalProdutos > 0;
                    
                    return (
                      <button 
                        key={idx}
                        onClick={() => setCategoriaSelecionada(categoria.nome)}
                        className={`bg-white p-5 rounded-xl border text-left flex flex-col justify-between transition-all group min-h-[140px]
                          ${temProduto 
                            ? 'border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 cursor-pointer' 
                            : 'border-slate-100 opacity-60 hover:opacity-100 cursor-pointer'}`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${temProduto ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <ChevronRight className={`w-4 h-4 ${temProduto ? 'text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity' : 'text-slate-300'}`} />
                        </div>
                        <div className="mt-4">
                          <h3 className="font-semibold text-slate-900 text-sm leading-tight">{categoria.nome}</h3>
                          <p className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${temProduto ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {totalProdutos} {totalProdutos === 1 ? 'Produto' : 'Produtos'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // MODO 2: MOSTRAR PRODUTOS DA CATEGORIA SELECIONADA (Professional Layout)
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" className="rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3" onClick={() => setCategoriaSelecionada(null)}>
                    &larr; Voltar
                  </Button>
                  <h2 className="text-xl font-bold text-slate-900 flex-1">{categoriaSelecionada}</h2>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {categoriasComFiltro
                    .find(c => c.nome === categoriaSelecionada)
                    ?.produtos.map((produto) => (
                      <div key={produto.id} className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden transition-all hover:shadow-md">
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                               <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                                 <span className="text-[10px] font-bold text-slate-500">{produto.produtor.charAt(0)}</span>
                               </div>
                               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{produto.produtor}</span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">{produto.nome}</h3>
                            <p className="text-sm text-slate-600 line-clamp-2">{produto.descricao}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                            <div>
                              <p className="text-xl font-bold text-slate-900">{produto.preco}</p>
                              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">/{produto.unidade}</p>
                            </div>
                            <Button 
                              className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm"
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
                    ))}
                    
                    {categoriasComFiltro.find(c => c.nome === categoriaSelecionada)?.produtos.length === 0 && (
                      <div className="col-span-full text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
                        <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-sm font-semibold text-slate-900">Nenhum produto listado</h3>
                        <p className="text-xs text-slate-500 mt-1">Os produtores ainda não adicionaram ofertas nesta categoria.</p>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
