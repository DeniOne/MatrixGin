import { useMemo } from 'react';
import { useGetAcademiesQuery } from '../api/universityApi';

/**
 * Возвращает academyId по слагу факультета.
 * slug: 'photocraft' | 'sales' | 'culture' | 'personal' | 'tech' | 'mgmt'
 */
export const useAcademyId = (slug: string) => {
  const { data, isLoading, error } = useGetAcademiesQuery();

  const academyId = useMemo(() => {
    const academies = data?.data || [];
    const map: Record<string, string[]> = {
      photocraft: ['PhotoCraft', 'Фотомастерство'],
      sales: ['Sales Excellence', 'Продажи и сервис'],
      culture: ['Values & Culture', 'Культура'],
      personal: ['Soft Skills', 'Личное развитие'],
      tech: ['Equipment & Tech', 'Технологии'],
      mgmt: ['Leadership & Management', 'Менеджмент'],
    };
    const candidates = map[slug] || [];
    const found = academies.find((a) =>
      candidates.some((name) => a.name.toLowerCase() === name.toLowerCase())
    );
    return found?.id;
  }, [data, slug]);

  return { academyId, isLoading, error };
};
