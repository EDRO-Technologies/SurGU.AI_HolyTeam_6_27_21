import React, { useState, useEffect } from 'react';
import { BusinessCard } from '../types';
import { UserIcon, TitleIcon, CompanyIcon, PhoneIcon, EmailIcon, WebsiteIcon, AddressIcon, SaveIcon } from './Icons';

interface CardReviewProps {
  card: BusinessCard;
  onSave: (updatedCard: BusinessCard) => void;
  total: number;
  current: number;
}

const InputField = ({ id, label, value, icon, onChange }: { id: keyof BusinessCard, label: string, value: string, icon: React.ReactElement, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-base-content/80 mb-1">{label}</label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {icon}
            </div>
            <input
                type="text"
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className="block w-full rounded-md border-base-300 py-2 pl-10 pr-3 text-base-content shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
        </div>
    </div>
  );

const CardReview: React.FC<CardReviewProps> = ({ card, onSave, total, current }) => {
  const [formData, setFormData] = useState<BusinessCard>(card);

  useEffect(() => {
    setFormData(card);
  }, [card]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
      onSave(formData);
  };

  return (
    <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Проверьте извлеченные данные</h2>
            <p className="text-base-content/70 mt-1">Карта {current} из {total}. Проверьте данные и сохраните контакт.</p>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-base-100 p-8 rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
            <h3 className="font-bold text-lg mb-4">Оригинал изображения</h3>
            <img
                src={formData.imageUrl}
                alt="Business Card Preview"
                className="w-full max-w-md rounded-lg shadow-lg object-contain"
            />
        </div>
        <div className="space-y-4">
            <InputField id="name" label="Имя" value={formData.name} icon={<UserIcon />} onChange={handleChange} />
            {/* The "position" field was incorrectly using "title" as its id */}
            <InputField id="position" label="Должность" value={formData.position} icon={<TitleIcon />} onChange={handleChange} />
            <InputField id="company" label="Компания" value={formData.company} icon={<CompanyIcon />} onChange={handleChange} />
            <InputField id="phone" label="Телефон" value={formData.phone} icon={<PhoneIcon />} onChange={handleChange} />
            <InputField id="email" label="Email" value={formData.email} icon={<EmailIcon />} onChange={handleChange} />
            <InputField id="website" label="Веб-сайт" value={formData.website} icon={<WebsiteIcon />} onChange={handleChange} />
            <InputField id="address" label="Адрес" value={formData.address} icon={<AddressIcon />} onChange={handleChange} />
            <button
                onClick={handleSave}
                className="w-full mt-4 bg-primary hover:bg-primary-focus text-primary-content font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-transform duration-200 active:scale-95"
            >
                <SaveIcon />
                <span>Сохранить в библиотеку</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default CardReview;