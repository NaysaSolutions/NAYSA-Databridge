import React, { useState, useEffect } from "react";
import AddClientForm from "./AddClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faSignOutAlt, faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext";

const ClientsInformation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const itemsPerPage = 15;

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "client_name", // Default sort by client name
    direction: "asc"   // Default ascending order
  });

  const [searchFields, setSearchFields] = useState({
    client_code: "",
    client_name: "",
    main_address: "",
    contract_date: "",
    cas: "",
    cal: "",
    training_days: "",
    sma_days: "",
    post_training_days: "",
    live: "",
    with_sma: "",
    fs_live: ""
  });

  useEffect(() => {
    fetchClients();
  }, []);

  // Sort clients whenever sortConfig or filteredClients changes
  useEffect(() => {
    const sortedItems = [...filteredClients].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredClients(sortedItems);
  }, [sortConfig]);

  const fetchClients = async () => {
    try {
      const response = await fetch("http://192.168.1.201:82/api/getClients", {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setClients(data);
      setFilteredClients(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e, key) => {
    const value = e.target.value.toLowerCase();
    const updatedSearchFields = { ...searchFields, [key]: value };
    setSearchFields(updatedSearchFields);

    const filtered = clients.filter((client) => {
      return Object.entries(updatedSearchFields).every(([field, searchValue]) => {
        if (!searchValue) return true;
        const fieldValue = client[field];
        return fieldValue && fieldValue.toString().toLowerCase().includes(searchValue);
      });
    });

    setFilteredClients(filtered);
    setCurrentPage(1);
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === "asc" ? faSortUp : faSortDown;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentItems = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (showAddClientForm) return <AddClientForm />;

  return (
    <div className="p-6 bg-gray-100 font-poppins ml-64">
      {/* Header */}
      <div className="absolute top-6 right-6 flex items-center space-x-4">
        <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-500 cursor-pointer" />
        <div className="relative">
          <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="cursor-pointer">
            <img src="3135715.png" alt="Profile" className="w-8 h-8 rounded-full" />
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
              <ul className="py-2 text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Title and Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Clients Information</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => setShowAddClientForm(true)}
        >
          Add New Clients
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-center text-gray-500">Loading clients...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
          <div className="max-h-[80vh] overflow-y-auto">
            <table className="w-full text-sm text-center border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="bg-blue-400 text-white text-left">
                  {[
                    { key: "client_code", label: "Client Code" },
                    { key: "client_name", label: "Client Name" },
                    { key: "main_address", label: "Main Address" },
                    { key: "contract_date", label: "Contract Date" },
                    { key: "cas", label: "CAS" },
                    { key: "cal", label: "User License" },
                    { key: "training_days", label: "Training Days" },
                    { key: "sma_days", label: "SMA Days" },
                    { key: "post_training_days", label: "Post Training Days" },
                    { key: "live", label: "Live" },
                    { key: "with_sma", label: "With SMA?" },
                    { key: "fs_live", label: "FS Live?" },
                    { key: "action", label: "Action" }
                  ].map(({ key, label }) => (
                    <th 
                      key={key} 
                      className="px-4 py-2 border text-center"
                      onClick={() => key !== "action" && requestSort(key)}
                    >
                      <div className="flex items-center justify-center">
                        {label}
                        {key !== "action" && (
                          <FontAwesomeIcon 
                            icon={getSortIcon(key)} 
                            className="ml-1 cursor-pointer" 
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
                <tr className="bg-gray-200 sticky top-[40px] z-10">
                  {Object.keys(searchFields).map((key) => (
                    <td key={key} className="px-2 py-1 border">
                      <input
                        type="text"
                        value={searchFields[key]}
                        onChange={(e) => handleSearchChange(e, key)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1 border"></td>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((client, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-100 transition">
                    <td className="px-4 py-2 border text-blue-600 font-sm">{client.client_code}</td>
                    <td className="px-4 py-2 border font-sm">{client.client_name}</td>
                    <td className="px-4 py-2 border font-sm">{client.main_address}</td>
                    <td className="px-4 py-2 border font-sm">{client.contract_date}</td>
                    <td className="px-4 py-2 border font-sm">{client.cas}</td>
                    <td className="px-4 py-2 border font-sm">{client.cal}</td>
                    <td className="px-4 py-2 border font-sm">{client.training_days}</td>
                    <td className="px-4 py-2 border font-sm">{client.sma_days}</td>
                    <td className="px-4 py-2 border font-sm">{client.post_training_days}</td>
                    <td className="px-4 py-2 border font-sm">{client.live}</td>
                    <td className="px-4 py-2 border font-sm">{client.with_sma}</td>
                    <td className="px-4 py-2 border font-sm">{client.fs_live}</td>
                    <td className="px-4 py-2 border font-sm">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => navigate("/Addclients", { state: client })}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
            <span className="text-sm text-gray-600">
              Showing {clients.length ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
              {Math.min(currentPage * itemsPerPage, clients.length)} of {clients.length}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsInformation;