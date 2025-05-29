import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faSignOutAlt, faArrowLeft, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa";
import axios from 'axios';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';
import { Eye, EyeOff } from 'lucide-react'
import { FaTrash, FaDownload, FaEye } from 'react-icons/fa';
import Layout from "../Layout";

import FileUpload from "./FileUpload";
import { FaDeleteLeft } from "react-icons/fa6";

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
  const [isLoading, setIsLoading] = useState(false);
  const [showRemotePw, setShowRemotePw] = useState(false);
  const [showServerPw, setShowServerPw] = useState(false);




  // Initialize all state at the top

  // const [technicianInputs, setTabTechnicians] = useState([""]);
  // const [selectedTechnicians, setSelectedTechnicians] = useState([]);
  // const selectedTechnicians = (tabTechnicians[activeTopTab] || []).filter(t => t !== "");

  const [clientTechnicians, setClientTechnicians] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // const [selectedModules, setSelectedModules] = useState([]);
  

 // Initialize file states properly
const [clientServiceFiles, setclientServiceFiles] = useState([]);
const [turnOverFiles, setTurnOverFiles] = useState([]);
const [smaInformationFiles, setSmaInformationFiles] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [applications, setApplications] = useState([]);
  const [editedFiles, setEditedFiles] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  

  const [visibleCustomerServiceRows, setVisibleCustomerServiceRows] = useState(10);
  const [visibleTurnOverRows, setVisibleTurnOverRows] = useState(10);
  const [visibleSmaRows, setVisibleSmaRows] = useState(10);
  const [activeTab, setActiveTab] = useState("Contact Information");
  const [activeTab2, setActiveTab2] = useState("Client Service Form");

  // START MODULE

const [activeTopTab, setActiveTopTab] = useState("FINANCIALS");
const [tabTechnicians, setTabTechnicians] = useState({
  FINANCIALS: [""],
  "HR-PAY": [""],
  REALTY: [""],
  WMS: [""]
});


  const [tabModules, setTabModules] = useState({
  "FINANCIALS": [],
  "HR-PAY": [],
  "REALTY": [],
  "WMS": [],
});

const [tabMainModules, setTabMainModules] = useState({

  "FINANCIALS": [
    "General Ledger",
    "Accounts Payable",
    "Sales",
    "Accounts Receivable",
    "Purchasing",
    "FG Inventory",
    "MS Inventory",
    "RM Inventory",
    "VE Inventory",],

  "HR-PAY": [
    "HR Management and Payroll",
    "HR Information System",],

  "REALTY": [
    "Realty",
    "In-House Financing"],

  "WMS": [
    "Inbound", 
    "Outbound",
    "Other Activities",
    "Billing"],

});

const [tabOtherModules, setTabOtherModules] = useState({

  "FINANCIALS": [
    "Fixed Assets",
    "Budget",
    "Bank Recon",
    "Production",
    "Importation",
    "Financing",
    "Leasing"
  ],

  "HR-PAY": [
    "Employee Portal",
    "Employee Portal Cloud",],

  // "REALTY": [
  //   "Property Management", 
  //   "Valuation"],

  // "WMS": [
  //   "Logistics", 
  //   "Reports"],

});


// Now you can safely access these
const technicianInputs = tabTechnicians[activeTopTab] || [""];
const selectedModules = tabModules[activeTopTab] || [];


const handleModuleToggle = (module) => {
  const current = tabModules[activeTopTab] || [];
  const isChecked = current.includes(module);
  const updated = isChecked
    ? current.filter(m => m !== module)
    : [...current, module];

  setTabModules(prev => ({ ...prev, [activeTopTab]: updated }));
  setPendingChanges(prev => ({ ...prev, modules: updated }));
};


const handleTechnicianChange = (index, selectedName) => {
  const selectedCode = technicianCodeMap[selectedName];
  const displayValue = `${selectedName} (${selectedCode})`;

  setTabTechnicians(prev => {
    const newInputs = [...(prev[activeTopTab] || [])];
    newInputs[index] = displayValue;

    return {
      ...prev,
      [activeTopTab]: newInputs
    };
  });
};

const addTechnicianInput = () => {
  setTabTechnicians(prev => {
    const currentInputs = prev[activeTopTab] || [""];
    return {
      ...prev,
      [activeTopTab]: [...currentInputs, ""]
    };
  });
};

const removeTechnicianInput = (index) => {
  setTabTechnicians(prev => {
    const currentInputs = prev[activeTopTab] || [""];
    const newInputs = currentInputs.filter((_, i) => i !== index);
    return {
      ...prev,
      [activeTopTab]: newInputs.length > 0 ? newInputs : [""]
    };
  });
};


