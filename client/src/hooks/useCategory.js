import axios from "axios";
import { useEffect, useState } from "react";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  // Fetch categories
  const getCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      // console.log("data", data);
      // console.log("data.category", data.categories);
      setCategories(data.categories); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]); // Set empty array on error
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return categories; // ✅ Return the categories array instead of the function
}
