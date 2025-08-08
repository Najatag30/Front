"use client"
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TrendingUp,
  FileCheck,
  ArrowRightLeft,
  Activity,
  CheckCircle,
  Users,
  DollarSign,
  Network,
  Server,
  Globe,
  Zap,
} from "lucide-react"
import { useMemo, useEffect, useState } from "react"
import type { OperationHistory } from "@/types"

interface DashboardProps {
  history: OperationHistory[]
  isLoading?: boolean
}

type ChartDataItem = {
  value: number
  color: string
  label: string
}

// Composant pour les cercles de progression
function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "#f59e0b",
}: {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f3f4f6" strokeWidth={strokeWidth} fill="transparent" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={isNaN(strokeDashoffset) ? 0 : strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
      </div>
    </div>
  )
}

function MiniDonutChart({
  data,
  size = 100,
  strokeWidth = 12,
}: {
  data: ChartDataItem[]
  size?: number
  strokeWidth?: number
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f3f4f6" strokeWidth={strokeWidth} fill="transparent" />
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0
          const strokeDasharray = circumference
          const strokeDashoffset = circumference - (percentage / 100) * circumference
          const rotation = (cumulativePercentage / 100) * 360

          cumulativePercentage += percentage

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={item.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={isNaN(strokeDashoffset) ? 0 : strokeDashoffset}
              strokeLinecap="round"
              style={{
                transformOrigin: `${size / 2}px ${size / 2}px`,
                transform: `rotate(${rotation}deg)`,
              }}
              className="transition-all duration-1000 ease-out"
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{total}</span>
      </div>
    </div>
  )
}

// Fonction pour obtenir l'icône de système
function getSystemIcon(system: string) {
  switch (system.toUpperCase()) {
    case "UMAD":
      return Network
    case "UDEV":
      return Globe
    case "RTGS":
      return Zap
    case "MMAD":
      return Server
    default:
      return Activity
  }
}

// Fonction pour obtenir la couleur
function getItemColor(item: string, index: number): string {
  const colors = ["#f59e0b", "#fbbf24", "#ea580c", "#f97316", "#fb923c", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444"]
  return colors[index % colors.length]
}

// Hook pour les statistiques
function useCurrencyStats() {
  const [currencyStats, setCurrencyStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCurrencyStats = async () => {
      setLoading(true)
      try {
        const res = await fetch("http://localhost:8089/api/stats/currencies")
        if (!res.ok) throw new Error("Erreur de chargement des stats")
        const data = (await res.json()) as Record<string, number>
        setCurrencyStats(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    fetchCurrencyStats()
  }, [])

  return { currencyStats, loading, error }
}

export function Dashboard({ history = [], isLoading = false }: DashboardProps) {
  const { currencyStats, loading: currencyLoading, error: currencyError } = useCurrencyStats()

  const metrics = useMemo(() => {
    const validations = history.filter((h) => h.operationType === "validation")
    const transformations = history.filter((h) => h.operationType === "transformation")
    const successes = history.filter((h) => h.status === "success")
    const errors = history.filter((h) => h.status === "error")

    const totalOperations = history.length
    const successRate = totalOperations > 0 ? Math.round((successes.length / totalOperations) * 100) : 0
    const validationRate = totalOperations > 0 ? Math.round((validations.length / totalOperations) * 100) : 0
    const transformationRate = totalOperations > 0 ? Math.round((transformations.length / totalOperations) * 100) : 0

    return {
      validations,
      transformations,
      successes,
      errors,
      totalOperations,
      successRate,
      validationRate,
      transformationRate,
    }
  }, [history])

  // Données pour les graphiques
  const pieData = useMemo(
    () =>
      [
        { value: metrics.successes.length, color: "#f59e0b", label: "Succès" },
        { value: metrics.errors.length, color: "#ef4444", label: "Erreurs" },
      ] as ChartDataItem[],
    [metrics.successes.length, metrics.errors.length],
  )

  const operationTypeData = useMemo(
    () =>
      [
        { value: metrics.validations.length, color: "#fbbf24", label: "Validations" },
        { value: metrics.transformations.length, color: "#f59e0b", label: "Transformations" },
      ] as ChartDataItem[],
    [metrics.validations.length, metrics.transformations.length],
  )

  // UN SEUL graphique avec TOUTES les données
  const allData = useMemo(() => {
    if (!currencyStats || Object.keys(currencyStats).length === 0) return [] as ChartDataItem[]

    return Object.entries(currencyStats).map(([item, count], index) => ({
      value: count as number,
      color: getItemColor(item, index),
      label: item,
    })) as ChartDataItem[]
  }, [currencyStats])

  // Extraire seulement les systèmes pour la légende
  const systemsForLegend = useMemo(() => {
    const systems = ["RTGS", "UMAD", "UDEV", "MMAD"]
    return systems.map((system) => {
      const found = allData.find((item) => item.label.toUpperCase() === system)
      return {
        label: system,
        value: found ? found.value : 0,
        color: found ? found.color : "#gray-400",
      }
    })
  }, [allData])

  const totalOperations = useMemo(() => {
    return Object.values(currencyStats).reduce((sum: number, count: unknown) => sum + (count as number), 0)
  }, [currencyStats])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-lg shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
                <h3 className="font-semibold text-gray-700">Taux de Succès</h3>
              </div>
              <div className="mb-4">
                <CircularProgress percentage={metrics.successRate} color="#f59e0b" />
              </div>
              <p className="text-sm text-gray-600">
                {metrics.successes.length} succès sur {metrics.totalOperations}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5 text-yellow-500 mr-2" />
                <h3 className="font-semibold text-gray-700">Validations</h3>
              </div>
              <div className="mb-4">
                <CircularProgress percentage={metrics.validationRate} color="#fbbf24" />
              </div>
              <p className="text-sm text-gray-600">{metrics.validations.length} validations</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <ArrowRightLeft className="w-5 h-5 text-orange-600 mr-2" />
                <h3 className="font-semibold text-gray-700">Transformations</h3>
              </div>
              <div className="mb-4">
                <CircularProgress percentage={metrics.transformationRate} color="#ea580c" />
              </div>
              <p className="text-sm text-gray-600">{metrics.transformations.length} transformations</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <Activity className="w-5 h-5 text-orange-500 mr-2" />
                <h3 className="font-semibold text-gray-700">Total Opérations</h3>
              </div>
              <div className="mb-4">
                <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">{metrics.totalOperations}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Opérations totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques détaillés */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Succès/Erreurs */}
          <Card className="bg-white shadow-sm border border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
                Succès/Erreurs
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <MiniDonutChart data={pieData} size={120} />
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">Succès</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{metrics.successes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">Erreurs</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{metrics.errors.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Types d'opérations */}
          <Card className="bg-white shadow-sm border border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <Users className="w-5 h-5 text-orange-500 mr-3" />
                Types d'Opérations
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <MiniDonutChart data={operationTypeData} size={120} />
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">Validations</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{metrics.validations.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">Transformations</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{metrics.transformations.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* UN SEUL CERCLE avec toutes les données */}
          <Card className="bg-white shadow-sm border border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <DollarSign className="w-5 h-5 text-blue-500 mr-3" />
                Répartition Générale
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              {currencyLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : currencyError ? (
                <div className="text-center text-red-500 text-sm">
                  <p>Erreur de chargement</p>
                </div>
              ) : allData.length > 0 ? (
                <>
                  {/* UN SEUL CERCLE avec TOUTES les données */}
                  <MiniDonutChart data={allData} size={140} />

                  {/* Légende SEULEMENT pour les systèmes */}
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {systemsForLegend.map((system) => {
                      const SystemIcon = getSystemIcon(system.label)
                      const percentage = totalOperations > 0 ? Math.round((system.value / totalOperations) * 100) : 0

                      return (
                        <div key={system.label} className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: system.color }}></div>
                          <SystemIcon className="w-4 h-4 text-gray-600" />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-700 block">{system.label}</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-bold text-gray-800">{system.value}</span>
                              <span className="text-xs text-gray-500">({percentage}%)</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  <p>Aucune donnée disponible</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
