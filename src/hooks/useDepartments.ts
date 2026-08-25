import { useCallback, useState, useEffect } from "react";
import { getDepartments } from "../services/departments/departments";
import type { Department } from "../types/domain";

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDepartments();
      if (response.error) {
        setError(response.error);
      } else {
        setDepartments(response.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments,
    loading,
    error,
    refresh: fetchDepartments,
  };
}