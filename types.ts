export interface DailyRecord {
  date: string; // YYYY-MM-DD
  weight: number | null;
  calories: number | null;
  footBath: boolean;
  expense: number | null;
  dietImage?: string; // Base64 string
  notes?: string;
}

export interface MonthlyStats {
  averageWeight: number;
  totalCalories: number;
  footBathCount: number;
  totalExpense: number;
  recordCount: number;
}
