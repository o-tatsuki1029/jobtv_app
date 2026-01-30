import { Database, TablesInsert } from "@/types/database.types";

export type EventReservation = Database["public"]["Tables"]["event_reservations"]["Row"];

type EventReservationInsert = TablesInsert<"event_reservations">;
export type EventReservationFormData = Omit<EventReservationInsert, "id" | "created_at" | "updated_at">;

