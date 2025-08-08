"use client"

import { BarChart3, CheckCircle2, Repeat2, History, Play, Upload } from "lucide-react" // Ajout de Upload
import type { MenuItem } from "@/types"

interface HeaderProps {
  activeSection: string
  menuItems: MenuItem[]
}

// Fonction mise à jour avec les nouvelles sections
function getSubtitle(activeSection: string) {
  switch (activeSection) {
    case "dashboard":
      return "Vue d'ensemble de votre activité bancaire"
    case "validation":
    case "validation-form":
      return "Soumettez ou validez vos fichiers XML ici."
    case "validation-history":
      return "Historique de toutes vos validations."
    case "transformation":
    case "transformation-form":
      return "Effectuez vos transformations de fichiers ici."
    case "transformation-history":
      return "Historique des transformations effectuées."
    case "simulation-validation":
      return "Testez vos validations sans enregistrer dans l'historique."
    case "simulation-transformation":
      return "Testez vos transformations sans enregistrer dans l'historique."
    case "injection":
      return "Envoyez des fichiers XML vers Kafka."
    case "logs":
      return "Toutes les opérations globales."
    default:
      return ""
  }
}

// Fonction mise à jour avec les nouvelles sections
function getIcon(activeSection: string) {
  switch (activeSection) {
    case "dashboard":
      return <BarChart3 className="w-6 h-6 text-white" />
    case "validation":
    case "validation-form":
    case "validation-history":
      return <CheckCircle2 className="w-6 h-6 text-white" />
    case "transformation":
    case "transformation-form":
    case "transformation-history":
      return <Repeat2 className="w-6 h-6 text-white" />
    case "simulation-validation":
    case "simulation-transformation":
      return <Play className="w-6 h-6 text-white" />
    case "injection":
      return <Upload className="w-6 h-6 text-white" />
    case "logs":
      return <History className="w-6 h-6 text-white" />
    default:
      return null
  }
}

// Votre fonction Header reste identique
export function Header({ activeSection, menuItems }: HeaderProps) {
  // Gardez cette fonction (ne changez rien)
  const getActiveTitle = () => {
    for (const item of menuItems) {
      if (item.id === activeSection) {
        return item.label
      }
      if (item.subItems) {
        const subItem = item.subItems.find((sub) => sub.id === activeSection)
        if (subItem) {
          return `${item.label} - ${subItem.label}`
        }
      }
    }
    return "Tableau de bord"
  }

  // OPTION 1: Style Corporate (RECOMMANDÉ)
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-5 mx-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg shadow-sm">
            {getIcon(activeSection)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{getActiveTitle()}</h1>
            <p className="text-sm text-gray-600 mt-0.5">{getSubtitle(activeSection)}</p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-500">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
      </div>
    </header>
  )
}
