import { useState } from "react";

// ---- AUDIO DATA ----
// Each audio file is an object: { src, text }
const sessionStartAudios = [
  {
    src: "/audio/session_start_1.mp3",
    text: "Listen ah, I'm watching you! Better work hard or else.",
  },
  {
    src: "/audio/session_start_2.mp3",
    text: "Aiyah! You better focus now lah! No more wasting time.",
  },
  {
    src: "/audio/session_start_3.mp3",
    text: "Good! You finally start! Sit down and do your work properly now lah!",
  },
];
const sessionEndAudios = [
  {
    src: "/audio/session_end_1.mp3",
    text:
      "Wah! You actually finished! Very good! But don't think you can rest until you become the doctor.",
  },
  {
    src: "/audio/session_end_2.mp3",
    text:
      "Miracle! You finished something without me using the slippers!",
  },
  {
    src: "/audio/session_end_3.mp3",
    text:
      "Okay lah, good job. At least you do something useful once in your life.",
  },
];
const breakStartAudios = [
  {
    src: "/audio/break_start_1.mp3",
    text: "Okay lah, take a break. But don’t lie down like you retire already!",
  },
  {
    src: "/audio/break_start_2.mp3",
    text: "Good job! You focus. But remember, only a short break, okay?",
  },
  {
    src: "/audio/break_start_3.mp3",
    text: "Now you take a quick break. I better not catch you scrolling on reels lah!",
  },
];
const breakEndAudios = [
  {
    src: "/audio/break_end_1.mp3",
    text: "Break over. What, you think this is a holiday? Back to work lah!",
  },
  {
    src: "/audio/break_end_2.mp3",
    text: "Break is over. No more acting like soft tofu, you lazy pig!",
  },
  {
    src: "/audio/break_end_3.mp3",
    text: "Look at your cousin, he takes no break and became a doctor! Go back to study!",
  },
];
const sessionPauseAudios = [
  {
    src: "/audio/session_pause_1.mp3",
    text: "Why you pause the session? Where you going lah? Better be for some emergency, ya!",
  },
];
const sessionQuitAudios = [
  {
    src: "/audio/session_quit_1.mp3",
    text: "Why you end the session? Where you going lah? Better be for some emergency!",
  },
];
const focusRemindersAudios = [
  {
    src: "/audio/focus_reminder_1.mp3",
    text: "Are you working, or just pretending to be busy?",
  },
  {
    src: "/audio/focus_reminder_2.mp3",
    text: "Eh, I hear TikTok sound. Don’t lie to me!",
  },
  {
    src: "/audio/focus_reminder_3.mp3",
    text: "Focus lah! Your neighbour already became doctor and you still a failure!",
  },
  {
    src: "/audio/focus_reminder_4.mp3",
    text: "I can see everything lah! You better be working hard.",
  },
  {
    src: "/audio/focus_reminder_5.mp3",
    text: "Stop being so lazy lah! I know you watch TikTok all day.",
  },
  {
    src: "/audio/focus_reminder_6.mp3",
    text: "You better be studying lah, or I'll bring the slippers.",
  },
  {
    src: "/audio/focus_reminder_7.mp3",
    text: "You want to end up like Uncle Roger? No job, only complain!",
  },
  {
    src: "/audio/focus_reminder_8.mp3",
    text: "Your cousin already finished medical school. You still sitting here!",
  },
  {
    src: "/audio/focus_reminder_9.mp3",
    text: "Why you stare at screen like zombie? Do something lah!",
  },
  {
    src: "/audio/focus_reminder_10.mp3",
    text: "You better focus now, or no dinner for you tonight!",
  },
  {
    src: "/audio/focus_reminder_11.mp3",
    text: "Don’t make me come there with the cane ah!",
  },
  {
    src: "/audio/focus_reminder_12.mp3",
    text: "I didn’t raise you to scroll Instagram the whole day!",
  },
];

// Map category to array
const audioMap = {
  sessionStart: sessionStartAudios,
  sessionEnd: sessionEndAudios,
  breakStart: breakStartAudios,
  breakEnd: breakEndAudios,
  focusReminder: focusRemindersAudios,
  sessionPause: sessionPauseAudios,
  sessionQuit: sessionQuitAudios,
} as const;

export type MomAudioCategory = keyof typeof audioMap;

interface CurrentAudioState {
  text: string | null;
}

export function useAsianMomSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioState, setCurrentAudioState] = useState<CurrentAudioState>({
    text: null,
  });

  async function playMomAudio(category: MomAudioCategory): Promise<void> {
    const audioArr = audioMap[category];
    if (!audioArr || audioArr.length === 0) return;

    // Pick a random audio file
    const audioObj = audioArr[Math.floor(Math.random() * audioArr.length)];
    const src = audioObj.src;
    const text = audioObj.text;

    setIsPlaying(true);
    setCurrentAudioState({ text });

    return new Promise((resolve) => {
      const audio = new window.Audio(src);

      const cleanup = () => {
        setIsPlaying(false);
        setCurrentAudioState({ text: null });
        audio.removeEventListener("ended", cleanup);
        audio.removeEventListener("error", cleanup);
        resolve();
      };

      audio.addEventListener("ended", cleanup);
      audio.addEventListener("error", cleanup);

      audio.play().catch(cleanup);
    });
  }

  // Get current text for overlay
  function getCurrentText(): string {
    return currentAudioState.text || "";
  }

  // Per-category play functions
  return {
    isPlaying,
    getCurrentText,
    playSessionStart: () => playMomAudio("sessionStart"),
    playSessionEnd: () => playMomAudio("sessionEnd"),
    playBreakStart: () => playMomAudio("breakStart"),
    playBreakEnd: () => playMomAudio("breakEnd"),
    playFocusReminder: () => playMomAudio("focusReminder"),
    playSessionPause: () => playMomAudio("sessionPause"),
    playSessionQuit: () => playMomAudio("sessionQuit"),
  };
}