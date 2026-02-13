import type { PowerLine } from '../lib/supabase';
import { PowerLineCard } from './PowerLineCard';

interface CenterPanelProps {
  lines: PowerLine[];
}

export function CenterPanel({ lines }: CenterPanelProps) {
  return (
    <div className="flex-1 bg-white p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Power Lines
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({lines.length})
          </span>
        </h2>
      </div>

      <div className="space-y-3">
        {lines.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No power lines yet. Click "Add line" to get started.
          </div>
        ) : (
          lines.map((line) => (
            <PowerLineCard key={line.id} line={line} />
          ))
        )}
      </div>
    </div>
  );
}
