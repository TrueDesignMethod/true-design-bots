import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://www.truedesign.io/",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkbXFicWp0dnRudHRqdGd5dWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNjU5NjUsImV4cCI6MjA4MDY0MTk2NX0.GGk_1NAqJff1eLXaBR9lRvlNU4yEg-BcHTU9SQWMzRs"
);
