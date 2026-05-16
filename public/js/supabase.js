// public/supabase.js
// TRUE AI — Supabase Client

import { createClient }
  from "https://esm.sh/@supabase/supabase-js@2";


// --------------------------------------------------
// Environment
// --------------------------------------------------

const SUPABASE_URL =
  "https://qtudeevnhyauhcrixbox.supabase.co/rest/v1/";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dWRlZXZuaHlhdWhjcml4Ym94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDM0NDksImV4cCI6MjA5NDUxOTQ0OX0.JCgysocQdbfsYtLbVPj0dxjEuo3OGErn65-lWDEv6Tw
";


// --------------------------------------------------
// Client
// --------------------------------------------------

export const supabase =
  createClient(

    SUPABASE_URL,

    SUPABASE_ANON_KEY,

    {

      auth: {

        persistSession: true,

        autoRefreshToken: true,

        detectSessionInUrl: true
      }
    }
  );
