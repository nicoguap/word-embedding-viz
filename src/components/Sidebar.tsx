import { EmbeddingSpace } from '../types';

interface SidebarProps {
  spaces: EmbeddingSpace[];
  selectedSpace: EmbeddingSpace;
  onSpaceSelect: (space: EmbeddingSpace) => void;
}

export const Sidebar = ({ spaces, selectedSpace, onSpaceSelect }: SidebarProps) => {
  return (
    <div className="w-64 bg-gray-100 border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Embedding Spaces</h2>
      <div className="space-y-2">
        {spaces.map((space) => (
          <button
            key={space.id}
            onClick={() => onSpaceSelect(space)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedSpace.id === space.id
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{space.name}</div>
            <div className={`text-sm ${
              selectedSpace.id === space.id
                ? 'text-blue-100'
                : 'text-gray-500'
            }`}>
              {space.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};