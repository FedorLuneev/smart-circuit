import { useState } from 'react';
import { X } from 'lucide-react';
import type { PowerLine } from '../lib/supabase';

interface AddLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (line: Omit<PowerLine, 'id' | 'project_id' | 'created_at'>) => void;
}

const loadTypes = {
  'БАЗОВЫЕ': [
    { value: 'socket', label: 'Розетки' },
    { value: 'lamp', label: 'Освещение' },
    { value: 'stove', label: 'Электроплита' },
    { value: 'washer', label: 'Стиральная машина' },
    { value: 'dishwasher', label: 'Посудомойка' },
    { value: 'boiler', label: 'Бойлер' },
  ],
  'ЧАСТНЫЙ ДОМ': [
    { value: 'pump', label: 'Скважинный насос' },
    { value: 'pump_fecal', label: 'Фекальный насос' },
    { value: 'sauna', label: 'Сауна' },
    { value: 'floor', label: 'Теплый пол' },
    { value: 'mixer', label: 'Бетономешалка' },
    { value: 'welder', label: 'Сварочник' },
  ],
  'КЛИМАТ': [
    { value: 'ac', label: 'Кондиционер' },
    { value: 'ventilation', label: 'Вентиляция' },
  ],
};

const defaultPowers = {
  socket: 3.5,
  lamp: 0.5,
  stove: 7.0,
  pump: 1.5,
  sauna: 9.0,
  washer: 2.2,
  dishwasher: 1.8,
  boiler: 2.0,
  ac: 2.5,
  ventilation: 0.5,
  pump_fecal: 0.75,
  floor: 1.5,
  mixer: 1.0,
  welder: 5.5,
};

export function AddLineModal({ isOpen, onClose, onAdd }: AddLineModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('socket');
  const [power, setPower] = useState(3.5);
  const [length, setLength] = useState(10);
  const [phase, setPhase] = useState('1 phase');
  const [method, setMethod] = useState('В штробе');
  const [showResults, setShowResults] = useState(false);
  const [calculated, setCalculated] = useState<any>(null);

  const isLengthValid = length >= 0.1;

  const calculateResults = () => {
    let breaker = '16A C';
    let cable = '3×2.5';
    let rcd = '30mA';
    let afdd = 'no';

    if (power <= 1.5) {
      breaker = '10A C';
      cable = '3×1.5';
    } else if (power <= 3.5) {
      breaker = '16A C';
      cable = '3×2.5';
    } else if (power <= 5.5) {
      breaker = '20A C';
      cable = '3×4.0';
    } else if (power <= 7.5) {
      breaker = '32A C';
      cable = '5×6.0';
    } else if (power <= 10) {
      breaker = '40A C';
      cable = '5×10';
    } else {
      breaker = '50A C';
      cable = '5×16';
    }

    if (icon === 'stove' || icon === 'welder') {
      breaker = '40A C';
      cable = '5×6.0';
    }

    setCalculated({ breaker, cable, rcd, afdd });
    setShowResults(true);
  };

  const handleAdd = () => {
    if (!isLengthValid || !name) return;

    const newLine: Omit<PowerLine, 'id' | 'project_id' | 'created_at'> = {
      name,
      icon,
      power_kw: power,
      length_m: length,
      breaker: calculated?.breaker || '16A C',
      cable: calculated?.cable || '3×2.5',
      rcd: calculated?.rcd || '30mA',
      afdd: calculated?.afdd || 'no',
      order_index: 0,
    };

    onAdd(newLine);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setIcon('socket');
    setPower(3.5);
    setLength(10);
    setPhase('1 phase');
    setMethod('В штробе');
    setShowResults(false);
    setCalculated(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">➕ Добавить новую линию</h2>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название линии
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Розетки кухня"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип нагрузки
            </label>
            <select
              value={icon}
              onChange={(e) => {
                setIcon(e.target.value);
                setPower(defaultPowers[e.target.value as keyof typeof defaultPowers] || 2.0);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
            >
              {Object.entries(loadTypes).map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Мощность (кВт)
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPower(Math.max(0.1, power - 0.1))}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                −
              </button>
              <input
                type="number"
                value={power}
                onChange={(e) => setPower(parseFloat(e.target.value) || 0.1)}
                step="0.1"
                min="0.1"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent text-center"
              />
              <button
                onClick={() => setPower(power + 0.1)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Длина линии (м)
            </label>
            <input
              type="range"
              min="0.1"
              max="100"
              step="0.1"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value) || 0.1)}
                step="0.1"
                min="0.1"
                className={`w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent ${
                  isLengthValid ? 'border-gray-300' : 'border-red-500 ring-1 ring-red-500'
                }`}
              />
              <span className="text-sm text-gray-600">м</span>
            </div>
            {!isLengthValid && (
              <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                ❌ Длина не может быть меньше 0.1 м
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фазы
            </label>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="1 phase"
                  checked={phase === '1 phase'}
                  onChange={(e) => setPhase(e.target.value)}
                  className="w-4 h-4 text-[#0066CC]"
                />
                <span className="ml-2 text-sm text-gray-700">1 фаза</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="3 phases"
                  checked={phase === '3 phases'}
                  onChange={(e) => setPhase(e.target.value)}
                  className="w-4 h-4 text-[#0066CC]"
                />
                <span className="ml-2 text-sm text-gray-700">3 фазы</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Способ прокладки
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
            >
              <option>В штробе</option>
              <option>В кабель-канале</option>
              <option>Открыто</option>
              <option>В земле</option>
            </select>
          </div>

          {showResults && calculated && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">📘 Результат расчета по ПУЭ</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="text-xs text-gray-600">Автомат</div>
                  <div className="font-semibold text-gray-900">{calculated.breaker}</div>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="text-xs text-gray-600">Кабель</div>
                  <div className="font-semibold text-gray-900">{calculated.cable}</div>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="text-xs text-gray-600">УЗО</div>
                  <div className="font-semibold text-gray-900">{calculated.rcd}</div>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="text-xs text-gray-600">УЗДП</div>
                  <div className="font-semibold text-gray-900">40A / 2P</div>
                </div>
              </div>
              <a
                href="#"
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                📘 СП 256.1325800.2016 п. 9.2
              </a>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Отмена
            </button>
            {!showResults ? (
              <button
                onClick={calculateResults}
                disabled={!isLengthValid || !name}
                className="flex-1 px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Рассчитать и добавить
              </button>
            ) : (
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3] transition-colors font-medium"
              >
                Добавить линию
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
