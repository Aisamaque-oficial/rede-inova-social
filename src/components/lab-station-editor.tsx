"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit3, Save, X, AlertCircle, Eye, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface LabStation {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  active: boolean;
  materials?: string[];
}

interface LabStationEditorProps {
  stations: LabStation[];
  onStationUpdate: (stationId: string, updates: Partial<LabStation>) => Promise<void>;
  onStationAdd: (station: LabStation) => Promise<void>;
  onStationDelete: (stationId: string) => Promise<void>;
  canEdit: boolean;
}

export function LabStationEditor({
  stations,
  onStationUpdate,
  onStationAdd,
  onStationDelete,
  canEdit,
}: LabStationEditorProps) {
  const [editingStation, setEditingStation] = useState<LabStation | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ICON_OPTIONS = ["🍎", "📚", "🤟", "🌱", "🎮", "🔬", "🎨", "🎯"];
  const COLOR_OPTIONS = [
    { name: "Laranja", value: "bg-orange-500" },
    { name: "Azul", value: "bg-blue-500" },
    { name: "Roxo", value: "bg-purple-600" },
    { name: "Verde", value: "bg-green-600" },
    { name: "Indigo", value: "bg-indigo-600" },
    { name: "Rosa", value: "bg-pink-600" },
  ];

  const handleEditStart = (station: LabStation) => {
    setEditingStation(station);
    setError(null);
  };

  const handleNewStation = () => {
    setEditingStation({
      id: `station-${Date.now()}`,
      label: "",
      description: "",
      icon: "🔬",
      color: "bg-orange-500",
      active: true,
      materials: [],
    });
    setIsCreating(true);
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!editingStation?.label.trim()) {
      setError("O nome da estação não pode estar vazio.");
      return false;
    }
    if (!editingStation?.description.trim()) {
      setError("A descrição não pode estar vazia.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (isCreating) {
        await onStationAdd(editingStation!);
      } else if (editingStation) {
        await onStationUpdate(editingStation.id, editingStation);
      }
      setEditingStation(null);
      setIsCreating(false);
    } catch (err) {
      setError("Erro ao salvar a estação. Tente novamente.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (stationId: string) => {
    if (!confirm("Tem certeza que deseja deletar esta estação?")) return;

    try {
      await onStationDelete(stationId);
    } catch (err) {
      setError("Erro ao deletar estação.");
      console.error(err);
    }
  };

  if (!canEdit) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-700 font-medium">
              Você não tem permissão para editar as estações do Lab.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-primary tracking-tighter italic mb-2">
            Estações do Lab LISSA
          </h3>
          <p className="text-sm text-muted-foreground">
            {stations.length} estação{stations.length !== 1 ? "s" : ""} criada{stations.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={handleNewStation} className="rounded-full gap-2">
          <Plus className="h-4 w-4" />
          Nova Estação
        </Button>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editing Form */}
      {editingStation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-primary/30 rounded-xl p-6 bg-primary/5 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg">
              {isCreating ? "Nova Estação" : "Editar Estação"}
            </h4>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setEditingStation(null);
                setIsCreating(false);
                setError(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Icon & Color Selection */}
          <div className="grid grid-cols-2 gap-6">
            {/* Icon */}
            <div className="space-y-2">
              <Label className="font-bold">Ícone/Emoji</Label>
              <div className="grid grid-cols-4 gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setEditingStation({ ...editingStation, icon })}
                    className={`p-3 rounded-lg border-2 transition-all text-2xl ${
                      editingStation.icon === icon
                        ? "border-primary bg-primary/10"
                        : "border-slate-200 hover:border-primary/30"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label className="font-bold">Cor</Label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setEditingStation({ ...editingStation, color: color.value })}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-bold text-white ${
                      color.value
                    } ${
                      editingStation.color === color.value
                        ? "border-white ring-2 ring-slate-400"
                        : "border-slate-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Station Name */}
          <div className="space-y-2">
            <Label htmlFor="station-name" className="font-bold">
              Nome da Estação
            </Label>
            <Input
              id="station-name"
              value={editingStation.label}
              onChange={(e) => setEditingStation({ ...editingStation, label: e.target.value })}
              placeholder="Ex: Cozinha Nutricional"
              className="font-bold text-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="station-desc" className="font-bold">
              Descrição
            </Label>
            <Textarea
              id="station-desc"
              value={editingStation.description}
              onChange={(e) => setEditingStation({ ...editingStation, description: e.target.value })}
              placeholder="Descreva o propósito e conteúdo desta estação..."
              className="min-h-[80px]"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200">
            <div className="flex-1">
              <Label className="font-bold">Status da Estação</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Desativar para ocultar a estação temporariamente
              </p>
            </div>
            <Badge variant={editingStation.active ? "default" : "secondary"}>
              {editingStation.active ? "Ativa" : "Inativa"}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingStation({ ...editingStation, active: !editingStation.active })}
            >
              {editingStation.active ? "Desativar" : "Ativar"}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-primary/20">
            <Button
              variant="outline"
              onClick={() => {
                setEditingStation(null);
                setIsCreating(false);
              }}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar Estação"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((station) => (
          <motion.div
            key={station.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`relative overflow-hidden rounded-lg border-2 transition-all group ${
              station.active
                ? "border-slate-200 hover:border-primary/30 hover:shadow-lg"
                : "border-slate-100 opacity-60 bg-slate-50"
            }`}
          >
            {/* Background Color */}
            <div className={`absolute inset-0 ${station.color} opacity-5`} />

            <div className="relative p-6 space-y-4">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${station.color} text-white text-2xl`}>
                {station.icon}
              </div>

              {/* Info */}
              <div>
                <h4 className="font-black text-lg uppercase tracking-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                  {station.label}
                </h4>
                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                  {station.description}
                </p>
              </div>

              {/* Status Badge */}
              {!station.active && (
                <Badge variant="secondary" className="text-xs">
                  Inativa
                </Badge>
              )}

              {/* Actions */}
              <div className="flex gap-1 pt-2 border-t border-slate-200">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 h-8"
                  onClick={() => handleEditStart(station)}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(station.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {stations.length === 0 && !editingStation && (
        <div className="p-12 text-center bg-slate-50 rounded-lg border border-slate-200 border-dashed">
          <h4 className="text-lg font-bold text-slate-400 mb-2">Nenhuma estação criada</h4>
          <p className="text-sm text-slate-500 mb-4">
            Clique no botão acima para começar a criar estações para o Lab.
          </p>
        </div>
      )}
    </div>
  );
}
