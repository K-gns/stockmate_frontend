import { RequestType } from '@/store/requestStore';

export const inProgressRequests: RequestType[] = [
  {
    id: 1,
    material: 'Пакет п/э 200×300',
    date: '10.04.25',
    count: 20,
    unit: 'шт',
    bank: 'Отделение1',
    status: 'В работе',
    statusColor: 'active',
  },
  {
    id: 2,
    material: 'Пакет п/э 200×300',
    date: '10.04.25',
    count: 30,
    unit: 'шт',
    bank: 'Отделение2',
    status: 'На уточнении',
    statusColor: 'pending',
  },
  {
    id: 3,
    material: 'Офисные стулья для айти-отдела главного офиса',
    date: '10.04.25',
    count: 45,
    unit: 'шт',
    bank: 'Отделение1',
    status: 'В работе',
    statusColor: 'active',
  },
];

export const generateMockRequests = (count: number): RequestType[] => {
  const materials = ['Пакет п/э 200×300', 'Офисные стулья'];
  const banks = ['Отделение1', 'Отделение2', 'Отделение3'];

  return Array.from({ length: count }, (_, i) => ({
    id: 100 + i,
    material: materials[i % materials.length],
    date: `${7 + i}.04.25`,
    count: 15 + i * 3,
    unit: 'шт',
    bank: banks[i % banks.length],
    status: 'Завершена',
    statusColor: 'completed',
  }));
};
