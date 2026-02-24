import { Shield, Check, ExternalLink, Brain } from 'lucide-react';

const PoliciesPage = () => {
  const policies = [
    {
      id: 1,
      name: 'Startup India Seed Fund Scheme',
      type: 'Central',
      category: 'Seed Funding',
      amount: 'Up to ₹20 Lakhs',
      eligibility: ['DPIIT recognized', 'Less than 2 years old', 'Innovative business model'],
      description: 'Provides financial assistance for proof of concept, prototype development, product trials, market entry, and commercialization.',
      relevant: true,
    },
    {
      id: 2,
      name: 'RKVY-RAFTAAR Agri-Startup',
      type: 'Central',
      category: 'Grant',
      amount: 'Up to ₹25 Lakhs',
      eligibility: ['AgriTech focus', 'Prototype stage', 'Team with agri background'],
      description: 'Financial support to agri-startups for developing innovative solutions in agriculture and allied sectors.',
      relevant: false,
    },
    {
      id: 3,
      name: 'Karnataka Startup Policy 2022-2027',
      type: 'State',
      category: 'Multi-benefit',
      amount: 'Various benefits',
      eligibility: ['Registered in Karnataka', 'DPIIT recognized', 'Innovation-driven'],
      description: 'Comprehensive support including funding, tax benefits, and market access for Karnataka-based startups.',
      relevant: true,
    },
    {
      id: 4,
      name: 'NIDHI-Prayas',
      type: 'Central',
      category: 'Grant',
      amount: 'Up to ₹10 Lakhs',
      eligibility: ['Technology-based idea', 'Proof of concept stage', 'Student/faculty startups'],
      description: 'Support for technology startups at ideation stage, providing grants for proof of concept and prototype development.',
      relevant: false,
    },
  ];

  return (
    <div className="policies-page">
      <div className="container">
        <div className="page-header">
          <h1>Government Policies & Schemes</h1>
          <p>Understand startup schemes in simple language</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <select className="filter-select">
              <option value="">All Types</option>
              <option value="central">Central</option>
              <option value="state">State</option>
            </select>
          </div>

          <div className="filter-group">
            <select className="filter-select">
              <option value="">All Categories</option>
              <option value="seed">Seed Funding</option>
              <option value="grant">Grant</option>
              <option value="tax">Tax Benefits</option>
            </select>
          </div>

          <div className="filter-group">
            <select className="filter-select">
              <option value="">All Stages</option>
              <option value="idea">Idea Stage</option>
              <option value="prototype">Prototype</option>
              <option value="growth">Growth</option>
            </select>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="ai-recommendation">
          <div className="ai-header">
            <Brain size={24} />
            <h3>Schemes Relevant for You</h3>
          </div>
          <p>Based on your profile (Seed stage, AgriTech, Karnataka), we've identified 2 highly relevant schemes.</p>
        </div>

        {/* Policies List */}
        <div className="policies-list">
          {policies.map((policy) => (
            <div key={policy.id} className={`policy-card ${policy.relevant ? 'relevant' : ''}`}>
              {policy.relevant && (
                <div className="relevance-badge">
                  <Shield size={16} />
                  <span>Highly Relevant</span>
                </div>
              )}

              <div className="policy-header">
                <div>
                  <h3>{policy.name}</h3>
                  <div className="policy-meta">
                    <span className="policy-type">{policy.type}</span>
                    <span className="policy-category">{policy.category}</span>
                  </div>
                </div>
                <div className="policy-amount">{policy.amount}</div>
              </div>

              <p className="policy-description">{policy.description}</p>

              <div className="policy-eligibility">
                <h4>Eligibility Criteria</h4>
                <ul>
                  {policy.eligibility.map((item, i) => (
                    <li key={i}>
                      <Check size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="policy-actions">
                <button className="btn-secondary">
                  View Details <ExternalLink size={16} />
                </button>
                <button className="btn-primary">
                  Is this relevant for me?
                </button>
              </div>

              {policy.relevant && (
                <div className="ai-explanation">
                  <Brain size={16} />
                  <p>
                    <strong>Why this is relevant:</strong> Your AgriTech startup in Karnataka 
                    at seed stage matches this scheme's focus on agricultural innovation and 
                    early-stage funding support.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoliciesPage;
