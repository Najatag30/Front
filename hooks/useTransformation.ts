"use client"

import { useState } from "react"
import { API_URL } from "@/utils"

export function useTransformation() {
  const [painXmlInput, setPainXmlInput] = useState("")
  const [mt101Output, setMt101Output] = useState("")
  const [transformationLoading, setTransformationLoading] = useState(false)
  const [transformationError, setTransformationError] = useState<string | null>(null)
  const [backendMessage, setBackendMessage] = useState<string | null>(null) // pour "message" du backend

  const handleTransformation = async () => {
    if (!painXmlInput.trim()) {
      setTransformationError("Veuillez saisir le contenu XML PAIN")
      return
    }

    setTransformationLoading(true)
    setTransformationError(null)
    setMt101Output("")
    setBackendMessage(null)

    try {
      const response = await fetch(`${API_URL}/to-mt101`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ painXml: painXmlInput }),
      })

      const data = await response.json()
      // Attendu : { status, message, mt101, errors }
      if (response.ok && data.status === "success") {
        setMt101Output(data.mt101 || "")
        setBackendMessage(data.message || null)
      } else {
        setTransformationError(data.errors || "Erreur inconnue")
        setBackendMessage(data.message || null)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur de connexion"
      setTransformationError(errorMessage)
    } finally {
      setTransformationLoading(false)
    }
  }

  return {
    painXmlInput,
    setPainXmlInput,
    mt101Output,
    transformationLoading,
    transformationError,
    backendMessage,
    handleTransformation,
  }
}
