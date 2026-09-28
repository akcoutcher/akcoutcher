import React, { useMemo } from 'react';
import { getAllCertificates } from '../../lib/courseDb';
import { Award, ShieldCheck, Printer, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';

interface CertificateViewPageProps {
  certificateId: string;
  onNavigate: (path: string) => void;
}

export const CertificateViewPage: React.FC<CertificateViewPageProps> = ({ certificateId, onNavigate }) => {
  const allCerts = getAllCertificates();
  const cert = useMemo(() => {
    const cleanId = certificateId.trim().toUpperCase();
    return allCerts.find((c) => c.certificateId.toUpperCase() === cleanId || c.id === certificateId);
  }, [allCerts, certificateId]);

  if (!cert) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F2] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-4">
          <Award className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="font-serif text-2xl text-[#58111A]">Certificate Not Found</h2>
          <p className="text-xs text-stone-500">
            The requested certificate ID could not be located in AK COUTURE records.
          </p>
          <button
            onClick={() => onNavigate('/student/dashboard')}
            className="px-6 py-2.5 bg-[#58111A] text-white text-xs uppercase tracking-wider font-semibold rounded-xl"
          >
            Go to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    window.location.origin + '/verify/' + cert.certificateId
  )}`;

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Action Header (Hidden in Print) */}
      <div className="max-w-5xl mx-auto flex items-center justify-between pb-8 print:hidden">
        <button
          onClick={() => onNavigate('/student/dashboard')}
          className="flex items-center gap-2 text-xs text-stone-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(`/verify/${cert.certificateId}`)}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs uppercase tracking-wider font-semibold border border-stone-700 flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Public Verification URL</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* CERTIFICATE DOCUMENT (Strict Compliance with Requirements 11 & 20) */}
      <div className="max-w-4xl mx-auto bg-[#FCFAF6] text-[#1C1917] p-8 sm:p-14 rounded-2xl shadow-2xl border-[12px] border-double border-[#58111A] relative overflow-hidden print:m-0 print:border-8 print:shadow-none print:w-full print:max-w-none">
        {/* Subtle Watermark Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="font-serif text-[180px] font-bold text-[#58111A]">AKC</span>
        </div>

        {/* Inner Gold Inset Border */}
        <div className="border border-[#C5A059]/60 p-8 sm:p-10 space-y-8 text-center relative z-10">
          {/* Header Brand */}
          <div className="space-y-1">
            <span className="font-serif text-3xl sm:text-4xl font-semibold tracking-wider text-[#58111A] uppercase block">
              AK COUTURE
            </span>
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#C5A059] font-medium block">
              Fashion Designing &amp; Skill Development
            </span>
          </div>

          {/* Certificate Title */}
          <div className="pt-2">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-stone-900 uppercase font-light">
              CERTIFICATE OF COURSE COMPLETION
            </h2>
            <div className="w-24 h-0.5 bg-[#C5A059] mx-auto mt-2" />
          </div>

          {/* Presentation Line */}
          <div className="space-y-3 pt-2">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-medium">
              This Certificate is Proudly Presented To
            </p>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#58111A] italic font-semibold border-b border-stone-300 pb-2 inline-block px-8">
              {cert.studentName}
            </h3>
          </div>

          {/* Completion Text */}
          <div className="space-y-2 max-w-xl mx-auto">
            <p className="text-xs text-stone-600 font-light">
              for successfully completing
            </p>
            <h4 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              {cert.courseName}
            </h4>
          </div>

          {/* Meta Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200 text-left text-xs max-w-lg mx-auto">
            <div>
              <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Course Code</span>
              <span className="font-mono font-medium text-stone-800">{cert.courseCode}</span>
            </div>
            <div>
              <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Duration</span>
              <span className="font-medium text-stone-800">{cert.courseDuration}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Completion Date</span>
              <span className="font-medium text-stone-800">{cert.completionDate}</span>
            </div>
          </div>

          {/* QR Code & Signatures Footer */}
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-stone-200">
            {/* Left: Certificate ID & QR Code */}
            <div className="flex items-center gap-4 text-left">
              <img
                src={qrCodeUrl}
                alt="Verification QR Code"
                className="w-20 h-20 border border-stone-300 p-1 bg-white rounded shadow-xs"
              />
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Certificate ID</span>
                <span className="font-mono text-xs font-bold text-[#58111A] block">
                  {cert.certificateId}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  Scan to verify online authenticity
                </span>
              </div>
            </div>

            {/* Right: Authorized Signature */}
            <div className="text-center space-y-1">
              <div className="font-serif italic text-2xl text-[#58111A] font-semibold border-b border-stone-400 pb-1 px-6">
                Anmol Kaur
              </div>
              <span className="text-xs uppercase font-medium tracking-wider text-stone-800 block">
                Authorized Signature
              </span>
              <span className="text-[11px] text-[#C5A059] font-medium tracking-widest uppercase block">
                AK COUTURE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
