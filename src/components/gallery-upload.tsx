"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, AlertCircle } from "lucide-react";
import { dataService } from "@/lib/data-service";
import { VisibilidadeConteudo, AreasAtuacao } from "@/lib/responsabilidades";

export default function GalleryUpload() {
  const [podeUploadInterno, setPodeUploadInterno] = useState(false);
  const [podeUploadExterno, setPodeUploadExterno] = useState(false);
  const [currentUserArea, setCurrentUserArea] = useState<AreasAtuacao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [visibilidade, setVisibilidade] = useState<VisibilidadeConteudo>(VisibilidadeConteudo.INTERNO);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [descricao, setDescricao] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const verificarPermissoes = async () => {
      setIsLoading(true);
      const userId = dataService.getCurrentUserId();
      
      if (userId) {
        const uploadInterno = dataService.podeUploadInterno(userId);
        const uploadExterno = dataService.podeUploadExterno(userId);
        
        setPodeUploadInterno(uploadInterno);
        setPodeUploadExterno(uploadExterno);

        // Obter área do usuário
        const resp = dataService.obterResponsabilidades(userId);
        if (resp && resp.areasPrincipais && resp.areasPrincipais.length > 0) {
          setCurrentUserArea(resp.areasPrincipais[0]);
        }
      }
      setIsLoading(false);
    };

    verificarPermissoes();
  }, []);

  const handleUpload = async () => {
    if (!arquivo) {
      alert("Selecione uma foto primeiro");
      return;
    }

    const userId = dataService.getCurrentUserId();
    if (!userId) {
      alert("Usuário não autenticado");
      return;
    }

    // Validar permissão de acordo com visibilidade selecionada
    if (visibilidade === VisibilidadeConteudo.PUBLICO && !podeUploadExterno) {
      alert("Você não tem permissão para fazer uploads públicos");
      return;
    }

    if (visibilidade === VisibilidadeConteudo.INTERNO && !podeUploadInterno) {
      alert("Você não tem permissão para fazer uploads internos");
      return;
    }

    setIsUploading(true);
    try {
      const nomeArquivo = `foto_${Date.now()}_${arquivo.name}`;
      
      // Registrar o upload no sistema de responsabilidades
      const resultado = await dataService.registrarUpload(
        nomeArquivo,
        visibilidade,
        currentUserArea || AreasAtuacao.COMUNICACAO, // Área padrão se não tiver
        "imagem"
      );

      if (resultado.sucesso) {
        alert("Foto enviada com sucesso!");
        setArquivo(null);
        setDescricao("");
        setVisibilidade(VisibilidadeConteudo.INTERNO);
        setOpen(false);
      } else {
        alert(`Erro ao enviar: ${resultado.mensagem}`);
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao enviar a foto");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <Button disabled><Upload className="mr-2 h-4 w-4" />Carregando...</Button>;
  }

  if (!podeUploadInterno && !podeUploadExterno) {
    return (
      <Button disabled variant="outline">
        <AlertCircle className="mr-2 h-4 w-4" />
        Sem permissão de upload
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Enviar Foto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar nova foto</DialogTitle>
          <DialogDescription>
            Compartilhe um momento do projeto com a equipe.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Foto</Label>
            <Input 
              id="picture" 
              type="file" 
              accept="image/*"
              onChange={(e) => setArquivo(e.target.files?.[0] || null)}
              disabled={isUploading}
            />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              placeholder="Descreva a foto..." 
              id="description"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="grid w-full gap-2">
            <Label>Visibilidade</Label>
            <div className="space-y-2">
              {podeUploadInterno && (
                <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibilidade"
                    value={VisibilidadeConteudo.INTERNO}
                    checked={visibilidade === VisibilidadeConteudo.INTERNO}
                    onChange={(e) => setVisibilidade(e.target.value as VisibilidadeConteudo)}
                    disabled={isUploading}
                  />
                  <div>
                    <div className="font-medium text-sm">🔒 Interno</div>
                    <div className="text-xs text-gray-500">Visível apenas para membros</div>
                  </div>
                </label>
              )}
              
              {podeUploadExterno && (
                <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibilidade"
                    value={VisibilidadeConteudo.PUBLICO}
                    checked={visibilidade === VisibilidadeConteudo.PUBLICO}
                    onChange={(e) => setVisibilidade(e.target.value as VisibilidadeConteudo)}
                    disabled={isUploading}
                  />
                  <div>
                    <div className="font-medium text-sm">🌐 Público</div>
                    <div className="text-xs text-gray-500">Visível para todos</div>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={isUploading || !arquivo}
          >
            {isUploading ? "Enviando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
