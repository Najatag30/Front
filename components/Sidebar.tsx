"use client"

import { useState } from "react"
import type { MenuItem } from "@/types"
import { ChevronDown, ChevronRight } from "lucide-react"

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeSection: string
  setActiveSection: (section: string) => void
  menuItems: MenuItem[]
}

export function Sidebar({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection, menuItems }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]))
  }

  const isMenuExpanded = (menuId: string) => expandedMenus.includes(menuId)

  return (
    <div
      className={`bg-white/90 backdrop-blur-xl shadow-2xl transition-all duration-500 ease-in-out ${
        sidebarOpen ? "w-72" : "w-28"
      } flex flex-col border-r border-white/10`}
    >
      <div className="p-8 border-b border-gray-200/50 rounded-b-2xl bg-white">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="text-white px-3 py-2 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                <img src="/images/Capture.PNG" alt="AWB Logo" className="h-12 w-auto object-contain" />
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 bg-white rounded-2xl shadow-md mx-1 mt-6">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isExpanded = isMenuExpanded(item.id)
            const isActive =
              activeSection === item.id || (item.subItems && item.subItems.some((sub) => activeSection === sub.id))

            return (
              <li key={item.id} className="animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                <button
                  onClick={() => {
                    if (hasSubItems && sidebarOpen) {
                      toggleMenu(item.id)
                    } else {
                      setActiveSection(item.id)
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-2 hover:scale-105 ${
                    isActive
                      ? "bg-gradient-to-r from-[#F55B3B] to-[#ff7b5b] text-white shadow-lg shadow-orange-500/25 border-l-4 border-amber-300"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-100 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  </div>
                  {sidebarOpen && hasSubItems && (
                    <div className="transition-transform duration-200">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  )}
                </button>

                {/* Sous-menu */}
                {sidebarOpen && hasSubItems && isExpanded && (
                  <ul className="mt-2 ml-4 space-y-1 animate-fade-in">
                    {item.subItems!.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isSubActive = activeSection === subItem.id

                      return (
                        <li key={subItem.id}>
                          <button
                            onClick={() => setActiveSection(subItem.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 transform hover:translate-x-1 ${
                              isSubActive
                                ? "bg-gradient-to-r from-amber-100 to-orange-100 text-[#F55B3B] font-medium border-l-2 border-[#F55B3B]"
                                : "text-gray-500 hover:bg-amber-50 hover:text-gray-700"
                            }`}
                          >
                            {SubIcon && <SubIcon className="w-4 h-4 flex-shrink-0" />}
                            <span className="text-sm">{subItem.label}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
