import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../Authentication/AuthContext";
import { useNavigate } from "react-router-dom";
import ClientLookupModal from "./ClientLookupModal"; // Import the new modal component
import { PostAPI  } from "../api";
import StatCard from "./StatCard";
import MiniTable from "./MiniTable";
import DashboardClientList from "./DashboardClientList";


import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FF69B4", "#8B0000"];

const CustomXAxisTick = ({ x, y, payload, data, dataKey }) => {
  const item = data.find(d => d[dataKey] === payload.value);
  const count = item ? item.client_count : '';

  return (
    <g transform={`translate(${x},${y + 10})`}>
      <text
        x={0}
        y={0}
        dy={0}
        textAnchor="middle"
        fill="#666"
        fontSize={14}
      >
        {payload.value}
      </text>
      <text
        x={0}
        y={15}
        dy={0}
        textAnchor="middle"
        fill="#333"
        fontSize={12}
        fontWeight="bold"
      >
        {count}
      </text>
    </g>
  );
};

const SystemsBarChart = ({ data }) => {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
      <h4 className="text-md font-bold mb-4">Top Applications</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={safeData} margin={{ bottom: 40 }}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis
            dataKey="system_code"
            interval={0}
            tick={<CustomXAxisTick data={safeData} dataKey="system_code" />}
            height={60}
          />
          {/* <YAxis allowDecimals={false} /> */}
          <Tooltip formatter={(value) => [value, "count"]} />
          <Bar dataKey="client_count" name="">
            {safeData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const SystemsPieChart = ({ data }) => {
  const safeData = Array.isArray(data)
    ? data.map(d => ({ ...d, client_count: +d.client_count }))
    : [];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
      <h4 className="text-md font-bold mb-4">Top Applications</h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip formatter={(value) => [value, "Clients"]} />
          <Pie
            data={safeData}
            dataKey="client_count"
            nameKey="system_code"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {safeData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const SMABarChart = ({ data }) => {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
      <h4 className="text-md font-bold mb-4">SMA Count</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={safeData} margin={{ bottom: 40 }}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis
            dataKey="sma_type"
            interval={0}
            tick={<CustomXAxisTick data={safeData} dataKey="sma_type" />}
            height={60}
          />
          {/* <YAxis allowDecimals={false} /> */}
          <Tooltip formatter={(value) => [value, "count"]} />
          <Bar dataKey="client_count" name="">
            {safeData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


const SMAPieChart = ({ data }) => {
  const safeData = Array.isArray(data)
    ? data.map(d => ({ ...d, client_count: +d.client_count }))
    : [];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
      <h4 className="text-md font-bold mb-4">SMA Count</h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip formatter={(value) => [value, "Clients"]} />
          <Pie
            data={safeData}
            dataKey="client_count"
            nameKey="sma_type"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {safeData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};






const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

const [dashboard1, setDashboard1] = useState([]);
const [dashboard2, setDashboard2] = useState([]);

const fetchDashboardData = async () => {
  try {
    const response = await PostAPI(`getClientsdashboard?user=${user.id}&mode=Top10`);
    console.log("Dashboard API response:", response);

    if (response?.data?.success) {
      const clientsData = response.data.dashboard1 || [];
      setDashboard1(clientsData);
      setDashboard2(response.data.dashboard2 || []);
      setClients(clientsData); // <-- Important fix
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};


useEffect(() => {
  if (user?.id) {
    fetchDashboardData();
  }
}, [user]);


  const handleLogout = () => {
    logout();
    navigate("/");
  };


  const fetchDataByMode = async (mode) => {
  try {
    const res = await PostAPI(`getClientsdashboard?user=${user.id}&mode=${mode}`);
    return res.data;
  } catch (e) {
    console.error(`Error fetching ${mode}`, e);
    return null;
  }
};

const [contractsSummary, setContractsSummary] = useState([]);
const [smaSummary, setSmaSummary] = useState([]);
const [activeClients, setActiveClients] = useState([]);
const [systemUsage, setSystemUsage] = useState([]);
const [topClients, setTopClients] = useState([]);
const [ExpiredSMA, setExpiredSMA] = useState([]);
const [upcomingExpirations, setUpcomingExpirations] = useState([]);
const [SMADashboard, setSMADashboard] = useState([]);
useEffect(() => {
  if (!user?.id) return;

  const loadDashboard = async () => {
    const [
      contractsSummary,
      smaSummary,
      activeClients,
      systemUsage,
      topClients,
      ExpiredSMA,
      expirations,
      SMADashboard,
    ] = await Promise.all([
      fetchDataByMode("ContractsSummary"),
      fetchDataByMode("ClientsWithSMA"),
      fetchDataByMode("ActiveClients"),
      fetchDataByMode("SystemUsage"),
      fetchDataByMode("TopActiveClients"),
      fetchDataByMode("ExpiredSMA"),
      fetchDataByMode("UpcomingExpirations"),
      fetchDataByMode("SMADashboard"),
    ]);

    console.log("ContractsSummary:", contractsSummary);
    console.log("ClientsWithSMA:", smaSummary);
    console.log("ActiveClients:", activeClients);
    console.log("SystemUsage:", systemUsage);
    console.log("TopActiveClients:", topClients);
    console.log("UpcomingExpirations:", expirations);
    console.log("ExpiredSMA:", ExpiredSMA);
    console.log("SMADashboard:", SMADashboard);

    setContractsSummary(contractsSummary?.dashboard1 || []);
    setSmaSummary(smaSummary?.dashboard1 || []);
    setActiveClients(activeClients?.dashboard1 || []);
    setSystemUsage(systemUsage?.dashboard1 || []);
    setTopClients(topClients?.dashboard1 || []);
    setExpiredSMA(ExpiredSMA?.dashboard1 || []);
    setUpcomingExpirations(expirations?.dashboard1 || []);
    setSMADashboard(SMADashboard?.dashboard1 || []);
  };

  loadDashboard();
}, [user]);


  return (
    
<div className="flex h-screen font-poppins">

      <main className="flex-1 p-4 bg-white">
        <div className="relative flex-1 p-2">
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
          <h2 className="text-3xl font-bold mt-10 mb-4">Welcome, {user ? user.username : "Guest"}!</h2>
        </div>

        {/* My Clients Section */}
        {/* <div className="bg-white p-6 w-[450px] rounded-lg shadow-md relative">
          <h3 className="text-lg font-bold mb-4">My Clients</h3>
          {clients.length === 0 ? (
            <p className="text-gray-500">Loading clients...</p>
          ) : (
            <>
              <ul className="space-y-2 text-md text-sm">
                {clients.map((client, index) => (
                  <li key={index} className="text-gray-900">{client.client_name}</li>
                ))}
              </ul>
              <hr className="mt-3 mb-2"/>
              <button
                // onClick={() => setIsModalOpen(true)}
                onClick={() => navigate('/clients')}
                className="absolute bottom-2 right-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                View All <span className="ml-1">→</span>
              </button>
            </>
          )}
        </div> */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
  <SystemsBarChart data={systemUsage || []} />
  <SMABarChart data={SMADashboard || []} />
</div>

{/* Dashboard Summary Section */}
<div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
  <StatCard 
    title="Active Clients" 
    value={Number(activeClients?.[0]?.total_active_clients) || 0}  
  />
  <StatCard 
    title="Clients with SMA" 
    value={Number(smaSummary?.[0]?.with_sma) || 0} 
    color="blue" 
  />
  <StatCard 
    title="Expiring SMA" 
    value={Number(smaSummary?.[0]?.expiring_soon) || 0} 
    color="yellow" 
  />
</div>



<div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 shadow-xl pb-2">
  {/* <DashboardClientList title="Top Active Clients" data={topClients || []} /> */}
  <MiniTable title="Expired SMA of Active Clients (as of Today)" data={ExpiredSMA || []} />
  <MiniTable title="Upcoming SMA Expirations of Active Clients (within 60 Days)" data={upcomingExpirations || []} />
  {/* <SystemsBarChart data={systemUsage || []} /> */}

</div>





        {/* Client Lookup Modal */}
        <ClientLookupModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          clients={allClients}
        />
      </main>
    </div>
  );
};

export default Dashboard;