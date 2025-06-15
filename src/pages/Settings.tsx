
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import AccountSettings from "@/components/settings/AccountSettings";
import BillingSettings from "@/components/settings/BillingSettings";
import CustomisationSettings from "@/components/settings/CustomisationSettings";
import LegalSection from "@/components/settings/LegalSection";
import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-xl mb-4">
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Settings
              </h1>
              <p className="text-gray-400 text-lg">
                Customize your AsianMom.gg experience
              </p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
              <AccountSettings />
              <BillingSettings />
              <CustomisationSettings />
              <LegalSection />
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-8">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-base font-medium">
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
