"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trophy, ArrowRight, Brain, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { dataService } from "@/lib/data-service";
import { supabase } from "@/lib/supabase";

interface QuizContainerProps {
  trackId: string;
  questions: any[];
  onComplete: () => void;
}

export function QuizContainer({ trackId, questions, onComplete }: QuizContainerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentStep];

  const handleNext = async () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
      await saveProgress(newAnswers);
    }
  };

  const saveProgress = async (finalAnswers: number[]) => {
    setIsSubmitting(true);
    const user = dataService.getCurrentUser();
    if (!user) return;

    const score = finalAnswers.reduce((acc, ans, idx) => {
      return acc + (ans === questions[idx].correct ? 1 : 0);
    }, 0);

    try {
      await supabase.from('user_learning_progress').insert({
        user_id: user.id,
        content_id: trackId,
        content_type: 'track',
        score: score,
        completed: true
      });
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFinished) {
    const score = answers.reduce((acc, ans, idx) => acc + (ans === questions[idx].correct ? 1 : 0), 0);
    const percent = (score / questions.length) * 100;

    return (
      <div className="text-center py-12 space-y-10">
        <div className="relative inline-block">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-6xl mx-auto"
          >
            <Trophy className="h-16 w-16 text-primary" />
          </motion.div>
          <motion.div 
             animate={{ scale: [1, 1.2, 1] }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-yellow-400 text-white flex items-center justify-center font-black"
          >
            {score}/{questions.length}
          </motion.div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Trilha Concluída!</h2>
          <p className="text-lg text-slate-500 font-medium italic">
            {percent >= 70 
              ? "Excelente desempenho! Você dominou os conceitos desta trilha." 
              : "Bom esforço! Continue praticando para aprimorar seu vocabulário."}
          </p>
        </div>

        <button
          onClick={onComplete}
          className="bg-[#1a2332] text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all"
        >
          Concluir e Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* Progresso */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Questão {currentStep + 1} de {questions.length}
        </span>
      </div>

      {/* Pergunta */}
      <div className="space-y-8">
        <div className="flex items-start gap-6">
          <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <Brain className="h-7 w-7" />
          </div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tighter leading-tight">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="grid gap-4">
          {currentQuestion.options.map((option: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              className={cn(
                "w-full text-left p-6 rounded-3xl border-2 transition-all group flex items-center justify-between",
                selectedOption === idx 
                  ? "bg-primary/5 border-primary shadow-xl" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm",
                  selectedOption === idx ? "bg-primary text-white" : "bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className={cn("text-lg font-bold", selectedOption === idx ? "text-primary" : "text-slate-600")}>
                  {option}
                </span>
              </div>
              {selectedOption === idx && <Check className="h-6 w-6 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={selectedOption === null}
        className={cn(
          "w-full py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-4",
          selectedOption !== null 
            ? "bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-[1.02]" 
            : "bg-slate-100 text-slate-300 cursor-not-allowed"
        )}
      >
        {currentStep === questions.length - 1 ? "Finalizar Quiz" : "Próxima Questão"}
        <ArrowRight className="h-5 w-5" />
      </button>

      <div className="flex items-center justify-center gap-3 text-slate-300">
        <AlertCircle className="h-4 w-4" />
        <span className="text-[9px] font-black uppercase tracking-widest">Suas respostas serão registradas no banco de dados.</span>
      </div>
    </div>
  );
}
