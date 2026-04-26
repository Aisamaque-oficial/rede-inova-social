
'use client';
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { teamMembers } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Users } from "lucide-react";

export default function HomeTeamSection() {
    // Show coordinators
    const featuredMembers = teamMembers.filter(m => m.role.toLowerCase().includes('coordenador')).slice(0, 5);

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Nossa Equipe</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Conheça quem faz acontecer</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Pessoas apaixonadas e dedicadas a construir um futuro mais justo e sustentável.
                        </p>
                    </div>
                </div>

                <div className="flex justify-center py-12">
                    <div className="flex -space-x-4">
                        {featuredMembers.map((member) => {
                            const avatar = PlaceHolderImages.find(img => img.id === member.avatarId);
                            const initials = member.name.split(' ').map(n => n[0]).join('');
                            return (
                                <Avatar key={member.id} className="h-16 w-16 border-2 border-background">
                                    {avatar && <AvatarImage src={avatar.imageUrl} alt={member.name} />}
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-center">
                     <Button asChild size="lg">
                        <Link href="/equipe">
                            <Users className="mr-2 h-4 w-4" />
                            Ver todos os membros
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
