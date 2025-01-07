import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faList, faPen } from "@fortawesome/free-solid-svg-icons";

const TransactionDetails = () => {
  const [headerData, setHeaderData] = useState({
    BRANCHCODE: "",
    FGRR_NO: "",
    FGRR_DATE: "",
    PAYEE_CODE: "",
    PAYEE_NAME: "",
    DEL_RCT_NO: "",
    CURR_CODE: "",
    CURR_RATE: "",
    SALES_INV_NO: "",
    SALES_INV_DATE: "",
    WH_CODE: "",
    LOCATION: "",
  });

  const [detailData, setDetailData] = useState([]);

  const [purchaseOrderNo, setPurchaseOrderNo] = useState("");

  const handleFetchPO = async () => {
    if (!purchaseOrderNo.trim()) {
      alert("Please enter a Purchase Order Number.");
      return;
    }

    try {
      const response = await fetch(http://127.0.0.1:8000/api/getPO, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ PO_NO: purchaseOrderNo }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      if (data.header) setHeaderData(data.header);
      if (data.details) setDetailData(data.details);
    } catch (error) {
      console.error("Error fetching PO data:", error);
      alert("Failed to fetch Purchase Order data.");
    }
  };
  
  return (
    <div className="p-8 bg-gray-100 min-h-screen font-roboto">
      {/* Header Tabs */}
      <div className="flex items-center space-x-8 border-b-2 pb-4 mb-8">
        <button className="flex items-center text-blue-600 border-b-4 border-blue-600 pb-1">
          <FontAwesomeIcon icon={faPen} className="w-4 h-4 mr-2" />
          <span className="font-semibold">Transaction Details</span>
        </button>
        <button className="flex items-center text-gray-600 hover:text-blue-600">
          <FontAwesomeIcon icon={faList} className="w-4 h-4 mr-2" />
          <span className="font-semibold">Transaction History</span>
        </button>
      </div>

      {/* Closed Transaction Header */}
      <h1 className="text-red-600 text-3xl font-bold text-center mb-8"></h1>

      {/* Form Layout */}
      <div className="grid grid-cols-4 gap-6 bg-white shadow-md p-10 rounded-lg">
        {/* Column 1 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Branch Code
            </label>
            <div className="relative w-[250px]">
              <input
                type="text"
                value={headerData.BRANCHCODE}
                className="w-full h-[40px] border border-gray-300 rounded-full p-2 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              FGRR No.
            </label>
            <input
              type="text"
              className="w-[250px] h-[40px] border border-gray-300 rounded-full p-2 text-sm text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              FGRR Date
            </label>
            <div className="relative w-[250px]">
              <input
                type="date"
                className="w-full h-[40px] border border-gray-300 rounded-full p-2 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Payee Code
            </label>
            <div className="relative w-[250px]">
              <input
                type="text"
                className="w-full h-[40px] border border-gray-300 rounded-full p-2 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Payee Name
            </label>
            <input
              type="text"
              className="w-[250px] h-[40px] border border-gray-300 rounded-full p-2 text-sm text-gray-600"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
        <div>
        <label className="block text-sm font-medium text-gray-900">
          Purchase Order No.
        </label>
        <div className="relative w-[250px]">
          <input
            type="text"
            value={purchaseOrderNo}
            onChange={(e) => setPurchaseOrderNo(e.target.value)}
            className="w-full h-[40px] border border-gray-300 rounded-full p-2 pr-12 text-sm text-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            className="absolute inset-y-0 right-0 w-[40px] h-[40px] bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            type="button"
            onClick={handleFetchPO}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
          </button>
        </div>
      </div>


          <div>
            <label className="block text-sm font-medium text-gray-900">
              Delivery Receipt No.
            </label>
            <input
              type="text"
              className="w-[250px] h-[40px] border border-gray-300 rounded-full p-2 text-sm text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Currency
            </label>
            <input
              type="text"
              className="w-[250px] h-[40px] border border-gray-300 rounded-full p-2 text-sm text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Currency Rate
            </label>
            <input
              type="text"
              className="w-[250px] h-[40px] border border-gray-300 rounded-full p-2 text-sm text-gray-600"
            />
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Sales Invoice Number
            </label>
            <div className="relative w-[250px]">
              <input
                type="text"
                className="w-full h-[40px] border border-gray-300 rounded-full p-2 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Sales Invoice Date
            </label>
            <input
              type="date"
              className="w-[250px] h-[40px] border border-gray-300 rounded-full p-2 text-sm text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Warehouse
            </label>
            <select
              className="w-[250px] h-[40px] border border-gray-300 rounded-full p-2 text-sm text-gray-600 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled selected>
                Select a Warehouse
              </option>
              <option value="Building A">Warehouse A</option>
              <option value="Building B">Warehouse B</option>
              <option value="Building C">Warehouse C</option>
              <option value="Building D">Warehouse D</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Location
            </label>
            <select
              className="w-[250px] h-[40px] border border-gray-300 rounded-full p-2 text-sm text-gray-600 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled selected>
                Select a Location
              </option>
              <option value="Location A">Location A</option>
              <option value="Location B">Location B</option>
              <option value="Location C">Location C</option>
              <option value="Location D">Location D</option>
            </select>
          </div>
        </div>

        {/* Remarks Section */}
        <div>
          <label className="block text-sm font-medium text-gray-900">Remarks</label>
          <textarea
            className="w-[330px] h-[270px] border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600"
            rows="4"
            placeholder="Enter remarks here"
          />
        </div>
      </div>

      <br />

      {/* Item Details Button */}
      <div className="flex items-center space-x-8 border-b-2 pb-4 mb-8">
        <button className="flex items-center text-gray-900 border-b-4 border-blue-600 pb-1">
          <span className="font-semibold">Item Details</span>
        </button>
      </div>

      {/* Item Details Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">LN</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">Item Code</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">Item Description</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">Specification</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">UOM</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">PO Quantity</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">RR Quantity</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">Lot No</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">BB Date</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">QC Status</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">Warehouse</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border-b text-sm text-gray-600"></td>
              <td className="px-4 py-2 border-b text-sm text-gray-600"></td>
              <td className="px-4 py-2 border-b text-sm text-gray-600"></td>
              <td className="px-4 py-2 border-b text-sm text-gray-600"></td>
              <td className="px-4 py-2 border-b text-sm text-gray-600"></td>
              <td className="px-4 py-2 border-b text-sm text-gray-600"></td>
              <td className="px-4 py-2 border-b text-sm text-gray-600"></td>
              <td className="px-4 py-2 border-b text-sm text-gray-600"></td>
              <td className="px-4 py-2 border-b text-sm text-gray-600"></td>
              <td className="px-4 py-2 border-b text-sm text-gray-600"></td>
              <td className="px-4 py-2 border-b text-sm text-gray-600"></td>
              <td className="px-4 py-2 border-b text-sm text-gray-600"></td>
              <td className="px-4 py-2 border-b text-sm text-gray-600"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionDetails;