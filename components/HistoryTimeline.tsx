import React from 'react';
import { DailyRecord } from '../types';
import { Footprints, Flame, DollarSign, Scale, Image as ImageIcon } from 'lucide-react';

interface HistoryTimelineProps {
  records: DailyRecord[];
}

const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ records }) => {
  if (records.length === 0) {
    return <div className="text-center p-8 text-gray-500">暂无历史记录。</div>;
  }

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">历史记录</h2>
      {records.map((record) => (
        <div key={record.date} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
           {/* Date Column */}
           <div className="flex flex-col items-center justify-start min-w-[3.5rem] border-r border-gray-100 pr-4">
              <span className="text-xs font-bold text-gray-400 uppercase">{new Date(record.date).toLocaleDateString('zh-CN', { month: 'short' })}</span>
              <span className="text-2xl font-bold text-gray-800">{new Date(record.date).getDate()}</span>
              <span className="text-xs text-gray-400">{new Date(record.date).toLocaleDateString('zh-CN', { weekday: 'short' })}</span>
           </div>

           {/* Content Column */}
           <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-2 text-xs">
                {record.weight && (
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                    <Scale className="w-3 h-3" /> {record.weight}kg
                  </span>
                )}
                {record.calories && (
                   <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                    <Flame className="w-3 h-3" /> {record.calories}
                  </span>
                )}
                {record.expense && (
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                    <DollarSign className="w-3 h-3" /> {record.expense}
                  </span>
                )}
                {record.footBath && (
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                    <Footprints className="w-3 h-3" /> 已泡脚
                  </span>
                )}
              </div>
              
              {record.dietImage && (
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 mt-2 border border-gray-200">
                  <img src={record.dietImage} alt="Diet" className="w-full h-full object-cover" />
                </div>
              )}

              {record.notes && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg italic mt-1">
                  "{record.notes}"
                </p>
              )}
           </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryTimeline;