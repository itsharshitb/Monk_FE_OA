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
    if (!result.destination) return;
    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setProducts(items);
  };

  const addProduct = () => {
    const newProduct = {
      id: `product-${products.length + 1}`,
      name: "zxxc",
      discount: "cxcx",
      variants: [], // Assuming variants are stored within the product
    };
    setProducts([...products, newProduct]);
  };

  const handleAddProducts = (selectedProducts) => {
    setProducts((prevProducts) => [...prevProducts, ...selectedProducts]);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const renderProducts = () => {
    console.log("Rendering products:", products);
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
              <div className="flex items-center p-2 ">
                <div className="mr-4">
                  <RxDragHandleDots2 />
                </div>
                <span className="mr-4">{index + 1}.</span>
                <div className="flex-1 flex items-center space-x-2 ">
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
                      className="w-full p-2 border border-none rounded-md"
                    />
                  </div>
                  <div className="w-24 shadow-md">
                    <select className="w-full p-2 border border-none rounded-md">
                      <option value="% Off">% Off</option>
                      <option value="$ Off">$ Off</option>
                    </select>
                  </div>
                </div>
                <button className="ml-2 p-2">
                  <span>×</span>
                </button>
              </div>
              {product.variants && product.variants.length > 0 && (
                <div className="ml-8 mt-2">
                  {product.variants.map((variant, variantIndex) => (
                    <div
                      key={variant.id}
                      className="flex items-center p-2  mt-1"
                    >
                      <div className="mr-4">
                        <RxDragHandleDots2 />
                      </div>
                      <div className="mr-4"></div>
                      <span className="mr-4">{variantIndex + 1}.</span>
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
                            className="w-full p-2 border border-none rounded-full"
                          />
                        </div>
                        <div className="w-24 shadow-md rounded-full">
                          <select className="w-full p-2 border border-none rounded-full">
                            <option value="% Off">% Off</option>
                            <option value="$ Off">$ Off</option>
                          </select>
                        </div>
                      </div>
                      {/* <button className="ml-2 p-2">
                        <FaPencilAlt />
                      </button> */}
                      <button className="ml-2 p-2">
                        <span>×</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {product.variants && product.variants.length > 0 && (
                <button className="text-blue-500 ml-8 mt-1">
                  {product.showVariants ? "Hide variants ▲" : "Show variants ▼"}
                </button>
              )}
            </div>
          )}
        </Draggable>
      ));
    } else {
      return (
        <div>
          <div className="flex items-center mb-2 p-2 " onClick={openModal}>
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
    <div className="p-20 bg-gray-100 h-screen">
      <div className="flex items-center pt-10 flex-col">
        <div className="w-[35vw]">
          <h2 className="p-2 font-semibold text-xl">Add Products</h2>
          <div className="flex items-center mb-2 p-2 font-semibold text-xl">
            <div className="w-full p-2 mr-1">
              <span className="mr-4 flex-1">Product</span>
            </div>
            <span className="float-right p-2">Discount</span>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="products" type="group">
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
