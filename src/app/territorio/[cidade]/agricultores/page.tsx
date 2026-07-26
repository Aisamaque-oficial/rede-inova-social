"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCityBySlug, findNearestCities, City } from '@/lib/territory-data';
import { productsService, Product } from '@/lib/products-service';
import { ArrowLeft, ShoppingBag, MapPin, Phone, Info } from 'lucide-react';

export default function AgricultoresPage() {
  const params = useParams();
  const citySlug = params.cidade as string;
  const city = getCityBySlug(citySlug);

  const [products, setProducts] = useState<Product[]>([]);
  const [nearbyProducts, setNearbyProducts] = useState<{city: City, products: Product[]}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!city) return;

    const loadData = async () => {
      setIsLoading(true);
      // Fetch direct city products
      const cityProducts = await productsService.getProductsByCity(citySlug);
      setProducts(cityProducts);

      // If empty, fetch nearby cities
      if (cityProducts.length === 0) {
        const nearestSlugs = findNearestCities(citySlug, 1);
        const nearby: {city: City, products: Product[]}[] = [];
        
        for (const slug of nearestSlugs) {
          const adjCity = getCityBySlug(slug);
          if (adjCity) {
            const adjProducts = await productsService.getProductsByCity(slug);
            if (adjProducts.length > 0) {
              nearby.push({ city: adjCity, products: adjProducts });
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

  const handleWhatsAppClick = (product: Product) => {
    const message = `Olá ${product.farmerName}! Vi seu produto "${product.name}" na Vitrine da Rede Inova e tenho interesse.`;
    const encodedMessage = encodeURIComponent(message);
    // Remove non-numeric chars from phone
    const phone = product.farmerPhone.replace(/\D/g, '');
    window.open(`https://wa.me/55${phone}?text=${encodedMessage}`, '_blank');
  };

  const ProductCard = ({ product, showCity = false }: { product: Product, showCity?: boolean }) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="h-48 w-full bg-slate-100 relative">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-900">{product.name}</h3>
          <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-sm">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">{product.description}</p>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-xs text-slate-500">
            <MapPin className="w-3 h-3 mr-1" />
            Produtor: {product.farmerName} {showCity && `(em ${getCityBySlug(product.citySlug)?.name})`}
          </div>
        </div>

        <button 
          onClick={() => handleWhatsAppClick(product)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors"
        >
          <Phone className="w-4 h-4 mr-2" />
          Comprar via WhatsApp
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link href={`/territorio/${city.slug}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para {city.name}
          </Link>
        </div>

        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 font-display">
            Vitrine Solidária - {city.name}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Compre diretamente dos agricultores familiares e pequenos produtores locais. Fortaleça a economia do território!
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center mb-12">
                <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Ainda não temos produtos cadastrados em {city.name}</h3>
                <p className="text-slate-500 mb-6">
                  Os agricultores locais ainda estão preparando suas vitrines virtuais.
                </p>
              </div>
            )}

            {/* Sugestões de Cidades Vizinhas */}
            {products.length === 0 && nearbyProducts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Que tal conferir o que tem pertinho de {city.name}?
                </h2>
                
                <div className="space-y-12">
                  {nearbyProducts.map(nearby => (
                    <div key={nearby.city.id}>
                      <h3 className="text-xl font-medium text-slate-800 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 text-emerald-500 mr-2" />
                        Em {nearby.city.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
