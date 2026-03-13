import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://aqeersanfmqvlyuhwyqt.supabase.co"
const supabaseAnonKey = "sb_publishable_s6-X8vMzjwnVsnI0OGu3RA_purRc0zd"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)