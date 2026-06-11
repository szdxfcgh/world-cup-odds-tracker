import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse fractional odds like "6/1", "17/2", "145/1"
function parseFractional(str) {
  if (!str || str === '未列出') return null;
  str = str.trim();
  // American odds like "+550", "+210"
  if (str.startsWith('+')) {
    const num = parseInt(str.slice(1));
    return +(num / 100 + 1).toFixed(2);
  }
  // Fractional like "6/1"
  if (str.includes('/')) {
    const [num, den] = str.split('/').map(Number);
    if (!den) return null;
    return +(num / den + 1).toFixed(2);
  }
  return parseFloat(str) || null;
}

function impliedFromDecimal(decimal) {
  if (!decimal || decimal <= 1) return 0;
  return +(1 / decimal * 100).toFixed(2);
}

// Determine elimination stage based on final rank
// Top 2 = played final, 3-4 = semi, 5-8 = quarter, 9-16 = R16, 17-32 = group
function getEliminationStage(rank) {
  if (rank <= 2) return 'final';
  if (rank <= 4) return 'semi';
  if (rank <= 8) return 'quarter';
  if (rank <= 16) return 'r16';
  if (rank <= 24) return 'r32';
  return 'group';
}

// Generate stage-by-stage snapshots for a team
function generateStages(year, teamCn, teamEn, preDecimal, finalRank, oddsSource) {
  const stages = [
    'pre_tournament', 'after_group_match_1', 'after_group_match_2', 'after_group_match_3',
    'after_round_of_32', 'after_round_of_16', 'after_quarter_final', 'after_semi_final',
    'before_final', 'final_result'
  ];
  
  const elimination = getEliminationStage(finalRank);
  const isChampion = finalRank === 1;
  const isRunnerUp = finalRank === 2;
  
  // Simulate odds movement based on final rank
  // Teams that do well see odds decrease (more likely), teams that do poorly see odds increase
  let currentDecimal = preDecimal;
  const snapshots = [];
  
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    let decimal = currentDecimal;
    let isEliminated = false;
    let matchesPlayed = 0;
    let points = 0;
    let groupRank = 0;
    let afterMatchId = '';
    let afterMatchLabel = '';
    
    // Adjust odds at each stage
    if (stage === 'after_group_match_1') {
      matchesPlayed = 1;
      if (finalRank <= 8) { decimal = +(currentDecimal * 0.9).toFixed(2); points = 3; }
      else if (finalRank <= 16) { decimal = +(currentDecimal * 0.95).toFixed(2); points = 1; }
      else { decimal = +(currentDecimal * 1.15).toFixed(2); points = 0; }
      afterMatchLabel = `${teamCn} 小组赛第1场`;
    } else if (stage === 'after_group_match_2') {
      matchesPlayed = 2;
      if (finalRank <= 8) { decimal = +(currentDecimal * 0.85).toFixed(2); points = 6; }
      else if (finalRank <= 16) { decimal = +(currentDecimal * 0.92).toFixed(2); points = 4; }
      else { decimal = +(currentDecimal * 1.3).toFixed(2); points = 1; }
      afterMatchLabel = `${teamCn} 小组赛第2场`;
    } else if (stage === 'after_group_match_3') {
      matchesPlayed = 3;
      if (finalRank <= 8) { decimal = +(currentDecimal * 0.8).toFixed(2); points = 9; groupRank = 1; }
      else if (finalRank <= 16) { decimal = +(currentDecimal * 0.88).toFixed(2); points = 5; groupRank = 2; }
      else { decimal = +(currentDecimal * 1.5).toFixed(2); points = 2; groupRank = 3; isEliminated = true; }
      afterMatchLabel = `${teamCn} 小组赛第3场`;
    } else if (stage === 'after_round_of_32') {
      matchesPlayed = 4;
      if (finalRank <= 16) { decimal = +(currentDecimal * 0.82).toFixed(2); }
      else { isEliminated = true; decimal = currentDecimal; }
      afterMatchLabel = `${teamCn} 32强赛`;
    } else if (stage === 'after_round_of_16') {
      matchesPlayed = 4;
      if (finalRank <= 8) { decimal = +(currentDecimal * 0.75).toFixed(2); }
      else if (finalRank <= 16) { isEliminated = true; decimal = currentDecimal; }
      else { isEliminated = true; }
      afterMatchLabel = `${teamCn} 16强赛`;
    } else if (stage === 'after_quarter_final') {
      matchesPlayed = 5;
      if (finalRank <= 4) { decimal = +(currentDecimal * 0.7).toFixed(2); }
      else if (finalRank <= 8) { isEliminated = true; decimal = currentDecimal; }
      else { isEliminated = true; }
      afterMatchLabel = `${teamCn} 8强赛`;
    } else if (stage === 'after_semi_final') {
      matchesPlayed = 6;
      if (finalRank <= 2) { decimal = +(currentDecimal * 0.6).toFixed(2); }
      else if (finalRank <= 4) { isEliminated = true; decimal = currentDecimal; }
      else { isEliminated = true; }
      afterMatchLabel = `${teamCn} 半决赛`;
    } else if (stage === 'before_final') {
      matchesPlayed = 6;
      if (finalRank <= 2) { decimal = +(currentDecimal * 0.55).toFixed(2); }
      else { isEliminated = true; }
      afterMatchLabel = `${teamCn} 决赛前`;
    } else if (stage === 'final_result') {
      matchesPlayed = 7;
      if (isChampion) { decimal = 1.00; }
      else if (isRunnerUp) { decimal = currentDecimal; }
      else { isEliminated = true; }
      afterMatchLabel = isChampion ? `${teamCn} 夺冠!` : (isRunnerUp ? `${teamCn} 亚军` : `${teamCn} 最终排名`);
    }
    
    if (isEliminated && stage !== 'final_result' && elimination !== 'group') {
      // Mark eliminated at the right stage
      const stageOrder = stages.indexOf(stage);
      const elimStageOrder = stages.indexOf(
        elimination === 'semi' ? 'after_semi_final' :
        elimination === 'quarter' ? 'after_quarter_final' :
        elimination === 'r16' ? 'after_round_of_16' :
        elimination === 'r32' ? 'after_round_of_32' : 'after_group_match_3'
      );
      if (stageOrder < elimStageOrder) {
        isEliminated = false;
      }
    }
    
    currentDecimal = decimal;
    
    snapshots.push({
      id: `${year}_${teamEn.replace(/[^a-zA-Z]/g, '')}_${stage}`,
      year,
      teamId: teamEn.toLowerCase().replace(/[^a-z]/g, ''),
      teamNameCn: teamCn,
      teamNameEn: teamEn,
      decimalOdds: stage === 'pre_tournament' ? preDecimal : decimal,
      impliedProbability: impliedFromDecimal(stage === 'pre_tournament' ? preDecimal : decimal),
      snapshotStage: stage,
      snapshotTime: `${year}-06-${String(10 + i * 3).padStart(2, '0')}T${String(12 + i).padStart(2, '0')}:00:00Z`,
      afterMatchId: afterMatchId || `${year}_M${i}`,
      afterMatchLabel: afterMatchLabel || `${year} 赛前`,
      matchesPlayed,
      points,
      groupRank,
      isEliminated: stage === 'final_result' ? (finalRank >= 2) : isEliminated,
      finalRank,
      source: oddsSource,
      notes: `sample - 基于 ${oddsSource} 赛前赔率推算`
    });
  }
  
  return snapshots;
}

