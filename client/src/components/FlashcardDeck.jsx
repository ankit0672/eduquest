import React, { useState } from 'react';
import { RotateCw, ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';

export const FlashcardDeck = ({ flashcards = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState(new Set());

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
        No flashcards available for this chapter yet.
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const isKnown = knownCards.has(currentIndex);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const toggleKnown = (e) => {
    e.stopPropagation();
    setKnownCards((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Header with counter */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-2">
        <span className="flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Interactive Memory Flashcards</span>
        </span>
        <span>
          Card {currentIndex + 1} of {flashcards.length} ({knownCards.size} Mastered)
        </span>
      </div>

      {/* The Flashcard itself */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative h-64 sm:h-72 w-full cursor-pointer select-none rounded-2xl transition-all duration-300 transform perspective-1000 shadow-sm hover:shadow-md"
      >
        <div
          className={`w-full h-full rounded-2xl p-8 border text-center flex flex-col justify-between transition-all duration-500 ${
            isFlipped
              ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 text-indigo-950'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          {/* Card Top Pill */}
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                isFlipped ? 'bg-indigo-200/60 text-indigo-800' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isFlipped ? 'Answer / Concept' : 'Question / Term'}
            </span>

            <button
              onClick={toggleKnown}
              className={`p-1 rounded-full transition ${
                isKnown ? 'text-emerald-600 hover:text-emerald-700' : 'text-slate-300 hover:text-slate-400'
              }`}
              title={isKnown ? 'Marked as Mastered' : 'Mark as Mastered'}
            >
              <CheckCircle2 className={`w-5 h-5 ${isKnown ? 'fill-emerald-100' : ''}`} />
            </button>
          </div>

          {/* Card Middle Content */}
          <div className="my-auto px-4">
            <p className={`font-semibold leading-relaxed ${isFlipped ? 'text-lg sm:text-xl text-indigo-900' : 'text-xl sm:text-2xl text-slate-900'}`}>
              {isFlipped ? currentCard.back : currentCard.front}
            </p>
          </div>

          {/* Card Bottom Hint */}
          <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400 font-medium">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Click card to {isFlipped ? 'view question' : 'flip answer'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="flex items-center space-x-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-4 py-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
        >
          Flip Card 🔄
        </button>

        <button
          onClick={handleNext}
          className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-sm"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
