import { DailyRecord } from '../types';

const STORAGE_KEY = 'dailylife_records';

export const getRecords = (): DailyRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load records", e);
    return [];
  }
};

export const saveRecord = (record: DailyRecord): void => {
  const records = getRecords();
  const existingIndex = records.findIndex(r => r.date === record.date);
  
  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }
  
  // Sort by date descending
  records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const getRecordByDate = (date: string): DailyRecord | undefined => {
  const records = getRecords();
  return records.find(r => r.date === date);
};

export const getLast30DaysRecords = (): DailyRecord[] => {
  const records = getRecords();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return records
    .filter(r => new Date(r.date) >= thirtyDaysAgo)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ascending for charts
};