
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import AccountSettings from "@/components/settings/AccountSettings";
import BillingSettings from "@/components/settings/BillingSettings";
import CustomisationSettings from "@/components/settings/CustomisationSettings";
import LegalSection from "@/components/settings/LegalSection";

export default function Settings() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-10 text-center">
              Settings
            </h1>
            <div className="space-y-8">
              <AccountSettings />
              <BillingSettings />
              <CustomisationSettings />
              <LegalSection />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
