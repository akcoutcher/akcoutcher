import React, { useState, useEffect } from 'react';
import { verifyCertificate } from '../../lib/courseDb';
import { IssuedCertificate } from '../../types/courses';
import { ShieldCheck, Search, CheckCircle2, XCircle, ArrowLeft, Award, ExternalLink } from 'lucide-react';

interface VerifyCertificatePageProps {
  initialId?: string;
  onNavigate: (path: string) => void;
}

export const VerifyCertificatePage: React.FC<VerifyCertificatePageProps> = ({ initialId, onNavigate }) => {
  const [certInput, setCertInput] = useState(initialId || '');
  const [searchedId, setSearchedId] = useState('');
  const [result, setResult] = useState<IssuedCertificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialId) {
      handleVerify(initialId);
    }
  }, [initialId]);

  const handleVerify = (idToSearch?: string) => {
    const target = (idToSearch || certInput).trim();
    if (!target) return;
    setSearchedId(target);
    const cert = verifyCertificate(target);
    setResult(cert);
    setHasSearched(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-[#58111A] text-[#C5A059] shadow-md mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold block">
            AK COUTURE • Academic Integrity Registry
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#58111A]">
            Certificate Verification
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-light max-w-lg mx-auto leading-relaxed">
            Verify the authenticity of any Certificate of Course Completion issued by AK COUTURE Fashion Designing &amp; Skill Development.
          </p>
        </div>

        {/* Search Input Box */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-md flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Enter Certificate ID (e.g. AKC-FD-2026-01842)"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#58111A] font-mono uppercase"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 bg-[#58111A] hover:bg-[#6D1621] text-white text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md transition active:scale-95 cursor-pointer whitespace-nowrap"
          >
            VERIFY CERTIFICATE
          </button>
        </form>

        {/* Verification Result Card (Requirement 12) */}
        {hasSearched && (
          <div className="transition-all duration-300">
            {result && result.status === 'valid' ? (
              /* VALID CERTIFICATE (Requirement 12) */
              <div className="bg-white rounded-2xl border-2 border-emerald-500/50 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 text-emerald-700 pb-4 border-b border-stone-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-emerald-800">
                      Certificate Verified ✓
                    </h3>
                    <p className="text-xs text-emerald-600">
                      This certificate is authentic, active, and officially recorded in the AK COUTURE database.
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Student Name</span>
                    <span className="font-serif text-base font-semibold text-stone-900">{result.studentName}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Course Name</span>
                    <span className="font-serif text-base font-semibold text-stone-900">{result.courseName}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Course Code</span>
                    <span className="font-mono font-medium text-stone-800">{result.courseCode}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Course Duration</span>
                    <span className="font-medium text-stone-800">{result.courseDuration}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Completion Date</span>
                    <span className="font-medium text-stone-800">{result.completionDate}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Certificate ID</span>
                    <span className="font-mono font-bold text-[#58111A]">{result.certificateId}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Issued By</span>
                    <span className="font-medium text-stone-800">AK COUTURE (Anmol Kaur)</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Status</span>
                    <span className="font-bold text-emerald-700 uppercase tracking-wider">VALID</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onNavigate(`/certificate/${result.certificateId}`)}
                    className="px-5 py-2.5 bg-[#58111A] hover:bg-[#6D1621] text-white text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Full Certificate Document</span>
                  </button>
                </div>
              </div>
            ) : (
              /* INVALID CERTIFICATE (Requirement 12) */
              <div className="bg-white rounded-2xl border-2 border-red-300 shadow-md p-6 sm:p-8 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mx-auto">
                  <XCircle className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-bold text-red-800">
                    Certificate Not Verified
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                    The Certificate ID provided (<span className="font-mono font-bold">{searchedId}</span>) could not be found in AK COUTURE certificate records.
                  </p>
                </div>
                <p className="text-[11px] text-stone-400">
                  Please double-check the certificate code printed on the bottom left corner of your document.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center pt-6">
          <button
            onClick={() => onNavigate('/courses')}
            className="text-xs text-stone-500 hover:text-[#58111A] inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Training &amp; Courses</span>
          </button>
        </div>
      </div>
    </div>
  );
};
