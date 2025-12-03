import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { searchStock } from './services/geminiService';
import { SearchResult, ViewState } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import ResultView from './components/ResultView';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [viewState, setViewState] = useState<ViewState>(ViewState.IDLE);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setViewState(ViewState.LOADING);
    setResult(null);
    setErrorMsg('');

    try {
      const data = await searchStock(query);
      setResult(data);
      setViewState(ViewState.SUCCESS);
    } catch (err) {
      console.error(err);
      setViewState(ViewState.ERROR);
      setErrorMsg("抱歉，获取数据时出现问题。可能是网络原因或 API 限制，请稍后重试。");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setViewState(ViewState.IDLE); setQuery('');}}>
              <div className="bg-primary p-1.5 rounded-lg">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                MarketInsight Pro
              </span>
            </div>
            {/* Desktop Simple Search if results are shown */}
            {viewState === ViewState.SUCCESS && (
              <form onSubmit={handleSearch} className="hidden md:flex relative w-64">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索代码 (如 TSLA)..."
                  className="w-full pl-10 pr-4 py-1.5 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-accent/50 focus:bg-white transition-all outline-none"
                />
                <Search className="absolute left-3 top-2 text-gray-400 w-4 h-4" />
              </form>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Initial Empty State */}
        {viewState === ViewState.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in-up">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                洞察美股，<span className="text-accent">智胜未来</span>
              </h1>
              <p className="text-lg text-slate-600">
                利用 Gemini AI 的强大能力，实时获取美股行情、图表分析及深度投资解读。
              </p>
            </div>

            <form onSubmit={handleSearch} className="w-full max-w-lg relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
              <div className="relative flex items-center bg-white rounded-full shadow-xl">
                <Search className="ml-6 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="输入股票代码或名称 (例如: NVDA, 苹果)"
                  className="w-full py-4 px-4 text-lg bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 outline-none rounded-full"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="mr-2 px-6 py-2.5 bg-primary text-white font-medium rounded-full hover:bg-slate-800 transition-colors"
                >
                  分析
                </button>
              </div>
            </form>

            <div className="flex gap-3 text-sm text-gray-500 mt-8">
              <span>热门搜索:</span>
              {['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN'].map((ticker) => (
                <button
                  key={ticker}
                  onClick={() => {
                    setQuery(ticker);
                    // Slight delay to allow state update before submit if we wanted to auto-submit, 
                    // but manual click feels better for UX here.
                    // Actually let's just populate input
                  }}
                  className="hover:text-accent font-medium underline decoration-dotted underline-offset-4 cursor-pointer"
                >
                  {ticker}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {viewState === ViewState.LOADING && (
          <LoadingSpinner />
        )}

        {/* Error State */}
        {viewState === ViewState.ERROR && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-red-50 p-4 rounded-full mb-4">
              <Search className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">查询失败</h3>
            <p className="text-gray-500 max-w-md">{errorMsg}</p>
            <button 
              onClick={() => setViewState(ViewState.IDLE)}
              className="mt-6 px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              返回首页
            </button>
          </div>
        )}

        {/* Success Result View */}
        {viewState === ViewState.SUCCESS && result && (
          <ResultView 
            data={result.data} 
            analysis={result.analysis} 
            sources={result.sources} 
          />
        )}
      </main>
    </div>
  );
};

export default App;