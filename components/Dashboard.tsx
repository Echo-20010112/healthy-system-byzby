import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { DailyRecord } from '../types';
import { Footprints, Flame, DollarSign, Scale } from 'lucide-react';

interface DashboardProps {
  records: DailyRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  
  const chartData = useMemo(() => {
    return records.map(r => ({
      ...r,
      dateFormatted: r.date.slice(5) // MM-DD
    }));
  }, [records]);

  const stats = useMemo(() => {
    if (records.length === 0) return null;
    const latest = records[records.length - 1];
    const totalCals = records.reduce((acc, curr) => acc + (curr.calories || 0), 0);
    const footBathCount = records.filter(r => r.footBath).length;
    
    return {
      currentWeight: latest.weight,
      avgCalories: Math.round(totalCals / records.length),
      footBathRate: Math.round((footBathCount / records.length) * 100)
    };
  }, [records]);

  if (records.length === 0) {
    return <div className="p-8 text-center text-gray-500">暂无数据。快去打卡吧！</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="bg-emerald-100 p-2 rounded-full mb-2">
                <Scale className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs text-gray-500">体重</span>
            <span className="font-bold text-lg">{stats?.currentWeight ?? '--'} <span className="text-xs font-normal">kg</span></span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="bg-orange-100 p-2 rounded-full mb-2">
                <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500">平均热量</span>
            <span className="font-bold text-lg">{stats?.avgCalories ?? '--'}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="bg-blue-100 p-2 rounded-full mb-2">
                <Footprints className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">泡脚率</span>
            <span className="font-bold text-lg">{stats?.footBathRate}%</span>
        </div>
      </div>

      {/* Weight Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Scale className="w-4 h-4" /> 体重趋势 (近30天)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="dateFormatted" tick={{fontSize: 10}} tickLine={false} axisLine={false} interval={4} />
              <YAxis domain={['auto', 'auto']} tick={{fontSize: 10}} tickLine={false} axisLine={false} width={30} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Line type="monotone" dataKey="weight" name="体重" stroke="#10b981" strokeWidth={3} dot={{r: 3, fill: '#10b981'}} activeDot={{r: 5}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calories & Expense Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Flame className="w-4 h-4" /> 活动与消费
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="dateFormatted" tick={{fontSize: 10}} tickLine={false} axisLine={false} interval={4} />
              <YAxis yAxisId="left" orientation="left" stroke="#f59e0b" tick={{fontSize: 10}} tickLine={false} axisLine={false} width={30} />
              <YAxis yAxisId="right" orientation="right" stroke="#6366f1" tick={{fontSize: 10}} tickLine={false} axisLine={false} width={30} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar yAxisId="left" dataKey="calories" name="卡路里" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="expense" name="消费 (元)" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;