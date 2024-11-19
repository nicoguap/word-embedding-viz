import { useState } from 'react';
import { WordEmbeddingViz } from './components/WordEmbeddingViz';
import { Sidebar } from './components/Sidebar';
import { useEmbeddings } from './hooks/useEmbeddings';

const App = () => {
  const { spaces, loading, error } = useEmbeddings();
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading embeddings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!spaces.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">No embedding spaces available</div>
      </div>
    );
  }

  const currentSpace = selectedSpace 
    ? spaces.find(space => space.id === selectedSpace) ?? spaces[0]
    : spaces[0];

  return (
    <div className="flex h-screen">
      <Sidebar 
        spaces={spaces}
        selectedSpace={currentSpace}
        onSpaceSelect={(space) => setSelectedSpace(space.id)}
      />
      <div className="flex-1">
        <WordEmbeddingViz points={currentSpace.points} />
      </div>
    </div>
  );
};

export default App;