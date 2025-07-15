import { MetaData, PsiData, PsiMetric, ServerDetails, PsiDeviceData } from '../types';

// Using a more reliable public CORS proxy. NOTE: Public proxies can be slow or have rate limits.
const CORS_PROXY = 'https://tools.togethercfo.com/proxy/fetch?url='; // Replace with your own proxy if needed
const PSI_API_KEY = process.env.PSI_API_KEY; // As provided in the prompt
const PSI_API_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const absoluteUrl = (base: string, path: string | null | undefined): string | null => {
    if (!path) return null;
    try {
        // Avoids creating invalid URLs from things like "tel:" or "mailto:" links
        if (path.startsWith('http:') || path.startsWith('https:')) {
            return new URL(path).href;
        }
        return new URL(path, base).href;
    } catch (e) {
        console.warn(`Could not create absolute URL for base: ${base}, path: ${path}`, e);
        return null;
    }
};

const getDomainInfo = async (domain: string): Promise<{ ip: string | null, ipv6: string | null, provider: string | null }> => {
    try {
        const hostname = new URL(domain).hostname;

        // Fetch IPv4
        const aResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`, { headers: { 'accept': 'application/dns-json' } });
        const aData = await aResponse.json();
        const ip = aData.Answer?.[0]?.data || null;

        // Fetch IPv6
        const aaaaResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${hostname}&type=AAAA`, { headers: { 'accept': 'application/dns-json' } });
        const aaaaData = await aaaaResponse.json();
        const ipv6 = aaaaData.Answer?.[0]?.data || null;

        let provider = null;
        if (ip) {
            // Using a free proxy for ip-api to avoid mixed-content issues if the main app is on https
            const providerResponse = await fetch(`${CORS_PROXY}http://ip-api.com/json/${ip}`);
            if(providerResponse.ok) {
                const providerData = await providerResponse.json();
                provider = providerData.isp || providerData.org || null;
            }
        }
        
        return { ip, ipv6, provider };
    } catch (e) {
        console.warn('Could not fetch domain info (IP/Provider)', e);
        return { ip: null, ipv6: null, provider: null };
    }
};

