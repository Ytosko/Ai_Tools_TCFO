import React from 'react';

interface IpInputPanelProps {
  ipInput: string;
  setIpInput: (value: string) => void;
  onScan: () => void;
  onPutMyIp: () => void;
  isLoading: boolean;
}

const IpInputPanel: React.FC<IpInputPanelProps> = ({ ipInput, setIpInput, onScan, onPutMyIp, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading && ipInput) {
      onScan();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          value={ipInput}
          onChange={(e) => setIpInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter IP Address (e.g., 8.8.8.8)"
          className="flex-grow w-full bg-gray-100 border-2 border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E67C15] focus:border-transparent transition disabled:opacity-50"
          disabled={isLoading}
        />
        <div className="flex w-full sm:w-auto flex-shrink-0 flex-row gap-2">
           <button
            onClick={onPutMyIp}
            disabled={isLoading}
            className="w-1/2 sm:w-auto px-5 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
           >
            Put My IP
           </button>
           <button
            onClick={onScan}
            disabled={isLoading || !ipInput}
            className="w-1/2 sm:w-auto px-8 py-3 bg-[#E67C15] text-white font-bold rounded-md hover:bg-orange-600 transition-colors disabled:bg-orange-200 disabled:text-orange-500 disabled:cursor-not-allowed"
           >
            {isLoading ? '...' : 'Scan'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default IpInputPanel;