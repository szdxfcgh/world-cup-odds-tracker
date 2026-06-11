import type { Metadata } from 'next';
import Navigation from '../../components/Navigation';
import KnockoutBracket from '../../components/KnockoutBracket';
import PageHeader from '../../components/PageHeader';
import teamsData from '../../../data/teams.json';

export const metadata: Metadata = {
  title: '淘汰赛路径',
  description: '2026 世界杯 32 强至决赛完整对阵图',
};

export default function KnockoutPage() {
  return (
    <div className="min-h-screen">
      <Navigation currentPage="knockout" />
      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <PageHeader eyebrow="KNOCKOUT PATH" title="淘汰赛路径" description="从 32 强到决赛的种子位结构与晋级路线。" />
        <KnockoutBracket teams={teamsData} />
      </main>
    </div>
  );
}
