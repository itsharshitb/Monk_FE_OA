import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import "../App.css";

const ProductModal = ({
  isVisible,
  onClose,
  onAddProducts,
  selectedProducts = [],
}) => {
  if (!isVisible) return null;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [internalSelectedProducts, setInternalSelectedProducts] =
    useState(selectedProducts);

  const url = import.meta.env.VITE_BASE_URL;
  const apiAuth = import.meta.env.VITE_API_KEY;

  const [searchQuery, setSearchQuery] = useState("");

  const getResults = async (query) => {
    setLoading(true);
    const params = {
      search: query,
      page: 2,
      limit: 10,
    };
    const headers = {
      "x-api-key": apiAuth,
    };
    const baseUrl = "http://stageapi.monkcommerce.app/task/products/search";
    try {
      const result = await axios.get(baseUrl, { params, headers });
      if (result.status === 200) {
        setResults(result.data);
      } else {
        console.log("Error while fetching API");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      const timer = setTimeout(() => {
        getResults(searchQuery);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const handleProductSelect = (product) => {
    setInternalSelectedProducts((prevSelectedProducts) => {
      let updatedSelectedProducts = [...prevSelectedProducts];
      const isProductSelected = updatedSelectedProducts.some(
        (p) => p.id === product.id
      );

      // Toggle selection for the product
      if (isProductSelected) {
        updatedSelectedProducts = updatedSelectedProducts.filter(
          (p) => p.id !== product.id
        );
      } else {
        updatedSelectedProducts.push(product);
        // Automatically select all variants
        if (product.variants) {
          product.variants.forEach((variant) => {
            updatedSelectedProducts.push(variant);
          });
        }
      }

      return updatedSelectedProducts;
    });
  };

  // const handleAddProducts = () => {
  //   const structuredProducts = internalSelectedProducts.map((product) => {
  //     return {
  //       id: product.id,
  //       name: product.title,
  //       discount: "0%",
  //       variants: product.variants
  //         ? product.variants.map((variant) => ({
  //             id: variant.id,
  //             name: variant.title,
  //             discount: "0%",
  //           }))
  //         : [],
  //     };
  //   });

  //   onAddProducts(structuredProducts);
  //   onClose();
  // };
  const handleAddProducts = () => {
    const productMap = new Map();

    internalSelectedProducts.forEach((item) => {
      if (!item.product_id) {
        // This is a main product
        if (!productMap.has(item.id)) {
          productMap.set(item.id, {
            id: item.id,
            name: item.title,
            discount: "0",
            variants: [],
          });
        }
      } else {
        // This is a variant
        const mainProductId = item.product_id;
        if (!productMap.has(mainProductId)) {
          // If the main product wasn't selected, we don't add the variant
          return;
        }
        const mainProduct = productMap.get(mainProductId);
        mainProduct.variants.push({
          id: item.id,
          name: item.title,
          discount: "0",
        });
      }
    });

    const structuredProducts = Array.from(productMap.values());

    onAddProducts(structuredProducts);
    onClose();
  };

  const isChecked = (product) => {
    return internalSelectedProducts.some(
      (selectedProduct) => selectedProduct.id === product.id
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow-md w-[50vw] h-[95vh]">
        <div>
          <div className="flex p-2 justify-between">
            <h2 className="text-xl font-semibold">Select Product</h2>
            <IoMdClose onClick={onClose} className="cursor-pointer" />
          </div>
          <hr className="my-4 border-t border-gray-300 w-full" />
          <div className="relative mb-4 w-full p-2">
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-3 pl-10 w-full border border-gray-300 rounded-md shadow-md"
              placeholder="Search Product"
            />
          </div>
          <hr className="border-t border-gray-300 w-full" />
          <div className="overflow-y-auto h-[60vh]">
            {loading && (
              <div className="flex items-center justify-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            {!loading && results === null && (
              <div className="p-4 flex justify-center items-center">
                No Product found
              </div>
            )}
            <ul>
              {!loading &&
                results?.map((product, index) => (
                  <div
                    key={index}
                    className="p-4 border-b border-gray-200 font-semibold"
                  >
                    <li className="p-2">
                      <div className="flex justify-start items-center pb-4">
                        <div className="p-2">
                          <input
                            type="checkbox"
                            className="custom-checkbox w-5 h-5"
                            checked={isChecked(product)}
                            onChange={() => handleProductSelect(product)}
                          />
                        </div>
                        <div className="p-2">
                          <img
                            className="w-14 h-14"
                            src={product?.image?.src}
                            alt="Product Image"
                          />
                        </div>
                        <div className="p-2">{product?.title}</div>
                      </div>
                      <div className="">
                        {product?.variants && (
                          <div>
                            {product?.variants?.map((item, variantIndex) => (
                              <div
                                className="ml-4 px-20 flex justify-between"
                                key={variantIndex}
                              >
                                <div className="p-2 flex items-center">
                                  <input
                                    type="checkbox"
                                    className="custom-checkbox w-5 h-5"
                                    checked={isChecked(item)}
                                    onChange={() => handleProductSelect(item)}
                                  />
                                  <span className="p-2">{item.title}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="p-2">
                                    available{" "}
                                    {item?.inventory_quantity !== undefined
                                      ? item?.inventory_quantity
                                      : 0}
                                  </span>
                                  <span className="p-2">{item?.price}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  </div>
                ))}
            </ul>
          </div>
          <div className="p-4 flex items-center font-semibold justify-between">
            <div>
              {internalSelectedProducts.reduce((count, product) => {
                if (!product.variants) return count + 1;
                return count;
              }, 0)}{" "}
              product selected
            </div>
            <div className="flex">
              <button
                className="px-4 m-1 text-gray-600 border rounded-md border-gray-600 py-1"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 m-1 text-white border rounded-md border-green-700 bg-green-700 py-1"
                onClick={handleAddProducts}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
