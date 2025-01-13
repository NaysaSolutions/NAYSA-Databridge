import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  return (
    <div className="flex h-screen font-poppins">
      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
      <div className="flex justify-end mb-4 space-x-4">
          <FontAwesomeIcon icon={faBell} className="w-6 h-6 text-gray-500 bg-white rounded-lg shadow-md" style={{ fill: 'none' }} />
          <FontAwesomeIcon icon={faUserCircle} className="w-6 h-6 text-gray-500 " style={{ fill: 'none' }} />
        </div>
        <h2 className="text-2xl font-bold mb-8">Welcome, Gerard</h2>

        {/* Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* My Clients */}
          <div className="col-span-1 bg-gray-50 p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">My Clients</h3>
            <ul className="space-y-2 text-md font-poppins">
              <li>HIZON LABORATORIES INC.</li>
              <li>PHILODRILL</li>
              <li>JM TOMAIN LABORATORIES INC.</li>
              <li>ACHAN</li>
              <li>AMENICO</li>
              <li>POWERONE</li>
              <li>ERAMEN</li>
              <li>INNOVENTION</li>
              <li>EDISON LEE</li>
              <li>ROBES</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
