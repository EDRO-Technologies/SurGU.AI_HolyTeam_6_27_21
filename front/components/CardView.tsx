import React, { useState } from 'react';
import { BusinessCard } from '../types';
import { UserIcon, TitleIcon, CompanyIcon, PhoneIcon, EmailIcon, WebsiteIcon, AddressIcon, EditIcon, DeleteIcon, SaveIcon } from './Icons';

interface CardViewProps {
  card: BusinessCard;
  onDelete: (cardId: string) => void;
  onUpdate: (card: BusinessCard) => void;
}

const CardView: React.FC<CardViewProps> = ({ card, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<BusinessCard>(card);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    const DetailRow = ({ icon, value, href }: { icon: React.ReactElement; value?: string; href?: string }) => {
        if (!value) return null;
        const content = href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline break-all">{value}</a>
        ) : (
            <span className="break-all">{value}</span>
        );
        return (
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-base-content/60">{icon}</div>
                <div className="text-sm">{content}</div>
            </div>
        );
    };

    const EditRow = ({ name, icon, value }: { name: keyof BusinessCard, icon: React.ReactElement, value: string }) => (
        <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 text-base-content/60">{icon}</div>
            <input
                type="text"
                name={name}
                value={value}
                onChange={handleChange}
                className="block w-full text-sm rounded-md border-base-300 py-1 px-2 text-base-content shadow-sm focus:border-primary focus:ring-primary"
            />
        </div>
    );

    return (
        <div className="bg-base-100 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
            <div className="p-5 flex-grow">
                {isEditing ? (
                     <div className="space-y-3">
                        <EditRow name="name" icon={<UserIcon />} value={formData.name} />
                        <EditRow name="title" icon={<TitleIcon />} value={formData.title} />
                        <EditRow name="company" icon={<CompanyIcon />} value={formData.company} />
                        <EditRow name="phone" icon={<PhoneIcon />} value={formData.phone} />
                        <EditRow name="email" icon={<EmailIcon />} value={formData.email} />
                        <EditRow name="website" icon={<WebsiteIcon />} value={formData.website} />
                        <EditRow name="address" icon={<AddressIcon />} value={formData.address} />
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-primary">{card.name || 'Без имени'}</h3>
                            <p className="text-base-content/80">{card.title}</p>
                            <p className="font-semibold text-base-content/90">{card.company}</p>
                        </div>
                        <hr className="my-3"/>
                        <DetailRow icon={<PhoneIcon />} value={card.phone} href={`tel:${card.phone}`} />
                        <DetailRow icon={<EmailIcon />} value={card.email} href={`mailto:${card.email}`} />
                        <DetailRow icon={<WebsiteIcon />} value={card.website} href={card.website} />
                        <DetailRow icon={<AddressIcon />} value={card.address} />
                    </div>
                )}
            </div>
            <div className="bg-base-200 p-3 flex justify-end space-x-2">
                {isEditing ? (
                    <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"><SaveIcon /></button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="p-2 text-base-content/70 hover:bg-base-300 rounded-full transition-colors"><EditIcon /></button>
                )}
                <button onClick={() => onDelete(card.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"><DeleteIcon /></button>
            </div>
        </div>
    );
};

export default CardView;