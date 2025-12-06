import React, { useState } from 'react';
import { DailyRecord } from '../types';
import { generateMonthlyAnalysis } from '../services/geminiService';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; 

interface MonthlyReportProps {
  records: DailyRecord[];
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ records }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (records.length < 5) {
        setError("需要至少5天的数据才能生成有意义的报告。");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generateMonthlyAnalysis(records);
      setReport(result);
    } catch (err) {
      setError("生成报告失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  // Simple parser to render basic markdown without extra libs
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-gray-800 mt-4 mb-2">{line.replace('### ', '')}</h3>
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.replace('## ', '')}</h2>
        if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="block mt-2 mb-1 text-gray-900">{line.replace(/\*\*/g, '')}</strong>
        if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-gray-600 mb-1">{line.replace('- ', '')}</li>
        if (line.trim() === '') return <div key={i} className="h-2"></div>
        return <p key={i} className="text-gray-600 leading-relaxed">{line}</p>
    });
  }

  return (
    <div className="pb-20 h-full flex flex-col">
       <div className="flex-none mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="text-purple-500 w-6 h-6" /> 月度洞察
        </h2>
        <p className="text-gray-500 text-sm mt-1">AI 智能分析你的打卡进展。</p>
       </div>

       {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 mb-4 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
        </div>
       )}

       {!report && !loading && (
         <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="bg-purple-50 p-4 rounded-full mb-4">
                <Sparkles className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">准备好分析了吗？</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
                Gemini 将根据你的体重、卡路里、泡脚习惯和消费情况生成个性化总结。
            </p>
            <button 
                onClick={handleGenerate}
                className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2"
            >
                生成报告
            </button>
         </div>
       )}

       {loading && (
           <div className="flex-1 flex flex-col items-center justify-center">
               <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mb-4" />
               <p className="text-gray-500 font-medium">正在分析数据...</p>
           </div>
       )}

       {report && (
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-y-auto animate-fade-in">
               <div className="prose prose-sm max-w-none">
                   {renderMarkdown(report)}
               </div>
               <button 
                onClick={handleGenerate}
                className="mt-8 w-full py-3 text-purple-600 bg-purple-50 rounded-xl text-sm font-semibold hover:bg-purple-100 transition-colors"
               >
                   重新生成分析
               </button>
           </div>
       )}
    </div>
  );
};

export default MonthlyReport;