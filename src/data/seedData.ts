import { Team, Stage, ScheduleSlot, AuditLog, TeamTrack, SlideData, PresentationStatus } from '../types';
import { OFFICIAL_SIH_PROBLEM_STATEMENTS } from './sihProblemStatements';

export const STAGES_INITIAL: Stage[] = [
  {
    id: 'stage-alpha',
    name: 'Stage Alpha',
    track: 'AI & Robotics',
    location: 'TIT Main Auditorium · Quantum Arena',
    status: 'ACTIVE',
    operatorName: 'Dr. Sarah Vance (TIT CSE)',
    currentTeamId: 'SH26-001'
  },
  {
    id: 'stage-beta',
    name: 'Stage Beta',
    track: 'Web3 & Cloud',
    location: 'TIT Cyber Block · Pavilion B',
    status: 'ACTIVE',
    operatorName: 'Prof. Alex Mercer (TIT IT)',
    currentTeamId: 'SH26-005'
  },
  {
    id: 'stage-gamma',
    name: 'Stage Gamma',
    track: 'HealthTech & Bio',
    location: 'TIT BioTech Wing · Hall C',
    status: 'ACTIVE',
    operatorName: 'Dr. Elena Rostova (TIT EC)',
    currentTeamId: 'SH26-009'
  },
  {
    id: 'stage-delta',
    name: 'Stage Delta',
    track: 'Smart Cities & IoT',
    location: 'TIT Central Innovation Hub · Hall D',
    status: 'ACTIVE',
    operatorName: 'Prof. Marcus Thorne (TIT ME/IoT)',
    currentTeamId: 'SH26-013'
  }
];

const COLLEGES = [
  'Technocrats Institute of Technology (TIT), Bhopal',
  'Technocrats Institute of Technology & Science (TITS), Bhopal',
  'Technocrats Institute of Technology (Excellence), Bhopal',
  'Technocrats Institute of Technology - Advanced (TIT-A)',
  'Technocrats Institute of Technology (TIT MBA/MCA Campus)'
];

