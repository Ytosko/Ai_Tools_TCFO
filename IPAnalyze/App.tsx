import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import IpInputPanel from './components/IpInputPanel';
import ResultsDisplay from './components/ResultsDisplay';
import MapDisplay from './components/MapDisplay';
import { IpData } from './types';
import { fetchIpData, fetchMyIpv4 } from './services/ipService';

// Spinner component defined outside the App component to prevent re-creation on render.
const Spinner: React.FC = () => (
    <svg className="animate-spin h-8 w-8 text-[#E67C15]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const App: React.FC = () => {
    const [ipInput, setIpInput] = useState('');
    const [ipData, setIpData] = useState<IpData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const runScanForIp = useCallback(async (ip: string) => {
        setIsLoading(true);
        setError(null);
        setIpData(null);
        try {
            const data = await fetchIpData(ip);
            setIpData(data);
            setIpInput(data.ip); // Keep input in sync with what was scanned
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleScan = () => {
        const ipToScan = ipInput.trim();
        if (ipToScan) {
            runScanForIp(ipToScan);
        } else {
            setError('Please enter an IP address to scan.');
        }
    };

    const handlePutMyIp = async () => {
        setIsLoading(true);
        setError(null);
        setIpData(null);
        try {
            const myIpv4 = await fetchMyIpv4();
            await runScanForIp(myIpv4);
        } catch (err) {
            // This catches errors from fetchMyIpv4
            setError(err instanceof Error ? err.message : 'Could not get your IP address.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />
                <main className="mt-8">
                    <IpInputPanel
                        ipInput={ipInput}
                        setIpInput={setIpInput}
                        onScan={handleScan}
                        onPutMyIp={handlePutMyIp}
                        isLoading={isLoading}
                    />

                    {isLoading && (
                        <div className="flex justify-center items-center mt-10">
                            <Spinner />
                            <p className="ml-4 text-lg text-gray-600">Scanning...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="mt-8 text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                            <p><strong className="font-bold">Error:</strong> {error}</p>
                        </div>
                    )}

                    {!isLoading && !error && ipData && (
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
                           <div className="lg:col-span-3">
                                <ResultsDisplay data={ipData} />
                           </div>
                           <div className="lg:col-span-2 min-h-[400px]">
                                <MapDisplay 
                                    key={`${ipData.latitude}-${ipData.longitude}`}
                                    lat={ipData.latitude} 
                                    lng={ipData.longitude} 
                                    popupText={`${ipData.city}, ${ipData.country}`} 
                                />
                           </div>
                        </div>
                    )}

                    {!isLoading && !error && !ipData && (
                        <div className="mt-20 text-center text-gray-500">
                             <h2 className="text-2xl font-semibold text-gray-700">Welcome to the IP Analyzer</h2>
                             <p className="mt-4 text-lg">Enter an IP address or use "Put My IP" to start.</p>
                             <p className="mt-2 text-sm max-w-md mx-auto">Get detailed geolocation, ISP, and security information instantly for any IP address worldwide.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;