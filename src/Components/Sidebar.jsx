import React from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTh,
  faUsers,
  faClipboardList,
  faCog,
  faQuestionCircle,
  faBars,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ isOpen, setIsOpen, onAddClient, closeAddClientForm, showAddClientForm, currentSection }) => {
  const location = useLocation();

  // Close the form when the location changes
  useEffect(() => {
    if (showAddClientForm) {
      closeAddClientForm();
    }
  }, [location.pathname]);


  return (
    <>
      {/* Toggle Button */}
      <button
        className="p-2 fixed top-4 left-4 bg-blue-700 text-white rounded-lg z-50 ml-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg font-poppins z-40 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div>
          {/* Logo */}
          <div className={`transition-all duration-300 ${isOpen ? "px-5 ml-12 mt-3 mb-6" : "ml-0 mb-6 mt-20"}`}>
            <img
              src={isOpen ? "/NSI_LOGO_2.avif" : "/naysa_logo.png"}
              alt="Logo"
              className={`mx-auto ${isOpen ? "w-[180px]" : "w-10"}`}
            />
          </div>

          {/* Navigation */}
          <nav>
            <ul className="space-y-6 ml-5 mr-4">
              <SidebarLink
                to="/dashboard"
                icon={faTh}
                label="Dashboard"
                isActive={location.pathname === "/dashboard" && currentSection !== 'add-client'}
                isOpen={isOpen}
                onClick={() => {
                  closeAddClientForm();
                  handleNavigationClick('dashboard');
                }}
              />
              <SidebarLink
                to="/clients"
                icon={faUsers}
                label="Clients"
                isActive={location.pathname === "/clients" && currentSection !== 'add-client'}
                isOpen={isOpen}
                onClick={() => {
                  closeAddClientForm();
                  handleNavigationClick('clients');
                }}
              />

              {/* "Add New Client" triggers prop function */}
              <SidebarLink
                icon={faAdd}
                label="Add New Client"
                isActive={currentSection === 'add-client'}
                isOpen={isOpen}
                onClick={onAddClient}
            />
            </ul>
          </nav>
        </div>

        {/* Help Link */}
        <div className="p-4 text-gray-500 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
          <FontAwesomeIcon icon={faQuestionCircle} className="w-5 h-5" />
          {isOpen && <span>Help</span>}
        </div>
      </aside>
    </>
  );
};

const SidebarLink = ({ to, icon, label, isActive, isOpen, onClick }) => {
  const content = (
    <div
      className={`flex items-center space-x-4 p-2 rounded-lg transition cursor-pointer ${
        isActive ? "text-blue-700 font-semibold bg-blue-100" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <FontAwesomeIcon icon={icon} className="w-5 h-5" />
      {isOpen && <span>{label}</span>}
    </div>
  );

  // If `to` is defined, wrap with <Link>, otherwise use a <div> with onClick
  return (
    <li onClick={onClick}>
      {to ? <Link to={to}>{content}</Link> : content}
    </li>
  );
};


export default Sidebar;
