import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/lib/territory-data';
import { ArrowLeft, Users, ShoppingBag, Map, Heart } from 'lucide-react';

interface CityPageProps {
  params: Promise<{ cidade: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const resolvedParams = await params;
  const citySlug = resolvedParams.cidade;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const hubs = [
    {
      title: "Agricultores Familiares",
      description: "Vitrine de produtos, alimentos e serviços locais.",
      icon: <ShoppingBag className="w-8 h-8" />,
      href: `/territorio/${city.slug}/agricultores`,
      color: "bg-emerald-50 text-emerald-600",
      borderColor: "hover:border-emerald-200"
    },
    {
      title: "Movimento Coletivo Afro",
      description: "Iniciativas, cultura e resistência.",
      icon: <Users className="w-8 h-8" />,
      href: `/territorio/${city.slug}/afro`,
      color: "bg-amber-50 text-amber-600",
      borderColor: "hover:border-amber-200"
    },
    {
      title: "Movimento de Mulheres",
      description: "Empoderamento, ações e rede de apoio.",
      icon: <Heart className="w-8 h-8" />,
      href: `/territorio/${city.slug}/mulheres`,
      color: "bg-rose-50 text-rose-600",
      borderColor: "hover:border-rose-200"
    },
    {
      title: "Nó Territorial",
      description: "O que o projeto está desenvolvendo aqui.",
      icon: <Map className="w-8 h-8" />,
      href: `/territorio/${city.slug}/no`,
      color: "bg-sky-50 text-sky-600",
      borderColor: "hover:border-sky-200"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link href="/territorio" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Mapa
          </Link>
        </div>

        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-display tracking-tight">
            {city.name}
          </h1>
          <p className="text-xl text-slate-600">
            Selecione uma das áreas de atuação para explorar em {city.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hubs.map((hub, idx) => (
            <Link 
              key={idx} 
              href={hub.href}
              className={`group flex items-start p-8 bg-white rounded-3xl shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl ${hub.borderColor}`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${hub.color} group-hover:scale-110 transition-transform`}>
                {hub.icon}
              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-slate-900">
                  {hub.title}
                </h3>
                <p className="text-slate-500">
                  {hub.description}
                </p>
                <div className="mt-4 font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "inherit" }}>
                  Acessar portal <span className="ml-2">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
