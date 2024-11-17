import { useState } from 'react';
import { WordEmbeddingViz } from './components/WordEmbeddingViz';
import { Sidebar } from './components/Sidebar';
import { embeddingSpaces } from './data/embeddingSpaces';

const App = () => {
  const [selectedSpace, setSelectedSpace] = useState(embeddingSpaces[0]);

  return (
    <div className="flex h-screen">
      <Sidebar 
        spaces={embeddingSpaces}
        selectedSpace={selectedSpace}
        onSpaceSelect={setSelectedSpace}
      />
      <div className="flex-1">
        <WordEmbeddingViz points={selectedSpace.points} />
      </div>
    </div>
  );
};

export default App;