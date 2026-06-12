'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import PageHeader from '../../components/PageHeader';
import OutrightOddsTimeline from '../../components/OutrightOddsTimeline';
import OddsMovementTable from '../../components/OddsMovementTable';

const AVAILABLE_YEARS = [2026, 2022, 2018, 2014, 2010, 2006, 2002];
const YEAR_HOST: Record<number, string> = {
  2026: '美国 / 墨西哥 / 加拿大',
  2022: '卡塔尔',
  2018: '俄罗斯',
  2014: '巴西',
  2010: '南非',
  2006: '德国',
  2002: '韩国 / 日本',
};

export default function OddsPage() {
  const [selectedYear, setSelectedYear] = useState(2026);

  return (
    <div className="min-h-screen">
      <Navigation currentPage="odds" />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <PageHeader eyebrow="MARKET WATCH" title="夺冠指数" description="追踪不同赛事阶段的夺冠赔率、隐含概率与市场热度。" />

        <div className="mb-8 flex flex-wrap gap-2">
          {AVAILABLE_YEARS.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                selectedYear === year
                  ? 'border-[var(--wc-emerald)] bg-[var(--wc-emerald)] text-[#100c0a]'
                  : 'border-[var(--wc-card-border)] bg-[var(--wc-card-bg)] text-[var(--wc-text-secondary)] hover:text-white'
              }`}
            >
              {year} <span className="ml-1 opacity-65">{YEAR_HOST[year]}</span>
            </button>
          ))}
        </div>

        {selectedYear !== 2026 && (
          <div className="wc-dark-note mb-6 rounded-xl p-4 text-sm">
            {selectedYear} 世界杯历史数据为展示样本，用于对比赔率变化，不代表真实博彩市场。
          </div>
        )}

        <div className="space-y-10">
          <OddsMovementTable year={selectedYear} />
          <OutrightOddsTimeline year={selectedYear} />
        </div>
      </main>
    </div>
  );
}
