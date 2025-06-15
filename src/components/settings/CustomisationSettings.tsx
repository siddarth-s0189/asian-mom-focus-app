
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  const [reminderDate, setReminderDate] = useState<Date>();
  const [reminderTime, setReminderTime] = useState("09:00");
  const [reminderFrequency, setReminderFrequency] = useState("daily");

  return (
    <Card className="bg-gray-800/30 border-gray-700/50 rounded-xl backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-white text-2xl font-medium flex items-center gap-3">
          <Settings className="w-6 h-6" />
          Customisation
        </CardTitle>
        <CardDescription className="text-gray-300 text-lg">
          Personalize your AsianMom.gg experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Schedule with Calendar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-white" />
              <div>
                <div className="text-white text-xl font-medium">Schedule with Calendar</div>
                <div className="text-gray-400 text-lg">Get daily study reminders via email</div>
              </div>
            </div>
            <Switch 
              checked={emailRemindersEnabled} 
              onCheckedChange={setEmailRemindersEnabled}
              className="data-[state=checked]:bg-transparent data-[state=unchecked]:bg-transparent data-[state=unchecked]:border-2 data-[state=unchecked]:border-red-500 data-[state=checked]:border-2 data-[state=checked]:border-green-500"
            />
          </div>
          
          {emailRemindersEnabled && (
            <div className="ml-8 pt-4 border-t border-gray-600 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white text-lg font-medium mb-2 block">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-gray-900/50 border-gray-600 text-gray-100",
                          !reminderDate && "text-gray-400"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {reminderDate ? format(reminderDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={reminderDate}
                        onSelect={setReminderDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="text-white text-lg font-medium mb-2 block">Time</label>
                  <Input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="bg-gray-900/50 border-gray-600 text-gray-100 text-lg h-12"
                  />
                </div>
                
                <div>
                  <label className="text-white text-lg font-medium mb-2 block">Frequency</label>
                  <select
                    value={reminderFrequency}
                    onChange={(e) => setReminderFrequency(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-600 text-gray-100 text-lg h-12 rounded-md px-3"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="weekdays">Weekdays Only</option>
                    <option value="weekends">Weekends Only</option>
                  </select>
                </div>
              </div>
              
              <Button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 text-lg">
                Save Schedule
              </Button>
            </div>
          )}
        </div>

        {/* Manage Blocklist */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-white text-xl font-medium">Manage Blocklist of Sites</div>
              <div className="text-gray-400 text-lg">Block distracting websites during focus sessions</div>
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
                  className="flex-1 bg-gray-900/50 border-gray-600 text-gray-100 text-lg h-12"
                  placeholder="Block site domain (future)"
                  disabled
                />
                <Button
                  disabled
                  className="bg-white/10 hover:bg-white/20 text-white border-gray-600 px-6 py-3 text-lg"
                >
                  Add
                </Button>
              </div>
              <div className="bg-gray-900/50 text-gray-400 rounded-md p-4 text-lg">
                No sites in blocklist (future feature)
              </div>
            </div>
          )}
        </div>

        {/* Choose Persona */}
        <div className="space-y-6">
          <div className="text-white text-xl font-medium">Choose Persona</div>
          <div className="grid grid-cols-2 gap-8">
            {personas.map(persona => (
              <button
                key={persona.value}
                className={`border-2 rounded-xl p-8 flex flex-col items-center transition-all hover:scale-105
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
                  className="w-32 h-32 rounded-full object-cover mb-6"
                  draggable={false}
                />
                <span className="text-white text-lg font-medium">{persona.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Default Tasks */}
        <div className="space-y-4">
          <div className="text-white text-xl font-medium">Default Tasks</div>
          <div className="text-gray-400 text-lg mb-4">Set up default tasks for your study sessions</div>
          <div className="flex gap-3 mb-3">
            <Input
              className="flex-1 bg-gray-900/50 border-gray-600 text-gray-100 text-lg h-12"
              placeholder="Add default task (future)"
              disabled
            />
            <Button
              disabled
              className="bg-white/10 hover:bg-white/20 text-white border-gray-600 px-6 py-3 text-lg"
            >
              Add
            </Button>
          </div>
          <div className="bg-gray-900/50 text-gray-400 rounded-md p-4 text-lg">
            No default tasks set (future feature)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
