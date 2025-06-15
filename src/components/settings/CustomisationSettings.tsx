
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Settings } from "lucide-react";
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
    <Card className="bg-gray-800/50 border-gray-700/50 rounded-xl backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-white text-2xl font-semibold flex items-center gap-3">
          <Settings className="w-6 h-6" />
          Customisation
        </CardTitle>
        <CardDescription className="text-gray-300 text-base">
          Personalize your AsianMom.gg experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Schedule with Calendar */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-white" />
            <div>
              <div className="text-white text-lg font-medium">Schedule with Calendar</div>
              <div className="text-gray-400 text-base">Get daily study reminders via email</div>
            </div>
          </div>
          <Switch 
            checked={emailRemindersEnabled} 
            onCheckedChange={setEmailRemindersEnabled}
            className="data-[state=checked]:bg-transparent data-[state=unchecked]:bg-transparent data-[state=unchecked]:border-2 data-[state=unchecked]:border-red-500 data-[state=checked]:border-2 data-[state=checked]:border-green-500"
          />
        </div>

        {/* Manage Blocklist */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-white text-lg font-medium">Manage Blocklist of Sites</div>
              <div className="text-gray-400 text-base">Block distracting websites during focus sessions</div>
            </div>
            <Switch 
              checked={blocklistEnabled} 
              onCheckedChange={setBlocklistEnabled}
              className="data-[state=checked]:bg-transparent data-[state=unchecked]:bg-transparent data-[state=unchecked]:border-2 data-[state=unchecked]:border-red-500 data-[state=checked]:border-2 data-[state=checked]:border-green-500"
            />
          </div>
          
          {blocklistEnabled && (
            <div className="ml-8 pt-4 border-t border-gray-600">
              <div className="flex gap-3 mb-3">
                <Input
                  className="flex-1 bg-gray-900/50 border-gray-600 text-gray-100 text-base"
                  placeholder="Block site domain (future)"
                  disabled
                />
                <Button
                  disabled
                  className="bg-white/10 hover:bg-white/20 text-white border-gray-600 px-6"
                >
                  Add
                </Button>
              </div>
              <div className="bg-gray-900/50 text-gray-400 rounded-md p-4 text-base">
                No sites in blocklist (future feature)
              </div>
            </div>
          )}
        </div>

        {/* Choose Persona */}
        <div className="space-y-4">
          <div className="text-white text-lg font-medium">Choose Persona</div>
          <div className="grid grid-cols-2 gap-6">
            {personas.map(persona => (
              <button
                key={persona.value}
                className={`border-2 rounded-xl p-6 flex flex-col items-center transition-all hover:scale-105
                  ${
                    selectedPersona === persona.value
                      ? "border-red-500 bg-red-600/10"
                      : "border-gray-600 bg-gray-900/30 hover:border-gray-500"
                  }`}
                onClick={() => setSelectedPersona(persona.value)}
                type="button"
              >
                <img
                  src={persona.img}
                  alt={persona.label}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                  draggable={false}
                />
                <span className="text-white text-base font-medium">{persona.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Default Tasks */}
        <div className="space-y-4">
          <div className="text-white text-lg font-medium">Default Tasks</div>
          <div className="text-gray-400 text-base mb-4">Set up default tasks for your study sessions</div>
          <div className="flex gap-3 mb-3">
            <Input
              className="flex-1 bg-gray-900/50 border-gray-600 text-gray-100 text-base"
              placeholder="Add default task (future)"
              disabled
            />
            <Button
              disabled
              className="bg-white/10 hover:bg-white/20 text-white border-gray-600 px-6"
            >
              Add
            </Button>
          </div>
          <div className="bg-gray-900/50 text-gray-400 rounded-md p-4 text-base">
            No default tasks set (future feature)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
