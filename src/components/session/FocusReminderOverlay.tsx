
import { useAsianMomSpeech } from "@/hooks/useAsianMomSpeech";

interface FocusReminderOverlayProps {
  showOverlay: boolean;
}

const FocusReminderOverlay = ({ showOverlay }: FocusReminderOverlayProps) => {
  const momSpeech = useAsianMomSpeech();

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 p-2 shadow-2xl shadow-pink-500/40 animate-pulse">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              <div className="text-8xl">👩‍🦳</div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 max-w-2xl mx-auto">
          <div className="text-2xl font-bold text-white mb-4 min-h-[3.5rem]">
            {momSpeech.getCurrentText()}
          </div>
          <div className="text-gray-300 text-lg">
            {momSpeech.isPlaying ? "Speaking..." : "Get ready to focus!"}
          </div>
        </div>
        {momSpeech.isPlaying && (
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-200"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusReminderOverlay;
