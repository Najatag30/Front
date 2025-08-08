import type React from "react"
export interface OperationHistory {
  id: string
  operationType: "validation" | "transformation"
  status: "success" | "error" | "pending"
  timestamp: Date
  sourceType: string
  targetType: string
  inputXml: string
  outputContent: string
  errors?: string
  duration?: number
  details?: string
  userId?: string
  bic?: string 
}


export interface TransformationResult {
  id: string
  painXml: string
  mt101Result: string
  timestamp: string
  status: "success" | "error"
}

export interface ValidationResult {
  success?: boolean
  error?: string
  message?: string
  status?: number
}

// types.ts
export type MenuItem = {
  id: string
  label: string
  icon?: React.ElementType // <-- Rendre icon facultatif (ajoute le "?")
  subItems?: MenuItem[]
}


// Nouvelle interface pour les sous-menus
export interface SubMenuItem {
  id: string
  label: string
  icon: any
}


export interface DashboardMetrics {
  totalOperations: number
  successRate: number
  errorRate: number
  averageExecutionTime: number
  operationsPerHour: number
}


