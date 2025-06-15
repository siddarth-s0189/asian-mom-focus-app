
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Globe, ListTodo } from "lucide-react";
import { Input } from "@/components/ui/input"; // <-- Added import

const personas = [
  { label: "Asian Mom", value: "asian-mom", img: "/avatars/asian-mom.png" },
  { label: "Indian Dad", value: "indian-dad", img: "/avatars/indian-dad.png" },
  { label: "Hispanic Mom", value: "hispanic-mom", img: "/avatars/hispanic-mom.png" },
  { label: "Arab Dad", value: "arab-dad", img: "/avatars/arab-dad.png" },
];

export default function CustomisationSettings() {
  const [selectedPersona, setSelectedPersona] = useState(personas[0].value);

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
      <CardContent className="space-y-6">
        <div>
          <div className="flex flex-col gap-2">
            <label className="text-base text-white flex items-center">
              <Calendar className="w-4 h-4 mr-2" /> Study Email Reminders
            </label>
            {/* Placeholder calendar */}
            <div className="w-full p-4 border border-gray-600 rounded bg-gray-800 text-gray-400 flex items-center">
              <span>Calendar UI placeholder for scheduling email reminders</span>
            </div>
            <Button className="mt-2 w-fit" disabled>Save Reminder Schedule</Button>
          </div>
        </div>
        <div>
          <label className="text-base text-white flex items-center mb-2">
            <Globe className="w-4 h-4 mr-2" /> Blocklist for Sessions
          </label>
          <div className="flex gap-2 mb-2">
            {/* Placeholder UI */}
            <Input className="w-1/2" placeholder="Block site domain (future)" disabled />
            <Button disabled>Add</Button>
          </div>
          <div className="bg-gray-800 text-gray-500 rounded p-2">No sites in blocklist (future feature)</div>
        </div>
        <div>
          <label className="text-base text-white flex items-center mb-2">
            <ListTodo className="w-4 h-4 mr-2" /> Default Session Tasks
          </label>
          <div className="flex gap-2 mb-2">
            <Input className="w-1/2" placeholder="Add default task (future)" disabled />
            <Button disabled>Add</Button>
          </div>
          <div className="bg-gray-800 text-gray-500 rounded p-2">No default tasks set (future feature)</div>
        </div>
        <div>
          <label className="text-base text-white flex items-center mb-2">
            Choose Persona
          </label>
          <div className="flex gap-4">
            {personas.map(persona => (
              <button
                key={persona.value}
                className={`border-2 rounded-2xl p-2 flex flex-col items-center transition-all ${selectedPersona === persona.value ? "border-red-500 bg-red-600/10" : "border-gray-700 bg-gray-800"}`}
                onClick={() => setSelectedPersona(persona.value)}
                type="button"
              >
                <img src={persona.img} alt={persona.label} className="w-12 h-12 rounded-full object-cover mb-1" />
                <span className="text-sm text-white">{persona.label}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
