import React from 'react';

const Sidebar = () => {
  return (
    <div className="h-screen w-80 bg-white shadow-md fixed top-[120px] left-0 p-6">
        
      {/* Profile Image */}
      <div className="flex flex-col items-center">
        <img
          src="blank-profile-picture-973460_1280.webp"
          alt="Profile"
          className="w-[130px] h-[130px] rounded-full object-cover mb-4"
        />
        <h2 className="text-lg font-semibold text-[#1c394e] text-center">
          Welcome Back, <br /> Employee 1!
        </h2>
      </div>

      {/* Employee Details */}
      <div className="mt-6 text-sm text-gray-600">
        <p className="mb-2">
          <span className="font-semibold">Employee Number:</span> 00000001
        </p>
        <p className="mb-2">
          <span className="font-semibold">Branch:</span> Makati
        </p>
        <p className="mb-2">
          <span className="font-semibold">Payroll Group:</span> Supervisor
        </p>
        <p className="mb-2">
          <span className="font-semibold">Department:</span> Technical
        </p>
        <p className="mb-2">
          <span className="font-semibold">Position:</span> Programmer
        </p>
        <p className="mb-2">
          <span className="font-semibold">Employee Status:</span> Regular
        </p>
        <p>
          <span className="font-semibold">Shift Schedule:</span> 8:00AM – 5:00PM
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
