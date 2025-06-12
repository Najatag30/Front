"use client"

import { BarChart3, BadgeCheck, Repeat2, History } from "lucide-react"
import type { MenuItem } from "@/types"

interface HeaderProps {
  activeSection: string
  menuItems: MenuItem[]
}

// Gardez vos fonctions existantes (ne changez rien ici)
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
    case "logs":
      return "Toutes les opérations globales."
    default:
      return ""
  }
}

function getIcon(activeSection: string) {
  switch (activeSection) {
    case "dashboard":
      return <BarChart3 className="w-6 h-6 text-white" />
    case "validation":
    case "validation-form":
    case "validation-history":
      return <BadgeCheck className="w-6 h-6 text-white" />
    case "transformation":
    case "transformation-form":
    case "transformation-history":
      return <Repeat2 className="w-6 h-6 text-white" />
    case "logs":
      return <History className="w-6 h-6 text-white" />
    default:
      return null
  }
}

// REMPLACEZ SEULEMENT cette fonction Header par l'une des options ci-dessous
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

  // OPTION 2: Style Minimaliste (décommentez si vous préférez)
  /*
  return (
    <header className="bg-white px-6 py-6 mx-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="w-1 h-12 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
        <div>
          <h1 className="text-2xl font-light text-gray-900 tracking-wide">{getActiveTitle()}</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">{getSubtitle(activeSection)}</p>
        </div>
      </div>
    </header>
  )
  */

  // OPTION 3: Style Banking (décommentez si vous préférez)
  /*
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 mx-6 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              {getIcon(activeSection)}
            </div>
            <div className="border-l border-gray-300 pl-3">
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{getActiveTitle()}</h1>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">{getSubtitle(activeSection)}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Session Active</div>
            <div className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString("fr-FR")}</div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </header>
  )
  */

  // OPTION 4: Style Clean (décommentez si vous préférez)
  /*
  return (
    <header className="bg-white px-6 py-5 mx-6 rounded-lg shadow-sm border-l-4 border-orange-500">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-orange-50 rounded-lg">{getIcon(activeSection)}</div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{getActiveTitle()}</h1>
          <p className="text-sm text-gray-600 mt-1">{getSubtitle(activeSection)}</p>
        </div>
      </div>
    </header>
  )
  */
}
