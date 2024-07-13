import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaPencilAlt } from "react-icons/fa";
import ProductModal from "../components/ProductModal";
import { RxDragHandleDots2 } from "react-icons/rx";

const initialProducts = [];

const Home = () => {
  const [products, setProducts] = useState(initialProducts);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDragEnd = (result) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    if (type === "product") {
      const newProducts = Array.from(products);
      const [reorderedItem] = newProducts.splice(source.index, 1);
      newProducts.splice(destination.index, 0, reorderedItem);
      setProducts(newProducts);
    } else if (type === "variant") {
      const productIndex = products.findIndex(
        (p) => p.id === source.droppableId
      );
      const newProducts = [...products];
      const newVariants = Array.from(newProducts[productIndex].variants);
      const [reorderedVariant] = newVariants.splice(source.index, 1);
      newVariants.splice(destination.index, 0, reorderedVariant);
      newProducts[productIndex].variants = newVariants;
      setProducts(newProducts);
    }
  };

  const handleAddProducts = (selectedProducts) => {
    const productsWithShowVariants = selectedProducts.map((product) => ({
      ...product,
      showVariants: true,
    }));
    setProducts((prevProducts) => [
      ...prevProducts,
      ...productsWithShowVariants,
    ]);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const toggleVariantsVisibility = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, showVariants: !product.showVariants }
          : product
      )
    );
  };

  const handleDeleteVariant = (productId, variantId) => {
    setProducts(
      products.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            variants: product.variants.filter(
              (variant) => variant.id !== variantId
            ),
          };
        }
        return product;
      })
    );
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  const handleUpdateVariant = (productId, variantId, updatedVariant) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              variants: product.variants.map((variant) =>
                variant.id === variantId ? updatedVariant : variant
              ),
            }
          : product
      )
    );
  };

  const handleUpdateProduct = (productId, updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? updatedProduct : product
      )
    );
  };

  const renderProducts = () => {
    if (products.length > 0) {
      return products.map((product, index) => (
        <Draggable
          key={product.id}
          draggableId={String(product.id)}
          index={index}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="draggable-item mb-2"
            >
              <div className="flex items-center p-2">
                <div className="mr-4">
                  <RxDragHandleDots2 />
                </div>
                <span className="mr-4">{index + 1}.</span>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex flex-grow bg-white rounded-md shadow-md">
                    <input
                      type="text"
                      value={product.name}
                      className="w-full p-2 border-none rounded-md"
                      readOnly
                    />
                    <button className="ml-2 p-2">
                      <FaPencilAlt />
                    </button>
                  </div>
                  <div className="w-20 shadow-md">
                    <input
                      type="text"
                      value={product.discount}
                      onChange={(e) =>
                        handleUpdateProduct(product.id, {
                          ...product,
                          discount: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-none rounded-md"
                    />
                  </div>
                  <div className="w-24 shadow-md">
                    <select
                      value={product.discountType}
                      onChange={(e) =>
                        handleUpdateProduct(product.id, {
                          ...product,
                          discountType: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-none rounded-md"
                    >
                      <option value="% Off">% Off</option>
                      <option value="$ Off">$ Off</option>
                    </select>
                  </div>
                  <button
                    className="ml-2 p-2"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <span>×</span>
                  </button>
                </div>
              </div>
              {product?.variants && product.variants.length > 0 && (
                <div className="flex justify-end">
                  <button
                    className="text-blue-500 mr-2 text-sm"
                    onClick={() => toggleVariantsVisibility(product.id)}
                  >
                    {product.showVariants
                      ? "Hide variants ▲"
                      : "Show variants ▼"}
                  </button>
                </div>
              )}
              {product?.variants &&
                product?.variants.length > 0 &&
                product?.showVariants && (
                  <Droppable droppableId={String(product.id)} type="variant">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="ml-8 mt-2"
                      >
                        {product.variants.map((variant, variantIndex) => (
                          <Draggable
                            key={variant.id}
                            draggableId={String(variant.id)}
                            index={variantIndex}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex items-center p-2 mt-1"
                              >
                                <div className="mr-4">
                                  <RxDragHandleDots2 />
                                </div>
                                <div className="mr-4"></div>
                                <span className="mr-4">
                                  {variantIndex + 1}.
                                </span>
                                <div className="flex-1 flex items-center space-x-2">
                                  <div className="flex-grow shadow-md rounded-full">
                                    <input
                                      type="text"
                                      value={variant.name}
                                      className="w-full p-2 border rounded-full border-none"
                                      readOnly
                                    />
                                  </div>
                                  <div className="w-20 shadow-md rounded-full">
                                    <input
                                      type="text"
                                      value={variant.discount}
                                      onChange={(e) =>
                                        handleUpdateVariant(
                                          product.id,
                                          variant.id,
                                          {
                                            ...variant,
                                            discount: e.target.value,
                                          }
                                        )
                                      }
                                      className="w-full p-2 border border-none rounded-full"
                                    />
                                  </div>
                                  <div className="w-24 shadow-md rounded-full">
                                    <select
                                      value={variant.discountType}
                                      onChange={(e) =>
                                        handleUpdateVariant(
                                          product.id,
                                          variant.id,
                                          {
                                            ...variant,
                                            discountType: e.target.value,
                                          }
                                        )
                                      }
                                      className="w-full p-2 border border-none rounded-full"
                                    >
                                      <option value="% Off">% Off</option>
                                      <option value="$ Off">$ Off</option>
                                    </select>
                                  </div>
                                  <button
                                    className="ml-2 p-2"
                                    onClick={() =>
                                      handleDeleteVariant(
                                        product.id,
                                        variant.id
                                      )
                                    }
                                  >
                                    <span>×</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}
            </div>
          )}
        </Draggable>
      ));
    } else {
      return (
        <div>
          <div className="flex items-center mb-2 p-2" onClick={openModal}>
            1.&nbsp;
            <div className="w-full p-2 mr-1 bg-white relative rounded-md shadow-md">
              <span
                className="mr-4 text-gray-400 flex-1 text-xl"
                placeholder="Product"
              >
                Product
              </span>
              <FaPencilAlt className="absolute right-2 top-3" />
            </div>
            <button className="float-right border border-green-700 bg-green-700 p-2 rounded-md text-white">
              Add&nbsp;Discount
            </button>
          </div>
          <ProductModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onAddProducts={handleAddProducts}
          />
        </div>
      );
    }
  };

  return (
    <div className="p-10 bg-gray-100 h-screen">
      <div className="flex items-center pt-5 flex-col">
        <div className="w-[35vw]">
          <h2 className="p-2 font-semibold text-xl">Add Products</h2>
          <div className="flex items-center mb-2 p-2 font-semibold text-xl">
            <div className="w-full p-2 mr-1">
              <span className="mr-4 flex-1">Product</span>
            </div>
            <span className="float-right p-2">Discount</span>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="products" type="product">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {renderProducts()}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button
            className="float-right border border-green-700 p-2 rounded-md text-green-700"
            onClick={() => setIsModalVisible(true)}
          >
            Add Product
          </button>
        </div>
      </div>
      <ProductModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddProducts={handleAddProducts}
      />
    </div>
  );
};

export default Home;
