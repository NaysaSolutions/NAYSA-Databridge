import { useNavigate } from 'react-router-dom';

const MiniTableTraining = ({ title, data, viewAllLink = '/clients' }) => {
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
      <table className="w-full text-xs table-auto">
        <thead>
          <tr className="text-left font-semibold border-b border-blue-200">
            <th className="py-2 pr-4">Client</th>
            <th className="py-2 pr-4">App Type</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {totalCount > 0 ? (
            safeData.map((item, idx) => (
              <tr key={idx} className="border-b border-blue-100 hover:bg-blue-100/40">
                <td className="py-1 pr-4 truncate">{item.client_name || item.name}</td>
                <td className="py-1 pr-4">{item.app_type || '-'}</td>
                <td className="py-1">{item.status || '-'}</td>
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

export default MiniTableTraining;
