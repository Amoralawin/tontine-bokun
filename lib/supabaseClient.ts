import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yewrxkmpbidqnfdzztag.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlld3J4a21wYmlkcW5mZHp6dGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NTU1NzUsImV4cCI6MjEwMjIzMTU3NX0.9yQ5La2AwwEj-SDPuj4kAzVIe2o9BJBo7EF0DQK7-tc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

