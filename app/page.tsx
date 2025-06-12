"use client"

import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { Dashboard } from "@/components/Dashboard"
import { ValidationSection } from "@/components/ValidationSection"
import { ValidationHistorySection } from "@/components/ValidationHistorySection"
import { TransformationSection } from "@/components/TransformationSection"
import { TransformationHistorySection } from "@/components/TransformationHistorySection"
import { HistorySection } from "@/components/HistorySection"
import { OperationModal } from "@/components/OperationModal"
import { useValidation } from "@/hooks/useValidation"
import { useTransformation } from "@/hooks/useTransformation"
import { usePagedHistory } from "@/hooks/usePagedHistory"
import type { OperationHistory, MenuItem } from "@/types"
import { LayoutDashboard, CheckCircle2, Repeat2, Clock } from "lucide-react";

// Fonction utilitaire robuste pour transformer date/heure en ISO
function toUTCISOString(dateStr: string, timeStr: string): string {
  if (!dateStr || !timeStr) throw new Error("Date or Time missing");
  if (timeStr.length === 5) timeStr += ":00";
  const isoString = `${dateStr}T${timeStr}`;
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${isoString}`);
  }
  return date.toISOString();
}

export default function BankingInterface() {
  // === États de filtres pour CHAQUE historique ===
  // Historique global
  const [filterDateGlobal, setFilterDateGlobal] = useState("")
  const [filterFromTimeGlobal, setFilterFromTimeGlobal] = useState("")
  const [filterToTimeGlobal, setFilterToTimeGlobal] = useState("")
  const [filterFromDateGlobal, setFilterFromDateGlobal] = useState("")
  const [filterToDateGlobal, setFilterToDateGlobal] = useState("")
  // Historique validation
  const [filterDateValidation, setFilterDateValidation] = useState("")
  const [filterFromTimeValidation, setFilterFromTimeValidation] = useState("")
  const [filterToTimeValidation, setFilterToTimeValidation] = useState("")
  const [filterFromDateValidation, setFilterFromDateValidation] = useState("")
  const [filterToDateValidation, setFilterToDateValidation] = useState("")
  // Historique transformation
  const [filterDateTransformation, setFilterDateTransformation] = useState("")
  const [filterFromTimeTransformation, setFilterFromTimeTransformation] = useState("")
  const [filterToTimeTransformation, setFilterToTimeTransformation] = useState("")
  const [filterFromDateTransformation, setFilterFromDateTransformation] = useState("")
  const [filterToDateTransformation, setFilterToDateTransformation] = useState("")

  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedLog, setSelectedLog] = useState<OperationHistory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // États pour la validation (formulaire)
  const [sourceType, setSourceType] = useState("pain.001.001.03")
  const [targetType, setTargetType] = useState("MT101")
  const [xmlContent, setXmlContent] = useState("")

  // HOOKS personnalisés de validation/transformation
  const { validationLoading, validationResult, handleValidation } = useValidation()
  const {
    painXmlInput,
    setPainXmlInput,
    mt101Output,
    transformationLoading,
    transformationError,
    handleTransformation,
  } = useTransformation()

  // Un hook d'historique par section !
  const historyGlobal = usePagedHistory("global", 10, filterFromDateGlobal, filterToDateGlobal)
  const historyValidation = usePagedHistory("validation", 10, filterFromDateValidation, filterToDateValidation)
  const historyTransformation = usePagedHistory("transformation", 10, filterFromDateTransformation, filterToDateTransformation)

  // Handlers pour CHAQUE filtre

  // --- GLOBAL ---
  const handleFilterGlobal = () => {
    if (filterDateGlobal && filterFromTimeGlobal && filterToTimeGlobal) {
      let from = toUTCISOString(filterDateGlobal, filterFromTimeGlobal);
      let to;
      if (filterToTimeGlobal.length === 5) {
        to = `${filterDateGlobal}T${filterToTimeGlobal}:59.999Z`;
      } else if (filterToTimeGlobal.length === 8) {
        to = `${filterDateGlobal}T${filterToTimeGlobal}.999Z`;
      } else {
        to = `${filterDateGlobal}T23:59:59.999Z`;
      }
      setFilterFromDateGlobal(from);
      setFilterToDateGlobal(to);
      historyGlobal.setPage(0);
    }
  }
  const handleResetGlobal = () => {
    setFilterDateGlobal(""); setFilterFromTimeGlobal(""); setFilterToTimeGlobal("");
    setFilterFromDateGlobal(""); setFilterToDateGlobal(""); historyGlobal.setPage(0);
  }

  // --- VALIDATION ---
  const handleFilterValidation = () => {
    if (filterDateValidation && filterFromTimeValidation && filterToTimeValidation) {
      let from = toUTCISOString(filterDateValidation, filterFromTimeValidation);
      let to;
      if (filterToTimeValidation.length === 5) {
        to = `${filterDateValidation}T${filterToTimeValidation}:59.999Z`;
      } else if (filterToTimeValidation.length === 8) {
        to = `${filterDateValidation}T${filterToTimeValidation}.999Z`;
      } else {
        to = `${filterDateValidation}T23:59:59.999Z`;
      }
      setFilterFromDateValidation(from);
      setFilterToDateValidation(to);
      historyValidation.setPage(0);
    }
  }
  const handleResetValidation = () => {
    setFilterDateValidation(""); setFilterFromTimeValidation(""); setFilterToTimeValidation("");
    setFilterFromDateValidation(""); setFilterToDateValidation(""); historyValidation.setPage(0);
  }

  // --- TRANSFORMATION ---
  const handleFilterTransformation = () => {
    if (filterDateTransformation && filterFromTimeTransformation && filterToTimeTransformation) {
      let from = toUTCISOString(filterDateTransformation, filterFromTimeTransformation);
      let to;
      if (filterToTimeTransformation.length === 5) {
        to = `${filterDateTransformation}T${filterToTimeTransformation}:59.999Z`;
      } else if (filterToTimeTransformation.length === 8) {
        to = `${filterDateTransformation}T${filterToTimeTransformation}.999Z`;
      } else {
        to = `${filterDateTransformation}T23:59:59.999Z`;
      }
      setFilterFromDateTransformation(from);
      setFilterToDateTransformation(to);
      historyTransformation.setPage(0);
    }
  }
  const handleResetTransformation = () => {
    setFilterDateTransformation(""); setFilterFromTimeTransformation(""); setFilterToTimeTransformation("");
    setFilterFromDateTransformation(""); setFilterToDateTransformation(""); historyTransformation.setPage(0);
  }

  // Sidebar et menu
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
    },
    {
      id: "validation",
      label: "Validation",
      icon: CheckCircle2,
      subItems: [
        { id: "validation-form", label: "Validation", icon: CheckCircle2 },
        { id: "validation-history", label: "Historique", icon: Clock },
      ],
    },
    {
      id: "transformation",
      label: "Transformation",
      icon: Repeat2,
      subItems: [
        { id: "transformation-form", label: "Transformation", icon: Repeat2 },
        { id: "transformation-history", label: "Historique", icon: Clock },
      ],
    },
    {
      id: "logs",
      label: "Historique global",
      icon: Clock,
    },
  ];
  
  const handleViewDetails = (log: OperationHistory) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const onValidate = () => {
    handleValidation(sourceType, targetType, xmlContent);
    historyValidation.reload();
    historyGlobal.reload();
  };
  const onTransform = async () => {
    await handleTransformation();
    historyTransformation.reload();
    historyGlobal.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50 flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={menuItems}
      />

      <div className="flex-1 flex flex-col">
        <Header activeSection={activeSection} menuItems={menuItems} />

        <main className="flex-1 p-6 overflow-auto">
          {/* Dashboard */}
          {activeSection === "dashboard" && <Dashboard history={historyGlobal.history} />}

          {/* Validation - Formulaire */}
          {(activeSection === "validation" || activeSection === "validation-form") && (
            <ValidationSection
              sourceType={sourceType}
              setSourceType={setSourceType}
              targetType={targetType}
              setTargetType={setTargetType}
              xmlContent={xmlContent}
              setXmlContent={setXmlContent}
              validationLoading={validationLoading}
              validationResult={validationResult}
              onValidate={onValidate}
            />
          )}

          {/* Validation - Historique */}
          {activeSection === "validation-history" && (
            <ValidationHistorySection
              history={historyValidation.history}
              historyLoading={historyValidation.historyLoading}
              historyError={historyValidation.historyError}
              filterDate={filterDateValidation}
              setFilterDate={setFilterDateValidation}
              filterFromTime={filterFromTimeValidation}
              setFilterFromTime={setFilterFromTimeValidation}
              filterToTime={filterToTimeValidation}
              setFilterToTime={setFilterToTimeValidation}
              onFilter={handleFilterValidation}
              onResetFilters={handleResetValidation}
              onViewDetails={handleViewDetails}
              page={historyValidation.page}
              setPage={historyValidation.setPage}
              totalPages={historyValidation.totalPages}
              size={historyValidation.size}
              setSize={historyValidation.setSize}
            />
          )}

          {/* Transformation - Formulaire */}
          {(activeSection === "transformation" || activeSection === "transformation-form") && (
            <TransformationSection
              painXmlInput={painXmlInput}
              setPainXmlInput={setPainXmlInput}
              mt101Output={mt101Output}
              transformationLoading={transformationLoading}
              transformationError={transformationError}
              onTransform={handleTransformation}
            />
          )}

          {/* Transformation - Historique */}
          {activeSection === "transformation-history" && (
            <TransformationHistorySection
              history={historyTransformation.history}
              historyLoading={historyTransformation.historyLoading}
              historyError={historyTransformation.historyError}
              filterDate={filterDateTransformation}
              setFilterDate={setFilterDateTransformation}
              filterFromTime={filterFromTimeTransformation}
              setFilterFromTime={setFilterFromTimeTransformation}
              filterToTime={filterToTimeTransformation}
              setFilterToTime={setFilterToTimeTransformation}
              onFilter={handleFilterTransformation}
              onResetFilters={handleResetTransformation}
              onViewDetails={handleViewDetails}
              page={historyTransformation.page}
              setPage={historyTransformation.setPage}
              totalPages={historyTransformation.totalPages}
              size={historyTransformation.size}
              setSize={historyTransformation.setSize}
            />
          )}

          {/* Historique global */}
          {activeSection === "logs" && (
            <HistorySection
              history={historyGlobal.history}
              historyLoading={historyGlobal.historyLoading}
              historyError={historyGlobal.historyError}
              filterDate={filterDateGlobal}
              setFilterDate={setFilterDateGlobal}
              filterFromTime={filterFromTimeGlobal}
              setFilterFromTime={setFilterFromTimeGlobal}
              filterToTime={filterToTimeGlobal}
              setFilterToTime={setFilterToTimeGlobal}
              onFilter={handleFilterGlobal}
              onResetFilters={handleResetGlobal}
              onViewDetails={handleViewDetails}
              page={historyGlobal.page}
              setPage={historyGlobal.setPage}
              totalPages={historyGlobal.totalPages}
              size={historyGlobal.size}
              setSize={historyGlobal.setSize}
            />
          )}
        </main>
      </div>
      <OperationModal isOpen={isModalOpen} onClose={setIsModalOpen} selectedLog={selectedLog} />
    </div>
  )
}