const TRACK_PROBLEMS: Record<TeamTrack, { title: string; stmt: string; abstract: string }[]> = {
  'AI & Robotics': [
    {
      title: 'NeuralEdge: Autonomous Swarm Robotics',
      stmt: 'Decentralized Edge-AI coordination for search and rescue drone swarms in GPS-denied environments.',
      abstract: 'We engineer sub-millisecond local consensus protocols with on-device quantized neural inference, enabling autonomous aerial swarms to map disaster zones and navigate collapsed structures without satellite connectivity.'
    },
    {
      title: 'SynapseVision: Robotic Microsurgery Guidance',
      stmt: 'Sub-millimeter real-time augmented surgical robotics guidance with sub-5ms tactile feedback.',
      abstract: 'Leveraging low-latency spatial neural networks and micro-haptic actuators to assist vascular neurosurgeons in precision anastomosis.'
    },
    {
      title: 'RoboHarvest: Autonomous Agri-Precision Harvester',
      stmt: 'Computer-vision driven selective harvesting bot optimizing crop yield with zero chemical waste.',
      abstract: 'Lightweight deep learning vision models on embedded silicon identifying fruit ripeness and weed targets at 60 FPS in dynamic field lighting.'
    },
    {
      title: 'AeroGlide: Morphing Wing UAV Control System',
      stmt: 'Real-time aerodynamic adaptation using bio-inspired reinforcement learning on compliant wings.',
      abstract: 'Bio-mimetic soft robotic actuators governed by deep RL models to maximize aerodynamic efficiency across varying weather turbulences.'
    }
  ],
  'Web3 & Cloud': [
    {
      title: 'ZeroProof: ZK-Rollup Identity Protocol',
      stmt: 'Privacy-preserving self-sovereign identity verification with instantaneous zero-knowledge proofs.',
      abstract: 'A cryptographic identity layer utilizing recursive SNARKs that allows citizens and enterprises to prove credential validity without revealing PII.'
    },
    {
      title: 'QuantumSafe: Post-Quantum Cloud Storage Grid',
      stmt: 'Lattice-based encrypted decentralized object storage resilient against quantum decryption vectors.',
      abstract: 'Distributing chunked data shards encoded with CRYSTALS-Kyber key exchange across verified independent cloud validator nodes.'
    },
    {
      title: 'VoltLedger: P2P Renewable Energy Microgrid',
      stmt: 'Autonomous smart-contract settlement for rooftop solar microgrid peer-to-peer energy trades.',
      abstract: 'IoT smart meter integration with high-throughput L2 state channels enabling sub-second local grid balance and carbon credit issuance.'
    },
    {
      title: 'OmniChain: Liquidity Teleportation Network',
      stmt: 'Atomic cross-chain state synchronization without centralized bridge custodians.',
      abstract: 'Light-client relayers and threshold multisig state proofs enabling non-custodial asset swaps across disparate virtual machines.'
    }
  ],
  'HealthTech & Bio': [
    {
      title: 'NanoDetect: AI Liquid Biopsy Oncological Scanner',
      stmt: 'Circulating tumor cell detection at single-molecule resolution using spectroscopic neural classifiers.',
      abstract: 'Combining surface-enhanced Raman spectroscopy with transformer models to identify malignant genetic mutations in peripheral blood within 15 minutes.'
    },
    {
      title: 'SepsisGuard: Real-Time ICU Hemodynamic Forecaster',
      stmt: 'Multi-parameter physiological time-series forecasting predicting septic shock 6 hours in advance.',
      abstract: 'Continuous telemetry integration with state-space sequence models trained on over 50,000 patient vitals to alert critical care physicians before clinical deterioration.'
    },
    {
      title: 'BioFold: Ultra-Fast Protein Ligand Binding Engine',
      stmt: 'Accelerating therapeutic drug candidate discovery using GPU-accelerated diffusion folding models.',
      abstract: 'Predicting binding affinity and conformational stability of novel small molecule candidates against resistant microbial targets.'
    },
    {
      title: 'NeuroVibe: Non-Invasive Tremor Suppression System',
      stmt: 'Closed-loop peripheral electrical nerve stimulation for Parkinsonian and essential tremor mitigation.',
      abstract: 'Wearable MEMS sensor array computing phase-inverted electrical micro-pulses in real-time to suppress involuntary tremors by up to 88%.'
    }
  ],
  'Smart Cities & IoT': [
    {
      title: 'TrafficPulse: Adaptive Urban Grid Orchestrator',
      stmt: 'City-wide traffic signal synchronization reducing idle emissions and congestion using edge radar sensors.',
      abstract: 'Distributed edge compute nodes processing multimodal radar, camera, and connected vehicle telemetry to optimize green light corridors dynamically.'
    },
    {
      title: 'AquaSensor: Autonomous Water Contamination Network',
      stmt: 'Microfluidic IoT sensor network for real-time heavy metal and microbial pipeline monitoring.',
      abstract: 'Self-powered acoustic and electrochemical smart nodes installed in municipal pipelines transmitting telemetry to a decentralized GIS dashboard.'
    },
    {
      title: 'GridResilience: Microgrid Self-Healing Controller',
      stmt: 'Automated fault isolation and power rerouting during extreme climate disruptions.',
      abstract: 'Sub-cycle phasor measurement units coupling with predictive grid topologies to island vulnerable substations and prevent rolling blackouts.'
    },
    {
      title: 'UrbanCanopy: Thermal Island Mitigation GIS Engine',
      stmt: 'High-resolution satellite infrared analysis driving predictive urban cooling and greening initiatives.',
      abstract: 'Neural spatial interpolation predicting heat retention in high-density metropolitan corridors to optimize reflective surface deployments.'
    }
  ]
};

const FIRST_NAMES = [
  'Aiden', 'Maya', 'Liam', 'Priya', 'Kaelen', 'Sophia', 'Rohan', 'Elena',
  'Mateo', 'Aria', 'Chen', 'Zainab', 'Lucas', 'Tara', 'Dmitri', 'Ananya',
  'Hiroshi', 'Zara', 'Julian', 'Fatima', 'Leo', 'Sunita', 'Marcus', 'Chloe'
];

