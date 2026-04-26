
'use client';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { authoralMaterials } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function HomeMaterialsSection() {
    const featuredMaterials = authoralMaterials.slice(0, 2);
    
    const getMaterialImage = (imagePlaceholderId: string | undefined) => {
        if (!imagePlaceholderId) return null;
        return PlaceHolderImages.find((img) => img.id === imagePlaceholderId);
    };

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                      Nossas Produções
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                      Materiais Autorais
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Explore e baixe os guias, cartilhas e e-books produzidos pelo
                      projeto. Todo material conta com versão acessível em Libras.
                    </p>
                  </div>
                </div>

                <div className="mx-auto grid max-w-5xl gap-8 py-12 sm:grid-cols-1 md:grid-cols-2">
                  {featuredMaterials.map((material) => {
                    const itemImage = getMaterialImage(material.imagePlaceholderId);
                    return (
                      <Card
                        key={material.id}
                        className="flex flex-col overflow-hidden"
                      >
                        {itemImage && (
                          <div className="aspect-video relative">
                            <Image
                              src={itemImage.imageUrl}
                              alt={material.title}
                              fill
                              className="object-cover"
                              data-ai-hint={itemImage.imageHint}
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-lg">{material.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {material.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="flex justify-center mt-8">
                     <Button asChild size="lg">
                        <Link href="/materiais">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Ver todos os materiais
                        </Link>
                    </Button>
                </div>

            </div>
        </section>
    );
}
