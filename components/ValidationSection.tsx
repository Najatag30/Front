"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { FileCheck, Upload, AlertCircle, FileText, XCircle, AlertTriangle, Info } from "lucide-react"
import { useState } from "react"
import type { ValidationResult } from "@/types"

interface ValidationError {
  code: string
  message: string
  line?: number
  severity?: "error" | "warning" | "info"
}

interface ValidationSectionProps {
  sourceType: string
  setSourceType: (value: string) => void
  targetType: string
  setTargetType: (value: string) => void
  xmlContent: string
  setXmlContent: (value: string) => void
  validationLoading: boolean
  validationResult: ValidationResult | null
  onValidate: () => void
}

// Fonction pour parser les erreurs depuis le résultat de validation
function parseValidationErrors(validationResult: ValidationResult): ValidationError[] {
  if (!validationResult || validationResult.success) return []

  try {
    // Si le message d'erreur contient des objets JSON
    if (validationResult.error && typeof validationResult.error === "string") {
      const errorString = validationResult.error

      // Essayer de parser comme JSON array
      if (errorString.startsWith("[")) {
        return JSON.parse(errorString)
      }

      // Chercher des objets JSON dans la chaîne
      const jsonObjects = errorString.match(/\{[^}]+\}/g) || []
      const errors: ValidationError[] = []

      jsonObjects.forEach((jsonStr) => {
        try {
          const parsed = JSON.parse(jsonStr)
          errors.push({
            code: parsed.code || "VALIDATION_ERROR",
            message: parsed.message || "Message d'erreur non disponible",
            line: parsed.line || undefined,
            severity: parsed.code?.includes("WARNING") ? "warning" : "error",
          })
        } catch (e) {
          // Ignorer les objets JSON malformés
        }
      })

      if (errors.length > 0) return errors
    }

    // Si pas de parsing JSON possible, retourner l'erreur brute
    return [
      {
        code: "VALIDATION_ERROR",
        message: validationResult.error || validationResult.message || "Erreur de validation",
        severity: "error",
      },
    ]
  } catch (e) {
    return [
      {
        code: "PARSE_ERROR",
        message: validationResult.error || "Erreur lors du parsing des erreurs",
        severity: "error",
      },
    ]
  }
}

