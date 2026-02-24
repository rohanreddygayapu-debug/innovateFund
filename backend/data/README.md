# Investor Data

This directory contains a curated JSON file with investor information for the FundingIntel platform.

## File: `investors.json`

A comprehensive dataset of 15 venture capital firms and investors active in the Indian startup ecosystem.

### Structure

The JSON file contains:
- **investors**: Array of 15 investor objects
- **metadata**: Information about available filters and data statistics

### Investor Object Fields

Each investor object includes:
- `id`: Unique identifier
- `name`: Investor/firm name
- `type`: Type of investor (VC Firm, Early Stage VC, Accelerator)
- `location`: Primary location
- `ticketSize`: Investment range
- `stage`: Array of funding stages (Seed, Series A, Series B, Growth)
- `sectors`: Array of focus sectors (AI, SaaS, FinTech, etc.)
- `investments`: Array of notable portfolio companies
- `description`: Brief description
- `website`: Official website URL
- `foundedYear`: Year the firm was founded

### Filtering Capabilities

The data structure supports filtering by:

#### By Stage
- Seed
- Pre-Series A
- Series A
- Series B
- Growth

#### By Sector
- AI
- SaaS
- FinTech
- HealthTech
- EdTech
- E-commerce
- Consumer Tech
- DeepTech
- AgriTech
- Enterprise Tech

### Usage Examples

#### JavaScript/Node.js

```javascript
import fs from 'fs';
import path from 'path';

// Load the data
const data = JSON.parse(fs.readFileSync('investors.json', 'utf8'));

// Filter by Seed stage
const seedInvestors = data.investors.filter(inv => 
  inv.stage.includes('Seed')
);

// Filter by AI sector
const aiInvestors = data.investors.filter(inv => 
  inv.sectors.includes('AI')
);

// Filter by both Seed stage AND SaaS sector
const seedSaasInvestors = data.investors.filter(inv => 
  inv.stage.includes('Seed') && inv.sectors.includes('SaaS')
);

// Get all available sectors
const allSectors = data.metadata.filters.sectors;

// Get all available stages
const allStages = data.metadata.filters.stages;
```

#### Python

```python
import json

# Load the data
with open('investors.json', 'r') as f:
    data = json.load(f)

# Filter by Seed stage
seed_investors = [inv for inv in data['investors'] 
                  if 'Seed' in inv['stage']]

# Filter by AI sector
ai_investors = [inv for inv in data['investors'] 
                if 'AI' in inv['sectors']]

# Filter by both Seed stage AND SaaS sector
seed_saas_investors = [inv for inv in data['investors'] 
                       if 'Seed' in inv['stage'] and 'SaaS' in inv['sectors']]
```

### Testing

To test the filtering capabilities, run:

```bash
node test-investors-filter.js
```

This will demonstrate:
1. Filtering by Seed stage (12 investors)
2. Filtering by AI sector (14 investors)
3. Filtering by SaaS sector (14 investors)
4. Filtering by Seed stage AND AI sector (11 investors)
5. Filtering by Seed stage AND SaaS sector (11 investors)

### Data Statistics

- **Total Investors**: 15
- **Last Updated**: 2025-12-28
- **Static Data**: No real-time updates required
- **Coverage**: Primarily Indian VC ecosystem with some global firms

### Integration

This data can be:
1. Served through a REST API endpoint
2. Used as seed data for a database
3. Imported directly in frontend applications
4. Filtered dynamically based on user preferences

### Notes

- All data is static and manually curated
- No external API calls required
- Investment amounts are in Indian Rupees (₹) except where noted
- Past investments listed are representative, not exhaustive
