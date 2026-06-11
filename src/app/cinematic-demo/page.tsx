import type { Metadata } from 'next';
import CinematicDemo from './CinematicDemo';

export const metadata: Metadata = {
  title: '电影封面动态演示',
  description: '世界杯数据杂志桌面端电影封面动效原型',
};

export default function CinematicDemoPage() {
  return <CinematicDemo />;
}
