// Server and client exports are separated to avoid importing server code in client components
// Import directly from "./server" or "./client" instead of from this index file

export { createClient as createServerClient } from "./server";
export { createClient as createBrowserClient } from "./client";
export { createAdminClient, getAdminClient } from "./admin";
