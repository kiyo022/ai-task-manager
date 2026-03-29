import { type FC } from "react";

interface AIChatProps {
  advice: string | null;
  onClose: () => void;
}

const AIChat: FC<AIChatProps> = ({ advice, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-indigo-600">🤖 AI アドバイス</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>
      </div>

      <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded p-4">
        {advice ? (
          <div className="space-y-3">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {advice}
            </p>
            <div className="pt-4 border-t border-indigo-200">
              <p className="text-xs text-gray-600">
                💡 このアドバイスは AI が生成したものです。
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">⏳ アドバイスを生成中...</p>
        )}
      </div>
    </div>
  );
};

export default AIChat;
