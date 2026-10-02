import { supabase } from "../lib/supabase";

function friendlyAuthError(error) {
  const code = error?.code || "";
  const message = (error?.message || "").toLowerCase();

  if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
    return "Email or password is incorrect.";
  }
  if (code === "email_exists" || message.includes("already registered")) {
    return "An account with this email already exists. Try logging in.";
  }
  if (code === "weak_password" || message.includes("password should be")) {
    return "Choose a stronger password and try again.";
  }
  if (
    code === "invalid_email"
    || message.includes("invalid email")
    || (message.includes("email") && (message.includes("invalid") || message.includes("format")))
  ) {
    return "Enter a valid email address.";
  }
  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Please confirm your email address before signing in.";
  }
  if (
    error?.name === "AuthRetryableFetchError"
    || message.includes("failed to fetch")
    || message.includes("network")
  ) {
    return "Unable to reach the authentication service. Check your connection and try again.";
  }

  return "Authentication could not be completed. Please try again.";
}

async function handleAuthRequest(request) {
  const { data, error } = await request;
  if (error) throw new Error(friendlyAuthError(error));
  return data;
}

export function signUp({ fullName, email, password }) {
  return handleAuthRequest(
    supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    })
  );
}

export function signIn({ email, password }) {
  return handleAuthRequest(
    supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
  );
}

export function signOut() {
  return handleAuthRequest(supabase.auth.signOut());
}

export function getCurrentUser() {
  return handleAuthRequest(supabase.auth.getUser());
}

export function getSession() {
  return handleAuthRequest(supabase.auth.getSession());
}
