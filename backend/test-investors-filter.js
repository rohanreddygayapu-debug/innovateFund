#!/usr/bin/env node

// Simple script to demonstrate filtering capabilities of the investors.json file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON file
const investorsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'investors.json'), 'utf8')
);

console.log('='.repeat(60));
console.log('INVESTOR DATA FILTERING DEMO');
console.log('='.repeat(60));
console.log(`\nTotal Investors: ${investorsData.metadata.totalInvestors}\n`);

// Filter by Stage: Seed
console.log('1. FILTERING BY STAGE: Seed');
console.log('-'.repeat(60));
const seedInvestors = investorsData.investors.filter(investor => 
  investor.stage.includes('Seed')
);
console.log(`Found ${seedInvestors.length} Seed stage investors:\n`);
seedInvestors.forEach(inv => {
  console.log(`   • ${inv.name} (${inv.location})`);
  console.log(`     Sectors: ${inv.sectors.join(', ')}`);
  console.log(`     Ticket Size: ${inv.ticketSize}\n`);
});

// Filter by Sector: AI
console.log('\n2. FILTERING BY SECTOR: AI');
console.log('-'.repeat(60));
const aiInvestors = investorsData.investors.filter(investor => 
  investor.sectors.includes('AI')
);
console.log(`Found ${aiInvestors.length} AI sector investors:\n`);
aiInvestors.forEach(inv => {
  console.log(`   • ${inv.name} (${inv.location})`);
  console.log(`     Stages: ${inv.stage.join(', ')}`);
  console.log(`     Ticket Size: ${inv.ticketSize}\n`);
});

// Filter by Sector: SaaS
console.log('\n3. FILTERING BY SECTOR: SaaS');
console.log('-'.repeat(60));
const saasInvestors = investorsData.investors.filter(investor => 
  investor.sectors.includes('SaaS')
);
console.log(`Found ${saasInvestors.length} SaaS sector investors:\n`);
saasInvestors.forEach(inv => {
  console.log(`   • ${inv.name} (${inv.location})`);
  console.log(`     Stages: ${inv.stage.join(', ')}`);
  console.log(`     Ticket Size: ${inv.ticketSize}\n`);
});

// Filter by both Stage: Seed AND Sector: AI
console.log('\n4. FILTERING BY STAGE: Seed AND SECTOR: AI');
console.log('-'.repeat(60));
const seedAiInvestors = investorsData.investors.filter(investor => 
  investor.stage.includes('Seed') && investor.sectors.includes('AI')
);
console.log(`Found ${seedAiInvestors.length} Seed stage + AI sector investors:\n`);
seedAiInvestors.forEach(inv => {
  console.log(`   • ${inv.name} (${inv.location})`);
  console.log(`     Sectors: ${inv.sectors.join(', ')}`);
  console.log(`     Ticket Size: ${inv.ticketSize}\n`);
});

// Filter by both Stage: Seed AND Sector: SaaS
console.log('\n5. FILTERING BY STAGE: Seed AND SECTOR: SaaS');
console.log('-'.repeat(60));
const seedSaasInvestors = investorsData.investors.filter(investor => 
  investor.stage.includes('Seed') && investor.sectors.includes('SaaS')
);
console.log(`Found ${seedSaasInvestors.length} Seed stage + SaaS sector investors:\n`);
seedSaasInvestors.forEach(inv => {
  console.log(`   • ${inv.name} (${inv.location})`);
  console.log(`     Sectors: ${inv.sectors.join(', ')}`);
  console.log(`     Ticket Size: ${inv.ticketSize}\n`);
});

// Summary of available filters
console.log('\n6. AVAILABLE FILTERS');
console.log('-'.repeat(60));
console.log('Stages:', investorsData.metadata.filters.stages.join(', '));
console.log('Sectors:', investorsData.metadata.filters.sectors.join(', '));
console.log('\n' + '='.repeat(60));
console.log('DEMO COMPLETED SUCCESSFULLY');
console.log('='.repeat(60));
