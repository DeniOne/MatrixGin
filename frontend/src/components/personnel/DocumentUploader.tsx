import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadDocumentMutation } from '../../api/personnelApi';

interface DocumentUploaderProps {
    personalFileId: string;
    onUploadComplete?: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
    personalFileId,
    onUploadComplete
}) => {
    const [uploadDocument, { isLoading }] = useUploadDocumentMutation();
    const [documentType, setDocumentType] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!documentType) {
            alert('Пожалуйста, выберите тип документа');
            return;
        }

        for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('personalFileId', personalFileId);
            formData.append('documentType', documentType);
            formData.append('title', file.name);
            if (expiryDate) {
                formData.append('expiryDate', expiryDate);
            }

            try {
                await uploadDocument(formData).unwrap();
                onUploadComplete?.();
            } catch (error) {
                console.error('Upload failed:', error);
                alert('Ошибка загрузки документа');
            }
        }
    }, [documentType, expiryDate, personalFileId, uploadDocument, onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.jpg', '.jpeg', '.png'],
        },
        multiple: true,
    });

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Тип документа
                    </label>
                    <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Выберите тип</option>
                        <option value="PASSPORT">Паспорт</option>
                        <option value="INN">ИНН</option>
                        <option value="SNILS">СНИЛС</option>
                        <option value="MEDICAL_BOOK">Медицинская книжка</option>
                        <option value="EDUCATION">Диплом об образовании</option>
                        <option value="OTHER">Другое</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Срок действия (опционально)
                    </label>
                    <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
            >
                <input {...getInputProps()} />
                {isLoading ? (
                    <div className="text-gray-600">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                        Загрузка...
                    </div>
                ) : isDragActive ? (
                    <p className="text-blue-600">Отпустите файлы для загрузки</p>
                ) : (
                    <div className="text-gray-600">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-2"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="mb-1">
                            Перетащите файлы сюда или{' '}
                            <span className="text-blue-600 hover:text-blue-700">выберите</span>
                        </p>
                        <p className="text-xs text-gray-500">PDF, JPG, PNG до 10MB</p>
                    </div>
                )}
            </div>
        </div>
    );
};
