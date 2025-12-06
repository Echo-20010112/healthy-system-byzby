import { GoogleGenAI } from "@google/genai";
import { DailyRecord } from '../types';

export const generateMonthlyAnalysis = async (records: DailyRecord[]): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prepare data context
  const dataSummary = records.map(r => ({
    date: r.date,
    weight: r.weight,
    calories: r.calories,
    footBath: r.footBath ? 'Yes' : 'No',
    expense: r.expense
  }));

  const prompt = `
    你是一位个人健康和生活方式助手。
    请分析以下代表我过去 30 天日常习惯的 JSON 数据。
    
    数据: ${JSON.stringify(dataSummary)}
    
    请用中文（Chinese）提供一份简明扼要的月度报告，使用 Markdown 格式。
    包含以下部分：
    1. **体重趋势分析**：是否有波动？趋势如何？
    2. **活动与养生**：评价卡路里消耗的一致性和泡脚习惯。
    3. **财务概览**：每日消费的简要总结。
    4. **行动建议**：根据这些数据，为下个月提出 2-3 条具体建议。
    
    保持语气鼓励、专业且个性化。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "暂时无法生成分析报告。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("与 AI 服务通信失败。");
  }
};