"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";

type Booking = {
  id: string;
  date: string;
  status: string;
  notes?: string;
  user: { name?: string; email: string; phone?: string };
  service: { name: string };
};

type PaginatedBookings = {
  items: Booking[];
  total: number;
  page: number;
  limit: number;
};

type Status = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

const COLUMNS: {
  id: Status;
  label: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
  icon: string;
}[] = [
  {
    id: "PENDING",
    label: "En attente",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/20",
    icon: "⏳",
  },
  {
    id: "CONFIRMED",
    label: "Confirmé",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/20",
    icon: "✅",
  },
  {
    id: "COMPLETED",
    label: "Terminé",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    icon: "🏁",
  },
  {
    id: "CANCELLED",
    label: "Annulé",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    glow: "shadow-red-500/20",
    icon: "❌",
  },
];

function BookingCard({
  booking,
  onDelete,
  isDragging = false,
}: {
  booking: Booking;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}) {
  const col = COLUMNS.find((c) => c.id === booking.status)!;
  const dateStr = new Date(booking.date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`
        relative rounded-xl border p-4 transition-all duration-200 group cursor-grab active:cursor-grabbing
        bg-carbon-200/80 backdrop-blur-sm
        ${col.border}
        ${isDragging ? "opacity-50 scale-95" : "hover:border-opacity-60 hover:shadow-lg hover:" + col.glow}
      `}
    >
      {/* Status dot */}
      <div
        className={`absolute top-3 right-3 w-2 h-2 rounded-full ${col.color.replace("text-", "bg-")} shadow-sm`}
      />

      <div className="flex flex-col gap-2">
        {/* Client */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-carbon-100 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
            {(booking.user.name || booking.user.email).charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate">
              {booking.user.name || booking.user.email}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {booking.user.email}
            </p>
          </div>
        </div>

        {/* Service */}
        <div
          className={`text-xs font-medium px-2 py-1 rounded-md w-fit ${col.bg} ${col.color}`}
        >
          {booking.service.name}
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <svg
            className="w-3 h-3 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {dateStr}
        </div>

        {/* Notes */}
        {booking.notes && (
          <p className="text-xs text-gray-500 italic line-clamp-2 border-t border-white/5 pt-2">
            💬 {booking.notes}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-white/5 pt-2 mt-1">
          <a
            href={`/api/admin/bookings/${booking.id}/invoice`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-center text-xs py-1.5 rounded-lg bg-primary-600/80 hover:bg-primary-500 text-white transition-colors font-medium"
          >
            📄 PDF
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(booking.id);
            }}
            className="flex-1 text-center text-xs py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 transition-colors font-medium border border-red-500/20"
          >
            🗑️ Suppr.
          </button>
        </div>
      </div>
    </div>
  );
}

function SortableBookingCard({
  booking,
  onDelete,
}: {
  booking: Booking;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: booking.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BookingCard
        booking={booking}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}

function KanbanColumn({
  col,
  bookings,
  onDelete,
}: {
  col: (typeof COLUMNS)[0];
  bookings: Booking[];
  onDelete: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <div
      className={`flex flex-col rounded-2xl border transition-all duration-200 min-h-[80px]
        ${isOver ? `${col.border} ${col.bg} shadow-xl` : "border-white/5 bg-carbon-200/30"}
      `}
    >
      {/* Column header */}
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-t-2xl border-b ${col.border}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{col.icon}</span>
          <span
            className={`font-bold text-sm uppercase tracking-wider ${col.color}`}
          >
            {col.label}
          </span>
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bg} ${col.color} border ${col.border}`}
        >
          {bookings.length}
        </span>
      </div>

      {/* Cards drop area */}
      <div ref={setNodeRef} className="flex flex-col gap-3 p-3 flex-1">
        <SortableContext
          items={bookings.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <SortableBookingCard booking={booking} onDelete={onDelete} />
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>

        {bookings.length === 0 && (
          <div
            className={`flex items-center justify-center rounded-xl border-2 border-dashed transition-colors duration-200
            ${isOver ? `${col.border} ${col.bg}` : "border-white/10"} min-h-[80px]`}
          >
            <p
              className={`text-xs transition-colors ${isOver ? col.color : "text-gray-500"}`}
            >
              {isOver ? "⬇️ Déposer ici" : "Aucune réservation"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [health, setHealth] = useState<string | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings?page=1&limit=100`);
      const data: PaginatedBookings = await res.json();
      setBookings(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      showToast("❌ " + (body?.error || "Erreur"));
      await loadBookings();
    } else {
      showToast("✅ Statut mis à jour — email envoyé au client");
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Supprimer cette réservation ?")) return;
    const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      showToast("❌ Erreur lors de la suppression");
    } else {
      showToast("🗑️ Réservation supprimée");
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const exportBookings = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/admin/bookings/export");
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "bookings-export.csv";
      link.click();
      URL.revokeObjectURL(url);
      showToast("✅ CSV exporté");
    } catch {
      showToast("❌ Échec de l'export");
    } finally {
      setIsExporting(false);
    }
  };

  const backupData = async () => {
    setBackupLoading(true);
    try {
      const res = await fetch("/api/admin/backup");
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `backup-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showToast("✅ Backup téléchargé");
    } catch {
      showToast("❌ Backup échoué");
    } finally {
      setBackupLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(JSON.stringify(data, null, 2));
    } catch (error) {
      setHealth(`Error: ${String(error)}`);
    }
  };

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const booking = bookings.find((b) => b.id === event.active.id);
    if (booking) setActiveBooking(booking);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? String(over.id) : null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveBooking(null);
    setOverId(null);

    if (!over) return;

    const draggedId = String(active.id);
    const targetId = String(over.id);

    // Check if dropped on a column header
    const targetColumn = COLUMNS.find((c) => c.id === targetId);
    if (targetColumn) {
      const booking = bookings.find((b) => b.id === draggedId);
      if (booking && booking.status !== targetColumn.id) {
        // Optimistic update
        setBookings((prev) =>
          prev.map((b) =>
            b.id === draggedId ? { ...b, status: targetColumn.id } : b,
          ),
        );
        await updateStatus(draggedId, targetColumn.id);
      }
      return;
    }

    // Dropped on another card — find its column
    const targetBooking = bookings.find((b) => b.id === targetId);
    if (targetBooking) {
      const draggedBooking = bookings.find((b) => b.id === draggedId);
      if (draggedBooking && draggedBooking.status !== targetBooking.status) {
        // Optimistic update
        setBookings((prev) =>
          prev.map((b) =>
            b.id === draggedId ? { ...b, status: targetBooking.status } : b,
          ),
        );
        await updateStatus(draggedId, targetBooking.status);
      }
    }
  };

  const byStatus = (status: Status) =>
    bookings.filter((b) => b.status === status);

  return (
    <div className="min-h-screen">
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-6 left-1/2 z-50 bg-carbon-100 border border-white/10 text-white text-sm px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Gestion des réservations
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            <span className="text-primary-400 font-semibold">{total}</span>{" "}
            réservations au total — glissez pour changer le statut
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={checkHealth}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-carbon-200 hover:bg-carbon-100 border border-white/5 text-gray-300 transition-colors"
          >
            🩺 Santé
          </button>
          <button
            onClick={backupData}
            disabled={backupLoading}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-carbon-200 hover:bg-carbon-100 border border-white/5 text-gray-300 transition-colors disabled:opacity-50"
          >
            💾 {backupLoading ? "Sauvegarde..." : "Backup DB"}
          </button>
          <button
            onClick={exportBookings}
            disabled={isExporting}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-primary-600/80 hover:bg-primary-500 border border-primary-500/30 text-white transition-colors disabled:opacity-50 font-medium"
          >
            📊 {isExporting ? "Export..." : "Exporter CSV"}
          </button>
          <button
            onClick={loadBookings}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-carbon-200 hover:bg-carbon-100 border border-white/5 text-gray-300 transition-colors"
          >
            🔄 Actualiser
          </button>
        </div>
      </div>

      {/* Health panel */}
      {health && (
        <motion.pre
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 p-4 bg-carbon-200/50 rounded-xl border border-white/5 text-xs text-gray-300 overflow-x-auto font-mono"
        >
          {health}
        </motion.pre>
      )}

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
            <p className="text-sm text-gray-400">Chargement...</p>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                col={col}
                bookings={byStatus(col.id)}
                onDelete={deleteBooking}
              />
            ))}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeBooking ? (
              <div className="rotate-2 scale-105 opacity-95 shadow-2xl">
                <BookingCard booking={activeBooking} onDelete={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Legend */}
      <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="text-base">✋</span> Glisser une carte pour changer
          le statut
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-base">📧</span> Email automatique envoyé au
          client à chaque changement
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-base">📱</span> SMS si le client a un numéro
        </span>
      </div>
    </div>
  );
}
