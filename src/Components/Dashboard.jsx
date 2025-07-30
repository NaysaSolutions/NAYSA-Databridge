import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faSignOutAlt, faCog } from "@fortawesome/free-solid-svg-icons"; // Added faCog for settings
import { useAuth } from "../Authentication/AuthContext";
import { useNavigate } from "react-router-dom";
import ClientLookupModal from "./ClientLookupModal";
import { PostAPI } from "../api";
import StatCard from "./StatCard";
import MiniTable from "./MiniTable";
import MiniTableTraining from "./MiniTableTraining";
import MiniTableCAS from "./MiniTableCAS";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis, // Added YAxis for better bar chart readability
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LabelList,
  Label,
} from "recharts";

// Refined color palette with a modern, cohesive feel
const COLORS = [
  "#4A90E2", // Primary Blue
  "#7B68EE", // Medium Purple
  "#4CAF50", // Green
  "#FFC107", // Amber
  "#FF5722", // Deep Orange
  "#00BCD4", // Cyan
  "#9C27B0", // Purple
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State variables for dashboard data
  const [systemUsage, setSystemUsage] = useState([]);
  const [SMADashboard, setSMADashboard] = useState([]);
  const [Industry, setIndustry] = useState([]);
  const [SMAApplication, setSMAApplication] = useState([]);
  const [activeClients, setActiveClients] = useState([]);
  const [smaSummary, setSmaSummary] = useState([]);
  const [ExpiredSMA, setExpiredSMA] = useState([]);
  const [upcomingExpirations, setUpcomingExpirations] = useState([]);
  const [forInstallation, setforInstallation] = useState([]);
  const [forTraining, setforTraining] = useState([]);
  const [CasStatus, setCasStatus] = useState([]);

  // Client data for the lookup modal (assuming it's fetched elsewhere or for a specific purpose)
  const [allClients, setAllClients] = useState([]);

  // Function to fetch data based on mode
  const fetchDataByMode = async (mode) => {
    try {
      const res = await PostAPI("getClientsdashboard", { mode });
      return res.data;
    } catch (e) {
      console.error(`Error fetching mode: ${mode}`, e);
      return null; // Return null to indicate an error for specific data points
    }
  };

  // useEffect to load dashboard data on component mount
  useEffect(() => {
    const loadDashboard = async () => {
      const modes = [
        "SystemUsage",
        "SMADashboard",
        "Industry",
        "SMAApplication",
        "ActiveClients",
        "ClientsWithSMA",
        "ExpiredSMA",
        "UpcomingExpirations",
        "ClientsForInstallation",
        "ClientsTrainingStatus",
        "ClientsCASStatus",
      ];

      // Fetch all data concurrently
      const results = await Promise.all(modes.map(fetchDataByMode));

      // Update state with fetched data, handling potential nulls from errors
      setSystemUsage(results[0]?.dashboard1 || []);
      setSMADashboard(results[1]?.dashboard1 || []);
      setIndustry(results[2]?.dashboard1 || []);
      setSMAApplication(results[3]?.dashboard1 || []);
      setActiveClients(results[4]?.dashboard1 || []);
      setSmaSummary(results[5]?.dashboard1 || []);
      setExpiredSMA(results[6]?.dashboard1 || []);
      setUpcomingExpirations(results[7]?.dashboard1 || []);
      setforInstallation(results[8]?.dashboard1 || []);
      setforTraining(results[9]?.dashboard1 || []);
      setCasStatus(results[10]?.dashboard1 || []);
    };

    loadDashboard();
  }, []); // Empty dependency array ensures this runs once on mount

  // Handle user logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Custom label rendering for Pie Chart to display name, value, and percentage
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
    value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25; // Slightly increased radius for better label positioning
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fontSize={13} // Slightly larger font size
        fontWeight="bold"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fill="#333" // Darker fill for better contrast
      >
        {`${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="flex h-screen font-poppins">
      <main className="flex-1 p-4 bg-white overflow-y-auto">
        <div className="relative flex-1 p-2">
          <div className="absolute top-0 right-0 flex items-center space-x-4">
            <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-500 cursor-pointer" />
            <div className="relative">
              <img src="3135715.png" alt="Profile" className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
          
              {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                <ul className="py-2 text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                  </li>
                </ul>
              </div>
              )}
            </div>
          </div>
          <h2 className="text-3xl font-bold mt-10 mb-4">Welcome, {user ? user.username : "Guest"}!</h2>
        </div>

        {/* Stat Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> {/* Increased gap and margin-bottom */}
          <StatCard
            title="Active Clients"
            value={+activeClients?.[0]?.total_active_clients || 0}
            icon="users" // Example: Pass an icon prop
            color="blue" // Gradient background
          />
          <StatCard
            title="Clients with SMA"
            value={+smaSummary?.[0]?.with_sma || 0}
            icon="file-contract"
            color="green"
          />
          <StatCard
            title="Expiring SMA"
            value={+smaSummary?.[0]?.expiring_soon || 0}
            icon="calendar-times"
            color="yellow"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"> {/* Responsive grid with larger gap */}
          {/* System Usage Bar Chart */}
          <div className="bg-blue-50 p-4 rounded-lg shadow-lg h-96 flex flex-col justify-between">
            <h4 className="text-xl font-bold text-gray-700 mb-4">Top Applications by Client Count</h4> {/* Larger, more descriptive title */}
            <ResponsiveContainer width="100%" height="85%"> {/* Adjusted height for title */}
              <BarChart data={systemUsage.map(d => ({ ...d, client_count: +d.client_count }))} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                <XAxis
                  dataKey="system_code"
                  interval={0}
                  angle={-30} // Slight angle for readability
                  textAnchor="end"
                  height={70} // Increased height to accommodate labels
                  fontSize={12}
                  fontWeight="bold"
                  tickLine={false} // Remove tick lines
                  axisLine={false} // Remove axis line
                />
                {/* <YAxis
                  fontSize={12}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                /> */}
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.1)' }} // Lighter tooltip cursor
                  formatter={(value) => [`${value} Clients`, "Count"]} // Clearer tooltip
                  labelFormatter={(label) => `Application: ${label}`}
                />
                <Bar dataKey="client_count" radius={[10, 10, 0, 0]}> {/* Rounded top corners */}
                  {systemUsage.map((_, index) => (
                    <Cell key={`bar-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <LabelList
                    dataKey="client_count"
                    position="top"
                    fontSize={13}
                    fontWeight="bold"
                    fill="#333"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* SMA Pie Chart */}
          <div className="bg-blue-50 p-4 rounded-lg shadow-lg h-96 flex flex-col justify-between">
            <h4 className="text-xl font-bold text-gray-700 mb-4">Service Maintenance Agreements</h4>
            {SMADashboard.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Tooltip
                    formatter={(value) => [`${value} Clients`, "Count"]}
                    labelFormatter={(label) => `SMA Type: ${label}`}
                  />
                  <Pie
                    data={SMADashboard.map((d) => ({
                      ...d,
                      client_count: +d.client_count,
                    }))}
                    dataKey="client_count"
                    nameKey="sma_type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60} // Added inner radius for a donut chart
                    paddingAngle={5} // Small gap between slices
                    label={renderCustomLabel}
                  >
                    {SMADashboard.map((entry, index) => (
                      <Cell
                        key={`pie-cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff" // White border for separation
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Label
                    value="Total SMA Clients"
                    position="center"
                    offset={-10}
                    fontSize={16}
                    fontWeight="bold"
                    fill="#555"
                  />
                  <Label
                    value={SMADashboard.reduce((sum, d) => sum + +d.client_count, 0)}
                    position="center"
                    offset={15}
                    fontSize={20}
                    fontWeight="bold"
                    fill={COLORS[0]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center mt-auto mb-auto">No SMA data available.</p>
            )}
          </div>

          {/* SMA Application Bar Chart */}
          <div className="bg-blue-50 p-4 rounded-lg shadow-lg h-96 flex flex-col justify-between">
            <h4 className="text-xl font-bold text-gray-700 mb-4">Applications with Active SMA</h4>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={SMAApplication.map(d => ({ ...d, client_count: +d.client_count }))} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                <XAxis
                  dataKey="system_code"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={70}
                  fontSize={12}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                {/* <YAxis
                  fontSize={12}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                /> */}
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} Clients`, "Count"]}
                  labelFormatter={(label) => `Application: ${label}`}
                />
                <Bar dataKey="client_count" radius={[10, 10, 0, 0]}>
                  {SMAApplication.map((_, index) => (
                    <Cell key={`bar-app-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <LabelList
                    dataKey="client_count"
                    position="top"
                    fontSize={13}
                    fontWeight="bold"
                    fill="#333"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Bar Chart - Moved to a new row for better visual balance */}
        <div className="grid grid-cols-1 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg shadow-lg h-96 flex flex-col justify-between">
            <h4 className="text-xl font-bold text-gray-700 mb-4">Clients by Industry</h4>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={Industry.map(d => ({ ...d, count: +d.count }))} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                <XAxis
                  dataKey="industry"
                  interval={0}
                  angle={-45} // Increased angle for longer labels
                  textAnchor="end"
                  height={120} // Increased height for rotated labels
                  fontSize={11}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                {/* <YAxis
                  fontSize={12}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                /> */}
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} Clients`, "Count"]}
                  labelFormatter={(label) => `Industry: ${label}`}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {Industry.map((_, index) => (
                    <Cell key={`bar-industry-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <LabelList
                    dataKey="count"
                    position="top"
                    fontSize={13}
                    fontWeight="bold"
                    fill="#333"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MiniTable title="Expired SMA (Today)" data={ExpiredSMA} />
          <MiniTable title="Upcoming SMA Expirations (Next 60 Days)" data={upcomingExpirations} /> {/* More descriptive title */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MiniTableTraining title="Clients For Installation" data={forInstallation} /> {/* More general title */}
          <MiniTableTraining title="Clients For Training" data={forTraining} /> {/* More general title */}
          <MiniTableCAS title="CAS Clients Status" data={CasStatus} /> {/* More general title */}
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

// import React, { useState, useEffect } from "react";
// import { faBell, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
// import { useAuth } from "../Authentication/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { Bell, User, LogOut, Search, Filter, Calendar, TrendingUp, Users, FileText, AlertCircle } from "lucide-react";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   Area,
//   AreaChart
// } from "recharts";

// import { PostAPI } from "../api"; // Adjust path if needed

// const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];

// const fetchDataByMode = async (mode) => {
//   try {
//     const res = await PostAPI("getClientsdashboard", { mode });
//     return res.data;
//   } catch (e) {
//     console.error(`Error fetching mode: ${mode}`, e);
//     return null;
//   }
// };

// const StatCard = ({ title, value, color = "blue", icon: Icon, trend }) => {
//   const colorClasses = {
//     blue: "from-blue-500 to-blue-600",
//     green: "from-green-500 to-green-600",
//     yellow: "from-yellow-500 to-yellow-600",
//     red: "from-red-500 to-red-600",
//     purple: "from-purple-500 to-purple-600"
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]} text-white`}>
//             <Icon className="w-6 h-6" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600">{title}</p>
//             <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
//           </div>
//         </div>
//         {trend && (
//           <div className="flex items-center space-x-1 text-green-500">
//             <TrendingUp className="w-4 h-4" />
//             <span className="text-sm font-medium">{trend}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const MiniTable = ({ title, data, icon: Icon }) => (
//   <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
//     <div className="flex items-center space-x-2 mb-4">
//       {Icon && <Icon className="w-5 h-5 text-gray-600" />}
//       <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
//     </div>
//     <div className="overflow-x-auto">
//       <table className="w-full text-sm">
//         <thead>
//           <tr className="border-b border-gray-200">
//             <th className="text-left py-2 px-3 font-medium text-gray-600">Client</th>
//             <th className="text-left py-2 px-3 font-medium text-gray-600">System</th>
//             <th className="text-left py-2 px-3 font-medium text-gray-600">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
//               <td className="py-2 px-3 text-gray-800">{item.client_name}</td>
//               <td className="py-2 px-3">
//                 <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                   {item.system_code}
//                 </span>
//               </td>
//               <td className="py-2 px-3 text-gray-600">{item.expiry_date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

// const Dashboard = () => {
//   // Replace with your actual auth context
//   // const user = { username: "John Doe" }; // Replace with useAuth hook
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // State for API data
//   const [systemUsage, setSystemUsage] = useState([]);
//   const [SMADashboard, setSMADashboard] = useState([]);
//   const [Industry, setIndustry] = useState([]);
//   const [SMAApplication, setSMAApplication] = useState([]);
//   const [activeClients, setActiveClients] = useState([]);
//   const [smaSummary, setSmaSummary] = useState([]);
//   const [ExpiredSMA, setExpiredSMA] = useState([]);
//   const [upcomingExpirations, setUpcomingExpirations] = useState([]);
//   const [allClients, setAllClients] = useState([]);

//   const fetchDataByMode = async (mode) => {
//     try {
//       const res = await PostAPI("getClientsdashboard", { mode });
//       return res.data;
//     } catch (e) {
//       console.error(`Error fetching mode: ${mode}`, e);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const loadDashboard = async () => {
//       setIsLoading(true);
//       const modes = [
//         "SystemUsage",
//         "SMADashboard",
//         "Industry",
//         "SMAApplication",
//         "ActiveClients",
//         "ClientsWithSMA",
//         "ExpiredSMA",
//         "UpcomingExpirations"
//       ];

//       const results = await Promise.all(modes.map(fetchDataByMode));

//       setSystemUsage(results[0]?.dashboard1 || []);
//       setSMADashboard(results[1]?.dashboard1 || []);
//       setIndustry(results[2]?.dashboard1 || []);
//       setSMAApplication(results[3]?.dashboard1 || []);
//       setActiveClients(results[4]?.dashboard1 || []);
//       setSmaSummary(results[5]?.dashboard1 || []);
//       setExpiredSMA(results[6]?.dashboard1 || []);
//       setUpcomingExpirations(results[7]?.dashboard1 || []);
//       setIsLoading(false);
//     };

//     loadDashboard();
//   }, []);

//   const handleLogout = () => {
//     // Replace with your actual logout logic
//     console.log("Logout");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//         </div>
//       )}

    
//          {/* <div className="relative flex-1 p-2">
//            <div className="absolute top-0 right-0 flex items-center space-x-4">
//              <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-500 cursor-pointer" />
//              <div className="relative">
//                <img
//                  src="3135715.png"
//                 alt="Profile"
//                 className="w-8 h-8 rounded-full cursor-pointer"
//                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                />
//                {isDropdownOpen && (
//                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
//                   <ul className="py-2 text-gray-700">
//                     <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
//                        <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
//                     </li>
//                     <li
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
//                       onClick={handleLogout}
//                    >
//                       <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
//                     </li>
//                  </ul>
//                 </div>
//              )}
//             </div>
//            </div>

//            <h2 className="text-3xl font-bold mt-10 mb-4">
//              Welcome, {user ? user.username : "Guest"}!
//           </h2>
//          </div> */}

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">
//             Welcome back, {user ? user.username : "Guest"}!
//           </h2>
//           <p className="text-gray-600">Here's what's happening with your systems today.</p>
//         </div>

//         {/* Stat Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard 
//             title="Active Clients" 
//             value={activeClients[0]?.total_active_clients || 0} 
//             color="blue" 
//             icon={Users}
//             trend="+12%"
//           />
//           <StatCard 
//             title="Clients with SMA" 
//             value={smaSummary[0]?.with_sma || 0} 
//             color="green" 
//             icon={FileText}
//             trend="+8%"
//           />
//           <StatCard 
//             title="Expiring SMA" 
//             value={smaSummary[0]?.expiring_soon || 0} 
//             color="yellow" 
//             icon={Calendar}
//             trend="-3%"
//           />
//           <StatCard 
//             title="System Usage" 
//             value={systemUsage.reduce((sum, item) => sum + item.client_count, 0)} 
//             color="purple" 
//             icon={TrendingUp}
//             trend="+15%"
//           />
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Top Applications */}
//           <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-gray-800">Top Applications</h3>
//               <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={systemUsage} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                 <XAxis dataKey="system_code" />
//                 <YAxis />
//                 <Tooltip 
//                   formatter={(value) => [value, "Clients"]}
//                   contentStyle={{ 
//                     backgroundColor: 'white', 
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px',
//                     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
//                   }}
//                 />
//                 <Bar dataKey="client_count" radius={[4, 4, 0, 0]}>
//                   {systemUsage.map((_, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* SMA Distribution */}
//           <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-gray-800">SMA Distribution</h3>
//               <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Details</button>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Tooltip 
//                   formatter={(value) => [value, "Clients"]}
//                   contentStyle={{ 
//                     backgroundColor: 'white', 
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px',
//                     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
//                   }}
//                 />
//                 <Pie
//                   data={SMADashboard}
//                   dataKey="client_count"
//                   nameKey="sma_type"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {SMADashboard.map((_, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Industry Breakdown */}
//           <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-gray-800">Industry Breakdown</h3>
//               <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Export</button>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Tooltip 
//                   formatter={(value) => [value, "Clients"]}
//                   contentStyle={{ 
//                     backgroundColor: 'white', 
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px',
//                     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
//                   }}
//                 />
//                 <Pie
//                   data={Industry}
//                   dataKey="count"
//                   nameKey="industry"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {Industry.map((_, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* SMA Applications */}
//           <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-gray-800">Applications with SMA</h3>
//               <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Manage</button>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={SMAApplication} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                 <XAxis dataKey="system_code" />
//                 <YAxis />
//                 <Tooltip 
//                   formatter={(value) => [value, "Clients"]}
//                   contentStyle={{ 
//                     backgroundColor: 'white', 
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px',
//                     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="client_count"
//                   stroke="#3B82F6"
//                   fill="#3B82F6"
//                   fillOpacity={0.1}
//                   strokeWidth={2}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Tables Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <MiniTable 
//             title="Expired SMA (Today)" 
//             data={ExpiredSMA} 
//             icon={AlertCircle}
//           />
//           <MiniTable 
//             title="Upcoming Expirations (60 Days)" 
//             data={upcomingExpirations} 
//             icon={Calendar}
//           />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;