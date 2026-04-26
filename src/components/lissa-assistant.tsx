"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MessageSquare, X, Sparkles, Lightbulb } from "lucide-react";

const tips = [
  "1. Priorize alimentos in natura ou minimamente processados: Alimentos frescos mantêm melhor perfil nutricional e menor carga de aditivos químicos.",
  "2. Reduza o consumo de ultraprocessados: Produtos industrializados com muitos ingredientes (corantes, conservantes, aromatizantes) estão associados a maior risco de doenças crônicas.",
  "3. Varie o prato: Diversidade alimentar aumenta a ingestão de micronutrientes e compostos bioativos.",
  "4. Não foque só em calorias: Qualidade nutricional importa mais que apenas o valor energético.",
  "5. Higienize alimentos corretamente: Frutas, verduras e utensílios devem ser limpos para evitar contaminação microbiológica.",
  "6. Evite contaminação cruzada: Não use a mesma faca ou tábua para alimentos crus e prontos sem higienização.",
  "7. Armazene corretamente os alimentos: Temperatura inadequada favorece crescimento de microrganismos.",
  "8. Respeite o prazo de validade: Mesmo que o alimento pareça 'bom', pode estar contaminado.",
  "9. Inclua proteínas de qualidade: Carnes, ovos, leguminosas e laticínios são importantes para manutenção muscular.",
  "10. Consuma fibras diariamente: Presentes em frutas, verduras e grãos integrais — ajudam no funcionamento intestinal.",
  "11. Controle o consumo de açúcar: Excesso está ligado a obesidade e doenças metabólicas.",
  "12. Reduza o consumo de sal: Altas quantidades estão associadas à hipertensão.",
  "13. Mastigue bem os alimentos: A digestão começa na boca — isso impacta absorção de nutrientes.",
  "14. Beba água regularmente: Essencial para metabolismo e transporte de nutrientes.",
  "15. Observe reações do seu corpo: Desconfortos podem indicar intolerâncias ou alergias.",
  "16. Leia rótulos com atenção: Entender ingredientes ajuda a evitar riscos (ex: alergênicos).",
  "17. Evite dietas extremas: Restrições severas podem causar deficiências nutricionais.",
  "18. Prefira preparações caseiras: Você controla ingredientes e qualidade sanitária.",
  "19. Valorize alimentos locais: Fortalece economia e reduz impacto ambiental.",
  "20. Respeite sua cultura alimentar: Alimentação saudável não é padronizada — depende do contexto."
];

export function LISSAAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(true), 3000);
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 8000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-50 flex flex-col items-start gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-72 bg-background/95 backdrop-blur-md border border-primary/20 rounded-2xl shadow-2xl p-4 mb-2 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-green-500 to-primary" />
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 p-1 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm tracking-tight text-primary">Dicas do Lissa</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90 italic">
              "{tips[currentTip]}"
            </p>
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Orientação Virtual</span>
              <div className="flex gap-1">
                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-lg"
            >
              Olá! Tenho uma dica para você.
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(!isOpen);
            setShowNotification(false);
          }}
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
          
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
        </motion.button>
      </div>
    </div>
  );
}
