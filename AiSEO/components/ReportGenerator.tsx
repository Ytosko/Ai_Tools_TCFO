import React, { useState } from 'react';
import { AnalysisResult } from '../types';

// These declarations tell TypeScript that these globals are expected to exist.
// The implementation must still handle cases where they might not be loaded yet.
declare const html2canvas: any;
declare const jspdf: any;

interface ReportGeneratorProps {
    reportContentRef: React.RefObject<HTMLDivElement>;
    result: AnalysisResult;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ reportContentRef, result }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePdf = async () => {
        if (!reportContentRef.current) return;
        
        // Explicitly check if the libraries are available on the window object.
        if (typeof (window as any).html2canvas === 'undefined' || typeof (window as any).jspdf === 'undefined') {
            console.error("PDF generation library (html2canvas or jspdf) not loaded from CDN.");
            alert("Could not generate PDF report. Please check your internet connection and try again.");
            return; // Stop execution if libs are not found
        }
        
        setIsGenerating(true);
        
        try {
            // Use the libraries from the window object.
            const { jsPDF } = (window as any).jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Add Header
            pdf.setFillColor(230, 124, 21); // #E67C15
            pdf.rect(0, 0, pdfWidth, 20, 'F');
            // Due to CORS on SVG, we add text instead. A base64/PNG version hosted with the app would be ideal.
            pdf.setFontSize(16);
            pdf.setTextColor(255, 255, 255);
            pdf.text('Together CFO SEO Analyzer', 15, 12);

            pdf.setFontSize(10);
            pdf.setTextColor(150, 150, 150);
            pdf.text(`Report for: ${result.url}`, 15, 28);
            pdf.text(`Date: ${new Date().toLocaleDateString()}`, pdfWidth - 15, 28, { align: 'right' });
            
            const canvas = await (window as any).html2canvas(reportContentRef.current, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                backgroundColor: '#f8fafc'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            let heightLeft = imgHeight;
            let position = 35; // Start content below header

            pdf.addImage(imgData, 'PNG', 5, position, pdfWidth - 10, imgHeight);
            heightLeft -= (pdfHeight - position - 15); // -15 for footer margin

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 5, position, pdfWidth - 10, imgHeight);
                heightLeft -= pdfHeight;
            }

            // Add Footer to all pages
            const pageCount = pdf.internal.pages.length;
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(150, 150, 150);
                pdf.text(`Page ${i} of ${pageCount}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
            }

            pdf.save(`SEO_Report_${result.url.replace(/https?:\/\//, '').replace(/[^\w]/g, '_')}.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Sorry, there was an error creating the PDF report.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="text-center mb-8">
            <button
                onClick={generatePdf}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-[#E67C15] rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E67C15] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Report...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF Report
                    </>
                )}
            </button>
        </div>
    );
};

export default ReportGenerator;