import type { Database, TablesInsert } from "@/types/database.types";

export type Event = Database["public"]["Tables"]["events"]["Row"];

type EventInsert = TablesInsert<"events">;
export type EventFormData = Omit<EventInsert, "id" | "created_at" | "updated_at">;

// master_event_typesを含むEvent型（JOINクエリの結果用）
export type EventWithMasterEventType = Event & {
  master_event_types: Database["public"]["Tables"]["master_event_types"]["Row"] | null;
};
