
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Globe, ListTodo } from "lucide-react";
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
    <Card className="bg-gray-900/80 border-gray-700/50 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex gap-2 items-center">
          <Users className="w-6 h-6" /> Customisation
        </CardTitle>
        <CardDescription className="text-gray-400">
          Adjust your reminders, blocklist, default tasks, and persona.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Email Reminders */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-base text-white flex items-center">
              <Calendar className="w-4 h-4 mr-2" /> Study Email Reminders
            </label>
            <Switch checked={emailRemindersEnabled} onCheckedChange={setEmailRemindersEnabled} />
          </div>
          {/* Only show calendar UI if enabled */}
          {emailRemindersEnabled && (
            <div className="w-full p-4 border border-gray-600 rounded bg-gray-800 text-gray-400 flex items-center justify-center mt-1">
              <span>Calendar UI placeholder for scheduling email reminders</span>
            </div>
          )}
          <div className="flex justify-end">
            <Button className="mt-2 bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-colors" disabled>
              Save Reminder Schedule
            </Button>
          </div>
        </div>
        {/* Blocklist */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-base text-white flex items-center">
              <Globe className="w-4 h-4 mr-2" /> Blocklist for Sessions
            </label>
            <Switch checked={blocklistEnabled} onCheckedChange={setBlocklistEnabled} />
          </div>
          {blocklistEnabled && (
            <>
              <div className="flex gap-2 mb-2">
                <Input className="w-2/3 border-gray-600 bg-gray-800 text-gray-200" placeholder="Block site domain (future)" disabled />
                <Button disabled className="bg-white/20 text-white border border-white/30 hover:bg-white/30">Add</Button>
              </div>
              <div className="bg-gray-800 text-gray-500 rounded p-2">No sites in blocklist (future feature)</div>
            </>
          )}
        </div>
        {/* Default Tasks */}
        <div className="flex flex-col gap-2">
          <label className="text-base text-white flex items-center mb-1">
            <ListTodo className="w-4 h-4 mr-2" /> Default Session Tasks
          </label>
          <div className="flex gap-2 mb-2">
            <Input className="w-2/3 border-gray-600 bg-gray-800 text-gray-200" placeholder="Add default task (future)" disabled />
            <Button disabled className="bg-white/20 text-white border border-white/30 hover:bg-white/30">Add</Button>
          </div>
          <div className="bg-gray-800 text-gray-500 rounded p-2">No default tasks set (future feature)</div>
        </div>
        {/* Persona Selection */}
        <div>
          <label className="text-base text-white flex items-center mb-3">
            Choose Persona
          </label>
          <div className="flex gap-4 flex-wrap">
            {personas.map(persona => (
              <button
                key={persona.value}
                className={`border-2 rounded-2xl p-2 flex flex-col items-center transition-all
                  ${selectedPersona === persona.value
                    ? "border-red-500 bg-red-600/10 ring-2 ring-red-500"
                    : "border-gray-700 bg-gray-800 hover:bg-red-800/10"}
                  `}
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
  );
}
