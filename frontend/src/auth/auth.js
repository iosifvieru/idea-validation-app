import { supabase } from "./supabaseClient";

export function register(email, password) {
  return supabase.auth.signUp({ email, password });
}

export function login(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export function logout() {
  return supabase.auth.signOut();
}

export function getSession() {
  return supabase.auth.getSession();
}