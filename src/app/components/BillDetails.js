// components/BillDetails.js
import React, { useState } from "react";

const BillDetails = ({ onAddItem }) => {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [hsn, setHsn] = useState(""); // HSN code for GST

  const handleAddItem = () => {
    if (!item.trim()) {
      setErrorMessage("Please enter an item name.");
      return;
    }

    const newItem = {
      item,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      hsn,
    };

    onAddItem(newItem);
    setItem("");
    setQuantity(1);
    setPrice(0);
    setHsn("");
    setErrorMessage("");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Item Name
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Item name"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            HSN/SAC Code
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            value={hsn}
            onChange={(e) => setHsn(e.target.value)}
            placeholder="HSN code (optional)"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Quantity
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min={1}
            placeholder="Quantity"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Price
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
            step="0.01"
            placeholder="Unit price"
          />
        </div>
        <div>
          <button
            className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={handleAddItem}
          >
            Add Item
          </button>
        </div>
      </div>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default BillDetails;
