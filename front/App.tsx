import React, { useState, useEffect, useCallback } from 'react';
import { BusinessCard, View } from './types';
import { parseBusinessCardImages } from './services/geminiService';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import LoadingScreen from './components/LoadingScreen';
import CardReview from './components/CardReview';
import CardLibrary from './components/CardLibrary';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.UPLOAD);
  const [processingFiles, setProcessingFiles] = useState<File[]>([]);
  const [cardsToReview, setCardsToReview] = useState<BusinessCard[]>([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [savedCards, setSavedCards] = useState<BusinessCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedCards = localStorage.getItem('businessCards');
      if (storedCards) {
        setSavedCards(JSON.parse(storedCards));
      }
    } catch (e) {
      console.error("Failed to parse cards from localStorage", e);
      localStorage.removeItem('businessCards');
    }
  }, []);

  const persistCards = (cards: BusinessCard[]) => {
    try {
      localStorage.setItem('businessCards', JSON.stringify(cards));
    } catch (e) {
      console.error("Failed to save cards to localStorage", e);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setView(View.PROCESSING);
    setProcessingFiles(files);
    setError(null);

    try {
      const base64Images = await Promise.all(files.map(file => fileToBase64(file)));
      const extractedDataArray = await parseBusinessCardImages(base64Images);

      if (extractedDataArray.length !== files.length) {
          throw new Error("Mismatch between number of files and number of results from API.");
      }

      const newCards: BusinessCard[] = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        const extractedData = extractedDataArray[index];
        return {
          id: `${Date.now()}-${Math.random()}-${index}`,
          imageUrl,
          ...extractedData,
        };
      });

      setReviewTotal(newCards.length);
      setCardsToReview(newCards);
      setView(View.REVIEW);
    } catch (err) {
      console.error("Error processing files:", err);
      setError("Не удалось обработать одну или несколько визиток. Пожалуйста, попробуйте еще раз.");
      setView(View.UPLOAD);
    } finally {
        setProcessingFiles([]);
    }
  };

  const handleReviewComplete = (reviewedCard: BusinessCard) => {
    const updatedSavedCards = [...savedCards, reviewedCard];
    setSavedCards(updatedSavedCards);
    persistCards(updatedSavedCards);

    const remainingToReview = cardsToReview.filter(c => c.id !== reviewedCard.id);
    setCardsToReview(remainingToReview);

    if (remainingToReview.length === 0) {
      setView(View.LIBRARY);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedSavedCards = savedCards.filter(c => c.id !== cardId);
    setSavedCards(updatedSavedCards);
    persistCards(updatedSavedCards);
  };
  
  const handleUpdateCard = (updatedCard: BusinessCard) => {
    const updatedSavedCards = savedCards.map(c => c.id === updatedCard.id ? updatedCard : c);
    setSavedCards(updatedSavedCards);
    persistCards(updatedSavedCards);
  };


  const renderView = () => {
    switch (view) {
      case View.UPLOAD:
        return <FileUpload onUpload={handleFileUpload} />;
      case View.PROCESSING:
        return <LoadingScreen files={processingFiles} />;
      case View.REVIEW:
        if (cardsToReview.length > 0) {
            return (
                <CardReview
                    card={cardsToReview[0]}
                    onSave={handleReviewComplete}
                    total={reviewTotal} 
                    current={reviewTotal - cardsToReview.length + 1}
                />
            );
        }
        // Fallback if state is inconsistent
        setView(View.LIBRARY);
        return <CardLibrary cards={savedCards} onDelete={handleDeleteCard} onUpdate={handleUpdateCard} />;
      case View.LIBRARY:
        return <CardLibrary cards={savedCards} onDelete={handleDeleteCard} onUpdate={handleUpdateCard} />;
      default:
        return <FileUpload onUpload={handleFileUpload} />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200 font-sans">
      <Header currentView={view} setView={setView} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Ошибка</p>
            <p>{error}</p>
          </div>
        )}
        {renderView()}
      </main>
    </div>
  );
};

export default App;