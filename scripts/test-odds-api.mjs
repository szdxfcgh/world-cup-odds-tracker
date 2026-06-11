// 测试 RapidAPI 的赔率端点
const apiKey = '3b7e42aa93msh3d83fa19688838ep12b397jsn82d2a37d93dd';
const apiHost = 'free-api-live-football-data.p.rapidapi.com';
const API_BASE = 'https://free-api-live-football-data.p.rapidapi.com';

const headers = {
  'x-rapidapi-key': apiKey,
  'x-rapidapi-host': apiHost,
  'Content-Type': 'application/json',
};

// 可能的赔率端点
const endpoints = [
  '/football-odds-match?matchId=1',
  '/football-odds?matchId=1',
  '/football-match-odds?matchId=1',
  '/football-get-odds-by-match?matchId=1',
  '/football-live-odds',
  '/football-upcoming-odds',
];

async function testEndpoint(path) {
  try {
    const url = `${API_BASE}${path}`;
    console.log(`\nTesting: ${url}`);
    const response = await fetch(url, { headers });
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2).substring(0, 300));
      return data;
    } else {
      const errorText = await response.text();
      console.log('Error:', errorText.substring(0, 200));
      return null;
    }
  } catch (error) {
    console.error('Request failed:', error.message);
    return null;
  }
}

async function main() {
  console.log('Testing RapidAPI Football Odds endpoints...\n');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
}

main();
