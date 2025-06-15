
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, CreditCard, FileText, XCircle } from "lucide-react";

export default function BillingSettings() {
  return (
    <Card className="bg-[#2a3441] border-[#3a4451] rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl font-medium flex items-center gap-3">
          <IndianRupee className="w-5 h-5" />
          Subscription & Billing
        </CardTitle>
        <CardDescription className="text-gray-400 text-sm font-normal">
          Manage your plan and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-base font-medium">Current Plan</div>
            <div className="text-gray-400 text-sm">Your current subscription plan</div>
          </div>
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">Pro (Demo)</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-white text-base font-medium">Payment Method</div>
              <div className="text-gray-400 text-sm">Visa ending in 4242</div>
            </div>
          </div>
          <Button className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
            Update
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-white text-base font-medium">Billing History</div>
              <div className="text-gray-400 text-sm">View your past invoices</div>
            </div>
          </div>
          <Button className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
            View Invoices
          </Button>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-600">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            Upgrade/Downgrade
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 bg-transparent border-red-500 text-red-400 hover:bg-red-500/10"
          >
            Cancel Subscription
          </Button>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/30 rounded-md p-3 flex items-start gap-2">
          <XCircle className="text-amber-400 w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-amber-400 text-sm">
            RazorPay features are placeholders. Actual payment integration coming soon.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
