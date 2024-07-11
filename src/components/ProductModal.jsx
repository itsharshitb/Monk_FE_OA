import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";

const ProductModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const url = import.meta.env.VITE_BASE_URL;
  const apiAuth = import.meta.env.VITE_API_KEY;

  const [SearchQuery, setSearchQuery] = useState("");

  const getResults = async (query) => {
    const params = {
      search: query,
      page: 2,
      limit: 1,
    };
    const headers = {
      "x-api-key": apiAuth,
    };
    const baseUrl = "/api/task/products/search"; // Note the change here
    try {
      const result = await axios.get(baseUrl, { params, headers });
      console.log("Response:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(SearchQuery);
      getResults(SearchQuery);
    }, 1000);

    return () => clearTimeout(timer);
  }, [SearchQuery]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow-md w-[50vw]">
        <div className="flex p-3 justify-between">
          <h2 className="text-xl font-semibold">Select Product</h2>
          <IoMdClose onClick={onClose} className="cursor-pointer" />
        </div>
        <hr className="my-4 border-t border-gray-300 w-full" />
        <div className="relative mb-4 w-full">
          <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={SearchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 pl-10 w-full border border-gray-300 rounded-md"
            placeholder="Search Product"
          />
        </div>
        <hr className="my-4 border-t border-gray-300 w-full" />
      </div>
    </div>
  );
};

export default ProductModal;
