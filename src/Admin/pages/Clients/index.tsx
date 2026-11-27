import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth";
import { BASE } from "./config";
import ClientLayout from "./ClientLayout";
import DataPage from "./DataPage";
import DetailPage from "./DetailPage";
import LoginPage from "./LoginPage";
import SummaryPage from "./SummaryPage";

/** Pasang di router sebagai <Route path="/client/*" element={<ClientBiddingApp />} /> */
export default function ClientBiddingApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<ClientLayout />}>
          <Route index element={<SummaryPage />} />
          <Route path="bidding" element={<DataPage />} />
          <Route path="bidding/:product/:id" element={<DetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to={BASE} replace />} />
      </Routes>
    </AuthProvider>
  );
}
