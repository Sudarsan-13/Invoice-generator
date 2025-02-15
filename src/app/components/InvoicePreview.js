"use client";
import React from "react";

const InvoicePreview = ({
  items,
  gst,
  totalAmount,
  gstAmount,
  totalWithGst,
  companyInfo,
  customerInfo,
  invoiceInfo,
}) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {companyInfo.name || "Your Company"}
          </h1>
          <p className="text-gray-700">{companyInfo.address}</p>
          <p className="text-gray-700">Phone: {companyInfo.phone}</p>
          <p className="text-gray-700">Email: {companyInfo.email}</p>
          {companyInfo.gstin && (
            <p className="text-gray-700">GSTIN: {companyInfo.gstin}</p>
          )}
        </div>

        <div className="text-right">
          <h2 className="text-xl font-bold mb-2">INVOICE</h2>
          <p className="text-gray-700">
            Invoice #: {invoiceInfo.number || "Draft"}
          </p>
          <p className="text-gray-700">Date: {formatDate(invoiceInfo.date)}</p>
          {invoiceInfo.dueDate && (
            <p className="text-gray-700">
              Due Date: {formatDate(invoiceInfo.dueDate)}
            </p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2">Bill To:</h3>
        <p className="text-gray-700 font-medium">
          {customerInfo.name || "Customer Name"}
        </p>
        <p className="text-gray-700">{customerInfo.address}</p>
        <p className="text-gray-700">Phone: {customerInfo.phone}</p>
        <p className="text-gray-700">Email: {customerInfo.email}</p>
        {customerInfo.gstin && (
          <p className="text-gray-700">GSTIN: {customerInfo.gstin}</p>
        )}
      </div>

      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">#</th>
              <th className="border border-gray-300 p-2 text-left">
                Item Description
              </th>
              <th className="border border-gray-300 p-2 text-right">
                Quantity
              </th>
              <th className="border border-gray-300 p-2 text-right">Price</th>
              <th className="border border-gray-300 p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  {item.item}
                  {item.hsn && (
                    <span className="text-gray-500"> (HSN: {item.hsn})</span>
                  )}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {formatCurrency(item.price)}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {formatCurrency(item.quantity * item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-60">
          <div className="flex justify-between py-2">
            <span className="font-medium">Subtotal:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">GST ({gst}%):</span>
            <span>{formatCurrency(gstAmount)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-300 font-bold">
            <span>Total:</span>
            <span>{formatCurrency(totalWithGst)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
