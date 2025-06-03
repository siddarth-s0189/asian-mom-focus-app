
import { useState, useCallback } from 'react';

interface SpeechConfig {
  strictness: number; // 1-5 scale from onboarding
}

export const useAsianMomSpeech = (config: SpeechConfig) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  // Asian mom phrases for different situations
  const phrases = {
    sessionStart: [
      "Aiya! You better focus now, ah! No more wasting time!",
      "Listen ah, I'm watching you! Better work hard or else!",
      "Good you finally start! But don't think can slack off!",
      "Now you show me you can focus! No playing around!"
    ],
    breakReminder: [
      "Break time coming soon! You better finish what you doing!",
      "Aiya, almost break time! Don't rush last minute!",
      "Break coming in few minutes! Better wrap up properly!",
      "You working hard? Break time soon, don't waste it!"
    ],
    breakStart: [
      "Okay lah, take break! But don't take too long ah!",
      "Rest first! But remember, only short break!",
      "Good job! Now rest small small only!",
      "Break time! But don't go play play!"
    ],
    breakEnd: [
      "Break over! Back to work! No more resting!",
      "Enough rest already! Time to work again!",
      "Break finish! Now you better focus even more!",
      "Back to work! I hope you recharged properly!"
    ],
    focusReminders: [
      "Eh! You still focusing? Better not be distracted!",
      "I'm watching you! No scrolling phone!",
      "Focus focus! Don't let me catch you slacking!",
      "Work properly! I can see everything!",
      "Better be productive! No wasting time!"
    ],
    sessionComplete: [
      "Wah! You actually finished! Very good!",
      "Finally! You can focus when you want to!",
      "Good job! I'm proud of you!",
      "See? When you try hard, can succeed!",
      "Excellent! You prove me wrong today!"
    ]
  };

  const getRandomPhrase = (category: keyof typeof phrases) => {
    const categoryPhrases = phrases[category];
    return categoryPhrases[Math.floor(Math.random() * categoryPhrases.length)];
  };

  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech first to prevent duplicates
        speechSynthesis.cancel();
        
        // Wait a bit for the cancel to take effect
        setTimeout(() => {
          setIsSpeaking(true);
          setCurrentMessage(text);
          
          const utterance = new SpeechSynthesisUtterance(text);
          
          // Force load voices and select Asian voice
          let voices = speechSynthesis.getVoices();
          
          // If voices aren't loaded yet, wait for them
          if (voices.length === 0) {
            speechSynthesis.addEventListener('voiceschanged', () => {
              voices = speechSynthesis.getVoices();
              selectVoiceAndSpeak();
            }, { once: true });
          } else {
            selectVoiceAndSpeak();
          }
          
          function selectVoiceAndSpeak() {
            // Try to find Asian voices in order of preference
            const asianVoice = voices.find(voice => 
              voice.lang.includes('zh-') || 
              voice.lang.includes('ja-') || 
              voice.lang.includes('ko-') ||
              voice.name.toLowerCase().includes('karen') ||
              voice.name.toLowerCase().includes('mei') ||
              voice.name.toLowerCase().includes('ting') ||
              voice.name.toLowerCase().includes('sin-ji') ||
              voice.name.toLowerCase().includes('li-mu')
            );
            
            if (asianVoice) {
              utterance.voice = asianVoice;
              console.log('Using Asian voice:', asianVoice.name);
            } else {
              console.log('No Asian voice found, using default');
            }
            
            // Adjust speech characteristics for Asian mom persona
            utterance.rate = 0.9; // Slightly slower for emphasis
            utterance.pitch = 1.2; // Higher pitch for Asian female voice
            utterance.volume = 0.8;
            
            utterance.onend = () => {
              setIsSpeaking(false);
              setCurrentMessage('');
              resolve();
            };
            
            utterance.onerror = (event) => {
              console.error('Speech error:', event);
              setIsSpeaking(false);
              setCurrentMessage('');
              resolve();
            };
            
            // Ensure we're not already speaking before starting new speech
            if (!speechSynthesis.speaking) {
              speechSynthesis.speak(utterance);
            } else {
              // If still speaking, wait and try again
              setTimeout(() => {
                if (!speechSynthesis.speaking) {
                  speechSynthesis.speak(utterance);
                }
              }, 100);
            }
          }
        }, 100);
      } else {
        // Fallback if speech synthesis not available
        console.log('Speech synthesis not available, showing message only');
        setCurrentMessage(text);
        setTimeout(() => {
          setIsSpeaking(false);
          setCurrentMessage('');
          resolve();
        }, 3000);
      }
    });
  }, []);

  const speakSessionStart = useCallback(() => {
    const phrase = getRandomPhrase('sessionStart');
    return speak(phrase);
  }, [speak]);

  const speakBreakReminder = useCallback(() => {
    const phrase = getRandomPhrase('breakReminder');
    return speak(phrase);
  }, [speak]);

  const speakBreakStart = useCallback(() => {
    const phrase = getRandomPhrase('breakStart');
    return speak(phrase);
  }, [speak]);

  const speakBreakEnd = useCallback(() => {
    const phrase = getRandomPhrase('breakEnd');
    return speak(phrase);
  }, [speak]);

  const speakFocusReminder = useCallback(() => {
    const phrase = getRandomPhrase('focusReminders');
    return speak(phrase);
  }, [speak]);

  const speakSessionComplete = useCallback(() => {
    const phrase = getRandomPhrase('sessionComplete');
    return speak(phrase);
  }, [speak]);

  // Calculate reminder frequency based on strictness (1-5 scale)
  const getReminderInterval = useCallback(() => {
    // Strictness 1: every 20 minutes, Strictness 5: every 5 minutes
    const intervals = [20, 15, 12, 8, 5];
    return intervals[config.strictness - 1] * 60 * 1000; // Convert to milliseconds
  }, [config.strictness]);

  return {
    isSpeaking,
    currentMessage,
    speakSessionStart,
    speakBreakReminder,
    speakBreakStart,
    speakBreakEnd,
    speakFocusReminder,
    speakSessionComplete,
    getReminderInterval
  };
};