export const analyzeUrl = async (url: string): Promise<{ metaData: MetaData; serverDetails: ServerDetails; }> => {
    let response: Response;
    try {
        response = await fetch(`${CORS_PROXY}${url}`);
    } catch (error) {
        console.error('Network request for URL failed:', error);
        throw new Error('Network request failed. This may be due to a temporary issue with the CORS proxy or your internet connection.');
    }
    
    if (!response.ok) {
        throw new Error(`Failed to fetch URL through proxy. Status: ${response.status} ${response.statusText}. The target website may be down or blocking the proxy.`);
    }
    
    const headers = response.headers;
    const html = await response.text();
    if (!html) {
        throw new Error('Could not retrieve HTML content. The site might require JavaScript to render or is blocking requests.');
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const getMeta = (name: string) => doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`)?.getAttribute('content')?.trim() || null;
    const getLink = (rel: string) => doc.querySelector(`link[rel="${rel}"]`)?.getAttribute('href')?.trim() || null;

   // Explicitly parse title from head. Falls back to <meta name="title"> if <title> is not present.
    let title =
    doc.querySelector('head > title')?.textContent?.trim() ||
    doc.querySelector('title')?.textContent?.trim() ||
    doc.querySelector('meta[name="title"]')?.getAttribute('content')?.trim() ||
    '';

    // Heuristic: If title is empty, check for signs of a client-side rendered Single Page Application (SPA).
    // SPAs often set the title dynamically using JavaScript, which isn't executed by this basic fetch.
    if (!title) {
        const bodyContent = doc.body?.innerHTML?.toLowerCase() || '';
        const htmlContent = html.toLowerCase();

        // Check for common SPA root elements like <div id="root"></div>
        const hasRootElement = bodyContent.includes('id="root"') || bodyContent.includes('id="app"');
        
        // A very basic check for framework references in the raw HTML.
        const hasFrameworkReference = htmlContent.includes('react') || htmlContent.includes('vue') || htmlContent.includes('angular');
        
        // If it looks like an SPA, provide a helpful fallback message.
        if (hasRootElement || hasFrameworkReference) {
            title = '[Title rendered with JavaScript — use SSR or react-helmet]';
        }
    }


    const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
        tag: h.tagName.toLowerCase(),
        text: h.textContent?.trim() || '',
    }));
    
    let robotsTxt: string | null = null;
    let robotsTxtStatus: 'found' | 'not_found' | 'error' = 'not_found';
    try {
        const robotsUrl = new URL('/robots.txt', url).href;
        const robotsResponse = await fetch(`${CORS_PROXY}${robotsUrl}`);
        if (robotsResponse.ok) {
            robotsTxt = await robotsResponse.text();
            robotsTxtStatus = 'found';
        }
    } catch (e) {
        console.warn('Could not fetch robots.txt', e);
        robotsTxtStatus = 'error';
    }


    const metaData: MetaData = {
    title: title,
    description: getMeta('description')||'',
    canonical: absoluteUrl(url,getLink('canonical')),
    ogTitle: getMeta('og:title'),
    ogDescription: getMeta('og:description'),
    ogImage: absoluteUrl(url,getMeta('og:image')),
    twitterCard: getMeta('twitter:card'),
    twitterTitle: getMeta('twitter:title'),
    twitterDescription: getMeta('twitter:description'),
    twitterImage: absoluteUrl(url,getMeta('twitter:image')),
    headings,
    favicon: absoluteUrl(url,getLink('icon')||getLink('shortcut icon'))||`${new URL(url).origin}/favicon.ico`,
    robotsTxt,
    robotsTxtStatus,
    titleSource: 'title_tag'
};

    // Server Details Analysis
    const { ip, ipv6, provider } = await getDomainInfo(url);

    const serverSignature = headers.get('server') || null;
    let cdnProvider: string | null = null;
    if (serverSignature?.toLowerCase().includes('cloudflare')) {
        cdnProvider = 'Cloudflare';
    } else if (serverSignature?.toLowerCase().includes('cloudfront')) {
        cdnProvider = 'Amazon CloudFront';
    } else if (headers.has('x-vercel-id')) {
        cdnProvider = 'Vercel';
    } else if (serverSignature?.toLowerCase().includes('netlify')) {
        cdnProvider = 'Netlify';
    } else if (headers.has('x-fastly-backend') || headers.has('x-served-by')) {
        cdnProvider = 'Fastly';
    } else if (serverSignature?.toLowerCase().includes('google frontend')) {
        cdnProvider = 'Google Cloud CDN';
    }
    
    const otherHeaders: Record<string, string> = {};
    const relevantHeaders = ['x-powered-by', 'x-content-type-options', 'x-frame-options', 'x-xss-protection', 'content-security-policy'];
    headers.forEach((value, key) => {
        if(relevantHeaders.includes(key.toLowerCase())) {
            otherHeaders[key] = value;
        }
    });

    const serverDetails: ServerDetails = {
        ipAddress: ip,
        ipv6Address: ipv6,
        hostingProvider: provider,
        isHstsEnabled: headers.has('strict-transport-security'),
        serverSignature: serverSignature,
        cdnProvider: cdnProvider,
        sslEnabled: url.startsWith('https://'),
        otherHeaders: otherHeaders,
    };

    return { metaData, serverDetails };
};

const processPsiResponse = (data: any): PsiDeviceData => {
    const lighthouse = data.lighthouseResult;
    const score = Math.round((lighthouse.categories.performance.score || 0) * 100);

    const getMetric = (id: string, title: string): PsiMetric | null => {
        const metric = lighthouse.audits[id];
        if (!metric) return null;
        return {
            id,
            title: title,
            displayValue: metric.displayValue || 'N/A',
            score: Math.round((metric.score || 0) * 100),
        };
    };

    const metrics: PsiMetric[] = [
        getMetric('largest-contentful-paint', 'Largest Contentful Paint (LCP)'),
        getMetric('cumulative-layout-shift', 'Cumulative Layout Shift (CLS)'),
        getMetric('first-contentful-paint', 'First Contentful Paint (FCP)'),
        getMetric('total-blocking-time', 'Total Blocking Time (TBT)'),
        getMetric('speed-index', 'Speed Index'),
        getMetric('interactive', 'Time to Interactive (TTI)'),
    ].filter((m): m is PsiMetric => m !== null);
    
    return { score, metrics };
}

export const fetchPsiData = async (url: string): Promise<PsiData> => {
    const fetchStrategy = async (strategy: 'mobile' | 'desktop'): Promise<PsiDeviceData> => {
        const fullApiUrl = `${PSI_API_ENDPOINT}?url=${encodeURIComponent(url)}&key=${PSI_API_KEY}&strategy=${strategy}&category=performance`;
        const response = await fetch(fullApiUrl);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: { message: `HTTP error! status: ${response.status}` } }));
            const errorMessage = errorData?.error?.message === 'Lighthouse returned error: Something went wrong.'
              ? 'Lighthouse could not analyze this page. This can happen with pages that have redirects or require authentication.'
              : errorData?.error?.message || 'Unknown API error';
            throw new Error(errorMessage);
        }
        const data = await response.json();
        return processPsiResponse(data);
    };

    const results = await Promise.allSettled([
        fetchStrategy('mobile'),
        fetchStrategy('desktop'),
    ]);
    
    const mobileResult = results[0];
    const desktopResult = results[1];

    if (mobileResult.status === 'rejected') {
        console.error('Mobile PSI fetch failed:', mobileResult.reason);
    }
    if (desktopResult.status === 'rejected') {
        console.error('Desktop PSI fetch failed:', desktopResult.reason);
    }

    const mobile = mobileResult.status === 'fulfilled' ? mobileResult.value : null;
    const desktop = desktopResult.status === 'fulfilled' ? desktopResult.value : null;

    if (!mobile && !desktop) {
        throw new Error("Failed to load Performance data. The PageSpeed API may be temporarily unavailable or the site could not be analyzed.");
    }
    
    return { mobile, desktop };
};