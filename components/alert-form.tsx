"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Gauge,
  Loader2,
  Send,
  User,
} from "lucide-react";
import { useState } from "react";

type IncidentType = "urgence" | "information" | "alerte" | "autre";
type Priority = "faible" | "moyen" | "critique";

interface FormData {
  nom: string;
  prenom: string;
  incidentType: IncidentType | "";
  description: string;
  priority: Priority | "";
}

const steps = [
  { id: 1, title: "Identité", icon: User },
  { id: 2, title: "Incident", icon: AlertTriangle },
  { id: 3, title: "Description", icon: FileText },
  { id: 4, title: "Priorité", icon: Gauge },
];

const priorityConfig = {
  faible: {
    label: "Faible",
    color: "bg-priority-low",
    borderColor: "border-priority-low",
    textColor: "text-priority-low",
    description: "Pas d'urgence immédiate",
  },
  moyen: {
    label: "Moyen",
    color: "bg-priority-medium",
    borderColor: "border-priority-medium",
    textColor: "text-priority-medium",
    description: "Nécessite une attention",
  },
  critique: {
    label: "Critique",
    color: "bg-priority-critical",
    borderColor: "border-priority-critical",
    textColor: "text-priority-critical",
    description: "Action immédiate requise",
  },
};

const incidentTypes = [
  { value: "urgence", label: "Urgence", icon: "🚨" },
  { value: "information", label: "Information", icon: "ℹ️" },
  { value: "alerte", label: "Alerte", icon: "⚠️" },
  { value: "autre", label: "Autre", icon: "📋" },
];

export function AlertForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    incidentType: "",
    description: "",
    priority: "",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.nom.trim() !== "" && formData.prenom.trim() !== "";
      case 2:
        return formData.incidentType !== "";
      case 3:
        return formData.description.trim() !== "";
      case 4:
        return formData.priority !== "";
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && canProceed()) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      incidentType: "",
      description: "",
      priority: "",
    });
    setCurrentStep(1);
    setIsSuccess(false);
    setError(null);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6 rounded-full bg-priority-low/20 p-6"
        >
          <CheckCircle2 className="h-16 w-16 text-priority-low" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-2 text-2xl font-semibold text-foreground"
        >
          Signalement envoyé !
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 text-muted-foreground"
        >
          Votre signalement a été transmis avec succès via Telegram.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button onClick={resetForm} variant="outline" size="lg">
            Nouveau signalement
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor:
                      isCompleted ? "var(--primary)"
                      : isActive ? "var(--primary)"
                      : "var(--secondary)",
                  }}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                    isActive || isCompleted ?
                      "text-primary-foreground"
                    : "text-muted-foreground",
                  )}
                >
                  {isCompleted ?
                    <CheckCircle2 className="h-5 w-5" />
                  : <StepIcon className="h-5 w-5" />}
                </motion.div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 hidden h-0.5 w-12 sm:block lg:w-20",
                    isCompleted ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="relative min-h-[280px] overflow-hidden rounded-lg border border-border bg-card p-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-6"
          >
            {/* Step 1: Identity */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Vos informations
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Entrez votre nom et prénom pour identifier le signalement.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      placeholder="Dupont"
                      value={formData.nom}
                      onChange={(e) => updateFormData("nom", e.target.value)}
                      className="bg-secondary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                      id="prenom"
                      placeholder="Jean"
                      value={formData.prenom}
                      onChange={(e) => updateFormData("prenom", e.target.value)}
                      className="bg-secondary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Incident Type */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Type d&apos;incident
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez la catégorie qui correspond le mieux.
                  </p>
                </div>
                <Select
                  value={formData.incidentType}
                  onValueChange={(value) =>
                    updateFormData("incidentType", value)
                  }
                >
                  <SelectTrigger className="bg-secondary">
                    <SelectValue placeholder="Choisir un type d'incident" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Step 3: Description */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Description
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Décrivez l&apos;incident en détail.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description de l&apos;incident
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez la situation en détail..."
                    value={formData.description}
                    onChange={(e) =>
                      updateFormData("description", e.target.value)
                    }
                    className="min-h-[120px] resize-none bg-secondary"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Priority */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Niveau de priorité
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Indiquez l&apos;urgence de la situation.
                  </p>
                </div>
                <div className="grid gap-3">
                  {(Object.keys(priorityConfig) as Priority[]).map(
                    (priority) => {
                      const config = priorityConfig[priority];
                      const isSelected = formData.priority === priority;

                      return (
                        <motion.button
                          key={priority}
                          type="button"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => updateFormData("priority", priority)}
                          className={cn(
                            "flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all",
                            isSelected ?
                              `${config.borderColor} bg-secondary`
                            : "border-border bg-card hover:border-muted-foreground/50",
                          )}
                        >
                          <div
                            className={cn("h-4 w-4 rounded-full", config.color)}
                          />
                          <div className="flex-1">
                            <div
                              className={cn(
                                "font-medium",
                                isSelected ?
                                  config.textColor
                                : "text-foreground",
                              )}
                            >
                              {config.label}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {config.description}
                            </div>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={config.textColor}
                            >
                              <CheckCircle2 className="h-5 w-5" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    },
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {currentStep < 4 ?
          <Button onClick={nextStep} disabled={!canProceed()} className="gap-2">
            Suivant
            <ArrowRight className="h-4 w-4" />
          </Button>
        : <Button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ?
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            : <>
                <Send className="h-4 w-4" />
                Envoyer le signalement
              </>
            }
          </Button>
        }
      </div>
    </div>
  );
}
