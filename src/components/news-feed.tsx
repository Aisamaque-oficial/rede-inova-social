"use client";

import { useState, useEffect } from "react";
import { news as mockNews, News } from "@/lib/mock-data";
import { dataService } from "@/lib/data-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Newspaper, Loader2 } from "lucide-react";

export default function NewsFeed() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = dataService.subscribeToNews((data) => {
      setNewsList(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const activeNews = dataService.filterActiveNews(newsList);

  const sortedNews = [...activeNews].sort((a, b) => {
      // Prioritize publication date
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
  });
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <Newspaper className="h-6 w-6 text-primary" />
            <CardTitle>Feed de Notícias</CardTitle>
        </div>
        <CardDescription>As últimas novidades do projeto.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        ) : (
            <div className="space-y-6">
            {sortedNews.map((item) => (
                <div key={item.id} className="relative pl-6 before:absolute before:left-0 before:top-1 before:h-[calc(100%-0.25rem)] before:w-0.5 before:bg-accent before:rounded">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
                        {item.category}
                    </span>
                    <p className="text-xs text-muted-foreground">por {item.author}</p>
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-foreground/80 mt-1">{item.content}</p>
                </div>
            ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
