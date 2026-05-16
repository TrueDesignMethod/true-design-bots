// public/supabase.js
// TRUE AI — Supabase Client

import { createClient }
  from "https://esm.sh/@supabase/supabase-js@2";


// --------------------------------------------------
// Environment
// --------------------------------------------------

const SUPABASE_URL =
  "YOUR_SUPABASE_URL";

const SUPABASE_ANON_KEY =
  "YOUR_SUPABASE_ANON_KEY";


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
