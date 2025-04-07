import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faSignOutAlt, faArrowLeft, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const AddClientForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Initialize all state at the top
  const [technicianInputs, setTechnicianInputs] = useState([""]); // Start with one empty input
  const [selectedTechnicians, setSelectedTechnicians] = useState([]);
  const [clientTechnicians, setClientTechnicians] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customerServiceFiles, setCustomerServiceFiles] = useState([]);
  const [turnOverFiles, setTurnOverFiles] = useState([]);
  const [smaInformationFiles, setSmaInformationFiles] = useState([]);
  const [applications, setApplications] = useState([]);
  const [editedFiles, setEditedFiles] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [activeTab, setActiveTab] = useState("Contact Information");
  const [activeTab2, setActiveTab2] = useState("Customer Service Form");

  const handleTechnicianChange = (index, value) => {
    const newInputs = [...technicianInputs];
    newInputs[index] = value;
    setTechnicianInputs(newInputs);
    
    // Update selectedTechnicians with only non-empty values
    setSelectedTechnicians(newInputs.filter(t => t !== ""));
  };
  
  const addTechnicianInput = () => {
    // Only add if last input isn't empty
    if (technicianInputs[technicianInputs.length - 1] !== "") {
      setTechnicianInputs([...technicianInputs, ""]);
    }
  };
  
  const removeTechnicianInput = (index) => {
    if (technicianInputs.length > 1) {
      const newInputs = [...technicianInputs];
      newInputs.splice(index, 1);
      setTechnicianInputs(newInputs);
      setSelectedTechnicians(newInputs.filter(t => t !== ""));
    }
  };


  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  const [client, setClient] = useState({
    client_code: "",
    client_name: "",
    main_address: "",
    contract_date: "",
    cas: "",
    live: "",
    sma_days: "",
    fs_live: "",
    cal: "",
    industry: "",
    training_days: 0,
    training_days_consumed: 0,
    post_training_days: 0,
    post_training_days_consumed: 0,
    fs_generation_contract: 0,
    fs_generation_consumed: 0,
    remote_id: "",
    remote_pw: "",
    server_pw: "",
    with_sma: "",
  });

  const handleLogout = () => {
    logout(); // Assuming logout function clears auth state
    navigate("/");
  };

  const modules = [
    "General Ledger",
    "Account Payable",
    "Sales",
    "Account Receivable",
    "Purchasing",
    "FG Inventory",
    "MS Inventory",
    "RM Inventory",
  ];

  const otherModules = [
    "Fixed Assets",
    "Budget",
    "Bank Recon",
    "Production",
    "Importation",
    "Financing",
  ];


  const technicians = [
    "France Rosimo",
    "Danica Castillo",
    "Anjeaneth Alarcon",
    "Arvee Aurelio",
    "Jomel Mendoza",
    "Gerard Mendoza"
  ];

  const technicianCodeMap = {
    "Danica Castillo": "DGC",
    "France Rosimo": "FLR",
    "Anjeaneth Alarcon": "MAA",
    "Arvee Aurelio": "AGA",
    "Jomel Mendoza": "JBM",
    "Gerard Mendoza": "GSM",
  };

  const codeToTechnicianMap = Object.fromEntries(
    Object.entries(technicianCodeMap).map(([name, code]) => [code, name])
  );

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const [toggles, setToggles] = useState({
    cas: false,
    live: false,
    with_sma: false,
    fs_live: false,
  });

  useEffect(() => {
    if (client && typeof client === "object") {
      setToggles({
        cas: client.cas === "Y",
        live: client.live === "Y",
        sma: client.with_sma === "Y",
        fs_live: client.fs_live === "Y",
        active: client.active === "Y"
      });
    }
  }, [client]);

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    setClient((prevClient) => ({
      ...prevClient,
      [key]: prevClient[key] === "Y" ? "N" : "Y",
    }));
  };

  const toggleSelection = (item, list, setList) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleAddFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFile = {
        id: (activeTab2 === "Customer Service Form"
          ? customerServiceFiles.length
          : activeTab2 === "Turn-Over Documents"
          ? turnOverFiles.length
          : smaInformationFiles.length) + 1,
        dateStamp: new Date().toLocaleDateString(),
        fileName: file.name,
        file,
      };

      if (activeTab2 === "Customer Service Form") {
        setCustomerServiceFiles([...customerServiceFiles, newFile]);
      } else if (activeTab2 === "Turn-Over Documents") {
        setTurnOverFiles([...turnOverFiles, newFile]);
      } else if (activeTab === "SMA Information") {
        setSmaInformationFiles([...smaInformationFiles, newFile]);
      }
    }
  };

  const handleViewFile = (file) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
  };

  const handleDateChange = (fileId, date) => {
    setEditedFiles(prev => ({ ...prev, [fileId]: date }));
  };
  
  const logout = () => {
    // Implement your logout logic here
    console.log("Logging out...");
  };

  const fetchClientData = async (clientCode) => {
    try {
      const [modulesResponse, applicationsResponse, techniciansResponse] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/getClientsModule?client_code=${clientCode}`),
        fetch(`http://127.0.0.1:8000/api/getClientApplications?client_code=${clientCode}`),
        fetch(`http://127.0.0.1:8000/api/getClientTechnicians?client_code=${clientCode}`)
      ]);
  
      const modulesData = await modulesResponse.json();
      const applicationsData = await applicationsResponse.json();
      const techniciansData = await techniciansResponse.json();
  
      // Extract technician names from the response
      const techNames = techniciansData.map(tech => tech.technician_name);
      
      // Initialize technician inputs with existing technicians plus one empty
      setTechnicianInputs([...techNames, ""]);
      setSelectedTechnicians(techNames);
      setClientTechnicians(techniciansData);
      setApplications(applicationsData.applications);
  
      return { 
        modules: modulesData.modules.map(m => m.module_name),
        techAssigned: techNames,
        applications: applicationsData.applications
      };
    } catch (error) {
      console.error('Error fetching client data:', error);
      return { modules: [], techAssigned: [], applications: [] };
    }
  };

  useEffect(() => {
    if (location.state) {
      setClient(location.state);
      setIsViewMode(true);

      let techNames = location.state.tech_assigned || [];

      if (typeof techNames === "string") {
        techNames = techNames.split(",").map(code =>
          Object.keys(technicianCodeMap).find(name => technicianCodeMap[name] === code)
        ).filter(name => name !== undefined);
      }

      setSelectedTechnicians(techNames);

      fetchClientData(location.state.client_code).then(({ modules, techAssigned }) => {
        setSelectedModules(modules);
        if (techAssigned.length > 0) {
          setSelectedTechnicians(techAssigned);
        }
      });
    }
  }, [location.state]);

  const handleSave = async () => {
    // Validate required fields
    if (!client.client_code || !client.client_name) {
      alert("Please fill in all required fields (Client Code and Client Name)");
      return;
    }
  
    // Prepare client data with toggle states
    const clientData = {
      ...client,
      cas: toggles.cas ? "Y" : "N",
      live: toggles.live ? "Y" : "N",
      with_sma: toggles.with_sma ? "Y" : "N",
      fs_live: toggles.fs_live ? "Y" : "N",
      active: toggles.active ? "Y" : "N",
      contract_date: client.contract_date || new Date().toISOString().split('T')[0],
    };
  
    // Prepare technician data for ClientTechnical table
    const techniciansData = selectedTechnicians.map(name => ({
      technician_name: name,
      technician_code: technicianCodeMap[name],
      client_code: client.client_code
    }));
  
    // Create FormData object
    const formData = new FormData();
    
    // Append all data in a single operation
    formData.append("client_data", JSON.stringify({
      ...clientData,
      modules: selectedModules,
      technicians: techniciansData
    }));
  
    // Append files
    customerServiceFiles.forEach((file, index) => {
      formData.append(`customer_service_${index}`, file.file);
      formData.append(`customer_service_${index}_date`, editedFiles[file.id] || file.dateStamp);
    });
  
    turnOverFiles.forEach((file, index) => {
      formData.append(`turnover_${index}`, file.file);
      formData.append(`turnover_${index}_date`, editedFiles[file.id] || file.dateStamp);
    });
  
    try {
      setIsSaving(true);
      const endpoint = isViewMode 
        ? "http://127.0.0.1:8000/api/update-client" 
        : "http://127.0.0.1:8000/api/save-client";
  
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
  
      const responseText = await response.text();
      console.log("API response:", responseText);
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${responseText}`);
      }
  
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Failed to parse server response: ${e.message}`);
      }
  
      if (result.success) {
        alert(isViewMode ? "Client updated successfully!" : "Client saved successfully!");
        navigate("/clients");
      } else {
        throw new Error(result.message || "Failed to save client");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert(`Error saving client: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  
  return (
    <div className="p-6 bg-[#f8f8f8] min-h-screen ml-64">
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200 z-50"
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
        </button>
      )}
      {/* Header Replacement */}
            <div className="absolute top-6 right-6 flex items-center space-x-4">
              <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-500 cursor-pointer" />
              <div className="relative">
                <div className="cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <img src="3135715.png" alt="Profile" className="w-8 h-8 rounded-full" />
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    <ul className="py-2 text-gray-700">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                        <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
                      </li>
                      <li 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={handleLogout}
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

      {/* Back Arrow */}
      <button onClick={() => navigate("/dashboard")} className="flex items-center text-gray-700 hover:text-black mb-6">
        <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 mr-2" />
        <span>Back to Dashboard</span>
      </button>

      {/* Conditional Title */}
      <h1 className="text-2xl font-semibold mb-6">
        {isViewMode ? "Client Information" : "Add New Client Information"}
      </h1>

      <div className="bg-[#f8f8f8] p-6">
        {/* Client Code and Client Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Client Code</label>
            <input
              type="text"
              name="client_code"
              value={client.client_code || ""}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Client Name</label>
            <input
              type="text"
              name="client_name"
              value={client.client_name || ""}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
  <label className="block font-medium text-gray-700 mb-2">Industry</label>
  <select
    name="industry"
    value={client.industry || ""}
    onChange={handleChange}
    className="mt-1 p-2 border border-gray-300 rounded w-full"
  >
    <option value="">Select an industry</option>
    <option value="Manufacturing">Automotive</option>
    <option value="Retail">Retail</option>
    <option value="Healthcare">Manufacturing</option>
    <option value="Technology">Technology</option>
    <option value="Finance">Finance</option>
    <option value="Education">Education</option>
    <option value="Construction">Construction</option>
    <option value="Transportation">Transportation</option>
    <option value="Hospitality">Hospitality</option>
  </select>
</div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Address</label>
          <textarea
            type="text"
            name="main_address"
            value={client.main_address || ""}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full h-[127px]"
          />
        </div>

       {/* Number of Users */}
      <div className="grid grid-cols-6 items-center gap-4 mb-4">
        {/* Number of Users */}
        <div className="col-span-2">
          <label htmlFor="cal" className="block text-gray-700 mb-2">
            Number of Users
          </label>
          <input
            id="cal"
            type="text"
            name="cal"
            value={client.cal || ""}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
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
          <div className="grid grid-cols-5 p-6 bg-[#f8f8f8]">
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
                    name="training_days"
                    value={client.training_days || 0}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded text-center h-[55px] w-[65px]"
                  />
                  <p className="text-sm text-gray-500 mt-1 text-center">Contract</p>
                </div>
                <div>
                  <input
                    type="number"
                    name="training_days_consumed"
                    value={client.training_days_consumed || 0}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded text-center h-[55px] w-[65px]"
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
                    name="post_training_days"
                    value={client.post_training_days || 0}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded text-center h-[55px] w-[65px]"
                  />
                  <p className="text-sm text-gray-500 mt-1 text-center">Contract</p>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="15"
                    name="post_training_days_consumed"
                    value={client.post_training_days_consumed || 0}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded text-center h-[55px] w-[65px]"
                  />
                  <p className="text-sm text-gray-500 mt-1 text-center">Consumed</p>
                </div>
              </div>
            </div>

            {/* FS Generation & Toggles Section */}
<div className="grid grid-cols-2 gap-6 items-start">
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
          name="fs_generation_contract"
          value={client.fs_generation_contract || 0}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded text-center h-[55px] w-[65px]"
        />
        <p className="text-sm text-gray-500 mt-1 text-center">Contract</p>
      </div>
      <div>
        <input
          type="number"
          placeholder="15"
          name="fs_generation_consumed"
          value={client.fs_generation_consumed || 0}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded text-center h-[55px] w-[65px]"
        />
        <p className="text-sm text-gray-500 mt-1 text-center">Consumed</p>
      </div>
    </div>
  </div>

  <div className="flex gap-8 items-center mt-4 ml-20">
  {[
    { key: "cas", label: "CAS?" },
    { key: "live", label: "LIVE?" },
    { key: "with_sma", label: "WITH SMA?" },
    { key: "fs_live", label: "FS LIVE?" },
    { key: "active", label: "ACTIVE" },
  ].map(({ key, label }) => (
    <div key={key} className="flex flex-col items-center text-center">
      <span className="text-gray-700 text-sm whitespace-nowrap">{label}</span>
      <button
        className={`w-12 h-6 flex items-center rounded-full p-1 ${
          toggles[key] ? "bg-blue-500" : "bg-gray-300"
        }`}
        onClick={() => handleToggle(key)}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
            toggles[key] ? "translate-x-6" : ""
          }`}
        ></div>
      </button>
    </div>
  ))}
