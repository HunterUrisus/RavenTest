"use strict";
import { useCallback, useState } from "react";
import { getItemsByTestId } from "../services/item.service.js";

export const useGetItems = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const fetchItems = useCallback(async (idTest) => {
    try {
      const items = await getItemsByTestId(idTest);
      setItems(items);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching items at fetchItems():", error);
    }
  }, []);
  return { items, setItems, fetchItems, error };
};

export default useGetItems;
