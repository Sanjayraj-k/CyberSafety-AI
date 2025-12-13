import React, { useState } from 'react';
import { Shield, AlertTriangle, FileText, Upload, CheckCircle, Info, Send, Loader } from 'lucide-react';

const CybercrimeResultsUI = () => {
  const [complaint, setComplaint] = useState('');
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRealistic, setShowRealistic] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setComplaint('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const formData = new FormData();

      if (file) {
        formData.append('file', file);
      } else if (complaint) {
        formData.append('complaint', complaint);
      } else {
        setError('Please enter a complaint or upload a file');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/classify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to classify complaint');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'LOW': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH': return <AlertTriangle className="w-5 h-5" />;
      case 'MEDIUM': return <Info className="w-5 h-5" />;
      case 'LOW': return <CheckCircle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Cybercrime Classifier</h1>
              <p className="text-gray-500">AI-Powered Crime Analysis System</p>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Describe Your Complaint
              </label>
              <textarea
                value={complaint}
                onChange={(e) => {
                  setComplaint(e.target.value);
                  setFile(null);
                }}
                placeholder="Describe the cybercrime incident in detail..."
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                rows="4"
                disabled={file !== null}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Or Upload Evidence (Image/Audio)
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,audio/*"
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (!complaint && !file)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors duration-200"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Classify Complaint
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {data && (
          <>
            {/* Category & Severity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Primary Category */}
              <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Primary Category</h2>
                </div>
                <p className="text-2xl font-bold text-gray-800">{data.primary_category}</p>
                {data.category_name && data.category_name !== data.primary_category && (
                  <p className="text-sm text-gray-500 mt-2">({data.category_name})</p>
                )}
              </div>

              {/* Severity */}
              <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Threat Level</h2>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${getSeverityColor(data.severity)}`}>
                  {getSeverityIcon(data.severity)}
                  <span className="text-xl font-bold">{data.severity}</span>
                </div>
              </div>
            </div>

            {/* Required Documents */}
            {data.required_documents && data.required_documents.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Required Documents</h2>
                </div>
                <div className="space-y-3">
                  {data.required_documents.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200">
                      <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold">{idx + 1}</span>
                      </div>
                      <p className="text-gray-700 font-medium">{doc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Government Documents */}
            {data.gov_documents_to_submit && data.gov_documents_to_submit.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Upload className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Government Documents to Submit</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.gov_documents_to_submit.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200 border-2 border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <p className="text-gray-700 font-medium">{doc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reasoning */}
            {data.reasoning && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Analysis Reasoning</h2>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600">
                  <p className="text-gray-700 leading-relaxed">{data.reasoning}</p>
                </div>
              </div>
            )}

            {/* Realistic Examples - Collapsible */}
            {data.realistic_examples && data.realistic_examples.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <button
                  onClick={() => setShowRealistic(!showRealistic)}
                  className="w-full flex items-center justify-between mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Realistic Examples</h2>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${showRealistic ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showRealistic && (
                  <div className="space-y-4 mt-6">
                    {data.realistic_examples.map((example, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-5 bg-orange-50 rounded-xl border-l-4 border-orange-400 hover:shadow-md transition-shadow duration-200">
                        <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed pt-1">{example}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer Note */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                This classification is AI-generated. Please verify with authorities before taking action.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CybercrimeResultsUI;