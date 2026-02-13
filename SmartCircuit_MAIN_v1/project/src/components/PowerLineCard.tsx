import { Plug, Lightbulb, Flame, Droplets, Waves } from 'lucide-react';
import type { PowerLine } from '../lib/supabase';

interface PowerLineCardProps {
  line: PowerLine;
}

const iconMap = {
  socket: Plug,
  lamp: Lightbulb,
  stove: Flame,
  pump: Droplets,
  sauna: Waves,
};

export function PowerLineCard({ line }: PowerLineCardProps) {
  const IconComponent = iconMap[line.icon as keyof typeof iconMap] || Plug;

  return (
    <div className="bg-[#F5F7FA] rounded-lg p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="bg-white rounded-lg p-2 flex-shrink-0">
          <IconComponent className="w-5 h-5 text-[#0066CC]" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-2">{line.name}</h3>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="text-gray-600">
              Power: <span className="font-medium text-gray-900">{line.power_kw} kW</span>
            </div>
            <div className="text-gray-600">
              Length: <span className="font-medium text-gray-900">{line.length_m} m</span>
            </div>
            <div className="text-gray-600">
              Breaker: <span className="font-medium text-gray-900">{line.breaker}</span>
            </div>
            <div className="text-gray-600">
              Cable: <span className="font-medium text-gray-900">{line.cable}</span>
            </div>
            <div className="text-gray-600">
              RCD: <span className="font-medium text-gray-900">{line.rcd}</span>
            </div>
            <div className="text-gray-600">
              AFDD: <span className="font-medium text-gray-900">{line.afdd}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
