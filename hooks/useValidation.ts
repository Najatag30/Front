"use client"

import { useState } from "react"
import type { ValidationResult } from "@/types"
import { API_URL } from "@/utils"

export function useValidation() {
  const [validationLoading, setValidationLoading] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  const handleValidation = async (sourceType: string, targetType: string, xmlContent: string) => {
    if (!xmlContent.trim()) {
      setValidationResult({ error: "Veuillez saisir le contenu XML" })
      return
    }

    setValidationLoading(true)
    setValidationResult(null)

    try {
      const params = new URLSearchParams()
      params.append("sourceType", sourceType)
      params.append("targetType", targetType)
      params.append("xml", xmlContent)

      const response = await fetch(`${API_URL}/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      })

      const result = await response.text()
      setValidationResult({
        success: response.ok,
        message: result,
        status: response.status,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur de connexion"
      setValidationResult({ error: errorMessage })
    } finally {
      setValidationLoading(false)
    }
  }

  return {
    validationLoading,
    validationResult,
    handleValidation,
  }
}