// END MODULE



  const [client, setClient] = useState({
  client_code: "",
  client_name: "",
  main_address: "",
  contract_date: "",
  cas: "N",
  live: "N",
  sma_days: "",
  fs_live: "N",
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
  helpdesk: "",
  with_sma: "N",
  active: "N",
  contact_persons: ["", ""]
});


  const [toggles, setToggles] = useState({
    cas: false,
    live: false,
    with_sma: false,
    fs_live: false,
    active: false
  });



  // const FinancialsModules = [
  //   "General Ledger",
  //   "Accounts Payable",
  //   "Sales",
  //   "Accounts Receivable",
  //   "Purchasing",
  //   "FG Inventory",
  //   "MS Inventory",
  //   "RM Inventory",
  //   "VE Inventory",
  // ];

  // const FinancialsOtherModules = [
  //   "Fixed Assets",
  //   "Budget",
  //   "Bank Recon",
  //   "Production",
  //   "Importation",
  //   "Financing",
  // ];

  // const HrpayModules = [
  //   "HR Management and Payroll",
  //   "HR Information System",
  // ];

  // const HrpayOtherModules = [
  //   "Employee Portal",
  //   "Employee Portal Cloud",
  // ];
  


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

  const codeToTechnicianMap = {
    "DGC": "Danica Castillo",
    "FLR": "France Rosimo",
    "MAA": "Anjeaneth Alarcon",
    "AGA": "Arvee Aurelio",
    "JBM": "Jomel Mendoza",
    "GSM": "Gerard Mendoza"
  };


  // 👇 PLACE THIS RIGHT BEFORE JSX
  const currentMainModules = tabMainModules[activeTopTab] || [];
  const currentOtherModules = tabOtherModules[activeTopTab] || [];
  const currentSelectedModules = tabModules[activeTopTab] || [];

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  // When initializing from existing data
// useEffect(() => {
//   if (location.state) {
//     setClient(location.state);
//     setIsViewMode(true);
//     fetchClientData(location.state.client_code)
//       .then(data => {
//         if (data) {
//           setSelectedModules(data.modules?.map(m => m.module_name) || []);
//         }
//       });
//   }
// }, [location.state]);

