import React, { useState } from 'react';

interface WordInputProps {
  onAddWord: (word: string) => Promise<void>;
  isLoading: boolean;
}

export const WordInput = ({ onAddWord, isLoading }: WordInputProps) => {
  const [word, setWord] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim()) {
      await onAddWord(word.trim());
      setWord('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-slate-950">
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Add a word..."
        className="flex-1 px-3 py-2 border rounded bg-gray-800 text-white border-gray-700 placeholder-gray-400"
        disabled={isLoading}
      />
      <button 
        type="submit" 
        disabled={isLoading || !word.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-700"
      >
        {isLoading ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
};