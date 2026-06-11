import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('cinematic demo keeps the hero visual-only and implements the motion contract', async () => {
  const [page, scene, styles] = await Promise.all([
    read('src/app/cinematic-demo/page.tsx'),
    read('src/app/cinematic-demo/CinematicDemo.tsx'),
    read('src/app/cinematic-demo/cinematic-demo.module.css'),
  ]);

  assert.match(page, /CinematicDemo/);
  assert.match(scene, /Navigation currentPage="home"/);
  assert.match(scene, /ragnarok-hero\.png/);
  assert.doesNotMatch(scene, /进入比赛中心|查看夺冠指数|参赛球队|免责声明/);
  assert.match(scene, /IntersectionObserver/);
  assert.match(scene, /--scroll-progress/);
  assert.match(styles, /14s/);
  assert.match(styles, /scale\(1\.02\)/);
  assert.match(styles, /scale\(1\.07\)/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(styles, /transition-delay:\s*var\(--reveal-delay\)/);
});
