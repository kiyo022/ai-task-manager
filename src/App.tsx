import { type FC } from "react";
import AppContent from "./AppContext";
import { AuthProvider } from "./context/AuthContext";

const App: FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