useEffect(() => {
  if (location.state) {
    setClient(location.state);
    setIsViewMode(true);
    fetchClientData(location.state.client_code)
      .then(data => {
        if (data) {
          // Instead of setSelectedModules, update tabModules for the active tab:
          const modulesForTab = data.modules?.map(m => m.module_name) || [];
          setTabModules(prev => ({
            ...prev,
            [activeTopTab]: modulesForTab
          }));
        }
      });
  }
}, [location.state, activeTopTab]);


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
        ? 'http://127.0.0.1:8000/api' 
        : 'http://192.168.56.1:82/api';

      const [csResponse, toResponse, smaResponse] = await Promise.all([
        fetch(`${apiBase}/client-files/${client.client_code}/clientService`, {
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

      if (csData.success) setclientServiceFiles(csData.files);
      if (toData.success) setTurnOverFiles(toData.files);
      if (smaData.success) setSmaInformationFiles(smaData.files);

    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const fetchClientData = async (clientCode) => {
    console.log('[fetchClientData] Fetching data for client:', clientCode);
    setIsLoading(true); // Set loading to true when starting fetch
    
    const apiBase = process.env.NODE_ENV === 'development' 
      ? 'http://127.0.0.1:8000/api' 
      : 'http://192.168.56.1:82/api';

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      };

      const response = await fetch(`${apiBase}/load-client-data?client_code=${clientCode}`, { headers });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Request failed:', errorText);
        if (response.status === 401) navigate('/login');
        throw new Error(errorText || 'Request failed');
      }

      const data = await response.json();
      console.log('Raw API response:', data);

      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      // Process technicians data
      // const receivedTechnicians = data.technicians || [];
      // const technicianDisplayNames = receivedTechnicians.map(tech => {
      //   const name = Object.entries(technicianCodeMap).find(([_, c]) => c === tech.tech_code)?.[0] || tech.tech_code;
      //   return `${name} (${tech.tech_code})`;
      // });

      
      const receivedTechnicians = data.technicians || [];

      const filteredTechnicians = receivedTechnicians.filter(t => t.app_type === activeTopTab);

      const technicianDisplayNames = filteredTechnicians.map(tech => {
        const name = Object.entries(technicianCodeMap).find(([_, c]) => c === tech.tech_code)?.[0] || tech.tech_code;
        return `${name} (${tech.tech_code})`;
      });

      // setTechnicianInputs(technicianDisplayNames);




      // Transform and normalize client data
      const clientData = data.clients || {};
      const transformedClient = {
        client_code: clientData.client_code || '',
        client_name: clientData.client_name || '',
        main_address: clientData.main_address || '',
        contract_date: clientData.contract_date || '',
        cas: clientData.cas || 'N',
        live: clientData.live || 'N',
        sma_days: clientData.sma_days || '',
        fs_live: clientData.fs_live || 'N',
        cal: clientData.cal || clientData.numberOfUsers || '', // Map numberOfUsers to cal
        industry: clientData.industry || '',
        training_days: Number(clientData.training_days) || 0,
        training_days_consumed: Number(clientData.training_days_consumed) || 0,
        post_training_days: Number(clientData.post_training_days) || 0,
        post_training_days_consumed: Number(clientData.post_training_days_consumed) || 0,
        fs_generation_contract: Number(clientData.fs_generation_contract) || 0,
        fs_generation_consumed: Number(clientData.fs_generation_consumed) || 0,
        remote_id: clientData.remote_id || '',
        remote_pw: clientData.remote_pw || '',
        server_pw: clientData.server_pw || '',
        helpdesk: clientData.helpdesk || '',
        with_sma: clientData.with_sma || 'N',
        active: clientData.active || 'N'
      };

      console.log('Transformed client data:', transformedClient);

      // // Update state
      // setClient(transformedClient);
      // setTabTechnicians([...technicianDisplayNames, ""]);
      // setSelectedTechnicians(technicianDisplayNames);
      // setClientTechnicians(receivedTechnicians.map(t => t.tech_code));
      // setApplications(data.applications || []);
      // setSelectedModules(data.modules?.map(m => m.module_name) || []);
      // Update state
          setClient(transformedClient);

          // Set technicians per tab
          setTabTechnicians(prev => ({
            ...prev,
            [activeTopTab]: [...technicianDisplayNames, ""]
          }));

          // setSelectedTechnicians(technicianDisplayNames);
          setClientTechnicians(receivedTechnicians.map(t => t.tech_code));

          // Set modules per tab
          setTabModules(prev => ({
            ...prev,
            [activeTopTab]: data.modules?.map(m => m.module_name) || []
          }));

          setApplications(data.applications || []);


      return data;

    } catch (error) {
      console.error('Error fetching client data:', error);
      alert(`Error loading client data: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false); // Set loading to false when done
    }
  };

  

  const handleLogout = () => {
    navigate("/");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // const handleTechnicianChange = (index, value) => {
  //   const newInputs = [...technicianInputs];
  //   newInputs[index] = value;
  //   setTabTechnicians(newInputs);
  //   setSelectedTechnicians(newInputs.filter(t => t !== ""));
  // };

  // const addTechnicianInput = () => {
  //   if (technicianInputs[technicianInputs.length - 1] !== "") {
  //     setTabTechnicians([...technicianInputs, ""]);
  //   }
  // };

  // const removeTechnicianInput = (index) => {
  //   if (technicianInputs.length > 1) {
  //     const newInputs = [...technicianInputs];
  //     newInputs.splice(index, 1);
  //     setTabTechnicians(newInputs);
  //     setSelectedTechnicians(newInputs.filter(t => t !== ""));
  //   }
  // };

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
  const getApiBase = () => {
    return process.env.NODE_ENV === 'development' 
      ? 'http://127.0.0.1:8000/api' 
      : 'http://192.168.56.1:82/api';
  };

  if (files.length === 0) return { success: false, message: 'No files selected' };
  
  setIsUploading(true);
  try {
    // Optimistically update UI with the new files
    const tempFiles = files.map(fileObj => ({
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fileName: fileObj.file.name,
      uploadDate,
      signedDate,
      fileType: currentFileType,
      original_name: fileObj.file.name,
      status: 'uploading'
    }));

    // Update the appropriate file list immediately using functional update
    const updateFileState = (prevFiles) => [...prevFiles, ...tempFiles];
    
    switch(currentFileType) {
      case 'clientServiceForm':
        setclientServiceFiles(updateFileState);
        break;
      case 'turnOver':
        setTurnOverFiles(updateFileState);
        break;
      case 'smaInformation':
        setSmaInformationFiles(updateFileState);
        break;
      default:
        break;
    }

    // Proceed with actual upload
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
        throw new Error(`Server returned ${idResponse.status}`);
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
      formData.append('signed_date', signedDate || null);

      const uploadResponse = await fetch(`${getApiBase()}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const result = await uploadResponse.json();
      results.push({
        file_id: idData.file_id,
        original_name: file.name,
        upload_date: uploadDate,
        signed_date: signedDate,
        file_type: currentFileType,
        path: result.path
      });
    }

    // Update state with final uploaded files (replacing temp files)
    const updateFinalState = (prevFiles) => [
      ...prevFiles.filter(f => !f.id?.includes('temp-')), // Remove temp files
      ...results
    ];

    switch(currentFileType) {
      case 'clientServiceForm':
        setclientServiceFiles(updateFinalState);
        break;
      case 'turnOver':
        setTurnOverFiles(updateFinalState);
        break;
      case 'smaInformation':
        setSmaInformationFiles(updateFinalState);
        break;
      default:
        break;
    }

    return { success: true, message: `${files.length} files uploaded successfully` };
    
  } catch (error) {
    console.error('Upload failed:', error);
    // Remove failed uploads from state
    const removeTempFiles = (prevFiles) => prevFiles.filter(f => !f.id?.includes('temp-'));
    
    switch(currentFileType) {
      case 'clientServiceForm':
        setclientServiceFiles(removeTempFiles);
        break;
      case 'turnOver':
        setTurnOverFiles(removeTempFiles);
        break;
      case 'smaInformation':
        setSmaInformationFiles(removeTempFiles);
        break;
      default:
        break;
    }
    
    return { success: false, message: error.message || 'Upload failed' };
  } finally {
    setIsUploading(false);
  }
};

const handleDeleteFile = async (file) => {
  try {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!confirm.isConfirmed) return;

    const apiBase = process.env.NODE_ENV === 'development' 
      ? 'http://127.0.0.1:8000/api' 
      : 'http://192.168.56.1:82/api';

    const response = await axios.delete(`${apiBase}/file/${file.file_id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      await Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      );
      fetchClientFiles(); // Refresh the file list
    } else {
      throw new Error(response.data.message || 'Delete failed');
    }
  } catch (error) {
    console.error('Delete error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || `Error deleting file: ${error.message}`
    });
  }
};

  const handleViewFile = async (file) => {

    const getApiBase = () => {
      return 'http://127.0.0.1:8000/api';
    };

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
    const getApiBase = () => {
      return 'http://127.0.0.1:8000/api';
    };
    
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

  const handlePassword = async (e) => {
  const { name, value } = e.target;

  // Hash only the password fields
  if (name === "remote_pw" || name === "server_pw") {
    const hashedValue = await bcrypt.hash(value, 10);
    setClient(prev => ({
      ...prev,
      [name]: hashedValue
    }));
  } else {
    setClient(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

  const handleSave = async () => {
  const moduleCodeMap = {

    'General Ledger': 'GL',
    'Accounts Payable': 'AP',
    'Sales': 'SA',
    'Accounts Receivable': 'AR',
    'Purchasing': 'PUR',
    'FG Inventory': 'FGINV',
    'MS Inventory': 'MSINV',
    'RM Inventory': 'RMINV',
    'VE Inventory': 'VEINV',
    'Fixed Assets': 'FA',
    'Budget': 'BUD',
    'Bank Recon': 'BR',
    'Production': 'PROD',
    'Importation': 'IMP',
    'Financing': 'FIN',
    'Leasing': 'LS',

    'HR Management and Payroll': 'HRPAY',
    'HR Information System': 'HRIS',
    'Employee Portal': 'HRPortal',
    'Employee Portal Cloud': 'HRPortalCloud',

    'Realty': 'REALTY',
    'In-House Financing': 'INHOUSE',

    'Inbound': 'INB',
    'Outbound': 'OUTB',
    'Other Activities': 'OTH',
    'Billing': 'AR',

  };

  try {
    setIsSaving(true);

    // const technicianCodes = selectedTechnicians.map(tech => {
    //   const matches = tech.match(/\(([^)]+)\)/);
    //   return matches ? matches[1] : tech;
    // });


    // Get technician inputs for current tab, filtering empty strings
    const techniciansToSave = (tabTechnicians[activeTopTab] || []).filter(t => t !== "");

    // Flatten all technicians across tabs with module type
    const clientTechnicalsPayload = Object.entries(tabTechnicians).flatMap(
      ([appType, technicians]) =>
        technicians
          .filter(t => t !== "") // remove empty inputs
          .map(t => {
            // Extract tech_code from string like "Name (code)"
            const matches = t.match(/\(([^)]+)\)/);
            const tech_code = matches ? matches[1] : t;
            return {
              tech_code,
              app_type: appType
            };
          })
    );

    const allSelectedModules = Object.values(tabModules).flat();
  //   const clientModulesPayload = allSelectedModules.map(moduleName => ({
  //   module_name: moduleName,
  //   module_code: moduleCodeMap[moduleName] || null,
  //   module_type: activeTopTab, // 👈 include the current tab here
  // }));

//   const clientModulesPayload = Object.entries(tabModules).flatMap(([moduleType, moduleNames]) =>
//   moduleNames.map(moduleName => ({
//     module_name: moduleName,
//     module_code: moduleCodeMap[moduleName] || null,
//     module_type: moduleType, // correct module type here
//   }))
// ); 

  const selectedModulesForActiveTab = tabModules[activeTopTab] || [];
  const allowedModules = tabMainModules[activeTopTab] || [];
  const filteredModules = selectedModulesForActiveTab.filter(module =>
    allowedModules.includes(module)
  );

  const clientModulesPayload = filteredModules.map(moduleName => ({
    module_name: moduleName,
    module_code: moduleCodeMap[moduleName] || null,
    module_type: activeTopTab,
  }));




    // Extract codes from display strings
    const technicianCodes = techniciansToSave.map(tech => {
      const matches = tech.match(/\(([^)]+)\)/);
      return matches ? matches[1] : tech;
    });

    const payload = {
      mode: 'Upsert',
      params: JSON.stringify({
        json_data: {
          client_code: client.client_code,
          client_name: client.client_name,
          main_address: client.main_address,
          contract_date: client.contract_date,
          industry: client.industry,
          remote_id: client.remote_id,
          remote_pw: client.remote_pw,
          server_pw: client.server_pw,
          cas: client.cas,
          live: client.live,
          with_sma: client.with_sma,
          fs_live: client.fs_live,
          active: client.active,
          cal: client.cal,
          sma_days: client.sma_days,
          training_days: client.training_days,
          training_days_consumed: client.training_days_consumed ?? 0,
          post_training_days: client.post_training_days,
          post_training_days_consumed: client.post_training_days_consumed ?? 0,
          fs_generation_consumed: client.fs_generation_consumed ?? 0,
          contact_persons: client.contact_persons,
          helpdesk: client.helpdesk,
          // client_modules: selectedModules.map(module => ({
          //   module_name: module,
          //   module_code: moduleCodeMap[module] 
          // })),       
          client_modules: clientModulesPayload,
          // client_technicals: technicianCodes.map(code => ({ tech_code: code }))
          client_technicals: clientTechnicalsPayload,
        }
      })
    };

    const apiBase = process.env.NODE_ENV === 'development' 
      ? 'http://127.0.0.1:8000/api' 
      : 'http://192.168.56.1:82/api';

    const response = await axios.post(`${apiBase}/client/save`, payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Client data saved successfully'
      });

      if (!isViewMode) {
        navigate(`/client/${client.client_code}`, { 
          state: { ...client, client_code: client.client_code } 
        });
      }
    } else {
      throw new Error(response.data.message || 'Save failed');
    }

  } catch (error) {
    console.error('Save error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Error saving client: ${error.message}`
    });
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div className="p-4 bg-blue-50 min-h-screen">

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-800 mb-4"></div>
            <p className="text-gray-700">Loading client data...</p>
          </div>
        </div>
      )}

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
      fetchClientFiles();
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

      <div className="bg-white shadow-xl p-6 rounded-lg">
        {/* Basic Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
          <div>
            <label className="block font-bold text-gray-800 mb-2">Client Code</label>
            <input
              type="text"
              name="client_code"
              value={client.client_code || ""}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-800 mb-2 text-sm">Client Name</label>
            <input
              type="text"
              name="client_name"
              value={client.client_name || ""}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-800 mb-2 text-sm">Industry</label>
            <select
              name="industry"
              value={client.industry || ""}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
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
        <div className="mb-4 text-sm">
          <label className="block font-bold text-gray-800 mb-2 text-sm">Address</label>
          <textarea
            type="text"
            name="main_address"
            value={client.main_address || ""}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full h-[80px] text-sm"
          />
        </div>

        {/* Number of Users */}
        {/* <div className="grid grid-cols-6 items-center gap-4 mb-4 text-sm">
          <div className="col-span-2">
            <label htmlFor="cal" className="block font-bold text-gray-800 mb-2 text-sm">
              Number of Users
            </label>
            <input
              id="cal"
              type="text"
              name="cal"
              value={client.cal || ""}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
        </div> */}