</div>
</div>
</div>

<div className="mb-6">
  <div className="grid grid-cols-3 gap-4 items-start">
    {/* Left Column - Main Modules */}
    <div>
      <h3 className="text-gray-800 font-semibold mb-2">Modules / Services</h3>
      <div className="space-y-2">
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

    {/* Middle Column - Other Modules */}
    <div>
      <h3 className="text-gray-800 font-semibold mb-2">Other Modules</h3>
      <div className="space-y-2">
        {otherModules.map((module) => (
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

    {/* Right Column - Technicians Assigned */}
    <div className="mb-4">
  <label className="block text-gray-700 mb-2">Technical Assigned</label>
  {technicianInputs.map((tech, index) => (
    <div key={index} className="flex items-center gap-2 mb-2">
      <select
        value={tech}
        onChange={(e) => handleTechnicianChange(index, e.target.value)}
        className="p-2 border border-gray-300 rounded flex-1 text-sm"
      >
        <option value="">Select Technical</option>
        {technicians.map((technician) => (
          <option 
            key={technician} 
            value={technician}
            disabled={selectedTechnicians.includes(technician) && tech !== technician}
          >
            {technician} ({technicianCodeMap[technician]})
          </option>
        ))}
      </select>
      {index === technicianInputs.length - 1 ? (
        <button
          type="button"
          onClick={addTechnicianInput}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-10 h-10 flex items-center justify-center"
        >
          <FaPlus />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => removeTechnicianInput(index)}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-10 h-10 flex items-center justify-center"
        >
          ×
        </button>
      )}
    </div>
  ))}
</div>
  </div>
</div>

          {/* Contact Information and Server Information Tabs */}
          <div className="flex space-x-4 bg-gradient-to-r from-blue-400 to-purple-300 gap-[250px] text-white rounded-t-md p-4">
            {["Contact Information", "Server Information", "Attachment", "SMA Information"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-semibold transition-opacity ${
                  activeTab === tab
                    ? "text-white border-b-2 border-white opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Conditional Rendering of Content */}
          {activeTab === "Contact Information" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
              {[1, 2].map((index) => (
                <div key={index}>
                  <label className="block font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
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
                  placeholder="15"
                  value={client.remote_id || ""}
                  onChange={handleChange}
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
                  value={client.remote_pw || ""}
                  onChange={handleChange}
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
                  value={client.server_pw || ""}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
            </div>
          )}

          {/* Attachment Tab */}
          {activeTab === "Attachment" && (
            <div className="flex space-x-4 bg-gradient-to-r from-purple-300 to-blue-400 text-white rounded-t-md p-4 mt-10">
              {["Client Service Form", "Turn-Over Documents"].map((tab) => (
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
              {/* Customer Service Form Tab */}
              {activeTab2 === "Client Service Form" && (
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
                    className="hidden"
                    accept="application/pdf"
                  />

                  {/* Table */}
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="border-b bg-gray-200">
                        <th className="p-2 text-left">LN</th>
                        <th className="p-2 text-left">Date Uploaded</th>
                        <th className="p-2 text-left">Date Signed</th>
                        <th className="p-2 text-left">File Name</th>
                        <th className="p-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerServiceFiles.map((file) => (
  <tr key={file.id} className="border-b">
    <td className="p-2">{file.id}</td>
    <td className="p-2">{file.dateStamp}</td>
    <td className="p-2">
      <input
        type="date"
        value={editedFiles[file.id] || ""} // Ensure editedFiles is defined
        onChange={(e) => handleDateChange(file.id, e.target.value)}
        className="border border-gray-300 p-1"
      />
    </td>
    <td className="p-2">{file.fileName}</td>
    <td className="p-2">
      <button
        className="text-blue-500 hover:underline"
        onClick={() => handleViewFile(file.file)}
      >
        View
      </button>
    </td>
  </tr>
))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Turn-Over Documents Tab */}
              {activeTab2 === "Turn-Over Documents" && (
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
                    className="hidden"
                    accept="application/pdf"
                  />

                  {/* Table */}
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="border-b bg-gray-200">
                        <th className="p-2 text-left">LN</th>
                        <th className="p-2 text-left">Date Uploaded</th>
                        <th className="p-2 text-left">Date Signed</th>
                        <th className="p-2 text-left">File Name</th>
                        <th className="p-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {turnOverFiles.map((file) => (
                        <tr key={file.id} className="border-b">
                          <td className="p-2">{file.id}</td>
                          <td className="p-2">{file.dateStamp}</td>
                          <td className="p-2">
                            <input
                              type="date"
                              value={editedFiles[file.id] || ""}
                              onChange={(e) => handleDateChange(file.id, e.target.value)}
                              className="border border-gray-300 p-1"
                            />
                          </td>
                          <td className="p-2">{file.fileName}</td>
                          <td className="p-2">
                            <button
                              className="text-blue-500 hover:underline"
                              onClick={() => handleViewFile(file.file)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Conditional Rendering of Content SMA Information */}
          {activeTab === "SMA Information" && (
            <div className="p-6 bg-gray-100 rounded-b-md">
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
                className="hidden"
                accept="application/pdf"
              />

              {/* Table */}
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="border-b bg-gray-200">
                    <th className="p-2 text-left">LN</th>
                    <th className="p-2 text-left">Date Uploaded</th>
                    <th className="p-2 text-left">Date Signed</th>
                    <th className="p-2 text-left">File Name</th>
                    <th className="p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {smaInformationFiles.map((file) => (
                    <tr key={file.id} className="border-b">
                      <td className="p-2">{file.id}</td>
                      <td className="p-2">{file.dateStamp}</td>
                      <td className="p-2">
                        <input
                          type="date"
                          value={editedFiles[file.id] || ""}
                          onChange={(e) => handleDateChange(file.id, e.target.value)}
                          className="border border-gray-300 p-1"
                        />
                      </td>
                      <td className="p-2">{file.fileName}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleViewFile(file.file)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Save/Update Button */}
<div className="flex justify-center">
  <button
    className="bg-purple-500 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-purple-400 transition duration-300"
    onClick={handleSave}
  >
    {isViewMode ? "UPDATE" : "SAVE"}
  </button>
</div>
        </div>
      </div>
    </div>
  );
};

export default AddClientForm;