// Composant pour afficher les erreurs structurées
function ValidationErrors({ errors }: { errors: ValidationError[] }) {
  const [expandedErrors, setExpandedErrors] = useState<Set<number>>(new Set())

  const toggleError = (index: number) => {
    const newExpanded = new Set(expandedErrors)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedErrors(newExpanded)
  }

  const getErrorIcon = (severity = "error") => {
    switch (severity) {
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getErrorColor = (severity = "error") => {
    switch (severity) {
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "info":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-red-200 bg-red-50"
    }
  }

  const getBadgeColor = (severity = "error") => {
    switch (severity) {
      case "error":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "info":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-red-100 text-red-800 hover:bg-red-200"
    }
  }

  if (!errors || errors.length === 0) return null

  return (
    <Card className="mt-6 shadow-lg border-red-200">
      <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-red-100">
        <CardTitle className="flex items-center gap-2 text-lg text-red-800">
          <AlertCircle className="w-5 h-5 text-red-500" />
          Erreurs de validation détaillées
          <Badge variant="secondary" className="ml-auto bg-red-100 text-red-800">
            {errors.length} erreur{errors.length > 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-6">
        {errors.map((error, index) => {
          const severity = error.severity || "error"
          // If error.message is a JSON string with errors array, parse and display each error
          let errorList: ValidationError[] = [];
          try {
            if (typeof error.message === "string" && error.message.includes('"errors"')) {
              const parsed = JSON.parse(error.message)
              if (Array.isArray(parsed.errors)) {
                errorList = parsed.errors
              }
            }
          } catch {}

          if (errorList.length > 0) {
            return errorList.map((err, idx) => (
              <div
                key={index + '-' + idx}
                className={`border rounded-lg p-4 transition-all duration-200 ${getErrorColor(severity)} hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  {getErrorIcon(severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className={getBadgeColor(severity)}>{err.code}</Badge>
                      {err.line && (
                        <Badge variant="outline" className="text-xs">
                          Ligne {err.line}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="font-semibold text-red-700">Code : <span className="font-mono text-xs text-red-900">{err.code}</span></div>
                      <div className="font-semibold text-gray-700">Message :</div>
                      <div className="whitespace-pre-wrap break-words font-mono text-xs bg-gray-50 p-3 rounded border border-gray-200">
                        {err.message}
                      </div>
                      {err.line && (
                        <div className="font-semibold text-gray-700">Ligne : <span className="font-mono text-xs">{err.line}</span></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
          // Otherwise, display the error as usual
          return (
            <div
              key={index}
              className={`border rounded-lg p-4 transition-all duration-200 ${getErrorColor(severity)} hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                {getErrorIcon(severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className={getBadgeColor(severity)}>{error.code}</Badge>
                    {error.line && (
                      <Badge variant="outline" className="text-xs">
                        Ligne {error.line}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 space-y-2">
                    <div className="font-semibold text-red-700">Code : <span className="font-mono text-xs text-red-900">{error.code}</span></div>
                    <div className="font-semibold text-gray-700">Message :</div>
                    <div className="whitespace-pre-wrap break-words font-mono text-xs bg-gray-50 p-3 rounded border border-gray-200">
                      {error.message}
                    </div>
                    {error.line && (
                      <div className="font-semibold text-gray-700">Ligne : <span className="font-mono text-xs">{error.line}</span></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export function ValidationSection({
  sourceType,
  setSourceType,
  targetType,
  setTargetType,
  xmlContent,
  setXmlContent,
  validationLoading,
  validationResult,
  onValidate,
}: ValidationSectionProps) {
  // Parser les erreurs si la validation a échoué
  const validationErrors = validationResult && !validationResult.success ? parseValidationErrors(validationResult) : []

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#FCBD00] to-[#ffd747]"></div>
        <CardHeader className="bg-gradient-to-r from-[#F55B3B] via-[#ff7b5b] to-[#F55B3B] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 transform -skew-y-1"></div>
          <CardTitle className="relative z-10 flex items-center space-x-2 text-xl">
            <FileCheck className="w-6 h-6 animate-pulse" />
            <span>Validation de fichiers PAIN</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2 transform transition-all duration-300 hover:scale-105">
              <Label htmlFor="sourceType" className="text-sm font-semibold text-gray-700 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-[#F55B3B]" />
                Type source
              </Label>
              <Select value={sourceType} onValueChange={setSourceType}>
                <SelectTrigger className="border-2 border-gray-200 hover:border-[#FCBD00] transition-colors duration-300 focus:ring-2 focus:ring-[#F55B3B]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pain.001.001.02">pain.001.001.02</SelectItem>
                  <SelectItem value="pain.001.001.03">pain.001.001.03</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-8 space-y-2">
            <Label htmlFor="xmlContent" className="text-sm font-semibold text-gray-700 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-[#F55B3B]" />
              Contenu XML
            </Label>
            <div className="relative w-full flex rounded-lg border-2 border-gray-200 bg-white overflow-hidden" style={{ minHeight: '12rem', maxHeight: '24rem' }}>
              {/* Line numbers and textarea are synchronized by scroll */}
              <div
                id="xmlLineNumbers"
                className="bg-gray-50 border-r border-gray-200 text-gray-400 text-xs font-mono py-2 px-2 select-none text-right overflow-y-auto"
                style={{ minWidth: 32, maxHeight: '24rem' }}
              >
                {xmlContent.split("\n").map((_, i) => (
                  <div key={i} style={{ height: '1.5em', lineHeight: '1.5em' }}>{i + 1}</div>
                ))}
              </div>
              <textarea
                id="xmlContent"
                placeholder="Collez votre fichier XML PAIN ici..."
                value={xmlContent}
                onChange={(e) => setXmlContent(e.target.value)}
                className="font-mono text-sm w-full h-full resize-none outline-none p-2 bg-transparent overflow-y-auto"
                style={{ minHeight: '12rem', maxHeight: '24rem', border: 'none', boxShadow: 'none' }}
                rows={Math.max(12, xmlContent.split("\n").length)}
                spellCheck={false}
                onScroll={e => {
                  const lineNumbers = document.getElementById('xmlLineNumbers');
                  if (lineNumbers) {
                    lineNumbers.scrollTop = (e.target as HTMLTextAreaElement).scrollTop;
                  }
                }}
              />
            </div>
          </div>

          <Button
            onClick={onValidate}
            disabled={validationLoading}
            className="bg-gradient-to-r from-[#F55B3B] to-[#ff7b5b] hover:from-[#F55B3B] hover:to-[#F55B3B] text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {validationLoading ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="animate-pulse">Validation en cours</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-1 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Valider le fichier
              </>
            )}
          </Button>

          {/* Affichage du résultat simple pour les succès */}
          {validationResult && validationResult.success && (
            <Alert className="mt-6 border-2 animate-slide-in border-green-300 bg-gradient-to-r from-green-50 to-green-100 shadow-lg shadow-green-500/20">
              <AlertCircle className="h-5 w-5 text-green-600 animate-pulse" />
              <AlertDescription className="text-green-800 font-medium">
                {"Validation réussie !"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Affichage structuré des erreurs */}
      {validationErrors.length > 0 && <ValidationErrors errors={validationErrors} />}
    </div>
  )
}
