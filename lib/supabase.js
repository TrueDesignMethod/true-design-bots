// lib/supabase.js

import { createClient }
  from "@supabase/supabase-js";


// --------------------------------------------------
// Environment Variables
// --------------------------------------------------

const SUPABASE_URL =
  process.env.SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;


// --------------------------------------------------
// Server Client
// --------------------------------------------------

export const supabase =
  createClient(

    SUPABASE_URL,

    SUPABASE_SERVICE_ROLE_KEY
  );
