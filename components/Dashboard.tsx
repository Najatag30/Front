"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, FileCheck, ArrowRightLeft, Activity, CheckCircle, Users } from "lucide-react"
import { useMemo } from "react"

interface OperationHistory {
  id: string
  operationType: "validation" | "transformation"
  status: "success" | "error" | "pending"
  timestamp: Date
  duration?: number
}

interface DashboardProps {
  history: OperationHistory[]
  isLoading?: boolean
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
        {/* Cercle de fond */}
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f3f4f6" strokeWidth={strokeWidth} fill="transparent" />
        {/* Cercle de progression */}
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

// Cercle plein pour le total
function SolidCircle({ value, size = 120, color = "#f59e0b" }: { value: number; size?: number; color?: string }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shadow-lg"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    >
      <span className="text-3xl font-bold text-white">{value}</span>
    </div>
  )
}

// Composant pour les mini graphiques circulaires
function MiniDonutChart({
  data,
  size = 100,
  strokeWidth = 12,
}: {
  data: { value: number; color: string }[]
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
        {/* Cercle de fond */}
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

export function Dashboard({ history = [], isLoading = false }: DashboardProps) {
  const metrics = useMemo(() => {
    const validations = history.filter((h) => h.operationType === "validation")
    const transformations = history.filter((h) => h.operationType === "transformation")
    const successes = history.filter((h) => h.status === "success")
    const errors = history.filter((h) => h.status === "error")
    const pending = history.filter((h) => h.status === "pending")

    const totalOperations = history.length
    const successRate = totalOperations > 0 ? Math.round((successes.length / totalOperations) * 100) : 0
    const validationRate = totalOperations > 0 ? Math.round((validations.length / totalOperations) * 100) : 0
    const transformationRate = totalOperations > 0 ? Math.round((transformations.length / totalOperations) * 100) : 0

    return {
      validations,
      transformations,
      successes,
      errors,
      pending,
      totalOperations,
      successRate,
      validationRate,
      transformationRate,
    }
  }, [history])

  // Données pour le graphique en secteurs
  const pieData = useMemo(
    () => [
      { value: metrics.successes.length, color: "#f59e0b" },
      { value: metrics.errors.length, color: "#ef4444" },
    ],
    [metrics.successes.length, metrics.errors.length],
  )

  const operationTypeData = useMemo(
    () => [
      { value: metrics.validations.length, color: "#fbbf24" },
      { value: metrics.transformations.length, color: "#f59e0b" },
    ],
    [metrics.validations.length, metrics.transformations.length],
  )

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
        {/* Métriques principales avec cercles de progression */}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm border border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
                Répartition Succès/Erreurs
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <MiniDonutChart data={pieData} size={120} />
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">Succès ({metrics.successes.length})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">Erreurs ({metrics.errors.length})</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                <Users className="w-5 h-5 text-orange-500 mr-3" />
                Types d'Opérations
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <MiniDonutChart data={operationTypeData} size={120} />
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">Validations ({metrics.validations.length})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Transformations ({metrics.transformations.length})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
