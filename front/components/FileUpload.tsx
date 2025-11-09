import React, { useState, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // FIX: The onDrop event handler is attached to a <label> element, so the event type must be compatible.
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      setSelectedFiles(prev => [...prev, ...imageFiles]);
  };
  
  const handleSubmit = () => {
      if (selectedFiles.length > 0) {
          onUpload(selectedFiles);
          setSelectedFiles([]);
      }
  };
  
  const removeFile = (fileName: string) => {
    setSelectedFiles(files => files.filter(file => file.name !== fileName));
  };

  const getRussianCardNoun = (count: number) => {
    const n = Math.abs(count) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return 'карт';
    if (n1 > 1 && n1 < 5) return 'карты';
    if (n1 === 1) return 'карту';
    return 'карт';
  };


  return (
    <div className="max-w-3xl mx-auto bg-base-100 p-8 rounded-lg shadow-xl text-center">
      <h2 className="text-2xl font-bold text-base-content mb-2">Загрузите визитные карточки</h2>
      <p className="text-base-content/70 mb-6">Загрузите одно или несколько изображений визитных карточек, чтобы начать.</p>
      
      <form id="form-file-upload" onSubmit={(e) => e.preventDefault()}>
        <label
          htmlFor="input-file-upload"
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
            dragActive ? 'border-primary bg-indigo-50' : 'border-base-300 hover:bg-base-200'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon />
            <p className="mb-2 text-sm text-base-content/80">
              <span className="font-semibold">Нажмите для загрузки</span> или перетащите файлы
            </p>
            <p className="text-xs text-base-content/60">PNG, JPG, или WEBP</p>
          </div>
          <input
            id="input-file-upload"
            type="file"
            multiple={true}
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </form>
      
      {selectedFiles.length > 0 && (
          <div className="mt-6 text-left">
              <h3 className="font-semibold text-lg mb-2">Выбранные файлы:</h3>
              <ul className="space-y-2">
                  {selectedFiles.map((file, index) => (
                      <li key={`${file.name}-${index}`} className="flex justify-between items-center p-2 bg-base-200 rounded-md">
                          <span className="truncate text-sm">{file.name}</span>
                          <button onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
                      </li>
                  ))}
              </ul>
              <button
                onClick={handleSubmit}
                className="w-full mt-6 bg-primary hover:bg-primary-focus text-primary-content font-bold py-3 px-4 rounded-lg transition-transform duration-200 active:scale-95"
              >
                Обработать {selectedFiles.length} {getRussianCardNoun(selectedFiles.length)}
              </button>
          </div>
      )}
    </div>
  );
};

export default FileUpload;