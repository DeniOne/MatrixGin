import { useGetRegistrationByIdQuery } from '../api/registrationApi';
import { X, User, Mail, Phone, MapPin, Briefcase, FileText } from 'lucide-react';

interface Props {
  registrationId: string;
  onClose: () => void;
}

function RegistrationDetailModal({ registrationId, onClose }: Props) {
  const { data, isLoading } = useGetRegistrationByIdQuery(registrationId);
  const registration = data?.data;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!registration) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-medium">Детали регистрации</h2>
          <button
            onClick={onClose}
            className="text-[#717182] hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Photo & Basic Info */}
          <div className="flex items-start gap-6">
            {registration.photo_url ? (
              <img
                src={registration.photo_url}
                alt="Профиль"
                className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center">
                <User className="w-16 h-16 text-[#717182]" />
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-2xl font-medium text-gray-900">
                {registration.last_name} {registration.first_name} {registration.middle_name}
              </h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{registration.position}</span>
                </div>
                {registration.department_name && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm">{registration.department_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Mail className="w-5 h-5" />
                <span className="font-medium">Email</span>
              </div>
              <p className="text-gray-900">{registration.email}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Phone className="w-5 h-5" />
                <span className="font-medium">Телефон</span>
              </div>
              <p className="text-gray-900">{registration.phone}</p>
            </div>

            {registration.birth_date && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Дата рождения</span>
                </div>
                <p className="text-gray-900">
                  {new Date(registration.birth_date).toLocaleDateString('ru-RU')}
                </p>
              </div>
            )}

            {registration.location_name && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Локация</span>
                </div>
                <p className="text-gray-900">{registration.location_name}</p>
              </div>
            )}
          </div>

          {/* Addresses */}
          {(registration.registration_address || registration.residential_address) && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Адреса</h4>
              {registration.registration_address && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Адрес регистрации</p>
                  <p className="text-gray-900">{registration.registration_address}</p>
                </div>
              )}
              {registration.residential_address && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Адрес проживания</p>
                  <p className="text-gray-900">{registration.residential_address}</p>
                </div>
              )}
            </div>
          )}

          {/* Documents */}
          {registration.passport_scan_url && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Документы</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Скан паспорта</span>
                </div>
                <a
                  href={registration.passport_scan_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Открыть документ
                </a>
              </div>
            </div>
          )}

          {registration.additional_documents && registration.additional_documents.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Дополнительные документы</h4>
              {registration.additional_documents.map((doc: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {doc.name || `Документ ${index + 1}`}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Status & Timeline */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Статус:</span>
                <span className="ml-2 font-medium">{registration.status}</span>
              </div>
              <div>
                <span className="text-gray-600">Текущий шаг:</span>
                <span className="ml-2 font-medium">{registration.current_step}</span>
              </div>
              <div>
                <span className="text-gray-600">Создано:</span>
                <span className="ml-2">
                  {new Date(registration.created_at).toLocaleString('ru-RU')}
                </span>
              </div>
              {registration.completed_at && (
                <div>
                  <span className="text-gray-600">Завершено:</span>
                  <span className="ml-2">
                    {new Date(registration.completed_at).toLocaleString('ru-RU')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationDetailModal;
