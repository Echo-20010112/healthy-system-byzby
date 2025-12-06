import React, { useState, useEffect } from 'react';
import { DailyRecord } from '../types';
import { saveRecord, getRecordByDate } from '../services/storageService';
import { Camera, Save, CheckCircle } from 'lucide-react';

const CheckInForm: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [expense, setExpense] = useState<string>('');
  const [footBath, setFootBath] = useState(false);
  const [notes, setNotes] = useState('');
  const [dietImage, setDietImage] = useState<string | undefined>(undefined);
  const [isSaved, setIsSaved] = useState(false);

  // Load existing data if selected date changes
  useEffect(() => {
    const record = getRecordByDate(date);
    if (record) {
      setWeight(record.weight?.toString() || '');
      setCalories(record.calories?.toString() || '');
      setExpense(record.expense?.toString() || '');
      setFootBath(record.footBath);
      setNotes(record.notes || '');
      setDietImage(record.dietImage);
    } else {
      // Reset defaults for new day
      setWeight('');
      setCalories('');
      setExpense('');
      setFootBath(false);
      setNotes('');
      setDietImage(undefined);
    }
    setIsSaved(false);
  }, [date]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDietImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: DailyRecord = {
      date,
      weight: weight ? parseFloat(weight) : null,
      calories: calories ? parseFloat(calories) : null,
      expense: expense ? parseFloat(expense) : null,
      footBath,
      notes,
      dietImage
    };
    saveRecord(record);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    // Force a reload of data in parent if needed, or rely on local storage structure
    window.dispatchEvent(new Event('storage-update')); 
  };

  return (
    <div className="pb-20">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">每日打卡</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selector */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-500 mb-1">日期</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="w-full text-lg font-semibold bg-transparent focus:outline-none"
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-500 mb-1">体重 (kg)</label>
            <input 
              type="number" 
              step="0.1" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
              placeholder="0.0"
              className="w-full text-xl font-bold bg-transparent focus:outline-none text-emerald-600"
            />
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-500 mb-1">运动消耗 (千卡)</label>
            <input 
              type="number" 
              value={calories} 
              onChange={(e) => setCalories(e.target.value)} 
              placeholder="0"
              className="w-full text-xl font-bold bg-transparent focus:outline-none text-orange-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-500 mb-1">今日消费 (元)</label>
            <input 
              type="number" 
              value={expense} 
              onChange={(e) => setExpense(e.target.value)} 
              placeholder="0.00"
              className="w-full text-xl font-bold bg-transparent focus:outline-none text-indigo-600"
            />
          </div>
          <div 
            onClick={() => setFootBath(!footBath)}
            className={`cursor-pointer p-4 rounded-2xl shadow-sm border transition-colors flex flex-col justify-between ${footBath ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}
          >
            <label className="block text-sm font-medium text-gray-500 pointer-events-none">泡脚打卡</label>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${footBath ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                {footBath && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
              <span className={`font-medium ${footBath ? 'text-blue-700' : 'text-gray-400'}`}>
                {footBath ? '已完成' : '未完成'}
              </span>
            </div>
          </div>
        </div>

        {/* Diet Photo */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-500 mb-3">饮食记录</label>
          <div className="relative">
            {dietImage ? (
              <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100">
                <img src={dietImage} alt="Diet" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => setDietImage(undefined)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-emerald-400 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">拍照或上传图片</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <label className="block text-sm font-medium text-gray-500 mb-2">每日总结 / 备注</label>
           <textarea 
             value={notes} 
             onChange={(e) => setNotes(e.target.value)} 
             className="w-full p-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none h-24"
             placeholder="今天感觉怎么样？"
           />
        </div>

        {/* Save Button */}
        <button 
          type="submit"
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
            ${isSaved ? 'bg-green-500' : 'bg-gray-900 hover:bg-gray-800'}`}
        >
          {isSaved ? (
            <>
              <CheckCircle className="w-5 h-5" /> 保存成功
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> 保存打卡记录
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckInForm;