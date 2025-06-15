
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, CreditCard, FileText, XCircle } from "lucide-react";

export default function BillingSettings() {
  return (
    <Card className="bg-gray-900/80 border-gray-700/50 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex gap-2 items-center">
          <IndianRupee className="w-6 h-6" /> Subscription & Billing (RazorPay)
        </CardTitle>
        <CardDescription className="text-gray-400">Manage your plan and billing information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-lg text-white">Current Plan</span>
            <span className="rounded bg-green-600 text-white px-3 py-1">Pro (Demo)</span>
          </div>
          <Button className="mt-2 mr-2">Upgrade/Downgrade</Button>
          <Button variant="outline" className="mt-2">Cancel Subscription</Button>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <span className="text-white flex items-center"><CreditCard className="mr-1 h-5" /> Payment Method</span>
            <span className="text-gray-300">Visa ending in 4242</span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <span className="text-white flex items-center"><FileText className="mr-1 h-5" /> Billing History</span>
            <Button variant="outline" className="ml-2">View Invoices</Button>
          </div>
        </div>
        <div>
          <XCircle className="text-amber-400 inline mr-1" />
          <span className="text-amber-400">RazorPay features are placeholders. Actual payment integration coming soon.</span>
        </div>
      </CardContent>
    </Card>
  );
}
