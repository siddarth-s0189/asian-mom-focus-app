
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Globe, ListTodo, Users, Settings } from "lucide-react";
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
    <div className="space-y-6">
      {/* Audio & Speech Section */}
      <Card className="bg-[#2a3441] border-[#3a4451] rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl font-medium flex items-center gap-3">
            <Settings className="w-5 h-5" />
            Audio & Speech
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm font-normal">
            Configure audio feedback and motivational speech
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-base font-medium">Sound Effects</div>
              <div className="text-gray-400 text-sm">Play audio during focus sessions</div>
            </div>
            <Switch 
              checked={true} 
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border-2 data-[state=unchecked]:border-red-500 data-[state=checked]:border-2 data-[state=checked]:border-green-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-base font-medium">Motivational Speech</div>
              <div className="text-gray-400 text-sm">Enable Asian mom motivational speeches</div>
            </div>
            <Switch 
              checked={true}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border-2 data-[state=unchecked]:border-red-500 data-[state=checked]:border-2 data-[state=checked]:border-green-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="bg-[#2a3441] border-[#3a4451] rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl font-medium flex items-center gap-3">
            <Calendar className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm font-normal">
            Control how you receive notifications and reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-base font-medium">Email Reminders</div>
              <div className="text-gray-400 text-sm">Get daily study reminders via email</div>
            </div>
            <Switch 
              checked={emailRemindersEnabled} 
              onCheckedChange={setEmailRemindersEnabled}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border-2 data-[state=unchecked]:border-red-500 data-[state=checked]:border-2 data-[state=checked]:border-green-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-base font-medium">Session Goal Reminders</div>
              <div className="text-gray-400 text-sm">Get reminded about your session goals during breaks</div>
            </div>
            <Switch 
              checked={false}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border-2 data-[state=unchecked]:border-red-500 data-[state=checked]:border-2 data-[state=checked]:border-green-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Session Preferences Section */}
      <Card className="bg-[#2a3441] border-[#3a4451] rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl font-medium flex items-center gap-3">
            <Globe className="w-5 h-5" />
            Session Preferences
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm font-normal">
            Customize your focus session experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-base font-medium">Blocklist for Sessions</div>
              <div className="text-gray-400 text-sm">Block distracting websites during focus sessions</div>
            </div>
            <Switch 
              checked={blocklistEnabled} 
              onCheckedChange={setBlocklistEnabled}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border-2 data-[state=unchecked]:border-red-500 data-[state=checked]:border-2 data-[state=checked]:border-green-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-base font-medium">Automatic Breaks</div>
              <div className="text-gray-400 text-sm">Enable automatic break scheduling for long sessions</div>
            </div>
            <Switch 
              checked={false}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border-2 data-[state=unchecked]:border-red-500 data-[state=checked]:border-2 data-[state=checked]:border-green-500"
            />
          </div>
          
          {blocklistEnabled && (
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="flex gap-3 mb-3">
                <Input
                  className="flex-1 bg-[#1a2332] border-gray-600 text-gray-100 text-sm"
                  placeholder="Block site domain (future)"
                  disabled
                />
                <Button
                  disabled
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 px-4"
                >
                  Add
                </Button>
              </div>
              <div className="bg-[#1a2332] text-gray-400 rounded-md p-3 text-sm">
                No sites in blocklist (future feature)
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card className="bg-[#2a3441] border-[#3a4451] rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl font-medium flex items-center gap-3">
            <Users className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm font-normal">
            Customize the visual appearance of the app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-base font-medium">Dark Mode</div>
              <div className="text-gray-400 text-sm">Enable dark theme (always on for AsianMom.gg)</div>
            </div>
            <Switch 
              checked={true}
              disabled
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-transparent data-[state=unchecked]:border-2 data-[state=unchecked]:border-red-500 data-[state=checked]:border-2 data-[state=checked]:border-green-500"
            />
          </div>
          
          <div className="pt-4 border-t border-gray-600">
            <div className="text-white text-base font-medium mb-4">Choose Persona</div>
            <div className="grid grid-cols-2 gap-4">
              {personas.map(persona => (
                <button
                  key={persona.value}
                  className={`border-2 rounded-lg p-4 flex flex-col items-center transition-all hover:scale-105
                    ${
                      selectedPersona === persona.value
                        ? "border-red-500 bg-red-600/10"
                        : "border-gray-600 bg-[#1a2332] hover:border-gray-500"
                    }`}
                  onClick={() => setSelectedPersona(persona.value)}
                  type="button"
                >
                  <img
                    src={persona.img}
                    alt={persona.label}
                    className="w-20 h-20 rounded-full object-cover mb-3"
                    draggable={false}
                  />
                  <span className="text-white text-sm font-medium">{persona.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Tasks Section */}
      <Card className="bg-[#2a3441] border-[#3a4451] rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl font-medium flex items-center gap-3">
            <ListTodo className="w-5 h-5" />
            Default Tasks
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm font-normal">
            Set up default tasks for your study sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-3">
            <Input
              className="flex-1 bg-[#1a2332] border-gray-600 text-gray-100 text-sm"
              placeholder="Add default task (future)"
              disabled
            />
            <Button
              disabled
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 px-4"
            >
              Add
            </Button>
          </div>
          <div className="bg-[#1a2332] text-gray-400 rounded-md p-3 text-sm">
            No default tasks set (future feature)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
