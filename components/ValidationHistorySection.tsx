"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { XCircle, Calendar, Clock, FileCheck, X, Eye } from "lucide-react"
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

              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-md">
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(log)}
                            className="text-[#F55B3B] border-[#F55B3B] hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-100 hover:shadow-md transform hover:scale-105 transition-all duration-300"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
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
