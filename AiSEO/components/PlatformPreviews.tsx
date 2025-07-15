import React from 'react';
import { MetaData } from '../types';

interface PlatformPreviewsProps {
  metaData: MetaData;
  url: string;
}

const PlatformPreviews: React.FC<PlatformPreviewsProps> = ({ metaData, url }) => {
  const { title, description, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, twitterImage } = metaData;

  const getHost = (domain: string | null) => {
    try {
        return domain ? new URL(domain).hostname.replace('www.', '') : new URL(url).hostname.replace('www.', '');
    } catch {
        return url.replace(/https?:\/\//, '').split('/')[0];
    }
  }

  const host = getHost(metaData.canonical);

  const renderImage = (src: string | null, alt: string, platform: string) => {
    if (src) {
        return <img src={src} alt={alt} className="w-full h-32 object-cover" onError={(e) => e.currentTarget.style.display='none'}/>
    }
    return <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">No {platform} Image</div>
  }

  const cardClasses = "bg-white p-4 rounded-xl shadow-md border border-slate-100 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-orange-400/20 flex flex-col";
  const linkedInCardClasses = "bg-white rounded-xl shadow-md border border-slate-100 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-orange-400/20 overflow-hidden flex flex-col";
  const whatsAppCardClasses = "bg-[#E5FFD4] p-2 rounded-xl shadow-md border border-slate-100 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-green-400/30 flex flex-col";

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 text-center">Social & Search Previews</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

        {/* Google Preview */}
        <div className={cardClasses}>
            <p className="font-semibold text-gray-600 mb-2 text-sm">Google</p>
            <div className="font-sans flex-grow">
                <p className="text-xs text-gray-800 truncate">{host}</p>
                <h4 className="text-lg text-blue-800 hover:underline truncate">{title || 'No Title Found'}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{description || 'No meta description found.'}</p>
            </div>
        </div>
        
        {/* Facebook Preview */}
        <div className={linkedInCardClasses}>
            <p className="font-semibold text-gray-600 p-4 pb-2 text-sm">Facebook</p>
            {renderImage(ogImage, "Open Graph Preview", "OG")}
            <div className="p-3 bg-gray-50 flex-grow">
                <p className="text-xs text-gray-500 uppercase truncate">{host}</p>
                <h5 className="font-bold text-sm text-gray-800 truncate">{ogTitle || title}</h5>
                <p className="text-xs text-gray-600 line-clamp-2">{ogDescription || description}</p>
            </div>
        </div>
        
        {/* Twitter Preview */}
        <div className={linkedInCardClasses}>
            <p className="font-semibold text-gray-600 p-4 pb-2 text-sm">Twitter</p>
            {renderImage(twitterImage || ogImage, "Twitter Card Preview", "Twitter")}
            <div className="p-3 flex-grow">
                <h5 className="font-bold text-sm text-gray-800 truncate">{twitterTitle || title}</h5>
                <p className="text-xs text-gray-600 line-clamp-2">{twitterDescription || description}</p>
                <p className="text-xs text-gray-500 truncate mt-1">{host}</p>
            </div>
        </div>

        {/* LinkedIn Preview */}
        <div className={linkedInCardClasses}>
            <p className="font-semibold text-gray-600 p-4 pb-2 text-sm">LinkedIn</p>
            {renderImage(ogImage, "LinkedIn Preview", "OG")}
            <div className="p-3 flex-grow">
                <h5 className="font-bold text-sm text-gray-800 truncate">{ogTitle || title}</h5>
                <p className="text-xs text-gray-500 uppercase truncate">{host}</p>
            </div>
        </div>

        {/* WhatsApp Preview */}
        <div className={whatsAppCardClasses}>
            <p className="font-semibold text-gray-600 mb-2 text-sm text-center">WhatsApp</p>
            <div className="bg-white/80 p-2 rounded-lg flex-grow flex items-center gap-2">
                {ogImage && <img src={ogImage} alt="WhatsApp Preview" className="w-16 h-16 object-cover rounded-md flex-shrink-0" onError={(e) => e.currentTarget.style.display='none'} />}
                <div className="overflow-hidden">
                    <h5 className="font-bold text-sm text-gray-800 truncate">{ogTitle || title}</h5>
                    <p className="text-xs text-gray-600 line-clamp-2">{ogDescription || description}</p>
                    <p className="text-xs text-gray-400 truncate mt-1">{host}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformPreviews;