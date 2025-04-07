import React, { useState, useEffect } from "react";
import AddClientForm from "./AddClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext"; 

const ClientsInformation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const itemsPerPage = 15;

  const [searchFields, setSearchFields] = useState({
    client_code: "",
    client_name: "",
    main_address: "",
    contract_date: "",
    cas: "",
    cal: "",
    training_days: "",
    sma_day: "",
    post_training_days: "",
    live: "",
    with_sma: "",
    fs_live: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/getClients", {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setClients(data);
      setFilteredClients(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentItems = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (showAddClientForm) return <AddClientForm />;

  const handleSearchChange = (e, key) => {
    const { value } = e.target;
    const updatedSearchFields = { ...searchFields, [key]: value };

    setSearchFields(updatedSearchFields);

    const allFieldsEmpty = Object.values(updatedSearchFields).every((val) => val === "");

    if (allFieldsEmpty) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter((app) =>
        Object.keys(updatedSearchFields).every((field) =>
          app[field]?.toString().toLowerCase().includes(updatedSearchFields[field].toLowerCase())
        )
      );
      setFilteredClients(filtered);
    }

    setCurrentPage(1);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-6 bg-gray-100 font-poppins ml-64">
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

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Clients Information</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        onClick={() => setShowAddClientForm(true)}>
          Add New Clients
        </button>
      </div>

      {loading ? (
  <p className="text-center text-gray-500">Loading clients...</p>
) : (
  <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
    {/* Scrollable Table Container */}
    <div className="max-h-[100vh] overflow-y-auto">
      <table className="w-full text-sm text-center border border-gray-200 rounded-lg shadow-md">
        {/* Sticky Header */}
        <thead className="text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
          <tr className="bg-blue-400 text-white text-left">
            <th className="px-4 py-2 border text-center">Client Code</th>
            <th className="px-4 py-2 border text-center">Client Name</th>
            <th className="px-4 py-2 border text-center">Main Address</th>
            <th className="px-4 py-2 border text-center">Contract Date</th>
            <th className="px-4 py-2 border text-center">CAS</th>
            <th className="px-4 py-2 border text-center">User License</th>
            <th className="px-4 py-2 border text-center">Training Days</th>
            <th className="px-4 py-2 border text-center">SMA Days</th>
            <th className="px-4 py-2 border text-center">Post Training Days</th>
            <th className="px-4 py-2 border text-center">Live</th>
            <th className="px-4 py-2 border text-center">With SMA?</th>
            <th className="px-4 py-2 border text-center">FS Live?</th>
            <th className="px-4 py-2 border text-center">Action</th>
          </tr>
          {/* Sticky Search Row */}
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentItems.map((client, index) => (
            <tr key={index} className="bg-white hover:bg-gray-100 transition">
              <td className="px-4 py-2 border text-blue-600 font-medium">{client.client_code}</td>
              <td className="px-4 py-2 border">{client.client_name}</td>
              <td className="px-4 py-2 border">{client.main_address}</td>
              <td className="px-4 py-2 border">{client.contract_date}</td>
              <td className="px-4 py-2 border">{client.cas}</td>
              <td className="px-4 py-2 border">{client.cal}</td>
              <td className="px-4 py-2 border">{client.training_days}</td>
              <td className="px-4 py-2 border">{client.sma_days}</td>
              <td className="px-4 py-2 border">{client.post_training_days}</td>
              <td className="px-4 py-2 border">{client.live}</td>
              <td className="px-4 py-2 border">{client.with_sma}</td>
              <td className="px-4 py-2 border">{client.fs_live}</td>
              <td className="px-4 py-2 border">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded"
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
    Showing {clients.length ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, clients.length)} of {clients.length}
  </span>
  <div className="flex space-x-2">
    <button
      onClick={handlePrev}
      disabled={currentPage === 1}
      className={`px-3 py-1 rounded-md ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
    >
      Prev
    </button>
    <button
      onClick={handleNext}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 rounded-md ${currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
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
