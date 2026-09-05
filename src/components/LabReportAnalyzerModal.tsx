import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Stethoscope,
  Calendar,
  X,
  RefreshCw,
  Eye,
  FileCheck,
  Activity,
  ArrowRight
} from 'lucide-react';
import { HOSPITAL_DEPARTMENTS, DOCTORS_DATABASE } from '../data/hospitalData';

interface LabReportAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment: (departmentId?: string, doctorId?: string) => void;
}

interface KeyFinding {
  parameter: string;
  value: string;
  referenceRange: string;
  status: 'Normal' | 'High' | 'Low' | 'Borderline';
  explanation: string;
}

interface AnalysisResult {
  reportTitle: string;
  overallStatus: 'Normal' | 'Attention Needed' | 'Requires Medical Review' | 'Critical / Urgent';
  summary: string;
  keyFindings: KeyFinding[];
  potentialConcerns: string[];
  questionsForDoctor: string[];
  recommendedDepartment: string;
  recommendedAction: string;
}

export const LabReportAnalyzerModal: React.FC<LabReportAnalyzerModalProps> = ({
  isOpen,
  onClose,
  onBookAppointment,
}) => {
  const [reportText, setReportText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleReports = [
    {
      title: '🩸 Lipid & Metabolic Panel (Elevated Cholesterol)',
      dept: 'cardiology',
      text: `PATIENT DIAGNOSTIC LAB REPORT
Investigation: Fasting Lipid Profile & Liver Function
- Total Cholesterol: 248 mg/dL (Desirable: < 200 mg/dL) [HIGH]
- Triglycerides: 210 mg/dL (Normal: < 150 mg/dL) [HIGH]
- HDL (Good Cholesterol): 38 mg/dL (Normal: > 50 mg/dL) [LOW]
- LDL (Bad Cholesterol): 168 mg/dL (Optimal: < 100 mg/dL) [HIGH]
- Fasting Blood Sugar: 112 mg/dL (Normal: 70-99 mg/dL) [BORDERLINE]
- Serum ALT / SGPT: 52 U/L (Normal: 7-56 U/L) [NORMAL]
Clinical Indication: Routine cardiovascular annual health checkup.`,
    },
    {
      title: '🔬 CBC (Complete Blood Count - Mild Anemia)',
      dept: 'general-medicine',
      text: `COMPREHENSIVE HEMATOLOGY REPORT
- Hemoglobin (Hb): 10.2 g/dL (Reference: 12.0 - 15.5 g/dL) [LOW]
- RBC Count: 3.8 x 10^6 / uL (Reference: 4.2 - 5.4) [LOW]
- Hematocrit (PCV): 31% (Reference: 37 - 48%) [LOW]
- MCV: 74 fL (Reference: 80 - 100 fL) [LOW - Microcytic]
- Platelet Count: 280,000 / uL (Reference: 150,000 - 450,000) [NORMAL]
- Total Leucocyte Count (WBC): 6,400 / uL (Reference: 4,500 - 11,000) [NORMAL]
Symptoms: Patient reports chronic daytime fatigue and mild dizziness upon standing.`,
    },
    {
      title: '🩺 Fasting Blood Sugar & HbA1c (Pre-Diabetes)',
      dept: 'general-medicine',
      text: `ENDOCRINOLOGY / GLYCEMIC REPORT
- Fasting Blood Glucose: 134 mg/dL (Normal: 70 - 99 mg/dL) [ELEVATED]
- Post-Prandial (2hr) Glucose: 188 mg/dL (Normal: < 140 mg/dL) [ELEVATED]
- HbA1c (Glycated Hemoglobin): 6.8% (Normal: < 5.7%, Diabetes: >= 6.5%) [DIABETIC RANGE]
- Estimated Average Glucose (eAG): 148 mg/dL
Patient history: Strong family history of metabolic syndrome. No current insulin therapy.`,
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (customText?: string) => {
    const textToAnalyze = customText || reportText;
    if (!textToAnalyze && !selectedImage) {
      setErrorMessage('Please paste report text, select a sample preset, or upload an image file.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/analyze-lab-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText: textToAnalyze,
          imageBase64: selectedImage,
          mimeType: 'image/jpeg',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze report');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage('Could not complete lab analysis. Please consult a WeCare physician directly.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'High':
      case 'Critical / Urgent':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Attention Needed':
      case 'Borderline':
      case 'Requires Medical Review':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  // Find matching department & doctor for booking
  const matchedDepartmentObj = HOSPITAL_DEPARTMENTS.find(
    (d) =>
      d.id.toLowerCase() === analysisResult?.recommendedDepartment.toLowerCase() ||
      d.name.toLowerCase().includes(analysisResult?.recommendedDepartment.toLowerCase() || '')
  );

  const matchedDoctor = DOCTORS_DATABASE.find(
    (doc) => doc.departmentId === matchedDepartmentObj?.id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div
        id="lab-report-analyzer-modal-box"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">AI Lab Report & Prescription Analyzer</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Gemini Flash Vision
                </span>
              </div>
              <p className="text-xs text-teal-100/90">
                Translate complex medical lab metrics into clear explanations, vital insights & doctor questions
              </p>
            </div>
          </div>

          <button
            id="close-lab-analyzer-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-teal-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!analysisResult ? (
            <div className="space-y-6">
              {/* Sample Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Try Sample Lab Report Presets
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {sampleReports.map((sample, idx) => (
                    <button
                      key={idx}
                      id={`sample-report-btn-${idx}`}
                      onClick={() => {
                        setReportText(sample.text);
                        setSelectedImage(null);
                        setFileName(null);
                        runAnalysis(sample.text);
                      }}
                      className="text-left p-3 rounded-2xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 transition-all text-xs group cursor-pointer"
                    >
                      <p className="font-semibold text-slate-800 group-hover:text-teal-700">
                        {sample.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {sample.text.slice(0, 80)}...
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload or Paste Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload Box */}
                <div className="border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-2xl p-6 text-center flex flex-col items-center justify-center bg-slate-50/50 transition-colors">
                  <Upload className="w-8 h-8 text-teal-600 mb-2" />
                  <p className="text-xs font-bold text-slate-700">Upload Lab Report Photo / Scan</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">PNG, JPG, or PDF snapshot</p>
                  <label className="mt-3 px-4 py-2 rounded-xl bg-teal-50 text-teal-700 font-semibold text-xs border border-teal-200 hover:bg-teal-100 cursor-pointer transition-colors">
                    <span>{fileName || 'Choose Document'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {selectedImage && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{fileName || 'Image loaded'}</span>
                    </div>
                  )}
                </div>

                {/* Paste Text Box */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Or Paste Lab Metrics / Doctor Notes
                  </label>
                  <textarea
                    id="lab-report-text-input"
                    rows={6}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="e.g. Fasting Glucose: 135 mg/dL, HbA1c: 6.8%, Blood Pressure: 140/90 mmHg..."
                    className="w-full text-xs font-mono p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                id="run-ai-lab-analysis-btn"
                onClick={() => runAnalysis()}
                disabled={isAnalyzing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Diagnostics with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Intelligent Lab Analysis</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Analysis Results View */
            <div className="space-y-6 animate-fadeIn">
              {/* Overview Strip */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(
                        analysisResult.overallStatus
                      )}`}
                    >
                      {analysisResult.overallStatus}
                    </span>
                    <h4 className="text-base font-bold text-slate-800">
                      {analysisResult.reportTitle}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 max-w-2xl">
                    {analysisResult.summary}
                  </p>
                </div>

                <button
                  id="reset-lab-analysis-btn"
                  onClick={() => setAnalysisResult(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold self-start md:self-center cursor-pointer transition-colors"
                >
                  Analyze Another Report
                </button>
              </div>

              {/* Key Findings Table */}
              {analysisResult.keyFindings && analysisResult.keyFindings.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-teal-600" />
                    Key Biomarker Findings & Metrics
                  </h4>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                          <th className="p-3">Parameter</th>
                          <th className="p-3">Your Value</th>
                          <th className="p-3">Reference Range</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Explanation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {analysisResult.keyFindings.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-semibold text-slate-800">{item.parameter}</td>
                            <td className="p-3 font-mono font-bold text-slate-900">{item.value}</td>
                            <td className="p-3 text-slate-500 font-mono text-[11px]">
                              {item.referenceRange}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 leading-relaxed text-[11px]">
                              {item.explanation}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Questions for Doctor & Potential Concerns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Questions for Doctor */}
                <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100">
                  <h5 className="text-xs font-bold text-teal-900 mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                    Recommended Questions to Ask Your Doctor
                  </h5>
                  <ul className="space-y-2">
                    {analysisResult.questionsForDoctor.map((q, i) => (
                      <li key={i} className="text-xs text-teal-800 flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-teal-200 text-teal-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Potential Concerns */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <h5 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Clinical Points of Attention
                  </h5>
                  <ul className="space-y-2">
                    {analysisResult.potentialConcerns.map((c, i) => (
                      <li key={i} className="text-xs text-amber-800 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Action & Doctor Booking Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-900 to-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-teal-300">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                      Matched Department
                    </span>
                    <h5 className="text-base font-bold text-white">
                      {matchedDepartmentObj?.name || analysisResult.recommendedDepartment}
                    </h5>
                    <p className="text-xs text-teal-100/80 mt-0.5">
                      {analysisResult.recommendedAction}
                    </p>
                  </div>
                </div>

                <button
                  id="book-recommended-doctor-from-report-btn"
                  onClick={() => {
                    onClose();
                    onBookAppointment(matchedDepartmentObj?.id, matchedDoctor?.id);
                  }}
                  className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 shrink-0"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation with Specialist</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
