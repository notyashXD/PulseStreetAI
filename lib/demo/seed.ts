import { Report } from "@/lib/types";
import { computeEvidenceScore } from "@/lib/services/scoring";

const BASE_LAT = 18.5204;
const BASE_LNG = 73.8567;

function loc(dLat: number, dLng: number, landmark?: string, ward?: string) {
  return {
    lat: BASE_LAT + dLat,
    lng: BASE_LNG + dLng,
    landmark,
    ward,
    address: `Near ${landmark ?? "location"}, Pune`,
  };
}

function pubLoc(dLat: number, dLng: number, ward?: string) {
  return { lat: BASE_LAT + dLat + 0.002, lng: BASE_LNG + dLng + 0.002, ward };
}

const now = Date.now();
const h = 3_600_000;
const d = 24 * h;

const RAW_REPORTS: Omit<Report, "evidenceScore">[] = [
  {
    id: "demo_001", category: "garbage_burning", severity: "high", status: "verified",
    title: "Open garbage burning near Kothrud depot",
    description: "Large pile of mixed household waste being burned openly since morning. Thick black smoke spreading across residential area.",
    language: "en",
    location: loc(-0.02, -0.04, "Kothrud Bus Depot", "Kothrud"),
    publicLocation: pubLoc(-0.02, -0.04, "Kothrud"),
    photoUrls: [],
    reporterId: "demo_user_01", reporterAnonymous: false,
    aiAnalysis: { category: "garbage_burning", severity: "high", reason: "Open burning of mixed municipal solid waste. Dioxin and PM2.5 risk confirmed.", suggestedDepartment: "pollution_control", healthRisk: "Toxic smoke inhalation. Dioxins, furans present.", environmentalRisk: "Heavy PM2.5/PM10 release; soil ash contamination.", confidence: 0.91, isDemo: true },
    environmentalContext: { id: "env_001", reportId: "demo_001", lat: BASE_LAT - 0.02, lng: BASE_LNG - 0.04, timestamp: now - 6 * h, aqi: 162, pm25: 68.4, pm10: 112.3, no2: 34.1, temperature: 32, windSpeed: 6, windDirection: 210, humidity: 58, weatherCode: 1, isDemo: true },
    department: "pollution_control",
    statusHistory: [
      { status: "reported", timestamp: now - 8 * h, note: "Submitted via app" },
      { status: "triaged", timestamp: now - 6 * h, note: "High severity confirmed" },
      { status: "verified", timestamp: now - 4 * h, note: "Field team confirmed active burning", operatorName: "Anita Desai" },
    ],
    supportCount: 14, commentCount: 3, isDemo: true, resolutionVerified: false, createdAt: now - 8 * h, updatedAt: now - 4 * h,
  },
  {
    id: "demo_002", category: "sewage_leak", severity: "critical", status: "assigned",
    title: "Sewage overflow on FC Road",
    description: "Manhole overflowing with raw sewage onto the footpath near Fergusson College. Strong odour, pedestrians forced onto road.",
    language: "en",
    location: loc(0.01, -0.01, "Fergusson College Road", "Shivajinagar"),
    publicLocation: pubLoc(0.01, -0.01, "Shivajinagar"),
    photoUrls: [],
    reporterId: "demo_user_02", reporterAnonymous: false,
    aiAnalysis: { category: "sewage_leak", severity: "critical", reason: "Raw sewage overflow on public footpath. Immediate health hazard.", suggestedDepartment: "water_sewage", healthRisk: "Direct pathogen exposure. E. coli, cholera, typhoid risk.", environmentalRisk: "Groundwater and surface water contamination.", confidence: 0.95, isDemo: true },
    environmentalContext: { id: "env_002", reportId: "demo_002", lat: BASE_LAT + 0.01, lng: BASE_LNG - 0.01, timestamp: now - 3 * h, aqi: 88, pm25: 31.2, pm10: 54.7, no2: 18.3, temperature: 30, windSpeed: 10, windDirection: 180, humidity: 75, weatherCode: 2, isDemo: true },
    department: "water_sewage", assignedTo: "Water Board Zone 2",
    statusHistory: [
      { status: "reported", timestamp: now - 5 * h },
      { status: "triaged", timestamp: now - 4 * h, operatorName: "Ravi Kumar" },
      { status: "verified", timestamp: now - 3.5 * h },
      { status: "assigned", timestamp: now - 3 * h, note: "PCMC Water Board dispatched", operatorName: "Ravi Kumar" },
    ],
    supportCount: 27, commentCount: 8, isDemo: true, resolutionVerified: false, createdAt: now - 5 * h, updatedAt: now - 3 * h,
  },
  {
    id: "demo_003", category: "illegal_dumping", severity: "high", status: "triaged",
    title: "Illegal construction debris dump — Baner road",
    description: "Several truckloads of construction rubble dumped on roadside plot overnight. Blocking pedestrian path.",
    language: "en",
    location: loc(0.05, 0.08, "Baner Road near Balewadi", "Baner"),
    publicLocation: pubLoc(0.05, 0.08, "Baner"),
    photoUrls: [], reporterId: "demo_user_03", reporterAnonymous: true,
    aiAnalysis: { category: "illegal_dumping", severity: "high", reason: "Large-scale construction debris deposit in non-designated area. Access obstruction.", suggestedDepartment: "public_works", healthRisk: "Dust inhalation from disturbed rubble; vehicle accident risk.", environmentalRisk: "Silica dust, heavy metal leaching from debris.", confidence: 0.88, isDemo: true },
    environmentalContext: null, department: "public_works",
    statusHistory: [
      { status: "reported", timestamp: now - 14 * h },
      { status: "triaged", timestamp: now - 12 * h, note: "Assigned to Public Works", operatorName: "Sunita Patil" },
    ],
    supportCount: 9, commentCount: 2, isDemo: true, resolutionVerified: false, createdAt: now - 14 * h, updatedAt: now - 12 * h,
  },
  {
    id: "demo_004", category: "construction_dust", severity: "medium", status: "reported",
    title: "Uncontrolled construction dust — Hinjewadi IT Park",
    description: "Road-widening project generating massive dust without water spraying or barriers. Visibility reduced on highway.",
    language: "en",
    location: loc(0.12, -0.15, "Hinjewadi Phase 1", "Hinjewadi"),
    publicLocation: pubLoc(0.12, -0.15, "Hinjewadi"),
    photoUrls: [], reporterId: "demo_user_04", reporterAnonymous: false,
    aiAnalysis: { category: "construction_dust", severity: "medium", reason: "Active road construction without dust suppression measures.", suggestedDepartment: "pollution_control", healthRisk: "PM10 and silica inhalation. Respiratory irritation.", environmentalRisk: "PM10 elevation in surrounding residential area.", confidence: 0.76, isDemo: true },
    environmentalContext: null, department: "unassigned",
    statusHistory: [{ status: "reported", timestamp: now - 2 * h }],
    supportCount: 4, commentCount: 0, isDemo: true, resolutionVerified: false, createdAt: now - 2 * h, updatedAt: now - 2 * h,
  },
  {
    id: "demo_005", category: "blocked_drain", severity: "medium", status: "assigned",
    title: "Clogged stormwater drain — Koregaon Park",
    description: "Drain blocked with plastic bags and debris. Water pooling after light rain. Possible dengue breeding site.",
    language: "en",
    location: loc(0.02, 0.05, "Koregaon Park Lane 6", "Koregaon Park"),
    publicLocation: pubLoc(0.02, 0.05, "Koregaon Park"),
    photoUrls: [], reporterId: "demo_user_05", reporterAnonymous: false,
    aiAnalysis: { category: "blocked_drain", severity: "medium", reason: "Drain fully obstructed with plastic waste causing flooding.", suggestedDepartment: "public_works", healthRisk: "Mosquito breeding — dengue, malaria, chikungunya risk.", environmentalRisk: "Standing water ecosystem disruption.", confidence: 0.83, isDemo: true },
    environmentalContext: null, department: "public_works",
    statusHistory: [
      { status: "reported", timestamp: now - 1 * d },
      { status: "triaged", timestamp: now - 20 * h },
      { status: "assigned", timestamp: now - 16 * h, note: "Drain cleaning crew scheduled" },
    ],
    supportCount: 6, commentCount: 1, isDemo: true, resolutionVerified: false, createdAt: now - 1 * d, updatedAt: now - 16 * h,
  },
  {
    id: "demo_006", category: "smoke", severity: "high", status: "reported",
    title: "Factory chimney smoke — Pimpri industrial area",
    description: "Black smoke from chimney visible for several km. No visible scrubber. Occurring since 6am.",
    language: "en",
    location: loc(0.2, -0.1, "Pimpri Industrial Estate", "Pimpri"),
    publicLocation: pubLoc(0.2, -0.1, "Pimpri"),
    photoUrls: [], reporterId: "demo_user_06", reporterAnonymous: false,
    aiAnalysis: { category: "smoke", severity: "high", reason: "Dense black industrial smoke without visible pollution control.", suggestedDepartment: "pollution_control", healthRisk: "SO2, NOx, heavy metal particle inhalation.", environmentalRisk: "Acid deposition, regional AQI spike.", confidence: 0.84, isDemo: true },
    environmentalContext: { id: "env_006", reportId: "demo_006", lat: BASE_LAT + 0.2, lng: BASE_LNG - 0.1, timestamp: now - 1 * h, aqi: 198, pm25: 89.3, pm10: 144.7, no2: 52.1, temperature: 31, windSpeed: 4, windDirection: 320, humidity: 62, weatherCode: 0, isDemo: true },
    department: "unassigned",
    statusHistory: [{ status: "reported", timestamp: now - 1 * h }],
    supportCount: 21, commentCount: 5, isDemo: true, resolutionVerified: false, createdAt: now - 1 * h, updatedAt: now - 1 * h,
  },
  {
    id: "demo_007", category: "litter", severity: "low", status: "resolved",
    title: "Heavy litter on Viman Nagar road",
    description: "Food stalls leaving bulk waste on footpath. Not picked up for 3 days.",
    language: "en",
    location: loc(0.04, 0.12, "Viman Nagar Main Road", "Viman Nagar"),
    publicLocation: pubLoc(0.04, 0.12, "Viman Nagar"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_07", reporterAnonymous: false,
    aiAnalysis: { category: "litter", severity: "low", reason: "Scattered food waste from informal stalls.", suggestedDepartment: "sanitation", healthRisk: "Rodent and insect attraction.", environmentalRisk: "Microplastic runoff into nearby nullah.", confidence: 0.94, isDemo: true },
    environmentalContext: null, department: "sanitation",
    statusHistory: [
      { status: "reported", timestamp: now - 2 * d },
      { status: "triaged", timestamp: now - 1.8 * d },
      { status: "assigned", timestamp: now - 1.5 * d },
      { status: "resolved", timestamp: now - 12 * h, note: "Area cleaned. Daily pickup reinstated.", operatorName: "Prakash Mane" },
    ],
    resolutionNote: "Sanitation team cleared the area and added to daily pickup route.",
    resolutionVerified: true, supportCount: 3, commentCount: 1, isDemo: true, createdAt: now - 2 * d, updatedAt: now - 12 * h,
  },
  {
    id: "demo_008", category: "garbage_burning", severity: "high", status: "triaged",
    title: "Waste burning near Sinhagad Road",
    description: "Municipal sweepers collecting leaves and burning on-spot. Combined with plastic waste from nearby shops.",
    language: "hi",
    location: loc(-0.04, -0.02, "Sinhagad Road, Dandekar Bridge", "Sinhagad Road"),
    publicLocation: pubLoc(-0.04, -0.02, "Sinhagad Road"),
    photoUrls: [], reporterId: "demo_user_08", reporterAnonymous: false,
    aiAnalysis: { category: "garbage_burning", severity: "high", reason: "Mixed leaf and plastic open burning. Dense black smoke.", suggestedDepartment: "sanitation", healthRisk: "Carcinogenic compounds in smoke.", environmentalRisk: "PM2.5 spike in residential area.", confidence: 0.86, isDemo: true },
    environmentalContext: null, department: "sanitation",
    statusHistory: [
      { status: "reported", timestamp: now - 10 * h },
      { status: "triaged", timestamp: now - 8 * h },
    ],
    supportCount: 11, commentCount: 2, isDemo: true, resolutionVerified: false, createdAt: now - 10 * h, updatedAt: now - 8 * h,
  },
  {
    id: "demo_009", category: "illegal_dumping", severity: "high", status: "reported",
    title: "Hospital waste dumped near nullah — Hadapsar",
    description: "Bags of what appears to be biomedical waste left near the nullah. Strong smell, red bags visible.",
    language: "en",
    location: loc(-0.05, 0.1, "Hadapsar Nullah", "Hadapsar"),
    publicLocation: pubLoc(-0.05, 0.1, "Hadapsar"),
    photoUrls: [], reporterId: "demo_user_09", reporterAnonymous: true,
    aiAnalysis: { category: "illegal_dumping", severity: "high", reason: "Suspected biomedical waste in red bags near water body.", suggestedDepartment: "pollution_control", healthRisk: "Pathogen exposure. Needle-stick and biohazard risk.", environmentalRisk: "Nullah contamination affecting downstream areas.", confidence: 0.79, isDemo: true },
    environmentalContext: null, department: "unassigned",
    statusHistory: [{ status: "reported", timestamp: now - 30 * 60 * 1000 }],
    supportCount: 18, commentCount: 4, isDemo: true, resolutionVerified: false, createdAt: now - 30 * 60 * 1000, updatedAt: now - 30 * 60 * 1000,
  },
  {
    id: "demo_010", category: "blocked_drain", severity: "high", status: "verified",
    title: "Flooded underpass — Sangam Bridge",
    description: "Underpass flooded knee-deep due to blocked drainage. Vehicles stranded. Traffic diverted.",
    language: "en",
    location: loc(0.015, -0.025, "Sangam Bridge Underpass", "Deccan"),
    publicLocation: pubLoc(0.015, -0.025, "Deccan"),
    photoUrls: [], reporterId: "demo_user_10", reporterAnonymous: false,
    aiAnalysis: { category: "blocked_drain", severity: "high", reason: "Severe underpass flooding from blocked drainage system.", suggestedDepartment: "public_works", healthRisk: "Vehicle stranding, possible drowning risk.", environmentalRisk: "Urban flooding damage to infrastructure.", confidence: 0.92, isDemo: true },
    environmentalContext: null, department: "public_works",
    statusHistory: [
      { status: "reported", timestamp: now - 4 * h },
      { status: "triaged", timestamp: now - 3.5 * h },
      { status: "verified", timestamp: now - 3 * h, note: "Traffic police informed" },
    ],
    supportCount: 32, commentCount: 9, isDemo: true, resolutionVerified: false, createdAt: now - 4 * h, updatedAt: now - 3 * h,
  },
  {
    id: "demo_011", category: "sewage_leak", severity: "medium", status: "assigned",
    title: "Leaking pipe — Camp area",
    description: "Underground pipe burst causing sewage to mix with potable water supply.",
    language: "en",
    location: loc(-0.01, 0.04, "Camp MG Road", "Camp"),
    publicLocation: pubLoc(-0.01, 0.04, "Camp"),
    photoUrls: [], reporterId: "demo_user_11", reporterAnonymous: false,
    aiAnalysis: { category: "sewage_leak", severity: "medium", reason: "Pipe burst causing cross-contamination of water supply.", suggestedDepartment: "water_sewage", healthRisk: "Contaminated drinking water risk. Gastroenteritis.", environmentalRisk: "Soil saturation, road damage.", confidence: 0.81, isDemo: true },
    environmentalContext: null, department: "water_sewage",
    statusHistory: [
      { status: "reported", timestamp: now - 7 * h },
      { status: "triaged", timestamp: now - 6 * h },
      { status: "assigned", timestamp: now - 5 * h },
    ],
    supportCount: 8, commentCount: 2, isDemo: true, resolutionVerified: false, createdAt: now - 7 * h, updatedAt: now - 5 * h,
  },
  {
    id: "demo_012", category: "smoke", severity: "medium", status: "reported",
    title: "Bonfire on riverbank — Mula River",
    description: "Group burning large amounts of waste on Mula riverbank. Smoke drifting into residential colony.",
    language: "en",
    location: loc(0.03, -0.08, "Mula River Ghats", "Aundh"),
    publicLocation: pubLoc(0.03, -0.08, "Aundh"),
    photoUrls: [], reporterId: "demo_user_12", reporterAnonymous: true,
    aiAnalysis: { category: "smoke", severity: "medium", reason: "Open waste burning on riverbank. Ash falling into water.", suggestedDepartment: "pollution_control", healthRisk: "Smoke inhalation from mixed waste burning.", environmentalRisk: "River water ash contamination.", confidence: 0.73, isDemo: true },
    environmentalContext: null, department: "unassigned",
    statusHistory: [{ status: "reported", timestamp: now - 90 * 60 * 1000 }],
    supportCount: 7, commentCount: 1, isDemo: true, resolutionVerified: false, createdAt: now - 90 * 60 * 1000, updatedAt: now - 90 * 60 * 1000,
  },
  {
    id: "demo_013", category: "litter", severity: "low", status: "triaged",
    title: "Festival waste not cleared — Shaniwar Wada",
    description: "Post-festival plastic and food waste still on ground 2 days after event. Tourist area.",
    language: "en",
    location: loc(0.005, -0.005, "Shaniwar Wada", "Kasba"),
    publicLocation: pubLoc(0.005, -0.005, "Kasba"),
    photoUrls: [], reporterId: "demo_user_13", reporterAnonymous: false,
    aiAnalysis: { category: "litter", severity: "low", reason: "Post-event festival waste in heritage area.", suggestedDepartment: "sanitation", healthRisk: "Rodent and insect attraction.", environmentalRisk: "Plastic waste in historic environment.", confidence: 0.97, isDemo: true },
    environmentalContext: null, department: "sanitation",
    statusHistory: [
      { status: "reported", timestamp: now - 1.5 * d },
      { status: "triaged", timestamp: now - 1.2 * d },
    ],
    supportCount: 5, commentCount: 0, isDemo: true, resolutionVerified: false, createdAt: now - 1.5 * d, updatedAt: now - 1.2 * d,
  },
  {
    id: "demo_014", category: "construction_dust", severity: "high", status: "assigned",
    title: "Metro construction dust cloud — JM Road",
    description: "Metro pillar construction without dust enclosure. Entire road engulfed in fine white dust.",
    language: "en",
    location: loc(0.008, -0.012, "JM Road Metro Site", "Deccan Gymkhana"),
    publicLocation: pubLoc(0.008, -0.012, "Deccan Gymkhana"),
    photoUrls: [], reporterId: "demo_user_14", reporterAnonymous: false,
    aiAnalysis: { category: "construction_dust", severity: "high", reason: "Large construction site without required dust barriers and water suppression.", suggestedDepartment: "pollution_control", healthRisk: "Acute PM10 and silica inhalation. COPD aggravation.", environmentalRisk: "Urban PM10 spike. Visibility reduction.", confidence: 0.89, isDemo: true },
    environmentalContext: null, department: "pollution_control",
    statusHistory: [
      { status: "reported", timestamp: now - 3 * d },
      { status: "triaged", timestamp: now - 2.8 * d },
      { status: "assigned", timestamp: now - 2.5 * d },
    ],
    supportCount: 44, commentCount: 12, isDemo: true, resolutionVerified: false, createdAt: now - 3 * d, updatedAt: now - 2.5 * d,
  },
  {
    id: "demo_015", category: "garbage_burning", severity: "critical", status: "assigned",
    title: "Tyre burning near scrapyard — Bhosari",
    description: "Rubber tyres being openly burned at informal scrapyard. Thick black toxic smoke.",
    language: "en",
    location: loc(0.22, -0.05, "Bhosari MIDC Scrapyard", "Bhosari"),
    publicLocation: pubLoc(0.22, -0.05, "Bhosari"),
    photoUrls: [], reporterId: "demo_user_15", reporterAnonymous: false,
    aiAnalysis: { category: "garbage_burning", severity: "critical", reason: "Tyre combustion produces carcinogenic PAHs, dioxins, and heavy metal particles.", suggestedDepartment: "pollution_control", healthRisk: "Severe respiratory and carcinogenic risk from tyre pyrolysis smoke.", environmentalRisk: "Persistent organic pollutant release. Long-range air transport.", confidence: 0.96, isDemo: true },
    environmentalContext: { id: "env_015", reportId: "demo_015", lat: BASE_LAT + 0.22, lng: BASE_LNG - 0.05, timestamp: now - 2 * h, aqi: 241, pm25: 118.2, pm10: 198.4, no2: 67.3, temperature: 33, windSpeed: 3, windDirection: 45, humidity: 55, weatherCode: 0, isDemo: true },
    department: "pollution_control",
    statusHistory: [
      { status: "reported", timestamp: now - 3 * h },
      { status: "triaged", timestamp: now - 2.5 * h, note: "Critical — escalated" },
      { status: "assigned", timestamp: now - 2 * h, note: "Police and Pollution Control Board notified" },
    ],
    supportCount: 38, commentCount: 14, isDemo: true, resolutionVerified: false, createdAt: now - 3 * h, updatedAt: now - 2 * h,
  },
  {
    id: "demo_016", category: "sewage_leak", severity: "high", status: "reported",
    title: "Untreated sewage into Pavana river",
    description: "Pipe directly discharging dark effluent into Pavana river. Witnessed three times this week.",
    language: "en",
    location: loc(0.18, -0.12, "Pavana River near Nigdi", "Nigdi"),
    publicLocation: pubLoc(0.18, -0.12, "Nigdi"),
    photoUrls: [], reporterId: "demo_user_16", reporterAnonymous: false,
    aiAnalysis: { category: "sewage_leak", severity: "high", reason: "Direct untreated sewage discharge into protected river.", suggestedDepartment: "water_sewage", healthRisk: "Downstream drinking water contamination risk.", environmentalRisk: "Aquatic biodiversity loss, BOD spike.", confidence: 0.88, isDemo: true },
    environmentalContext: null, department: "unassigned",
    statusHistory: [{ status: "reported", timestamp: now - 45 * 60 * 1000 }],
    supportCount: 15, commentCount: 3, isDemo: true, resolutionVerified: false, createdAt: now - 45 * 60 * 1000, updatedAt: now - 45 * 60 * 1000,
  },
  {
    id: "demo_017", category: "smoke", severity: "low", status: "resolved",
    title: "Vehicle exhaust from auto-rickshaws — Swargate",
    description: "Multiple CNG autos idling and producing blue smoke. Possible engine issue.",
    language: "en",
    location: loc(-0.025, 0.015, "Swargate Bus Stand", "Swargate"),
    publicLocation: pubLoc(-0.025, 0.015, "Swargate"),
    photoUrls: [], afterPhotoUrls: [], reporterId: "demo_user_17", reporterAnonymous: false,
    aiAnalysis: { category: "smoke", severity: "low", reason: "Vehicle exhaust from misfiring CNG autos.", suggestedDepartment: "pollution_control", healthRisk: "Localised hydrocarbon and CO exposure.", environmentalRisk: "Carbon monoxide contribution to urban ambient air.", confidence: 0.68, isDemo: true },
    environmentalContext: null, department: "pollution_control",
    statusHistory: [
      { status: "reported", timestamp: now - 2 * d },
      { status: "triaged", timestamp: now - 1.9 * d },
      { status: "assigned", timestamp: now - 1.7 * d },
      { status: "resolved", timestamp: now - 1 * d, note: "RTO inspection done. 4 vehicles removed from service.", operatorName: "Traffic Police Division" },
    ],
    resolutionNote: "RTO inspection team visited. 4 vehicles with excessive emissions taken off road.",
    resolutionVerified: true, supportCount: 2, commentCount: 0, isDemo: true, createdAt: now - 2 * d, updatedAt: now - 1 * d,
  },
  {
    id: "demo_018", category: "illegal_dumping", severity: "medium", status: "reported",
    title: "E-waste dumped near school — Kharadi",
    description: "Old monitors, circuit boards, and cables dumped in open lot adjacent to primary school.",
    language: "en",
    location: loc(0.06, 0.15, "Kharadi Primary School Road", "Kharadi"),
    publicLocation: pubLoc(0.06, 0.15, "Kharadi"),
    photoUrls: [], reporterId: "demo_user_18", reporterAnonymous: false,
    aiAnalysis: { category: "illegal_dumping", severity: "medium", reason: "Electronic waste with heavy metals dumped near children's institution.", suggestedDepartment: "pollution_control", healthRisk: "Lead, mercury, and cadmium exposure risk for children.", environmentalRisk: "Heavy metal soil contamination.", confidence: 0.85, isDemo: true },
    environmentalContext: null, department: "unassigned",
    statusHistory: [{ status: "reported", timestamp: now - 5 * h }],
    supportCount: 22, commentCount: 6, isDemo: true, resolutionVerified: false, createdAt: now - 5 * h, updatedAt: now - 5 * h,
  },
  {
    id: "demo_019", category: "blocked_drain", severity: "medium", status: "triaged",
    title: "Nullah blocked by plastic waste — Wanowrie",
    description: "Nullah completely choked with plastic bags, styrofoam, and construction debris.",
    language: "en",
    location: loc(-0.07, 0.08, "Wanowrie Nullah", "Wanowrie"),
    publicLocation: pubLoc(-0.07, 0.08, "Wanowrie"),
    photoUrls: [], reporterId: "demo_user_19", reporterAnonymous: false,
    aiAnalysis: { category: "blocked_drain", severity: "medium", reason: "Nullah choked with plastic. Pre-monsoon flood risk.", suggestedDepartment: "public_works", healthRisk: "Stagnant water dengue risk.", environmentalRisk: "Microplastic contamination downstream.", confidence: 0.91, isDemo: true },
    environmentalContext: null, department: "public_works",
    statusHistory: [
      { status: "reported", timestamp: now - 6 * h },
      { status: "triaged", timestamp: now - 4 * h },
    ],
    supportCount: 11, commentCount: 3, isDemo: true, resolutionVerified: false, createdAt: now - 6 * h, updatedAt: now - 4 * h,
  },
  {
    id: "demo_020", category: "construction_dust", severity: "medium", status: "reported",
    title: "Quarry blasting dust — Katraj",
    description: "Stone quarry near highway doing daytime blasting without dust mitigation. Homes covered in fine dust.",
    language: "en",
    location: loc(-0.1, -0.06, "Katraj Quarry Road", "Katraj"),
    publicLocation: pubLoc(-0.1, -0.06, "Katraj"),
    photoUrls: [], reporterId: "demo_user_20", reporterAnonymous: false,
    aiAnalysis: { category: "construction_dust", severity: "medium", reason: "Quarry blasting creating large silica dust clouds over residential areas.", suggestedDepartment: "pollution_control", healthRisk: "Silicosis risk from repeated exposure. Acute respiratory irritation.", environmentalRisk: "Land degradation, habitat loss.", confidence: 0.82, isDemo: true },
    environmentalContext: null, department: "unassigned",
    statusHistory: [{ status: "reported", timestamp: now - 4 * h }],
    supportCount: 8, commentCount: 1, isDemo: true, resolutionVerified: false, createdAt: now - 4 * h, updatedAt: now - 4 * h,
  },
];

export const DEMO_REPORTS: Report[] = RAW_REPORTS.map((r) => ({
  ...r,
  evidenceScore: computeEvidenceScore(
    r,
    Math.floor(Math.random() * 4),
    r.environmentalContext?.aqi
      ? Math.max(0, Math.min(20, Math.round((r.environmentalContext.aqi - 100) / 10)))
      : 0
  ),
}));

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
