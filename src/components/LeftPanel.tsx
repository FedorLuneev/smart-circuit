import { Plus } from 'lucide-react';
import type { Project } from '../lib/supabase';

interface LeftPanelProps {
  project: Project;
  onProjectUpdate: (updates: Partial<Project>) => void;
  onAddLine: () => void;
}

export function LeftPanel({ project, onProjectUpdate, onAddLine }: LeftPanelProps) {
  return (
    <div className="w-1/4 bg-white border-r border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Parameters</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={project.name}
            onChange={(e) => onProjectUpdate({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Building Type
          </label>
          <select
            value={project.building_type}
            onChange={(e) => onProjectUpdate({ building_type: e.target.value as Project['building_type'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Phase
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="phase"
                value="1 phase"
                checked={project.phase === '1 phase'}
                onChange={(e) => onProjectUpdate({ phase: e.target.value as Project['phase'] })}
                className="w-4 h-4 text-[#0066CC] focus:ring-[#0066CC]"
              />
              <span className="ml-2 text-sm text-gray-700">1 phase</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="phase"
                value="3 phases"
                checked={project.phase === '3 phases'}
                onChange={(e) => onProjectUpdate({ phase: e.target.value as Project['phase'] })}
                className="w-4 h-4 text-[#0066CC] focus:ring-[#0066CC]"
              />
              <span className="ml-2 text-sm text-gray-700">3 phases</span>
            </label>
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={project.wooden_construction}
              onChange={(e) => onProjectUpdate({ wooden_construction: e.target.checked })}
              className="w-4 h-4 text-[#0066CC] rounded focus:ring-[#0066CC]"
            />
            <span className="ml-2 text-sm text-gray-700">Wooden construction?</span>
          </label>
        </div>

        <button
          onClick={onAddLine}
          className="w-full bg-[#0066CC] text-white py-2 px-4 rounded-md hover:bg-[#0052A3] transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add line
        </button>
      </div>
    </div>
  );
}
