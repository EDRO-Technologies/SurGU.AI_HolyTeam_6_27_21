import React, { useState, useMemo } from 'react';
import { BusinessCard } from '../types';
import CardView from './CardView';
import { SearchIcon } from './Icons';

interface CardLibraryProps {
  cards: BusinessCard[];
  onDelete: (cardId: string) => void;
  onUpdate: (card: BusinessCard) => void;
}

const CardLibrary: React.FC<CardLibraryProps> = ({ cards, onDelete, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = useMemo(() => {
    if (!searchTerm) return cards;
    const lowercasedTerm = searchTerm.toLowerCase();
    return cards.filter(card =>
      Object.values(card).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(lowercasedTerm)
      )
    );
  }, [cards, searchTerm]);
  
  if (cards.length === 0) {
      return (
        <div className="text-center py-20 bg-base-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-base-content">Ваша библиотека пуста</h2>
            <p className="text-base-content/70 mt-2">Загрузите визитки, чтобы пополнить свою библиотеку контактов.</p>
        </div>
      )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Поиск по имени, компании, должности..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-base-300 py-3 pl-10 pr-3 text-base-content shadow-sm focus:border-primary focus:ring-primary sm:text-lg"
          />
        </div>
      </div>

      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <CardView key={card.id} card={card} onDelete={onDelete} onUpdate={onUpdate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-base-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-base-content">Ничего не найдено</h2>
            <p className="text-base-content/70 mt-2">Попробуйте изменить поисковый запрос.</p>
        </div>
      )}
    </div>
  );
};

export default CardLibrary;