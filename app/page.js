'use client';

import { useState } from 'react';

const COMPARISON_LIBRARIES = {
  general: "General (Mixed)",
  animals: "Animals & Nature",
  sports: "Sports & Athletics",
  everyday: "Everyday Objects",
  food: "Food & Cooking",
  tech: "Technology",
};

const LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
};

export default function Home() {
  const [comparisonType, setComparisonType] = useState('general');
  const [language, setLanguage] = useState('en');
  const [error, setError] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setStreamedText('');
    setIsStreaming(false);

    try {
      const response = await fetch('/api/memorable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userText: input, comparisonType, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate comparisons');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Set the result directly
      setResults([{
        originalText: input,
        enhancedText: data.result,
        footnotes: [] // We're not using footnotes in the new format
      }]);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header section with enhanced styling */}
        <div className="flex flex-col items-center mb-16">
          <div className="relative mb-3">
            <h1 className="text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              Memorable Quantities
            </h1>
            <div className="absolute -inset-1 blur-2xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 -z-10 rounded-3xl"></div>
          </div>
          <p className="text-slate-600 text-center text-lg font-light">
            Transform numbers into unforgettable comparisons
          </p>
        </div>

        {/* Main card with enhanced styling */}
        <div className="card bg-white shadow-xl border border-slate-100 rounded-2xl transition-all duration-300 hover:shadow-2xl">
          <div className="card-body p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-slate-700">Comparison Style</span>
                  </label>
                  <select
                    value={comparisonType}
                    onChange={(e) => setComparisonType(e.target.value)}
                    className="select bg-slate-50 border-slate-200 w-full hover:border-violet-400 transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  >
                    {Object.entries(COMPARISON_LIBRARIES).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-slate-700">Language</span>
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="select bg-slate-50 border-slate-200 w-full hover:border-violet-400 transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  >
                    {Object.entries(LANGUAGES).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-slate-700">Your Text</span>
                </label>
                <textarea
                  className="textarea bg-slate-50 border-slate-200 h-32 w-full hover:border-violet-400 transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your text here... (e.g., 'The building is 300 feet tall and weighs 2000 tons')"
                />
              </div>

              <button
                type="submit"
                className="btn w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-violet-500/25 font-semibold text-lg"
                disabled={!input?.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-md"></span>
                    <span className="text-white">Generating equivalents...</span>
                  </div>
                ) : (
                  <span className="text-white">Generate Equivalents</span>
                )}
              </button>
            </form>

            {error && (
              <div className="alert alert-error mt-8 bg-red-50 text-red-700 border border-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Error: {error}</span>
              </div>
            )}

            {/* Show streaming progress */}
            {isStreaming && streamedText && (
              <div className="mt-8 space-y-4">
                <div className="card bg-base-100 shadow-lg p-4">
                  <div className="animate-pulse">
                    <p className="text-base-content/70">{streamedText}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Show final results */}
            {results.length > 0 && (
              <div className="mt-12 space-y-8">
                <h2 className="text-2xl font-semibold mb-8 text-slate-800">
                  {language === 'pt' ? 'Resultados' : 'Results'}
                </h2>
                {results.map((item, idx) => (
                  <div
                    key={idx}
                    className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 rounded-xl overflow-hidden"
                  >
                    <div className="card-body p-8 space-y-6">
                      {/* Original Text */}
                      <div className="text-slate-500">
                        <h3 className="font-semibold text-violet-600 mb-3">
                          {language === 'pt' ? 'Texto Original:' : 'Original Text:'}
                        </h3>
                        <p className="font-mono text-sm bg-slate-50 p-4 rounded-lg">{item.originalText}</p>
                      </div>

                      {/* Enhanced Text with Copy Button */}
                      <div className="relative">
                        <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-xl relative group border border-slate-100">
                          <button
                            onClick={() => copyToClipboard(item.enhancedText, idx)}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-violet-50 hover:border-violet-200"
                          >
                            {copiedIndex === idx ? (
                              <span className="text-violet-600 font-medium px-2">
                                {language === 'pt' ? 'Copiado!' : 'Copied!'}
                              </span>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                            )}
                          </button>
                          <div className="prose prose-slate max-w-none">
                            {item.enhancedText}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Developer Credits with enhanced styling */}
        <footer className="mt-16 text-center">
          <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
            <span>Developed by</span>
            <a 
              href="https://www.linkedin.com/in/promptcompletion/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
            >
              Francy Lisboa
            </a>
            <span className="text-slate-300">•</span>
            <a 
              href="https://www.linkedin.com/in/promptcompletion/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-violet-600 transition-colors"
            >
              PromptCompletion.com
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
} 