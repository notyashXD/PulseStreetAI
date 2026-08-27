import { z } from "zod";

export const IssueCategorySchema = z.enum([
  "garbage_burning",
  "illegal_dumping",
  "smoke",
  "sewage_leak",
  "construction_dust",
  "blocked_drain",
  "litter",
  "other",
]);
export type IssueCategory = z.infer<typeof IssueCategorySchema>;

export const SeveritySchema = z.enum(["low", "medium", "high", "critical"]);
export type Severity = z.infer<typeof SeveritySchema>;

export const ReportStatusSchema = z.enum([
  "reported",
  "triaged",
  "verified",
  "assigned",
  "resolved",
  "rejected",
]);
export type ReportStatus = z.infer<typeof ReportStatusSchema>;

export const DepartmentSchema = z.enum([
  "sanitation",
  "pollution_control",
  "public_works",
  "water_sewage",
  "unassigned",
]);
export type Department = z.infer<typeof DepartmentSchema>;

export const UserRoleSchema = z.enum(["resident", "operator"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const ScoreBreakdownSchema = z.object({
  aiConfidence: z.number().min(0).max(40),
  nearbyCorroboration: z.number().min(0).max(25),
  environmentalAnomaly: z.number().min(0).max(20),
  recency: z.number().min(0).max(10),
  citizenCorroboration: z.number().min(0).max(5),
  total: z.number().min(0).max(100),
  label: z.enum(["low", "moderate", "high", "very_high"]),
});
export type ScoreBreakdown = z.infer<typeof ScoreBreakdownSchema>;

export const EnvironmentalSnapshotSchema = z.object({
  id: z.string(),
  reportId: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  timestamp: z.number(),
  aqi: z.number().nullable(),
  pm25: z.number().nullable(),
  pm10: z.number().nullable(),
  no2: z.number().nullable(),
  temperature: z.number().nullable(),
  windSpeed: z.number().nullable(),
  windDirection: z.number().nullable(),
  humidity: z.number().nullable(),
  weatherCode: z.number().nullable(),
  isDemo: z.boolean().default(false),
});
export type EnvironmentalSnapshot = z.infer<typeof EnvironmentalSnapshotSchema>;

export const AIAnalysisSchema = z.object({
  category: IssueCategorySchema,
  severity: SeveritySchema,
  reason: z.string(),
  suggestedDepartment: DepartmentSchema,
  healthRisk: z.string(),
  environmentalRisk: z.string(),
  confidence: z.number().min(0).max(1),
  isDemo: z.boolean().default(false),
});
export type AIAnalysis = z.infer<typeof AIAnalysisSchema>;

export const LocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  address: z.string().optional(),
  landmark: z.string().optional(),
  ward: z.string().optional(),
});
export type Location = z.infer<typeof LocationSchema>;

export const StatusHistoryEntrySchema = z.object({
  status: ReportStatusSchema,
  timestamp: z.number(),
  note: z.string().optional(),
  operatorId: z.string().optional(),
  operatorName: z.string().optional(),
});
export type StatusHistoryEntry = z.infer<typeof StatusHistoryEntrySchema>;

export const ReportSchema = z.object({
  id: z.string(),
  category: IssueCategorySchema,
  severity: SeveritySchema,
  status: ReportStatusSchema,
  title: z.string(),
  description: z.string(),
  language: z.enum(["en", "hi"]).default("en"),
  location: LocationSchema,
  publicLocation: LocationSchema,
  photoUrls: z.array(z.string()),
  afterPhotoUrls: z.array(z.string()).optional(),
  voiceNoteUrl: z.string().optional(),
  reporterId: z.string().optional(),
  reporterAnonymous: z.boolean().default(false),
  aiAnalysis: AIAnalysisSchema.nullable(),
  evidenceScore: ScoreBreakdownSchema.nullable(),
  environmentalContext: EnvironmentalSnapshotSchema.nullable(),
  department: DepartmentSchema.default("unassigned"),
  assignedTo: z.string().optional(),
  operatorNotes: z.string().optional(),
  statusHistory: z.array(StatusHistoryEntrySchema),
  supportCount: z.number().default(0),
  commentCount: z.number().default(0),
  hotspotClusterId: z.string().optional(),
  isDemo: z.boolean().default(false),
  resolvedAt: z.union([z.number(), z.string()]).optional(),
  resolutionNote: z.string().optional(),
  resolutionVerified: z.boolean().default(false),
  createdAt: z.number(),
  updatedAt: z.number(),
});
export type Report = z.infer<typeof ReportSchema>;

export const CommentSchema = z.object({
  id: z.string(),
  reportId: z.string(),
  userId: z.string().optional(),
  displayName: z.string().default("Anonymous"),
  text: z.string().max(500),
  isOperator: z.boolean().default(false),
  isModerated: z.boolean().default(false),
  createdAt: z.number(),
});
export type Comment = z.infer<typeof CommentSchema>;

