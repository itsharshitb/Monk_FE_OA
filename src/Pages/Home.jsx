import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaPencilAlt } from "react-icons/fa";
import ProductModal from "../components/ProductModal";

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
    };
    setProducts([...products, newProduct]);
  };

  const renderProducts = () => {
    console.log("Rendering products:", products);
    if (products.length > 0) {
      return products.map((product, index) => (
        <Draggable key={product.id} draggableId={product.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="flex items-center mb-2 p-2 border border-gray-300 rounded-sm bg-white"
            >
              <span className="mr-4">{index + 1}.</span>
              <span className="mr-4 flex-1">{product.name}</span>
              <span className="mr-4 flex-1">{product.discount}</span>
              <select>
                <option value="% Off">% Off</option>
                <option value="$ Off">$ Off</option>
              </select>
              <div>
                <FaPencilAlt />
              </div>
            </div>
          )}
        </Draggable>
      ));
    } else {
      return (
        <div>
          <div className="flex items-center mb-2 p-2 ">
            1.&nbsp;
            <div className="w-full p-2 mr-1 bg-white relative rounded-md shadow-md">
              <span
                className="mr-4 text-gray-400 flex-1 pl-8 text-xl"
                placeholder="Product"
              >
                Product
              </span>
              <FaPencilAlt className="absolute right-2 top-2" />
            </div>
            <button className="float-right border border-green-700 bg-green-700 p-2 rounded-md text-white">
              Add&nbsp;Discount
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-20 bg-gray-100 h-screen">
      <div className="flex items-center pt-20 flex-col">
        <div className="w-[35vw]">
          <h2 className="p-2 font-semibold text-xl">Add Products</h2>
          <div className="flex items-center mb-2 p-2 font-semibold text-xl">
            <div className="w-full p-2 mr-1">
              <span className="mr-4 flex-1">Product</span>
            </div>
            <span className="float-right p-2">Discount</span>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            {console.log("Droppable ID: products")}
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
      />
    </div>
  );
};

export default Home;
