// // App.js
// import React, { useState } from 'react';
// import Authentication from './Auth/Authentication';
// import ChildComponent from './Context API/ChildComponent';
// import MyContext from './Context API/Context';

// function App() {

//   <Authentication/>
//    const [theme, setTheme] = useState('Dark');

//    return (
//      <MyContext.Provider value={{ theme, setTheme }}>
//       <div
//          className={`min-h-screen flex justify-center items-center transition-colors duration-300 ${
//            theme === 'Light' ? 'bg-white text-black' : 'bg-gray-800 text-white'
//          }`}
//        >
//        <ChildComponent />
//        </div>
//      </MyContext.Provider>
//    );
// }

//  export default App;


import React from 'react';
import Sample from './sampleLogin';

function App() {
  return <Sample />;
}

export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import EmployeeForm from './Components/EmployeeForm';
// import EmployeeList from './Components/EmployeeList';
// import Authentication from './Auth/Authentication';
// import PrivateRoute from './Auth/PrivateRoute';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Default route to show the authentication page */}
//         <Route path="/" element={<Navigate to="/authentication" replace />} />
        
//         {/* Authentication page */}
//         <Route path="/authentication" element={<Authentication />} />
        
//         {/* Private routes */}
//         <Route path="/form" element={<PrivateRoute element={<EmployeeForm />} />} />
//         <Route path="/employees" element={<PrivateRoute element={<EmployeeList />} />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

//App.js
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./header"; // Import Header globally
// import ReceivingReport from "./receivingReport";
// import ReceivingReportHistory from "./receivingReportHistory";

// const App = () => {
//   return (
//     <Router>
//       {/* Global Header */}
//       <Header />

//       {/* Page Content */}
//       <Routes>
//         <Route path="/" element={<ReceivingReport />} />
//         <Route path="/history" element={<ReceivingReportHistory />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;




// import React, { useState } from 'react';

// function App() {
//   const [name, setName] = useState('');

//   const handleInputChange = (event) => {
//     setName(event.target.value);
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>Hello {name ? name : 'there'}!</h1>
//       <p>Type your name below:</p>
//       <input 
//         type="text" 
//         value={name} 
//         onChange={handleInputChange} 
//         placeholder="Enter your name" 
//         style={{ padding: '10px', fontSize: '16px' }}
//       />
//     </div>
//   );
// }

// export default App;






































































// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import EmployeeList from './Components/EmployeeList';
// import EmployeeForm from './Components/EmployeeForm';
// //import Button from './Components/Button';

// const App = () => {
//   return (
//     // <Button/>
//     <Router>
//       <div className="max-w-4xl mx-auto p-6">
//         <Routes>
//           <Route path="/" element={<EmployeeList />} />
//           <Route path="/add" element={<EmployeeForm />} />
//           <Route path="/edit/:id" element={<EmployeeForm />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;
