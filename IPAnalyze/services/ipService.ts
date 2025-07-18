import { IpData } from '../types';

// This transformer function adapts the ip-api.com response to our internal IpData structure.
const transformIpApiComData = (data: any, ip: string): IpData => {
    const asnString = (data.as || '').split(' ')[0]?.replace('AS', '');
    return {
        ip: data.query || ip, // Use query from response as it's the canonical IP
        success: data.status === 'success',
        type: (data.query || ip).includes(':') ? 'IPv6' : 'IPv4',
        continent: data.continent,
        continent_code: data.continentCode,
        country: data.country,
        country_code: data.countryCode,
        region: data.regionName,
        region_code: data.region,
        city: data.city,
        latitude: data.lat,
        longitude: data.lon,
        postal: data.zip,
        flag: {
            img: data.countryCode ? `https://cdn.ipwhois.io/flags/${data.countryCode.toLowerCase()}.svg` : '',
        },
        connection: {
            asn: asnString ? parseInt(asnString, 10) : 0,
            org: data.org,
            isp: data.isp,
        },
        timezone: {
            id: data.timezone,
        },
        currency: data.currency ? {
            name: data.currency, // Only code is available, so use it for name too
            code: data.currency,
        } : undefined,
        security: {
            is_proxy: data.proxy, // This field is available from ip-api.com
        }
    };
};

// This function makes a direct call to get the user's IP, bypassing the proxy.
// This is necessary to get the client's IP, not the server's.
export const fetchMyIpv4 = async (): Promise<string> => {
    // Note: The service URL here is intentionally not using the proxy.
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) {
        throw new Error('Could not fetch your IP address.');
    }
    const data = await response.json();
    if (typeof data.ip !== 'string') {
        throw new Error('Invalid response from IP service.');
    }
    return data.ip;
};


export const fetchIpData = async (ip: string): Promise<IpData> => {
    // A comprehensive list of fields to request from ip-api.com
    const fields = [
        'status', 'message', 'continent', 'continentCode', 'country', 'countryCode',
        'region', 'regionName', 'city', 'zip', 'lat', 'lon', 'timezone',
        'currency', 'isp', 'org', 'as', 'query', 'proxy'
    ].join(',');
    
    // Switched to ip-api.com to avoid rate limits. NOTE: Free tier uses HTTP.
    const targetUrl = `http://ip-api.com/json/${ip}?fields=${fields}`;
    const proxyUrl = `https://tools.togethercfo.com/proxy/fetch?url=${encodeURIComponent(targetUrl)}`;
    
    try {
        const response = await fetch(proxyUrl, {
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
            let errorMessage = `API request failed with status ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.reason || errorData.message || errorMessage;
            } catch (e) {
                // Ignore if body isn't JSON, use the status code message.
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (data.status !== 'success') {
            throw new Error(data.message || 'Invalid IP address or API error.');
        }
        
        return transformIpApiComData(data, ip);

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Could not retrieve IP information: ${error.message}`);
        }
        throw new Error('An unknown error occurred during the API request.');
    }
};