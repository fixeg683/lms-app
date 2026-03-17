import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://aqeersanfmqvlyuhwyqt.supabase.co"
const supabaseAnonKey = "sb_publishable_s6-X8vMzjwnVsnI0OGu3RA_purRc0zd"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    // This extends the timeout to 30 seconds to prevent the 6000ms timeout error
    fetch: (...args) => {
      return fetch(args[0], { 
        ...args[1], 
        signal: AbortSignal.timeout(30000) 
      });
    },
  },
})