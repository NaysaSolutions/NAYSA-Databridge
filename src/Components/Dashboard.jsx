import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../Authentication/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth(); // Assuming logout function is available
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/getClients", {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const filteredClients = data.filter(
        (client) => String(client.tech_assigned).trim() === String(user.userId).trim()
      );

      setClients(filteredClients.slice(0, 10));
      setAllClients(filteredClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleLogout = () => {
    logout(); // Assuming logout function clears auth state
    navigate("/");
  };

  return (
    <div className="flex h-screen font-poppins ml-64">
      <main className="flex-1 p-6 bg-gray-50">
        <div className="relative flex-1 p-6 bg-gray-50">
          {/* Top Right Icons */}
          <div className="absolute top-0 right-0 flex items-center space-x-4">
            <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-500 cursor-pointer" />
            <div className="relative">
              <img
                src="3135715.png"
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
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

          {/* Welcome Message */}
          <h2 className="text-3xl font-bold mt-12">Welcome, {user ? user.username : "Guest"}!</h2>
        </div>

        {/* My Clients Section */}
        <div className="bg-white p-6 w-[450px] rounded-lg shadow-md relative">
          <h3 className="text-lg font-bold mb-4">My Clients</h3>
          {clients.length === 0 ? (
            <p className="text-gray-500">Loading clients...</p>
          ) : (
            <>
              <ul className="space-y-2 text-md">
                {clients.map((client, index) => (
                  <li key={index} className="text-gray-900">{client.client_name}</li>
                ))}
              </ul>
              <hr className="mt-3 mb-2"/>
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute bottom-2 right-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                View All <span className="ml-1">→</span>
              </button>
            </>
          )}
        </div>

        {/* Modal for All Clients */}
        {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 ml-[17%] rounded-lg shadow-lg w-[82%] max-h-[85vh] relative">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-3 right-2 text-gray-600 hover:text-red-600 transition duration-200"
      >
        <FontAwesomeIcon icon={faTimes} className="w-7 h-7" />
      </button>
      <h3 className="text-2xl font-bold mb-4">All Clients</h3>
      
      {/* Scrollable table container */}
      <div className="overflow-y-auto max-h-[70vh]">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              {[
                "Client Code", "Client Name", "Main Address", "Contract Date", "CAS",
                "User License", "Training Days", "SMA Days", "Post Training Days",
                "Live", "With SMA?", "FS Live?"
              ].map((header, idx) => (
                <th key={idx} className="px-4 py-2 border text-center">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allClients.map((client, index) => (
              <tr key={index} className="border">
                {["client_code", "client_name", "main_address", "contract_date", "cas", "user_license", "training_days", "sma_days", "post_training_days", "live", "with_sma", "fs_live"].map((field, i) => (
                  <td key={i} className="px-4 py-2 border text-center">
                    {client[field] || (typeof client[field] === "boolean" ? (client[field] ? "Yes" : "No") : "N/A")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;