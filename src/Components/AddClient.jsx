import React, { useState, useRef  } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";  // Import useNavigate
import { FaPlus } from "react-icons/fa"; // Importing Plus Icon

const AddClientForm = () => {
    const navigate = useNavigate();  // Initialize navigate function
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const fileInputRef = useRef(null); // Creating a ref for the file input

    const [selectedModules, setSelectedModules] = useState([
      "General Ledger",
      "Accounts Payable",
    ]);
    const [selectedTechnicians, setSelectedTechnicians] = useState([
      "France Rosimo",
      "Danica Galo",
    ]);
    const [activeTab, setActiveTab] = useState("Contact Information");
    const [activeTab2, setActiveTab2] = useState("Customer Service Form");
  
    const modules = [
      "General Ledger",
      "Accounts Payable",
      "Accounts Receivable",
      "Sales",
      "Purchasing",
      "Inventory FG",
      "Inventory MS",
      "Inventory RM",
      "Bank Recon",
      "Tax Connect",
      "Financing",
    ];
  
    const technicians = [
      "France Rosimo",
      "Danica Galo",
      "Gerard Mendoza",
      "Anjeaneth Alarcon",
      "Arvee Aurelio",
      "Jomel Mendoza",
    ];

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const [toggles, setToggles] = useState({
        cas: true,
        live: false,
        sma: true,
        fsLive: true,
        chainFlag: false,
    });

    const handleToggle = (key) => {
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleSelection = (item, list, setList) => {
      setList((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    };

    const handleAddFileClick = () => {
      // Trigger the file input click
      fileInputRef.current.click();
    };
  
    const handleFileChange = (event) => {
      // Get the selected file(s)
      const file = event.target.files[0];
      console.log(file); // Do something with the file (e.g., display its name, upload it)
    };
  

    return (
        <div className="p-6 bg-[#f8f8f8] min-h-screen">
            

            {/* Header with Notification and Profile */}
            <div className="flex justify-end mb-4 space-x-4 relative">
                {/* Notification Bell */}
                <div className="relative">
                    <FontAwesomeIcon
                        icon={faBell}
                        className="w-5 h-5 text-gray-500 bg-white p-2 rounded-lg shadow-md cursor-pointer"
                    />
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-yellow-400 rounded-full border-2 border-white"></span>
                </div>

                {/* Profile Picture */}
                <div
                    className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden shadow-md cursor-pointer"
                    onClick={toggleDropdown}
                >
                    <img src="3135715.png" alt="Profile" className="w-full h-full object-cover" />
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-10 w-48 bg-white rounded-lg shadow-md py-2 z-10">
                        <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            Account Management
                        </button>
                        <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            Settings
                        </button>
                        <button className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Back Arrow */}
            <button onClick={() => navigate("/dashboard")} className="flex items-center text-gray-700 hover:text-black mb-6">
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 mr-2" />
                <span>Back to Dashboard</span>
            </button>

            <h1 className="text-2xl font-semibold mb-6">Add New Client Information</h1>

            <div className="bg-[#f8f8f8] p-6">
                {/* Client Code and Client Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">Client Code</label>
                        <input
                            type="text"
                            placeholder="CL0000001"
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">Client Name</label>
                        <input
                            type="text"
                            placeholder="COFFEE BEAN PH"
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Industry</label>
            <input
              type="text"
              placeholder="coffee and tea retail industry"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Address</label>
          <textarea
            placeholder="Reserve"
            className="mt-1 p-2 border border-gray-300 rounded w-full h-[127px]"
          ></textarea>
        </div>

        {/* Number of Users and Toggles Section */}
        <div className="grid grid-cols-6 items-center gap-4 mb-4">
          {/* Number of Users */}
          <div className="col-span-2">
            <label htmlFor="numberOfUsers" className="block text-gray-700 mb-2">
              Number of Users
            </label>
            <input
              id="numberOfUsers"
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="15"
            />
          </div>

          {/* Toggles Section */}
          <div className="col-span-4 flex items-center space-x-4">
            {/* CAS Toggle */}
            <div className="flex flex-col items-center">
              <span className="text-gray-700 text-sm mb-2">CAS?</span>
              <button
                onClick={() => handleToggle("cas")}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  toggles.cas ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                    toggles.cas ? "translate-x-6" : ""
                  }`}
                ></div>
              </button>
            </div>

            {/* LIVE Toggle */}
            <div className="flex flex-col items-center">
              <span className="text-gray-700 text-sm mb-2">LIVE?</span>
              <button
                onClick={() => handleToggle("live")}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  toggles.live ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                    toggles.live ? "translate-x-6" : ""
                  }`}
                ></div>
              </button>
            </div>

            {/* SMA Toggle */}
            <div className="flex flex-col items-center">
              <span className="text-gray-700 text-sm mb-2">SMA?</span>
              <button
                onClick={() => handleToggle("sma")}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  toggles.sma ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                    toggles.sma ? "translate-x-6" : ""
                  }`}
                ></div>
              </button>
            </div>

            {/* FS LIVE Toggle */}
            <div className="flex flex-col items-center">
              <span className="text-gray-700 text-sm mb-2">FS LIVE?</span>
              <button
                onClick={() => handleToggle("fsLive")}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  toggles.fsLive ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                    toggles.fsLive ? "translate-x-6" : ""
                  }`}
                ></div>
              </button>
            </div>

            {/* Chain Flag Toggle */}
            <div className="flex flex-col items-center">
              <span className="text-gray-700 text-sm mb-2">Chain Flag</span>
              <button
                onClick={() => handleToggle("chainFlag")}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  toggles.chainFlag ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                    toggles.chainFlag ? "translate-x-6" : ""
                  }`}
                ></div>
              </button>
            </div>
          </div>
          </div>

          <div className="mt-4 flex space-x-8">
  {/* Applications Section */}
  <div>
    <label className="block text-gray-700 mb-2">Application</label>
    <div className="flex flex-col space-y-2">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
          name="naysaFinancials"
        />
        <span className="ml-2 text-gray-700">NAYSA Financials</span>
      </label>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
          name="naysaHRPay"
        />
        <span className="ml-2 text-gray-700">NAYSA HR-Pay</span>
      </label>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
          name="naysaRealty"
        />
        <span className="ml-2 text-gray-700">NAYSA Realty</span>
      </label>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
          name="naysaWMS"
        />
        <span className="ml-2 text-gray-700">NAYSA WMS</span>
      </label>
    </div>
  </div>

  {/* Mother Company Section */}
  <div className="flex-1">
    <label className="block ml-10 text-gray-700 mb-2 ">Mother Company</label>
    <div className="flex items-center space-x-4">
    </div>

    {/* Mother Company Input */}
    <div className="flex flex-col ml-10 space-y-2 mt-2 w-[271px]">
      <input
        type="text"
        placeholder="Enter mother company"
        className="p-2 border border-gray-300 rounded-md"
      />
    </div>
  </div>
</div>

        {/* Tabbed Sections */}
<div className="mt-6">
  {/* Tabs */}
  <div className="flex space-x-4 bg-gradient-to-r from-blue-400 to-purple-300 gap-[285px] text-white rounded-t-md p-4">
    <button className="pb-2 font-semibold border-b-2 border-white">
      FINANCIALS
    </button>
    <button className="pb-2 font-semibold opacity-70 hover:opacity-100">HR-PAY</button>
    <button className="pb-2 font-semibold opacity-70 hover:opacity-100">Realty</button>
    <button className="pb-2 font-semibold opacity-70 hover:opacity-100">WMS</button>
  </div>
  
  {/* Content */}
  <div className="grid grid-cols-3 p-6 bg-[#f8f8f8] ">
    {/* Training Man Days */}
    <div>
      <label className="block font-semibold text-gray-800 mb-2">
        Training Man Days
      </label>
      <div className="flex gap-4">
        <div>
          <input
            type="number"
            placeholder="15"
            className="p-2 border border-gray-300 rounded text-center h-[50px] w-[60px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Contract</p>
        </div>
        <div>
          <input
            type="number"
            placeholder="15"
            className="p-2 border border-gray-300 rounded text-center h-[50px] w-[60px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Consumed</p>
        </div>
      </div>
    </div>

    {/* Post-Training Man Days */}
    <div>
      <label className="block font-semibold text-gray-800 mb-2">
        Post-Training Man Days
      </label>
      <div className="flex gap-4">
        <div>
          <input
            type="number"
            placeholder="15"
            className="p-2 border border-gray-300 rounded text-center h-[50px] w-[60px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Contract</p>
        </div>
        <div>
          <input
            type="number"
            placeholder="15"
            className="p-2 border border-gray-300 rounded text-center h-[50px] w-[60px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Consumed</p>
        </div>
      </div>
    </div>

    {/* FS Generation */}
    <div>
      <label className="block font-semibold text-gray-800 mb-2">
        FS Generation
      </label>
      <div className="flex gap-4">
        <div>
          <input
            type="number"
            placeholder="15"
            className="p-2 border border-gray-300 rounded text-center h-[50px] w-[60px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Contract</p>
        </div>
        <div>
          <input
            type="number"
            placeholder="15"
            className="p-2 border border-gray-300 rounded text-center h-[50px] w-[60px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Consumed</p>
        </div>
      </div>
    </div>
  </div>

{/* Modules / Service */}
<div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-2">
          Modules / Service
        </label>
        <div className="grid grid-cols-2 gap-2">
          {modules.map((module) => (
            <label key={module} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedModules.includes(module)}
                onChange={() =>
                  toggleSelection(module, selectedModules, setSelectedModules)
                }
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-gray-700">{module}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Technical Assigned */}
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-2">
          Technical Assigned
        </label>
        <div className="grid grid-cols-2 gap-4">
          {technicians.map((tech) => (
            <label key={tech} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTechnicians.includes(tech)}
                onChange={() =>
                  toggleSelection(tech, selectedTechnicians, setSelectedTechnicians)
                }
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-gray-700">{tech}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex space-x-4 bg-gradient-to-r from-blue-400 to-purple-300 gap-[250px] text-white rounded-t-md p-4">
  {["Contact Information", "Server Information", "Attachment", "SMA Information"].map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`pb-2 font-semibold transition-opacity ${
        activeTab === tab
          ? "text-white border-b-2 border-white opacity-100" // Active Tab
          : "opacity-70 hover:opacity-100" // Inactive Tab
      }`}
    >
      {tab}
    </button>
  ))}
</div>

        {activeTab === "Contact Information" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
            {[1, 2, 3].map((index) => (
              <div key={index}>
                <label className="block font-medium text-gray-700 mb-2">
                  Accountant
                </label>
                <input
                  type="text"
                  placeholder="Sample Name"
                  className="p-2 border border-gray-300 rounded w-full"
                />

                <label className="block font-medium text-gray-700 mt-10 mb-2">I.T.</label>
                <input
                  type="text"
                  placeholder="Sample Name"
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
        ))}
      </div>
)}
{activeTab === "Server Information" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Server's Anydesk ID
              </label>
              <input
                type="text"
                placeholder="123456789"
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Server's Anydesk Password
              </label>
              <input
                type="text"
                placeholder="P@ssw0rd123"
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Server's Password
              </label>
              <input
                type="text"
                placeholder="Password2023"
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
          </div>
        )}

        {/* Tabs Navigation for Customer Service Form and Turn-Over Documents */}
{activeTab === "Attachment" && (
  <div className="flex space-x-4 bg-gradient-to-r from-purple-300 to-blue-400 text-white rounded-t-md p-4 mt-10">
    {["Customer Service Form", "Turn-Over Documents"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab2(tab)}
        className={`pb-2 font-semibold transition-opacity ${
          activeTab2 === tab
            ? "text-white border-b-2 border-white opacity-100"
            : "opacity-70 hover:opacity-100"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
)}

      {/* Conditional Rendering of Content Attachment */}
      {activeTab === "Attachment" && (
      <div className="p-6 bg-gray-100 rounded-b-md">
        {activeTab2 === "Customer Service Form" && (
          <div>
            {/* Add New File Button */}
      <div className="flex items-center space-x-2 mb-8 mt-4" onClick={handleAddFileClick}>
        <FaPlus className="text-blue-500 cursor-pointer" />
        <span className="font-semibold text-gray-700 cursor-pointer">Add New File</span>
        <span className="text-gray-500 text-xs">(10 MB Max)</span>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" // Make the input element invisible
        accept="application/pdf" // restrict file types (accept only PDFs)
      />

            {/* Table */}
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="border-b bg-gray-200">
                  <th className="p-2 text-left">LN</th>
                  <th className="p-2 text-left">Date Stamp</th>
                  <th className="p-2 text-left">File Name</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">0001</td>
                  <td className="p-2">01/01/2025</td>
                  <td className="p-2">csf signed day 1 12334.pdf</td>
                  <td className="p-2">
                    <button className="text-blue-500 hover:underline">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        </div>
        )}

         {/* Conditional Rendering of Content SMA Information */}
      {activeTab === "SMA Information" && (
      <div className="p-6 bg-gray-100 rounded-b-md">
        {activeTab2 === "Customer Service Form" && (
          <div>
            {/* Add New File Button */}
            <div className="flex items-center space-x-2 mb-8 mt-4">
              <FaPlus className="text-blue-500" />
              <span className="font-semibold text-gray-700">Add New File</span>
              <span className="text-gray-500 text-sm">10 MB Max</span>
            </div>

            {/* Table */}
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="border-b bg-gray-200">
                  <th className="p-2 text-left">LN</th>
                  <th className="p-2 text-left">Date Stamp</th>
                  <th className="p-2 text-left">File Name</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">0001</td>
                  <td className="p-2">01/01/2025</td>
                  <td className="p-2">csf signed day 1 12334.pdf</td>
                  <td className="p-2">
                    <button className="text-blue-500 hover:underline">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        </div>
        )}
      {/* Save Button */}
      <div className="flex justify-center">
        <button className="bg-purple-300 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-purple-400 transition duration-300">
          SAVE
        </button>
      </div>
    </div>

        </div>
      </div>
  );
};

export default AddClientForm;
