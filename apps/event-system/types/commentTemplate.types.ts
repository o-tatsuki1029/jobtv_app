import { Database, TablesInsert } from "@/types/database.types";

export type CommentTemplate = Database["public"]["Tables"]["comment_templates"]["Row"];

type CommentTemplateInsert = TablesInsert<"comment_templates">;
export type CommentTemplateFormData = Omit<
  CommentTemplateInsert,
  "id" | "created_at" | "updated_at"
>;

