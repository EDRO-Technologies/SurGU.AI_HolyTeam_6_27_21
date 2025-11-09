import React from 'react';
import { View } from '../types';
import { CardIcon, LibraryIcon } from './Icons';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: View.UPLOAD, label: 'Добавить карты', icon: <CardIcon /> },
    { view: View.LIBRARY, label: 'Библиотека', icon: <LibraryIcon /> },
  ];

  return (
    <header className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">Cardzilla</h1>
          </div>
          <nav className="flex space-x-2 sm:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentView === item.view
                    ? 'bg-primary text-primary-content'
                    : 'text-base-content hover:bg-base-300'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;