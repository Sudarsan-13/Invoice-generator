"use client";
import React, { useState, useRef, useEffect } from "react";
import BillDetails from "./components/BillDetails";
import ItemList from "./components/ItemList";
import TotalAmount from "./components/TotalAmount";
import InvoicePreview from "./components/InvoicePreview";
import Script from "next/script";

const App = () => {
  const [items, setItems] = useState([]);
  const [gst, setGst] = useState(18); // default is 18 in India 
  const [showPreview, setShowPreview] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    gstin: "",
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    gstin: "",
  });
  const [invoiceInfo, setInvoiceInfo] = useState({
    number: "",
    date: new Date().toISOString().substr(0, 10),
    dueDate: "",
  });
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const printRef = useRef(null);

  // Function to handle print and PDF generation
  const handlePrint = () => {
    if (!printRef.current) {
      console.error("Print ref is not available");
      alert("The invoice preview is not ready. Please try again in a moment.");
      return;
    }

    // Adding a print-specific styles to remove headers and footers
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page {
          size: A4;
          margin: 0.5cm;
        }
        /* Hide everything except the invoice */
        body * {
          visibility: hidden;
        }
        #printable, #printable * {
          visibility: visible;
        }
        #printable {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        /* Hide any browser-specific headers/footers */
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    printRef.current.id = "printable";
    window.print();
    setTimeout(() => {
      printRef.current.id = "";
      document.head.removeChild(style);
    }, 500);
  };

  const handleAddItem = (item) => {
    setItems([...items, item]);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleUpdateItem = (index, key, value) => {
    const updatedItems = [...items];
    updatedItems[index][key] = value;
    setItems(updatedItems);
  };

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const handleUpdateCompanyInfo = (field, value) => {
    setCompanyInfo({
      ...companyInfo,
      [field]: value,
    });
  };

  const handleUpdateCustomerInfo = (field, value) => {
    setCustomerInfo({
      ...customerInfo,
      [field]: value,
    });
  };

  const handleUpdateInvoiceInfo = (field, value) => {
    setInvoiceInfo({
      ...invoiceInfo,
      [field]: value,
    });
  };

  const totalAmount = calculateTotalAmount();
  const gstAmount = totalAmount * (gst / 100);
  const totalWithGst = totalAmount + gstAmount;

  // Add global styles for print to remove headers/footers
  useEffect(() => {
    // This adds global print styles to hide headers/footers
    const globalStyle = document.createElement("style");
    globalStyle.innerHTML = `
      @media print {
      /* Hide URL, page numbers, date */
      @page {
        size: A4;
        margin: 0.5cm;
      }
      /* Hide any browser chrome */
      html {
        height: initial !important;
      }
      /* Hide header/footer */
      html::before, html::after,
      body::before, body::after {
        display: none !important;
        content: none !important;
      }
      /* Additional footer removal */
      footer, .footer, #footer {
        display: none !important;
      }
      /* Remove margin at the bottom that might create space for footer */
      body {
        margin-bottom: 0 !important;
      }
      }
    `;
    document.head.appendChild(globalStyle);

    // Cleanup
    return () => {
      document.head.removeChild(globalStyle);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Invoice Generator
        </h1>

        {!showPreview ? (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Invoice Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={invoiceInfo.number}
                    onChange={(e) =>
                      handleUpdateInvoiceInfo("number", e.target.value)
                    }
                    placeholder="INV-001"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={invoiceInfo.date}
                    onChange={(e) =>
                      handleUpdateInvoiceInfo("date", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={invoiceInfo.dueDate}
                    onChange={(e) =>
                      handleUpdateInvoiceInfo("dueDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Company Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={companyInfo.name}
                      onChange={(e) =>
                        handleUpdateCompanyInfo("name", e.target.value)
                      }
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Address
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={companyInfo.address}
                      onChange={(e) =>
                        handleUpdateCompanyInfo("address", e.target.value)
                      }
                      placeholder="Company Address"
                      rows="2"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={companyInfo.phone}
                        onChange={(e) =>
                          handleUpdateCompanyInfo("phone", e.target.value)
                        }
                        placeholder="Phone Number"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={companyInfo.email}
                        onChange={(e) =>
                          handleUpdateCompanyInfo("email", e.target.value)
                        }
                        placeholder="company@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      GSTIN
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={companyInfo.gstin}
                      onChange={(e) =>
                        handleUpdateCompanyInfo("gstin", e.target.value)
                      }
                      placeholder="GST Identification Number"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Customer Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={customerInfo.name}
                      onChange={(e) =>
                        handleUpdateCustomerInfo("name", e.target.value)
                      }
                      placeholder="Customer Name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Address
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={customerInfo.address}
                      onChange={(e) =>
                        handleUpdateCustomerInfo("address", e.target.value)
                      }
                      placeholder="Customer Address"
                      rows="2"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          handleUpdateCustomerInfo("phone", e.target.value)
                        }
                        placeholder="Phone Number"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={customerInfo.email}
                        onChange={(e) =>
                          handleUpdateCustomerInfo("email", e.target.value)
                        }
                        placeholder="customer@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      GSTIN (if applicable)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={customerInfo.gstin}
                      onChange={(e) =>
                        handleUpdateCustomerInfo("gstin", e.target.value)
                      }
                      placeholder="Customer GST Number (if applicable)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <BillDetails onAddItem={handleAddItem} />
            </div>

            {items.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <ItemList
                  items={items}
                  onDeleteItem={handleDeleteItem}
                  onUpdateItem={handleUpdateItem}
                />
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  GST Rate (%)
                </label>
                <input
                  type="number"
                  className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={gst}
                  onChange={(e) => setGst(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              <TotalAmount
                items={items}
                gst={gst}
                total={calculateTotalAmount()}
              />
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowPreview(true)}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={items.length === 0}
              >
                Preview Invoice
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 no-print">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-4"
              >
                Back to Edit
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Print / Save PDF
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
              <div ref={printRef} className="p-4">
                <InvoicePreview
                  items={items}
                  gst={gst}
                  totalAmount={totalAmount}
                  gstAmount={gstAmount}
                  totalWithGst={totalWithGst}
                  companyInfo={companyInfo}
                  customerInfo={customerInfo}
                  invoiceInfo={invoiceInfo}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
