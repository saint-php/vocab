



import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hzaechignnqepiwsteft.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6YWVjaGlnbm5xZXBpd3N0ZWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTg5ODMsImV4cCI6MjA5Mzk5NDk4M30.saSTQjohjVAWJN7Cu7aa7Bw6nt1PHs-NiVdm_rU-egs'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,        // Save session in storage
    autoRefreshToken: true,      // Refresh before expiry
    detectSessionInUrl: true,
  },
})