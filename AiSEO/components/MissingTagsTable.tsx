import React from 'react';
import { MetaData } from '../types';

const checkCircleIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>`;
const xCircleIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>`;

interface SeoCheck {
    name: string;
    importance: string;
    isOk: boolean;
    status: string;
    suggestion: string;
}

const MissingTagsTable: React.FC<{ metaData: MetaData }> = ({ metaData }) => {
    const { title, description, canonical, ogTitle, ogDescription, ogImage, twitterCard, headings } = metaData;
    const h1Count = headings.filter(h => h.tag === 'h1').length;
    
    const isJsTitle = title.startsWith('[Title rendered with JavaScript');

    const checks: SeoCheck[] = [
        {
            name: 'Title Tag',
            importance: "Crucial for search rankings and click-through rates.",
            isOk: !isJsTitle && title.length > 10 && title.length <= 60,
            status: isJsTitle ? 'JS Rendered' : (title.length > 0 ? `${title.length} chars` : 'Missing'),
            suggestion: isJsTitle ? "Title is set by JavaScript. Use SSR or pre-rendering for optimal SEO." : "Aim for a length between 10 and 60 characters."
        },
        {
            name: 'Meta Description',
            importance: "Affects click-through rates from search results.",
            isOk: description.length > 70 && description.length <= 160,
            status: description.length > 0 ? `${description.length} chars` : 'Missing',
            suggestion: "Write a compelling summary between 70 and 160 characters."
        },
        {
            name: 'H1 Heading',
            importance: "Tells search engines the main topic of your page.",
            isOk: h1Count === 1,
            status: `${h1Count} found`,
            suggestion: "Ensure there is exactly one H1 tag on the page."
        },
        {
            name: 'Canonical Tag',
            importance: "Prevents duplicate content issues.",
            isOk: !!canonical,
            status: canonical ? 'Present' : 'Missing',
            suggestion: "Add a self-referencing canonical link tag to the page."
        },
        {
            name: 'Open Graph Title',
            importance: "Controls how your content appears on social media.",
            isOk: !!ogTitle,
            status: ogTitle ? 'Present' : 'Missing',
            suggestion: "Add an 'og:title' meta tag for better social sharing."
        },
        {
            name: 'Open Graph Desc.',
            importance: "Provides the summary text for social media shares.",
            isOk: !!ogDescription,
            status: ogDescription ? 'Present' : 'Missing',
            suggestion: "Add an 'og:description' meta tag."
        },
        {
            name: 'Open Graph Image',
            importance: "The primary image used when your content is shared.",
            isOk: !!ogImage,
            status: ogImage ? 'Present' : 'Missing',
            suggestion: "Add an 'og:image' meta tag with a high-quality image."
        },
        {
            name: 'Twitter Card',
            importance: "Enables rich photo cards when your URL is shared on Twitter.",
            isOk: !!twitterCard,
            status: twitterCard ? 'Present' : 'Missing',
            suggestion: "Add 'twitter:card', 'twitter:title', etc. for rich sharing."
        }
    ];

    const tableRows = checks.map(check => `
        <tr class="odd:bg-white even:bg-slate-50/70 hover:bg-orange-50/50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                    <span class="flex-shrink-0">${check.isOk ? checkCircleIconSvg : xCircleIconSvg}</span>
                    <div>
                        <div class="text-sm font-semibold text-gray-900">${check.name}</div>
                        <div class="text-xs text-gray-500">${check.importance}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center text-sm font-medium ${check.isOk ? 'text-gray-700' : 'text-red-600'}">
                    ${check.status}
                </span>
            </td>
            <td class="px-6 py-4">
                <p class="text-sm text-gray-700">${check.isOk ? 'Looking good!' : check.suggestion}</p>
            </td>
        </tr>
    `).join('');

    const htmlContent = `
        <div class="overflow-x-auto rounded-lg border border-slate-200">
            <table class="min-w-full bg-white divide-y divide-slate-200">
                <thead class="bg-slate-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-[#E67C15] uppercase tracking-wider">Tag / Item</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-[#E67C15] uppercase tracking-wider">Status</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-[#E67C15] uppercase tracking-wider">Suggestion</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Technical SEO Checklist</h3>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );
};

export default MissingTagsTable;