// import { useNavigate } from 'react-router-dom';

// const MiniTable = ({ title, data, viewAllLink = '/clients' }) => {
//   const navigate = useNavigate();
//   const safeData = Array.isArray(data) ? data : [];
//   const totalCount = safeData.length;

//   return (
//     <div className="bg-blue-50 p-4 rounded-lg shadow-md relative pb-12"> {/* Added pb-12 for space */}
//       {/* Title and Count */}
//       <div className="flex justify-between items-center mb-2">
//         <h4 className="text-md font-bold">{title}</h4>
//         <span className="text-md text-blue-800 font-bold">Total: {totalCount}</span>
//       </div>

//       {/* Header Row */}
//       <div className="text-sm font-semibold grid grid-cols-[2fr_1fr_1fr] gap-2 mb-1 pb-1 pt-2">
//         <div>Client</div>
//         <div>App Type</div>
//         <div>SMA Expiry Date</div>
//       </div>

//       {/* Data Rows */}
//       <ul className="text-xs space-y-1">
//         {safeData.length > 0 ? (
//           safeData.map((item, idx) => (
//             <li key={idx} className="grid grid-cols-[2fr_1fr_1fr] gap-2 pb-1">
//               <div className="truncate">{item.client_name || item.name}</div>
//               <div>{item.app_type || '-'}</div>
//               <div>{item.sma_date ? new Date(item.sma_date).toLocaleDateString() : '-'}</div>
//             </li>
//           ))
//         ) : (
//           <li className="text-center text-gray-500 col-span-3 py-4">No data available</li>
//         )}
//       </ul>

//       {/* Fixed View All Button */}
//       <button
//         onClick={() => navigate(viewAllLink)}
//         className="absolute bottom-2 right-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
//       >
//         View All Clients <span className="ml-1">→</span>
//       </button>
//     </div>
//   );
// };

// export default MiniTable;


import { useNavigate } from 'react-router-dom';

const MiniTable = ({ title, data, viewAllLink = '/clients' }) => {
  const navigate = useNavigate();
  const safeData = Array.isArray(data) ? data : [];
  const totalCount = safeData.length;

  return (
    <div className="bg-blue-50 p-4 rounded-lg shadow-md pb-16 overflow-x-auto">
      {/* Title and Count */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-bold">{title}</h4>
        <span className="text-md text-blue-800 font-bold">Total: {totalCount}</span>
      </div>

      {/* Table */}
      <table className="w-full text-sm table-auto">
        <thead>
          <tr className="text-left font-semibold border-b border-blue-200">
            <th className="py-2 pr-4">Client</th>
            <th className="py-2 pr-4">App Type</th>
            <th className="py-2">Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {totalCount > 0 ? (
            safeData.map((item, idx) => (
              <tr key={idx} className="border-b border-blue-100 hover:bg-blue-100/40">
                <td className="py-1 pr-4 truncate">{item.client_name || item.name}</td>
                <td className="py-1 pr-4">{item.app_type || '-'}</td>
                <td>{item.sma_date ? new Date(item.sma_date).toLocaleDateString() : '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center text-gray-500 py-4">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* View All Button */}
      {/* <div className="absolute bottom-2 right-4">
        <button
          onClick={() => navigate(viewAllLink)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          View All Clients <span className="ml-1">→</span>
        </button>
      </div> */}
    </div>
  );
};

export default MiniTable;
