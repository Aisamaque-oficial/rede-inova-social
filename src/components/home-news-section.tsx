
"use client";

import { news } from "@/lib/mock-data";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function HomeNewsSection() {
    // Sort news by id to get the most recent ones
    const sortedNews = [...news].sort((a, b) => Number(b.id.replace('n','')) - Number(a.id.replace('n','')));
    const featuredNews = sortedNews[0];
    const otherNews = sortedNews.slice(1, 5); // Get next 4 news for the side list

    const getNewsImage = (imagePlaceholderId: string | undefined) => {
        if (!imagePlaceholderId) return null;
        return PlaceHolderImages.find(img => img.id === imagePlaceholderId);
    }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Fique por Dentro</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Últimas notícias sobre o projeto</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Acompanhe as novidades e os principais acontecimentos do nosso projeto.
                </p>
              </div>
            </div>
            
            <div className="mx-auto grid max-w-7xl gap-8 py-12 lg:grid-cols-12">
                {/* Featured News */}
                {featuredNews && (
                    <div className="lg:col-span-7">
                        <Card className="h-full flex flex-col overflow-hidden">
                            {(() => {
                                const featuredImage = getNewsImage(featuredNews.imagePlaceholderId);
                                return (
                                    featuredImage && (
                                        <div className="aspect-video relative">
                                            <Image 
                                                src={featuredImage.imageUrl} 
                                                alt={featuredNews.title} 
                                                fill 
                                                className="object-cover"
                                                data-ai-hint={featuredImage.imageHint}
                                            />
                                        </div>
                                    )
                                );
                            })()}
                           
                            <div className="p-6 flex-1 flex flex-col">
                                <p className="text-sm font-semibold text-primary uppercase">{featuredNews.category}</p>
                                <CardTitle className="text-2xl lg:text-3xl mt-2 flex-1">
                                    <Link href="/noticias" className="hover:underline">
                                        {featuredNews.title}
                                    </Link>
                                </CardTitle>
                                <CardContent className="p-0 mt-4">
                                    <p className="text-base text-muted-foreground">{featuredNews.content}</p>
                                </CardContent>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Other News */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {otherNews.map((item) => {
                         const itemImage = getNewsImage(item.imagePlaceholderId);
                         return (
                            <Card key={item.id} className="flex items-center gap-4 p-4">
                                {itemImage && (
                                    <div className="w-24 h-24 sm:w-32 sm:h-24 relative flex-shrink-0">
                                        <Image
                                            src={itemImage.imageUrl}
                                            alt={item.title}
                                            fill
                                            className="rounded-md object-cover"
                                            data-ai-hint={itemImage.imageHint}
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-primary uppercase">{item.category}</p>
                                    <h3 className="text-sm sm:text-base font-bold leading-tight mt-1">
                                         <Link href="/noticias" className="hover:underline">
                                            {item.title}
                                        </Link>
                                    </h3>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <Button variant="outline" asChild>
                    <Link href="/noticias">
                        <Newspaper className="mr-2 h-4 w-4" />
                        Ver todas as notícias
                    </Link>
                </Button>
            </div>
        </div>
    </section>
  );
}
