export interface RemediationPair {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  statusText: string;
}

export const CATEGORY_REMEDIATION_PAIRS: Record<string, RemediationPair> = {
  garbage_burning: {
    before: "/images/remediation/garbage_burning_before.jpg",
    after: "/images/remediation/garbage_burning_after.jpg",
    beforeLabel: "BEFORE: Active Waste Fire",
    afterLabel: "AFTER: Extinguished & Ground Cleared",
    statusText: "Waste fire extinguished · 0 residual smoke · Ground swept clean",
  },
  illegal_dumping: {
    before: "/images/remediation/illegal_dumping_before.jpg",
    after: "/images/remediation/illegal_dumping_after.jpg",
    beforeLabel: "BEFORE: Unauthorized Debris Dump",
    afterLabel: "AFTER: Debris Removed & Curb Sanitized",
    statusText: "Debris removed · Roadway & sidewalk fully cleared",
  },
  sewage_leak: {
    before: "/images/remediation/sewage_leak_before.jpg",
    after: "/images/remediation/sewage_leak_after.jpg",
    beforeLabel: "BEFORE: Raw Sewage Overflow",
    afterLabel: "AFTER: Pipe Repaired & Road Sanitized",
    statusText: "Manhole sealed · Sludge vacuumed · Surface disinfected & dry",
  },
  blocked_drain: {
    before: "/images/remediation/blocked_drain_before.jpg",
    after: "/images/remediation/blocked_drain_after.jpg",
    beforeLabel: "BEFORE: Clogged Stormwater Drain",
    afterLabel: "AFTER: Desilted & Free-Flowing Drain",
    statusText: "Drain desilted · Plastic waste cleared · Free flow restored",
  },
  construction_dust: {
    before: "/images/remediation/construction_dust_before.jpg",
    after: "/images/remediation/construction_dust_after.jpg",
    beforeLabel: "BEFORE: Heavy Fugitive Dust",
    afterLabel: "AFTER: Water-Suppressed Clean Street",
    statusText: "Sprinklers deployed · Particulates settled · Clean paved road",
  },
  litter: {
    before: "/images/remediation/litter_before.jpg",
    after: "/images/remediation/litter_after.jpg",
    beforeLabel: "BEFORE: Scattered Litter & Plastics",
    afterLabel: "AFTER: Swept Pathway & Clean Area",
    statusText: "Sidewalk swept · Waste collected · Bins installed",
  },
  smoke: {
    before: "/images/remediation/garbage_burning_before.jpg",
    after: "/images/remediation/garbage_burning_after.jpg",
    beforeLabel: "BEFORE: Dense Smoke Plume",
    afterLabel: "AFTER: Combustion Halted & Clear Sky",
    statusText: "Source extinguished · Smoke dispersed · Air quality normalized",
  },
  other: {
    before: "/images/remediation/illegal_dumping_before.jpg",
    after: "/images/remediation/illegal_dumping_after.jpg",
    beforeLabel: "BEFORE: Active Hazard Evidence",
    afterLabel: "AFTER: Remediated & Restored Site",
    statusText: "Municipal remediation completed · Site fully restored",
  },
};