export const AssignmentSchema = z.object({
  id: z.string(),
  reportId: z.string(),
  department: DepartmentSchema,
  assignedBy: z.string(),
  assignedTo: z.string().optional(),
  note: z.string().optional(),
  createdAt: z.number(),
});
export type Assignment = z.infer<typeof AssignmentSchema>;

export const HotspotClusterSchema = z.object({
  id: z.string(),
  category: IssueCategorySchema,
  reportIds: z.array(z.string()),
  centroidLat: z.number(),
  centroidLng: z.number(),
  radius: z.number(),
  severity: SeveritySchema,
  reportCount: z.number(),
  isActive: z.boolean().default(true),
  createdAt: z.number(),
  updatedAt: z.number(),
  isDemo: z.boolean().default(false),
});
export type HotspotCluster = z.infer<typeof HotspotClusterSchema>;

export const AuditLogSchema = z.object({
  id: z.string(),
  reportId: z.string(),
  action: z.string(),
  operatorId: z.string(),
  before: z.record(z.string(), z.unknown()).optional(),
  after: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.number(),
});
export type AuditLog = z.infer<typeof AuditLogSchema>;

export const AQIDataSchema = z.object({
  aqi: z.number(),
  pm25: z.number(),
  pm10: z.number(),
  no2: z.number(),
  o3: z.number().optional(),
  category: z.enum(["Good", "Moderate", "Unhealthy for Sensitive", "Unhealthy", "Very Unhealthy", "Hazardous"]),
  fetchedAt: z.string(),
});
export type AQIData = z.infer<typeof AQIDataSchema>;

export const WeatherDataSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  windDirection: z.number(),
  weatherCode: z.number(),
  description: z.string(),
  fetchedAt: z.string(),
});
export type WeatherData = z.infer<typeof WeatherDataSchema>;

export const UserProfileSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string().email().optional(),
  role: UserRoleSchema,
  ward: z.string().optional(),
  createdAt: z.number(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const AQITrendPointSchema = z.object({
  time: z.string(),
  aqi: z.number(),
  pm25: z.number(),
});
export type AQITrendPoint = z.infer<typeof AQITrendPointSchema>;

export const OutdoorGuidanceLevelSchema = z.enum(["good", "caution", "avoid"]);
export type OutdoorGuidanceLevel = z.infer<typeof OutdoorGuidanceLevelSchema>;

export const ReportFormStep1Schema = z.object({
  category: IssueCategorySchema,
  description: z.string().min(10, "Please describe the issue in at least 10 characters"),
  language: z.enum(["en", "hi"]).default("en"),
});
export type ReportFormStep1 = z.infer<typeof ReportFormStep1Schema>;

export const ReportFormStep2Schema = z.object({
  lat: z.number(),
  lng: z.number(),
  landmark: z.string().optional(),
  ward: z.string().optional(),
});
export type ReportFormStep2 = z.infer<typeof ReportFormStep2Schema>;

export const ResolutionVerificationSchema = z.object({
  likelyResolved: z.boolean(),
  confidence: z.number().min(0).max(1),
  reason: z.string(),
  isDemo: z.boolean().default(false),
});
export type ResolutionVerification = z.infer<typeof ResolutionVerificationSchema>;

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  garbage_burning: "Garbage Burning",
  illegal_dumping: "Illegal Dumping",
  smoke: "Smoke & Haze",
  sewage_leak: "Sewage Leak",
  construction_dust: "Construction Dust",
  blocked_drain: "Blocked Drain",
  litter: "Litter",
  other: "Other Hazard",
};

export const CATEGORY_LABELS_HI: Record<IssueCategory, string> = {
  garbage_burning: "कचरा जलाना",
  illegal_dumping: "अवैध डंपिंग",
  smoke: "धुआँ और प्रदूषण",
  sewage_leak: "सीवेज रिसाव",
  construction_dust: "निर्माण धूल",
  blocked_drain: "अवरुद्ध नाली",
  litter: "कूड़ा",
  other: "अन्य समस्या",
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const STATUS_LABELS: Record<ReportStatus, string> = {
  reported: "Reported",
  triaged: "Triaged",
  verified: "Verified",
  assigned: "Assigned",
  resolved: "Resolved",
  rejected: "Rejected",
};

export const DEPARTMENT_LABELS: Record<Department, string> = {
  sanitation: "Sanitation & Waste Management",
  pollution_control: "State Pollution Control Board",
  public_works: "Public Works Department",
  water_sewage: "Water Supply & Drainage",
  unassigned: "Unassigned Queue",
};
