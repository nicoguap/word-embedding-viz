import { useState, useEffect } from 'react';
import { WordEmbeddingViz } from './components/WordEmbeddingViz';
import { Sidebar } from './components/Sidebar';
import { useEmbeddings } from './hooks/useEmbeddings';
import { WordInput } from './components/WordInput';

const DIMENSION_SETS = [
  { dims: [0, 1, 2], title: "Dimensions 1-3" },
  { dims: [3, 4, 5], title: "Dimensions 4-6" },
  { dims: [6, 7, 8], title: "Dimensions 7-9" },
  { dims: [9, 10, 11], title: "Dimensions 10-12" },
  { dims: [12, 13, 14], title: "Dimensions 13-15" },
  { dims: [15, 16, 17], title: "Dimensions 16-18" },
] as const;

const App = () => {
  const { spaces, loading, error, addWord, lastAddedWord } = useEmbeddings();
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedDim, setSelectedDim] = useState<number | null>(null);
  

  useEffect(() => {
    if (lastAddedWord) {
      setSelectedWord(lastAddedWord);
    }
  }, [lastAddedWord]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-lg">Loading embeddings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-lg text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!spaces.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-lg">No embedding spaces available</div>
      </div>
    );
  }

  const currentSpace = selectedSpace 
    ? spaces.find(space => space.id === selectedSpace) ?? spaces[0]
    : spaces[0];

  return (
    <div className="flex h-screen bg-slate-950 gap-5">
      <Sidebar 
        spaces={spaces}
        selectedSpace={currentSpace}
        onSpaceSelect={(space) => setSelectedSpace(space.id)}
      />
      <div className='flex-1'>
        <WordInput onAddWord={addWord} isLoading={loading || false} />
        <div className='grid grid-cols-3 gap-4 h-[90%]'>
          {DIMENSION_SETS.map((set, index) => (
            <div key={index} className="h-full">
              <WordEmbeddingViz 
                points={currentSpace.points}
                onAddWord={addWord}
                isLoading={loading}
                dimensionIndices={set.dims as [number, number, number]}
                title={set.title}
                selectedWord={selectedWord}
                onWordSelect={setSelectedWord}
                selectedDim={selectedDim}
                onSelectDim={setSelectedDim}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;