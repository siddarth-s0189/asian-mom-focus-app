
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LegalSection() {
  return (
    <Card className="bg-gray-900/80 border-gray-700/50 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex gap-2 items-center">
          <FileText className="w-6 h-6" /> Legal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
          Privacy Policy (Coming Soon)
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
          Terms of Service (Coming Soon)
        </Button>
      </CardContent>
    </Card>
  );
}
