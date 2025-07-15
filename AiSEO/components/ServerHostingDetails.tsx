import React from 'react';
import { ServerDetails } from '../types';
import { DnsIcon, ServerIcon, ShieldCheckIcon, GlobeAltIcon, CloudIcon } from './Icons';

const StatusBadge: React.FC<{ enabled: boolean; text: string; }> = ({ enabled, text }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
        enabled 
        ? 'bg-green-100 text-green-800' 
        : 'bg-yellow-100 text-yellow-800'
    }`}>
        {text}
    </span>
);

const DetailCard: React.FC<{ icon: React.ReactNode; title: string; value?: string | null; children?: React.ReactNode }> = ({ icon, title, value, children }) => {
    return (
        <div className="bg-slate-50 p-4 rounded-xl flex items-start gap-4 transition-all duration-300 hover:bg-white hover:shadow-md hover:shadow-slate-200/50">
            <div className="flex-shrink-0 w-8 h-8 text-[#E67C15] bg-orange-100 rounded-lg flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-600">{title}</p>
                {value && <p className="text-base font-bold text-gray-900 break-words">{value}</p>}
                {children && <div className="mt-1">{children}</div>}
            </div>
        </div>
    );
};

const ServerHostingDetails: React.FC<{ details: ServerDetails }> = ({ details }) => {
    const { ipAddress, ipv6Address, hostingProvider, cdnProvider, serverSignature, sslEnabled, isHstsEnabled } = details;

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Server & Hosting Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DetailCard icon={<DnsIcon className="w-5 h-5" />} title="IP Address">
                    {ipAddress ? (
                        <p className="text-base font-bold text-gray-900 break-all">{ipAddress} <span className="text-xs font-medium text-gray-500">(IPv4)</span></p>
                    ) : (
                        <p className="text-sm font-medium text-gray-500">Not Detected</p>
                    )}
                    {ipv6Address && <p className="text-sm font-bold text-gray-700 break-all mt-1">{ipv6Address} <span className="text-xs font-medium text-gray-500">(IPv6)</span></p>}
                </DetailCard>

                <DetailCard icon={<GlobeAltIcon className="w-5 h-5" />} title="Hosting Provider" value={hostingProvider || 'Not Detected'} />
                
                <DetailCard icon={<CloudIcon className="w-5 h-5" />} title="CDN Provider" value={cdnProvider || 'None Detected'} />
                
                <DetailCard icon={<ServerIcon className="w-5 h-5" />} title="Web Server" value={serverSignature || 'Not Detected'} />

                <DetailCard icon={<ShieldCheckIcon className="w-5 h-5" />} title="SSL Enabled">
                    <StatusBadge enabled={sslEnabled} text={sslEnabled ? 'Active' : 'Not Active'} />
                </DetailCard>

                <DetailCard icon={<ShieldCheckIcon className="w-5 h-5" />} title="HSTS Enabled">
                    <StatusBadge enabled={isHstsEnabled} text={isHstsEnabled ? 'Active' : 'Not Active'} />
                </DetailCard>
            </div>
        </div>
    );
};

export default ServerHostingDetails;
