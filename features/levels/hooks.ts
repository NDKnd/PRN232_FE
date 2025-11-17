import { useState, useEffect } from "react";
import { levelApi } from "./api";
import { useToast } from "@/hooks/use-toast";
import type { Level } from "./types";

export const useLevels = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLevels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await levelApi.getAll();
      if (response.success && response.data) {
        // Sort by order
        const sortedLevels = [...response.data].sort((a, b) => a.order - b.order);
        setLevels(sortedLevels);
      } else {
        throw new Error(response.error?.message || "Failed to fetch levels");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch levels";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  return {
    levels,
    isLoading,
    error,
    refetch: fetchLevels,
  };
};

export const useLevel = (id: number | null) => {
  const [level, setLevel] = useState<Level | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) {
      setLevel(null);
      return;
    }

    const fetchLevel = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await levelApi.getById(id);
        if (response.success && response.data) {
          setLevel(response.data);
        } else {
          throw new Error(response.error?.message || "Failed to fetch level");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch level";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevel();
  }, [id, toast]);

  return {
    level,
    isLoading,
    error,
  };
};