// Read and parse CSV
const csvPath = path.join(__dirname, '..', 'worldcup_odds_final_ranks_2002_2022.csv');
const csv = fs.readFileSync(csvPath, 'utf-8');
const lines = csv.split('\n').filter(l => l.trim());

const rows = [];
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(',');
  if (parts.length < 7) continue;
  rows.push({
    year: parseInt(parts[0]),
    teamCn: parts[1],
    teamEn: parts[2],
    preTournamentOdds: parts[3],
    finalRank: parseInt(parts[4]),
    oddsSource: parts[5],
    resultSource: parts[6]
  });
}

// Generate snapshots
const allSnapshots = [];

// Group by year
const byYear = {};
for (const row of rows) {
  if (!byYear[row.year]) byYear[row.year] = [];
  byYear[row.year].push(row);
}

for (const [year, teams] of Object.entries(byYear)) {
  // Pre-tournament snapshot for ALL teams
  for (const team of teams) {
    const decimal = parseFractional(team.preTournamentOdds);
    if (!decimal) continue;
    
    allSnapshots.push({
      id: `${year}_${team.teamEn.replace(/[^a-zA-Z]/g, '')}_pre_tournament`,
      year: parseInt(year),
      teamId: team.teamEn.toLowerCase().replace(/[^a-z]/g, ''),
      teamNameCn: team.teamCn,
      teamNameEn: team.teamEn,
      decimalOdds: decimal,
      impliedProbability: impliedFromDecimal(decimal),
      snapshotStage: 'pre_tournament',
      snapshotTime: `${year}-05-15T12:00:00Z`,
      afterMatchId: '',
      afterMatchLabel: `${year} 赛前`,
      matchesPlayed: 0,
      points: 0,
      groupRank: 0,
      isEliminated: false,
      finalRank: team.finalRank,
      source: team.oddsSource,
      notes: `sample - 赛前赔率来自 ${team.oddsSource}`
    });
  }
  
  // Stage-by-stage for top 6 teams (by final rank)
  const top6 = teams.filter(t => t.finalRank <= 6).sort((a, b) => a.finalRank - b.finalRank);
  for (const team of top6) {
    const decimal = parseFractional(team.preTournamentOdds);
    if (!decimal) continue;
    const stageSnapshots = generateStages(
      parseInt(year), team.teamCn, team.teamEn, decimal, team.finalRank, team.oddsSource
    );
    // Skip first one (pre_tournament already added)
    allSnapshots.push(...stageSnapshots.slice(1));
  }
}

// Sort by year, then stage order
const stageOrder = [
  'pre_tournament', 'after_group_match_1', 'after_group_match_2', 'after_group_match_3',
  'after_round_of_32', 'after_round_of_16', 'after_quarter_final', 'after_semi_final',
  'before_final', 'final_result'
];

allSnapshots.sort((a, b) => {
  if (a.year !== b.year) return a.year - b.year;
  if (a.teamId !== b.teamId) return a.teamId.localeCompare(b.teamId);
  return stageOrder.indexOf(a.snapshotStage) - stageOrder.indexOf(b.snapshotStage);
});

const outPath = path.join(__dirname, '..', 'data', 'historicalOddsSnapshots.json');
fs.writeFileSync(outPath, JSON.stringify(allSnapshots, null, 2), 'utf-8');

console.log(`Generated ${allSnapshots.length} snapshots`);
console.log(`Years: ${[...new Set(allSnapshots.map(s => s.year))].join(', ')}`);
console.log(`Output: ${outPath}`);
