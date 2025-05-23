import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faSignOutAlt, faArrowLeft, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import FileUpload from "./FileUpload";

const AddClientForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [currentFileType, setCurrentFileType] = useState('');
  const [fileSignedDate, setFileSignedDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAttachmentType, setSelectedAttachmentType] = useState(null);

  // Initialize all state at the top
  const [technicianInputs, setTechnicianInputs] = useState([""]);
  const [selectedTechnicians, setSelectedTechnicians] = useState([]);
  const [clientTechnicians, setClientTechnicians] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customerServiceFiles, setCustomerServiceFiles] = useState([]);
  const [turnOverFiles, setTurnOverFiles] = useState([]);
  const [smaInformationFiles, setSmaInformationFiles] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [applications, setApplications] = useState([]);
  const [editedFiles, setEditedFiles] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [visibleCustomerServiceRows, setVisibleCustomerServiceRows] = useState(10);
  const [visibleTurnOverRows, setVisibleTurnOverRows] = useState(10);
  const [visibleSmaRows, setVisibleSmaRows] = useState(10);
  const [activeTab, setActiveTab] = useState("Contact Information");
  const [activeTab2, setActiveTab2] = useState("Client Service Form");

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

  const [toggles, setToggles] = useState({
    cas: false,
    live: false,
    with_sma: false,
    fs_live: false,
    active: false
  });

  const getApiBase = () => {
    return process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000/api' 
      : 'https://api.nemarph.com:81/api';
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

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch client data when in view mode
  useEffect(() => {
    if (location.state) {
      setClient(location.state);
      setIsViewMode(true);
      fetchClientData(location.state.client_code);
    }
  }, [location.state]);

  // Fetch client files when client code changes
  useEffect(() => {
    if (client.client_code) {
      fetchClientFiles();
    }
  }, [client.client_code]);

  // Update toggles when client data changes
  useEffect(() => {
    if (client) {
      setToggles({
        cas: client.cas === "Y",
        live: client.live === "Y",
        with_sma: client.with_sma === "Y",
        fs_live: client.fs_live === "Y",
        active: client.active === "Y"
      });
    }
  }, [client]);

  const fetchClientFiles = async () => {
    try {
      const apiBase = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8000/api' 
        : 'https://api.nemarph.com:81/api';

      const [csResponse, toResponse, smaResponse] = await Promise.all([
        fetch(`${apiBase}/client-files/${client.client_code}/customerService`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch(`${apiBase}/client-files/${client.client_code}/turnOver`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch(`${apiBase}/client-files/${client.client_code}/smaInformation`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      const csData = await csResponse.json();
      const toData = await toResponse.json();
      const smaData = await smaResponse.json();

      if (csData.success) setCustomerServiceFiles(csData.files);
      if (toData.success) setTurnOverFiles(toData.files);
      if (smaData.success) setSmaInformationFiles(smaData.files);

    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const fetchClientData = async (clientCode) => {
    try {
      const [modulesResponse, applicationsResponse, techniciansResponse] = await Promise.all([
        fetch(`https://api.nemarph.com:81/api/getClientsModule?client_code=${clientCode}`),
        fetch(`https://api.nemarph.com:81/api/getClientApplications?client_code=${clientCode}`),
        fetch(`https://api.nemarph.com:81/api/getClientTechnicians?client_code=${clientCode}`)
      ]);

      const modulesData = await modulesResponse.json();
      const applicationsData = await applicationsResponse.json();
      const techniciansData = await techniciansResponse.json();

      const techNames = techniciansData.map(tech => tech.technician_name);
      setTechnicianInputs([...techNames, ""]);
      setSelectedTechnicians(techNames);
      setClientTechnicians(techniciansData);
      setApplications(applicationsData.applications);
      setSelectedModules(modulesData.modules.map(m => m.module_name));

    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTechnicianChange = (index, value) => {
    const newInputs = [...technicianInputs];
    newInputs[index] = value;
    setTechnicianInputs(newInputs);
    setSelectedTechnicians(newInputs.filter(t => t !== ""));
  };

  const addTechnicianInput = () => {
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

  const handleToggle = (key) => {
    const newValue = !toggles[key];
    setToggles(prev => ({ ...prev, [key]: newValue }));
    setClient(prev => ({ ...prev, [key]: newValue ? "Y" : "N" }));
  };

  const toggleSelection = (item, list, setList) => {
    setList(prev => prev.includes(item) 
      ? prev.filter(i => i !== item) 
      : [...prev, item]
    );
  };

  const handleAddFileClick = (type) => {
    setCurrentFileType(type);
    setShowFileModal(true);
  };

  const handleFileSelect = async (files, uploadDate, signedDate) => {
    if (files.length === 0) return { success: false, message: 'No files selected' };
    
    setIsUploading(true);
    try {
      const results = [];
      
      for (const fileObj of files) {
        const file = fileObj.file;
        
        const idResponse = await fetch(`${getApiBase()}/generate-id`, {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!idResponse.ok) {
          const errorData = await idResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `Server returned ${idResponse.status}`);
        }
        
        const idData = await idResponse.json();
        if (!idData.success || !idData.file_id) {
          throw new Error(idData.message || 'Invalid ID received');
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('file_id', idData.file_id);
        formData.append('client_code', client.client_code);
        formData.append('file_name', file.name);
        formData.append('file_type', currentFileType);
        formData.append('upload_date', uploadDate);
        formData.append('signed_date', signedDate);
  
        const uploadResponse = await fetch(`${getApiBase()}/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Upload failed');
        }
  
        const result = await uploadResponse.json();
        results.push({
          id: idData.file_id,
          fileName: file.name,
          uploadDate,
          signedDate,
          fileType: currentFileType,
          path: result.path
        });
      }
  
      const fileSetter = {
        'customerService': setCustomerServiceFiles,
        'turnOver': setTurnOverFiles,
        'smaInformation': setSmaInformationFiles
      }[currentFileType];
      
      if (fileSetter) {
        fileSetter(prev => [...prev, ...results]);
      }
  
      await fetchClientFiles();
      return { success: true, message: `${files.length} files uploaded successfully` };
      
    } catch (error) {
      console.error('Upload failed:', error);
      return { success: false, message: error.message || 'Upload failed' };
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewFile = async (file) => {
    try {
      const apiBase = getApiBase();
      
      // First verify file exists
      const verifyResponse = await fetch(`${apiBase}/files/verify/${file.file_id || file.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!verifyResponse.ok) {
        throw new Error(`File verification failed with status ${verifyResponse.status}`);
      }
  
      const verifyData = await verifyResponse.json();
      if (!verifyData.exists) {
        throw new Error('File not found on server');
      }
  
      // Open file in new tab
      window.open(`${apiBase}/files/view/${file.file_id || file.id}`, '_blank');
      
    } catch (error) {
      console.error('View failed:', error);
      alert(`Cannot view file: ${error.message}`);
    }
  };
  
  const handleDownloadFile = async (file) => {
    try {
      const apiBase = getApiBase();
      
      // First verify file exists
      const verifyResponse = await fetch(`${apiBase}/files/verify/${file.file_id || file.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!verifyResponse.ok) {
        throw new Error(`File verification failed with status ${verifyResponse.status}`);
      }
  
      const verifyData = await verifyResponse.json();
      if (!verifyData.exists) {
        throw new Error('File not found on server');
      }
  
      // Trigger download
      const link = document.createElement('a');
      link.href = `${apiBase}/files/download/${file.file_id || file.id}`;
      link.setAttribute('download', file.original_name || file.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!client.client_code || !client.client_name) {
      alert("Please fill in required fields (Client Code and Client Name)");
      return;
    }

    try {
      setIsSaving(true);
      const dataToSend = {
        client_data: {
          ...client,
          cas: toggles.cas ? "Y" : "N",
          live: toggles.live ? "Y" : "N",
          with_sma: toggles.with_sma ? "Y" : "N",
          fs_live: toggles.fs_live ? "Y" : "N",
          active: toggles.active ? "Y" : "N",
          contract_date: client.contract_date || new Date().toISOString().split('T')[0],
          modules: selectedModules,
          technicians: selectedTechnicians,
        },
        technicians: selectedTechnicians.map(name => ({
          technician_name: name,
          technician_code: technicianCodeMap[name],
          client_code: client.client_code
        })),
        files: {
          customer_service: customerServiceFiles,
          turn_over: turnOverFiles,
          sma_information: smaInformationFiles
        }
      };

      const endpoint = isViewMode 
        ? `https://api.nemarph.com:81/api/update-client/${client.client_code}`
        : 'https://api.nemarph.com:81/api/add-client';

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save client data");
      }

      if (responseData.success) {
        alert(isViewMode ? "Client updated successfully!" : "Client saved successfully!");
        navigate("/clients");
      } else {
        throw new Error(responseData.message || "Failed to save client data");
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
      {/* File Upload Modal */}
      <FileUpload
  isOpen={showFileModal}
  onClose={() => {
    setShowFileModal(false);
    setFileSignedDate("");
  }}
  onFileSelect={async (files, uploadDate, signedDate) => {
    const result = await handleFileSelect(files, uploadDate, signedDate);
    if (result.success) {
      setShowFileModal(false);
      setFileSignedDate("");
    }
    return result;
  }}
  isLoading={isUploading}
/>

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200 z-50"
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
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

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">
        {isViewMode ? "Client Information" : "Add New Client Information"}
      </h1>

      <div className="bg-[#f8f8f8] p-6">
        {/* Basic Client Info */}
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

        {/* Financials Tab */}
        <div className="mt-6">
          <div className="flex space-x-4 bg-gradient-to-r from-blue-400 to-purple-300 gap-[285px] text-white rounded-t-md p-4">
            <button className="pb-2 font-semibold border-b-2 border-white">FINANCIALS</button>
            <button className="pb-2 font-semibold opacity-70 hover:opacity-100">HR-PAY</button>
            <button className="pb-2 font-semibold opacity-70 hover:opacity-100">Realty</button>
            <button className="pb-2 font-semibold opacity-70 hover:opacity-100">WMS</button>
          </div>

          {/* Financials Content */}
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

            {/* FS Generation & Toggles */}
            <div className="grid grid-cols-2 gap-6 items-start">
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
        </div>

        {/* Modules and Technicians */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-4 items-start">
            {/* Main Modules */}
            <div>
              <h3 className="text-gray-800 font-semibold mb-2">Modules / Services</h3>
              <div className="space-y-2">
                {modules.map((module) => (
                  <label key={module} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(module)}
                      onChange={() => toggleSelection(module, selectedModules, setSelectedModules)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">{module}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Other Modules */}
            <div>
              <h3 className="text-gray-800 font-semibold mb-2">Other Modules</h3>
              <div className="space-y-2">
                {otherModules.map((module) => (
                  <label key={module} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(module)}
                      onChange={() => toggleSelection(module, selectedModules, setSelectedModules)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">{module}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Technicians Assigned */}
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

        {/* Bottom Tabs */}
        <div className="flex space-x-4 bg-gradient-to-r from-blue-400 to-purple-300 gap-[250px] text-white rounded-t-md p-4">
          {["Contact Information", "Server Information", "Attachment", "SMA Information"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === "Attachment") setSelectedAttachmentType(null);
              }}
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

        {/* Tab Content */}
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
          <div>
            <div className="flex space-x-4 bg-gradient-to-r from-purple-300 to-blue-400 text-white rounded-t-md p-4 mt-10">
              {["Client Service Form", "Turn-Over Documents"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedAttachmentType(tab)}
                  className={`pb-2 font-semibold transition-opacity ${
                    selectedAttachmentType === tab
                      ? "text-white border-b-2 border-white opacity-100"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {selectedAttachmentType && (
              <div className="p-6 bg-gray-100 rounded-b-md">
                {selectedAttachmentType === "Client Service Form" && (
                  <div>
                    <div 
                      className="flex items-center space-x-2 mb-8 mt-4" 
                      onClick={() => handleAddFileClick('clientServiceForm')}
                    >
                      <FaPlus className="text-blue-500 cursor-pointer" />
                      <span className="font-semibold text-gray-700 cursor-pointer">Add New File</span>
                    </div>

                    <table className="min-w-full bg-white border border-gray-300">
                    <thead>
  <tr className="border-b bg-gray-200">
    <th className="p-2 text-left">ID</th>
    <th className="p-2 text-left">Upload Date</th>
    <th className="p-2 text-left">Signed Date</th>
    <th className="p-2 text-left">File Name</th>
    <th className="p-2 text-left">Actions</th>
  </tr>
</thead>
                      <tbody>
                        {customerServiceFiles.map((file) => (
                          <tr key={file.file_id} className="border-b">
                            <td className="p-2">{file.file_id}</td>
                            <td className="p-2">
                              {file.upload_date ? new Date(file.upload_date).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-2">
        {file.signed_date ? new Date(file.signed_date).toLocaleDateString() : 'N/A'}
      </td>
                            <td className="p-2">{file.original_name}</td>
                            <td className="p-2 flex space-x-2">
                              <button
                                onClick={() => handleViewFile(file)}
                               className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDownloadFile(file)}
                                className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                              >
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedAttachmentType === "Turn-Over Documents" && (
                  <div>
                    <div 
                      className="flex items-center space-x-2 mb-8 mt-4" 
                      onClick={() => handleAddFileClick('turnOver')}
                    >
                      <FaPlus className="text-blue-500 cursor-pointer" />
                      <span className="font-semibold text-gray-700 cursor-pointer">Add New File</span>
                    </div>

                    <table className="min-w-full bg-white border border-gray-300">
                      <thead>
                        <tr className="border-b bg-gray-200">
                          <th className="p-2 text-left">ID</th>
                          <th className="p-2 text-left">Upload Date</th>
                          <th className="p-2 text-left">Signed Date</th>
                          <th className="p-2 text-left">File Name</th>
                          <th className="p-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {turnOverFiles.map((file) => (
                          <tr key={file.file_id} className="border-b">
                            <td className="p-2">{file.file_id}</td>
                            <td className="p-2">
                              {file.upload_date ? new Date(file.upload_date).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-2">
        {file.signed_date ? new Date(file.signed_date).toLocaleDateString() : 'N/A'}
      </td>
                            <td className="p-2">{file.original_name}</td>
                            <td className="p-2 flex space-x-2">
                              <button
                                onClick={() => handleViewFile(file)}
                                className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDownloadFile(file)}
                                className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                              >
                                Download
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
          </div>
        )}

        {/* SMA Information Tab */}
        {activeTab === "SMA Information" && (
          <div>
            <div 
              className="flex items-center space-x-2 mb-8 mt-4" 
              onClick={() => handleAddFileClick('smaInformation')}
            >
              <FaPlus className="text-blue-500 cursor-pointer" />
              <span className="font-semibold text-gray-700 cursor-pointer">Add New File</span>
            </div>

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
                  <tr key={file.file_id} className="border-b">
                    <td className="p-2">{file.file_id}</td>
                    <td className="p-2">
                      {file.upload_date ? new Date(file.upload_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-2">
                      <input
                        type="date"
                        value={file.signed_date || editedFiles[file.file_id] || ""}
                        onChange={(e) => {
                          setEditedFiles(prev => ({
                            ...prev,
                            [file.file_id]: e.target.value
                          }));
                        }}
                        className="border border-gray-300 p-1"
                      />
                    </td>
                    <td className="p-2">{file.original_name}</td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => handleViewFile(file)}
                        className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadFile(file)}
                        className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-purple-500 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-purple-400 transition duration-300"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "SAVING..." : (isViewMode ? "UPDATE" : "SAVE")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddClientForm;