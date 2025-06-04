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

const [isEditingHelpdesk, setIsEditingHelpdesk] = useState(false);

const toggleFields = [
  { label: "CAS", key: "cas" },
  { label: "Live", key: "live" },
  { label: "SMA", key: "with_sma" },
  { label: "FS Live", key: "fs_live" },
  { label: "Active", key: "active" }
];

const toggleVisibilityMap = {
  "FINANCIALS": ["cas", "live", "with_sma", "fs_live", "active"],
  "HR-PAY": ["live", "with_sma", "active"],
  "REALTY": ["live", "with_sma", "active"],
  "WMS": ["live", "with_sma", "active"],
  // add other tabs as needed
};


  // Initialize all state at the top

  const [clientTechnicians, setClientTechnicians] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

const mapTogglesToYN = (toggles) => ({
  cas: toggles.cas ? "Y" : "N",
  live: toggles.live ? "Y" : "N",
  with_sma: toggles.with_sma ? "Y" : "N",
  fs_live: toggles.fs_live ? "Y" : "N",
  active: toggles.active ? "Y" : "N"
});

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
  // contract_date: "",
  industry: "",
  remote_id: "",
  remote_pw: "",
  server_pw: "",
  helpdesk: "",
  contact_persons: ["", ""]
});


//   const [clientcontracts, setClientContracts] = useState({
//   client_code: "",
//   cas: "N",
//   live: "N",
//   sma_days: 0,
//   fs_live: "N",
//   cal: "",
//   training_days: 0,
//   training_days_consumed: 0,
//   post_training_days: 0,
//   post_training_days_consumed: 0,
//   fs_generation_contract: 0,
//   fs_generation_consumed: 0,
//   with_sma: "N",
//   active: "N",
// });

const [clientcontracts, setClientContracts] = useState({});



  // const [toggles, setToggles] = useState({
  //   cas: false,
  //   live: false,
  //   with_sma: false,
  //   fs_live: false,
  //   active: false
  // });

  // const [toggles, setToggles] = useState({});

const initialToggleStatePerTab = {
  cas: false,
  live: false,
  with_sma: false,
  fs_live: false,
  active: false
};

const [toggles, setToggles] = useState({
  "FINANCIALS": { ...initialToggleStatePerTab },
  "HR-PAY": { ...initialToggleStatePerTab },
  "REALTY": { ...initialToggleStatePerTab },
  "WMS": { ...initialToggleStatePerTab },
  // add other tabs as needed
});



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

  useEffect(() => {
  if (clientcontracts.length > 0) {
    console.log('Ready to display:', clientcontracts);
  }
}, [clientcontracts]);

// inside your component:
useEffect(() => {
  if (activeTab === "Attachment") {
    setSelectedAttachmentType("Client Service Form");
  }
}, [activeTab]);

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
//   useEffect(() => {
//   if (client) {
//     setToggles({
//       cas: client.cas === "Y",
//       live: client.live === "Y",
//       with_sma: client.with_sma === "Y",
//       fs_live: client.fs_live === "Y",
//       active: client.active === "Y"
//     });
//   }
// }, [client]);

// useEffect(() => {
//   if (clientcontracts.length && activeTopTab) {
//     const contractForTab = clientcontracts.find(c => c.app_type === activeTopTab) || {};

//     setToggles(prev => ({
//   ...prev,
//   [activeTopTab]: {
//     live: contractForAppType.live === "Y",
//     with_sma: contractForAppType.with_sma === "Y",
//     active: contractForAppType.active === "Y",
//     fs_live: contractForAppType.fs_live === "Y",
//     cas: contractForAppType.cas === "Y"
//   }
// }));

//   }
// }, [activeTopTab, clientcontracts]);

const [hasLoadedToggles, setHasLoadedToggles] = useState(false);

useEffect(() => {
  if (clientcontracts[activeTopTab] && !hasLoadedToggles) {
    const contract = clientcontracts[activeTopTab];
    setToggles(prev => ({
      ...prev,
      [activeTopTab]: {
        live: contract.live === "Y",
        with_sma: contract.with_sma === "Y",
        active: contract.active === "Y",
        fs_live: contract.fs_live === "Y",
        cas: contract.cas === "Y"
      }
    }));
    setHasLoadedToggles(true);
  }
}, [clientcontracts, activeTopTab]);




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

      const response = await fetch(`${apiBase}/load-client-data?client_code=${clientCode}&app_type=${activeTopTab}`,{ headers });
      
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

      const receivedTechnicians = data.technicians || [];

      const filteredTechnicians = receivedTechnicians.filter(t => t.app_type === activeTopTab);

      const technicianDisplayNames = filteredTechnicians.map(tech => {
        const name = Object.entries(technicianCodeMap).find(([_, c]) => c === tech.tech_code)?.[0] || tech.tech_code;
        return `${name} (${tech.tech_code})`;
      });


        const clientData = data.clients || {};
        
        const contracts = Array.isArray(data.client_contract)
          ? data.client_contract
          : data.client_contract
            ? [data.client_contract]
            : [];


        const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (`0${d.getMonth() + 1}`).slice(-2);
        const day = (`0${d.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
      };

        // ✅ Filter by current app type// After filtering contracts by activeTopTab
        const contractsForAppType = contracts.filter(c => c.app_type === activeTopTab);
        const contractForAppType = contractsForAppType.length > 0 ? contractsForAppType[0] : {};

        // Format dates before setting
        const formattedContractForAppType = contractForAppType
          ? {
              ...contractForAppType,
              contract_date: formatDate(contractForAppType.contract_date),
              sma_date: formatDate(contractForAppType.sma_date),
            }
          : {};

        // Set clientcontracts as a single object, not an array
        // setClientContracts(contractForAppType);
        // setHasLoadedToggles(false);
        // setClientContracts(formattedContractForAppType);

        setClientContracts(prev => ({
  ...prev,
  [activeTopTab]: formattedContractForAppType
}));


      //   setClientContracts(prev => ({
      //   ...prev,
      //   [activeTopTab]: contractForAppType
      // }));

        // const formatDate = (dateStr) => {
        //   if (!dateStr) return '';
        //   return new Date(dateStr).toISOString().split('T')[0];
        // };


        const transformedClient = {
          client_code: clientData.client_code || '',
          client_name: clientData.client_name || '',
          main_address: clientData.main_address || '',
          industry: clientData.industry || '',
          remote_id: clientData.remote_id || '',
          remote_pw: clientData.remote_pw || '',
          server_pw: clientData.server_pw || '',
          helpdesk: clientData.helpdesk || '',

          // Optional: Move contract details by app_type
        client_contract: contractsForAppType.map(c => ({
            app_type: c.app_type,
            training_days: Number(c.training_days) || 0,
            training_days_consumed: Number(c.training_days_consumed) || 0,
            post_training_days: Number(c.post_training_days) || 0,
            post_training_days_consumed: Number(c.post_training_days_consumed) || 0,
            fs_generation_contract: Number(c.fs_generation_contract) || 0,
            fs_generation_consumed: Number(c.fs_generation_consumed) || 0,
            numberOfUsers: c.numberOfUsers || 0,
            numberOfEmployees: c.numberOfEmployees || 0,
            // contract_date: c.contract_date || '',
            contract_date: formatDate(c.contract_date || ''),
            sma_date: formatDate(c.sma_date || ''),
            cas: c.cas || 'N',
            live: c.live || 'N',
            with_sma: c.with_sma || 'N',
            fs_live: c.fs_live || 'N',
            active: c.active || 'N',
            sma_days: Number(c.sma_days) || 0,
          }))
        };

        setToggles(prev => ({
          ...prev,
          [activeTopTab]: {
            cas: contractForAppType.cas === "Y",
            fs_live: contractForAppType.fs_live === "Y",
            live: contractForAppType.live === "Y",
            with_sma: contractForAppType.with_sma === "Y",
            active: contractForAppType.active === "Y"
          }
        }));

          setClient(transformedClient);
          // setClientContracts(contractsForAppType);  // ✅ Only contracts matching activeTopTab


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


//   const handleToggle = (key) => {
//   const newValue = !toggles[key];
//   setToggles(prev => ({ ...prev, [key]: newValue }));
//   setClient(prev => ({ ...prev, [key]: newValue ? "Y" : "N" }));
// };

// const handleToggle = (key) => {
//   setToggles(prev => {
//     const prevForTab = prev[activeTopTab] || {};
//     const newValue = !prevForTab[key];

//     return {
//       ...prev,
//       [activeTopTab]: {
//         ...prevForTab,
//         [key]: newValue,
//       }
//     };
//   });

//   // Also update clientcontracts for the activeTopTab (toggle saved in contract)
//   setClientContracts(prev => ({
//     ...prev,
//     [key]: !prev[key] ? "Y" : "N"
//   }));
// };

const defaultToggleState = {
  cas: false,
  live: false,
  with_sma: false,
  fs_live: false,
  active: false,
};
const initialToggleState = {
  cas: false,
  live: false,
  with_sma: false,
  fs_live: false,
  active: false,
};

const handleToggle = (key) => {
  setToggles(prev => {
    // Current toggles for active tab, fallback to defaults if missing
    const currentTabToggles = prev[activeTopTab] || { ...initialToggleState };

    console.log('Before toggle:', currentTabToggles);

    // Toggle only the clicked key
    const newValue = !currentTabToggles[key];

    const updatedTabToggles = {
      ...currentTabToggles,
      [key]: newValue,
    };

    console.log('After toggle:', updatedTabToggles);

    return {
      ...prev,
      [activeTopTab]: updatedTabToggles,
    };
  });

  setClientContracts(prev => {
    const currentContract = prev[activeTopTab] || {
      app_type: activeTopTab,
      cas: "N",
      live: "N",
      with_sma: "N",
      fs_live: "N",
      active: "N",
      training_days: 0,
      training_days_consumed: 0,
      post_training_days: 0,
      post_training_days_consumed: 0,
      fs_generation_contract: 0,
      fs_generation_consumed: 0,
      numberOfUsers: 0,
      numberOfEmployees: 0,
      contract_date: '',
      sma_date: '',
      sma_days: 0
    };

    const updatedContract = {
      ...currentContract,
      [key]: currentContract[key] === "Y" ? "N" : "Y"
    };

    return {
      ...prev,
      [activeTopTab]: updatedContract,
    };
  });
};




useEffect(() => {
  if (clientcontracts[activeTopTab]) {
    const contract = clientcontracts[activeTopTab];

    setToggles(prev => ({
      ...prev,
      [activeTopTab]: {
        ...prev[activeTopTab], // <-- preserve previous toggle state
        cas: contract.cas === "Y",
        live: contract.live === "Y",
        with_sma: contract.with_sma === "Y",
        fs_live: contract.fs_live === "Y",
        active: contract.active === "Y"
      }
    }));
  }
}, [clientcontracts, activeTopTab]);






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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setClient(prev => ({ ...prev, [name]: value }));
  // };

const handleChange = (e) => {
  const { name, value } = e.target;
  console.log(`handleChange: ${name} = ${value}`);

  if ([
    'training_days',
    'training_days_consumed',
    'post_training_days',
    'post_training_days_consumed',
    'fs_generation_contract',
    'fs_generation_consumed',
    'numberOfUsers',
    'numberOfEmployees',
    'contract_date',
    'sma_date',
    'cas',
    'live',
    'with_sma',
    'fs_live',
    'active',
    'sma_days'
  ].includes(name)) {
    setClientContracts(prev => ({
      ...prev,
      [name]: name.includes('days') || name.includes('number') ? Number(value) : value
    }));
  } else {
    setClient(prev => ({ ...prev, [name]: value }));
  }
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

const syncTogglesToContracts = () => {
  setClientContracts(prev => {
    const updated = { ...prev };
    const currentToggles = toggles[activeTopTab] || {};

    const contract = updated[activeTopTab] || {};
    const newContract = {
      ...contract,
      cas: currentToggles.cas ? "Y" : "N",
      live: currentToggles.live ? "Y" : "N",
      with_sma: currentToggles.with_sma ? "Y" : "N",
      fs_live: currentToggles.fs_live ? "Y" : "N",
      active: currentToggles.active ? "Y" : "N"
    };

    updated[activeTopTab] = newContract;
    return updated;
  });
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

    // Get technician inputs for current tab, filtering empty strings
    const techniciansToSave = (tabTechnicians[activeTopTab] || []).filter(t => t !== "");

    // Flatten all technicians across tabs with module type
    const clientTechnicalsPayload = Object.entries(tabTechnicians).flatMap(
      ([appType, technicians]) =>
        technicians
          .filter(t => t !== "") // remove empty inputs
          .map(t => {
            const matches = t.match(/\(([^)]+)\)/);
            const tech_code = matches ? matches[1] : t;
            return {
              tech_code,
              app_type: appType
            };
          })
    );

    const allSelectedModules = Object.values(tabModules).flat();

  // const selectedModulesForActiveTab = tabModules[activeTopTab] || [];
  // const allowedModules = tabMainModules[activeTopTab] || [];
  // const filteredModules = selectedModulesForActiveTab.filter(module =>
  //   allowedModules.includes(module)
  // );

  // const clientModulesPayload = filteredModules.map(moduleName => ({
  //   module_name: moduleName,
  //   module_code: moduleCodeMap[moduleName] || null,
  //   module_type: activeTopTab,
  // }));

  const selectedModulesForActiveTab = tabModules[activeTopTab] || [];

  const clientModulesPayload = selectedModulesForActiveTab.map(moduleName => ({
    module_name: moduleName,
    module_code: moduleCodeMap[moduleName] || null,
    module_type: activeTopTab,
  }));


// Find the contract entry for the current active tab (app_type)
// const contract = (client.client_contract || []).find(c => c.app_type === activeTopTab) || {};

// const togglesToContract = {
//   cas: toggles.cas ? "Y" : "N",
//   live: toggles.live ? "Y" : "N",
//   with_sma: toggles.with_sma ? "Y" : "N",
//   fs_live: toggles.fs_live ? "Y" : "N",
//   active: toggles.active ? "Y" : "N"
// };

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

const togglesToContract = mapTogglesToYN(toggles[activeTopTab] || {});

const clientContractPayload = [{
  app_type: activeTopTab,
  training_days: Number(clientcontracts.training_days) || 0,
  training_days_consumed: Number(clientcontracts.training_days_consumed) || 0,
  post_training_days: Number(clientcontracts.post_training_days) || 0,
  post_training_days_consumed: Number(clientcontracts.post_training_days_consumed) || 0,
  fs_generation_contract: Number(clientcontracts.fs_generation_contract) || 0,
  fs_generation_consumed: Number(clientcontracts.fs_generation_consumed) || 0,
  numberOfUsers: Number(clientcontracts.numberOfUsers) || 0,
  numberOfEmployees: Number(clientcontracts.numberOfEmployees) || 0,
  // contract_date: clientcontracts.contract_date || '',
  contract_date: formatDate(clientcontracts.contract_date || ''),
  sma_date: formatDate(clientcontracts.sma_date || ''),
  cas: togglesToContract.cas,
  live: togglesToContract.live,
  with_sma: togglesToContract.with_sma,
  fs_live: togglesToContract.fs_live,
  active: togglesToContract.active,
  sma_days: Number(clientcontracts.sma_days) || 0
}];


// const clientContractPayload = [{
//   app_type: activeTopTab,
//   training_days: Number(clientcontracts.training_days) || 0,
//   training_days_consumed: Number(clientcontracts.training_days_consumed) || 0,
//   post_training_days: Number(clientcontracts.post_training_days) || 0,
//   post_training_days_consumed: Number(clientcontracts.post_training_days_consumed) || 0,
//   fs_generation_contract: Number(clientcontracts.fs_generation_contract) || 0,
//   fs_generation_consumed: Number(clientcontracts.fs_generation_consumed) || 0,
//   numberOfUsers: Number(clientcontracts.numberOfUsers) || 0,
//   numberOfEmployees: Number(clientcontracts.numberOfEmployees) || 0,
//   contract_date: clientcontracts.contract_date || '',
//   cas: clientcontracts.cas || 'N',
//   live: clientcontracts.live || 'N',
//   with_sma: clientcontracts.with_sma || 'N',
//   fs_live: clientcontracts.fs_live || 'N',
//   active: clientcontracts.active || 'N',
//   sma_days: Number(clientcontracts.sma_days) || 0
// }];





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
          // contract_date: client.contract_date,
          industry: client.industry,
          remote_id: client.remote_id,
          remote_pw: client.remote_pw,
          server_pw: client.server_pw,
          // cas: client.cas,
          // live: client.live,
          // with_sma: client.with_sma,
          // fs_live: client.fs_live,
          // active: client.active,
          // cal: client.cal,
          // sma_days: client.sma_days,
          // training_days: client.training_days,
          // training_days_consumed: client.training_days_consumed ?? 0,
          // post_training_days: client.post_training_days,
          // post_training_days_consumed: client.post_training_days_consumed ?? 0,
          // fs_generation_consumed: client.fs_generation_consumed ?? 0,
          contact_persons: client.contact_persons,
          helpdesk: client.helpdesk,  
          client_modules: clientModulesPayload,
          client_technicals: clientTechnicalsPayload,
          client_contract: clientContractPayload,
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
    <div className="p-4 bg-white min-h-screen">

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

{/* APPLICATION TABS */}
<div className="mt-6 text-sm lg:text-base bg-blue-100">
  <div className="grid grid-cols-2 sm:flex sm:justify-between bg-blue-600 text-white rounded-t-xl px-4 py-2 gap-2">
    {["FINANCIALS", "HR-PAY", "REALTY", "WMS"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTopTab(tab)}
        className={`w-full text-center px-4 py-2 font-semibold rounded-t-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white
          ${
            activeTopTab === tab
              ? "bg-white text-blue-600 shadow-md"
              : "opacity-80 hover:opacity-100"
          }`}
      >
        {tab}
      </button>
    ))}
  </div>


  {/* Financials Content */}
  {activeTopTab === "FINANCIALS" && (
  <div className="p-4 space-y-6">

  {/* Contract Details + Toggles in One Row */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* Contract Section */}
    <div className="bg-white rounded-xl shadow p-4 border">
      <h2 className="text-lg font-semibold text-blue-800 mb-4">Contract Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Signed Contract Date</label>
          <input
            type="date"
            name="contract_date"
            value={clientcontracts.contract_date ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SMA Renewal Date</label>
          <input
            type="date"
            name="sma_date"
            value={clientcontracts.sma_date ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No. of Users</label>
          <input
            type="number"
            name="numberOfUsers"
            value={clientcontracts.numberOfUsers ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>

     {/* Toggles */}
    <div className="bg-white rounded-xl shadow p-4 border">
    <h2 className="text-lg font-semibold text-blue-800 mb-4">Status Flags</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {toggleFields
          .filter(({ key }) => (toggleVisibilityMap[activeTopTab] ?? []).includes(key))
          .map(({ label, key }) => (
            <div key={key} className="flex flex-col items-center w-20">
              <span className="text-sm font-medium text-gray-600 text-center">{label}</span>
              <button
                className={`relative w-10 h-6 transition duration-200 ease-in-out rounded-full ${
                  toggles[activeTopTab]?.[key] ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                onClick={() => handleToggle(key)}
              >
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    toggles[activeTopTab]?.[key] ? 'translate-x-4' : ''
                  }`}
                />
              </button>
            </div>
          ))}
      </div>
    </div>



    </div>


    {/* Training Days Section */}
    <div className="bg-white rounded-xl shadow p-4 border">
      <h2 className="text-lg font-semibold text-blue-800 mb-4">Contract Mandays</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
        {/* Training Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Training Days</label>
          <input
            type="number"
            name="training_days"
            value={clientcontracts.training_days ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-700 mb-1">(Consumed)</label>
          <input
            type="number"
            name="training_days_consumed"
            value={clientcontracts.training_days_consumed ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-blue-300 rounded-md text-sm"
          />
        </div>

        {/* Post Training Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Post Training Days</label>
          <input
            type="number"
            name="post_training_days"
            value={clientcontracts.post_training_days ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-700 mb-1">(Consumed)</label>
          <input
            type="number"
            name="post_training_days_consumed"
            value={clientcontracts.post_training_days_consumed ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-blue-300 rounded-md text-sm"
          />
        </div>

        {/* FS Generation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">FS Generation</label>
          <input
            type="number"
            name="fs_generation_contract"
            value={clientcontracts.fs_generation_contract ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-700 mb-1">(Consumed)</label>
          <input
            type="number"
            name="fs_generation_consumed"
            value={clientcontracts.fs_generation_consumed ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-blue-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>

   

  </div>
)}



  {/* HRPAY Content */}
  {activeTopTab === "HR-PAY" && (
  <div className="p-4 space-y-6">

  {/* Contract Details + Toggles in One Row */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* Contract Section */}
    <div className="bg-white rounded-xl shadow p-4 border">
      <h2 className="text-lg font-semibold text-blue-800 mb-4">Contract Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Signed Contract Date</label>
          <input
            type="date"
            name="contract_date"
            value={clientcontracts.contract_date ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SMA Renewal Date</label>
          <input
            type="date"
            name="sma_date"
            value={clientcontracts.sma_date ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No. of Users</label>
          <input
            type="number"
            name="numberOfUsers"
            value={clientcontracts.numberOfUsers ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No. of Employees</label>
          <input
            type="number"
            name="numberOfEmployees"
            value={clientcontracts.numberOfEmployees ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>

     {/* Toggles */}
    <div className="bg-white rounded-xl shadow p-4 border">
    <h2 className="text-lg font-semibold text-blue-800 mb-4">Status Flags</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {toggleFields
          .filter(({ key }) => (toggleVisibilityMap[activeTopTab] ?? []).includes(key))
          .map(({ label, key }) => (
            <div key={key} className="flex flex-col items-center w-20">
              <span className="text-sm font-medium text-gray-600 text-center">{label}</span>
              <button
                className={`relative w-10 h-6 transition duration-200 ease-in-out rounded-full ${
                  toggles[activeTopTab]?.[key] ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                onClick={() => handleToggle(key)}
              >
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    toggles[activeTopTab]?.[key] ? 'translate-x-4' : ''
                  }`}
                />
              </button>
            </div>
          ))}
      </div>
    </div>



    </div>


    {/* Training Days Section */}
    <div className="bg-white rounded-xl shadow p-4 border">
      <h2 className="text-lg font-semibold text-blue-800 mb-4">Contract Mandays</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Training Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Training Days</label>
          <input
            type="number"
            name="training_days"
            value={clientcontracts.training_days ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-700 mb-1">(Consumed)</label>
          <input
            type="number"
            name="training_days_consumed"
            value={clientcontracts.training_days_consumed ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-blue-300 rounded-md text-sm"
          />
        </div>

        {/* Post Training Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Post Training Days</label>
          <input
            type="number"
            name="post_training_days"
            value={clientcontracts.post_training_days ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-700 mb-1">(Consumed)</label>
          <input
            type="number"
            name="post_training_days_consumed"
            value={clientcontracts.post_training_days_consumed ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-blue-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>

   

  </div> 
)}

  {/* REALTY Content */}
  {activeTopTab === "REALTY" && (
  <div className="p-4 space-y-6">

  {/* Contract Details + Toggles in One Row */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* Contract Section */}
    <div className="bg-white rounded-xl shadow p-4 border">
      <h2 className="text-lg font-semibold text-blue-800 mb-4">Contract Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Signed Contract Date</label>
          <input
            type="date"
            name="contract_date"
            value={clientcontracts.contract_date ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SMA Renewal Date</label>
          <input
            type="date"
            name="sma_date"
            value={clientcontracts.sma_date ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No. of Users</label>
          <input
            type="number"
            name="numberOfUsers"
            value={clientcontracts.numberOfUsers ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>

     {/* Toggles */}
    <div className="bg-white rounded-xl shadow p-4 border">
    <h2 className="text-lg font-semibold text-blue-800 mb-4">Status Flags</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {toggleFields
          .filter(({ key }) => (toggleVisibilityMap[activeTopTab] ?? []).includes(key))
          .map(({ label, key }) => (
            <div key={key} className="flex flex-col items-center w-20">
              <span className="text-sm font-medium text-gray-600 text-center">{label}</span>
              <button
                className={`relative w-10 h-6 transition duration-200 ease-in-out rounded-full ${
                  toggles[activeTopTab]?.[key] ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                onClick={() => handleToggle(key)}
              >
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    toggles[activeTopTab]?.[key] ? 'translate-x-4' : ''
                  }`}
                />
              </button>
            </div>
          ))}
      </div>
    </div>



    </div>


    {/* Training Days Section */}
    <div className="bg-white rounded-xl shadow p-4 border">
      <h2 className="text-lg font-semibold text-blue-800 mb-4">Contract Mandays</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Training Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Training Days</label>
          <input
            type="number"
            name="training_days"
            value={clientcontracts.training_days ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-700 mb-1">(Consumed)</label>
          <input
            type="number"
            name="training_days_consumed"
            value={clientcontracts.training_days_consumed ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-blue-300 rounded-md text-sm"
          />
        </div>

        {/* Post Training Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Post Training Days</label>
          <input
            type="number"
            name="post_training_days"
            value={clientcontracts.post_training_days ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-700 mb-1">(Consumed)</label>
          <input
            type="number"
            name="post_training_days_consumed"
            value={clientcontracts.post_training_days_consumed ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-blue-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>

   

  </div> 
               
)}

  {/* WMS Content */}
  {activeTopTab === "WMS" && (
  <div className="p-4 space-y-6">

  {/* Contract Details + Toggles in One Row */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* Contract Section */}
    <div className="bg-white rounded-xl shadow p-4 border">
      <h2 className="text-lg font-semibold text-blue-800 mb-4">Contract Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Signed Contract Date</label>
          <input
            type="date"
            name="contract_date"
            value={clientcontracts.contract_date ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SMA Renewal Date</label>
          <input
            type="date"
            name="sma_date"
            value={clientcontracts.sma_date ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No. of Users</label>
          <input
            type="number"
            name="numberOfUsers"
            value={clientcontracts.numberOfUsers ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>

     {/* Toggles */}
    <div className="bg-white rounded-xl shadow p-4 border">
    <h2 className="text-lg font-semibold text-blue-800 mb-4">Status Flags</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {toggleFields
          .filter(({ key }) => (toggleVisibilityMap[activeTopTab] ?? []).includes(key))
          .map(({ label, key }) => (
            <div key={key} className="flex flex-col items-center w-20">
              <span className="text-sm font-medium text-gray-600 text-center">{label}</span>
              <button
                className={`relative w-10 h-6 transition duration-200 ease-in-out rounded-full ${
                  toggles[activeTopTab]?.[key] ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                onClick={() => handleToggle(key)}
              >
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    toggles[activeTopTab]?.[key] ? 'translate-x-4' : ''
                  }`}
                />
              </button>
            </div>
          ))}
      </div>
    </div>



    </div>


    {/* Training Days Section */}
    <div className="bg-white rounded-xl shadow p-4 border">
      <h2 className="text-lg font-semibold text-blue-800 mb-4">Contract Mandays</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Training Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Training Days</label>
          <input
            type="number"
            name="training_days"
            value={clientcontracts.training_days ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-700 mb-1">(Consumed)</label>
          <input
            type="number"
            name="training_days_consumed"
            value={clientcontracts.training_days_consumed ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-blue-300 rounded-md text-sm"
          />
        </div>

        {/* Post Training Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Post Training Days</label>
          <input
            type="number"
            name="post_training_days"
            value={clientcontracts.post_training_days ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-700 mb-1">(Consumed)</label>
          <input
            type="number"
            name="post_training_days_consumed"
            value={clientcontracts.post_training_days_consumed ?? ''}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-blue-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>

   

  </div> 


)}

      {/* Modules Section */}
      <div className="p-4 space-y-6">

        {/* Modules & Technicians Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Main Modules Card */}
          <div className="bg-white rounded-xl shadow p-4 border">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Modules / Services</h3>
            <div className="space-y-2">
              {currentMainModules.map((module) => (
                <label key={module} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={currentSelectedModules.includes(module)}
                    onChange={() => handleModuleToggle(module)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{module}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Other Modules Card */}
          <div className="bg-white rounded-xl shadow p-4 border">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Other Modules</h3>
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
                  <label key={module} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={toggleModule}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{module}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Technicians Card */}
          <div className="bg-white rounded-xl shadow p-4 border">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Technical Assigned</h3>
            <div className="space-y-3">
              {technicianInputs.map((tech, index) => {
                const techValue = tech.includes(" (") ? tech.split(" (")[0] : tech;
                return (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <select
                      value={techValue}
                      onChange={(e) => handleTechnicianChange(index, e.target.value)}
                      className={`flex-1 p-2 border border-gray-300 rounded-md text-sm ${
                        techValue === '' ? 'text-blue-700' : 'text-gray-800'
                      }`}
                    >
                      <option value="">Select Technical</option>
                      {technicians.map((name) => (
                        <option
                          key={name}
                          value={name}
                          disabled={
                            technicianInputs.some(t => t.startsWith(`${name} (`)) &&
                            !tech.startsWith(`${name} (`)
                          }
                        >
                          {name} ({technicianCodeMap[name]})
                        </option>
                      ))}
                    </select>
                    {index === technicianInputs.length - 1 ? (
                      <button
                        type="button"
                        onClick={addTechnicianInput}
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 w-full sm:w-9 h-9 flex items-center justify-center"
                      >
                        <FaPlus />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeTechnicianInput(index)}
                        className="bg-red-600 text-white p-2 rounded hover:bg-red-700 w-full sm:w-9 h-9 flex items-center justify-center"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>



    {/* Help Desk on separate row */}

<div className="bg-white rounded-xl shadow p-4 border">
  <div className="flex items-center justify-start mb-4">
    <h2 className="text-lg font-semibold text-blue-800 pr-2">HelpDesk Details  </h2>
    {!isEditingHelpdesk && (
      <button
        type="button"
        onClick={() => setIsEditingHelpdesk(true)}
        className="text-lg text-blue-600 hover:underline whitespace-nowrap font-bold"
      >
         (Click to Edit URL)
      </button>
    )}
  </div>

  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
    <div className="w-full">
      {!isEditingHelpdesk ? (
        <div className="text-base font-semibold break-all text-blue-600 hover:underline">
          {client.helpdesk ? (
            <a
              href={client.helpdesk.startsWith('http') ? client.helpdesk : `https://${client.helpdesk}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {client.helpdesk}
            </a>
          ) : (
            <span className="text-gray-400 italic">No link provided</span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="helpdesk"
            placeholder="Enter Help Desk URL"
            value={client.helpdesk || ""}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-sm w-full"
          />
          <button
            type="button"
            onClick={() => setIsEditingHelpdesk(false)}
            className="text-base text-blue-600 hover:underline whitespace-nowrap font-bold"
          >
            Done
          </button>
        </div>
      )}
    </div>
  </div>
</div>



        {/* Save Button */}
        <div className="flex justify-center pt-6">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-28 py-2 font-semibold rounded-lg shadow-md transition duration-300 ${
              isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-800 text-white"
            }`}
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {isViewMode ? "Updating..." : "Saving..."}
              </>
            ) : (
              isViewMode ? "Update" : "Save"
            )}
          </button>
        </div>
      </div>
      



        </div>







        {/* Bottom Tabs */}
        {/* <div className="flex flex-wrap justify-center mb-5 sm:justify-start gap-4 text-sm sm:gap-10 bg-blue-600 text-white rounded-t-md p-3 lg:gap-[150px] lg:text-base">
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
        </div> */}

        {/* APPLICATION TABS */}
<div className="mt-6 text-sm lg:text-base bg-blue-100">
  <div className="grid grid-cols-2 sm:flex sm:justify-between bg-blue-600 text-white rounded-t-xl px-4 py-2 gap-2">
  {["Contact Information", "Server Information", "Attachment", "SMA Information"].map((tab) => (
    <button
      key={tab}
      onClick={() => {
        setActiveTab(tab);
        if (tab === "Attachment") setSelectedAttachmentType(null);
      }}
      className={`w-full text-center px-4 py-2 font-semibold rounded-t-md transition-all duration-100
        ${
          activeTab === tab
            ? "bg-white text-blue-600 shadow-md border-b-2 border-blue-600"
            : "opacity-80 hover:opacity-100 hover:bg-blue-500"
        }`}
    >
      {tab}
    </button>
  ))}
</div>


        {/* Tab Content */}
        {activeTab === "Contact Information" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6 p-4">
            {(client.contact_persons || ["", ""]).map((person, index) => (
  <div key={index}>
    <label className="block font-medium text-gray-700 mb-2">
      Contact Person
    </label>
    <input
  type="text"
  placeholder="Contact"
  value={person}
  onChange={(e) => {
    const updatedContacts = [...(client.contact_persons || ["", ""])];
    updatedContacts[index] = e.target.value;
    setClient(prev => ({ ...prev, contact_persons: updatedContacts }));
  }}
  className="p-2 border border-gray-300 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
/>

  </div>
))}

          </div>
        )}

        {activeTab === "Server Information" && (
  <>
  {/* 4-column grid for Anydesk + Server Passwords */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6 p-4">
    {/* Anydesk ID */}
    <div>
      <label className="block font-medium text-gray-700 mb-2">
        Server's Anydesk ID
      </label>
      <input
        type="text"
        name="remote_id"
        placeholder="Server's Anydesk ID"
        value={client.remote_id || ""}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
        className="p-2 border border-gray-300 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
        className="p-2 border border-gray-300 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <div
        className="absolute top-[70%] right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
        onClick={() => setShowServerPw(!showServerPw)}
      >
        {showServerPw ? <EyeOff size={20} /> : <Eye size={20} />}
      </div>
    </div>
  </div>

  
</>

)}


 {/* Attachment Tab */}
{activeTab === "Attachment" && (
  <div>
    {/* Sub-tab buttons */}
    {/* <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-10 lg:gap-[150px] bg-blue-600 text-white rounded-t-md p-3 text-sm lg:text-base">
  {["Client Service Form", "Turn-Over Documents"].map((tab) => (
    <button
      key={tab}
      onClick={() => setSelectedAttachmentType(tab)}
      className={`relative pb-2 px-3 font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm ${
        selectedAttachmentType === tab
          ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white"
          : "opacity-70 hover:opacity-100"
      }`}
    >
      {tab}
    </button>
  ))}
</div> */}

<div className="grid grid-cols-2 sm:flex sm:justify-between bg-blue-600 text-white px-4 py-2 gap-2">
    {["Client Service Form", "Turn-Over Documents"].map((tab) => (
      <button
        key={tab}
      onClick={() => setSelectedAttachmentType(tab)}
        className={`w-full text-center px-4 py-2 font-semibold rounded-t-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white
          ${
            selectedAttachmentType === tab
              ? "bg-white text-blue-600 shadow-md"
              : "opacity-80 hover:opacity-100"
          }`}
      >
        {tab}
      </button>
    ))}
  </div>


    {/* File table */}
    {selectedAttachmentType && (
      <div className="bg-blue-100 rounded-b-md p-4">
    {/* Add File Button */}
    <div className="text-right mb-4">
      <button
        onClick={() => handleAddFileClick('clientService')}
        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-gray-300 rounded shadow-sm hover:bg-blue-700 transition"
      >
        <FaPlus className="text-gray-100 mr-2" />
        <span className="font-semibold text-gray-100">Add New File</span>
      </button>
    </div>

        
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="min-w-full bg-white border border-gray-300 text-sm">
        <thead className="bg-blue-500 text-gray-100 sticky top-0 z-10">
          <tr>
                <th className="p-3 text-left whitespace-nowrap">File Name</th>
                <th className="p-3 text-left whitespace-nowrap">Upload Date</th>
                <th className="p-3 text-left whitespace-nowrap">Signed Date</th>
                <th className="p-3 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clientServiceFiles.map((file) => (
                <tr
                  key={file.file_id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="p-3 whitespace-nowrap">{file.original_name}</td>
                  <td className="p-3 whitespace-nowrap">
                    {file.upload_date ? new Date(file.upload_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {file.signed_date ? new Date(file.signed_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-2">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleViewFile(file)}
                        className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full transition"
                        title="View"
                      >
                        <FaEye className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDownloadFile(file)}
                        className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-full transition"
                        title="Download"
                      >
                        <FaDownload className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file)}
                        className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full transition"
                        title="Delete"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
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
  <div className="bg-blue-100 rounded-b-md p-4">
    {/* Add File Button */}
    <div className="text-right mb-4">
      <button
        onClick={() => handleAddFileClick('smaInformation')}
        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-gray-300 rounded shadow-sm hover:bg-blue-700 transition"
      >
        <FaPlus className="text-gray-100 mr-2" />
        <span className="font-semibold text-gray-100">Add New File</span>
      </button>
    </div>

    {/* File Table */}
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="min-w-full bg-white border border-gray-300 text-sm">
        <thead className="bg-blue-500 text-gray-100 sticky top-0 z-10">
          <tr>
            <th className="p-3 text-left">File Name</th>
            <th className="p-3 text-left">Date Uploaded</th>
            <th className="p-3 text-left">Date Signed</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {smaInformationFiles.map((file) => (
            <tr key={file.file_id} className="border-b hover:bg-blue-50">
              <td className="p-2">{file.original_name}</td>
              <td className="p-2">
                {file.upload_date ? new Date(file.upload_date).toLocaleDateString() : 'N/A'}
              </td>
              <td className="p-2">
                <input
                  type="date"
                  value={file.signed_date || editedFiles[file.file_id] || ""}
                  onChange={(e) => {
                    setEditedFiles((prev) => ({
                      ...prev,
                      [file.file_id]: e.target.value,
                    }));
                  }}
                  className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
                />
              </td>
              <td className="p-2 text-center">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleViewFile(file)}
                    className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full transition"
                    title="View"
                  >
                    <FaEye className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDownloadFile(file)}
                    className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-full transition"
                    title="Download"
                  >
                    <FaDownload className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file)}
                    className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full transition"
                    title="Delete"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </td>

            </tr>
          ))}
          {smaInformationFiles.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500 italic">
                No files uploaded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
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
    </div>
  );
};

export default AddClientForm;