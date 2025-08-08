"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { XCircle, Calendar, Clock, FileCheck, X, Eye, Download, FileText, ImageIcon } from "lucide-react"
import { useRef } from "react"
import type { OperationHistory } from "@/types"

interface ValidationHistorySectionProps {
  history: OperationHistory[]
  historyLoading: boolean
  historyError: string | null
  filterDate: string
  setFilterDate: (value: string) => void
  filterFromTime: string
  setFilterFromTime: (value: string) => void
  filterToTime: string
  setFilterToTime: (value: string) => void
  onFilter: () => void
  onResetFilters: () => void
  onViewDetails: (log: OperationHistory) => void
  page: number
  setPage: (n: number) => void
  totalPages: number
  size: number
  setSize: (n: number) => void
}

// Composant pour exporter une opération individuelle en PDF et Image
function ExportSingleOperation({ operation }: { operation: OperationHistory }) {
  // Export PDF d'une seule opération
  const exportOperationToPDF = () => {
    // Fonction pour échapper les caractères HTML
    const escapeHtml = (text: string) => {
      const div = document.createElement("div")
      div.textContent = text
      return div.innerHTML
    }

    // Fonction pour formater le XML avec indentation
    const formatXml = (xml: string) => {
      try {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xml, "text/xml")
        const serializer = new XMLSerializer()
        const formatted = serializer.serializeToString(xmlDoc)
        return escapeHtml(formatted)
      } catch (e) {
        return escapeHtml(xml)
      }
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Opération ${operation.id} - Rapport PDF</title>
        <style>
          @page { margin: 20mm; size: A4; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.6; 
            color: #333;
          }
          .header { 
            background: linear-gradient(135deg, #F55B3B, #ff7b5b); 
            color: white; 
            padding: 20px; 
            border-radius: 10px; 
            text-align: center; 
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 5px 0 0 0; opacity: 0.9; }
          .info-section { 
            background: #f8f9fa; 
            border-radius: 10px; 
            padding: 20px; 
            margin-bottom: 20px;
            border-left: 4px solid #F55B3B;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 150px 1fr; 
            gap: 15px; 
            margin: 15px 0; 
          }
          .label { 
            font-weight: bold; 
            color: #F55B3B; 
            background: white; 
            padding: 10px; 
            border-radius: 5px;
            border: 1px solid #e9ecef;
          }
          .value { 
            padding: 10px; 
            background: white; 
            border-radius: 5px;
            border: 1px solid #e9ecef;
          }
          .status-success { 
            background: #d4edda; 
            color: #155724; 
            padding: 5px 10px; 
            border-radius: 20px; 
            font-weight: bold;
            display: inline-block;
          }
          .status-error { 
            background: #f8d7da; 
            color: #721c24; 
            padding: 5px 10px; 
            border-radius: 20px; 
            font-weight: bold;
            display: inline-block;
          }
          .xml-section { 
            background: #f1f3f4; 
            border: 1px solid #dadce0; 
            border-radius: 10px; 
            padding: 20px; 
            margin: 20px 0;
            page-break-inside: avoid;
          }
          .xml-content { 
            background: #ffffff; 
            border: 1px solid #e8eaed; 
            border-radius: 5px; 
            padding: 15px; 
            font-family: 'Courier New', monospace; 
            font-size: 10px;
            white-space: pre-wrap; 
            overflow-wrap: break-word;
            max-height: 400px;
            overflow-y: auto;
            line-height: 1.4;
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #6c757d; 
            border-top: 2px solid #F55B3B; 
            padding-top: 20px; 
            font-size: 14px;
          }
          .timestamp { color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 Rapport d'Opération</h1>
          <p>ID: ${operation.id} | Type: ${operation.operationType}</p>
        </div>
        
        <div class="info-section">
          <h2 style="color: #F55B3B; margin-top: 0;">ℹ️ Informations Générales</h2>
          <div class="info-grid">
            <div class="label">ID Opération</div>
            <div class="value">${operation.id}</div>
            
            <div class="label">Type</div>
            <div class="value">${operation.operationType}</div>
            
            <div class="label">Source</div>
            <div class="value">${operation.sourceType}</div>
            
            <div class="label">Cible</div>
            <div class="value">${operation.targetType}</div>
            
            <div class="label">Date/Heure</div>
            <div class="value">${new Date(operation.timestamp).toLocaleString("fr-FR")}</div>
            
            <div class="label">Statut</div>
            <div class="value">
              <span class="status-${operation.status}">
                ${operation.status === "success" ? "✅ Succès" : "❌ Erreur"}
              </span>
            </div>
          </div>
        </div>

        ${
          operation.errors
            ? `
        <div class="info-section">
          <h2 style="color: #dc3545; margin-top: 0;">⚠️ Erreurs Détectées</h2>
          <div class="xml-content" style="color: #721c24; background: #f8d7da;">
${escapeHtml(operation.errors)}
          </div>
        </div>
        `
            : ""
        }

        ${
          operation.inputXml
            ? `
        <div class="xml-section">
          <h2 style="color: #F55B3B; margin-top: 0;">📄 Contenu XML d'Entrée</h2>
          <div class="xml-content">${formatXml(operation.inputXml)}</div>
        </div>
        `
            : ""
        }

        ${
          operation.outputContent
            ? `
        <div class="xml-section">
          <h2 style="color: #28a745; margin-top: 0;">📤 Contenu de Sortie</h2>
          <div class="xml-content">${escapeHtml(operation.outputContent)}</div>
        </div>
        `
            : ""
        }

        <div class="footer">
          <p><strong>Rapport généré le:</strong> ${new Date().toLocaleString("fr-FR")}</p>
          <p><strong>Système:</strong> Interface de Validation Bancaire</p>
          <p><strong>Opération ID:</strong> ${operation.id}</p>
        </div>
      </body>
    </html>
  `

    const blob = new Blob([htmlContent], { type: "text/html" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `operation-${operation.id}-rapport.html`
    link.click()

    // Ouvrir dans une nouvelle fenêtre pour impression PDF
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 1000)
    }
  }

  // Export Image (capture d'écran simulée)
  const exportOperationToImage = () => {
    // Créer un canvas pour générer l'image
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      alert("Impossible de créer l'image")
      return
    }

    // Dimensions de l'image
    canvas.width = 800
    canvas.height = 600

    // Fond blanc
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // En-tête avec gradient (simulé)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, "#F55B3B")
    gradient.addColorStop(1, "#ff7b5b")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, 80)

    // Titre
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("📋 Rapport d'Opération", canvas.width / 2, 35)
    ctx.font = "16px Arial"
    ctx.fillText(`ID: ${operation.id} | ${operation.operationType}`, canvas.width / 2, 60)

    // Contenu principal
    ctx.fillStyle = "#333333"
    ctx.font = "16px Arial"
    ctx.textAlign = "left"

    let y = 120
    const lineHeight = 25

    const info = [
      `ID: ${operation.id}`,
      `Type: ${operation.operationType}`,
      `Source: ${operation.sourceType}`,
      `Cible: ${operation.targetType}`,
      `Date: ${new Date(operation.timestamp).toLocaleString("fr-FR")}`,
      `Statut: ${operation.status === "success" ? "✅ Succès" : "❌ Erreur"}`,
    ]

    info.forEach((line) => {
      ctx.fillText(line, 50, y)
      y += lineHeight
    })

    // Erreurs si présentes
    if (operation.errors) {
      y += 20
      ctx.fillStyle = "#dc3545"
      ctx.font = "bold 16px Arial"
      ctx.fillText("⚠️ Erreurs:", 50, y)
      y += lineHeight

      ctx.fillStyle = "#721c24"
      ctx.font = "12px Arial"
      const errorLines = operation.errors.substring(0, 200).split("\n")
      errorLines.forEach((line) => {
        if (y < canvas.height - 50) {
          ctx.fillText(line.substring(0, 80), 50, y)
          y += 20
        }
      })
    }

    // Pied de page
    ctx.fillStyle = "#6c757d"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`Généré le: ${new Date().toLocaleString("fr-FR")}`, canvas.width / 2, canvas.height - 20)

    // Télécharger l'image
    const link = document.createElement("a")
    link.download = `operation-${operation.id}-image.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={exportOperationToPDF} className="cursor-pointer hover:bg-red-50">
          <FileText className="w-4 h-4 mr-2 text-red-600" />
          Exporter en PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportOperationToImage} className="cursor-pointer hover:bg-purple-50">
          <ImageIcon className="w-4 h-4 mr-2 text-purple-600" />
          Exporter en Image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ValidationHistorySection({
  history,
  historyLoading,
  historyError,
  filterDate,
  setFilterDate,
  filterFromTime,
  setFilterFromTime,
  filterToTime,
  setFilterToTime,
  onFilter,
  onResetFilters,
  onViewDetails,
  page,
  setPage,
  totalPages,
  size,
  setSize,
}: ValidationHistorySectionProps) {
  const tableRef = useRef<HTMLDivElement>(null)

  // Filtrer seulement les opérations de validation
  const validationHistory = history.filter((log) => log.operationType === "validation")

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#FCBD00] to-[#ffd747]"></div>
        <CardHeader className="bg-gradient-to-r from-[#F55B3B] via-[#ff7b5b] to-[#F55B3B] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 transform -skew-y-1"></div>
          <CardTitle className="relative z-10 flex items-center space-x-2 text-xl">
            <FileCheck className="w-6 h-6 animate-pulse" />
            <span>Historique des validations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {historyLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F55B3B] mx-auto mb-4"></div>
              <p className="text-gray-500 animate-pulse">Chargement des données...</p>
            </div>
          ) : historyError ? (
            <div className="p-12 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
              <p className="text-red-600 font-medium">{historyError}</p>
            </div>
          ) : (
            <>
              {/* Bloc filtre par date */}
              <div className="mb-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#F55B3B]" />
                  Filtrer les validations
                </h3>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <Label
                      htmlFor="filter-date"
                      className="block mb-1 text-sm font-medium text-gray-700 flex items-center"
                    >
                      <Calendar className="w-4 h-4 mr-1 text-[#F55B3B]" />
                      Date
                    </Label>
                    <input
                      type="date"
                      id="filter-date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#FCBD00] focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <Label
                      htmlFor="filter-from-time"
                      className="block mb-1 text-sm font-medium text-gray-700 flex items-center"
                    >
                      <Clock className="w-4 h-4 mr-1 text-[#F55B3B]" />
                      Heure début
                    </Label>
                    <input
                      type="time"
                      id="filter-from-time"
                      value={filterFromTime}
                      onChange={(e) => setFilterFromTime(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#FCBD00] focus:border-transparent transition-all duration-300"
                      step="1"
                    />
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <Label
                      htmlFor="filter-to-time"
                      className="block mb-1 text-sm font-medium text-gray-700 flex items-center"
                    >
                      <Clock className="w-4 h-4 mr-1 text-[#F55B3B]" />
                      Heure fin
                    </Label>
                    <input
                      type="time"
                      id="filter-to-time"
                      value={filterToTime}
                      onChange={(e) => setFilterToTime(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#FCBD00] focus:border-transparent transition-all duration-300"
                      step="1"
                    />
                  </div>
                  <Button
                    onClick={onFilter}
                    className="bg-gradient-to-r from-[#F55B3B] to-[#ff7b5b] text-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    Filtrer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onResetFilters}
                    className="ml-2 border-[#F55B3B] text-[#F55B3B] hover:bg-orange-50 transform hover:scale-105 transition-all duration-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Réinitialiser
                  </Button>
                </div>
              </div>

              {/* Tableau avec référence pour l'export */}
              <div ref={tableRef} className="overflow-hidden rounded-xl border border-gray-200 shadow-md bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-amber-100 to-orange-100">
                      <TableHead className="font-bold text-gray-800">Source → Cible</TableHead>
                      <TableHead className="font-bold text-gray-800">Timestamp</TableHead>
                      <TableHead className="font-bold text-gray-800">Statut</TableHead>
                      <TableHead className="font-bold text-gray-800">Erreur</TableHead>
                      <TableHead className="font-bold text-gray-800">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationHistory.map((log, index) => (
                      <TableRow
                        key={log.id}
                        className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 animate-slide-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-mono text-sm">
                          {log.sourceType} → {log.targetType}
                        </TableCell>
                        <TableCell className="text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={log.status === "success" ? "default" : "destructive"}
                            className={`${
                              log.status === "success"
                                ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300"
                                : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300"
                            } shadow-md hover:shadow-lg transition-shadow duration-300`}
                          >
                            {log.status === "success" ? "Succès" : "Erreur"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {log.errors ? (
                            <span
                              className="text-red-600 cursor-help hover:text-red-800 transition-colors duration-200"
                              title={log.errors}
                            >
                              {log.errors.length > 40 ? log.errors.substring(0, 40) + "..." : log.errors}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewDetails(log)}
                              className="text-[#F55B3B] border-[#F55B3B] hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-100 hover:shadow-md transform hover:scale-105 transition-all duration-300"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Détails
                            </Button>
                            {/* Nouveau bouton d'export pour chaque opération */}
                            <ExportSingleOperation operation={log} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {validationHistory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-bounce" />
                          <p className="text-gray-500 text-lg">Aucune validation enregistrée</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* PAGINATION */}
              {validationHistory.length > 0 && (
                <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
                  <Button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 0}
                    className="bg-[#F55B3B] text-white px-4 py-2 rounded-lg shadow"
                  >
                    Précédent
                  </Button>
                  <span className="mx-4 text-gray-700 font-semibold">
                    Page {page + 1} / {totalPages}
                  </span>
                  <Button
                    onClick={() => setPage(page + 1)}
                    disabled={page + 1 >= totalPages}
                    className="bg-[#F55B3B] text-white px-4 py-2 rounded-lg shadow"
                  >
                    Suivant
                  </Button>
                  <label htmlFor="page-size-select" className="ml-4 text-sm text-gray-600">
                    Taille :
                  </label>
                  <select
                    id="page-size-select"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="ml-2 border rounded px-2"
                  >
                    {[5, 10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
