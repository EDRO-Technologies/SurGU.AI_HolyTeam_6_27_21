import React, { useState, useEffect } from 'react';
import { CardIcon } from './Icons';

interface LoadingScreenProps {
  files: File[];
}

const loadingMessages = [
  "Инициализация AI модели...",
  "Анализ макета визитки...",
  "Извлечение текста...",
  "Определение контактных данных...",
  "Форматирование данных...",
  "Почти готово...",
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ files }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-base-100 bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="relative flex justify-center items-center">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
        <CardIcon className="h-16 w-16 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mt-8 text-base-content">
        Обработка {files.length} {files.length === 1 ? 'карты' : 'карт'}
      </h2>
      <p className="text-base-content/80 mt-2 text-lg transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingScreen;