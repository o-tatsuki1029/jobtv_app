import { Database, TablesInsert } from "@jobtv-app/shared/types";

export type Company = Database["public"]["Tables"]["companies"]["Row"];

type CompanyInsert = TablesInsert<"companies">;
export type CompanyFormData = Omit<
  CompanyInsert,
  "id" | "created_at" | "updated_at"
>;
