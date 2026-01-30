import { Database, TablesInsert } from "@jobtv-app/shared/types";

export type EventReservation =
  Database["public"]["Tables"]["event_reservations"]["Row"];

type EventReservationInsert = TablesInsert<"event_reservations">;
export type EventReservationFormData = Omit<
  EventReservationInsert,
  "id" | "created_at" | "updated_at"
>;
