import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useVideos() {
  const [videos, setVideos]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });
    setVideos(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);
  return { videos, loading, refresh: fetch };
}
