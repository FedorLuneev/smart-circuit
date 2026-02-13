import { useEffect, useState } from 'react';
import { supabase, type Project, type PowerLine } from './lib/supabase';
import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';
import { AddLineModal } from './components/AddLineModal';

function App() {
  const [project, setProject] = useState<Project | null>(null);
  const [lines, setLines] = useState<PowerLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    initializeProject();
  }, []);

  const initializeProject = async () => {
    try {
      const { data: existingProjects } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      let currentProject: Project;

      if (existingProjects && existingProjects.length > 0) {
        currentProject = existingProjects[0];
      } else {
        const { data: newProject } = await supabase
          .from('projects')
          .insert({
            name: 'Apartment 50m²',
            building_type: 'apartment',
            phase: '1 phase',
            wooden_construction: false,
          })
          .select()
          .single();

        currentProject = newProject!;

        const exampleLines = [
          {
            project_id: currentProject.id,
            name: 'Kitchen sockets',
            icon: 'socket',
            power_kw: 3.5,
            length_m: 12,
            breaker: '16A C',
            cable: '3×2.5',
            rcd: '30mA',
            afdd: 'yes',
            order_index: 0,
          },
          {
            project_id: currentProject.id,
            name: 'Living room lights',
            icon: 'lamp',
            power_kw: 0.5,
            length_m: 8,
            breaker: '10A C',
            cable: '3×1.5',
            rcd: '30mA',
            afdd: 'no',
            order_index: 1,
          },
          {
            project_id: currentProject.id,
            name: 'Electric stove',
            icon: 'stove',
            power_kw: 7.0,
            length_m: 15,
            breaker: '32A C',
            cable: '5×6.0',
            rcd: '30mA',
            afdd: 'yes',
            order_index: 2,
          },
          {
            project_id: currentProject.id,
            name: 'Water pump',
            icon: 'pump',
            power_kw: 1.5,
            length_m: 20,
            breaker: '16A C',
            cable: '3×2.5',
            rcd: '30mA',
            afdd: 'yes',
            order_index: 3,
          },
          {
            project_id: currentProject.id,
            name: 'Sauna heater',
            icon: 'sauna',
            power_kw: 9.0,
            length_m: 25,
            breaker: '40A C',
            cable: '5×10',
            rcd: '30mA',
            afdd: 'no',
            order_index: 4,
          },
        ];

        await supabase.from('power_lines').insert(exampleLines);
      }

      setProject(currentProject);
      await loadLines(currentProject.id);
    } catch (error) {
      console.error('Error initializing project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLines = async (projectId: string) => {
    const { data } = await supabase
      .from('power_lines')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index');

    if (data) {
      setLines(data);
    }
  };

  const handleProjectUpdate = async (updates: Partial<Project>) => {
    if (!project) return;

    const updatedProject = { ...project, ...updates, updated_at: new Date().toISOString() };
    setProject(updatedProject);

    await supabase
      .from('projects')
      .update(updates)
      .eq('id', project.id);
  };

  const handleAddLine = async (lineData: Omit<PowerLine, 'id' | 'project_id' | 'created_at'>) => {
    if (!project) return;

    const newLine = {
      ...lineData,
      project_id: project.id,
      order_index: lines.length,
    };

    const { data } = await supabase
      .from('power_lines')
      .insert(newLine)
      .select()
      .single();

    if (data) {
      setLines([...lines, data]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading SmartCircuit...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-600">Error loading project</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Smart<span className="text-[#0066CC]">Circuit</span>
        </h1>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <LeftPanel
          project={project}
          onProjectUpdate={handleProjectUpdate}
          onAddLine={() => setIsModalOpen(true)}
        />
        <CenterPanel lines={lines} />
        <RightPanel lines={lines} />
      </div>

      <AddLineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddLine}
      />
    </div>
  );
}

export default App;
