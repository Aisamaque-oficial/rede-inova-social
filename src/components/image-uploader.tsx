"use client";

import React, { useRef, useState } from "react";
import { Upload, X, Crop, Check, Image as ImageIcon, ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  onClose?: () => void;
  canEditImages: boolean;
  defaultImage?: string;
  maxSize?: number; // em MB
  acceptedFormats?: string[];
  isLoading?: boolean;
  loadingText?: string;
  progress?: number;
}

export function ImageUploader({
  onImageSelect,
  onClose,
  canEditImages,
  defaultImage,
  maxSize = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp"],
  isLoading = false,
  loadingText = "Salvando...",
  progress = 0,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!canEditImages) {
    return (
      <div className="p-8 bg-slate-50 rounded-lg border border-slate-200 text-center">
        <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <p className="text-sm text-slate-500 font-medium">
          Você não tem permissão para fazer upload de imagens.
        </p>
      </div>
    );
  }

  const validateFile = (file: File): boolean => {
    // Validar tipo
    if (!acceptedFormats.includes(file.type)) {
      setError(`Formato inválido. Aceitos: ${acceptedFormats.join(", ")}`);
      return false;
    }

    // Validar tamanho
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      setError(`Arquivo muito grande. Máximo: ${maxSize}MB`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setIsEditing(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files?.length) {
      handleFileSelect(files[0]);
    }
  };

  const cropImage = () => {
    if (!preview || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob && selectedFile) {
          const croppedFile = new File([blob], selectedFile.name, {
            type: selectedFile.type,
          });
          onImageSelect(croppedFile, canvas.toDataURL());
          setIsEditing(false);
          setPreview(canvas.toDataURL());
        }
      }, selectedFile?.type);
    };
    img.src = preview;
  };

  const handleConfirm = () => {
    if (selectedFile && preview) {
      onImageSelect(selectedFile, preview);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <AnimatePresence>
        {preview && !isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative rounded-lg overflow-hidden bg-slate-100 border-2 border-primary/20"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-[300px] object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              {selectedFile && (
                <>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setIsEditing(true)}
                  >
                    <Crop className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-full"
                    onClick={() => {
                      setPreview(null);
                      setSelectedFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area */}
      {!preview && !isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5 scale-105"
              : "border-slate-300 bg-slate-50 hover:bg-slate-100"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(",")}
            onChange={handleInputChange}
            className="hidden"
          />

          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h4 className="font-bold text-slate-900 mb-2">Clique ou arraste uma imagem</h4>
          <p className="text-sm text-slate-500 mb-4">
            Formatos aceitos: JPG, PNG, WebP • Máximo: {maxSize}MB
          </p>
          <Button variant="outline" className="rounded-full">
            <ImageIcon className="w-4 h-4 mr-2" />
            Selecionar Imagem
          </Button>
        </motion.div>
      )}

      {/* Editing Mode */}
      {isEditing && preview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="relative rounded-lg overflow-hidden bg-slate-900 border-2 border-slate-800">
            <img
              src={preview}
              alt="Edit"
              style={{ transform: `scale(${zoom})` }}
              className="w-full h-auto max-h-[300px] object-cover transition-transform"
            />
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(Math.min(3, zoom + 0.1))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setPreview(null);
                setSelectedFile(null);
              }}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-2" />
              Usar Esta Imagem
            </Button>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium"
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* Hidden Canvas for Cropping */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Action Controls */}
      {preview && !isEditing && (
        <div className="flex flex-col gap-4">
          {isLoading && progress >= 0 && (
            <div className="space-y-2 px-1">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Progresso do Upload</span>
                <span className="text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5 bg-slate-100" />
            </div>
          )}
          
          <div className="flex gap-2">
            {onClose && (
              <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
                <X className="w-4 h-4 mr-2" />
                Fechar
              </Button>
            )}
            <Button 
              onClick={handleConfirm} 
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {progress > 0 ? `${loadingText} ${Math.round(progress)}%` : loadingText}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar Imagem
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
