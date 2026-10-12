import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { supabase } from "../supabaseClient";

const ProtectedAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-bg text-Typography-secondary text-sm">
        Checking session...
      </div>
    );
  }

  return session ? <Navigate to="/home" replace /> : <Outlet />;
};

export default ProtectedAuth;