const LAST_NAMES = [
  'Patel', 'Chen', 'Vance', 'Sharma', 'Novak', 'Gupta', 'Thorne', 'Kim',
  'Kowalski', 'Singh', 'Dubois', 'Nakamura', 'Okonkwo', 'Muller', 'Al-Mansoor', 'Rodriguez'
];

export function generateSlideDeck(teamName: string, track: TeamTrack, problemStatement: string): SlideData[] {
  return [
    {
      slideNumber: 1,
      durationSeconds: 60,
      title: '01. Problem Statement & Context',
      subtitle: `${teamName} · ${track} Track`,
      category: 'Problem Statement',
      bulletPoints: [
        `Core Challenge: ${problemStatement}`,
        'High latency, fragmented data streams, and lack of edge-level intelligence currently cause severe bottlenecks.',
        'Existing solutions rely on brittle centralized architectures that fail in mission-critical environments.',
        'Target Stakeholders: Critical infrastructure operators, clinical teams, and enterprise engineering departments.'
      ],
      metrics: [
        { label: 'Market Inefficiency', value: '47% Loss' },
        { label: 'Mean Failure Rate', value: '18.4%' },
        { label: 'Time to Resolution', value: '4.2 hrs' }
      ],
      diagramType: 'pipeline',
      speakerNotes: 'Introduce the core problem context, real-world pain point, and why traditional methods fail.'
    },
    {
      slideNumber: 2,
      durationSeconds: 60,
      title: '02. Proposed Architecture & System Design',
      subtitle: 'Modular End-to-End Pipeline Overview',
      category: 'Architecture & Solution',
      bulletPoints: [
        'Dual-layer decoupling: Real-time low-latency edge sensor ingress paired with an asynchronous consensus engine.',
        'Cryptographically verified state checkpoints ensuring zero data tampering across multi-tenant nodes.',
        'Fail-safe fallback routines maintaining 99.99% operational continuity under network partition.',
        'Built with microsecond-deterministic event streams and memory-safe systems primitives.'
      ],
      metrics: [
        { label: 'Edge Ingress Latency', value: '< 4.2ms' },
        { label: 'Throughput', value: '120k ops/sec' },
        { label: 'Fault Tolerance', value: 'Byzantine 3f+1' }
      ],
      diagramType: 'architecture',
      speakerNotes: 'Walk judges through the end-to-end architecture, modular layers, and fault-tolerant nodes.'
    },
    {
      slideNumber: 3,
      durationSeconds: 60,
      title: '03. Core Innovation & Technology Stack',
      subtitle: 'Technical Breakthroughs & Algorithmic Rigor',
      category: 'Core Innovation & Tech Stack',
      bulletPoints: [
        'Proprietary quantized neural inference pipeline reducing model footprint by 78% without loss of precision.',
        'Adaptive zero-knowledge state proofs replacing heavyweight consensus verification.',
        'Languages & Frameworks: Rust, TypeScript, PyTorch, WebAssembly, Kafka, and Google Cloud Run.',
        'Sub-millisecond synchronization benchmarks verified across multi-region edge clusters.'
      ],
      codeSnippet: `// Core Engine Ingress & Quantum-Resistant State Verification
async fn verify_and_dispatch(packet: TelemetryPacket) -> Result<VerifiedState, EngineError> {
    let signature_valid = kyber_decrypt(&packet.payload, &PUBLIC_KEY)?;
    ensure!(signature_valid, EngineError::AuthenticationFailed);
    
    let consensus_vector = edge_nn_forward(&packet.features).await?;
    telemetry_bus.publish_atomic("smart26/stream", &consensus_vector).await
}`,
      metrics: [
        { label: 'Footprint Reduction', value: '-78%' },
        { label: 'Inference Speed', value: '18ms' }
      ],
      diagramType: 'network',
      speakerNotes: 'Highlight the technical difficulty, algorithmic elegance, and exact stack choices.'
    },
    {
      slideNumber: 4,
      durationSeconds: 60,
      title: '04. Live Prototype & Empirical Demonstration',
      subtitle: 'Benchmarked Testbed Results & Stress Validation',
      category: 'Live Prototype & Demo',
      bulletPoints: [
        'End-to-end prototype deployed and evaluated across 1,000 simulated stress load nodes.',
        'Observed 99.4% precision under simulated 40% packet drops and hostile network delays.',
        'Interactive real-time telemetry stream demonstrated to track mentors with instant convergence.',
        'Validation against industry baseline standards showing 3.8x throughput acceleration.'
      ],
      metrics: [
        { label: 'Simulation Scale', value: '1,000 Nodes' },
        { label: 'Precision Under Stress', value: '99.4%' },
        { label: 'Speed Acceleration', value: '3.8x vs Baseline' }
      ],
      diagramType: 'metrics',
      speakerNotes: 'Show empirical test results, load test charts, and live operational proof.'
    },
    {
      slideNumber: 5,
      durationSeconds: 60,
      title: '05. Business Impact & Real-World Feasibility',
      subtitle: 'Cost Efficiency, Scalability & Regulatory Alignment',
      category: 'Business Impact & Feasibility',
      bulletPoints: [
        'Economic Impact: Projected $3.4M operational savings annually per enterprise deployment.',
        'Scalability: Plug-and-play SDK requires zero legacy rip-and-replace, integrating in under 3 days.',
        'Compliance: Fully compliant with ISO 27001, HIPAA, and GDPR cryptographic export controls.',
        'Environmental Benefit: Reduces compute carbon footprint by 42% via intelligent compute routing.'
      ],
      metrics: [
        { label: 'Operational ROI', value: '320% in Yr 1' },
        { label: 'Deployment Time', value: '< 72 Hours' },
        { label: 'Energy Savings', value: '-42% Carbon' }
      ],
      diagramType: 'stats',
      speakerNotes: 'Explain practical adoption, unit economics, regulatory compliance, and market rollout.'
    },
    {
      slideNumber: 6,
      durationSeconds: 60,
      title: '06. Roadmap, Engineering Team & Conclusion',
      subtitle: 'Smart Hackathon 2026 Grand Finale Wrap-up',
      category: 'Roadmap, Team & Conclusion',
      bulletPoints: [
        'Milestone Q4 2026: Open beta rollout with 5 launch partner institutions and universities.',
        'Milestone Q1 2027: Multi-region sovereign edge deployment and formal hardware certifications.',
        'Cross-disciplinary engineering team combining AI systems research, cryptography, and embedded systems.',
        'Summary: Building scalable, verifiable, impact-driven technology for the next generation of computing.'
      ],
      metrics: [
        { label: 'Launch Partners', value: '5 Confirmed' },
        { label: 'Target Users (Y1)', value: '50,000+' }
      ],
      diagramType: 'pipeline',
      speakerNotes: 'Wrap up strong: thank judges, summarize key differentiators, and open for Q&A.'
    }
  ];
}

