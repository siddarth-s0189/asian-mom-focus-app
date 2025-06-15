
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, CreditCard, FileText, XCircle } from "lucide-react";

export default function BillingSettings() {
  return (
    <Card className="bg-gray-800/30 border-gray-700/50 rounded-xl backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-white text-2xl font-medium flex items-center gap-3">
          <IndianRupee className="w-6 h-6" />
          Subscription & Billing
        </CardTitle>
        <CardDescription className="text-gray-300 text-lg">
          Manage your plan and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="text-white text-xl font-medium">Current Plan</div>
            <div className="text-gray-400 text-lg">Your current subscription plan</div>
          </div>
          <span className="bg-green-600 text-white px-4 py-2 rounded-full text-lg font-medium">Pro (Demo)</span>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-white text-xl font-medium">Payment Method</div>
              <div className="text-gray-400 text-lg">Visa ending in 4242</div>
            </div>
          </div>
          <Button className="bg-white/10 hover:bg-white/20 text-white border-gray-600 px-6 py-3 text-lg">
            Update
          </Button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-white text-xl font-medium">Billing History</div>
              <div className="text-gray-400 text-lg">View your past invoices</div>
            </div>
          </div>
          <Button className="bg-white/10 hover:bg-white/20 text-white border-gray-600 px-6 py-3 text-lg">
            View Invoices
          </Button>
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-600">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
            Upgrade/Downgrade
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 bg-transparent border-red-500 text-red-400 hover:bg-red-500/10 py-3 text-lg"
          >
            Cancel Subscription
          </Button>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/30 rounded-md p-4 flex items-start gap-3">
          <XCircle className="text-amber-400 w-5 h-5 mt-1 flex-shrink-0" />
          <span className="text-amber-400 text-lg">
            RazorPay features are placeholders. Actual payment integration coming soon.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
