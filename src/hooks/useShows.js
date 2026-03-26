import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useShows() {
  const [shows, setShows]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase
      .from("shows")
      .select("*")
      .order("created_at", { ascending: true });
    setShows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);
  return { shows, loading, refresh: fetch };
}
