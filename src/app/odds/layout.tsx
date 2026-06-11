import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '夺冠指数',
  description: '追踪世界杯夺冠赔率、隐含概率与市场热度变化',
};

export default function OddsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