{/* APPLICATION TABS */}
<div className="mt-6 bg-blue-50 text-sm lg:text-base">
  <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-10 bg-blue-600 text-white rounded-t-md p-3 lg:gap-[220px]">
  {["FINANCIALS", "HR-PAY", "REALTY", "WMS"].map(tab => (
    <button 
      key={tab}
      className={`pb-2 font-semibold ${
        activeTopTab === tab ? "border-b-2 border-white" : "opacity-70 hover:opacity-100"
      }`}
      onClick={() => setActiveTopTab(tab)}
    >
      {tab}
    </button>
  ))}
</div>


  {/* Financials Content */}
  {activeTopTab === "FINANCIALS" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 p-6 gap-4 text-sm">

    
    {/* Number of Users */}

    <div>
      <label className="block font-semibold text-gray-800 mb-2">
        No. of Users
      </label>
      <div className="flex gap-3">
        <div>
          <input
            type="number"
            placeholder="Count"
            name="cal"
            value={client.cal || 0}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Count</p>
        </div>
      </div>
    </div>

    <div>
      <label className="block font-semibold text-gray-800 mb-2">
        Training Man Days
      </label>
      <div className="flex gap-3">
        <div>
          <input
            type="number"
            placeholder="15"
            name="training_days"
            value={client.training_days || 0}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Contract</p>
        </div>
        <div>
          <input
            type="number"
            name="training_days_consumed"
            value={client.training_days_consumed || 0}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
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
              <div className="flex gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="15"
                    name="post_training_days"
                    value={client.post_training_days || 0}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
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
                    className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
                  />
                  <p className="text-sm text-gray-500 mt-1 text-center">Consumed</p>
                </div>
              </div>
            </div>

            <div>
                <label className="block font-semibold text-gray-800 mb-2">
                  FS Generation
                </label>
                <div className="flex gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="15"
                      name="fs_generation_contract"
                      value={client.fs_generation_contract || 0}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
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
                      className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
                    />
                    <p className="text-sm text-gray-500 mt-1 text-center">Consumed</p>
                  </div>
                </div>
              </div>

            {/* FS Generation & Toggles */}
            <div className="grid grid-cols-1 items-start gap-3 lg:gap-6 ">
              
              <div className="flex items-center mt-4 gap-3 lg:gap-6">
                {[
                { key: "cas", label: "CAS" },
                { key: "live", label: "LIVE" },
                { key: "with_sma", label: "SMA" },
                { key: "fs_live", label: "FS LIVE" },
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

                
          )      
          }


    {/* HRPAY Content */}
    {activeTopTab === "HR-PAY" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6 gap-4 text-sm">

    
    {/* Number of Users */}

    <div>
      <label className="block font-semibold text-gray-800 mb-2">
        No. of Users / Employees
      </label>
      <div className="flex gap-3">
        <div>
          <input
            type="number"
            placeholder="Count"
            name="cal"
            value={client.cal || 0}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Users</p>
        </div>
        <div>
          <input
            type="number"
            name="cal"
            value={client.cal || 0}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Employees</p>
        </div>
      </div>
    </div>


    <div>
      <label className="block font-semibold text-gray-800 mb-2">
        Training Man Days
      </label>
      <div className="flex gap-3">
        <div>
          <input
            type="number"
            placeholder="15"
            name="training_days"
            value={client.training_days || 0}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Contract</p>
        </div>
        <div>
          <input
            type="number"
            name="training_days_consumed"
            value={client.training_days_consumed || 0}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
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
              <div className="flex gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="15"
                    name="post_training_days"
                    value={client.post_training_days || 0}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
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
                    className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
                  />
                  <p className="text-sm text-gray-500 mt-1 text-center">Consumed</p>
                </div>
              </div>
            </div>

          
            <div className="grid grid-cols-1 items-start gap-3 lg:gap-6">
            <div className="flex items-center mt-4 gap-3 lg:gap-6">
              {[
                { key: "live", label: "LIVE" },
                { key: "with_sma", label: "SMA" },
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

                
          )      
          }

          {/* REALTY Content */}
    {activeTopTab === "REALTY" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6 gap-4 text-sm">

    
    {/* Number of Users */}

    <div>
      <label className="block font-semibold text-gray-800 mb-2">
        No. of Users
      </label>
      <div className="flex gap-3">
        <div>
          <input
            type="number"
            placeholder="Count"
            name="cal"
            value={client.cal || 0}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Count</p>
        </div>
      </div>
    </div>

    <div>
      <label className="block font-semibold text-gray-800 mb-2">
        Training Man Days
      </label>
      <div className="flex gap-3">
        <div>
          <input
            type="number"
            placeholder="15"
            name="training_days"
            value={client.training_days || 0}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Contract</p>
        </div>
        <div>
          <input
            type="number"
            name="training_days_consumed"
            value={client.training_days_consumed || 0}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
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
              <div className="flex gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="15"
                    name="post_training_days"
                    value={client.post_training_days || 0}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
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
                    className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
                  />
                  <p className="text-sm text-gray-500 mt-1 text-center">Consumed</p>
                </div>
              </div>
            </div>

          
            <div className="grid grid-cols-1 items-start gap-3 lg:gap-6">
            <div className="flex items-center mt-4 gap-3 lg:gap-6">
              {[
                { key: "live", label: "LIVE" },
                { key: "with_sma", label: "SMA" },
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

                
          )      
          }

          {/* WMS Content */}
    {activeTopTab === "WMS" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6 gap-4 text-sm">

    
    {/* Number of Users */}

    <div>
      <label className="block font-semibold text-gray-800 mb-2">
        No. of Users
      </label>
      <div className="flex gap-3">
        <div>
          <input
            type="number"
            placeholder="Count"
            name="cal"
            value={client.cal || 0}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Count</p>
        </div>
      </div>
    </div>

    <div>
      <label className="block font-semibold text-gray-800 mb-2">
        Training Man Days
      </label>
      <div className="flex gap-3">
        <div>
          <input
            type="number"
            placeholder="15"
            name="training_days"
            value={client.training_days || 0}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
          />
          <p className="text-sm text-gray-500 mt-1 text-center">Contract</p>
        </div>
        <div>
          <input
            type="number"
            name="training_days_consumed"
            value={client.training_days_consumed || 0}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
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
              <div className="flex gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="15"
                    name="post_training_days"
                    value={client.post_training_days || 0}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
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
                    className="p-2 border border-gray-300 rounded text-right h-[40px] w-[70px]"
                  />
                  <p className="text-sm text-gray-500 mt-1 text-center">Consumed</p>
                </div>
              </div>
            </div>

          
            <div className="grid grid-cols-1 items-start gap-3 lg:gap-6">
            <div className="flex items-center mt-4 gap-3 lg:gap-6">
              {[
                { key: "live", label: "LIVE" },
                { key: "with_sma", label: "SMA" },
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

                
          )      
          }

        {/* Modules Section */}
<div className="mb-6 px-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start text-sm">
    
    {/* Main Modules */}
    <div>
      <h3 className="text-gray-800 font-semibold mb-2">Modules / Services</h3>
      <div className="space-y-2">
        {currentMainModules.map((module) => (
          <label key={module} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={currentSelectedModules.includes(module)}
              onChange={() => handleModuleToggle(module)}
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
        {currentOtherModules.map((module) => {
          const isChecked = currentSelectedModules.includes(module);
          const toggleModule = () => {
            const newModules = isChecked
              ? currentSelectedModules.filter(m => m !== module)
              : [...currentSelectedModules, module];
            setTabModules(prev => ({
              ...prev,
              [activeTopTab]: newModules
            }));
            setPendingChanges(prev => ({ ...prev, modules: newModules }));
          };

          return (
            <label key={module} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={toggleModule}
                className="form-checkbox h-4 w-4 bg-blue-500"
              />
              <span className="text-gray-700">{module}</span>
            </label>
          );
        })}
      </div>
    </div>

    {/* Technicians Assigned */}
    <div className="pr-4">
      <label className="block text-gray-700 mb-2">Technical Assigned</label>
      {technicianInputs.map((tech, index) => {
        const techValue = tech.includes(" (") ? tech.split(" (")[0] : tech;
        return (
          <div key={index} className="flex items-center gap-2 mb-2">
            <select
              value={techValue}
              onChange={(e) => handleTechnicianChange(index, e.target.value)}
              className="p-2 border border-gray-300 rounded flex-1 text-sm w-full"
            >
              <option value="">Select Technician</option>
              {technicians.map((name) => (
                <option
                  key={name}
                  value={name}
                  disabled={technicianInputs.some(t => t.startsWith(`${name} (`)) && !tech.startsWith(`${name} (`)}
                >
                  {name} ({technicianCodeMap[name]})
                </option>
              ))}
            </select>
            {index === technicianInputs.length - 1 ? (
              <button
                type="button"
                onClick={addTechnicianInput}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 w-9 h-9 flex items-center justify-center"
              >
                <FaPlus />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => removeTechnicianInput(index)}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 w-9 h-9 flex items-center justify-center"
              >
                <FaMinus />
              </button>
            )}
          </div>
        );
      })}
    </div>
  </div>

  {/* Save Button */}
  <div className="flex justify-center py-4">
    <button
      className="bg-blue-600 text-white font-semibold px-28 py-2 rounded-lg shadow-md hover:bg-blue-800 transition duration-300"
      onClick={handleSave}
      disabled={isSaving}
    >
      {isSaving ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {isViewMode ? "Updating..." : "Saving..."}
        </>
      ) : isViewMode ? "Update" : "Save"}
    </button>
  </div>
</div>


        </div>






        {/* Bottom Tabs */}
        <div className="flex flex-wrap justify-center mb-5 sm:justify-start gap-4 text-sm sm:gap-10 bg-blue-600 text-white rounded-t-md p-3 lg:gap-[150px] lg:text-base">
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
            {(client.contact_persons || ["", ""]).map((person, index) => (
  <div key={index}>
    <label className="block font-medium text-gray-700 mb-2">
      Contact Person
    </label>
    <input
      type="text"
      placeholder="Sample"
      value={person}
      onChange={(e) => {
        const updatedContacts = [...(client.contact_persons || ["", ""])];
        updatedContacts[index] = e.target.value;
        setClient(prev => ({ ...prev, contact_persons: updatedContacts }));
      }}
      className="p-2 border border-gray-300 rounded w-full"
    />
  </div>
))}

          </div>
        )}

        {activeTab === "Server Information" && (
  <>
  {/* 4-column grid for Anydesk + Server Passwords */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
    {/* Anydesk ID */}
    <div>
      <label className="block font-medium text-gray-700 mb-2">
        Server's Anydesk ID
      </label>
      <input
        type="text"
        name="remote_id"
        placeholder="15"
        value={client.remote_id || ""}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded w-full"
      />
    </div>

    {/* Anydesk Password */}
    <div className="relative">
      <label className="block font-medium text-gray-700 mb-2">
        Server's Anydesk Password
      </label>
      <input
        type={showRemotePw ? "text" : "password"}
        name="remote_pw"
        placeholder="P@ssw0rd123"
        value={client.remote_pw || ""}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded w-full pr-10"
      />
      <div
        className="absolute top-[70%] right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
        onClick={() => setShowRemotePw(!showRemotePw)}
      >
        {showRemotePw ? <EyeOff size={20} /> : <Eye size={20} />}
      </div>
    </div>

    {/* Server Password */}
    <div className="relative">
      <label className="block font-medium text-gray-700 mb-2">
        Server's Password
      </label>
      <input
        type={showServerPw ? "text" : "password"}
        name="server_pw"
        placeholder="Password2023"
        value={client.server_pw || ""}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded w-full pr-10"
      />
      <div
        className="absolute top-[70%] right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
        onClick={() => setShowServerPw(!showServerPw)}
      >
        {showServerPw ? <EyeOff size={20} /> : <Eye size={20} />}
      </div>
    </div>
  </div>

  {/* Help Desk on separate row */}
  <div className="mb-6">

    <label className="block font-medium text-gray-700 mb-2">
      Help Desk URL 
      {client.helpdesk && (
      <a
        href={client.helpdesk.startsWith('http') ? client.helpdesk : `https://${client.helpdesk}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline mt-2 inline-block font-bold px-2"
      >
         (Go to Help Desk)
      </a>
    )}
    </label>

    <input
      type="text"
      name="helpdesk"
      placeholder="URL"
      value={client.helpdesk || ""}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded w-full text-sm"
    />
    
  </div>
</>

)}


        {/* Attachment Tab */}
        {activeTab === "Attachment" && (
          <div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm sm:gap-10 bg-blue-600 text-white rounded-t-md p-3 lg:gap-[150px] lg:text-base">
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
              <div className="bg-blue-50 rounded-b-md">
  <div className="p-2 text-right cursor-pointer" onClick={() => handleAddFileClick('clientService')}>
    <span className="inline-flex items-center space-x-2">
      <FaPlus className="text-blue-500" />
      <span className="font-semibold text-gray-700">Add New File</span>
    </span>
  </div>

  {/* ✅ Scrollable wrapper for mobile */}
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300 text-sm">
      <thead>
        <tr className="border-b bg-blue-300">
          <th className="p-2 text-left whitespace-nowrap">File Name</th>
          <th className="p-2 text-left whitespace-nowrap">Upload Date</th>
          <th className="p-2 text-left whitespace-nowrap">Signed Date</th>
          <th className="p-2 text-right px-10 whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody>
        {clientServiceFiles.map((file) => (
          <tr key={file.file_id} className="border-b">
            <td className="p-2 whitespace-nowrap">{file.original_name}</td>
            <td className="p-2 whitespace-nowrap">
              {file.upload_date ? new Date(file.upload_date).toLocaleDateString() : 'N/A'}
            </td>
            <td className="p-2 whitespace-nowrap">
              {file.signed_date ? new Date(file.signed_date).toLocaleDateString() : 'N/A'}
            </td>
            <td className="p-2 flex space-x-2 justify-end whitespace-nowrap">
              <button
                onClick={() => handleViewFile(file)}
                className="p-2 text-blue-500 hover:text-blue-700"
                title="View"
              >
                <FaEye />
              </button>
              <button
                onClick={() => handleDownloadFile(file)}
                className="p-2 text-green-500 hover:text-green-700"
                title="Download"
              >
                <FaDownload />
              </button>
              <button
                onClick={() => handleDeleteFile(file)}
                className="p-2 text-red-500 hover:text-red-700"
                title="Delete"
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

            )}
          </div>
        )}

        {/* SMA Information Tab */}
        {activeTab === "SMA Information" && (
          <div>
            {/* <div 
              className="flex items-center space-x-2 mb-8 mt-4" 
              onClick={() => handleAddFileClick('smaInformation')}
            >
              <FaPlus className="text-blue-500 cursor-pointer" />
              <span className="font-semibold text-gray-700 cursor-pointer">Add New File</span>
            </div> */}
            <div className="p-2 text-right cursor-pointer" onClick={() => handleAddFileClick('smaInformation')}>
              <span className="inline-flex items-center space-x-2">
                <FaPlus className="text-blue-500" />
                <span className="font-semibold text-gray-700">Add New File</span>
              </span>
            </div>

            <table className="min-w-full bg-white border border-gray-300 text-sm">
              <thead>
                <tr className="border-b bg-blue-300">
                 <th className="p-2 text-left">File Name</th>
                  <th className="p-2 text-left">Date Uploaded</th>
                  <th className="p-2 text-left">Date Signed</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {smaInformationFiles.map((file) => (
                  <tr key={file.file_id} className="border-b">
                <td className="p-2">{file.original_name}</td>
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
                    <td className="p-2 flex space-x-2 text-center">
                      <button
                onClick={() => handleViewFile(file)}
                className="p-2 text-blue-500 hover:text-blue-700"
                title="View"
              >
                <FaEye />
              </button>
              <button
                onClick={() => handleDownloadFile(file)}
                className="p-2 text-green-500 hover:text-green-700"
                title="Download"
              >
                <FaDownload />
              </button>
              <button
                onClick={() => handleDeleteFile(file)}
                className="p-2 text-red-500 hover:text-red-700"
                title="Delete"
              >
                <FaTrash />
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
  className="bg-blue-600 text-white font-semibold px-28 py-2 rounded-lg shadow-md hover:bg-blue-800 transition duration-300"
  onClick={handleSave}
  disabled={isSaving}
>
  {isSaving ? (
    <>
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {isViewMode ? "UPDATING..." : "SAVING..."}
    </>
  ) : (
    isViewMode ? "Update" : "Save"
  )}
</button>
        </div>
      </div>
    </div>
  );
};

export default AddClientForm;