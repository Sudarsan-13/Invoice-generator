// components/TotalAmount.js
import React from "react";

const TotalAmount = ({ items, gst, total }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">No items added yet</div>
    );
  }

  const gstAmount = total * (gst / 100);
  const grandTotal = total + gstAmount;

  return (
    <div className="flex flex-col items-end space-y-2">
      <div className="text-right">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium text-gray-700">Subtotal:</div>
          <div className="text-gray-900">₹{total.toFixed(2)}</div>

          <div className="font-medium text-gray-700">GST ({gst}%):</div>
          <div className="text-gray-900">₹{gstAmount.toFixed(2)}</div>

          <div className="font-medium text-gray-700 text-lg pt-2 border-t">
            Total:
          </div>
          <div className="text-gray-900 text-lg font-bold pt-2 border-t">
            ₹{grandTotal.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalAmount;
