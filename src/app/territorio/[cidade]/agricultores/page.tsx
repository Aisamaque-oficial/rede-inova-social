"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCityBySlug, findNearestCities, City } from '@/lib/territory-data';
import { comercioService, ComercioProduto } from '@/lib/comercio-service';
import { ArrowLeft, ShoppingBag, MapPin, Phone, Info, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProdutoVitrine = ComercioProduto & { comercio_perfis: { nome: string; telefone: string } };

export default function AgricultoresPage() {
  const params = useParams();
  const citySlug = params.cidade as string;
  const city = getCityBySlug(citySlug);

  const [products, setProducts] = useState<ProdutoVitrine[]>([]);
  const [nearbyProducts, setNearbyProducts] = useState<{city: City, products: ProdutoVitrine[]}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!city) return;

    const loadData = async () => {
      setIsLoading(true);
      // Fetch direct city products
      const cityProducts = await comercioService.getProdutosPorCidade(citySlug);
      setProducts(cityProducts as ProdutoVitrine[]);

      // If empty, fetch nearby cities
      if (cityProducts.length === 0) {
        const nearestSlugs = findNearestCities(citySlug, 1);
        const nearby: {city: City, products: ProdutoVitrine[]}[] = [];
        
        for (const slug of nearestSlugs) {
          const adjCity = getCityBySlug(slug);
          if (adjCity) {
            const adjProducts = await comercioService.getProdutosPorCidade(slug);
            if (adjProducts.length > 0) {
              nearby.push({ city: adjCity, products: adjProducts as ProdutoVitrine[] });
            }
          }
        }
        setNearbyProducts(nearby);
      }
      setIsLoading(false);
    };

    loadData();
  }, [city, citySlug]);

  if (!city) return <div>Cidade não encontrada</div>;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const handleWhatsAppClick = async (product: ProdutoVitrine) => {
    const message = `Olá ${product.comercio_perfis.nome}! Vi seu produto "${product.nome}" na Vitrine da Rede Inova e tenho interesse.`;
    const encodedMessage = encodeURIComponent(message);
    const phone = product.comercio_perfis.telefone.replace(/\D/g, '');
    
    // Registrar métrica no Supabase (silencioso)
    if (product.id) {
       comercioService.registrarClique(product.id, product.produtor_id, product.cidade_slug).catch(console.error);
    }

    window.open(`https://wa.me/55${phone}?text=${encodedMessage}`, '_blank');
  };

  const ProductCard = ({ product, showCity = false }: { product: ProdutoVitrine, showCity?: boolean }) => (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col group">
      <div className="h-56 w-full bg-slate-50 relative overflow-hidden">
        {product.imagem_url ? (
          <img src={product.imagem_url} alt={product.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100/50">
            <ShoppingBag className="w-12 h-12 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sem Imagem</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-white/20">
            <span className="font-black text-emerald-600 text-lg">
                {formatPrice(product.preco)} <span className="text-[10px] text-slate-400">/{product.unidade}</span>
            </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-black text-xl text-slate-800 mb-2 leading-tight">{product.nome}</h3>
        <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-1 leading-relaxed">{product.descricao || "Sem descrição"}</p>
        
        <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
          <div className="flex items-center text-xs font-bold text-slate-600">
            <Store className="w-4 h-4 mr-2 text-slate-400" />
            {product.comercio_perfis.nome}
          </div>
          {showCity && (
            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-600">
                <MapPin className="w-3 h-3 mr-1" />
                {getCityBySlug(product.cidade_slug)?.name}
            </div>
          )}
        </div>

        <button 
          onClick={() => handleWhatsAppClick(product)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-xs"
        >
          <Phone className="w-4 h-4 mr-2" />
          Solicitar pelo WhatsApp
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="mb-10 flex justify-between items-center">
          <Link href={`/territorio/${city.slug}`} className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para {city.name}
          </Link>
          <Button asChild variant="outline" size="sm" className="rounded-full shadow-sm text-xs font-bold tracking-widest uppercase border-primary/20 text-primary hover:bg-primary/5">
            <Link href="/comercio-local/login">
                Sou Produtor
            </Link>
          </Button>
        </div>

        <div className="mb-16 max-w-4xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 mb-8 border border-emerald-100">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-800 mb-6 leading-[0.9]">
            Vitrine <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-primary">Solidária</span>
            <br/><span className="text-3xl text-slate-400">{city.name}</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
            Compre diretamente dos agricultores familiares locais. Você negocia via WhatsApp sem intermediários e fortalece a economia da região.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] p-16 border border-slate-100 shadow-xl text-center mb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
                <div className="relative z-10">
                    <Info className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-black uppercase tracking-tight text-slate-800 mb-4">Nenhum produto em {city.name}</h3>
                    <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                    Os agricultores locais ainda estão preparando suas vitrines. Se você é produtor, clique abaixo para cadastrar seus produtos.
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                        <Link href="/comercio-local/login">Cadastrar Produto</Link>
                    </Button>
                </div>
              </div>
            )}

            {/* Sugestões de Cidades Vizinhas */}
            {products.length === 0 && nearbyProducts.length > 0 && (
              <div className="mt-20">
                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-800 mb-10">
                  Explorar em cidades vizinhas
                </h2>
                
                <div className="space-y-16">
                  {nearbyProducts.map(nearby => (
                    <div key={nearby.city.id}>
                      <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center bg-emerald-50 w-fit px-4 py-2 rounded-xl border border-emerald-100">
                        <MapPin className="w-5 h-5 text-emerald-600 mr-2" />
                        <span className="text-emerald-900">{nearby.city.name}</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {nearby.products.map(p => <ProductCard key={p.id} product={p} showCity={true} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
