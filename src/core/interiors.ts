export interface Interior {
  id: string;
  name: string;
  description: string;
  cost: { materialId: string; amount: number }[]; 
  bgClass: string;
}

export const INTERIORS: Interior[] = [
  {
    id: 'default',
    name: 'いつものガレージ',
    description: '隙間風が吹き込むお馴染みの作業場',
    cost: [],
    bgClass: 'bg-stone-100',
  },
  {
    id: 'forest',
    name: '森の工房',
    description: '自然に囲まれた癒やしの作業場。木漏れ日が心地よい。',
    cost: [
      { materialId: 'm_e1_1', amount: 10 },
      { materialId: 'm_w1_1', amount: 5 },
    ],
    bgClass: 'bg-green-50 border-green-200',
  },
  {
    id: 'volcano',
    name: '溶岩の鍛冶場',
    description: 'マグマの熱を利用する危険な鍛冶場。',
    cost: [
      { materialId: 'm_f1_1', amount: 15 },
      { materialId: 'm_a1_1', amount: 5 },
    ],
    bgClass: 'bg-red-50 border-red-200',
  },
  {
    id: 'cyber',
    name: 'サイバーラボ',
    description: '最新鋭の機材が揃うサイバーパンクな部屋。',
    cost: [
      { materialId: 'm_l1_1', amount: 10 },
      { materialId: 'm_a1_1', amount: 5 },
    ],
    bgClass: 'bg-slate-900 border-cyan-800',
  },
  {
    id: 'royal',
    name: '王室風アトリエ',
    description: '貴族が道楽で使うような豪華な工房。',
    cost: [
      { materialId: 'm_d1_1', amount: 5 },
      { materialId: 'm_l1_1', amount: 5 },
    ],
    bgClass: 'bg-amber-50 border-amber-300',
  }
];
