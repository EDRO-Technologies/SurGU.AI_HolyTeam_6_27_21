import React, { useState, useMemo } from 'react';
import { BusinessCard } from '../types';
import CardView from './CardView';
import { SearchIcon, ExportIcon } from './Icons';

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

  const handleExportCSV = () => {
    if (cards.length === 0) return;

    // FIX: The 'BusinessCard' type uses 'position', not 'title'.
    const headers: (keyof BusinessCard)[] = ['name', 'position', 'company', 'phone', 'email', 'website', 'address'];
    
    const escapeCSV = (value: string | undefined | null): string => {
      const strValue = String(value || '');
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
        // Enclose in double quotes and escape existing double quotes by doubling them
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    };

    // Use a BOM for better Excel compatibility with UTF-8 characters
    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...cards.map(card => headers.map(header => escapeCSV(card[header])).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'business-cards.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
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
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full flex-grow">
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
        <button
          onClick={handleExportCSV}
          disabled={cards.length === 0}
          className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 bg-primary hover:bg-primary-focus text-primary-content font-bold py-3 px-5 rounded-lg transition-all duration-200 active:scale-95 disabled:bg-base-300 disabled:text-base-content/50 disabled:cursor-not-allowed disabled:scale-100"
        >
          <ExportIcon />
          <span>Экспорт в CSV</span>
        </button>
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