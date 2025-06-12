"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileCheck, Upload, AlertCircle, FileText, ArrowRightLeft } from "lucide-react"
import type { ValidationResult } from "@/types"

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
            <Textarea
              id="xmlContent"
              placeholder="Collez votre fichier XML PAIN ici..."
              value={xmlContent}
              onChange={(e) => setXmlContent(e.target.value)}
              className="h-48 font-mono text-sm border-2 border-gray-200 hover:border-[#FCBD00] focus:border-[#F55B3B] transition-colors duration-300 resize-none"
            />
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
          {validationResult && (
            <Alert
              className={`mt-6 border-2 animate-slide-in ${
                validationResult.success
                  ? "border-green-300 bg-gradient-to-r from-green-50 to-green-100 shadow-lg shadow-green-500/20"
                  : "border-red-300 bg-gradient-to-r from-red-50 to-red-100 shadow-lg shadow-red-500/20"
              }`}
            >
              <AlertCircle
                className={`h-5 w-5 ${validationResult.success ? "text-green-600" : "text-red-600"} animate-pulse`}
              />
              <AlertDescription
                className={`${validationResult.success ? "text-green-800" : "text-red-800"} font-medium`}
              >
                {validationResult.message || validationResult.error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
