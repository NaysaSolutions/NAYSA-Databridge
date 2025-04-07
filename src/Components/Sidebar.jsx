import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTh,
  faUsers,
  faClipboardList,
  faCog,
  faQuestionCircle,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        className="md:hidden p-4 fixed top-4 left-4 bg-blue-500 text-white rounded-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bg-white p-5 flex flex-col justify-between font-poppins shadow-lg transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-0 md:w-64"
        } h-screen overflow-hidden md:flex md:w-64`}
      >
        <div>
          <div className="mb-8">
            <img
              src="/NSI_LOGO_2.avif"
              alt="Logo"
              className="w-[200px] h-auto mx-auto mb-16"
            />
          </div>
          <nav>
            <ul className="space-y-6">
              <li
                className={`flex items-center space-x-4 p-2 rounded-lg transition ${
                  location.pathname === "/dashboard"
                    ? "text-blue-500 font-semibold bg-blue-100"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon icon={faTh} className="w-6 h-6" />
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li
                className={`flex items-center space-x-4 p-2 rounded-lg transition ${
                  location.pathname === "/clients"
                    ? "text-blue-500 font-semibold bg-blue-100"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon icon={faUsers} className="w-6 h-6" />
                <Link to="/clients">Clients</Link>
              </li>
              <li className="flex items-center space-x-4 text-gray-700 p-2 hover:bg-gray-100 rounded-lg">
                <FontAwesomeIcon icon={faClipboardList} className="w-6 h-6" />
                <span>Prospect Clients</span>
              </li>
              <li className="flex items-center space-x-4 text-gray-700 p-2 hover:bg-gray-100 rounded-lg">
                <FontAwesomeIcon icon={faCog} className="w-6 h-6" />
                <span>Settings</span>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4 text-gray-500 p-2 hover:bg-gray-100 rounded-lg">
          <FontAwesomeIcon icon={faQuestionCircle} className="w-6 h-6" />
          <span>Help</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
