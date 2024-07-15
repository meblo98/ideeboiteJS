import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://fvrkvuywsynlikryseil.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2cmt2dXl3c3lubGlrcnlzZWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwNjAyNjYsImV4cCI6MjAzNjYzNjI2Nn0.BRa3yAKTxOiMps2qZRwc1LYvjGmW3cFJXbHQe6zP56M";
export const supabase = createClient(supabaseUrl, supabaseKey);