export function generateSeedTeams(): { teams: Team[]; schedules: ScheduleSlot[]; auditLogs: AuditLog[] } {
  const teams: Team[] = [];
  const schedules: ScheduleSlot[] = [];
  const auditLogs: AuditLog[] = [];

  const tracks: TeamTrack[] = ['AI & Robotics', 'Web3 & Cloud', 'HealthTech & Bio', 'Smart Cities & IoT'];
  const stageMap: Record<TeamTrack, string> = {
    'AI & Robotics': 'stage-alpha',
    'Web3 & Cloud': 'stage-beta',
    'HealthTech & Bio': 'stage-gamma',
    'Smart Cities & IoT': 'stage-delta'
  };

  // Generate 128 teams (SH26-001 to SH26-128)
  for (let i = 1; i <= 128; i++) {
    const idNum = String(i).padStart(3, '0');
    const teamId = `SH26-${idNum}`;
    const track = tracks[(i - 1) % 4];
    const stageId = stageMap[track];
    const college = COLLEGES[(i - 1) % COLLEGES.length];

    const trackProblems = TRACK_PROBLEMS[track];
    const baseProblem = trackProblems[(i - 1) % trackProblems.length];
    const teamName = i <= 16 ? baseProblem.title.split(':')[0] : `${baseProblem.title.split(':')[0]} Squad ${Math.floor(i / 4)}`;

    const leaderFirst = FIRST_NAMES[(i * 3) % FIRST_NAMES.length];
    const leaderLast = LAST_NAMES[(i * 5) % LAST_NAMES.length];
    const leaderEmail = `${leaderFirst.toLowerCase()}.${leaderLast.toLowerCase()}@${college.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8)}.edu`;

    const members = [
      {
        id: `m-${teamId}-1`,
        name: `${leaderFirst} ${leaderLast}`,
        email: leaderEmail,
        role: 'LEADER' as const,
        college,
        phone: `+1 (${408 + (i % 500)}) 555-01${(i % 90) + 10}`,
        github: `github.com/${leaderFirst.toLowerCase()}${leaderLast.toLowerCase()}`,
        specialization: 'System Architecture & Lead'
      },
      {
        id: `m-${teamId}-2`,
        name: `${FIRST_NAMES[(i * 7 + 1) % FIRST_NAMES.length]} ${LAST_NAMES[(i * 9 + 2) % LAST_NAMES.length]}`,
        email: `dev2.${teamId.toLowerCase()}@edu.org`,
        role: 'MEMBER' as const,
        college,
        phone: `+1 (${415 + (i % 500)}) 555-02${(i % 90) + 10}`,
        github: `github.com/dev${i}_2`,
        specialization: 'Backend & ML Engineer'
      },
      {
        id: `m-${teamId}-3`,
        name: `${FIRST_NAMES[(i * 11 + 3) % FIRST_NAMES.length]} ${LAST_NAMES[(i * 13 + 4) % LAST_NAMES.length]}`,
        email: `dev3.${teamId.toLowerCase()}@edu.org`,
        role: 'MEMBER' as const,
        college,
        phone: `+1 (${510 + (i % 500)}) 555-03${(i % 90) + 10}`,
        github: `github.com/dev${i}_3`,
        specialization: 'Frontend & UI/UX Design'
      },
      {
        id: `m-${teamId}-4`,
        name: `${FIRST_NAMES[(i * 17 + 5) % FIRST_NAMES.length]} ${LAST_NAMES[(i * 19 + 6) % LAST_NAMES.length]}`,
        email: `dev4.${teamId.toLowerCase()}@edu.org`,
        role: 'MEMBER' as const,
        college,
        phone: `+1 (${650 + (i % 500)}) 555-04${(i % 90) + 10}`,
        github: `github.com/dev${i}_4`,
        specialization: 'Testing & Cryptographic Validation'
      }
    ];

    // Status distribution
    // First 4 teams: In Progress / Presenting
    // Next 28 teams: Completed presentations
    // Next 70 teams: Approved PPT with QR Pass generated
    // Next 16 teams: PPT Submitted under review
    // Remaining 10 teams: Not submitted yet
    let subStatus: Team['submission'] = undefined;
    let qrPass: Team['qrPass'] = undefined;
    let presentationStatus: PresentationStatus = 'SCHEDULED';

    const driveFolder = `https://drive.google.com/drive/folders/smart26_team_${teamId.toLowerCase()}`;
    const driveFile = `https://drive.google.com/file/d/1A${teamId}Z9xPPTX_SmartHackathon2026/view`;

    const slides = generateSlideDeck(teamName, track, baseProblem.stmt);

    if (i <= 4) {
      // In progress on their respective stages
      subStatus = {
        id: `sub-${teamId}-v1`,
        fileName: `${teamId}_Final_Presentation.pptx`,
        fileSize: '14.8 MB',
        fileType: 'PPTX',
        uploadedAt: '2026-09-25 10:15 UTC',
        version: 'v2.1',
        googleDriveFolderUrl: driveFolder,
        googleDriveFileUrl: driveFile,
        status: 'APPROVED',
        reviewedBy: 'Admin (Kush Dwivedi)',
        reviewedAt: '2026-09-25 10:45 UTC',
        slidesCount: 6,
        slides
      };
      qrPass = {
        token: `QR-SH26-${teamId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        teamId,
        issuedAt: '2026-09-25 10:46 UTC',
        qrPayload: JSON.stringify({ teamId, teamName, college, stage: STAGES_INITIAL.find(s => s.id === stageId)?.name, time: '12:00' }),
        verificationHash: `SHA256-V-${teamId}-0925`,
        isValid: true
      };
      presentationStatus = 'IN_PROGRESS';
    } else if (i <= 32) {
      // Completed presentations
      subStatus = {
        id: `sub-${teamId}-v1`,
        fileName: `${teamId}_Executive_Pitch.pdf`,
        fileSize: '11.2 MB',
        fileType: 'PDF',
        uploadedAt: '2026-09-25 08:30 UTC',
        version: 'v1.4',
        googleDriveFolderUrl: driveFolder,
        googleDriveFileUrl: driveFile,
        status: 'APPROVED',
        reviewedBy: 'Chief Judge Dr. Vance',
        reviewedAt: '2026-09-25 09:00 UTC',
        slidesCount: 6,
        slides
      };
      qrPass = {
        token: `QR-SH26-${teamId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        teamId,
        issuedAt: '2026-09-25 09:02 UTC',
        qrPayload: JSON.stringify({ teamId, teamName, college, stage: STAGES_INITIAL.find(s => s.id === stageId)?.name, time: '10:30' }),
        verificationHash: `SHA256-V-${teamId}-0925`,
        isValid: true
      };
      presentationStatus = 'COMPLETED';
    } else if (i <= 102) {
      // Approved and QR generated, scheduled for afternoon
      subStatus = {
        id: `sub-${teamId}-v1`,
        fileName: `${teamId}_Solution_Deck.pptx`,
        fileSize: '16.4 MB',
        fileType: 'PPTX',
        uploadedAt: '2026-09-25 09:40 UTC',
        version: 'v1.0',
        googleDriveFolderUrl: driveFolder,
        googleDriveFileUrl: driveFile,
        status: 'APPROVED',
        reviewedBy: 'Admin (System Sync)',
        reviewedAt: '2026-09-25 10:00 UTC',
        slidesCount: 6,
        slides
      };
      qrPass = {
        token: `QR-SH26-${teamId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        teamId,
        issuedAt: '2026-09-25 10:01 UTC',
        qrPayload: JSON.stringify({ teamId, teamName, college, stage: STAGES_INITIAL.find(s => s.id === stageId)?.name, time: '14:00' }),
        verificationHash: `SHA256-V-${teamId}-0925`,
        isValid: true
      };
      presentationStatus = 'SCHEDULED';
    } else if (i <= 118) {
      // Under Review
      subStatus = {
        id: `sub-${teamId}-v1`,
        fileName: `${teamId}_Draft_Presentation.pptx`,
        fileSize: '18.1 MB',
        fileType: 'PPTX',
        uploadedAt: '2026-09-25 11:20 UTC',
        version: 'v1.0',
        googleDriveFolderUrl: driveFolder,
        googleDriveFileUrl: driveFile,
        status: 'UNDER_REVIEW',
        slidesCount: 6,
        slides
      };
      presentationStatus = 'WAITING';
    }

    // Generate schedule slot: each slot is 6 mins
    // Index within stage: (i - 1) / 4
    const slotIdx = Math.floor((i - 1) / 4);
    const startHour = 10 + Math.floor((slotIdx * 6) / 60);
    const startMin = (slotIdx * 6) % 60;
    const endMin = (startMin + 6) % 60;
    const endHour = startMin + 6 >= 60 ? startHour + 1 : startHour;

    const timeFormatted = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
    const endTimeFormatted = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

    const slot: ScheduleSlot = {
      id: `slot-${stageId}-${slotIdx}`,
      stageId,
      teamId,
      startTime: timeFormatted,
      endTime: endTimeFormatted,
      durationMinutes: 6,
      date: '2026-09-25',
      status: presentationStatus
    };

    schedules.push(slot);

    const sihPs = OFFICIAL_SIH_PROBLEM_STATEMENTS[(i - 1) % OFFICIAL_SIH_PROBLEM_STATEMENTS.length];

    const teamRecord: Team = {
      id: teamId,
      name: teamName,
      college,
      track,
      psId: sihPs.id,
      sihOrganization: sihPs.organization,
      problemStatement: sihPs ? sihPs.description : baseProblem.stmt,
      abstract: baseProblem.abstract,
      leaderName: `${leaderFirst} ${leaderLast}`,
      leaderEmail,
      members,
      createdAt: '2026-09-24 18:30:00 UTC',
      passcode: `PASS-${idNum}`,
      googleFormSubmissionId: `GF-2026-${70000 + i}`,
      googleDriveFolder: driveFolder,
      submission: subStatus,
      qrPass,
      stageId,
      scheduledSlot: slot,
      scores: presentationStatus === 'COMPLETED' ? {
        innovation: 23 + (i % 3),
        technical: 22 + (i % 4),
        feasibility: 24 - (i % 2),
        presentation: 24,
        total: 93 + (i % 5),
        judgeNotes: 'Outstanding algorithmic foundation, demonstrated high resilience under stress workloads.'
      } : undefined
    };

    teams.push(teamRecord);
  }

  // Generate realistic initial audit logs
  auditLogs.push(
    {
      id: 'log-001',
      timestamp: '2026-09-25 12:20:15 UTC',
      action: 'PRESENTATION_STARTED',
      actor: 'Stage Alpha Operator (Dr. Sarah Vance)',
      teamId: 'SH26-001',
      details: 'Started automated 6-minute presentation engine for NeuralEdge (Swarm Robotics).',
      category: 'PRESENTATION'
    },
    {
      id: 'log-002',
      timestamp: '2026-09-25 12:18:40 UTC',
      action: 'STAGE_CHECKIN_VERIFIED',
      actor: 'Stage Alpha QR Scanner',
      teamId: 'SH26-001',
      details: 'Validated digital QR pass token QR-SH26-SH26-001. Team verified for Stage Alpha slot 12:00.',
      category: 'STAGE_CHECKIN'
    },
    {
      id: 'log-003',
      timestamp: '2026-09-25 12:14:10 UTC',
      action: 'PPT_APPROVED',
      actor: 'Super Admin (Kush Dwivedi)',
      teamId: 'SH26-042',
      details: 'Approved PPT submission v2.1. Converted 6 slides and auto-issued Digital QR Presentation Pass.',
      category: 'APPROVAL'
    },
    {
      id: 'log-004',
      timestamp: '2026-09-25 12:08:22 UTC',
      action: 'GOOGLE_DRIVE_SYNC',
      actor: 'System Drive Sync Daemon',
      teamId: 'SH26-042',
      details: 'Synced 14.8 MB presentation file to team folder /SmartHackathon2026/Teams/SH26-042_GridResilience/.',
      category: 'PPT_UPLOAD'
    },
    {
      id: 'log-005',
      timestamp: '2026-09-25 11:55:00 UTC',
      action: 'SCHEDULE_AUTO_GENERATED',
      actor: 'Admin Dashboard',
      details: 'Generated 128 sequential 6-minute time slots across Stages Alpha, Beta, Gamma, and Delta.',
      category: 'SYSTEM'
    },
    {
      id: 'log-006',
      timestamp: '2026-09-25 11:30:18 UTC',
      action: 'GOOGLE_SHEETS_SYNC',
      actor: 'Google Forms Webhook Integration',
      details: 'Successfully synced 128 registration rows from Google Form responses into relational cache.',
      category: 'REGISTRATION'
    }
  );

  return { teams, schedules, auditLogs };
}
