import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import GalleryUpload from "@/components/gallery-upload";

export default function GalleryPage() {
    const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery'));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Galeria de Fotos</h1>
            <p className="text-muted-foreground">
            Momentos e memórias do nosso projeto.
            </p>
        </div>
        <GalleryUpload />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((image) => (
          <Card key={image.id} className="overflow-hidden group">
            <CardContent className="p-0">
                <div className="overflow-hidden">
                    <Image
                        src={image.imageUrl}
                        alt={image.description}
                        width={600}
                        height={400}
                        data-ai-hint={image.imageHint}
                        className="object-cover w-full h-auto aspect-[3/2] transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div className="p-4">
                    <p className="text-sm text-muted-foreground">{image.description}</p>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
