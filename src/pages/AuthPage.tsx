import type { AuthError } from "firebase/auth";
import { useState, type FC } from "react";
import { useAuth } from "../context/AuthTypes";
const AuthPage: FC = () => {
  const { signup, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上にしてください");
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err) {
      const error = err as AuthError;
      setError(
        error.message ||
          (isLogin ? "ログインに失敗しました" : "サインアップに失敗しました"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 text-indigo-600">
          📋 AI タスク管理
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {isLogin ? "ログイン" : "アカウント作成"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="example@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="6文字以上"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-gray-400 transition"
          >
            {loading
              ? isLogin
                ? "ログイン中..."
                : "サインアップ中..."
              : isLogin
                ? "ログイン"
                : "アカウント作成"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin
              ? "アカウントがありませんか？"
              : "アカウントを持っていますか？"}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-indigo-600 hover:text-indigo-700 font-semibold ml-2"
            >
              {isLogin ? "サインアップ" : "ログイン"}
            </button>
          </p>
        </div>

        {/* テストアカウント */}
        {isLogin && (
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-700 text-sm font-semibold mb-2">
              🧪 テスト用
            </p>
            <p className="text-blue-600 text-xs mb-1">
              メール: test@example.com
            </p>
            <p className="text-blue-600 text-xs">パスワード: test123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
