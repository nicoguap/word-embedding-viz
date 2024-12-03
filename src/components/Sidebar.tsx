import { EmbeddingSpace } from '../types';

interface SidebarProps {
  spaces: EmbeddingSpace[];
  selectedSpace: EmbeddingSpace;
  onSpaceSelect: (space: EmbeddingSpace) => void;
}

export const Sidebar = ({ spaces, selectedSpace, onSpaceSelect }: SidebarProps) => {
  return (
    <div className="w-64 bg-slate-950 border-r border-gray-700 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-white">Embedding Spaces</h2>
      <div className="space-y-2">
        {spaces.map((space) => (
          <button
            key={space.id}
            onClick={() => onSpaceSelect(space)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedSpace.id === space.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            <div className="font-medium">{space.name}</div>
            <div className={`text-sm ${
              selectedSpace.id === space.id
                ? 'text-blue-100'
                : 'text-gray-400'
            }`}>
              {space.description}
            </div>
          </button>
        ))}
        <button
            
            className='w-full text-left p-3 rounded-lg transition-colors 
                bg-gray-800 hover:bg-gray-700 text-white'
          >
            <div className="font-medium">More Spaces</div>
            <div className={`text-sm 
                text-gray-400
            `}>
              Coming Soon!
            </div>
          </button>
      </div>
    </div>
  );
};