import Groq from "groq-sdk";
import type { Task } from "../store/taskStore";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const client = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface AIResponse {
  message: string;
  suggestions: string[];
}

export const getAIAdvice = async (tasks: Task[]): Promise<AIResponse> => {
  try {
    const taskSummary = tasks
      .map((t) => `- ${t.title}(優先度:${t.priority})`)
      .join("\n");

    const prompt = `あなたのタスク管理のアシスタントです。以下のタスク一覧を分析して、効率的に進めるためのアドバイスと優先度の提案を詳しく説明してください。

    【ユーザーのタスク一覧】
    ${taskSummary}

    【回答形式】
    1. タスクの分析
    2. 推奨される優先順位
    3. 実行のコツ
    4. 時間配分のアドバイス

    詳しく記載お願いします。`;

    console.log("Groq APIに送信中");

    const message = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      max_completion_tokens: 1024,
      temperature: 0.7,
    });

    const responseText =
      message.choices[0]?.message?.content ||
      `アドバイスを取得できませんでした。`;

    console.log("✅APIレスポンス：", responseText);

    return {
      message: responseText,
      suggestions: extractSuggestions(responseText),
    };
  } catch (error) {
    console.log("✕Groq API Error：", error);
    throw new Error(`AIアドバイスの取得に失敗しました：${error}`);
  }
};

const extractSuggestions = (message: string): string[] => {
  const suggestions: string[] = [];
  const lines = message.split("\n");

  lines.forEach((line) => {
    if (line.match(/^[-・•\d]/)) {
      suggestions.push(line.replace(/^[-・•\d.)\s]+/, "").trim());
    }
  });

  return suggestions.slice(0, 3);
};
