import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FileCheck, FileText, ArrowRightLeft, Clock, AlertCircle } from "lucide-react"
import type { OperationHistory } from "@/types"
import { parseJsonErrors } from "@/utils"

interface OperationModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  selectedLog: OperationHistory | null
}

export function OperationModal({ isOpen, onClose, selectedLog }: OperationModalProps) {
  if (!selectedLog) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <div className="h-1 w-full bg-gradient-to-r from-[#FCBD00] to-[#ffd747]"></div>
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-[#F55B3B] bg-clip-text text-transparent">
            Détails de l'opération
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Type d'opération", value: selectedLog.operationType, icon: FileCheck },
              { label: "Source", value: selectedLog.sourceType, icon: FileText },
              { label: "Cible", value: selectedLog.targetType, icon: ArrowRightLeft },
              {
                label: "Timestamp",
                value: new Date(selectedLog.timestamp).toLocaleString(),
                icon: Clock,
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                >
                  <Label className="font-bold text-gray-700 text-sm uppercase tracking-wide flex items-center">
                    <Icon className="w-4 h-4 mr-2 text-[#F55B3B]" />
                    {item.label}
                  </Label>
                  <p className="text-gray-800 mt-1 font-medium">{item.value}</p>
                </div>
              )
            })}
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
              <Label className="font-bold text-gray-700 text-sm uppercase tracking-wide flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-[#F55B3B]" />
                Statut
              </Label>
              <div className="mt-2">
                <Badge
                  variant={selectedLog.status === "success" ? "default" : "destructive"}
                  className={`${
                    selectedLog.status === "success"
                      ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300"
                      : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300"
                  } shadow-md text-sm px-3 py-1`}
                >
                  {selectedLog.status === "success" ? "Succès" : "Erreur"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
              <Label className="font-bold text-blue-800 text-sm uppercase tracking-wide mb-3 block flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Input XML
              </Label>
              <div className="bg-white p-4 rounded-lg border border-blue-200 max-h-64 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800">{selectedLog.inputXml}</pre>
              </div>
            </div>

            {selectedLog.outputContent && (
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
                <Label className="font-bold text-green-800 text-sm uppercase tracking-wide mb-3 block flex items-center">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Output
                </Label>
                <div className="bg-white p-4 rounded-lg border border-green-200 max-h-64 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800">{selectedLog.outputContent}</pre>
                </div>
              </div>
            )}

            {selectedLog.errors && (
              <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
                <Label className="font-bold text-red-800 text-sm uppercase tracking-wide mb-3 block flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Erreurs
                </Label>
                <div className="bg-white p-4 rounded-lg border border-red-200 max-h-64 overflow-y-auto">
                  {parseJsonErrors(selectedLog.errors).map((err: any, idx: number) => (
                    <div key={idx} className="mb-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <span className="block font-bold text-red-700 text-sm">
                        {err.level ? `[${err.level}]` : ""}
                        {err.line ? ` Ligne: ${err.line}` : ""}
                        {err.column ? ` Col: ${err.column}` : ""}
                      </span>
                      <span className="block whitespace-pre-line text-red-800 mt-1">
                        {err.message || JSON.stringify(err)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
