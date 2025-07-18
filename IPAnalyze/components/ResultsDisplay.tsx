import React from 'react';
import { IpData } from '../types';

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
    if (value === null || value === undefined || value === '') return null;
    return (
        <div className="flex justify-between items-center py-3 px-4 odd:bg-gray-50/70 even:bg-transparent text-sm">
            <span className="font-semibold text-gray-500">{label}</span>
            <span className="text-right text-gray-800 break-words">{value}</span>
        </div>
    );
};

interface InfoSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, children, defaultOpen = true }) => {
    // A section should not render if it has no valid children
    const validChildren = React.Children.toArray(children).filter(child => child !== null);
    if (validChildren.length === 0) {
        return null;
    }

    return (
        <details className="bg-white rounded-lg overflow-hidden group shadow-sm" open={defaultOpen}>
            <summary className="font-bold text-lg p-4 bg-[#E67C15]/10 cursor-pointer hover:bg-[#E67C15]/20 transition-colors list-none flex justify-between items-center">
                {title}
                <svg className="w-5 h-5 transition-transform duration-300 group-open:rotate-180 text-[#E67C15]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </summary>
            <div className="border-t border-gray-200/80">
                {validChildren}
            </div>
        </details>
    );
};

const getThreatLevelColor = (level?: 'low' | 'medium' | 'high' | 'unknown') => {
    switch (level) {
        case 'high': return 'text-red-500';
        case 'medium': return 'text-yellow-500';
        case 'low': return 'text-green-500';
        default: return 'text-gray-500';
    }
};


interface ResultsDisplayProps {
  data: IpData;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data }) => {
  return (
    <div className="space-y-4">
        <InfoSection title="Overview">
            <InfoRow label="IP Address" value={data.ip} />
            <InfoRow label="Type" value={data.type} />
            <InfoRow label="Country" value={
                <span className="flex items-center justify-end gap-2">
                    <img src={data.flag.img} alt={`${data.country} flag`} className="h-5 rounded-sm shadow-md" /> 
                    {data.country} ({data.country_code})
                </span>
            }/>
            <InfoRow label="City" value={data.city} />
        </InfoSection>

        <InfoSection title="Location Details">
            <InfoRow label="Continent" value={`${data.continent} (${data.continent_code})`} />
            <InfoRow label="Region" value={data.region ? `${data.region} (${data.region_code})` : null} />
            <InfoRow label="Postal Code" value={data.postal} />
            <InfoRow label="Capital" value={data.capital} />
            <InfoRow label="Coordinates" value={data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : null} />
            <InfoRow label="Borders" value={data.borders} />
            <InfoRow label="In European Union" value={typeof data.is_eu === 'boolean' ? (data.is_eu ? 'Yes' : 'No') : null} />
        </InfoSection>

        <InfoSection title="Connection & ISP">
            <InfoRow label="ISP" value={data.connection.isp} />
            <InfoRow label="Organization" value={data.connection.org} />
            <InfoRow label="ASN" value={data.connection.asn ? `AS${data.connection.asn}` : null} />
            <InfoRow label="Domain" value={data.connection.domain} />
        </InfoSection>
        
        <InfoSection title="Timezone & Currency" defaultOpen={false}>
            <InfoRow label="Timezone" value={data.timezone.id} />
            <InfoRow label="UTC Offset" value={data.timezone.utc} />
            <InfoRow label="DST Active" value={typeof data.timezone.is_dst === 'boolean' ? (data.timezone.is_dst ? 'Yes' : 'No') : null} />
            <InfoRow label="Calling Code" value={data.calling_code ? `+${data.calling_code}` : null} />
            {data.currency && <InfoRow label="Currency" value={`${data.currency.name} (${data.currency.code})`} />}
            {data.currency && <InfoRow label="Currency Symbol" value={data.currency.symbol} />}
        </InfoSection>

        <InfoSection title="Security Analysis" defaultOpen={false}>
            {data.security?.threat_level &&
                <InfoRow 
                    label="Threat Level" 
                    value={<span className={`capitalize font-bold ${getThreatLevelColor(data.security.threat_level)}`}>{data.security.threat_level}</span>} 
                />
            }
            <InfoRow label="Is Proxy" value={typeof data.security?.is_proxy === 'boolean' ? (data.security.is_proxy ? 'Yes' : 'No') : null} />
            <InfoRow label="Proxy Type" value={data.security?.proxy_type} />
            <InfoRow label="Is Crawler" value={typeof data.security?.is_crawler === 'boolean' ? (data.security.is_crawler ? 'Yes' : 'No') : null} />
            <InfoRow label="Crawler Name" value={data.security?.crawler_name} />
            <InfoRow label="Is TOR Node" value={typeof data.security?.is_tor === 'boolean' ? (data.security.is_tor ? 'Yes' : 'No') : null} />
            <InfoRow label="Threat Types" value={data.security?.threat_types?.join(', ') || null} />
        </InfoSection>
    </div>
  );
};

export default ResultsDisplay;