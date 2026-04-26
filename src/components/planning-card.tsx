"use client";

import React from "react";
import { Check, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { StrategicPlanMonth } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PlanningCardProps {
  month: StrategicPlanMonth;
  isEditable: boolean;
  onToggleTask: (monthId: string, taskId: string) => void;
}

export function PlanningCard({ month, isEditable, onToggleTask }: PlanningCardProps) {
  const completedCount = month.tasks.filter(t => t.completed).length;
  const totalCount = month.tasks.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const isFinished = progress === 100;

  return (
    <Card className={cn(
      "w-[340px] shrink-0 h-fit rounded-[2.5rem] border-none shadow-2xl transition-all duration-500 hover:scale-[1.02]",
      isFinished ? "bg-emerald-50 ring-2 ring-emerald-200" : "bg-white ring-1 ring-slate-100"
    )}>
      <CardHeader className="p-8 pb-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className={cn(
               "text-[10px] font-black uppercase tracking-[0.2em] italic flex items-center gap-2",
               isFinished ? "text-emerald-600" : "text-primary"
            )}>
              {!isEditable && <Lock size={12} />}
              {isEditable ? "Edição Ativa" : "Modo Visualização"}
            </span>
            {isFinished && (
               <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-3">
                  Concluído
               </Badge>
            )}
          </div>
          <CardTitle className="text-xl font-headline uppercase italic tracking-tighter leading-tight text-slate-800">
            {month.monthName}
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between items-end">
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{completedCount} de {totalCount} metas</span>
               <span className="text-[10px] font-black text-slate-800 italic">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 rounded-full bg-slate-100" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        <div className="space-y-4">
          {month.tasks.map((task) => (
            <div 
              key={task.id} 
              className={cn(
                "flex items-start gap-4 p-4 rounded-2xl transition-all border border-transparent",
                task.completed ? "bg-slate-50/50 opacity-60" : "bg-white hover:border-slate-100 group",
                !isEditable && "cursor-not-allowed"
              )}
            >
              <div className="pt-0.5">
                 <Checkbox 
                    id={task.id} 
                    checked={task.completed} 
                    disabled={!isEditable}
                    onCheckedChange={() => isEditable && onToggleTask(month.id, task.id)}
                    className="h-5 w-5 rounded-lg border-2 border-slate-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                 />
              </div>
              <label 
                htmlFor={task.id}
                className={cn(
                  "text-[11px] font-medium leading-relaxed tracking-tight transition-all",
                  task.completed ? "text-slate-400 line-through italic" : "text-slate-700",
                  isEditable ? "cursor-pointer group-hover:text-primary" : "cursor-default"
                )}
              >
                {task.label}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
