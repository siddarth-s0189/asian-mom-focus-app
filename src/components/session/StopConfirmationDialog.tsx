
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StopConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const StopConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel
}: StopConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Are you sure you want to stop?
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-4">
          <div className="text-6xl mb-4">👩‍🦳</div>
          <p className="text-gray-300">
            Your Asian mom will have something to say about this...
          </p>
        </div>
        <DialogFooter className="flex justify-center space-x-4">
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600/70"
          >
            Go back to session
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Yes, stop session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StopConfirmationDialog;
