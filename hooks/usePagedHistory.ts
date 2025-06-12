"use client"

import { useState, useEffect } from "react"
import type { OperationHistory } from "@/types"

/**
 * Hook d'historique générique pour tous les types (global, validation, transformation)
 * @param type "global" | "validation" | "transformation"
 * @param sizeDefault nombre d'éléments par page
 * @param filterFromDate date début ISO (optionnel)
 * @param filterToDate date fin ISO (optionnel)
 */
export function usePagedHistory(
  type: "global" | "validation" | "transformation",
  sizeDefault: number,
  filterFromDate: string,
  filterToDate: string
) {
  const [history, setHistory] = useState<OperationHistory[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(sizeDefault)
  const [totalPages, setTotalPages] = useState(1)

  const loadHistory = async (pageIndex = page, pageSize = size) => {
    setHistoryLoading(true)
    setHistoryError(null)
    try {
      // 1. Construire l'URL en fonction du type et des filtres
      let base = "http://localhost:8089/api/payments/history"
      let endpoint = ""

      if (type === "global") endpoint = "/global"
      if (type === "validation") endpoint = "/validation"
      if (type === "transformation") endpoint = "/transformation"

      let url = `${base}${endpoint}?page=${Number(pageIndex)}&size=${Number(pageSize)}`

      // Ajout des filtres de dates si présents
      if (filterFromDate && filterToDate) {
        url += `&from=${encodeURIComponent(filterFromDate)}&to=${encodeURIComponent(filterToDate)}`
      }

      // 2. Appel API
      const response = await fetch(url)
      if (!response.ok) throw new Error("Erreur lors du chargement de l'historique")
      const data = await response.json()
      setHistory(data.content)
      setTotalPages(data.totalPages)
      setPage(Number(data.number))
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : String(err))
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, page, size, filterFromDate, filterToDate])

  return {
    history,
    historyLoading,
    historyError,
    page,
    setPage,
    size,
    setSize,
    totalPages,
    reload: loadHistory,
  }
}
