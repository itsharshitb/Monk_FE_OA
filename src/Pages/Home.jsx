import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HOME_BACKGROUND } from "../constants/Constants";
import { FaPencilAlt } from "react-icons/fa";

const initialProducts = [];

const Home = () => {
  const [products, setProducts] = useState(initialProducts);

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
      name: "",
      discount: "",
    };
    setProducts([...products, newProduct]);
  };

  const renderProducts = () => {
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
              <input
                type="text"
                value={product.name}
                readOnly
                className="mr-4 flex-1"
              />
              <input
                type="number"
                value={product.discount}
                readOnly
                className="w-20 mr-4"
              />
              <select>
                <option value="% Off">% Off</option>
                <option value="$ Off">$ Off</option>
              </select>
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
    <div className={`p-20 bg-gray-100 h-screen`}>
      <div className="flex items-center pt-20 flex-col">
        <div className="w-[35vw]">
          <h2 className="p-2 font-semibold text-xl">Add Products</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="products">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <div className="flex items-center mb-2 p-2 font-semibold text-xl">
                    <div className="w-full p-2 mr-1">
                      <span className="mr-4 flex-1">Product</span>
                    </div>
                    <span className="float-right p-2 ">Discount</span>
                  </div>
                  {renderProducts()}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button
            className="float-right border border-green-700 p-2 rounded-md text-green-700"
            onClick={addProduct}
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
