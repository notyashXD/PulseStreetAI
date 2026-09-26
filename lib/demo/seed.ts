import { Report } from "@/lib/types";
import { computeEvidenceScore } from "@/lib/services/scoring";
import { CATEGORY_REMEDIATION_PAIRS } from "@/lib/constants/remediation";

const BASE_LAT = 18.5204;
const BASE_LNG = 73.8567;

function loc(dLat: number, dLng: number, landmark?: string, ward?: string) {
  return {
    lat: Number((BASE_LAT + dLat).toFixed(4)),
    lng: Number((BASE_LNG + dLng).toFixed(4)),
    landmark,
    ward,
    address: `Near ${landmark ?? "location"}, ${ward ?? "Pune"}, Pune`,
  };
}

function pubLoc(dLat: number, dLng: number, ward?: string) {
  return {
    lat: Number((BASE_LAT + dLat + 0.002).toFixed(4)),
    lng: Number((BASE_LNG + dLng + 0.002).toFixed(4)),
    ward,
  };
}

const now = Date.now();
const h = 3_600_000;
const d = 24 * h;

const RAW_REPORTS: Omit<Report, "evidenceScore">[] = [
  {
    id: "demo_009", category: "illegal_dumping", severity: "critical", status: "verified",
    title: "Hospital waste dumped near nullah — Hadapsar",
    description: "Biohazard bags, syringes and surgical refuse dumped openly into rainwater channel near Hadapsar Gadital. Pungent chemical smell.",
    language: "en",
    location: loc(-0.012, 0.068, "Hadapsar Nullah Gadital", "Hadapsar"),
    publicLocation: pubLoc(-0.012, 0.068, "Hadapsar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_009", reporterAnonymous: false,
    aiAnalysis: {"category":"illegal_dumping","severity":"critical","reason":"Biomedical waste dumping in open water course. Pathogen and sharps transmission risk.","suggestedDepartment":"pollution_control","healthRisk":"Hepatitis, HIV needle injury, toxic leachate.","environmentalRisk":"Water table bio-contamination.","confidence":0.96,"isDemo":true},
    environmentalContext: { id: "env_009", reportId: "demo_009", lat: Number((BASE_LAT + -0.012).toFixed(4)), lng: Number((BASE_LNG + 0.068).toFixed(4)), timestamp: now - 32400000, aqi: 185, pm25: 78.4, pm10: 124.1, no2: 42, temperature: 31, windSpeed: 8, windDirection: 70, humidity: 62, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 64800000 },
      { status: "triaged", timestamp: now - 50400000 },
      { status: "verified", timestamp: now - 36000000, operatorName: "Dr. Shalini Kulkarni" }
    ],
    
    resolutionVerified: false,
    supportCount: 34,
    commentCount: 7,
    isDemo: true,
    createdAt: now - 64800000,
    updatedAt: now - 36000000,
  },
  {
    id: "demo_021", category: "garbage_burning", severity: "critical", status: "assigned",
    title: "Commercial tyre & chemical refuse burning — Hadapsar Industrial Belt",
    description: "Scrapyard operators burning bulk truck tyres and conveyor belts. Pitch-black acrid smoke blanket spreading towards residential colonies.",
    language: "en",
    location: loc(-0.011, 0.069, "Hadapsar Industrial Estate Gate 2", "Hadapsar"),
    publicLocation: pubLoc(-0.011, 0.069, "Hadapsar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_021", reporterAnonymous: false,
    aiAnalysis: {"category":"garbage_burning","severity":"critical","reason":"Combustion of vulcanised rubber and synthetic polymers. Severe dioxin and black carbon release.","suggestedDepartment":"pollution_control","healthRisk":"Acute pulmonary distress, carcinogen inhalation.","environmentalRisk":"Severe atmospheric particulate inversion.","confidence":0.97,"isDemo":true},
    environmentalContext: { id: "env_021", reportId: "demo_021", lat: Number((BASE_LAT + -0.011).toFixed(4)), lng: Number((BASE_LNG + 0.069).toFixed(4)), timestamp: now - 14400000, aqi: 245, pm25: 142, pm10: 218.5, no2: 68.4, temperature: 33, windSpeed: 14, windDirection: 68, humidity: 45, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    assignedTo: "Zone 4 Quick Response Hazmat",
    statusHistory: [
      { status: "reported", timestamp: now - 28800000 },
      { status: "triaged", timestamp: now - 21600000 },
      { status: "verified", timestamp: now - 18000000 },
      { status: "assigned", timestamp: now - 10800000, operatorName: "Ravi Kumar" }
    ],
    
    resolutionVerified: false,
    supportCount: 48,
    commentCount: 12,
    isDemo: true,
    createdAt: now - 28800000,
    updatedAt: now - 10800000,
  },
  {
    id: "demo_022", category: "garbage_burning", severity: "high", status: "verified",
    title: "Dense plastic scrap fire — Gadital Bypass",
    description: "Municipal waste pile with plastic wrappers and tarpaulins set on fire along pedestrian path behind bus terminal.",
    language: "en",
    location: loc(-0.01, 0.071, "Gadital Bus Terminal Bypass", "Hadapsar"),
    publicLocation: pubLoc(-0.01, 0.071, "Hadapsar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_022", reporterAnonymous: false,
    aiAnalysis: {"category":"garbage_burning","severity":"high","reason":"Persistent open plastic burning producing heavy volatile organics.","suggestedDepartment":"sanitation","healthRisk":"Eye and throat irritation, VOC exposure.","environmentalRisk":"Surface soot deposit, microplastic ash.","confidence":0.91,"isDemo":true},
    environmentalContext: { id: "env_022", reportId: "demo_022", lat: Number((BASE_LAT + -0.01).toFixed(4)), lng: Number((BASE_LNG + 0.071).toFixed(4)), timestamp: now - 21600000, aqi: 198, pm25: 88.5, pm10: 145.2, no2: 48, temperature: 32, windSpeed: 12, windDirection: 65, humidity: 50, weatherCode: 1, isDemo: true },
    department: "sanitation",
    
    statusHistory: [
      { status: "reported", timestamp: now - 43200000 },
      { status: "triaged", timestamp: now - 36000000 },
      { status: "verified", timestamp: now - 25200000, operatorName: "Yash Mishra" }
    ],
    
    resolutionVerified: false,
    supportCount: 22,
    commentCount: 4,
    isDemo: true,
    createdAt: now - 43200000,
    updatedAt: now - 25200000,
  },
  {
    id: "demo_023", category: "garbage_burning", severity: "high", status: "reported",
    title: "रात में कचरा और लकड़ी जलाना — रामटेकडी",
    description: "रामटेकडी ब्रिज के पास खुले प्लॉट में रोजाना कचरा और सूखी पत्तियां जलाई जा रही हैं। धुएं से सांस लेना मुश्किल हो गया है।",
    language: "hi",
    location: loc(-0.013, 0.067, "Ramtekdi Flyover", "Hadapsar"),
    publicLocation: pubLoc(-0.013, 0.067, "Hadapsar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_023", reporterAnonymous: false,
    aiAnalysis: {"category":"garbage_burning","severity":"high","reason":"Recurring biomass and municipal refuse combustion adjacent to transit bridge.","suggestedDepartment":"pollution_control","healthRisk":"Asthma exacerbation, fine soot inhalation.","environmentalRisk":"Localized haze formation.","confidence":0.89,"isDemo":true},
    environmentalContext: { id: "env_023", reportId: "demo_023", lat: Number((BASE_LAT + -0.013).toFixed(4)), lng: Number((BASE_LNG + 0.067).toFixed(4)), timestamp: now - 7200000, aqi: 178, pm25: 74, pm10: 128, no2: 39.5, temperature: 30, windSpeed: 9, windDirection: 72, humidity: 55, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 14400000 }
    ],
    
    resolutionVerified: false,
    supportCount: 15,
    commentCount: 2,
    isDemo: true,
    createdAt: now - 14400000,
    updatedAt: now - 14400000,
  },
  {
    id: "demo_024", category: "sewage_leak", severity: "critical", status: "assigned",
    title: "Industrial effluent & sewage breach — Mundhwa-Hadapsar Road",
    description: "Dark oily chemical wastewater overflowing from broken culvert onto highway asphalt. Foul sulphide odour causing nausea.",
    language: "en",
    location: loc(-0.008, 0.074, "Mundhwa-Hadapsar Link Road", "Hadapsar"),
    publicLocation: pubLoc(-0.008, 0.074, "Hadapsar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_024", reporterAnonymous: false,
    aiAnalysis: {"category":"sewage_leak","severity":"critical","reason":"Mixed industrial-sewage effluent overflow into pedestrian and traffic corridor.","suggestedDepartment":"water_sewage","healthRisk":"Hydrogen sulphide gas, chemical burns, waterborne enteric bacteria.","environmentalRisk":"Direct storm drainage contamination.","confidence":0.95,"isDemo":true},
    environmentalContext: { id: "env_024", reportId: "demo_024", lat: Number((BASE_LAT + -0.008).toFixed(4)), lng: Number((BASE_LNG + 0.074).toFixed(4)), timestamp: now - 16200000, aqi: 110, pm25: 38, pm10: 65, no2: 32, temperature: 29, windSpeed: 7, windDirection: 80, humidity: 70, weatherCode: 1, isDemo: true },
    department: "water_sewage",
    assignedTo: "PMC Drainage Rapid Cell",
    statusHistory: [
      { status: "reported", timestamp: now - 32400000 },
      { status: "triaged", timestamp: now - 25200000 },
      { status: "verified", timestamp: now - 18000000 },
      { status: "assigned", timestamp: now - 10800000, operatorName: "Sandeep More" }
    ],
    
    resolutionVerified: false,
    supportCount: 39,
    commentCount: 9,
    isDemo: true,
    createdAt: now - 32400000,
    updatedAt: now - 10800000,
  },
  {
    id: "demo_025", category: "sewage_leak", severity: "high", status: "triaged",
    title: "Choked stormwater pipeline sewage overflow — Magarpatta North Gate",
    description: "Sewer water backing up into road surface near cybercity gate. Motorbikes skidding on slippery sludge.",
    language: "en",
    location: loc(-0.007, 0.076, "Magarpatta Cybercity North Gate", "Hadapsar"),
    publicLocation: pubLoc(-0.007, 0.076, "Hadapsar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_025", reporterAnonymous: false,
    aiAnalysis: {"category":"sewage_leak","severity":"high","reason":"Domestic wastewater pipeline breach causing urban surface pooling.","suggestedDepartment":"water_sewage","healthRisk":"Coliform infection, vector breeding.","environmentalRisk":"Surface runoff into roadside green belts.","confidence":0.93,"isDemo":true},
    environmentalContext: null,
    department: "water_sewage",
    
    statusHistory: [
      { status: "reported", timestamp: now - 50400000 },
      { status: "triaged", timestamp: now - 39600000, operatorName: "Ravi Kumar" }
    ],
    
    resolutionVerified: false,
    supportCount: 19,
    commentCount: 3,
    isDemo: true,
    createdAt: now - 50400000,
    updatedAt: now - 39600000,
  },
  {
    id: "demo_026", category: "illegal_dumping", severity: "medium", status: "reported",
    title: "Commercial demolition debris on bypass plot — Hadapsar",
    description: "Truck dumped broken brick masonry and tiles along open plot near Solapur highway.",
    language: "en",
    location: loc(-0.015, 0.072, "Pune-Solapur Highway Km 4", "Hadapsar"),
    publicLocation: pubLoc(-0.015, 0.072, "Hadapsar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_026", reporterAnonymous: false,
    aiAnalysis: {"category":"illegal_dumping","severity":"medium","reason":"Unsegregated construction and demolition rubble dumped illegally.","suggestedDepartment":"public_works","healthRisk":"Dust hazards, traffic obstruction.","environmentalRisk":"Soil compaction and water channel narrowing.","confidence":0.88,"isDemo":true},
    environmentalContext: null,
    department: "public_works",
    
    statusHistory: [
      { status: "reported", timestamp: now - 18000000 }
    ],
    
    resolutionVerified: false,
    supportCount: 11,
    commentCount: 1,
    isDemo: true,
    createdAt: now - 18000000,
    updatedAt: now - 18000000,
  },
  {
    id: "demo_027", category: "garbage_burning", severity: "medium", status: "resolved",
    title: "Cleared waste fire site — Manjri Farm Road",
    description: "Dry agricultural waste and plastic sacks that were burning on roadside have been doused and soil cleared.",
    language: "en",
    location: loc(-0.016, 0.079, "Manjri Road Junction", "Hadapsar"),
    publicLocation: pubLoc(-0.016, 0.079, "Hadapsar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_027", reporterAnonymous: false,
    aiAnalysis: {"category":"garbage_burning","severity":"medium","reason":"Agricultural crop residue burning with consumer plastic contamination.","suggestedDepartment":"pollution_control","healthRisk":"Particulate inhalation.","environmentalRisk":"Residual ash runoff.","confidence":0.86,"isDemo":true},
    environmentalContext: null,
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 172800000 },
      { status: "triaged", timestamp: now - 155520000 },
      { status: "assigned", timestamp: now - 129600000 },
      { status: "resolved", timestamp: now - 28800000, operatorName: "Prakash Mane", note: "Extinguished with water tanker; residue swept." }
    ],
    resolutionNote: "Crew doused fire, cleared all debris, and warning signboard posted.",
    resolutionVerified: true,
    supportCount: 8,
    commentCount: 2,
    isDemo: true,
    createdAt: now - 172800000,
    updatedAt: now - 28800000,
  },
  {
    id: "demo_001", category: "garbage_burning", severity: "high", status: "verified",
    title: "Open garbage burning near Kothrud depot",
    description: "Large pile of mixed household waste being burned openly since morning. Thick black smoke spreading across residential area.",
    language: "en",
    location: loc(-0.02, -0.04, "Kothrud Bus Depot", "Kothrud"),
    publicLocation: pubLoc(-0.02, -0.04, "Kothrud"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_001", reporterAnonymous: false,
    aiAnalysis: {"category":"garbage_burning","severity":"high","reason":"Open burning of mixed municipal solid waste. Dioxin and PM2.5 risk confirmed.","suggestedDepartment":"pollution_control","healthRisk":"Toxic smoke inhalation. Dioxins, furans present.","environmentalRisk":"Heavy PM2.5/PM10 release; soil ash contamination.","confidence":0.91,"isDemo":true},
    environmentalContext: { id: "env_001", reportId: "demo_001", lat: Number((BASE_LAT + -0.02).toFixed(4)), lng: Number((BASE_LNG + -0.04).toFixed(4)), timestamp: now - 28800000, aqi: 162, pm25: 68.4, pm10: 112.3, no2: 34.1, temperature: 32, windSpeed: 6, windDirection: 210, humidity: 58, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 57600000 },
      { status: "triaged", timestamp: now - 50400000 },
      { status: "verified", timestamp: now - 36000000, operatorName: "Yash Mishra" }
    ],
    
    resolutionVerified: false,
    supportCount: 28,
    commentCount: 6,
    isDemo: true,
    createdAt: now - 57600000,
    updatedAt: now - 36000000,
  },
  {
    id: "demo_028", category: "garbage_burning", severity: "high", status: "assigned",
    title: "Dry foliage & packaging fire — Gujrat Colony",
    description: "Street sweepers piled dried leaves with plastic food wrappers and set it alight near children park.",
    language: "en",
    location: loc(-0.019, -0.038, "Gujrat Colony Children Park", "Kothrud"),
    publicLocation: pubLoc(-0.019, -0.038, "Kothrud"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_028", reporterAnonymous: false,
    aiAnalysis: {"category":"garbage_burning","severity":"high","reason":"Biomass combustion combined with polyolefin plastics near high-sensitivity receptor.","suggestedDepartment":"sanitation","healthRisk":"Pediatric respiratory irritation, ozone precursor formation.","environmentalRisk":"Ground-level smoke concentration.","confidence":0.92,"isDemo":true},
    environmentalContext: { id: "env_028", reportId: "demo_028", lat: Number((BASE_LAT + -0.019).toFixed(4)), lng: Number((BASE_LNG + -0.038).toFixed(4)), timestamp: now - 16200000, aqi: 155, pm25: 62, pm10: 108, no2: 31, temperature: 31, windSpeed: 7, windDirection: 200, humidity: 60, weatherCode: 1, isDemo: true },
    department: "sanitation",
    assignedTo: "Zone 3 Sweeper Supervisor",
    statusHistory: [
      { status: "reported", timestamp: now - 32400000 },
      { status: "triaged", timestamp: now - 25200000 },
      { status: "assigned", timestamp: now - 14400000, operatorName: "Vikram Joshi" }
    ],
    
    resolutionVerified: false,
    supportCount: 32,
    commentCount: 8,
    isDemo: true,
    createdAt: now - 32400000,
    updatedAt: now - 14400000,
  },
  {
    id: "demo_029", category: "garbage_burning", severity: "medium", status: "reported",
    title: "Vegetable crate and carton burning — Paud Road Market",
    description: "Vendor waste including thermocol sheets and cardboard burning behind the wholesale stalls.",
    language: "en",
    location: loc(-0.021, -0.042, "Paud Road Vegetable Market", "Kothrud"),
    publicLocation: pubLoc(-0.021, -0.042, "Kothrud"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_029", reporterAnonymous: false,
    aiAnalysis: {"category":"garbage_burning","severity":"medium","reason":"Commercial packaging incineration producing localized toxic fumes.","suggestedDepartment":"pollution_control","healthRisk":"Styrene monomer fumes, eye irritation.","environmentalRisk":"Microscopic soot particulate spread.","confidence":0.88,"isDemo":true},
    environmentalContext: null,
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 10800000 }
    ],
    
    resolutionVerified: false,
    supportCount: 14,
    commentCount: 2,
    isDemo: true,
    createdAt: now - 10800000,
    updatedAt: now - 10800000,
  },
  {
    id: "demo_008", category: "garbage_burning", severity: "high", status: "triaged",
    title: "Waste burning near Sinhagad Road, Dandekar Bridge",
    description: "Municipal sweepers collecting leaves and burning on-spot. Combined with plastic waste from nearby shops.",
    language: "hi",
    location: loc(-0.025, -0.02, "Dandekar Bridge", "Kothrud"),
    publicLocation: pubLoc(-0.025, -0.02, "Kothrud"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_008", reporterAnonymous: false,
    aiAnalysis: {"category":"garbage_burning","severity":"high","reason":"In-situ waste burning along transit corridor.","suggestedDepartment":"sanitation","healthRisk":"Commuter inhalation of particulate matter.","environmentalRisk":"Localized PM2.5 surge.","confidence":0.89,"isDemo":true},
    environmentalContext: null,
    department: "sanitation",
    
    statusHistory: [
      { status: "reported", timestamp: now - 54000000 },
      { status: "triaged", timestamp: now - 43200000, operatorName: "Sunita Patil" }
    ],
    
    resolutionVerified: false,
    supportCount: 18,
    commentCount: 3,
    isDemo: true,
    createdAt: now - 54000000,
    updatedAt: now - 43200000,
  },
  {
    id: "demo_030", category: "blocked_drain", severity: "high", status: "assigned",
    title: "Clogged stormwater culvert — Karve Statue Chowk",
    description: "Culvert beneath main intersection choked with silt, beverage bottles and coconut shells. Stagnant black water pooling across lane.",
    language: "en",
    location: loc(-0.018, -0.035, "Karve Statue Intersection", "Kothrud"),
    publicLocation: pubLoc(-0.018, -0.035, "Kothrud"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_030", reporterAnonymous: false,
    aiAnalysis: {"category":"blocked_drain","severity":"high","reason":"Complete cross-sectional obstruction of municipal stormwater conduit.","suggestedDepartment":"public_works","healthRisk":"Dengue vector habitat, pedestrian accident hazard.","environmentalRisk":"Street flood vulnerability.","confidence":0.94,"isDemo":true},
    environmentalContext: null,
    department: "public_works",
    assignedTo: "Kothrud Desilting Unit",
    statusHistory: [
      { status: "reported", timestamp: now - 72000000 },
      { status: "triaged", timestamp: now - 57600000 },
      { status: "assigned", timestamp: now - 28800000, operatorName: "Sandeep More" }
    ],
    
    resolutionVerified: false,
    supportCount: 41,
    commentCount: 11,
    isDemo: true,
    createdAt: now - 72000000,
    updatedAt: now - 28800000,
  },
  {
    id: "demo_031", category: "construction_dust", severity: "medium", status: "reported",
    title: "Uncovered sand dump causing dust haze — MIT College Road",
    description: "Construction supplier offloading dry river sand directly on roadway without water misting or tarpaulins.",
    language: "en",
    location: loc(-0.023, -0.045, "MIT College Road", "Kothrud"),
    publicLocation: pubLoc(-0.023, -0.045, "Kothrud"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_031", reporterAnonymous: false,
    aiAnalysis: {"category":"construction_dust","severity":"medium","reason":"Fugitive silica particulates from unshielded bulk aggregate storage.","suggestedDepartment":"pollution_control","healthRisk":"Respirable silica, student allergies.","environmentalRisk":"Particulate deposition on tree canopy.","confidence":0.82,"isDemo":true},
    environmentalContext: null,
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 21600000 }
    ],
    
    resolutionVerified: false,
    supportCount: 13,
    commentCount: 3,
    isDemo: true,
    createdAt: now - 21600000,
    updatedAt: now - 21600000,
  },
  {
    id: "demo_032", category: "illegal_dumping", severity: "medium", status: "triaged",
    title: "Night dumping of ceramic bathroom debris — Cummins College Lane",
    description: "Small pickup truck dumped broken commodes and bathroom tiles along footpath overnight.",
    language: "en",
    location: loc(-0.024, -0.039, "Cummins College Lane", "Kothrud"),
    publicLocation: pubLoc(-0.024, -0.039, "Kothrud"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_032", reporterAnonymous: false,
    aiAnalysis: {"category":"illegal_dumping","severity":"medium","reason":"Sharp vitreous demolition waste blocking public sidewalk.","suggestedDepartment":"sanitation","healthRisk":"Physical laceration risk for pedestrians.","environmentalRisk":"Pedestrian infrastructure impediment.","confidence":0.85,"isDemo":true},
    environmentalContext: null,
    department: "sanitation",
    
    statusHistory: [
      { status: "reported", timestamp: now - 39600000 },
      { status: "triaged", timestamp: now - 28800000 }
    ],
    
    resolutionVerified: false,
    supportCount: 9,
    commentCount: 1,
    isDemo: true,
    createdAt: now - 39600000,
    updatedAt: now - 28800000,
  },
  {
    id: "demo_033", category: "litter", severity: "low", status: "resolved",
    title: "Pavement cleared and sanitized — Mayur Colony",
    description: "Accumulated plastic bottles and street litter outside snack shops have been swept and garbage bins installed.",
    language: "en",
    location: loc(-0.017, -0.033, "Mayur Colony 4th Cross", "Kothrud"),
    publicLocation: pubLoc(-0.017, -0.033, "Kothrud"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_033", reporterAnonymous: false,
    aiAnalysis: {"category":"litter","severity":"low","reason":"Consumer food packaging litter on residential sidewalk.","suggestedDepartment":"sanitation","healthRisk":"Nuisance.","environmentalRisk":"Microplastics in storm gutter.","confidence":0.95,"isDemo":true},
    environmentalContext: null,
    department: "sanitation",
    
    statusHistory: [
      { status: "reported", timestamp: now - 172800000 },
      { status: "triaged", timestamp: now - 146880000 },
      { status: "assigned", timestamp: now - 103680000 },
      { status: "resolved", timestamp: now - 43200000, operatorName: "Yash Mishra", note: "Sidewalk swept, bins placed, shopkeeper warned." }
    ],
    resolutionNote: "Area swept, washed, and twin waste receptacles installed.",
    resolutionVerified: true,
    supportCount: 6,
    commentCount: 1,
    isDemo: true,
    createdAt: now - 172800000,
    updatedAt: now - 43200000,
  },
  {
    id: "demo_002", category: "sewage_leak", severity: "critical", status: "assigned",
    title: "Sewage overflow on FC Road",
    description: "Manhole overflowing with raw sewage onto the footpath near Fergusson College. Strong odour, pedestrians forced onto road.",
    language: "en",
    location: loc(0.01, -0.01, "Fergusson College Road", "Shivajinagar"),
    publicLocation: pubLoc(0.01, -0.01, "Shivajinagar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_002", reporterAnonymous: false,
    aiAnalysis: {"category":"sewage_leak","severity":"critical","reason":"Raw sewage overflow on public footpath. Immediate health hazard.","suggestedDepartment":"water_sewage","healthRisk":"Direct pathogen exposure. E. coli, cholera, typhoid risk.","environmentalRisk":"Groundwater and surface water contamination.","confidence":0.95,"isDemo":true},
    environmentalContext: { id: "env_002", reportId: "demo_002", lat: Number((BASE_LAT + 0.01).toFixed(4)), lng: Number((BASE_LNG + -0.01).toFixed(4)), timestamp: now - 12600000, aqi: 88, pm25: 31.2, pm10: 54.7, no2: 18.3, temperature: 30, windSpeed: 10, windDirection: 180, humidity: 75, weatherCode: 1, isDemo: true },
    department: "water_sewage",
    assignedTo: "Water Board Zone 2",
    statusHistory: [
      { status: "reported", timestamp: now - 25200000 },
      { status: "triaged", timestamp: now - 18000000 },
      { status: "verified", timestamp: now - 14400000 },
      { status: "assigned", timestamp: now - 7200000, operatorName: "Ravi Kumar" }
    ],
    
    resolutionVerified: false,
    supportCount: 46,
    commentCount: 14,
    isDemo: true,
    createdAt: now - 25200000,
    updatedAt: now - 7200000,
  },
  {
    id: "demo_034", category: "sewage_leak", severity: "critical", status: "verified",
    title: "Active sewage bubbling from underground storm junction — JM Road",
    description: "Sewer backpressure causing black effluent to erupt from storm drain cover near Modern High School.",
    language: "en",
    location: loc(0.012, -0.008, "JM Road Modern High School", "Shivajinagar"),
    publicLocation: pubLoc(0.012, -0.008, "Shivajinagar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_034", reporterAnonymous: false,
    aiAnalysis: {"category":"sewage_leak","severity":"critical","reason":"Pressurized domestic blackwater backflow into surface pedestrian zone.","suggestedDepartment":"water_sewage","healthRisk":"Aerosolized enteric pathogens, virulent odour.","environmentalRisk":"Direct river discharge.","confidence":0.96,"isDemo":true},
    environmentalContext: { id: "env_034", reportId: "demo_034", lat: Number((BASE_LAT + 0.012).toFixed(4)), lng: Number((BASE_LNG + -0.008).toFixed(4)), timestamp: now - 14400000, aqi: 95, pm25: 34, pm10: 59, no2: 24, temperature: 31, windSpeed: 8, windDirection: 190, humidity: 72, weatherCode: 1, isDemo: true },
    department: "water_sewage",
    
    statusHistory: [
      { status: "reported", timestamp: now - 28800000 },
      { status: "triaged", timestamp: now - 21600000 },
      { status: "verified", timestamp: now - 10800000, operatorName: "Sandeep More" }
    ],
    
    resolutionVerified: false,
    supportCount: 38,
    commentCount: 7,
    isDemo: true,
    createdAt: now - 28800000,
    updatedAt: now - 10800000,
  },
  {
    id: "demo_012", category: "sewage_leak", severity: "high", status: "verified",
    title: "Open sewer leak into Mutha riverbed — Deccan",
    description: "Raw untreated sewage discharging directly into riverbed behind Sambhaji Park. Heavy foul smell across the park.",
    language: "en",
    location: loc(0.004, -0.015, "Sambhaji Park Riverbank", "Shivajinagar"),
    publicLocation: pubLoc(0.004, -0.015, "Shivajinagar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_012", reporterAnonymous: false,
    aiAnalysis: {"category":"sewage_leak","severity":"high","reason":"Untreated raw domestic effluent discharge into riparian ecosystem.","suggestedDepartment":"water_sewage","healthRisk":"Vector borne diseases, fecal coliform exposure.","environmentalRisk":"Severe river eutrophication and dissolved oxygen depletion.","confidence":0.94,"isDemo":true},
    environmentalContext: null,
    department: "water_sewage",
    
    statusHistory: [
      { status: "reported", timestamp: now - 79200000 },
      { status: "triaged", timestamp: now - 64800000 },
      { status: "verified", timestamp: now - 43200000, operatorName: "Vikram Joshi" }
    ],
    
    resolutionVerified: false,
    supportCount: 26,
    commentCount: 5,
    isDemo: true,
    createdAt: now - 79200000,
    updatedAt: now - 43200000,
  },
  {
    id: "demo_035", category: "construction_dust", severity: "high", status: "assigned",
    title: "District Court Metro station excavation dust",
    description: "Pneumatic rock drilling and loose soil loading generating dense dust cloud blinding drivers on Sancheti flyover ramp.",
    language: "en",
    location: loc(0.015, 0.002, "District Court Metro Station", "Shivajinagar"),
    publicLocation: pubLoc(0.015, 0.002, "Shivajinagar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_035", reporterAnonymous: false,
    aiAnalysis: {"category":"construction_dust","severity":"high","reason":"Subterranean rock drilling without wet dust suppression curtains.","suggestedDepartment":"pollution_control","healthRisk":"High PM10/PM2.5 inhalation, driver disorientation.","environmentalRisk":"Atmospheric particulate spike in central basin.","confidence":0.91,"isDemo":true},
    environmentalContext: { id: "env_035", reportId: "demo_035", lat: Number((BASE_LAT + 0.015).toFixed(4)), lng: Number((BASE_LNG + 0.002).toFixed(4)), timestamp: now - 23400000, aqi: 182, pm25: 79, pm10: 165, no2: 52, temperature: 32, windSpeed: 11, windDirection: 75, humidity: 48, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    assignedTo: "Metro Environmental Audit Wing",
    statusHistory: [
      { status: "reported", timestamp: now - 46800000 },
      { status: "triaged", timestamp: now - 36000000 },
      { status: "assigned", timestamp: now - 18000000, operatorName: "Dr. Shalini Kulkarni" }
    ],
    
    resolutionVerified: false,
    supportCount: 33,
    commentCount: 9,
    isDemo: true,
    createdAt: now - 46800000,
    updatedAt: now - 18000000,
  },
  {
    id: "demo_036", category: "illegal_dumping", severity: "medium", status: "reported",
    title: "Discarded medical cartons & thermocol — Sancheti Lane",
    description: "Heaps of pharmaceutical packing and styrofoam packing piled against perimeter wall.",
    language: "en",
    location: loc(0.016, -0.004, "Sancheti Hospital Back Lane", "Shivajinagar"),
    publicLocation: pubLoc(0.016, -0.004, "Shivajinagar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_036", reporterAnonymous: false,
    aiAnalysis: {"category":"illegal_dumping","severity":"medium","reason":"Non-biodegradable commercial hospital packaging piled in public right of way.","suggestedDepartment":"sanitation","healthRisk":"Fire hazard, microplastic fragment spread.","environmentalRisk":"Storm drain blockage.","confidence":0.87,"isDemo":true},
    environmentalContext: null,
    department: "sanitation",
    
    statusHistory: [
      { status: "reported", timestamp: now - 18000000 }
    ],
    
    resolutionVerified: false,
    supportCount: 12,
    commentCount: 2,
    isDemo: true,
    createdAt: now - 18000000,
    updatedAt: now - 18000000,
  },
  {
    id: "demo_037", category: "blocked_drain", severity: "medium", status: "triaged",
    title: "Stagnant rainwater & slush near Congress Bhavan",
    description: "Blocked roadside intake causing 6-inch muddy ponding on bus stop approach.",
    language: "en",
    location: loc(0.011, 0.005, "Congress Bhavan Chowk", "Shivajinagar"),
    publicLocation: pubLoc(0.011, 0.005, "Shivajinagar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_037", reporterAnonymous: false,
    aiAnalysis: {"category":"blocked_drain","severity":"medium","reason":"Roadside storm grate clogged with pavement sweepings.","suggestedDepartment":"public_works","healthRisk":"Pedestrian slip hazard, mosquito larvae.","environmentalRisk":"Urban waterlogging.","confidence":0.89,"isDemo":true},
    environmentalContext: null,
    department: "public_works",
    
    statusHistory: [
      { status: "reported", timestamp: now - 36000000 },
      { status: "triaged", timestamp: now - 25200000 }
    ],
    
    resolutionVerified: false,
    supportCount: 17,
    commentCount: 3,
    isDemo: true,
    createdAt: now - 36000000,
    updatedAt: now - 25200000,
  },
  {
    id: "demo_038", category: "sewage_leak", severity: "medium", status: "resolved",
    title: "Sanitized sewer chamber & dry pavement — Deccan Gymkhana",
    description: "Sewer pipeline that was leaking onto footway near Deccan Post Office has been repaired and disinfected.",
    language: "en",
    location: loc(0.005, -0.012, "Deccan Post Office", "Shivajinagar"),
    publicLocation: pubLoc(0.005, -0.012, "Shivajinagar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_038", reporterAnonymous: false,
    aiAnalysis: {"category":"sewage_leak","severity":"medium","reason":"Domestic wastewater chamber overflow.","suggestedDepartment":"water_sewage","healthRisk":"Pathogen exposure.","environmentalRisk":"Surface contamination.","confidence":0.91,"isDemo":true},
    environmentalContext: null,
    department: "water_sewage",
    
    statusHistory: [
      { status: "reported", timestamp: now - 259200000 },
      { status: "triaged", timestamp: now - 241919999.99999997 },
      { status: "assigned", timestamp: now - 190080000.00000003 },
      { status: "resolved", timestamp: now - 86400000, operatorName: "Ravi Kumar", note: "Chamber replaced and surface bleaching powder applied." }
    ],
    resolutionNote: "Defective pipeline sleeved, suctioned clean, and tarmac sanitized.",
    resolutionVerified: true,
    supportCount: 15,
    commentCount: 2,
    isDemo: true,
    createdAt: now - 259200000,
    updatedAt: now - 86400000,
  },
  {
    id: "demo_003", category: "illegal_dumping", severity: "high", status: "triaged",
    title: "Illegal construction debris dump — Baner road",
    description: "Several truckloads of construction rubble dumped on roadside plot overnight. Blocking pedestrian path.",
    language: "en",
    location: loc(0.045, -0.065, "Baner Road near Balewadi", "Baner"),
    publicLocation: pubLoc(0.045, -0.065, "Baner"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_003", reporterAnonymous: false,
    aiAnalysis: {"category":"illegal_dumping","severity":"high","reason":"Large-scale construction debris deposit in non-designated area. Access obstruction.","suggestedDepartment":"public_works","healthRisk":"Dust inhalation from disturbed rubble; vehicle accident risk.","environmentalRisk":"Silica dust, heavy metal leaching from debris.","confidence":0.88,"isDemo":true},
    environmentalContext: null,
    department: "public_works",
    
    statusHistory: [
      { status: "reported", timestamp: now - 64800000 },
      { status: "triaged", timestamp: now - 50400000, operatorName: "Sunita Patil" }
    ],
    
    resolutionVerified: false,
    supportCount: 24,
    commentCount: 5,
    isDemo: true,
    createdAt: now - 64800000,
    updatedAt: now - 50400000,
  },
  {
    id: "demo_011", category: "construction_dust", severity: "high", status: "assigned",
    title: "Dust storm from road widening — Baner Pashan link road",
    description: "Bulldozers scraping topsoil without water sprinklers. Massive brown dust cloud drifting across apartments.",
    language: "en",
    location: loc(0.043, -0.068, "Baner-Pashan Link Road", "Baner"),
    publicLocation: pubLoc(0.043, -0.068, "Baner"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_011", reporterAnonymous: false,
    aiAnalysis: {"category":"construction_dust","severity":"high","reason":"Uncontrolled large scale grading without ambient moisture suppression.","suggestedDepartment":"pollution_control","healthRisk":"Acute asthma, PM10 respirable particle loading.","environmentalRisk":"High particulate air corridor.","confidence":0.93,"isDemo":true},
    environmentalContext: { id: "env_011", reportId: "demo_011", lat: Number((BASE_LAT + 0.043).toFixed(4)), lng: Number((BASE_LNG + -0.068).toFixed(4)), timestamp: now - 18000000, aqi: 172, pm25: 71, pm10: 154, no2: 29, temperature: 31, windSpeed: 15, windDirection: 85, humidity: 46, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    assignedTo: "PMC Road Infrastructure Unit",
    statusHistory: [
      { status: "reported", timestamp: now - 36000000 },
      { status: "triaged", timestamp: now - 28800000 },
      { status: "assigned", timestamp: now - 14400000, operatorName: "Dr. Shalini Kulkarni" }
    ],
    
    resolutionVerified: false,
    supportCount: 37,
    commentCount: 10,
    isDemo: true,
    createdAt: now - 36000000,
    updatedAt: now - 14400000,
  },
  {
    id: "demo_039", category: "construction_dust", severity: "high", status: "verified",
    title: "High-rise foundation excavation dust plume — Balewadi High Street",
    description: "Hydraulic breaker hammers pulverizing basalt bedrock without water sprayers. Thick dust coating balconies 400m away.",
    language: "en",
    location: loc(0.046, -0.063, "Balewadi High Street Phase 2", "Baner"),
    publicLocation: pubLoc(0.046, -0.063, "Baner"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_039", reporterAnonymous: false,
    aiAnalysis: {"category":"construction_dust","severity":"high","reason":"Unmitigated mechanical rock crushing and dry excavating in high density residential zone.","suggestedDepartment":"pollution_control","healthRisk":"Fine silica particulates, chronic respiratory stress.","environmentalRisk":"High localized particulate air spike.","confidence":0.94,"isDemo":true},
    environmentalContext: { id: "env_039", reportId: "demo_039", lat: Number((BASE_LAT + 0.046).toFixed(4)), lng: Number((BASE_LNG + -0.063).toFixed(4)), timestamp: now - 16200000, aqi: 168, pm25: 68, pm10: 148, no2: 27, temperature: 32, windSpeed: 13, windDirection: 80, humidity: 44, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 32400000 },
      { status: "triaged", timestamp: now - 25200000 },
      { status: "verified", timestamp: now - 10800000, operatorName: "Yash Mishra" }
    ],
    
    resolutionVerified: false,
    supportCount: 42,
    commentCount: 11,
    isDemo: true,
    createdAt: now - 32400000,
    updatedAt: now - 10800000,
  },
  {
    id: "demo_019", category: "garbage_burning", severity: "high", status: "assigned",
    title: "Smoldering leaf & plastic burning — Aundh DP Road",
    description: "Sweeper piles along Mula river green corridor set on fire. Smoke settling over cycling track.",
    language: "en",
    location: loc(0.04, -0.058, "Aundh DP Road Promenade", "Aundh"),
    publicLocation: pubLoc(0.04, -0.058, "Aundh"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_019", reporterAnonymous: false,
    aiAnalysis: {"category":"garbage_burning","severity":"high","reason":"Open waste incineration in municipal river conservation buffer.","suggestedDepartment":"sanitation","healthRisk":"Respiratory distress in morning joggers, particulate inhalation.","environmentalRisk":"Vegetation ash scorch, river air degradation.","confidence":0.92,"isDemo":true},
    environmentalContext: { id: "env_019", reportId: "demo_019", lat: Number((BASE_LAT + 0.04).toFixed(4)), lng: Number((BASE_LNG + -0.058).toFixed(4)), timestamp: now - 12600000, aqi: 148, pm25: 58, pm10: 98, no2: 25, temperature: 28, windSpeed: 6, windDirection: 60, humidity: 66, weatherCode: 1, isDemo: true },
    department: "sanitation",
    assignedTo: "Aundh Sanitary Inspector",
    statusHistory: [
      { status: "reported", timestamp: now - 25200000 },
      { status: "triaged", timestamp: now - 18000000 },
      { status: "assigned", timestamp: now - 7200000, operatorName: "Vikram Joshi" }
    ],
    
    resolutionVerified: false,
    supportCount: 29,
    commentCount: 7,
    isDemo: true,
    createdAt: now - 25200000,
    updatedAt: now - 7200000,
  },
  {
    id: "demo_040", category: "illegal_dumping", severity: "medium", status: "reported",
    title: "Mula riverbank concrete rubble dumping — Aundh",
    description: "Debris from demolished bungalow dumped onto natural wetland bank behind botanical nursery.",
    language: "en",
    location: loc(0.038, -0.055, "Aundh Botanical Nursery", "Aundh"),
    publicLocation: pubLoc(0.038, -0.055, "Aundh"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_040", reporterAnonymous: false,
    aiAnalysis: {"category":"illegal_dumping","severity":"medium","reason":"Encroachment of riparian floodplain with solid masonry rubble.","suggestedDepartment":"public_works","healthRisk":"Water flow restriction.","environmentalRisk":"Destruction of river riparian flora.","confidence":0.89,"isDemo":true},
    environmentalContext: null,
    department: "public_works",
    
    statusHistory: [
      { status: "reported", timestamp: now - 21600000 }
    ],
    
    resolutionVerified: false,
    supportCount: 16,
    commentCount: 3,
    isDemo: true,
    createdAt: now - 21600000,
    updatedAt: now - 21600000,
  },
  {
    id: "demo_041", category: "sewage_leak", severity: "critical", status: "triaged",
    title: "Raw sewage geyser from blocked main line — Parihar Chowk",
    description: "Commercial kitchen oil combined with blocked trunk line causing sewer cover to lift and spew wastewater across roundabout.",
    language: "en",
    location: loc(0.041, -0.059, "Parihar Chowk Roundabout", "Aundh"),
    publicLocation: pubLoc(0.041, -0.059, "Aundh"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_041", reporterAnonymous: false,
    aiAnalysis: {"category":"sewage_leak","severity":"critical","reason":"Catastrophic trunk sewer failure spilling onto high-density commercial roundabout.","suggestedDepartment":"water_sewage","healthRisk":"Broad spectrum enteric pathogen spread, commercial contamination.","environmentalRisk":"Direct storm drainage inflow.","confidence":0.97,"isDemo":true},
    environmentalContext: null,
    department: "water_sewage",
    
    statusHistory: [
      { status: "reported", timestamp: now - 14400000 },
      { status: "triaged", timestamp: now - 7200000, operatorName: "Ravi Kumar" }
    ],
    
    resolutionVerified: false,
    supportCount: 45,
    commentCount: 13,
    isDemo: true,
    createdAt: now - 14400000,
    updatedAt: now - 7200000,
  },
  {
    id: "demo_042", category: "litter", severity: "low", status: "reported",
    title: "Food packaging & beverage cans strewn outside mall — Westend Aundh",
    description: "Weekend movie crowd left heaps of popcorn boxes, plastic cups and straws across median.",
    language: "en",
    location: loc(0.042, -0.061, "Westend Mall Forecourt", "Aundh"),
    publicLocation: pubLoc(0.042, -0.061, "Aundh"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_042", reporterAnonymous: false,
    aiAnalysis: {"category":"litter","severity":"low","reason":"High volume consumer packaging litter in pedestrian plaza.","suggestedDepartment":"sanitation","healthRisk":"Sanitation nuisance.","environmentalRisk":"Wind-blown plastic migration.","confidence":0.94,"isDemo":true},
    environmentalContext: null,
    department: "sanitation",
    
    statusHistory: [
      { status: "reported", timestamp: now - 10800000 }
    ],
    
    resolutionVerified: false,
    supportCount: 7,
    commentCount: 1,
    isDemo: true,
    createdAt: now - 10800000,
    updatedAt: now - 10800000,
  },
  {
    id: "demo_043", category: "illegal_dumping", severity: "medium", status: "resolved",
    title: "Cleared slope & restored green belt — Baner Hill Foot",
    description: "Illegal dumping site on the foothill trail has been excavated by earthmovers, fenced and seeded with native grass.",
    language: "en",
    location: loc(0.048, -0.067, "Baner Hill Trailhead", "Baner"),
    publicLocation: pubLoc(0.048, -0.067, "Baner"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_043", reporterAnonymous: false,
    aiAnalysis: {"category":"illegal_dumping","severity":"medium","reason":"Hill slope debris deposition threatening soil erosion.","suggestedDepartment":"public_works","healthRisk":"Slope instability.","environmentalRisk":"Soil erosion and invasive weed spread.","confidence":0.9,"isDemo":true},
    environmentalContext: null,
    department: "public_works",
    
    statusHistory: [
      { status: "reported", timestamp: now - 259200000 },
      { status: "triaged", timestamp: now - 233280000.00000003 },
      { status: "assigned", timestamp: now - 172800000 },
      { status: "resolved", timestamp: now - 50400000, operatorName: "Sunita Patil", note: "Excavator cleared 6 truckloads of rubble." }
    ],
    resolutionNote: "All debris hauled away; bio-fence installed to prevent future vehicular access.",
    resolutionVerified: true,
    supportCount: 21,
    commentCount: 4,
    isDemo: true,
    createdAt: now - 259200000,
    updatedAt: now - 50400000,
  },
  {
    id: "demo_007", category: "litter", severity: "low", status: "resolved",
    title: "Heavy litter on Viman Nagar road",
    description: "Food stalls leaving bulk waste on footpath. Not picked up for 3 days.",
    language: "en",
    location: loc(0.048, 0.058, "Viman Nagar Main Road", "Viman Nagar"),
    publicLocation: pubLoc(0.048, 0.058, "Viman Nagar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_007", reporterAnonymous: false,
    aiAnalysis: {"category":"litter","severity":"low","reason":"Scattered food waste from informal stalls.","suggestedDepartment":"sanitation","healthRisk":"Rodent and insect attraction.","environmentalRisk":"Microplastic runoff into nearby nullah.","confidence":0.94,"isDemo":true},
    environmentalContext: null,
    department: "sanitation",
    
    statusHistory: [
      { status: "reported", timestamp: now - 172800000 },
      { status: "triaged", timestamp: now - 155520000 },
      { status: "assigned", timestamp: now - 129600000 },
      { status: "resolved", timestamp: now - 43200000, operatorName: "Prakash Mane" }
    ],
    resolutionNote: "Sanitation team cleared the area and added to daily pickup route.",
    resolutionVerified: true,
    supportCount: 12,
    commentCount: 2,
    isDemo: true,
    createdAt: now - 172800000,
    updatedAt: now - 43200000,
  },
  {
    id: "demo_013", category: "construction_dust", severity: "medium", status: "verified",
    title: "Dust pollution from mall expansion — Viman Nagar",
    description: "Commercial plaza extension cutting stone without wet saw. Fine stone dust settling on cars and balconies.",
    language: "en",
    location: loc(0.047, 0.055, "Phoenix Marketcity Extension", "Viman Nagar"),
    publicLocation: pubLoc(0.047, 0.055, "Viman Nagar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_013", reporterAnonymous: false,
    aiAnalysis: {"category":"construction_dust","severity":"medium","reason":"Dry masonry and stone cutting without mandatory mist curtains.","suggestedDepartment":"pollution_control","healthRisk":"Fine respirable particulate inhalation.","environmentalRisk":"Urban vegetation coating.","confidence":0.84,"isDemo":true},
    environmentalContext: { id: "env_013", reportId: "demo_013", lat: Number((BASE_LAT + 0.047).toFixed(4)), lng: Number((BASE_LNG + 0.055).toFixed(4)), timestamp: now - 25200000, aqi: 142, pm25: 54, pm10: 104, no2: 36, temperature: 31, windSpeed: 9, windDirection: 95, humidity: 52, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 50400000 },
      { status: "triaged", timestamp: now - 39600000 },
      { status: "verified", timestamp: now - 21600000, operatorName: "Dr. Shalini Kulkarni" }
    ],
    
    resolutionVerified: false,
    supportCount: 21,
    commentCount: 4,
    isDemo: true,
    createdAt: now - 50400000,
    updatedAt: now - 21600000,
  },
  {
    id: "demo_018", category: "illegal_dumping", severity: "medium", status: "reported",
    title: "E-waste dumped near school — Kharadi",
    description: "Old computer monitors, dismantled motherboards and plastic casings dumped in vacant lot opposite secondary school.",
    language: "en",
    location: loc(0.052, 0.075, "Kharadi IT Park Road", "Kharadi"),
    publicLocation: pubLoc(0.052, 0.075, "Kharadi"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_018", reporterAnonymous: false,
    aiAnalysis: {"category":"illegal_dumping","severity":"medium","reason":"Electronic waste disposal in unmanaged public plot. Heavy metal hazard.","suggestedDepartment":"pollution_control","healthRisk":"Lead, cadmium exposure if scavenged or burned.","environmentalRisk":"Heavy metal leaching during rain.","confidence":0.89,"isDemo":true},
    environmentalContext: null,
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 18000000 }
    ],
    
    resolutionVerified: false,
    supportCount: 15,
    commentCount: 2,
    isDemo: true,
    createdAt: now - 18000000,
    updatedAt: now - 18000000,
  },
  {
    id: "demo_044", category: "smoke", severity: "high", status: "assigned",
    title: "Unauthorized scrap furnace black smoke plume — Kharadi Bypass",
    description: "Illegal aluminium melting kiln operating behind truck repair yards emitting thick sulfurous smoke.",
    language: "en",
    location: loc(0.054, 0.078, "Kharadi Bypass Truck Terminus", "Kharadi"),
    publicLocation: pubLoc(0.054, 0.078, "Kharadi"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_044", reporterAnonymous: false,
    aiAnalysis: {"category":"smoke","severity":"high","reason":"Unregistered pyrometallurgical furnace operating without air scrubber or chimney height compliance.","suggestedDepartment":"pollution_control","healthRisk":"Dioxins, metal fumes, sulfur dioxide inhalation.","environmentalRisk":"Toxic plume dispersal over residential townships.","confidence":0.96,"isDemo":true},
    environmentalContext: { id: "env_044", reportId: "demo_044", lat: Number((BASE_LAT + 0.054).toFixed(4)), lng: Number((BASE_LNG + 0.078).toFixed(4)), timestamp: now - 14400000, aqi: 215, pm25: 115, pm10: 182, no2: 58, temperature: 33, windSpeed: 12, windDirection: 70, humidity: 42, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    assignedTo: "MPCB Inspection Squad",
    statusHistory: [
      { status: "reported", timestamp: now - 28800000 },
      { status: "triaged", timestamp: now - 21600000 },
      { status: "assigned", timestamp: now - 10800000, operatorName: "Dr. Shalini Kulkarni" }
    ],
    
    resolutionVerified: false,
    supportCount: 36,
    commentCount: 9,
    isDemo: true,
    createdAt: now - 28800000,
    updatedAt: now - 10800000,
  },
  {
    id: "demo_045", category: "sewage_leak", severity: "high", status: "triaged",
    title: "Overflowing commercial grease trap & greywater — Dutta Mandir Road",
    description: "Multi-restaurant complex dumping rancid fryer grease and waste into street gutter. Drain choked and backing up.",
    language: "en",
    location: loc(0.046, 0.059, "Dutta Mandir Road Chowk", "Viman Nagar"),
    publicLocation: pubLoc(0.046, 0.059, "Viman Nagar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_045", reporterAnonymous: false,
    aiAnalysis: {"category":"sewage_leak","severity":"high","reason":"Lipid, fat, and greywater coagulation causing acute drain obstruction.","suggestedDepartment":"sanitation","healthRisk":"Pest vector explosion, rotten fat odour.","environmentalRisk":"Soil anaerobic conditions.","confidence":0.91,"isDemo":true},
    environmentalContext: null,
    department: "sanitation",
    
    statusHistory: [
      { status: "reported", timestamp: now - 32400000 },
      { status: "triaged", timestamp: now - 18000000, operatorName: "Yash Mishra" }
    ],
    
    resolutionVerified: false,
    supportCount: 23,
    commentCount: 5,
    isDemo: true,
    createdAt: now - 32400000,
    updatedAt: now - 18000000,
  },
  {
    id: "demo_046", category: "garbage_burning", severity: "medium", status: "reported",
    title: "Cardboard and food container bonfire — Behind Symbiosis",
    description: "Night tea stalls gathering cardboard boxes and plastic tea cups to burn for warmth.",
    language: "en",
    location: loc(0.05, 0.057, "Symbiosis Campus Boundary", "Viman Nagar"),
    publicLocation: pubLoc(0.05, 0.057, "Viman Nagar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_046", reporterAnonymous: false,
    aiAnalysis: {"category":"garbage_burning","severity":"medium","reason":"Informal commercial waste burning in educational cluster.","suggestedDepartment":"pollution_control","healthRisk":"Particulate inhalation, carbon monoxide.","environmentalRisk":"Localized haze.","confidence":0.88,"isDemo":true},
    environmentalContext: null,
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 7200000 }
    ],
    
    resolutionVerified: false,
    supportCount: 11,
    commentCount: 2,
    isDemo: true,
    createdAt: now - 7200000,
    updatedAt: now - 7200000,
  },
  {
    id: "demo_047", category: "blocked_drain", severity: "medium", status: "resolved",
    title: "Desilted drainage channel & clear flow — Nagar Road",
    description: "Monsoon culvert that was blocked by plastic silt has been mechanically dredged and concrete covers replaced.",
    language: "en",
    location: loc(0.049, 0.054, "Nagar Road BRT Station", "Viman Nagar"),
    publicLocation: pubLoc(0.049, 0.054, "Viman Nagar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_047", reporterAnonymous: false,
    aiAnalysis: {"category":"blocked_drain","severity":"medium","reason":"Silt and plastic bottle buildup in stormwater canal.","suggestedDepartment":"public_works","healthRisk":"Flooding risk.","environmentalRisk":"Runoff pooling.","confidence":0.92,"isDemo":true},
    environmentalContext: null,
    department: "public_works",
    
    statusHistory: [
      { status: "reported", timestamp: now - 259200000 },
      { status: "triaged", timestamp: now - 216000000 },
      { status: "assigned", timestamp: now - 172800000 },
      { status: "resolved", timestamp: now - 86400000, operatorName: "Sandeep More", note: "JCB excavator cleared 8 cubic meters of silt." }
    ],
    resolutionNote: "Channel cleared of silt, metal grates re-welded, free flow verified.",
    resolutionVerified: true,
    supportCount: 14,
    commentCount: 3,
    isDemo: true,
    createdAt: now - 259200000,
    updatedAt: now - 86400000,
  },
  {
    id: "demo_004", category: "construction_dust", severity: "high", status: "assigned",
    title: "Uncontrolled construction dust — Hinjewadi IT Park Phase 1",
    description: "Road-widening project generating massive dust without water spraying or barriers. Visibility reduced on highway.",
    language: "en",
    location: loc(0.07, -0.12, "Hinjewadi Phase 1 Circle", "Hinjewadi"),
    publicLocation: pubLoc(0.07, -0.12, "Hinjewadi"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_004", reporterAnonymous: false,
    aiAnalysis: {"category":"construction_dust","severity":"high","reason":"Active arterial road construction without particulate suppression.","suggestedDepartment":"pollution_control","healthRisk":"PM10 and respirable silica inhalation. Commuter respiratory irritation.","environmentalRisk":"Heavy particulate loading on highway corridor.","confidence":0.88,"isDemo":true},
    environmentalContext: { id: "env_004", reportId: "demo_004", lat: Number((BASE_LAT + 0.07).toFixed(4)), lng: Number((BASE_LNG + -0.12).toFixed(4)), timestamp: now - 21600000, aqi: 195, pm25: 86, pm10: 172, no2: 44, temperature: 32, windSpeed: 14, windDirection: 85, humidity: 42, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    assignedTo: "MIDC Environmental Cell",
    statusHistory: [
      { status: "reported", timestamp: now - 43200000 },
      { status: "triaged", timestamp: now - 32400000 },
      { status: "assigned", timestamp: now - 14400000, operatorName: "Dr. Shalini Kulkarni" }
    ],
    
    resolutionVerified: false,
    supportCount: 42,
    commentCount: 13,
    isDemo: true,
    createdAt: now - 43200000,
    updatedAt: now - 14400000,
  },
  {
    id: "demo_048", category: "construction_dust", severity: "high", status: "verified",
    title: "Metro Line 3 pier drilling dust plume — Wipro Circle",
    description: "Rotary drilling rigs operating dry without containment cloth. Fine cement and rock powder blanketing tech park campus.",
    language: "en",
    location: loc(0.072, -0.123, "Wipro Circle Hinjewadi", "Hinjewadi"),
    publicLocation: pubLoc(0.072, -0.123, "Hinjewadi"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_048", reporterAnonymous: false,
    aiAnalysis: {"category":"construction_dust","severity":"high","reason":"Deep pier foundation drilling producing intense silica and cement powder plume.","suggestedDepartment":"pollution_control","healthRisk":"Silicosis risk, vehicular visibility impairment.","environmentalRisk":"Regional air quality deterioration.","confidence":0.95,"isDemo":true},
    environmentalContext: { id: "env_048", reportId: "demo_048", lat: Number((BASE_LAT + 0.072).toFixed(4)), lng: Number((BASE_LNG + -0.123).toFixed(4)), timestamp: now - 18000000, aqi: 188, pm25: 82, pm10: 168, no2: 41, temperature: 33, windSpeed: 13, windDirection: 80, humidity: 40, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 36000000 },
      { status: "triaged", timestamp: now - 28800000 },
      { status: "verified", timestamp: now - 10800000, operatorName: "Yash Mishra" }
    ],
    
    resolutionVerified: false,
    supportCount: 38,
    commentCount: 10,
    isDemo: true,
    createdAt: now - 36000000,
    updatedAt: now - 10800000,
  },
  {
    id: "demo_010", category: "smoke", severity: "high", status: "assigned",
    title: "Factory chimney dark smoke — Pimpri-Chinchwad MIDC",
    description: "Industrial boiler emitting continuous black smoke plume. Chemical smell noticeable across Bhosari and Morwadi.",
    language: "en",
    location: loc(0.08, -0.06, "Pimpri MIDC Sector 10", "Hinjewadi"),
    publicLocation: pubLoc(0.08, -0.06, "Hinjewadi"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_010", reporterAnonymous: false,
    aiAnalysis: {"category":"smoke","severity":"high","reason":"Dense black industrial plume indicating improper fuel-to-air ratio or low-grade coal/furnace oil.","suggestedDepartment":"pollution_control","healthRisk":"Sulfur dioxide, polycyclic hydrocarbons.","environmentalRisk":"Heavy sulfur deposition downwind.","confidence":0.92,"isDemo":true},
    environmentalContext: { id: "env_010", reportId: "demo_010", lat: Number((BASE_LAT + 0.08).toFixed(4)), lng: Number((BASE_LNG + -0.06).toFixed(4)), timestamp: now - 27000000, aqi: 218, pm25: 118, pm10: 194, no2: 65, temperature: 34, windSpeed: 16, windDirection: 70, humidity: 38, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    assignedTo: "PCMC Environmental Inspector",
    statusHistory: [
      { status: "reported", timestamp: now - 54000000 },
      { status: "triaged", timestamp: now - 39600000 },
      { status: "assigned", timestamp: now - 18000000, operatorName: "Dr. Shalini Kulkarni" }
    ],
    
    resolutionVerified: false,
    supportCount: 44,
    commentCount: 11,
    isDemo: true,
    createdAt: now - 54000000,
    updatedAt: now - 18000000,
  },
  {
    id: "demo_015", category: "garbage_burning", severity: "critical", status: "verified",
    title: "Tyre burning near scrapyard — Bhosari",
    description: "Open burning of automotive tyres behind auto parts yard. Dense toxic smoke crossing highway.",
    language: "en",
    location: loc(0.085, -0.055, "Bhosari Telco Road", "Hinjewadi"),
    publicLocation: pubLoc(0.085, -0.055, "Hinjewadi"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_015", reporterAnonymous: false,
    aiAnalysis: {"category":"garbage_burning","severity":"critical","reason":"Deliberate tyre burning for wire scrap extraction. Extreme toxic emissions.","suggestedDepartment":"pollution_control","healthRisk":"High concentration zinc oxide, dioxins, mutagens.","environmentalRisk":"Heavy soil and particulate contamination.","confidence":0.98,"isDemo":true},
    environmentalContext: { id: "env_015", reportId: "demo_015", lat: Number((BASE_LAT + 0.085).toFixed(4)), lng: Number((BASE_LNG + -0.055).toFixed(4)), timestamp: now - 12600000, aqi: 260, pm25: 165, pm10: 240, no2: 78, temperature: 33, windSpeed: 15, windDirection: 65, humidity: 35, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 25200000 },
      { status: "triaged", timestamp: now - 18000000 },
      { status: "verified", timestamp: now - 7200000, operatorName: "Ravi Kumar" }
    ],
    
    resolutionVerified: false,
    supportCount: 53,
    commentCount: 16,
    isDemo: true,
    createdAt: now - 25200000,
    updatedAt: now - 7200000,
  },
  {
    id: "demo_049", category: "garbage_burning", severity: "medium", status: "reported",
    title: "Cables & polymer insulation burning — Phase 2 Labour Camp",
    description: "Open fire burning plastic coated wiring to salvage copper behind temporary worker quarters.",
    language: "en",
    location: loc(0.075, -0.13, "Hinjewadi Phase 2 Hill Road", "Hinjewadi"),
    publicLocation: pubLoc(0.075, -0.13, "Hinjewadi"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_049", reporterAnonymous: false,
    aiAnalysis: {"category":"garbage_burning","severity":"medium","reason":"Polyvinyl chloride (PVC) wire insulation burning producing hydrochloric acid fumes.","suggestedDepartment":"pollution_control","healthRisk":"Acidic inhalation, throat burns.","environmentalRisk":"Persistent chlorinated organic pollution.","confidence":0.9,"isDemo":true},
    environmentalContext: null,
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 14400000 }
    ],
    
    resolutionVerified: false,
    supportCount: 19,
    commentCount: 3,
    isDemo: true,
    createdAt: now - 14400000,
    updatedAt: now - 14400000,
  },
  {
    id: "demo_050", category: "blocked_drain", severity: "high", status: "triaged",
    title: "Waterlogged underpass and clogged drain — Bhumkar Chowk, Wakad",
    description: "Highway underpass flooded with muddy water due to drain grill clogged with plastic waste.",
    language: "en",
    location: loc(0.065, -0.105, "Bhumkar Chowk Underpass", "Hinjewadi"),
    publicLocation: pubLoc(0.065, -0.105, "Hinjewadi"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_050", reporterAnonymous: false,
    aiAnalysis: {"category":"blocked_drain","severity":"high","reason":"Underpass sump intake obstruction causing critical vehicular flooding.","suggestedDepartment":"public_works","healthRisk":"Vehicle engine stall, drowning risk.","environmentalRisk":"Urban stormwater backflow.","confidence":0.93,"isDemo":true},
    environmentalContext: null,
    department: "public_works",
    
    statusHistory: [
      { status: "reported", timestamp: now - 28800000 },
      { status: "triaged", timestamp: now - 18000000, operatorName: "Sandeep More" }
    ],
    
    resolutionVerified: false,
    supportCount: 31,
    commentCount: 6,
    isDemo: true,
    createdAt: now - 28800000,
    updatedAt: now - 18000000,
  },
  {
    id: "demo_051", category: "construction_dust", severity: "medium", status: "resolved",
    title: "Suppressed dust and misted road corridor — Wakad Bridge",
    description: "Construction company deployed 3 mist sprinkler trucks and installed green net fencing along bridge ramp.",
    language: "en",
    location: loc(0.062, -0.1, "Wakad Flyover Ramp", "Hinjewadi"),
    publicLocation: pubLoc(0.062, -0.1, "Hinjewadi"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_051", reporterAnonymous: false,
    aiAnalysis: {"category":"construction_dust","severity":"medium","reason":"Bridge excavation particulate emissions.","suggestedDepartment":"pollution_control","healthRisk":"Dust inhalation.","environmentalRisk":"Airborne PM10.","confidence":0.89,"isDemo":true},
    environmentalContext: null,
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 259200000 },
      { status: "triaged", timestamp: now - 241919999.99999997 },
      { status: "assigned", timestamp: now - 190080000.00000003 },
      { status: "resolved", timestamp: now - 86400000, operatorName: "Dr. Shalini Kulkarni", note: "Mist cannons active; road washed." }
    ],
    resolutionNote: "Continuous water sprinklers operational; dust barrier curtains inspected and approved.",
    resolutionVerified: true,
    supportCount: 18,
    commentCount: 3,
    isDemo: true,
    createdAt: now - 259200000,
    updatedAt: now - 86400000,
  },
  {
    id: "demo_005", category: "blocked_drain", severity: "medium", status: "assigned",
    title: "Clogged stormwater drain — Koregaon Park Lane 6",
    description: "Drain blocked with plastic bags and debris. Water pooling after light rain. Possible dengue breeding site.",
    language: "en",
    location: loc(0.018, 0.038, "Koregaon Park Lane 6", "Koregaon Park"),
    publicLocation: pubLoc(0.018, 0.038, "Koregaon Park"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_005", reporterAnonymous: false,
    aiAnalysis: {"category":"blocked_drain","severity":"medium","reason":"Stormwater channel obstruction causing street-level water stagnation.","suggestedDepartment":"public_works","healthRisk":"Stagnant water vector habitat (dengue, malaria).","environmentalRisk":"Urban runoff pooling and localized flood hazard.","confidence":0.86,"isDemo":true},
    environmentalContext: null,
    department: "public_works",
    assignedTo: "East Drainage Wing",
    statusHistory: [
      { status: "reported", timestamp: now - 50400000 },
      { status: "triaged", timestamp: now - 39600000 },
      { status: "assigned", timestamp: now - 21600000, operatorName: "Vikram Joshi" }
    ],
    
    resolutionVerified: false,
    supportCount: 19,
    commentCount: 4,
    isDemo: true,
    createdAt: now - 50400000,
    updatedAt: now - 21600000,
  },
  {
    id: "demo_006", category: "garbage_burning", severity: "medium", status: "verified",
    title: "Wood and charcoal burning — Koregaon Park",
    description: "Open fire used for cooking and heating by roadside workers near bridge. Heavy smoke entering nearby cafes.",
    language: "en",
    location: loc(0.016, 0.035, "Bund Garden Bridge Approach", "Koregaon Park"),
    publicLocation: pubLoc(0.016, 0.035, "Koregaon Park"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_006", reporterAnonymous: false,
    aiAnalysis: {"category":"garbage_burning","severity":"medium","reason":"Biomass combustion without flue control in dense urban commercial strip.","suggestedDepartment":"pollution_control","healthRisk":"Particulate exposure for outdoor dining patrons.","environmentalRisk":"Localized CO and soot elevation.","confidence":0.81,"isDemo":true},
    environmentalContext: null,
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 28800000 },
      { status: "triaged", timestamp: now - 21600000 },
      { status: "verified", timestamp: now - 10800000, operatorName: "Yash Mishra" }
    ],
    
    resolutionVerified: false,
    supportCount: 14,
    commentCount: 2,
    isDemo: true,
    createdAt: now - 28800000,
    updatedAt: now - 10800000,
  },
  {
    id: "demo_014", category: "illegal_dumping", severity: "high", status: "triaged",
    title: "Plastic waste dumped in drainage — Pune Station yard",
    description: "Railway pantry contractors dumping single-use packaging and unsegregated meal containers directly into open culvert.",
    language: "en",
    location: loc(0.01, 0.02, "Pune Railway Station Yard", "Koregaon Park"),
    publicLocation: pubLoc(0.01, 0.02, "Koregaon Park"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_014", reporterAnonymous: false,
    aiAnalysis: {"category":"illegal_dumping","severity":"high","reason":"High volume commercial plastic waste discarding into critical storm outlet.","suggestedDepartment":"sanitation","healthRisk":"Severe microplastic dispersion, water stagnation.","environmentalRisk":"Downstream canal choking.","confidence":0.93,"isDemo":true},
    environmentalContext: null,
    department: "sanitation",
    
    statusHistory: [
      { status: "reported", timestamp: now - 57600000 },
      { status: "triaged", timestamp: now - 43200000, operatorName: "Sunita Patil" }
    ],
    
    resolutionVerified: false,
    supportCount: 31,
    commentCount: 6,
    isDemo: true,
    createdAt: now - 57600000,
    updatedAt: now - 43200000,
  },
  {
    id: "demo_016", category: "illegal_dumping", severity: "medium", status: "assigned",
    title: "Overflowing community bin — Bibwewadi",
    description: "Bin not cleared for 4 days. Waste spilling across entire pavement. Stray animals dispersing refuse.",
    language: "en",
    location: loc(-0.035, 0.01, "Bibwewadi Upper Depot", "Swargate"),
    publicLocation: pubLoc(-0.035, 0.01, "Swargate"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_016", reporterAnonymous: false,
    aiAnalysis: {"category":"illegal_dumping","severity":"medium","reason":"Municipal solid waste collection container failure causing ambient scattering.","suggestedDepartment":"sanitation","healthRisk":"Animal vector contact, pathogen decomposition odour.","environmentalRisk":"Biological litter dispersion.","confidence":0.9,"isDemo":true},
    environmentalContext: null,
    department: "sanitation",
    assignedTo: "Zone 5 Sweeper Fleet",
    statusHistory: [
      { status: "reported", timestamp: now - 64800000 },
      { status: "triaged", timestamp: now - 54000000 },
      { status: "assigned", timestamp: now - 25200000, operatorName: "Prakash Mane" }
    ],
    
    resolutionVerified: false,
    supportCount: 24,
    commentCount: 5,
    isDemo: true,
    createdAt: now - 64800000,
    updatedAt: now - 25200000,
  },
  {
    id: "demo_017", category: "smoke", severity: "low", status: "resolved",
    title: "Vehicle exhaust from auto-rickshaws — Swargate",
    description: "Multiple CNG autos idling and producing blue smoke. RTO emission test squad removed non-compliant autos.",
    language: "en",
    location: loc(-0.025, 0.005, "Swargate ST Bus Station", "Swargate"),
    publicLocation: pubLoc(-0.025, 0.005, "Swargate"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_017", reporterAnonymous: false,
    aiAnalysis: {"category":"smoke","severity":"low","reason":"Vehicle exhaust from misfiring engines.","suggestedDepartment":"pollution_control","healthRisk":"Localised hydrocarbon and CO exposure.","environmentalRisk":"Carbon monoxide contribution to urban ambient air.","confidence":0.68,"isDemo":true},
    environmentalContext: null,
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 259200000 },
      { status: "triaged", timestamp: now - 241919999.99999997 },
      { status: "assigned", timestamp: now - 190080000.00000003 },
      { status: "resolved", timestamp: now - 86400000, operatorName: "Traffic Police Division" }
    ],
    resolutionNote: "RTO squad conducted surprise check; 4 non-compliant vehicles seized.",
    resolutionVerified: true,
    supportCount: 11,
    commentCount: 2,
    isDemo: true,
    createdAt: now - 259200000,
    updatedAt: now - 86400000,
  },
  {
    id: "demo_020", category: "construction_dust", severity: "medium", status: "reported",
    title: "Quarry blasting dust — Katraj",
    description: "Stone quarry near highway doing daytime blasting without dust mitigation. Homes covered in fine dust.",
    language: "en",
    location: loc(-0.055, 0.008, "Katraj Quarry Road", "Swargate"),
    publicLocation: pubLoc(-0.055, 0.008, "Swargate"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_020", reporterAnonymous: false,
    aiAnalysis: {"category":"construction_dust","severity":"medium","reason":"Quarry blasting creating large silica dust clouds over residential areas.","suggestedDepartment":"pollution_control","healthRisk":"Silicosis risk from repeated exposure. Acute respiratory irritation.","environmentalRisk":"Land degradation, habitat loss.","confidence":0.82,"isDemo":true},
    environmentalContext: null,
    department: "pollution_control",
    
    statusHistory: [
      { status: "reported", timestamp: now - 28800000 }
    ],
    
    resolutionVerified: false,
    supportCount: 22,
    commentCount: 4,
    isDemo: true,
    createdAt: now - 28800000,
    updatedAt: now - 28800000,
  },
  {
    id: "demo_052", category: "blocked_drain", severity: "low", status: "resolved",
    title: "Desilted drainage culvert & cleared road — Koregaon Park Lane 3",
    description: "Drainage grates that were choked with fallen neem leaves and food waste have been cleared by jetting machine.",
    language: "en",
    location: loc(0.015, 0.034, "Koregaon Park Lane 3", "Koregaon Park"),
    publicLocation: pubLoc(0.015, 0.034, "Koregaon Park"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_052", reporterAnonymous: false,
    aiAnalysis: {"category":"blocked_drain","severity":"low","reason":"Organic leaf litter causing gutter obstruction.","suggestedDepartment":"public_works","healthRisk":"Stagnant puddle.","environmentalRisk":"Storm drain blockage.","confidence":0.91,"isDemo":true},
    environmentalContext: null,
    department: "public_works",
    
    statusHistory: [
      { status: "reported", timestamp: now - 259200000 },
      { status: "triaged", timestamp: now - 233280000.00000003 },
      { status: "assigned", timestamp: now - 181440000 },
      { status: "resolved", timestamp: now - 86400000, operatorName: "Sandeep More", note: "Hydro-jetting unit flushed line." }
    ],
    resolutionNote: "High pressure hydro-jetting cleared all debris. Grates secured.",
    resolutionVerified: true,
    supportCount: 9,
    commentCount: 1,
    isDemo: true,
    createdAt: now - 259200000,
    updatedAt: now - 86400000,
  },
];

export const DEMO_REPORTS: Report[] = RAW_REPORTS.map((r) => {
  const pair = CATEGORY_REMEDIATION_PAIRS[r.category] || CATEGORY_REMEDIATION_PAIRS.other;
  return {
    ...r,
    photoUrls: r.photoUrls && r.photoUrls.length > 0 ? r.photoUrls : [pair.before],
    afterPhotoUrls:
      r.afterPhotoUrls && r.afterPhotoUrls.length > 0
        ? r.afterPhotoUrls
        : r.status === "resolved"
        ? [pair.after]
        : [],
    evidenceScore: computeEvidenceScore(
      r,
      Math.floor(Math.random() * 4),
      r.environmentalContext?.aqi
        ? Math.max(0, Math.min(20, Math.round((r.environmentalContext.aqi - 100) / 10)))
        : 0
    ),
  };
});

export function getDemoReport(id: string): Report | undefined {
  return DEMO_REPORTS.find((r) => r.id === id);
}

export function getDemoReports(filters?: {
  category?: string;
  severity?: string;
  status?: string;
  limit?: number;
}): Report[] {
  let results = [...DEMO_REPORTS];
  if (filters?.category) results = results.filter((r) => r.category === filters.category);
  if (filters?.severity) results = results.filter((r) => r.severity === filters.severity);
  if (filters?.status) results = results.filter((r) => r.status === filters.status);
  results.sort((a, b) => b.createdAt - a.createdAt);
  if (filters?.limit) results = results.slice(0, filters.limit);
  return results;
}
