
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Globe, ListTodo, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const personas = [
  { label: "Asian Mom", value: "asian-mom", img: "/avatars/asian-mom.png" },
  { label: "Indian Dad", value: "indian-dad", img: "/avatars/indian-dad.png" },
  { label: "Hispanic Mom", value: "hispanic-mom", img: "/avatars/hispanic-mom.png" },
  { label: "Arab Dad", value: "arab-dad", img: "/avatars/arab-dad.png" },
];

export default function CustomisationSettings() {
  const [selectedPersona, setSelectedPersona] = useState(personas[0].value);
  const [emailRemindersEnabled, setEmailRemindersEnabled] = useState(true);
  const [blocklistEnabled, setBlocklistEnabled] = useState(false);

  return (
    <div className="space-y-8">
      {/* SECTION: Customisation */}
      <Card className="bg-[#171E2A]/90 border-none shadow-lg rounded-xl px-0 py-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-2xl font-semibold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Customisation
          </CardTitle>
          <CardDescription className="text-gray-400 font-normal mt-1">
            Adjust reminders, blocklist, default tasks, and persona. All features are front-end only placeholders for future enhancement.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-8 px-6">
          {/* Email Reminders */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-base text-white font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Study Email Reminders
                </span>
                <div className="text-sm text-gray-400">Get daily study reminders via email</div>
              </div>
              <Switch checked={emailRemindersEnabled} onCheckedChange={setEmailRemindersEnabled} />
            </div>
            {emailRemindersEnabled && (
              <div className="w-full p-4 mt-2 border border-gray-700/40 rounded-lg bg-[#1a2639] text-gray-400 flex justify-center text-sm animate-fade-in">
                Calendar UI placeholder for scheduling email reminders
              </div>
            )}
            <div className="flex justify-end mt-3">
              <Button 
                className="bg-white/20 text-white font-semibold rounded-full px-6 py-2 backdrop-blur border-none hover:bg-white/30 transition-colors"
                disabled
              >
                Save Reminder Schedule
              </Button>
            </div>
          </div>
          {/* Blocklist */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-base text-white font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Blocklist for Sessions
                </span>
                <div className="text-sm text-gray-400">Block distracting websites during focus sessions</div>
              </div>
              <Switch checked={blocklistEnabled} onCheckedChange={setBlocklistEnabled} />
            </div>
            {blocklistEnabled && (
              <div className="mt-2">
                <div className="flex gap-3 mb-3">
                  <Input
                    className="w-2/3 bg-[#151A25] border-gray-700 text-gray-100 rounded-md"
                    placeholder="Block site domain (future)"
                    disabled
                  />
                  <Button
                    disabled
                    className="bg-white/20 text-white font-semibold rounded-full px-5 border-none hover:bg-white/30 transition-colors"
                  >
                    Add
                  </Button>
                </div>
                <div className="bg-[#172133] text-gray-500 rounded-md p-2 text-sm">
                  No sites in blocklist (future feature)
                </div>
              </div>
            )}
          </div>
          {/* Default Tasks */}
          <div>
            <span className="text-base text-white font-medium flex items-center mb-2 gap-2">
              <ListTodo className="w-4 h-4" /> Default Session Tasks
            </span>
            <div className="flex gap-3 mb-3">
              <Input
                className="w-2/3 bg-[#151A25] border-gray-700 text-gray-100 rounded-md"
                placeholder="Add default task (future)"
                disabled
              />
              <Button
                disabled
                className="bg-white/20 text-white font-semibold rounded-full px-5 border-none hover:bg-white/30 transition-colors"
              >
                Add
              </Button>
            </div>
            <div className="bg-[#172133] text-gray-500 rounded-md p-2 text-sm">
              No default tasks set (future feature)
            </div>
          </div>
          {/* Persona Selection */}
          <div>
            <span className="text-base text-white font-medium flex items-center mb-4">
              Choose Persona
            </span>
            <div className="flex gap-4 flex-wrap">
              {personas.map(persona => (
                <button
                  key={persona.value}
                  className={`border-2 rounded-2xl p-2 flex flex-col items-center transition-all
                    ${
                      selectedPersona === persona.value
                        ? "border-red-500 bg-red-600/10 ring-2 ring-red-500"
                        : "border-gray-700 bg-[#172133] hover:scale-105"
                    }`}
                  onClick={() => setSelectedPersona(persona.value)}
                  type="button"
                  style={{ width: 80 }}
                >
                  <img
                    src={persona.img}
                    alt={persona.label}
                    className="w-12 h-12 rounded-full object-cover mb-1"
                    draggable={false}
                  />
                  <span className="text-xs text-white">{persona.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
