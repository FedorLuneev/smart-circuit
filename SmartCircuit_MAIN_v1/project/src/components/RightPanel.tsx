import { FileText, Network } from 'lucide-react';
import type { PowerLine } from '../lib/supabase';

interface RightPanelProps {
  lines: PowerLine[];
}

export function RightPanel({ lines }: RightPanelProps) {
  const totalPower = lines.reduce((sum, line) => sum + Number(line.power_kw), 0);

  const mainBreaker = totalPower <= 10 ? '25A 2P' : totalPower <= 15 ? '32A 2P' : '40A 2P';

  const inputCable = totalPower <= 10 ? '4.0 mm²' : totalPower <= 15 ? '6.0 mm²' : '10.0 mm²';

  const specifications = [
    'RCD type A required for socket circuits',
    'AFDD recommended for final circuits',
  ];

  return (
    <div className="w-1/4 bg-white border-l border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Results</h2>

      <div className="space-y-6">
        <div className="bg-[#F5F7FA] rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Main Breaker</div>
          <div className="text-2xl font-semibold text-gray-900">{mainBreaker}</div>
        </div>

        <div className="bg-[#F5F7FA] rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Input Cable</div>
          <div className="text-2xl font-semibold text-gray-900">{inputCable}</div>
        </div>

        <div className="bg-[#F5F7FA] rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Power</div>
          <div className="text-2xl font-semibold text-gray-900">{totalPower.toFixed(1)} kW</div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Specifications</h3>
          <ul className="space-y-2">
            {specifications.map((spec, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-[#0066CC] mr-2">•</span>
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 pt-4">
          <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium">
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
          <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium">
            <Network className="w-4 h-4" />
            Single-line diagram
          </button>
        </div>
      </div>
    </div>
  );
}
