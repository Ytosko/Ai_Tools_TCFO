export interface IpData {
  ip: string;
  success: boolean;
  type: 'IPv4' | 'IPv6';
  continent: string;
  continent_code: string;
  country: string;
  country_code: string;
  region: string;
  region_code: string;
  city: string;
  latitude: number;
  longitude: number;
  is_eu?: boolean;
  postal: string;
  calling_code?: string;
  capital?: string;
  borders?: string;
  flag: {
    img: string;
    emoji?: string;
    emoji_unicode?: string;
  };
  connection: {
    asn: number;
    org: string;
    isp: string;
    domain?: string;
  };
  timezone: {
    id: string;
    abbr?: string;
    is_dst?: boolean;
    offset?: number;
    utc?: string;
    current_time?: string;
  };
  currency?: {
    name: string;
    code: string;
    symbol?: string;
    plural?: string;
    exchange_rate?: number;
  };
  security?: {
    is_proxy?: boolean;
    proxy_type?: string;
    is_crawler?: boolean;
    crawler_name?: null | string;
    is_tor?: boolean;
    threat_level?: 'low' | 'medium' | 'high' | 'unknown';
    threat_types?: null | string[];
  };
}