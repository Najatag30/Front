"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRightLeft, AlertCircle, FileText } from "lucide-react"

interface TransformationSectionProps {
  painXmlInput: string
  setPainXmlInput: (value: string) => void
  mt101Output: string
  transformationLoading: boolean
  transformationError: string | null
  onTransform: () => void
}

export function TransformationSection({
  painXmlInput,
  setPainXmlInput,
  mt101Output,
  transformationLoading,
  transformationError,
  onTransform,
}: TransformationSectionProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#FCBD00] to-[#ffd747]"></div>
        <CardHeader className="bg-gradient-to-r from-[#F55B3B] via-[#ff7b5b] to-[#F55B3B] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 transform -skew-y-1"></div>
          <CardTitle className="relative z-10 flex items-center space-x-2 text-xl">
            <ArrowRightLeft className="w-6 h-6 animate-pulse" />
            <span>Transformation PAIN vers MT101</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3 transform transition-all duration-300 hover:scale-[1.02]">
              <Label htmlFor="painInput" className="text-sm font-semibold text-gray-700 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-[#F55B3B]" />
                Input
              </Label>
              <Textarea
                id="painInput"
                placeholder="Collez votre message PAIN XML ici..."
                value={painXmlInput}
                onChange={(e) => setPainXmlInput(e.target.value)}
                className="h-80 font-mono text-sm border-2 border-gray-200 hover:border-[#FCBD00] focus:border-[#F55B3B] transition-colors duration-300 resize-none"
              />
            </div>
            <div className="space-y-3 transform transition-all duration-300 hover:scale-[1.02]">
              <Label htmlFor="mt101Output" className="text-sm font-semibold text-gray-700 flex items-center">
                <ArrowRightLeft className="w-4 h-4 mr-2 text-[#F55B3B]" />
              Output
              </Label>
              <Textarea
                id="mt101Output"
                placeholder="Le message MT101 transformé apparaîtra ici..."
                value={mt101Output}
                readOnly
                className="h-80 font-mono text-sm bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 resize-none"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <Button
              onClick={onTransform}
              disabled={transformationLoading}
              className="bg-gradient-to-r from-[#F55B3B] to-[#ff7b5b] hover:from-[#F55B3B] hover:to-[#F55B3B] text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {transformationLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Transformation en cours</span>
                </div>
              ) : (
                <>
                  <ArrowRightLeft className="w-5 h-5 mr-2" />
                  Transformer
                </>
              )}
            </Button>
          </div>
          {transformationError && (
            <Alert className="mt-6 border-2 border-red-300 bg-gradient-to-r from-red-50 to-red-100 shadow-lg shadow-red-500/20 animate-slide-in">
              <AlertCircle className="h-5 w-5 text-red-600 animate-pulse" />
              <AlertDescription className="text-red-800 font-medium">{transformationError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
