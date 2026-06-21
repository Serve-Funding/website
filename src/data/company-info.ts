/**
 * SERVE FUNDING - MASTER INFORMATION HUB
 *
 * This file contains all core company information, messaging, and factual data
 * used across the website. Update this file to easily propagate changes everywhere.
 *
 * Last Updated: [DATE]
 * Review Status: PENDING FOUNDER VERIFICATION
 */

// ============================================================================
// COMPANY BASICS - VERIFY WITH FOUNDER
// ============================================================================

export const companyInfo = {
  name: "Serve Funding LLC",
  tagline: "Creative Working Capital",

  description: "A boutique business financing advisory firm serving growing companies with creative working capital from $250 to $100MM. As a channel-neutral advisor, we're not a lender—we're your trusted advocate with relationships across an extensive lender network. We specialize in debt refinance, payroll financing, MCA consolidation, asset-based lending, and alternative financing when traditional banks decline. Operating with servant leadership, we fight for your best interests and negotiate the best terms across multiple underwriting styles. Relationships over bots. Strategy over algorithms.",

  contact: {
    phone: "+1 770-820-7409",
    email: "michael@servefunding.com",
    address: {
      street: "3101 Cobb Pkwy SE, Ste 124",
      city: "Atlanta",
      state: "GA",
      zip: "30339",
      country: "USA"
    }
  },

  // VERIFY: Founding date and company age
  founded: {
    year: 2021,
    description: "Founded in 2021 on the 40th anniversary of our family's arrival in America"
  },

  // VERIFY: Total employees
  teamSize: "5",

  // Years of experience (founder/team) — confirmed 15+
  experience: "15",

  // VERIFY: Total capital facilitated to date
  metrics: {
    totalCapitalFacilitated: "$50MM+",
    averageDealSize: "$500K - $3.35MM",
    totalClientsServed: "100+",
    repeatClientRate: "65%"
  }
}

// ============================================================================
// FOUNDER/TEAM INFORMATION - VERIFY WITH FOUNDER
// ============================================================================

export const founder = {
  name: "Michael Kodinsky",
  title: "Founder & CEO",
  background: "15+ years of commercial lending and capital advisory experience. Passionate about servant leadership and building trusted partnerships.",
  motivation: "Founded in 2021 on the 40th anniversary of his family's arrival in America, continuing a legacy of entrepreneurship and helping others build lasting enterprises.",
  personalStory: `Family emigrated from the Soviet Union. Father worked on Steve Jobs' NeXT team. Michael's background shaped his belief in relationships over transactions.`,

  education: {
    university: "",
    degree: ""
  },

  credentials: {
    certifications: [],
    memberships: ["Association for Corporate Growth", "Secured Finance Network", "IFA"]
  },

  linkedinUrl: "https://www.linkedin.com/in/michael-kodinsky/"
}

// ============================================================================
// CORE VALUES - VERIFY WITH FOUNDER
// ============================================================================

export const coreValues = [
  {
    acronym: "T",
    value: "Transparency",
    description: "We communicate honestly to build a long-term relationship."
  },
  {
    acronym: "R",
    value: "Responsibility",
    description: "We take responsibility to stay accountable to you always."
  },
  {
    acronym: "U",
    value: "Understanding",
    description: "We seek to understand you to meet and exceed your goals."
  },
  {
    acronym: "S",
    value: "Service",
    description: "We are here to always serve you and your best interests."
  },
  {
    acronym: "T",
    value: "Thankfulness",
    description: "We practice authentic gratitude for the opportunity to serve."
  }
]

export const philosophy = {
  headline: "Relationships > Bots",
  description: "Serve Funding provides working capital advisory for business leaders who operate through trust-based and collaborative partnerships.",
  approach: "We take a servant leadership approach with all our clients, lenders and partners to ensure win-win outcomes."
}

// ============================================================================
// PROCESS STEPS - VERIFY WITH FOUNDER
// ============================================================================

export const serveFundingProcess = [
  {
    step: 1,
    name: "Discovery",
    description: "We genuinely care and listen to your needs and objectives so our process stays strategic to your growth goals.",
    details: [
      "Initial consultation to understand your business",
      "Identify your specific capital needs",
      "Discuss timeline and use of funds",
      "Explore which funding types fit best"
    ]
  },
  {
    step: 2,
    name: "Diligence",
    description: "We lead a comprehensive capital search and advise you on your evolving options for short and long-term growth.",
    details: [
      "Gather financial documentation",
      "Analyze your business and capital structure",
      "Identify best-fit lender partners",
      "Present multiple term sheet options",
      "Advise on rates, terms, and structures"
    ]
  },
  {
    step: 3,
    name: "Delivery",
    description: "We take responsibility to guide your lender engagements all the way to a timely closing. We are here to serve you.",
    details: [
      "Manage lender communications",
      "Coordinate underwriting and due diligence",
      "Address any lender questions or concerns",
      "Negotiate terms on your behalf",
      "Guide through closing process"
    ]
  }
]

// ============================================================================
// COMPETITIVE POSITIONING - VERIFY WITH FOUNDER
// ============================================================================

export const competitivePositioning = {
  tagline: "Relationships Over Bots",

  differentiators: [
    {
      label: "Transparent",
      description: "No hidden agendas or fine print. We explain the 'why' behind every recommendation and advocate for your best interests, not ours."
    },
    {
      label: "Timely",
      description: "Funding in 3-10 business days when traditional banks take 60-90 days. Speed matters when growth opportunities arrive."
    },
    {
      label: "Trusted",
      description: "65% repeat client rate. We own outcomes, not just transactions. Relationships that grow with your business."
    }
  ],

  vsTraditionalBanks: {
    speed: "3-10 days vs. 60-90 days",
    flexibility: "We work outside traditional credit boxes for founders banks reject",
    creditRequirements: "We evaluate whole business, not just DSCR or credit score",
    documentation: "Bank-statement friendly underwriting for growth-stage companies"
  },

  vsOnlineLenders: {
    personalService: "Real advisors, not algorithms. We answer the phone and negotiate on your behalf.",
    rates: "Competitive pricing with educated choices about structure, not just automated rates",
    customerRelationships: "Long-term partnerships, not one-time transactions. We're invested in your success.",
    flexibility: "Multiple lender options and structures tailored to YOUR situation"
  },

  vsPeerAdvisors: {
    experience: "15+ years in capital advisory with proven track record",
    lenderNetwork: "Relationships across an extensive lender network spanning all major funding types",
    successRate: "100% of referred deals funded within target timelines",
    clientSatisfaction: "65% repeat client rate demonstrates lasting value"
  }
}

// ============================================================================
// QUALIFICATION CRITERIA - VERIFY WITH LENDER PARTNERS
// ============================================================================

export const qualificationCriteria = {
  general: {
    minimumTimeInBusiness: "6 months - 2 years (varies by lender)",
    minimumMonthlyRevenue: "$15,000 - $50,000",
    minimumAnnualRevenue: "$200K - $500K (most products)",
    creditScoreRange: {
      ideal: "700+",
      acceptable: "650-700",
      minimum: "550+ (with compensating factors)"
    }
  },

  byProductType: {
    assetBasedLending: {
      minimumAssets: "",
      assetTypes: "AR, Inventory, Equipment, Real Estate"
    },
    invoiceFactoring: {
      minimumInvoiceVolume: "$250K+",
      customerRequirement: "Established commercial customers"
    },
    workingCapitalLoan: {
      minimumRevenue: "",
      minimumTimeInBusiness: ""
    }
  },

  disqualifiers: []
}

// ============================================================================
// MESSAGING TEMPLATES - USE IN FAQ/CONTENT
// ============================================================================

export const messagingTemplates = {
  rejectionNarrative: {
    headline: "Turned Down by Your Bank? We Can Help.",
    message: "You have strong fundamentals and real growth. Your bank's credit box just doesn't fit your situation. We work with an extensive network of alternative lenders who evaluate whole businesses, not just DSCR."
  },

  speedNarrative: {
    headline: "Funding in Days, Not Months",
    message: "When opportunity arrives, you don't have time to wait 60-90 days for bank approval. We close in 3-10 business days, keeping your momentum intact."
  },

  relationshipNarrative: {
    headline: "Relationships Over Transactions",
    message: "We partner with you for the long term. Our 65% repeat client rate shows we're not chasing one-time deals—we're building lasting relationships that grow with your business."
  },

  trustNarrative: {
    headline: "Built on T.R.U.S.T",
    message: "Transparency in every conversation. Responsibility for outcomes. Understanding of your mission. Service to your best interests. Thankfulness for the opportunity to partner with you."
  },

  forAdvisors: {
    headline: "Deepen Client Relationships by Referring",
    message: "When your client needs capital you can't provide, a Serve Funding referral makes you the hero. You're not losing the relationship—you're strengthening it."
  }
}

// ============================================================================
// VERIFICATION CHECKLIST
// ============================================================================

export const verificationChecklist = {
  companyBasics: [
    "Phone number and email verified",
    "Address confirmed",
    "Founding date accurate",
    "Number of employees current"
  ],

  founderInfo: [
    "Full name and correct spelling",
    "Background story accurate",
    "Education/credentials verified",
    "Personal motivation documented",
    "LinkedIn URL correct"
  ],

  productData: [
    "All rates and terms current (VERIFY quarterly)",
    "Minimum/maximum amounts accurate",
    "Closing timelines realistic",
    "Advance rates correct"
  ],

  competitivePositioning: [
    "Differentiators validated against competitors",
    "Customer testimonials obtained",
    "Success metrics documented",
    "NPS or satisfaction rating measured"
  ],

  qualifications: [
    "Minimum revenue requirements confirmed",
    "Credit score ranges validated",
    "Time-in-business requirements confirmed",
    "Disqualifier list comprehensive"
  ]
}

export default {
  companyInfo,
  founder,
  coreValues,
  philosophy,
  serveFundingProcess,
  competitivePositioning,
  qualificationCriteria,
  messagingTemplates,
  verificationChecklist
}
