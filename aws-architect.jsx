import { useState, useRef, useCallback, useEffect } from "react";

// ── AWS Official-style SVG Icons ──────────────────────────────────────────────
// Each icon renders as an <svg> matching AWS Architecture Icon visual style:
// square rounded bg in category color + white service symbol inside.
// Paths are simplified faithful reproductions of the AWS icon set shapes.

const AWS_ICON_SVG = {
  // ── Compute ──
  ec2: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="18" y="18" width="44" height="44" rx="4" fill="none" stroke="white" stroke-width="3"/>
    <rect x="26" y="26" width="28" height="28" rx="2" fill="white" opacity="0.9"/>
    <line x1="18" y1="30" x2="12" y2="30" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="18" y1="40" x2="12" y2="40" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="18" y1="50" x2="12" y2="50" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="62" y1="30" x2="68" y2="30" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="62" y1="40" x2="68" y2="40" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="62" y1="50" x2="68" y2="50" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="30" y1="18" x2="30" y2="12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="40" y1="18" x2="40" y2="12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="50" y1="18" x2="50" y2="12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="30" y1="62" x2="30" y2="68" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="40" y1="62" x2="40" y2="68" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="50" y1="62" x2="50" y2="68" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
  lambda: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <path d="M24 60 L34 36 L40 48 L46 36 L56 60" fill="none" stroke="white" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M24 20 L32 20 L40 36" fill="none" stroke="white" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`,
  ecs: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="15" y="22" width="50" height="12" rx="3" fill="white" opacity="0.9"/>
    <rect x="15" y="38" width="50" height="12" rx="3" fill="white" opacity="0.6"/>
    <rect x="15" y="54" width="50" height="8" rx="3" fill="white" opacity="0.4"/>
    <circle cx="23" cy="28" r="3" fill="${c}"/>
    <circle cx="23" cy="44" r="3" fill="${c}"/>
  </svg>`,
  elasticbeanstalk: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <ellipse cx="40" cy="32" rx="20" ry="10" fill="none" stroke="white" stroke-width="3"/>
    <line x1="20" y1="32" x2="20" y2="48" stroke="white" stroke-width="3"/>
    <line x1="60" y1="32" x2="60" y2="48" stroke="white" stroke-width="3"/>
    <ellipse cx="40" cy="48" rx="20" ry="10" fill="white" opacity="0.2"/>
    <ellipse cx="40" cy="48" rx="20" ry="10" fill="none" stroke="white" stroke-width="3"/>
  </svg>`,
  eks: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <polygon points="40,14 60,26 60,50 40,62 20,50 20,26" fill="none" stroke="white" stroke-width="3"/>
    <circle cx="40" cy="38" r="8" fill="white" opacity="0.9"/>
    <line x1="40" y1="14" x2="40" y2="30" stroke="white" stroke-width="2"/>
    <line x1="60" y1="26" x2="48" y2="33" stroke="white" stroke-width="2"/>
    <line x1="60" y1="50" x2="48" y2="43" stroke="white" stroke-width="2"/>
    <line x1="40" y1="62" x2="40" y2="46" stroke="white" stroke-width="2"/>
    <line x1="20" y1="50" x2="32" y2="43" stroke="white" stroke-width="2"/>
    <line x1="20" y1="26" x2="32" y2="33" stroke="white" stroke-width="2"/>
  </svg>`,
  lightsail: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="38" r="18" fill="none" stroke="white" stroke-width="3"/>
    <path d="M40 20 L40 56 M22 38 L58 38 M26 26 L54 50 M54 26 L26 50" stroke="white" stroke-width="1.5" opacity="0.6"/>
    <circle cx="40" cy="38" r="6" fill="white"/>
  </svg>`,
  // ── Storage ──
  s3: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <ellipse cx="40" cy="26" rx="20" ry="8" fill="white" opacity="0.9"/>
    <line x1="20" y1="26" x2="20" y2="54" stroke="white" stroke-width="3"/>
    <line x1="60" y1="26" x2="60" y2="54" stroke="white" stroke-width="3"/>
    <ellipse cx="40" cy="40" rx="20" ry="8" fill="none" stroke="white" stroke-width="2.5" stroke-dasharray="0"/>
    <ellipse cx="40" cy="54" rx="20" ry="8" fill="white" opacity="0.2"/>
    <ellipse cx="40" cy="54" rx="20" ry="8" fill="none" stroke="white" stroke-width="2.5"/>
  </svg>`,
  ebs: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="18" y="24" width="44" height="32" rx="4" fill="none" stroke="white" stroke-width="3"/>
    <line x1="18" y1="36" x2="62" y2="36" stroke="white" stroke-width="2" opacity="0.6"/>
    <line x1="18" y1="44" x2="62" y2="44" stroke="white" stroke-width="2" opacity="0.6"/>
    <circle cx="26" cy="30" r="2.5" fill="white"/>
    <circle cx="34" cy="30" r="2.5" fill="white" opacity="0.7"/>
    <rect x="24" y="38" width="32" height="4" rx="1" fill="white" opacity="0.5"/>
    <rect x="24" y="46" width="20" height="4" rx="1" fill="white" opacity="0.5"/>
  </svg>`,
  efs: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="14" y="20" width="52" height="40" rx="4" fill="none" stroke="white" stroke-width="3"/>
    <line x1="14" y1="32" x2="66" y2="32" stroke="white" stroke-width="2" opacity="0.5"/>
    <line x1="14" y1="44" x2="66" y2="44" stroke="white" stroke-width="2" opacity="0.5"/>
    <line x1="32" y1="20" x2="32" y2="60" stroke="white" stroke-width="2" opacity="0.5"/>
    <circle cx="23" cy="26" r="2.5" fill="white"/>
    <circle cx="23" cy="38" r="2.5" fill="white"/>
    <circle cx="23" cy="50" r="2.5" fill="white"/>
  </svg>`,
  glacier: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <polygon points="40,16 62,58 18,58" fill="none" stroke="white" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="40,28 54,52 26,52" fill="white" opacity="0.25"/>
    <line x1="40" y1="28" x2="40" y2="48" stroke="white" stroke-width="2" opacity="0.7"/>
    <line x1="32" y1="40" x2="48" y2="40" stroke="white" stroke-width="2" opacity="0.7"/>
  </svg>`,
  fsx: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="16" y="22" width="48" height="36" rx="4" fill="none" stroke="white" stroke-width="3"/>
    <path d="M16 34 L64 34" stroke="white" stroke-width="2" opacity="0.5"/>
    <text x="40" y="52" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Arial">FSx</text>
  </svg>`,
  ecr: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="18" y="18" width="44" height="44" rx="8" fill="none" stroke="white" stroke-width="2.5"/>
    <rect x="26" y="26" width="28" height="28" rx="5" fill="white" opacity="0.15"/>
    <path d="M28 40 C28 33 32 28 40 28 C48 28 52 33 52 40 C52 47 48 52 40 52 C32 52 28 47 28 40 Z" fill="none" stroke="white" stroke-width="2"/>
    <path d="M34 40 L38 44 L46 36" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <line x1="40" y1="18" x2="40" y2="24" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="40" y1="56" x2="40" y2="62" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="18" y1="40" x2="24" y2="40" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="56" y1="40" x2="62" y2="40" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
  acm: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <path d="M40 14 L58 22 L58 44 C58 54 40 66 40 66 C40 66 22 54 22 44 L22 22 Z" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M40 22 L52 28 L52 44 C52 51 40 59 40 59 C40 59 28 51 28 44 L28 28 Z" fill="white" opacity="0.15"/>
    <circle cx="40" cy="36" r="7" fill="none" stroke="white" stroke-width="2"/>
    <path d="M36 36 L40 40 L46 32" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,
  // ── Database ──
  rds: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <ellipse cx="40" cy="24" rx="20" ry="7" fill="white" opacity="0.9"/>
    <rect x="20" y="24" width="40" height="28" fill="${c}"/>
    <line x1="20" y1="24" x2="20" y2="52" stroke="white" stroke-width="2.5"/>
    <line x1="60" y1="24" x2="60" y2="52" stroke="white" stroke-width="2.5"/>
    <ellipse cx="40" cy="36" rx="20" ry="7" fill="none" stroke="white" stroke-width="2.5"/>
    <ellipse cx="40" cy="52" rx="20" ry="7" fill="white" opacity="0.2"/>
    <ellipse cx="40" cy="52" rx="20" ry="7" fill="none" stroke="white" stroke-width="2.5"/>
  </svg>`,
  aurora: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <ellipse cx="40" cy="24" rx="20" ry="7" fill="white" opacity="0.9"/>
    <rect x="20" y="24" width="40" height="28" fill="${c}"/>
    <line x1="20" y1="24" x2="20" y2="52" stroke="white" stroke-width="2.5"/>
    <line x1="60" y1="24" x2="60" y2="52" stroke="white" stroke-width="2.5"/>
    <ellipse cx="40" cy="36" rx="20" ry="7" fill="none" stroke="white" stroke-width="2.5"/>
    <ellipse cx="40" cy="52" rx="20" ry="7" fill="white" opacity="0.2"/>
    <ellipse cx="40" cy="52" rx="20" ry="7" fill="none" stroke="white" stroke-width="2.5"/>
    <path d="M32 38 L38 32 L44 38 L40 38 L40 46 L36 46 L36 38 Z" fill="white" opacity="0.9"/>
  </svg>`,
  dynamodb: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <ellipse cx="40" cy="22" rx="18" ry="6" fill="white" opacity="0.9"/>
    <line x1="22" y1="22" x2="22" y2="58" stroke="white" stroke-width="2.5"/>
    <line x1="58" y1="22" x2="58" y2="58" stroke="white" stroke-width="2.5"/>
    <ellipse cx="40" cy="58" rx="18" ry="6" fill="white" opacity="0.2"/>
    <ellipse cx="40" cy="58" rx="18" ry="6" fill="none" stroke="white" stroke-width="2.5"/>
    <ellipse cx="40" cy="36" rx="18" ry="6" fill="none" stroke="white" stroke-width="2"/>
    <ellipse cx="40" cy="47" rx="18" ry="6" fill="none" stroke="white" stroke-width="2"/>
    <path d="M40 15 L40 65 M30 18 L50 18" stroke="white" stroke-width="0" opacity="0"/>
  </svg>`,
  elasticache: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="40" r="22" fill="none" stroke="white" stroke-width="3"/>
    <path d="M28 40 L36 32 L44 40 L52 32" fill="none" stroke="white" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M28 48 L36 40 L44 48 L52 40" fill="none" stroke="white" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`,
  // ── Network ──
  vpc: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="12" y="16" width="56" height="48" rx="4" fill="none" stroke="white" stroke-width="3" stroke-dasharray="6 3"/>
    <rect x="20" y="24" width="18" height="14" rx="3" fill="white" opacity="0.7"/>
    <rect x="42" y="24" width="18" height="14" rx="3" fill="white" opacity="0.7"/>
    <rect x="20" y="44" width="18" height="12" rx="3" fill="white" opacity="0.4"/>
    <rect x="42" y="44" width="18" height="12" rx="3" fill="white" opacity="0.4"/>
  </svg>`,
  subnet: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="10" y="14" width="60" height="52" rx="4" fill="none" stroke="white" stroke-width="2.5" stroke-dasharray="4 2"/>
    <rect x="18" y="22" width="26" height="36" rx="3" fill="white" opacity="0.35"/>
    <rect x="18" y="22" width="26" height="36" rx="3" fill="none" stroke="white" stroke-width="2"/>
    <rect x="48" y="22" width="16" height="16" rx="3" fill="white" opacity="0.2"/>
    <rect x="48" y="22" width="16" height="16" rx="3" fill="none" stroke="white" stroke-width="2" stroke-dasharray="3 2"/>
    <text x="31" y="44" text-anchor="middle" fill="white" font-size="10" font-weight="bold" font-family="Arial">SUB</text>
  </svg>`,
  securitygroup: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <path d="M40 14 L58 22 L58 42 C58 52 40 66 40 66 C40 66 22 52 22 42 L22 22 Z" fill="none" stroke="white" stroke-width="3" stroke-linejoin="round"/>
    <path d="M40 22 L52 28 L52 42 C52 49 40 58 40 58 C40 58 28 49 28 42 L28 28 Z" fill="white" opacity="0.25"/>
    <path d="M34 40 L38 44 L48 34" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,
  nacl: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="14" y="18" width="52" height="44" rx="4" fill="none" stroke="white" stroke-width="2.5"/>
    <line x1="14" y1="30" x2="66" y2="30" stroke="white" stroke-width="2" opacity="0.6"/>
    <line x1="14" y1="42" x2="66" y2="42" stroke="white" stroke-width="2" opacity="0.6"/>
    <line x1="14" y1="54" x2="66" y2="54" stroke="white" stroke-width="2" opacity="0.6"/>
    <text x="20" y="27" fill="white" font-size="8" font-family="Arial" opacity="0.8">IN</text>
    <text x="20" y="39" fill="white" font-size="8" font-family="Arial" opacity="0.8">OUT</text>
    <path d="M48 24 L56 24 L56 28 L60 24 L56 20 L56 24" fill="white" opacity="0.8"/>
    <path d="M48 36 L56 36 L60 40 L56 44 L56 40 L48 40" fill="white" opacity="0.8"/>
  </svg>`,
  alb: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="22" r="6" fill="white"/>
    <line x1="34" y1="22" x2="24" y2="40" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="46" y1="22" x2="56" y2="40" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="40" y1="28" x2="40" y2="40" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="24" cy="48" r="6" fill="white" opacity="0.9"/>
    <circle cx="40" cy="48" r="6" fill="white" opacity="0.9"/>
    <circle cx="56" cy="48" r="6" fill="white" opacity="0.9"/>
    <rect x="17" y="58" width="14" height="6" rx="2" fill="white" opacity="0.5"/>
    <rect x="33" y="58" width="14" height="6" rx="2" fill="white" opacity="0.5"/>
    <rect x="49" y="58" width="14" height="6" rx="2" fill="white" opacity="0.5"/>
  </svg>`,
  cloudfront: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="40" r="22" fill="none" stroke="white" stroke-width="3"/>
    <ellipse cx="40" cy="40" rx="10" ry="22" fill="none" stroke="white" stroke-width="2"/>
    <line x1="18" y1="40" x2="62" y2="40" stroke="white" stroke-width="2"/>
    <line x1="20" y1="30" x2="60" y2="30" stroke="white" stroke-width="1.5" opacity="0.6"/>
    <line x1="20" y1="50" x2="60" y2="50" stroke="white" stroke-width="1.5" opacity="0.6"/>
  </svg>`,
  apigateway: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="14" y="24" width="52" height="32" rx="4" fill="none" stroke="white" stroke-width="3"/>
    <line x1="32" y1="24" x2="32" y2="56" stroke="white" stroke-width="2" opacity="0.5"/>
    <text x="22" y="44" text-anchor="middle" fill="white" font-size="10" font-weight="bold" font-family="Arial">API</text>
    <text x="50" y="38" text-anchor="middle" fill="white" font-size="8" font-family="Arial">GET</text>
    <text x="50" y="50" text-anchor="middle" fill="white" font-size="8" font-family="Arial">POST</text>
  </svg>`,
  route53: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="40" r="22" fill="none" stroke="white" stroke-width="3"/>
    <circle cx="40" cy="40" r="5" fill="white"/>
    <line x1="40" y1="18" x2="40" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
    <line x1="40" y1="45" x2="40" y2="62" stroke="white" stroke-width="2" opacity="0.7"/>
    <line x1="18" y1="40" x2="35" y2="40" stroke="white" stroke-width="2" opacity="0.7"/>
    <line x1="45" y1="40" x2="62" y2="40" stroke="white" stroke-width="2" opacity="0.7"/>
  </svg>`,
  natgateway: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="16" y="28" width="48" height="24" rx="4" fill="none" stroke="white" stroke-width="3"/>
    <text x="40" y="44" text-anchor="middle" fill="white" font-size="11" font-weight="bold" font-family="Arial">NAT</text>
    <path d="M32 18 L40 28 L48 18" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M32 62 L40 52 L48 62" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
  </svg>`,
  igw: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="40" r="18" fill="none" stroke="white" stroke-width="3"/>
    <line x1="40" y1="14" x2="40" y2="66" stroke="white" stroke-width="2.5"/>
    <path d="M40 14 L52 22 M40 66 L28 58" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="40" cy="40" r="5" fill="white"/>
  </svg>`,
  vpcendpoint: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="26" cy="40" r="10" fill="none" stroke="white" stroke-width="2.5"/>
    <circle cx="54" cy="40" r="10" fill="none" stroke="white" stroke-width="2.5"/>
    <line x1="36" y1="40" x2="44" y2="40" stroke="white" stroke-width="2.5"/>
    <path d="M42 36 L46 40 L42 44" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round"/>
    <text x="26" y="44" text-anchor="middle" fill="white" font-size="8" font-family="Arial">EP</text>
  </svg>`,
  eip: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="36" r="16" fill="none" stroke="white" stroke-width="3"/>
    <circle cx="40" cy="36" r="6" fill="white"/>
    <path d="M28 56 Q40 62 52 56" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="40" y1="52" x2="40" y2="60" stroke="white" stroke-width="2.5"/>
  </svg>`,
  enicard: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="14" y="26" width="52" height="28" rx="4" fill="none" stroke="white" stroke-width="3"/>
    <rect x="22" y="34" width="8" height="12" rx="2" fill="white" opacity="0.8"/>
    <rect x="36" y="34" width="8" height="12" rx="2" fill="white" opacity="0.8"/>
    <rect x="50" y="34" width="8" height="12" rx="2" fill="white" opacity="0.8"/>
  </svg>`,
  transitgateway: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="40" r="10" fill="white" opacity="0.9"/>
    <line x1="18" y1="20" x2="32" y2="34" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="62" y1="20" x2="48" y2="34" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="18" y1="60" x2="32" y2="46" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="62" y1="60" x2="48" y2="46" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="40" y1="14" x2="40" y2="30" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="40" y1="50" x2="40" y2="66" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
  directconnect: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="12" y="30" width="24" height="20" rx="3" fill="none" stroke="white" stroke-width="2.5"/>
    <rect x="44" y="30" width="24" height="20" rx="3" fill="none" stroke="white" stroke-width="2.5"/>
    <line x1="36" y1="40" x2="44" y2="40" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <path d="M42 36 L46 40 L42 44" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <text x="24" y="44" text-anchor="middle" fill="white" font-size="8" font-family="Arial">ON</text>
    <text x="56" y="44" text-anchor="middle" fill="white" font-size="8" font-family="Arial">AWS</text>
  </svg>`,
  vpn: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <path d="M40 16 L56 24 L56 40 C56 50 40 62 40 62 C40 62 24 50 24 40 L24 24 Z" fill="none" stroke="white" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="40" cy="38" r="6" fill="white"/>
    <line x1="40" y1="44" x2="40" y2="52" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <line x1="34" y1="52" x2="46" y2="52" stroke="white" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  networkfirewall: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="14" y="20" width="52" height="40" rx="4" fill="none" stroke="white" stroke-width="2.5"/>
    <line x1="14" y1="32" x2="66" y2="32" stroke="white" stroke-width="2"/>
    <line x1="14" y1="44" x2="66" y2="44" stroke="white" stroke-width="2"/>
    <path d="M28 24 L28 52" stroke="white" stroke-width="2" opacity="0.5"/>
    <path d="M24 26 L28 20 L32 26" fill="white" opacity="0.9"/>
    <path d="M24 50 L28 56 L32 50" fill="white" opacity="0.9"/>
    <circle cx="50" cy="38" r="6" fill="none" stroke="white" stroke-width="2"/>
    <line x1="46" y1="34" x2="54" y2="42" stroke="white" stroke-width="2"/>
  </svg>`,
  // ── Messaging ──
  sqs: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="12" y="28" width="56" height="10" rx="3" fill="white" opacity="0.9"/>
    <rect x="12" y="42" width="56" height="10" rx="3" fill="white" opacity="0.7"/>
    <rect x="12" y="56" width="36" height="10" rx="3" fill="white" opacity="0.5"/>
    <path d="M60 18 L68 14 L68 24 Z" fill="white" opacity="0.8"/>
    <line x1="56" y1="18" x2="56" y2="24" stroke="white" stroke-width="2"/>
  </svg>`,
  sns: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="36" r="10" fill="none" stroke="white" stroke-width="3"/>
    <circle cx="40" cy="36" r="4" fill="white"/>
    <line x1="40" y1="46" x2="30" y2="58" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="40" y1="46" x2="40" y2="60" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="40" y1="46" x2="50" y2="58" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="30" cy="60" r="4" fill="white" opacity="0.8"/>
    <circle cx="40" cy="62" r="4" fill="white" opacity="0.8"/>
    <circle cx="50" cy="60" r="4" fill="white" opacity="0.8"/>
  </svg>`,
  eventbridge: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="14" y="30" width="52" height="20" rx="10" fill="none" stroke="white" stroke-width="3"/>
    <circle cx="26" cy="40" r="6" fill="white" opacity="0.8"/>
    <circle cx="40" cy="40" r="6" fill="white" opacity="0.8"/>
    <circle cx="54" cy="40" r="6" fill="white" opacity="0.8"/>
    <path d="M37 22 L40 16 L43 22" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <line x1="40" y1="16" x2="40" y2="30" stroke="white" stroke-width="2"/>
  </svg>`,
  // ── Security ──
  iam: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="30" r="12" fill="none" stroke="white" stroke-width="3"/>
    <circle cx="40" cy="30" r="5" fill="white"/>
    <path d="M20 62 C20 50 28 44 40 44 C52 44 60 50 60 62" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  cognito: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="28" cy="34" r="8" fill="white" opacity="0.9"/>
    <circle cx="52" cy="34" r="8" fill="white" opacity="0.7"/>
    <path d="M14 60 C14 52 20 46 28 46" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M28 46 C34 46 38 48 40 52" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M52 46 C60 46 66 52 66 60" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M40 52 C42 48 46 46 52 46" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </svg>`,
  waf: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <path d="M40 14 L60 22 L60 44 C60 54 40 68 40 68 C40 68 20 54 20 44 L20 22 Z" fill="none" stroke="white" stroke-width="3" stroke-linejoin="round"/>
    <path d="M40 24 L52 30 L52 44 C52 51 40 60 40 60 C40 60 28 51 28 44 L28 30 Z" fill="white" opacity="0.2"/>
    <text x="40" y="46" text-anchor="middle" fill="white" font-size="12" font-weight="bold" font-family="Arial">WAF</text>
  </svg>`,
  cloudwatch: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="42" r="22" fill="none" stroke="white" stroke-width="3"/>
    <path d="M40 42 L40 26" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <path d="M40 42 L52 34" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="40" cy="42" r="3" fill="white"/>
    <path d="M24 20 L28 24 M56 20 L52 24" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
  </svg>`,
  kms: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="36" cy="34" r="12" fill="none" stroke="white" stroke-width="3"/>
    <circle cx="36" cy="34" r="5" fill="white" opacity="0.8"/>
    <line x1="44" y1="42" x2="62" y2="60" stroke="white" stroke-width="4" stroke-linecap="round"/>
    <line x1="54" y1="54" x2="54" y2="62" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <line x1="58" y1="50" x2="66" y2="54" stroke="white" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  cloudtrail: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <path d="M16 52 Q26 28 40 40 Q54 52 64 28" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <circle cx="16" cy="52" r="4" fill="white"/>
    <circle cx="40" cy="40" r="4" fill="white"/>
    <circle cx="64" cy="28" r="4" fill="white"/>
    <circle cx="64" cy="28" r="8" fill="none" stroke="white" stroke-width="2" opacity="0.5"/>
  </svg>`,
  secretsmanager: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="20" y="34" width="40" height="30" rx="4" fill="none" stroke="white" stroke-width="3"/>
    <path d="M28 34 L28 26 C28 18 52 18 52 26 L52 34" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <circle cx="40" cy="48" r="5" fill="white"/>
    <line x1="40" y1="53" x2="40" y2="58" stroke="white" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  // ── AI/ML ──
  bedrock: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <polygon points="40,14 58,24 58,44 40,54 22,44 22,24" fill="none" stroke="white" stroke-width="3"/>
    <polygon points="40,22 52,29 52,43 40,50 28,43 28,29" fill="white" opacity="0.2"/>
    <circle cx="40" cy="36" r="6" fill="white" opacity="0.9"/>
    <line x1="40" y1="14" x2="40" y2="22" stroke="white" stroke-width="2"/>
    <line x1="40" y1="50" x2="40" y2="54" stroke="white" stroke-width="2"/>
  </svg>`,
  sagemaker: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="26" cy="40" r="8" fill="none" stroke="white" stroke-width="2.5"/>
    <circle cx="54" cy="40" r="8" fill="none" stroke="white" stroke-width="2.5"/>
    <circle cx="40" cy="24" r="8" fill="none" stroke="white" stroke-width="2.5"/>
    <circle cx="40" cy="56" r="8" fill="none" stroke="white" stroke-width="2.5"/>
    <line x1="34" y1="40" x2="46" y2="40" stroke="white" stroke-width="2"/>
    <line x1="40" y1="32" x2="40" y2="48" stroke="white" stroke-width="2"/>
    <circle cx="26" cy="40" r="3" fill="white" opacity="0.8"/>
    <circle cx="54" cy="40" r="3" fill="white" opacity="0.8"/>
    <circle cx="40" cy="24" r="3" fill="white" opacity="0.8"/>
    <circle cx="40" cy="56" r="3" fill="white" opacity="0.8"/>
  </svg>`,
  // ── Integration / DevTools ──
  stepfunctions: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="26" y="14" width="28" height="14" rx="3" fill="white" opacity="0.9"/>
    <rect x="26" y="34" width="28" height="14" rx="3" fill="white" opacity="0.7"/>
    <rect x="26" y="54" width="28" height="14" rx="3" fill="white" opacity="0.5"/>
    <line x1="40" y1="28" x2="40" y2="34" stroke="white" stroke-width="2.5"/>
    <line x1="40" y1="48" x2="40" y2="54" stroke="white" stroke-width="2.5"/>
    <path d="M38 32 L40 36 L42 32" fill="white"/>
    <path d="M38 52 L40 56 L42 52" fill="white"/>
  </svg>`,
  appsync: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <polygon points="40,18 62,30 62,54 40,66 18,54 18,30" fill="none" stroke="white" stroke-width="3"/>
    <text x="40" y="46" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Arial">GQL</text>
  </svg>`,
  codecommit: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="40" r="10" fill="none" stroke="white" stroke-width="2.5"/>
    <circle cx="40" cy="40" r="3" fill="white"/>
    <circle cx="22" cy="24" r="5" fill="none" stroke="white" stroke-width="2.5"/>
    <circle cx="58" cy="24" r="5" fill="none" stroke="white" stroke-width="2.5"/>
    <circle cx="40" cy="60" r="5" fill="none" stroke="white" stroke-width="2.5"/>
    <line x1="26" y1="27" x2="34" y2="34" stroke="white" stroke-width="2"/>
    <line x1="54" y1="27" x2="46" y2="34" stroke="white" stroke-width="2"/>
    <line x1="40" y1="50" x2="40" y2="55" stroke="white" stroke-width="2"/>
  </svg>`,
  codepipeline: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="10" y="34" width="14" height="12" rx="2" fill="white" opacity="0.9"/>
    <rect x="33" y="34" width="14" height="12" rx="2" fill="white" opacity="0.7"/>
    <rect x="56" y="34" width="14" height="12" rx="2" fill="white" opacity="0.5"/>
    <line x1="24" y1="40" x2="33" y2="40" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="47" y1="40" x2="56" y2="40" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M30 37 L33 40 L30 43" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <path d="M53 37 L56 40 L53 43" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  cloudformation: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <rect x="16" y="16" width="48" height="48" rx="4" fill="none" stroke="white" stroke-width="3"/>
    <line x1="16" y1="28" x2="64" y2="28" stroke="white" stroke-width="2"/>
    <circle cx="22" cy="22" r="2" fill="white"/>
    <circle cx="28" cy="22" r="2" fill="white"/>
    <rect x="22" y="34" width="36" height="4" rx="1" fill="white" opacity="0.8"/>
    <rect x="22" y="42" width="26" height="4" rx="1" fill="white" opacity="0.6"/>
    <rect x="22" y="50" width="32" height="4" rx="1" fill="white" opacity="0.4"/>
  </svg>`,
  // ── Analytics ──
  athena: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <polygon points="40,14 66,60 14,60" fill="none" stroke="white" stroke-width="3" stroke-linejoin="round"/>
    <line x1="28" y1="46" x2="52" y2="46" stroke="white" stroke-width="2.5"/>
    <line x1="34" y1="36" x2="46" y2="36" stroke="white" stroke-width="2"/>
    <line x1="40" y1="26" x2="40" y2="14" stroke="white" stroke-width="1"/>
  </svg>`,
  kinesis: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <path d="M14 40 Q22 24 30 40 Q38 56 46 40 Q54 24 66 40" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="14" cy="40" r="3" fill="white"/>
    <circle cx="66" cy="40" r="3" fill="white"/>
  </svg>`,
  redshift: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <ellipse cx="40" cy="32" rx="22" ry="10" fill="none" stroke="white" stroke-width="3"/>
    <ellipse cx="40" cy="32" rx="22" ry="10" fill="white" opacity="0.15"/>
    <line x1="18" y1="32" x2="18" y2="48" stroke="white" stroke-width="3"/>
    <line x1="62" y1="32" x2="62" y2="48" stroke="white" stroke-width="3"/>
    <ellipse cx="40" cy="48" rx="22" ry="10" fill="none" stroke="white" stroke-width="3"/>
    <path d="M36 40 L40 44 L50 30" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,
  glue: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="40" r="14" fill="none" stroke="white" stroke-width="3"/>
    <path d="M40 26 C50 26 56 32 56 40" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M56 40 C56 50 50 54 40 54" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M40 54 C30 54 24 48 24 40" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M24 40 C24 30 30 26 40 26" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="40" cy="40" r="5" fill="white"/>
    <line x1="16" y1="24" x2="26" y2="30" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <line x1="64" y1="24" x2="54" y2="30" stroke="white" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  emr: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="26" cy="30" r="8" fill="none" stroke="white" stroke-width="2.5"/>
    <circle cx="54" cy="30" r="8" fill="none" stroke="white" stroke-width="2.5"/>
    <circle cx="40" cy="52" r="8" fill="none" stroke="white" stroke-width="2.5"/>
    <line x1="34" y1="30" x2="46" y2="30" stroke="white" stroke-width="2"/>
    <line x1="32" y1="36" x2="38" y2="46" stroke="white" stroke-width="2"/>
    <line x1="48" y1="36" x2="44" y2="46" stroke="white" stroke-width="2"/>
    <circle cx="26" cy="30" r="3" fill="white" opacity="0.8"/>
    <circle cx="54" cy="30" r="3" fill="white" opacity="0.8"/>
    <circle cx="40" cy="52" r="3" fill="white" opacity="0.8"/>
  </svg>`,
  // ── IoT ──
  iotcore: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="12" fill="${c}"/>
    <circle cx="40" cy="40" r="8" fill="white" opacity="0.9"/>
    <path d="M26 26 Q16 34 16 40 Q16 54 26 56" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M30 30 Q22 36 22 40 Q22 50 30 52" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
    <path d="M54 26 Q64 34 64 40 Q64 54 54 56" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M50 30 Q58 36 58 40 Q58 50 50 52" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  </svg>`,
};

// Helper to render AWS icon as <img src="data:image/svg+xml...">
function awsIconSrc(serviceId, color) {
  const fn = AWS_ICON_SVG[serviceId];
  if (!fn) return null;
  const svg = fn(color);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const AWS_SERVICES = {
  compute: {
    label: "コンピューティング", color: "#FF9900", bg: "#FFF3E0",
    services: [
      { id: "ec2", name: "EC2", icon: "🖥️", desc: "仮想サーバー",
        pricing: { unit: "時間", base: 0.0136, options: [
          { label: "t3.micro", value: 0.0136 }, { label: "t3.small", value: 0.0272 },
          { label: "t3.medium", value: 0.0544 }, { label: "t3.large", value: 0.1088 },
          { label: "m6i.large", value: 0.124 }, { label: "m6i.xlarge", value: 0.248 },
          { label: "c6i.large", value: 0.099 }, { label: "r6i.large", value: 0.148 }
        ], hoursPerMonth: 730 } },
      { id: "lambda", name: "Lambda", icon: "λ", desc: "サーバーレス関数",
        pricing: { unit: "リクエスト", base: 0.0000002, freeLimit: 1000000 } },
      { id: "ecs", name: "ECS / Fargate", icon: "📦", desc: "コンテナ実行",
        pricing: { unit: "vCPU-h", base: 0.05056, memGB: 0.00553 } },
      { id: "eks", name: "EKS", icon: "☸️", desc: "Kubernetesクラスター",
        pricing: { unit: "クラスター/h", base: 0.10, hoursPerMonth: 730, note: "$0.10/h + ノードEC2料金" } },
      { id: "batch", name: "AWS Batch", icon: "⚙️", desc: "バッチ処理",
        pricing: { unit: "EC2料金のみ", base: 0, note: "使用EC2/Fargateの料金のみ" } },
      { id: "lightsail", name: "Lightsail", icon: "💡", desc: "シンプルVPS",
        pricing: { unit: "固定/月", base: 3.5, options: [
          { label: "512MB RAM $3.5", value: 3.5 }, { label: "1GB RAM $5", value: 5 },
          { label: "2GB RAM $10", value: 10 }, { label: "4GB RAM $20", value: 20 }
        ] } },
      { id: "elasticbeanstalk", name: "Elastic Beanstalk", icon: "🌱", desc: "PaaSデプロイ",
        pricing: { unit: "EC2料金のみ", base: 0, note: "EC2等の基盤コストのみ" } },
      { id: "outposts", name: "Outposts", icon: "🏭", desc: "オンプレAWSインフラ",
        pricing: { unit: "要問合せ", base: 0, note: "オンプレ設置。料金は要問合せ" } },
    ]
  },
  storage: {
    label: "ストレージ", color: "#3F8624", bg: "#E8F5E9",
    services: [
      { id: "s3", name: "S3", icon: "🪣", desc: "オブジェクトストレージ",
        pricing: { unit: "GB/月", base: 0.025, freeGB: 5 } },
      { id: "ebs", name: "EBS", icon: "💾", desc: "ブロックストレージ",
        pricing: { unit: "GB/月", base: 0.096 } },
      { id: "efs", name: "EFS", icon: "📁", desc: "ファイルストレージ",
        pricing: { unit: "GB/月", base: 0.36 } },
      { id: "glacier", name: "S3 Glacier", icon: "🧊", desc: "アーカイブストレージ",
        pricing: { unit: "GB/月", base: 0.005 } },
      { id: "fsx", name: "FSx", icon: "🗂️", desc: "高性能ファイルシステム",
        pricing: { unit: "GB/月", base: 0.23, options: [
          { label: "FSx for Windows $0.23", value: 0.23 },
          { label: "FSx for Lustre $0.14", value: 0.14 },
          { label: "FSx for NetApp $0.30", value: 0.30 }
        ] } },
      { id: "storagegateway", name: "Storage Gateway", icon: "🔌", desc: "ハイブリッドストレージ",
        pricing: { unit: "GB/月", base: 0.025, note: "オンプレ↔クラウド連携" } },
      { id: "datasync", name: "DataSync", icon: "🔄", desc: "データ転送",
        pricing: { unit: "GB転送", base: 0.0125 } },
      { id: "ecr", name: "ECR", icon: "🐳", desc: "コンテナイメージレジストリ",
        pricing: { unit: "GB/月", base: 0.10, freeGB: 0.5, note: "$0.10/GB/月。同一リージョン内の転送は無料。無料枠500MB/月（12か月）" } },
    ]
  },
  database: {
    label: "データベース", color: "#2E73B8", bg: "#E3F2FD",
    services: [
      { id: "rds", name: "RDS", icon: "🗄️", desc: "リレーショナルDB",
        pricing: { unit: "時間", base: 0.026, options: [
          { label: "db.t3.micro", value: 0.026 }, { label: "db.t3.small", value: 0.052 },
          { label: "db.t3.medium", value: 0.104 }, { label: "db.m6g.large", value: 0.24 },
          { label: "db.r6g.large", value: 0.29 }
        ], storage: 0.138, hoursPerMonth: 730 } },
      { id: "aurora", name: "Aurora", icon: "✨", desc: "マネージドRDB",
        pricing: { unit: "ACU-h", base: 0.073, storage: 0.12 } },
      { id: "dynamodb", name: "DynamoDB", icon: "⚡", desc: "NoSQL DB",
        pricing: { unit: "WCU/月", base: 0.742, rcu: 0.1484, freeGB: 25, freeWCU: 25, freeRCU: 25 } },
      { id: "elasticache", name: "ElastiCache", icon: "🔴", desc: "インメモリキャッシュ",
        pricing: { unit: "ノード時間", base: 0.034, options: [
          { label: "cache.t3.micro", value: 0.034 }, { label: "cache.t3.small", value: 0.068 },
          { label: "cache.r6g.large", value: 0.206 }
        ], hoursPerMonth: 730 } },
      { id: "documentdb", name: "DocumentDB", icon: "📄", desc: "MongoDB互換DB",
        pricing: { unit: "時間", base: 0.094, options: [
          { label: "db.t3.medium", value: 0.094 }, { label: "db.r6g.large", value: 0.277 }
        ], hoursPerMonth: 730 } },
      { id: "neptune", name: "Neptune", icon: "🔗", desc: "グラフDB",
        pricing: { unit: "時間", base: 0.138, options: [
          { label: "db.r5.large", value: 0.138 }, { label: "db.r5.xlarge", value: 0.276 }
        ], hoursPerMonth: 730 } },
      { id: "timestream", name: "Timestream", icon: "📈", desc: "時系列DB",
        pricing: { unit: "GB書込", base: 0.65, note: "$0.65/GB書込 + $0.03/GB保存" } },
      { id: "keyspaces", name: "Keyspaces", icon: "🔑", desc: "Cassandra互換DB",
        pricing: { unit: "WCU/月", base: 1.45, rcu: 0.29 } },
      { id: "qldb", name: "QLDB", icon: "📒", desc: "台帳DB",
        pricing: { unit: "IOリクエスト", base: 0.29, note: "$0.29/100万IOリクエスト" } },
    ]
  },
  network: {
    label: "ネットワーク", color: "#8C4FFF", bg: "#F3E5F5",
    services: [
      { id: "vpc", name: "VPC", icon: "🔒", desc: "仮想ネットワーク",
        pricing: { unit: "無料", base: 0, note: "VPC自体は無料（最大5個まで）" } },
      { id: "subnet", name: "Subnet", icon: "🗃️", desc: "サブネット（Public/Private）",
        pricing: { unit: "無料", base: 0, note: "Subnet自体は無料。NAT Gatewayなど通過するリソースに課金" } },
      { id: "securitygroup", name: "Security Group", icon: "🔐", desc: "仮想ファイアウォール（インスタンス単位）",
        pricing: { unit: "無料", base: 0, note: "Security Group自体は無料。ルール数・SG数に制限あり" } },
      { id: "nacl", name: "Network ACL", icon: "📋", desc: "サブネット単位のアクセス制御",
        pricing: { unit: "無料", base: 0, note: "NACL自体は無料。ステートレスで双方向ルール設定が必要" } },
      { id: "igw", name: "Internet Gateway", icon: "🌐", desc: "VPC↔インターネット接続",
        pricing: { unit: "無料（データ転送は別途）", base: 0, note: "IGW自体は無料。アウトバウンド転送は$0.114/GB（東京）" } },
      { id: "natgateway", name: "NAT Gateway", icon: "🔄", desc: "プライベートサブネットの外向き通信",
        pricing: { unit: "時間+データ処理GB", base: 0.062, dataProcessing: 0.062, hoursPerMonth: 730, note: "$0.062/h + $0.062/GB処理" } },
      { id: "vpcendpoint", name: "VPC Endpoint", icon: "🔗", desc: "AWS サービスへのプライベート接続",
        pricing: { unit: "時間+データGB", base: 0.014, dataProcessing: 0.01, hoursPerMonth: 730,
          options: [
            { label: "Gateway型（S3/DynamoDB）無料", value: 0 },
            { label: "Interface型 $0.014/h + $0.01/GB", value: 0.014 }
          ], note: "Gateway型（S3/DynamoDB）は無料。Interface型は$0.014/h + $0.01/GB" } },
      { id: "eip", name: "Elastic IP", icon: "📌", desc: "静的パブリックIPアドレス",
        pricing: { unit: "未使用IP/h", base: 0.005, hoursPerMonth: 730, note: "未使用・追加EIPのみ課金: $0.005/h。1つ目の実行中インスタンス紐付けは無料" } },
      { id: "enicard", name: "Elastic Network Interface", icon: "🔌", desc: "仮想ネットワークカード",
        pricing: { unit: "無料", base: 0, note: "ENI自体は無料。通過するデータ転送料のみ課金" } },
      { id: "vpcpeering", name: "VPC Peering", icon: "🤝", desc: "VPC間プライベート接続",
        pricing: { unit: "データ転送GB", base: 0.01, note: "Peering自体は無料。同リージョンのデータ転送$0.01/GB（異なるAZ間）" } },
      { id: "alb", name: "ALB", icon: "⚖️", desc: "アプリケーションLB",
        pricing: { unit: "時間+LCU", base: 0.008, lcu: 0.008, hoursPerMonth: 730 } },
      { id: "nlb", name: "NLB", icon: "🔀", desc: "ネットワークLB",
        pricing: { unit: "時間+NLCU", base: 0.0065, lcu: 0.0065, hoursPerMonth: 730 } },
      { id: "cloudfront", name: "CloudFront", icon: "☁️", desc: "CDN",
        pricing: { unit: "GB転送", base: 0.114, freeGB: 1024 } },
      { id: "apigateway", name: "API Gateway", icon: "🚪", desc: "API管理",
        pricing: { unit: "100万コール", base: 3.5, freeLimit: 1000000 } },
      { id: "route53", name: "Route 53", icon: "🗺️", desc: "DNS管理",
        pricing: { unit: "ゾーン/月", base: 0.5 } },
      { id: "directconnect", name: "Direct Connect", icon: "📶", desc: "専用線接続",
        pricing: { unit: "ポート時間", base: 0.03, options: [
          { label: "1Gbps $0.03/h", value: 0.03 }, { label: "10Gbps $0.30/h", value: 0.30 }
        ], hoursPerMonth: 730 } },
      { id: "vpn", name: "Site-to-Site VPN", icon: "🛤️", desc: "VPN接続",
        pricing: { unit: "接続時間", base: 0.048, hoursPerMonth: 730 } },
      { id: "clientvpn", name: "Client VPN", icon: "💻", desc: "クライアントVPN（リモートアクセス）",
        pricing: { unit: "エンドポイント+接続/h", base: 0.10, connectionHour: 0.05, hoursPerMonth: 730, note: "$0.10/h（エンドポイント）+ $0.05/h/接続数" } },
      { id: "globalaccelerator", name: "Global Accelerator", icon: "🚀", desc: "グローバル高速化",
        pricing: { unit: "固定/月", base: 18, note: "$0.025/h固定 + データ転送料" } },
      { id: "transitgateway", name: "Transit Gateway", icon: "🔁", desc: "VPC相互接続ハブ",
        pricing: { unit: "アタッチメント/h", base: 0.07, dataProcessing: 0.02, hoursPerMonth: 730, note: "$0.07/h/アタッチメント + $0.02/GB処理" } },
      { id: "networkfirewall", name: "Network Firewall", icon: "🔥", desc: "マネージドネットワークファイアウォール",
        pricing: { unit: "エンドポイント/h+GB", base: 0.395, dataProcessing: 0.065, hoursPerMonth: 730, note: "$0.395/h（エンドポイント）+ $0.065/GB処理" } },
      { id: "resolver", name: "Route 53 Resolver", icon: "🔍", desc: "DNS Resolver / ハイブリッドDNS",
        pricing: { unit: "エンドポイント/h+クエリ", base: 0.125, queryPrice: 0.004, hoursPerMonth: 730, note: "$0.125/h（エンドポイント）+ $0.004/万クエリ" } },
    ]
  },
  integration: {
    label: "統合・メッセージング", color: "#E7157B", bg: "#FCE4EC",
    services: [
      { id: "sqs", name: "SQS", icon: "📬", desc: "メッセージキュー",
        pricing: { unit: "100万リクエスト", base: 0.4, freeLimit: 1000000 } },
      { id: "sns", name: "SNS", icon: "📣", desc: "通知サービス",
        pricing: { unit: "100万発行", base: 0.5, freeLimit: 1000000 } },
      { id: "eventbridge", name: "EventBridge", icon: "🔔", desc: "イベントバス",
        pricing: { unit: "100万イベント", base: 1.0 } },
      { id: "stepfunctions", name: "Step Functions", icon: "🪜", desc: "ワークフロー管理",
        pricing: { unit: "1000状態遷移", base: 0.025, freeLimit: 4000 } },
      { id: "appsync", name: "AppSync", icon: "🔁", desc: "GraphQL API",
        pricing: { unit: "100万クエリ", base: 4.0, freeLimit: 250000 } },
      { id: "msk", name: "MSK (Kafka)", icon: "📡", desc: "マネージドKafka",
        pricing: { unit: "ブローカー/h", base: 0.21, options: [
          { label: "kafka.t3.small", value: 0.021 }, { label: "kafka.m5.large", value: 0.21 },
          { label: "kafka.m5.xlarge", value: 0.422 }
        ], hoursPerMonth: 730 } },
      { id: "kinesis", name: "Kinesis", icon: "🌊", desc: "リアルタイムデータ",
        pricing: { unit: "シャード時間", base: 0.015, hoursPerMonth: 730 } },
    ]
  },
  security: {
    label: "セキュリティ・管理", color: "#DD344C", bg: "#FFEBEE",
    services: [
      { id: "cognito", name: "Cognito", icon: "👤", desc: "ユーザー認証",
        pricing: { unit: "MAU", base: 0.0055, freeLimit: 50000, note: "50,000 MAUまで無料" } },
      { id: "waf", name: "WAF", icon: "🛡️", desc: "Webアプリファイアウォール",
        pricing: { unit: "WebACL/月", base: 5, requests: 0.6 } },
      { id: "cloudwatch", name: "CloudWatch", icon: "👁️", desc: "監視・ログ",
        pricing: { unit: "メトリクス/月", base: 0.3, logs: 0.76, freeMetrics: 10 } },
      { id: "iam", name: "IAM", icon: "🔐", desc: "アクセス管理",
        pricing: { unit: "無料", base: 0, note: "IAM自体は無料" } },
      { id: "kms", name: "KMS", icon: "🗝️", desc: "鍵管理",
        pricing: { unit: "キー/月", base: 1.0, note: "$1/キー/月" } },
      { id: "secretsmanager", name: "Secrets Manager", icon: "🤫", desc: "シークレット管理",
        pricing: { unit: "シークレット/月", base: 0.4 } },
      { id: "shield", name: "Shield", icon: "🔰", desc: "DDoS防御",
        pricing: { unit: "固定/月", base: 0, options: [
          { label: "Standard（無料）", value: 0 }, { label: "Advanced $3,000", value: 3000 }
        ], note: "Standardは無料。Advancedは$3,000/月〜" } },
      { id: "guardduty", name: "GuardDuty", icon: "🔍", desc: "脅威検出",
        pricing: { unit: "VPCフローログGB", base: 1.0, note: "$1.00/GB（VPCフローログ）" } },
      { id: "cloudtrail", name: "CloudTrail", icon: "📋", desc: "APIログ記録",
        pricing: { unit: "証跡/月", base: 2.0, note: "最初の証跡は無料、追加$2/月" } },
      { id: "config", name: "AWS Config", icon: "📝", desc: "設定変更追跡",
        pricing: { unit: "設定アイテム", base: 0.003 } },
      { id: "acm", name: "Certificate Manager", icon: "🔏", desc: "SSL/TLS証明書管理",
        pricing: { unit: "証明書", base: 0, options: [
          { label: "パブリック証明書（ACM統合サービス用）無料", value: 0 },
          { label: "エクスポータブル FQDN $7/枚", value: 7 },
          { label: "エクスポータブル ワイルドカード $79/枚", value: 79 },
        ], note: "ALB/CloudFront等のACM統合サービスで使う公開証明書は完全無料。エクスポートする場合のみ有料（FQDN $7、ワイルドカード $79、2026年2月改定）" } },
    ]
  },
  aiml: {
    label: "AI / 機械学習", color: "#01A88D", bg: "#E0F2F1",
    services: [
      { id: "bedrock", name: "Bedrock", icon: "🤖", desc: "生成AI基盤モデル",
        pricing: { unit: "1000トークン", base: 0.003, note: "Claude Sonnet: $0.003/1Kトークン〜" } },
      { id: "sagemaker", name: "SageMaker", icon: "🧠", desc: "MLプラットフォーム",
        pricing: { unit: "インスタンス/h", base: 0.054, options: [
          { label: "ml.t3.medium", value: 0.054 }, { label: "ml.m5.large", value: 0.12 },
          { label: "ml.g4dn.xlarge", value: 0.736 }, { label: "ml.p3.2xlarge", value: 3.825 }
        ], hoursPerMonth: 730 } },
      { id: "rekognition", name: "Rekognition", icon: "📷", desc: "画像・動画解析",
        pricing: { unit: "1000画像", base: 1.0, note: "最初の100万画像は$1/1000枚" } },
      { id: "polly", name: "Polly", icon: "🔊", desc: "テキスト音声変換",
        pricing: { unit: "100万文字", base: 4.0 } },
      { id: "transcribe", name: "Transcribe", icon: "✍️", desc: "音声テキスト変換",
        pricing: { unit: "分", base: 0.024, note: "$0.024/分" } },
      { id: "translate", name: "Translate", icon: "🌍", desc: "機械翻訳",
        pricing: { unit: "100万文字", base: 15.0, note: "最初の200万文字/月は無料（12か月）" } },
      { id: "comprehend", name: "Comprehend", icon: "💬", desc: "自然言語処理",
        pricing: { unit: "1万ユニット", base: 1.0, note: "$0.0001/ユニット（100文字=1ユニット）" } },
      { id: "textract", name: "Textract", icon: "📃", desc: "文書データ抽出",
        pricing: { unit: "1000ページ", base: 1.5 } },
    ]
  },
  analytics: {
    label: "分析", color: "#8B5CF6", bg: "#EDE9FE",
    services: [
      { id: "redshift", name: "Redshift", icon: "🔭", desc: "データウェアハウス",
        pricing: { unit: "ノード時間", base: 0.25, options: [
          { label: "dc2.large", value: 0.25 }, { label: "ra3.xlplus", value: 1.086 },
          { label: "ra3.4xlarge", value: 3.336 }
        ], hoursPerMonth: 730 } },
      { id: "athena", name: "Athena", icon: "🔎", desc: "S3データクエリ",
        pricing: { unit: "TBスキャン", base: 5.0, note: "$5/TBスキャン" } },
      { id: "glue", name: "AWS Glue", icon: "🧩", desc: "ETLサービス",
        pricing: { unit: "DPU時間", base: 0.44, note: "$0.44/DPU時間" } },
      { id: "emr", name: "EMR", icon: "🐘", desc: "Hadoopクラスター",
        pricing: { unit: "EC2+EMR料金", base: 0.05, note: "EC2料金+$0.05/インスタンス時間" } },
      { id: "quicksight", name: "QuickSight", icon: "📊", desc: "BIダッシュボード",
        pricing: { unit: "ユーザー/月", base: 18, options: [
          { label: "Reader $5", value: 5 }, { label: "Author $18", value: 18 },
          { label: "Author Pro $34", value: 34 }
        ] } },
      { id: "opensearch", name: "OpenSearch", icon: "🔍", desc: "全文検索エンジン",
        pricing: { unit: "インスタンス/h", base: 0.098, options: [
          { label: "t3.small.search", value: 0.036 }, { label: "m6g.large.search", value: 0.098 },
          { label: "r6g.large.search", value: 0.167 }
        ], hoursPerMonth: 730 } },
      { id: "lakeformation", name: "Lake Formation", icon: "🏞️", desc: "データレイク管理",
        pricing: { unit: "無料（基盤のみ）", base: 0, note: "Lake Formation自体は無料" } },
    ]
  },
  devtools: {
    label: "開発ツール", color: "#F59E0B", bg: "#FFFBEB",
    services: [
      { id: "codecommit", name: "CodeCommit", icon: "📦", desc: "Gitリポジトリ",
        pricing: { unit: "ユーザー/月", base: 1.0, note: "最初の5ユーザーは無料" } },
      { id: "codebuild", name: "CodeBuild", icon: "🔨", desc: "CIビルドサービス",
        pricing: { unit: "ビルド分", base: 0.005, note: "最初の100分/月は無料" } },
      { id: "codepipeline", name: "CodePipeline", icon: "🔁", desc: "CDパイプライン",
        pricing: { unit: "パイプライン/月", base: 1.0, freeLimit: 1, note: "1パイプライン/月まで無料" } },
      { id: "codedeploy", name: "CodeDeploy", icon: "🚀", desc: "デプロイ自動化",
        pricing: { unit: "無料（EC2/Lambda）", base: 0, note: "EC2/Lambda deployは無料" } },
      { id: "cloud9", name: "Cloud9", icon: "☁️", desc: "クラウドIDE",
        pricing: { unit: "EC2料金のみ", base: 0, note: "Cloud9自体は無料" } },
      { id: "xray", name: "X-Ray", icon: "🩻", desc: "分散トレーシング",
        pricing: { unit: "100万トレース", base: 5.0, freeLimit: 1000000 } },
    ]
  },
  iot: {
    label: "IoT", color: "#10B981", bg: "#ECFDF5",
    services: [
      { id: "iotcore", name: "IoT Core", icon: "📡", desc: "IoTデバイス接続",
        pricing: { unit: "100万メッセージ", base: 1.0 } },
      { id: "greengrass", name: "Greengrass", icon: "🌿", desc: "エッジIoT処理",
        pricing: { unit: "デバイス/月", base: 0.16, note: "3デバイスまで無料" } },
      { id: "iotanalytics", name: "IoT Analytics", icon: "📉", desc: "IoTデータ分析",
        pricing: { unit: "100万メッセージ", base: 0.08 } },
    ]
  },
  management: {
    label: "管理・ガバナンス", color: "#64748B", bg: "#F1F5F9",
    services: [
      { id: "organizations", name: "Organizations", icon: "🏢", desc: "マルチアカウント管理",
        pricing: { unit: "無料", base: 0, note: "Organizations自体は無料" } },
      { id: "costexplorer", name: "Cost Explorer", icon: "💰", desc: "コスト可視化",
        pricing: { unit: "APIリクエスト", base: 0.01, note: "$0.01/APIリクエスト" } },
      { id: "ssm", name: "Systems Manager", icon: "⚙️", desc: "インフラ管理",
        pricing: { unit: "API呼出", base: 0.00005 } },
      { id: "cloudformation", name: "CloudFormation", icon: "📐", desc: "IaC",
        pricing: { unit: "無料（基盤のみ）", base: 0, note: "CloudFormation自体は無料" } },
      { id: "backup", name: "AWS Backup", icon: "💿", desc: "バックアップ管理",
        pricing: { unit: "GB/月", base: 0.05, note: "$0.05/GB保存" } },
      { id: "servicecontrolpolicies", name: "Service Catalog", icon: "🛍️", desc: "ITサービスカタログ",
        pricing: { unit: "共有ポートフォリオ/月", base: 0, note: "管理者APIは無料。共有は$0.0007/共有/月" } },
      { id: "wellarchitected", name: "Well-Architected Tool", icon: "📏", desc: "アーキテクチャレビュー",
        pricing: { unit: "無料", base: 0, note: "Well-Architected Tool自体は無料" } },
      { id: "budgets", name: "AWS Budgets", icon: "📊", desc: "予算管理・アラート",
        pricing: { unit: "予算/月", base: 0.02, freeLimit: 2, note: "最初の2予算は無料" } },
    ]
  },
  enduser: {
    label: "エンドユーザーコンピューティング", color: "#0073BB", bg: "#E8F4FD",
    services: [
      { id: "workspaces", name: "WorkSpaces", icon: "🖥️", desc: "クラウドデスクトップ",
        pricing: { unit: "ユーザー/月", base: 35, options: [
          { label: "Value $35", value: 35 }, { label: "Standard $60", value: 60 },
          { label: "Performance $80", value: 80 }, { label: "Power $124", value: 124 }
        ] } },
      { id: "appstream", name: "AppStream 2.0", icon: "📱", desc: "アプリストリーミング",
        pricing: { unit: "ユーザー時間", base: 0.14, options: [
          { label: "stream.standard.medium $0.14/h", value: 0.14 },
          { label: "stream.standard.large $0.20/h", value: 0.20 }
        ], hoursPerMonth: 160 } },
      { id: "workdocs", name: "WorkDocs", icon: "📝", desc: "ドキュメント共有",
        pricing: { unit: "ユーザー/月", base: 5.0, note: "$5/ユーザー/月（1TB含む）" } },
      { id: "connect", name: "Amazon Connect", icon: "📞", desc: "クラウドコールセンター",
        pricing: { unit: "通話分", base: 0.018, note: "$0.018/分（インバウンド）" } },
    ]
  },
  media: {
    label: "メディア・配信", color: "#C7254E", bg: "#FDECEA",
    services: [
      { id: "mediaconvert", name: "MediaConvert", icon: "🎬", desc: "動画トランスコード",
        pricing: { unit: "分（HD）", base: 0.015, note: "$0.015/分（HD出力）" } },
      { id: "ivs", name: "IVS", icon: "📹", desc: "インタラクティブ動画",
        pricing: { unit: "時間配信", base: 0.2, note: "$0.20/配信時間（1080p）" } },
      { id: "elastictranscoder", name: "Elastic Transcoder", icon: "🎞️", desc: "メディアトランスコード",
        pricing: { unit: "分", base: 0.017, note: "$0.017/分（HD）" } },
      { id: "chime", name: "Chime SDK", icon: "💬", desc: "ビデオ・音声会議",
        pricing: { unit: "分/参加者", base: 0.0015, note: "$0.0015/分/参加者" } },
    ]
  },
  mobile: {
    label: "モバイル・フロントエンド", color: "#E91E8C", bg: "#FCE4EC",
    services: [
      { id: "amplify", name: "Amplify", icon: "⚡", desc: "フルスタック開発",
        pricing: { unit: "ビルド分", base: 0.01, freeLimit: 1000, note: "最初の1000分/月は無料" } },
      { id: "appsyncmobile", name: "AppSync (Mobile)", icon: "📲", desc: "モバイルAPI",
        pricing: { unit: "100万クエリ", base: 4.0, freeLimit: 250000 } },
      { id: "pinpoint", name: "Pinpoint", icon: "📍", desc: "ユーザーエンゲージメント",
        pricing: { unit: "100万メッセージ", base: 1.0, freeLimit: 5000 } },
      { id: "devicefarm", name: "Device Farm", icon: "📱", desc: "実機テスト",
        pricing: { unit: "デバイス分", base: 0.17, options: [
          { label: "従量課金 $0.17/分", value: 0.17 }, { label: "専有 $250/月", value: 250 }
        ] } },
    ]
  },
  migration: {
    label: "移行・転送", color: "#795548", bg: "#EFEBE9",
    services: [
      { id: "dms", name: "DMS", icon: "🔄", desc: "データベース移行",
        pricing: { unit: "インスタンス/h", base: 0.018, options: [
          { label: "dms.t3.micro $0.018", value: 0.018 }, { label: "dms.t3.small $0.036", value: 0.036 },
          { label: "dms.r5.large $0.288", value: 0.288 }
        ], hoursPerMonth: 730 } },
      { id: "snowball", name: "Snowball Edge", icon: "❄️", desc: "物理データ転送",
        pricing: { unit: "デバイス/日", base: 30, note: "$30/日（Snowball Edge Storage Optimized）" } },
      { id: "transferfamily", name: "Transfer Family", icon: "📤", desc: "FTP/SFTP/FTPSサーバー",
        pricing: { unit: "プロトコル/h", base: 0.30, note: "$0.30/プロトコル/h有効化 + $0.04/GB" } },
      { id: "applicationmigration", name: "MGN", icon: "🚛", desc: "サーバー移行",
        pricing: { unit: "サーバー/月", base: 0, note: "最初の90日は無料" } },
    ]
  },
  blockchain: {
    label: "ブロックチェーン・その他", color: "#4CAF50", bg: "#E8F5E9",
    services: [
      { id: "managedblockchain", name: "Managed Blockchain", icon: "⛓️", desc: "ブロックチェーンネットワーク",
        pricing: { unit: "ノード/h", base: 0.131, options: [
          { label: "bc.t3.small $0.131/h", value: 0.131 }, { label: "bc.m5.xlarge $0.714/h", value: 0.714 }
        ], hoursPerMonth: 730 } },
      { id: "groundstation", name: "Ground Station", icon: "📡", desc: "衛星通信",
        pricing: { unit: "分/パス", base: 1.30, note: "$1.30/分（アンテナ使用）" } },
      { id: "robomaker", name: "RoboMaker", icon: "🤖", desc: "ロボットシミュレーション",
        pricing: { unit: "SU時間", base: 0.40, note: "$0.40/SU時間（シミュレーション）" } },
      { id: "locationservice", name: "Location Service", icon: "🗺️", desc: "地図・位置情報",
        pricing: { unit: "APIリクエスト", base: 0.0004, note: "$0.40/千リクエスト" } },
    ]
  }
};

const REGION_FACTOR = {
  "東京 (ap-northeast-1)": 1.0,
  "バージニア (us-east-1)": 0.85,
  "シンガポール (ap-southeast-1)": 0.95,
  "フランクフルト (eu-central-1)": 1.05,
  "ソウル (ap-northeast-2)": 0.97,
  "オレゴン (us-west-2)": 0.87,
};

const DEFAULT_USD_JPY = 155;
let nodeCounter = 0;

function createNode(service, x, y) {
  nodeCounter++;
  return {
    id: `node-${nodeCounter}`,
    serviceId: service.id,
    name: service.name,
    icon: service.icon,
    desc: service.desc,
    pricing: service.pricing,
    x, y,
    qty: 1, storageGB: 20, dataGB: 10, requestsM: 1,
    instanceOption: service.pricing.options?.[0]?.value ?? service.pricing.base,
  };
}

function calcNodeCost(node, rf) {
  // アーキテクチャタブ表示用コスト計算
  // calcDetailedCost と同一ロジックに統一（差異を排除）
  return calcDetailedCost(node, rf);
}

const categoryColor = (sid) => {
  for (const cat of Object.values(AWS_SERVICES)) {
    if (cat.services.find(s => s.id === sid)) return { color: cat.color, bg: cat.bg };
  }
  return { color: "#888", bg: "#f5f5f5" };
};

const STORAGE_IDS = new Set(["s3","ebs","efs","glacier","fsx","rds","cloudwatch","backup","storagegateway","datasync","timestream"]);
const QTY_IDS = new Set(["ec2","rds","elasticache","route53","dynamodb","kinesis","msk","documentdb","neptune","sagemaker","eks","lightsail","directconnect","nlb","kms","secretsmanager","cloudtrail","config","ssm","quicksight","greengrass","codecommit","codepipeline","codebuild","redshift","cognito","glue","opensearch","cloudwatch","ecs","alb","transcribe","workspaces","workdocs","appstream","connect","mediaconvert","elastictranscoder","ivs","chime","amplify","devicefarm","dms","snowball","managedblockchain","budgets","groundstation","robomaker"]);
const REQ_IDS = new Set(["lambda","sqs","sns","eventbridge","apigateway","appsync","stepfunctions","waf","xray","bedrock","rekognition","polly","translate","comprehend","textract","iotcore","iotanalytics","costexplorer","keyspaces","pinpoint","locationservice"]);
const DATA_IDS = new Set(["cloudfront","datasync","athena","transferfamily"]);

// ── per-service config fields ───────────────────────────────────────────────
const SERVICE_FIELDS = {
  ec2:         [{ f:"qty", label:"インスタンス台数", type:"number", min:1, max:500, step:1 },
                { f:"instanceOption", label:"インスタンスタイプ", type:"select" },
                { f:"hoursPerDay", label:"稼働時間/日（h）", type:"number", min:1, max:24, step:1 },
                { f:"daysPerMonth", label:"稼働日数/月（日）", type:"number", min:1, max:31, step:1 }],
  lambda:      [{ f:"requestsM", label:"リクエスト数（百万/月）", type:"number", min:0, step:1 },
                { f:"avgDurationMs", label:"平均実行時間（ms）", type:"number", min:1, step:10 },
                { f:"memoryMB", label:"メモリ（MB）", type:"select", options:[128,256,512,1024,2048,3008].map(v=>({label:`${v} MB`,value:v})) },
                { f:"concurrency", label:"同時実行数（参考）", type:"number", min:0, step:1 }],
  ecs:         [{ f:"qty", label:"タスク数", type:"number", min:1, step:1 },
                { f:"vcpu", label:"vCPU/タスク", type:"select", options:[0.25,0.5,1,2,4,8,16].map(v=>({label:`${v} vCPU`,value:v})) },
                { f:"memGB", label:"メモリ/タスク（GB）", type:"select", options:[0.5,1,2,4,8,16,30].map(v=>({label:`${v} GB`,value:v})) },
                { f:"hoursPerDay", label:"稼働時間/日", type:"number", min:1, max:24 },
                { f:"daysPerMonth", label:"稼働日数/月", type:"number", min:1, max:31 }],
  eks:         [{ f:"qty", label:"クラスター数", type:"number", min:1 },
                { f:"nodeQty", label:"ノード数（EC2換算）", type:"number", min:0 }],
  lightsail:   [{ f:"qty", label:"インスタンス数", type:"number", min:1 },
                { f:"instanceOption", label:"プラン", type:"select" }],
  s3:          [{ f:"storageGB", label:"標準ストレージ（GB）", type:"number", min:0 },
                { f:"s3IaGB", label:"低頻度アクセス（GB）", type:"number", min:0 },
                { f:"requestsM", label:"GETリクエスト（百万/月）", type:"number", min:0, step:0.1 },
                { f:"dataGB", label:"アウト転送（GB/月）", type:"number", min:0 }],
  ebs:         [{ f:"qty", label:"ボリューム数", type:"number", min:1 },
                { f:"storageGB", label:"容量/ボリューム（GB）", type:"number", min:1 },
                { f:"iops", label:"プロビジョンドIOPS（gp3なら0）", type:"number", min:0, step:100 }],
  efs:         [{ f:"storageGB", label:"ストレージ（GB）", type:"number", min:1 },
                { f:"accessClass", label:"ストレージクラス", type:"select", options:[{label:"標準 $0.36/GB",value:0.36},{label:"低頻度アクセス $0.025/GB",value:0.025}] }],
  glacier:     [{ f:"storageGB", label:"保存データ（GB）", type:"number", min:0 },
                { f:"retrievalGB", label:"取出しデータ（GB/月）", type:"number", min:0 }],
  fsx:         [{ f:"instanceOption", label:"FSxタイプ", type:"select" },
                { f:"storageGB", label:"ストレージ容量（GB）", type:"number", min:32 },
                { f:"throughputMBps", label:"スループット（MB/s）", type:"number", min:0, step:8 }],
  datasync:    [{ f:"dataGB", label:"転送データ量（GB/月）", type:"number", min:0 }],
  ecr:         [{ f:"storageGB", label:"ストレージ（GB）", type:"number", min:0, step:1 },
                { f:"freeGB", label:"無料枠（GB）", type:"number", min:0, step:0.1 },
                { f:"dataGB", label:"インターネット転送（GB/月）", type:"number", min:0, step:1 }],
  acm:         [{ f:"instanceOption", label:"証明書タイプ", type:"select", options:[
                  { label:"パブリック証明書（ACM統合サービス用）- 無料", value:0 },
                  { label:"エクスポータブル FQDN - $7/枚", value:7 },
                  { label:"エクスポータブル ワイルドカード - $79/枚", value:79 },
                ]},
                { f:"qty", label:"証明書枚数", type:"number", min:0, step:1 }],
  rds:         [{ f:"instanceOption", label:"インスタンスタイプ", type:"select" },
                { f:"qty", label:"インスタンス数", type:"number", min:1 },
                { f:"multiAZ", label:"Multi-AZ", type:"select", options:[{label:"シングルAZ",value:1},{label:"Multi-AZ（×2）",value:2}] },
                { f:"storageGB", label:"ストレージ（GB）", type:"number", min:20 },
                { f:"backupGB", label:"バックアップストレージ（GB）", type:"number", min:0 },
                { f:"hoursPerDay", label:"稼働時間/日", type:"number", min:1, max:24 }],
  aurora:      [{ f:"qty", label:"インスタンス数（Writer+Reader）", type:"number", min:1 },
                { f:"auroraMode", label:"モード", type:"select", options:[{label:"Provisioned",value:"provisioned"},{label:"Serverless v2",value:"serverless"}] },
                { f:"storageGB", label:"データ（GB）", type:"number", min:0 },
                { f:"ioRequests", label:"I/Oリクエスト（百万/月）", type:"number", min:0 }],
  dynamodb:    [{ f:"billingMode", label:"課金モード", type:"select", options:[{label:"プロビジョンドキャパシティ",value:"provisioned"},{label:"オンデマンド",value:"ondemand"}] },
                { f:"wcu", label:"書込みキャパシティ（WCU）", type:"number", min:0 },
                { f:"rcu", label:"読込みキャパシティ（RCU）", type:"number", min:0 },
                { f:"storageGB", label:"ストレージ（GB）", type:"number", min:0 },
                { f:"writeM", label:"書込みリクエスト（百万/月 ※OD時）", type:"number", min:0 },
                { f:"readM", label:"読込みリクエスト（百万/月 ※OD時）", type:"number", min:0 }],
  elasticache: [{ f:"instanceOption", label:"ノードタイプ", type:"select" },
                { f:"qty", label:"ノード数", type:"number", min:1 },
                { f:"hoursPerDay", label:"稼働時間/日", type:"number", min:1, max:24 }],
  documentdb:  [{ f:"instanceOption", label:"インスタンスタイプ", type:"select" },
                { f:"qty", label:"インスタンス数", type:"number", min:1 },
                { f:"storageGB", label:"ストレージ（GB）", type:"number", min:0 }],
  neptune:     [{ f:"instanceOption", label:"インスタンスタイプ", type:"select" },
                { f:"qty", label:"インスタンス数", type:"number", min:1 }],
  redshift:    [{ f:"instanceOption", label:"ノードタイプ", type:"select" },
                { f:"qty", label:"ノード数", type:"number", min:1 },
                { f:"hoursPerDay", label:"稼働時間/日", type:"number", min:1, max:24 }],
  opensearch:  [{ f:"instanceOption", label:"インスタンスタイプ", type:"select" },
                { f:"qty", label:"インスタンス数", type:"number", min:1 },
                { f:"storageGB", label:"EBSストレージ（GB）", type:"number", min:0 }],
  alb:         [{ f:"qty", label:"ALB数", type:"number", min:1 },
                { f:"lcuPerHour", label:"LCU数/時間（推定）", type:"number", min:0, step:0.5 },
                { f:"dataGB", label:"処理データ（GB/月）", type:"number", min:0 }],
  nlb:         [{ f:"qty", label:"NLB数", type:"number", min:1 },
                { f:"lcuPerHour", label:"NLCU数/時間（推定）", type:"number", min:0, step:0.5 }],
  cloudfront:  [{ f:"dataGB", label:"転送データ（GB/月）", type:"number", min:0 },
                { f:"requestsM", label:"HTTPSリクエスト（百万/月）", type:"number", min:0, step:0.1 },
                { f:"invalidations", label:"無効化リクエスト数/月", type:"number", min:0 }],
  apigateway:  [{ f:"requestsM", label:"APIコール数（百万/月）", type:"number", min:0, step:0.1 },
                { f:"cacheGB", label:"キャッシュサイズ（GB, 0=無効）", type:"number", min:0, step:0.5 },
                { f:"dataGB", label:"データ転送（GB/月）", type:"number", min:0 }],
  route53:     [{ f:"qty", label:"ホストゾーン数", type:"number", min:1 },
                { f:"requestsM", label:"クエリ数（百万/月）", type:"number", min:0 }],
  directconnect:[{ f:"instanceOption", label:"ポート速度", type:"select" },
                 { f:"qty", label:"接続数", type:"number", min:1 },
                 { f:"dataGB", label:"データ転送（GB/月）", type:"number", min:0 }],
  vpn:         [{ f:"qty", label:"接続数", type:"number", min:1 },
                { f:"dataGB", label:"データ転送（GB/月）", type:"number", min:0 }],
  transitgateway:[{ f:"qty", label:"アタッチメント数", type:"number", min:1 },
                  { f:"dataGB", label:"処理データ（GB/月）", type:"number", min:0 }],
  sqs:         [{ f:"requestsM", label:"リクエスト数（百万/月）", type:"number", min:0 },
                { f:"dataGB", label:"64KB超ペイロード追加分（GB）", type:"number", min:0 }],
  sns:         [{ f:"requestsM", label:"発行数（百万/月）", type:"number", min:0 },
                { f:"emailCount", label:"Eメール通知（千/月）", type:"number", min:0 },
                { f:"smsCount", label:"SMS通知（千/月）", type:"number", min:0 }],
  eventbridge: [{ f:"requestsM", label:"カスタムイベント（百万/月）", type:"number", min:0 }],
  stepfunctions:[{ f:"requestsM", label:"状態遷移数（百万/月）", type:"number", min:0 },
                 { f:"sfMode", label:"モード", type:"select", options:[{label:"Standard $0.025/千",value:"standard"},{label:"Express $1.00/百万",value:"express"}] }],
  kinesis:     [{ f:"qty", label:"シャード数", type:"number", min:1 },
                { f:"retentionHours", label:"保持期間（時間）", type:"select", options:[{label:"24時間（無料）",value:24},{label:"7日 $0.02/シャード/h",value:168},{label:"365日 $0.023/シャード/h",value:8760}] }],
  msk:         [{ f:"instanceOption", label:"ブローカータイプ", type:"select" },
                { f:"qty", label:"ブローカー数", type:"number", min:1 },
                { f:"storageGB", label:"ストレージ/ブローカー（GB）", type:"number", min:0 }],
  cognito:     [{ f:"mau", label:"MAU（月間アクティブユーザー）", type:"number", min:0 },
                { f:"federatedMau", label:"フェデレーションMAU", type:"number", min:0 }],
  waf:         [{ f:"qty", label:"WebACL数", type:"number", min:1 },
                { f:"ruleCount", label:"ルール数", type:"number", min:0 },
                { f:"requestsM", label:"リクエスト数（百万/月）", type:"number", min:0 }],
  cloudwatch:  [{ f:"metricsCount", label:"カスタムメトリクス数", type:"number", min:0 },
                { f:"storageGB", label:"ログ保存（GB/月）", type:"number", min:0 },
                { f:"ingestGB", label:"ログ取込（GB/月）", type:"number", min:0 },
                { f:"alarmsCount", label:"アラーム数", type:"number", min:0 },
                { f:"dashboardCount", label:"ダッシュボード数", type:"number", min:0 }],
  kms:         [{ f:"qty", label:"KMSキー数", type:"number", min:1 },
                { f:"requestsM", label:"APIリクエスト（百万/月）", type:"number", min:0 }],
  secretsmanager:[{ f:"qty", label:"シークレット数", type:"number", min:1 },
                  { f:"requestsM", label:"APIリクエスト（百万/月）", type:"number", min:0 }],
  cloudtrail:  [{ f:"qty", label:"証跡数（2つ目〜課金）", type:"number", min:1 },
                { f:"eventsM", label:"管理イベント（百万/月）", type:"number", min:0 },
                { f:"dataEventsM", label:"データイベント（百万/月）", type:"number", min:0 }],
  config:      [{ f:"qty", label:"設定アイテム記録数（/月）", type:"number", min:0, step:100 },
                { f:"rulesCount", label:"Config Rules評価数（/月）", type:"number", min:0 }],
  guardduty:   [{ f:"dataGB", label:"VPCフローログ（GB/月）", type:"number", min:0 },
                { f:"dnsGB", label:"DNSログ（GB/月）", type:"number", min:0 }],
  bedrock:     [{ f:"model", label:"モデル", type:"select", options:[
                    {label:"Claude 3 Haiku $0.001/1Kトークン",value:0.001},
                    {label:"Claude 3.5 Sonnet $0.003/1Kトークン",value:0.003},
                    {label:"Claude 3 Opus $0.015/1Kトークン",value:0.015},
                    {label:"Llama 3 8B $0.0003/1Kトークン",value:0.0003},
                  ]},
                { f:"inputTokensM", label:"入力トークン（百万/月）", type:"number", min:0, step:0.1 },
                { f:"outputTokensM", label:"出力トークン（百万/月）", type:"number", min:0, step:0.1 }],
  sagemaker:   [{ f:"instanceOption", label:"インスタンスタイプ", type:"select" },
                { f:"qty", label:"インスタンス数", type:"number", min:1 },
                { f:"hoursPerDay", label:"稼働時間/日", type:"number", min:0, max:24 },
                { f:"storageGB", label:"EBSストレージ（GB）", type:"number", min:0 }],
  rekognition: [{ f:"requestsM", label:"画像解析（百万枚/月）", type:"number", min:0, step:0.1 },
                { f:"videoMin", label:"動画解析（分/月）", type:"number", min:0 }],
  polly:       [{ f:"charsM", label:"文字数（百万/月）", type:"number", min:0, step:0.1 }],
  transcribe:  [{ f:"audioMin", label:"音声時間（分/月）", type:"number", min:0 }],
  translate:   [{ f:"charsM", label:"翻訳文字数（百万/月）", type:"number", min:0, step:0.1 }],
  comprehend:  [{ f:"requestsM", label:"ユニット数（百万/月、100文字=1ユニット）", type:"number", min:0 }],
  textract:    [{ f:"pagesM", label:"処理ページ数（百万/月）", type:"number", min:0, step:0.01 }],
  athena:      [{ f:"dataGB", label:"スキャンデータ（GB/クエリ×クエリ数）", type:"number", min:0 }],
  glue:        [{ f:"dpu", label:"DPU数", type:"number", min:2, step:1 },
                { f:"jobMin", label:"ジョブ実行時間（分/月）", type:"number", min:0 }],
  emr:         [{ f:"instanceOption", label:"コアインスタンスタイプ", type:"select" },
                { f:"qty", label:"インスタンス数", type:"number", min:1 },
                { f:"hoursPerDay", label:"クラスター稼働時間/日", type:"number", min:0, max:24 }],
  quicksight:  [{ f:"instanceOption", label:"ユーザータイプ", type:"select" },
                { f:"qty", label:"ユーザー数", type:"number", min:1 }],
  iotcore:     [{ f:"requestsM", label:"メッセージ数（百万/月）", type:"number", min:0 },
                { f:"deviceShadow", label:"Device Shadowオペレーション（百万/月）", type:"number", min:0 }],
  codecommit:  [{ f:"qty", label:"アクティブユーザー数", type:"number", min:1 }],
  codebuild:   [{ f:"buildMin", label:"ビルド時間（分/月）", type:"number", min:0 },
                { f:"instanceOption", label:"コンピューティングタイプ", type:"select", options:[
                    {label:"general1.small $0.005/分",value:0.005},
                    {label:"general1.medium $0.010/分",value:0.010},
                    {label:"general1.large $0.020/分",value:0.020},
                    {label:"gpu1.large $0.083/分",value:0.083}
                  ]}],
  codepipeline:[{ f:"qty", label:"パイプライン数", type:"number", min:1 }],
  xray:        [{ f:"requestsM", label:"トレース記録（百万/月）", type:"number", min:0 },
                { f:"scanM", label:"トレーススキャン（百万/月）", type:"number", min:0 }],
  dms:         [{ f:"instanceOption", label:"インスタンスタイプ", type:"select" },
                { f:"qty", label:"インスタンス数", type:"number", min:1 },
                { f:"storageGB", label:"ストレージ（GB）", type:"number", min:0 }],
  workspaces:  [{ f:"instanceOption", label:"バンドル", type:"select" },
                { f:"qty", label:"ユーザー数", type:"number", min:1 }],
  connect:     [{ f:"inboundMin", label:"インバウンド通話（分/月）", type:"number", min:0 },
                { f:"outboundMin", label:"アウトバウンド通話（分/月）", type:"number", min:0 }],
  // ── ネットワーク詳細 ──────────────────────────────────────────────────
  subnet: [
    { f:"subnetType", label:"サブネットタイプ", type:"select", options:[
        {label:"🌐 Public Subnet（インターネット接続あり）",value:"public"},
        {label:"🔒 Private Subnet（インターネット接続なし）",value:"private"},
        {label:"🗄️ Isolated Subnet（完全隔離）",value:"isolated"}]},
    { f:"cidr", label:"CIDRブロック", type:"select", options:[
        {label:"/24（256アドレス）例: 10.0.1.0/24",value:"/24"},
        {label:"/25（128アドレス）例: 10.0.1.0/25",value:"/25"},
        {label:"/26（64アドレス）例: 10.0.1.0/26",value:"/26"},
        {label:"/28（16アドレス）例: 10.0.1.0/28",value:"/28"},
        {label:"/16（65536アドレス）例: 10.0.0.0/16",value:"/16"}]},
    { f:"az", label:"アベイラビリティゾーン", type:"select", options:[
        {label:"ap-northeast-1a",value:"1a"},
        {label:"ap-northeast-1c",value:"1c"},
        {label:"ap-northeast-1d",value:"1d"},
        {label:"複数AZ（マルチAZ構成）",value:"multi"}]},
    { f:"qty", label:"サブネット数（同一設定）", type:"number", min:1, max:200},
    { f:"hasNatGateway", label:"NAT Gateway配置（Publicのみ）", type:"select", options:[
        {label:"なし",value:0},{label:"あり（+$45.26/月）",value:1}]},
    { f:"autoAssignPublicIp", label:"パブリックIP自動割り当て", type:"select", options:[
        {label:"有効（Public Subnet推奨）",value:"enabled"},
        {label:"無効",value:"disabled"}]},
  ],
  securitygroup: [
    { f:"sgType", label:"適用対象", type:"select", options:[
        {label:"🖥️ EC2インスタンス用",value:"ec2"},
        {label:"🗄️ RDS/データベース用",value:"rds"},
        {label:"⚖️ ロードバランサー用",value:"alb"},
        {label:"λ Lambda用",value:"lambda"},
        {label:"📦 コンテナ（ECS/EKS）用",value:"container"},
        {label:"🔌 その他/汎用",value:"other"}]},
    { f:"qty", label:"セキュリティグループ数", type:"number", min:1, max:2500},
    { f:"inboundRules", label:"インバウンドルール数", type:"number", min:0, max:60},
    { f:"outboundRules", label:"アウトバウンドルール数", type:"number", min:0, max:60},
    { f:"httpOpen", label:"HTTP (80) インバウンド", type:"select", options:[
        {label:"✅ 許可（0.0.0.0/0）",value:"allow"},
        {label:"❌ 拒否",value:"deny"}]},
    { f:"httpsOpen", label:"HTTPS (443) インバウンド", type:"select", options:[
        {label:"✅ 許可（0.0.0.0/0）",value:"allow"},
        {label:"❌ 拒否",value:"deny"}]},
    { f:"sshOpen", label:"SSH (22) インバウンド", type:"select", options:[
        {label:"❌ 拒否（推奨）",value:"deny"},
        {label:"⚠️ 許可（VPC内のみ）",value:"vpc"},
        {label:"🚨 全許可（非推奨）",value:"all"}]},
    { f:"dbPort", label:"DBポート インバウンド", type:"select", options:[
        {label:"なし",value:"none"},
        {label:"MySQL/Aurora (3306)",value:"3306"},
        {label:"PostgreSQL (5432)",value:"5432"},
        {label:"Redis (6379)",value:"6379"},
        {label:"MSSQL (1433)",value:"1433"}]},
  ],
  nacl: [
    { f:"naclType", label:"NACL適用対象", type:"select", options:[
        {label:"🌐 パブリックサブネット用",value:"public"},
        {label:"🔒 プライベートサブネット用",value:"private"},
        {label:"🗄️ データベースサブネット用",value:"db"}]},
    { f:"qty", label:"NACL数（各サブネットに1つ）", type:"number", min:1},
    { f:"inboundRules", label:"インバウンドルール数", type:"number", min:0, max:20},
    { f:"outboundRules", label:"アウトバウンドルール数", type:"number", min:0, max:20},
    { f:"allowHttp", label:"HTTP (80) 許可", type:"select", options:[
        {label:"✅ 許可",value:"allow"},{label:"❌ 拒否",value:"deny"}]},
    { f:"allowHttps", label:"HTTPS (443) 許可", type:"select", options:[
        {label:"✅ 許可",value:"allow"},{label:"❌ 拒否",value:"deny"}]},
    { f:"allowEphemeral", label:"エフェメラルポート (1024-65535)", type:"select", options:[
        {label:"✅ 許可（必須：レスポンス返送用）",value:"allow"},
        {label:"❌ 拒否（※通信不可になる可能性）",value:"deny"}]},
    { f:"denyList", label:"拒否リスト登録IP数", type:"number", min:0},
  ],
  igw:         [{ f:"dataGB", label:"アウトバウンド転送（GB/月）", type:"number", min:0,
                   note:"IGW経由のアウト転送は$0.114/GB（東京）" }],
  natgateway:  [{ f:"qty", label:"NAT Gateway数（AZごとに1つ推奨）", type:"number", min:1 },
                { f:"dataGB", label:"処理データ（GB/月）", type:"number", min:0 }],
  vpcendpoint: [{ f:"instanceOption", label:"エンドポイントタイプ", type:"select",
                   options:[
                     { label:"Gateway型（S3/DynamoDB）無料", value:0 },
                     { label:"Interface型 $0.014/h/ENI + $0.01/GB", value:0.014 }
                   ]},
                { f:"qty", label:"Interface ENI数（AZ数×サービス数）", type:"number", min:0 },
                { f:"dataGB", label:"処理データ（GB/月）", type:"number", min:0 }],
  eip:         [{ f:"qty", label:"未使用・追加EIP数（課金対象）", type:"number", min:0 }],
  enicard:     [], // 無料
  vpcpeering:  [{ f:"dataGB", label:"転送データ（GB/月、異なるAZ間）", type:"number", min:0 }],
  clientvpn:   [{ f:"qty", label:"エンドポイント数", type:"number", min:1 },
                { f:"connectionHours", label:"クライアント接続数×時間（合計/月）", type:"number", min:0 }],
  networkfirewall: [{ f:"qty", label:"Firewallエンドポイント数", type:"number", min:1 },
                    { f:"dataGB", label:"処理データ（GB/月）", type:"number", min:0 }],
  resolver:    [{ f:"qty", label:"Resolverエンドポイント数（ENI数）", type:"number", min:2 },
                { f:"requestsM", label:"DNSクエリ数（百万/月）", type:"number", min:0 }],
};

// detailed cost calculator using extended fields
function calcDetailedCost(node, rf) {
  const sid = node.serviceId;
  const p = node.pricing;
  let cost = 0;
  // AWSの月標準: 730h/月（= 365日 × 24h ÷ 12ヶ月）
  // カスタム稼働時間が設定されている場合はそちらを優先
  const defaultHours = 730;
  const hrs = (node.hoursPerDay != null && node.daysPerMonth != null)
    ? node.hoursPerDay * node.daysPerMonth
    : defaultHours;

  if (sid === "ec2") {
    cost = (node.instanceOption || p.base) * hrs * (node.qty||1) * rf;
  } else if (sid === "lambda") {
    const reqs = (node.requestsM||0) * 1e6;
    const billReqs = Math.max(0, reqs - 1e6);
    const memFactor = (node.memoryMB||128) / 1024;
    const durationSec = (node.avgDurationMs||100) / 1000;
    const gbSeconds = Math.max(0, reqs * memFactor * durationSec - 400000);
    cost = (billReqs * 0.0000002 + gbSeconds * 0.0000166667) * rf;
  } else if (sid === "ecs") {
    const vcpu = node.vcpu || 0.25;
    const memGB = node.memGB || 0.5;
    cost = ((0.05056 * vcpu + 0.00553 * memGB) * hrs * (node.qty||1)) * rf;
  } else if (sid === "eks") {
    cost = (0.10 * 730 * (node.qty||1)) * rf;
  } else if (sid === "lightsail") {
    cost = (node.instanceOption||p.base) * (node.qty||1) * rf;
  } else if (sid === "s3") {
    const stdCost = Math.max(0, (node.storageGB||0) - 5) * 0.025;
    const iaCost = (node.s3IaGB||0) * 0.019;
    const reqCost = (node.requestsM||0) * 0.0004;
    const xferCost = (node.dataGB||0) * 0.114;
    cost = (stdCost + iaCost + reqCost + xferCost) * rf;
  } else if (sid === "ebs") {
    const storageCost = (node.qty||1) * (node.storageGB||20) * 0.096;
    const iopsCost = Math.max(0, (node.iops||0) - 3000) * 0.006;
    cost = (storageCost + iopsCost) * rf;
  } else if (sid === "efs") {
    cost = (node.storageGB||0) * (node.accessClass||0.36) * rf;
  } else if (sid === "glacier") {
    const storeCost = (node.storageGB||0) * 0.005;
    const retrieveCost = (node.retrievalGB||0) * 0.01;
    cost = (storeCost + retrieveCost) * rf;
  } else if (sid === "fsx") {
    cost = (node.storageGB||0) * (node.instanceOption||p.base) * rf + (node.throughputMBps||0) * 0.013 * rf;
  } else if (sid === "datasync") {
    cost = (node.dataGB||0) * 0.0125 * rf;
  } else if (sid === "rds") {
    const instCost = (node.instanceOption||p.base) * hrs * (node.qty||1) * (node.multiAZ||1);
    const storCost = (node.storageGB||20) * 0.138;
    const backCost = (node.backupGB||0) * 0.095;
    cost = (instCost + storCost + backCost) * rf;
  } else if (sid === "aurora") {
    if ((node.auroraMode||"provisioned") === "serverless") {
      cost = (node.storageGB||0) * 0.12 * rf;
    } else {
      cost = (0.073 * 730 * (node.qty||1) + (node.storageGB||0) * 0.12 + (node.ioRequests||0) * 0.2) * rf;
    }
  } else if (sid === "dynamodb") {
    if ((node.billingMode||"provisioned") === "ondemand") {
      cost = ((node.writeM||0) * 1.4842 + (node.readM||0) * 0.2968 + Math.max(0,(node.storageGB||0)-25) * 0.285) * rf;
    } else {
      const wcu = node.wcu||0; const rcu = node.rcu||0;
      cost = (Math.max(0,wcu-25)*0.742 + Math.max(0,rcu-25)*0.1484 + Math.max(0,(node.storageGB||0)-25)*0.285) * rf;
    }
  } else if (sid === "elasticache") {
    cost = (node.instanceOption||p.base) * (node.hoursPerDay||24) * (node.daysPerMonth||30) * (node.qty||1) * rf;
  } else if (sid === "documentdb") {
    cost = ((node.instanceOption||0.094) * 730 * (node.qty||1) + (node.storageGB||0) * 0.12) * rf;
  } else if (sid === "neptune") {
    cost = (node.instanceOption||0.138) * 730 * (node.qty||1) * rf;
  } else if (sid === "redshift") {
    cost = (node.instanceOption||0.25) * (node.hoursPerDay||24) * (node.daysPerMonth||30) * (node.qty||1) * rf;
  } else if (sid === "opensearch") {
    cost = ((node.instanceOption||0.098) * 730 * (node.qty||1) + (node.storageGB||0) * 0.096) * rf;
  } else if (["subnet","securitygroup","nacl","enicard"].includes(sid)) {
    cost = 0; // 無料
  } else if (sid === "igw") {
    cost = (node.dataGB||0) * 0.114 * rf;
  } else if (sid === "natgateway") {
    cost = ((0.062 * 730 * (node.qty||1)) + (node.dataGB||0) * 0.062 * (node.qty||1)) * rf;
  } else if (sid === "vpcendpoint") {
    const epRate = node.instanceOption ?? 0.014;
    if (epRate === 0) {
      cost = 0; // Gateway型は無料
    } else {
      cost = (epRate * 730 * (node.qty||1) + (node.dataGB||0) * 0.01) * rf;
    }
  } else if (sid === "eip") {
    cost = (node.qty||0) * 0.005 * 730 * rf;
  } else if (sid === "vpcpeering") {
    cost = (node.dataGB||0) * 0.01 * rf;
  } else if (sid === "clientvpn") {
    cost = (0.10 * 730 * (node.qty||1) + (node.connectionHours||0) * 0.05) * rf;
  } else if (sid === "networkfirewall") {
    cost = (0.395 * 730 * (node.qty||1) + (node.dataGB||0) * 0.065) * rf;
  } else if (sid === "resolver") {
    cost = (0.125 * 730 * (node.qty||2) + (node.requestsM||0) * 0.4) * rf;
  } else if (sid === "alb") {
    const hourly = 0.008 * (node.qty||1);
    const lcuCost = (node.lcuPerHour||1) * 0.008 * 730;
    cost = (hourly * 730 + lcuCost) * rf;
  } else if (sid === "nlb") {
    cost = (0.0065 * 730 * (node.qty||1) + (node.lcuPerHour||1) * 0.0065 * 730) * rf;
  } else if (sid === "cloudfront") {
    const xferCost = Math.max(0,(node.dataGB||0) - 1024) * 0.114;
    const reqCost = (node.requestsM||0) * 0.009;
    const invCost = Math.max(0,(node.invalidations||0)-1000) * 0.005;
    cost = (xferCost + reqCost + invCost) * rf;
  } else if (sid === "apigateway") {
    const callCost = Math.max(0,(node.requestsM||0)-1) * 3.5;
    const cacheCost = (node.cacheGB||0) * 0.038 * 730;
    const xferCost = (node.dataGB||0) * 0.114;
    cost = (callCost + cacheCost + xferCost) * rf;
  } else if (sid === "route53") {
    const zoneCost = (node.qty||1) * 0.5;
    const queryCost = (node.requestsM||0) * 0.4;
    cost = (zoneCost + queryCost) * rf;
  } else if (sid === "directconnect") {
    cost = ((node.instanceOption||0.03) * 730 * (node.qty||1) + (node.dataGB||0) * 0.02) * rf;
  } else if (sid === "vpn") {
    cost = (0.048 * 730 * (node.qty||1) + (node.dataGB||0) * 0.09) * rf;
  } else if (sid === "transitgateway") {
    cost = (0.07 * 730 * (node.qty||1) + (node.dataGB||0) * 0.02) * rf;
  } else if (sid === "sqs") {
    cost = (Math.max(0,(node.requestsM||0)-1) * 0.4 + (node.dataGB||0) * 0.1) * rf;
  } else if (sid === "sns") {
    const pubCost = Math.max(0,(node.requestsM||0)-1) * 0.5;
    const emailCost = (node.emailCount||0) / 1000 * 2;
    const smsCost = (node.smsCount||0) * 0.075;
    cost = (pubCost + emailCost + smsCost) * rf;
  } else if (sid === "eventbridge") {
    cost = (node.requestsM||0) * 1.0 * rf;
  } else if (sid === "stepfunctions") {
    if ((node.sfMode||"standard") === "standard") {
      cost = Math.max(0,(node.requestsM||0)*1000-4) * 0.025 / 1000 * rf;
    } else {
      cost = (node.requestsM||0) * 1.0 * rf;
    }
  } else if (sid === "kinesis") {
    const shardCost = (node.qty||1) * 0.015 * 730;
    const retentionMult = (node.retentionHours||24) > 168 ? 0.023 : (node.retentionHours||24) > 24 ? 0.02 : 0;
    const extendedCost = retentionMult > 0 ? (node.qty||1) * retentionMult * 730 : 0;
    cost = (shardCost + extendedCost) * rf;
  } else if (sid === "msk") {
    cost = ((node.instanceOption||0.21) * 730 * (node.qty||1) + (node.storageGB||0)*(node.qty||1)*0.10) * rf;
  } else if (sid === "cognito") {
    const mau = node.mau || 0;
    const fedMau = node.federatedMau || 0;
    const billMau = Math.max(0, mau - 50000);
    cost = (billMau * 0.0055 + fedMau * 0.015) * rf;
  } else if (sid === "waf") {
    cost = ((node.qty||1) * 5 + (node.ruleCount||0) * 1 + (node.requestsM||0) * 0.6) * rf;
  } else if (sid === "cloudwatch") {
    const metricCost = Math.max(0,(node.metricsCount||0)-10) * 0.3;
    const logStoreCost = (node.storageGB||0) * 0.033;
    const logIngestCost = (node.ingestGB||0) * 0.76;
    const alarmCost = Math.max(0,(node.alarmsCount||0)-10) * 0.1;
    const dashCost = Math.max(0,(node.dashboardCount||0)-3) * 3;
    cost = (metricCost + logStoreCost + logIngestCost + alarmCost + dashCost) * rf;
  } else if (sid === "kms") {
    cost = ((node.qty||1) * 1 + (node.requestsM||0) * 0.03) * rf;
  } else if (sid === "secretsmanager") {
    cost = ((node.qty||1) * 0.4 + (node.requestsM||0) * 0.05) * rf;
  } else if (sid === "cloudtrail") {
    const trailCost = Math.max(0,(node.qty||1)-1) * 2;
    const eventCost = (node.eventsM||0) * 0.1;
    const dataCost = (node.dataEventsM||0) * 0.1;
    cost = (trailCost + eventCost + dataCost) * rf;
  } else if (sid === "config") {
    const itemCost = (node.qty||0) * 0.003;
    const rulesCost = (node.rulesCount||0) * 0.001;
    cost = (itemCost + rulesCost) * rf;
  } else if (sid === "guardduty") {
    cost = ((node.dataGB||0) * 1.0 + (node.dnsGB||0) * 0.45) * rf;
  } else if (sid === "bedrock") {
    const modelRate = node.model || 0.003;
    cost = ((node.inputTokensM||0) * 1000 * modelRate + (node.outputTokensM||0) * 1000 * modelRate * 5) * rf;
  } else if (sid === "sagemaker") {
    const instCost = (node.instanceOption||0.054) * (node.hoursPerDay||8) * 30 * (node.qty||1);
    const storCost = (node.storageGB||0) * 0.14;
    cost = (instCost + storCost) * rf;
  } else if (sid === "rekognition") {
    cost = ((node.requestsM||0) * 1.0 + (node.videoMin||0) * 0.1) * rf;
  } else if (sid === "polly") {
    cost = (node.charsM||0) * 4.0 * rf;
  } else if (sid === "transcribe") {
    cost = (node.audioMin||0) * 0.024 * rf;
  } else if (sid === "translate") {
    cost = Math.max(0, (node.charsM||0) - 2) * 15.0 * rf;
  } else if (sid === "comprehend") {
    cost = (node.requestsM||0) * 1.0 * rf;
  } else if (sid === "textract") {
    cost = (node.pagesM||0) * 1.5 * rf;
  } else if (sid === "athena") {
    cost = (node.dataGB||0) / 1000 * 5.0 * rf;
  } else if (sid === "glue") {
    cost = ((node.dpu||2) * (node.jobMin||0) / 60) * 0.44 * rf;
  } else if (sid === "emr") {
    const ec2Rate = node.instanceOption || 0.0544;
    const emrFee = ec2Rate * 0.05 / 0.0544;
    cost = (ec2Rate + emrFee) * (node.hoursPerDay||8) * 30 * (node.qty||1) * rf;
  } else if (sid === "quicksight") {
    cost = (node.instanceOption||18) * (node.qty||1) * rf;
  } else if (sid === "iotcore") {
    cost = ((node.requestsM||0) * 1.0 + (node.deviceShadow||0) * 1.25) * rf;
  } else if (sid === "codecommit") {
    cost = Math.max(0,(node.qty||0)-5) * 1.0 * rf;
  } else if (sid === "codebuild") {
    const rate = node.instanceOption || 0.005;
    cost = Math.max(0, (node.buildMin||0) - 100) * rate * rf;
  } else if (sid === "codepipeline") {
    cost = Math.max(0,(node.qty||1)-1) * 1.0 * rf;
  } else if (sid === "xray") {
    cost = (Math.max(0,(node.requestsM||0)-1) * 5.0 + Math.max(0,(node.scanM||0)-1) * 0.5) * rf;
  } else if (sid === "dms") {
    cost = ((node.instanceOption||0.018) * 730 * (node.qty||1) + (node.storageGB||0) * 0.138) * rf;
  } else if (sid === "workspaces") {
    cost = (node.instanceOption||35) * (node.qty||1) * rf;
  } else if (sid === "connect") {
    cost = ((node.inboundMin||0) * 0.018 + (node.outboundMin||0) * 0.024) * rf;
  } else if (sid === "ecr") {
    // ストレージ: $0.10/GB/月、無料枠500MB（0.5GB）
    const billableGB = Math.max(0, (node.storageGB||0) - (node.freeGB||0.5));
    // アウト転送（インターネット向け）: $0.114/GB、同一リージョン内は無料
    const xferCost = (node.dataGB||0) * 0.114;
    cost = (billableGB * 0.10 + xferCost) * rf;
  } else if (sid === "acm") {
    // パブリック証明書（ACM統合サービス用）は完全無料
    // エクスポータブル証明書のみ課金: FQDN $7/枚、ワイルドカード $79/枚
    const certType = node.instanceOption || 0;
    if (certType === 0) {
      cost = 0; // 無料
    } else {
      cost = certType * (node.qty||1) * rf;
    }
  } else {
    // fallback to original
    cost = calcNodeCost(node, rf);
  }
  return Math.round(cost * 100) / 100;
}

// ── CostTab component ─────────────────────────────────────────────────────────
function CostTab({ nodes, setNodes, rf, totalUSD, totalJPY, region, usdJpy = DEFAULT_USD_JPY }) {
  const [selectedId, setSelectedId] = useState(null);

  const detailedTotal = nodes.reduce((s, n) => s + calcDetailedCost(n, rf), 0);
  const detailedJPY = Math.round(detailedTotal * usdJpy);

  const updNode = (id, field, value) =>
    setNodes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));

  const selNode = selectedId ? nodes.find(n => n.id === selectedId) : null;

  // Auto-select first node
  useState(() => { if (nodes.length > 0 && !selectedId) setSelectedId(nodes[0].id); });

  const inputStyle = { width:"100%", fontSize:12, padding:"6px 8px", borderRadius:6, border:"0.5px solid #D1D5DB", background:"#FFFFFF", color:"#111827", boxSizing:"border-box", colorScheme:"light" };
  const labelStyle = { fontSize:11, color:"#6B7280", display:"block", marginBottom:3, fontWeight:500 };

  const renderField = (node, fld) => {
    const val = node[fld.f] ?? (fld.type === "select" && fld.options ? fld.options[0]?.value : fld.min ?? 0);
    return (
      <div key={fld.f} style={{ marginBottom:12 }}>
        <label style={labelStyle}>{fld.label}</label>
        {fld.type === "select" ? (
          <select value={val}
            onChange={e => updNode(node.id, fld.f, isNaN(parseFloat(e.target.value)) ? e.target.value : parseFloat(e.target.value))}
            style={inputStyle}>
            {(fld.options || node.pricing.options || []).map(o => <option key={o.value} value={o.value} style={{background:"#FFFFFF",color:"#111827"}}>{o.label}</option>)}
          </select>
        ) : (
          <input type="number" min={fld.min ?? 0} max={fld.max} step={fld.step ?? 1}
            value={val}
            onChange={e => updNode(node.id, fld.f, parseFloat(e.target.value) || 0)}
            style={inputStyle} />
        )}
      </div>
    );
  };

  // Build cost breakdown lines for selected node
  const getCostBreakdown = (node) => {
    if (!node) return [];
    const sid = node.serviceId;
    const rf2 = rf;
    const lines = [];
    const add = (label, val) => { if (val > 0) lines.push({ label, val: Math.round(val*100)/100 }); };

    if (sid === "ec2") {
      const hrs = (node.hoursPerDay??24) * (node.daysPerMonth??30);
      add(`インスタンス ${node.pricing.options?.find(o=>o.value===node.instanceOption)?.label||""} × ${hrs}h × ${node.qty||1}台`, (node.instanceOption||0) * hrs * (node.qty||1) * rf2);
    } else if (sid === "lambda") {
      const reqs = (node.requestsM||0)*1e6;
      const billReqs = Math.max(0, reqs - 1e6);
      const mem = (node.memoryMB||128)/1024;
      const dur = (node.avgDurationMs||100)/1000;
      const gbSec = Math.max(0, reqs * mem * dur - 400000);
      add(`リクエスト課金 (${(node.requestsM||0)}M - 1M無料枠)`, billReqs * 0.0000002 * rf2);
      add(`GB秒課金 (${gbSec.toFixed(0)} GB-sec - 400K無料)`, gbSec * 0.0000166667 * rf2);
    } else if (sid === "s3") {
      add(`標準ストレージ (${Math.max(0,(node.storageGB||0)-5)}GB課金)`, Math.max(0,(node.storageGB||0)-5)*0.025*rf2);
      add(`IAストレージ (${node.s3IaGB||0}GB)`, (node.s3IaGB||0)*0.019*rf2);
      add(`GETリクエスト (${node.requestsM||0}M)`, (node.requestsM||0)*0.0004*rf2);
      add(`アウト転送 (${node.dataGB||0}GB)`, (node.dataGB||0)*0.114*rf2);
    } else if (sid === "ebs") {
      add(`ストレージ (${node.qty||1}台 × ${node.storageGB||20}GB × $0.096)`, (node.qty||1)*(node.storageGB||20)*0.096*rf2);
      add(`プロビジョンドIOPS (${Math.max(0,(node.iops||0)-3000)} IOPS超過)`, Math.max(0,(node.iops||0)-3000)*0.006*rf2);
    } else if (sid === "rds") {
      const hrs2 = (node.hoursPerDay??24) * (node.daysPerMonth??30);
      add(`インスタンス (${hrs2}h × ${node.qty||1}台 × MultiAZ${node.multiAZ||1})`, (node.instanceOption||0)*hrs2*(node.qty||1)*(node.multiAZ||1)*rf2);
      add(`ストレージ (${node.storageGB||20}GB × $0.138)`, (node.storageGB||20)*0.138*rf2);
      add(`バックアップ (${node.backupGB||0}GB × $0.095)`, (node.backupGB||0)*0.095*rf2);
    } else if (sid === "aurora") {
      if ((node.auroraMode||"provisioned")==="serverless") {
        add(`ストレージ (${node.storageGB||0}GB)`, (node.storageGB||0)*0.12*rf2);
      } else {
        add(`インスタンス (${node.qty||1}台 × 730h × $0.073)`, 0.073*730*(node.qty||1)*rf2);
        add(`ストレージ (${node.storageGB||0}GB × $0.12)`, (node.storageGB||0)*0.12*rf2);
        add(`I/O (${node.ioRequests||0}M × $0.20)`, (node.ioRequests||0)*0.2*rf2);
      }
    } else if (sid === "dynamodb") {
      if ((node.billingMode||"provisioned")==="ondemand") {
        add(`書込みリクエスト (${node.writeM||0}M × $1.4842)`, (node.writeM||0)*1.4842*rf2);
        add(`読込みリクエスト (${node.readM||0}M × $0.2968)`, (node.readM||0)*0.2968*rf2);
        add(`ストレージ (${Math.max(0,(node.storageGB||0)-25)}GB課金)`, Math.max(0,(node.storageGB||0)-25)*0.285*rf2);
      } else {
        add(`WCU (${Math.max(0,(node.wcu||0)-25)}課金 × $0.742)`, Math.max(0,(node.wcu||0)-25)*0.742*rf2);
        add(`RCU (${Math.max(0,(node.rcu||0)-25)}課金 × $0.1484)`, Math.max(0,(node.rcu||0)-25)*0.1484*rf2);
        add(`ストレージ (${Math.max(0,(node.storageGB||0)-25)}GB課金)`, Math.max(0,(node.storageGB||0)-25)*0.285*rf2);
      }
    } else if (sid === "elasticache") {
      add(`ノード (${node.qty||1}台 × ${(node.hoursPerDay||24)*(node.daysPerMonth||30)}h)`, (node.instanceOption||0.034)*(node.hoursPerDay||24)*(node.daysPerMonth||30)*(node.qty||1)*rf2);
    } else if (sid === "cloudwatch") {
      add(`カスタムメトリクス (${Math.max(0,(node.metricsCount||0)-10)}個超過)`, Math.max(0,(node.metricsCount||0)-10)*0.3*rf2);
      add(`ログ取込 (${node.ingestGB||0}GB × $0.76)`, (node.ingestGB||0)*0.76*rf2);
      add(`ログ保存 (${node.storageGB||0}GB × $0.033)`, (node.storageGB||0)*0.033*rf2);
      add(`アラーム (${Math.max(0,(node.alarmsCount||0)-10)}個超過 × $0.10)`, Math.max(0,(node.alarmsCount||0)-10)*0.10*rf2);
      add(`ダッシュボード (${Math.max(0,(node.dashboardCount||0)-3)}個超過 × $3)`, Math.max(0,(node.dashboardCount||0)-3)*3*rf2);
    } else if (sid === "bedrock") {
      const rate = node.model||0.003;
      add(`入力トークン (${node.inputTokensM||0}M × $${(rate*1000).toFixed(3)}/1K)`, (node.inputTokensM||0)*1000*rate*rf2);
      add(`出力トークン (${node.outputTokensM||0}M × $${(rate*5000).toFixed(3)}/1K)`, (node.outputTokensM||0)*1000*rate*5*rf2);
    } else if (sid === "waf") {
      add(`WebACL (${node.qty||1}個 × $5)`, (node.qty||1)*5*rf2);
      add(`ルール (${node.ruleCount||0}個 × $1)`, (node.ruleCount||0)*1*rf2);
      add(`リクエスト (${node.requestsM||0}M × $0.60)`, (node.requestsM||0)*0.6*rf2);
    } else if (sid === "cognito") {
      add(`MAU課金 (${Math.max(0,(node.mau||0)-50000)}人 × $0.0055)`, Math.max(0,(node.mau||0)-50000)*0.0055*rf2);
      add(`フェデレーションMAU (${node.federatedMau||0}人 × $0.015)`, (node.federatedMau||0)*0.015*rf2);
    } else if (sid === "cloudfront") {
      add(`データ転送 (${Math.max(0,(node.dataGB||0)-1024)}GB課金)`, Math.max(0,(node.dataGB||0)-1024)*0.114*rf2);
      add(`HTTPSリクエスト (${node.requestsM||0}M × $0.009)`, (node.requestsM||0)*0.009*rf2);
      add(`無効化 (${Math.max(0,(node.invalidations||0)-1000)}件超過)`, Math.max(0,(node.invalidations||0)-1000)*0.005*rf2);
    } else if (sid === "sagemaker") {
      add(`インスタンス (${node.qty||1}台 × ${(node.hoursPerDay||8)*30}h)`, (node.instanceOption||0.054)*(node.hoursPerDay||8)*30*(node.qty||1)*rf2);
      add(`EBSストレージ (${node.storageGB||0}GB × $0.14)`, (node.storageGB||0)*0.14*rf2);
    } else if (sid === "sns") {
      add(`発行 (${Math.max(0,(node.requestsM||0)-1)}M課金 × $0.50)`, Math.max(0,(node.requestsM||0)-1)*0.5*rf2);
      add(`Eメール (${node.emailCount||0}千件 × $0.002)`, (node.emailCount||0)*2*rf2);
      add(`SMS (${node.smsCount||0}千件 × $0.075)`, (node.smsCount||0)*0.075*rf2);
    } else if (sid === "alb") {
      add(`固定費 (${node.qty||1}台 × 730h × $0.008)`, 0.008*730*(node.qty||1)*rf2);
      add(`LCU (${node.lcuPerHour||1}/h × 730h × $0.008)`, (node.lcuPerHour||1)*0.008*730*rf2);
    } else if (sid === "apigateway") {
      add(`APIコール (${Math.max(0,(node.requestsM||0)-1)}M課金 × $3.5)`, Math.max(0,(node.requestsM||0)-1)*3.5*rf2);
      add(`キャッシュ (${node.cacheGB||0}GB × 730h × $0.038)`, (node.cacheGB||0)*0.038*730*rf2);
      add(`データ転送 (${node.dataGB||0}GB)`, (node.dataGB||0)*0.114*rf2);
    } else if (sid === "kms") {
      add(`CMKキー (${node.qty||1}個 × $1)`, (node.qty||1)*1*rf2);
      add(`APIリクエスト (${node.requestsM||0}M × $0.03)`, (node.requestsM||0)*0.03*rf2);
    } else if (sid === "kinesis") {
      add(`シャード (${node.qty||1}本 × 730h × $0.015)`, (node.qty||1)*0.015*730*rf2);
      const retMult = (node.retentionHours||24)>168?0.023:(node.retentionHours||24)>24?0.02:0;
      add(`拡張保持 (${node.qty||1}本 × 730h × $${retMult})`, retMult>0?(node.qty||1)*retMult*730*rf2:0);
    } else if (sid === "connect") {
      add(`インバウンド (${node.inboundMin||0}分 × $0.018)`, (node.inboundMin||0)*0.018*rf2);
      add(`アウトバウンド (${node.outboundMin||0}分 × $0.024)`, (node.outboundMin||0)*0.024*rf2);
    } else if (sid === "ecr") {
      const billableGB = Math.max(0, (node.storageGB||0) - (node.freeGB||0.5));
      add(`ストレージ (${(node.storageGB||0)}GB - ${node.freeGB||0.5}GB無料 = ${billableGB.toFixed(1)}GB課金 × $0.10)`, billableGB*0.10*rf2);
      add(`インターネット転送 (${node.dataGB||0}GB × $0.114)`, (node.dataGB||0)*0.114*rf2);
      if ((node.storageGB||0) <= (node.freeGB||0.5)) lines.push({ label:"✅ 無料枠内（500MB以下）", val:0 });
    } else if (sid === "acm") {
      const certType = node.instanceOption || 0;
      if (certType === 0) {
        lines.push({ label:"✅ パブリック証明書（ACM統合サービス用）は完全無料", val:0 });
        lines.push({ label:"ALB / CloudFront / API Gateway 等との組み合わせで$0", val:0 });
      } else if (certType === 7) {
        add(`エクスポータブル FQDN証明書 (${node.qty||1}枚 × $7)`, 7*(node.qty||1)*rf2);
      } else if (certType === 79) {
        add(`エクスポータブル ワイルドカード証明書 (${node.qty||1}枚 × $79)`, 79*(node.qty||1)*rf2);
      }
    } else if (sid === "natgateway") {
      add(`固定費 (${node.qty||1}台 × 730h × $0.062)`, (node.qty||1)*0.062*730*rf2);
      add(`データ処理 (${node.dataGB||0}GB × $0.062)`, (node.dataGB||0)*0.062*(node.qty||1)*rf2);
    } else if (sid === "vpcendpoint") {
      const epRate = node.instanceOption ?? 0.014;
      if (epRate > 0) {
        add(`エンドポイント時間 (${node.qty||1} ENI × 730h × $${epRate})`, epRate*730*(node.qty||1)*rf2);
        add(`データ処理 (${node.dataGB||0}GB × $0.01)`, (node.dataGB||0)*0.01*rf2);
      } else {
        lines.push({ label:"Gateway型（S3/DynamoDB）は無料", val:0 });
      }
    } else if (sid === "igw") {
      add(`アウトバウンド転送 (${node.dataGB||0}GB × $0.114)`, (node.dataGB||0)*0.114*rf2);
    } else if (sid === "eip") {
      add(`未使用EIP (${node.qty||0}個 × 730h × $0.005)`, (node.qty||0)*0.005*730*rf2);
    } else if (sid === "vpcpeering") {
      add(`リージョン内異AZ間転送 (${node.dataGB||0}GB × $0.01)`, (node.dataGB||0)*0.01*rf2);
    } else if (sid === "directconnect") {
      add(`ポート時間 (${node.qty||1}接続 × 730h × $${node.instanceOption||0.03})`, (node.instanceOption||0.03)*730*(node.qty||1)*rf2);
      add(`データ転送 (${node.dataGB||0}GB × $0.02)`, (node.dataGB||0)*0.02*rf2);
    } else if (sid === "vpn") {
      add(`VPN接続時間 (${node.qty||1}接続 × 730h × $0.048)`, 0.048*730*(node.qty||1)*rf2);
      add(`データ転送 (${node.dataGB||0}GB × $0.09)`, (node.dataGB||0)*0.09*rf2);
    } else if (sid === "transitgateway") {
      add(`アタッチメント (${node.qty||1}個 × 730h × $0.07)`, 0.07*730*(node.qty||1)*rf2);
      add(`データ処理 (${node.dataGB||0}GB × $0.02)`, (node.dataGB||0)*0.02*rf2);
    } else if (sid === "networkfirewall") {
      add(`エンドポイント (${node.qty||1}個 × 730h × $0.395)`, 0.395*730*(node.qty||1)*rf2);
      add(`データ処理 (${node.dataGB||0}GB × $0.065)`, (node.dataGB||0)*0.065*rf2);
    } else if (sid === "clientvpn") {
      add(`エンドポイント (${node.qty||1}個 × 730h × $0.10)`, 0.10*730*(node.qty||1)*rf2);
      add(`接続時間 (${node.connectionHours||0}h × $0.05)`, (node.connectionHours||0)*0.05*rf2);
    } else if (sid === "resolver") {
      add(`エンドポイント (${node.qty||2}ENI × 730h × $0.125)`, 0.125*730*(node.qty||2)*rf2);
      add(`DNSクエリ (${node.requestsM||0}M × $0.004/万)`, (node.requestsM||0)*0.4*rf2);
    } else if (["subnet","securitygroup","nacl","enicard","vpc","iam"].includes(sid)) {
      lines.push({ label:"✅ このサービス自体は無料です", val:0 });
    }

    if (lines.length === 0) {
      const total = calcDetailedCost(node, rf2);
      if (total > 0) lines.push({ label: `${node.pricing.unit || "合計"}`, val: total });
    }
    return lines;
  };

  return (
    <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
      {/* Left column: service list */}
      <div style={{ width:280, background:"#FFFFFF", borderRight:"0.5px solid #E5E7EB", display:"flex", flexDirection:"column", flexShrink:0 }}>
        {/* Summary header */}
        <div style={{ padding:"14px 16px", borderBottom:"0.5px solid #E5E7EB", background:"#232F3E" }}>
          <div style={{ fontSize:10, color:"#aaa", marginBottom:2 }}>月額合計</div>
          <div style={{ fontSize:24, fontWeight:700, color:"#FF9900" }}>${detailedTotal.toFixed(2)}</div>
          <div style={{ fontSize:12, color:"#ccc" }}>≈ ¥{detailedJPY.toLocaleString()} ｜ 年 ${(detailedTotal*12).toFixed(0)}</div>
          <div style={{ fontSize:10, color:"#888", marginTop:4 }}>📍 {region}</div>
        </div>

        {/* Category bars */}
        {nodes.length > 0 && (() => {
          const bycat = nodes.reduce((acc, n) => {
            const cat = Object.values(AWS_SERVICES).find(c=>c.services.find(s=>s.id===n.serviceId));
            const key = cat?.label||"その他";
            if (!acc[key]) acc[key] = { color:cat?.color||"#888", total:0 };
            acc[key].total += calcDetailedCost(n, rf);
            return acc;
          }, {});
          const sorted = Object.entries(bycat).filter(([,v])=>v.total>0).sort((a,b)=>b[1].total-a[1].total);
          return (
            <div style={{ padding:"12px 14px", borderBottom:"0.5px solid #E5E7EB" }}>
              <div style={{ fontSize:10, fontWeight:600, color:"#6B7280", marginBottom:8, letterSpacing:"0.05em" }}>カテゴリ別内訳</div>
              {sorted.map(([cat,{color,total}]) => (
                <div key={cat} style={{ marginBottom:6 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, marginBottom:2 }}>
                    <span style={{ color:"#6B7280", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:160 }}>{cat}</span>
                    <span style={{ fontWeight:600, color:"#111827", flexShrink:0 }}>${total.toFixed(2)}</span>
                  </div>
                  <div style={{ height:5, background:"#F3F4F6", borderRadius:3 }}>
                    <div style={{ height:"100%", width:`${detailedTotal>0?Math.min(100,(total/detailedTotal)*100):0}%`, background:color, borderRadius:3 }}/>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Service list */}
        <div style={{ flex:1, overflowY:"auto" }}>
          {nodes.length === 0 ? (
            <div style={{ textAlign:"center", padding:32, color:"#6B7280", fontSize:12 }}>
              サービスを追加してください
            </div>
          ) : nodes.map(node => {
            const { color, bg } = categoryColor(node.serviceId);
            const cost = calcDetailedCost(node, rf);
            const isSel = selectedId === node.id;
            const pct = detailedTotal > 0 ? (cost/detailedTotal)*100 : 0;
            return (
              <div key={node.id}
                onClick={() => setSelectedId(node.id)}
                style={{ padding:"10px 14px", cursor:"pointer", background: isSel ? bg : "transparent", borderLeft:`3px solid ${isSel ? color : "transparent"}`, borderBottom:"0.5px solid #E5E7EB", transition:"all 0.15s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{node.icon}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:isSel?600:400, color: isSel ? color : "#111827", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{node.name}</div>
                    <div style={{ fontSize:10, color:"#6B7280", marginTop:1 }}>
                      {/* Show key setting summary */}
                      {node.pricing.options && (node.pricing.options.find(o=>o.value===node.instanceOption)?.label?.split(" ")[0] || "")}
                      {(node.qty||0) > 1 && ` × ${node.qty}`}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color: cost>0?"#FF9900":"#6B7280" }}>${cost.toFixed(2)}</div>
                    <div style={{ fontSize:10, color:"#6B7280" }}>¥{Math.round(cost*usdJpy).toLocaleString()}</div>
                    <div style={{ fontSize:9, color:"#9CA3AF" }}>{pct>0 ? `${pct.toFixed(0)}%` : "—"}</div>
                  </div>
                </div>
                {cost > 0 && (
                  <div style={{ height:2, background:"#F3F4F6", borderRadius:1, marginTop:6 }}>
                    <div style={{ height:"100%", width:`${Math.min(100,pct)}%`, background:color, borderRadius:1 }}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ padding:"8px 12px", background:"#F3F4F6", borderTop:"0.5px solid #E5E7EB", fontSize:10, color:"#6B7280", lineHeight:1.6 }}>
          💡 Savings Plans で最大66%割引 ｜ スポットで最大90%割引
        </div>
      </div>

      {/* Right column: detail panel */}
      <div style={{ flex:1, overflowY:"auto", background:"#F3F4F6" }}>
        {!selNode ? (
          <div style={{ textAlign:"center", padding:60, color:"#6B7280" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>👈</div>
            <div style={{ fontSize:14 }}>左のサービスを選択して詳細設定</div>
          </div>
        ) : (() => {
          const { color, bg } = categoryColor(selNode.serviceId);
          const cost = calcDetailedCost(selNode, rf);
          const fields = SERVICE_FIELDS[selNode.serviceId] || [];
          const breakdown = getCostBreakdown(selNode);
          const totalBreak = breakdown.reduce((s,l)=>s+l.val,0);

          return (
            <div style={{ maxWidth:720, margin:"0 auto", padding:20 }}>
              {/* Service header */}
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 20px", background:bg, borderRadius:12, marginBottom:16, border:`0.5px solid ${color}40` }}>
                <span style={{ fontSize:32 }}>{selNode.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:18, fontWeight:700, color }}>{selNode.name}</div>
                  <div style={{ fontSize:12, color:"#6B7280", marginTop:2 }}>{selNode.desc}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:26, fontWeight:700, color:"#FF9900" }}>${cost.toFixed(2)}</div>
                  <div style={{ fontSize:12, color:"#6B7280" }}>¥{Math.round(cost*usdJpy).toLocaleString()}/月</div>
                  <div style={{ fontSize:11, color:"#6B7280" }}>年額 ${(cost*12).toFixed(0)}</div>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {/* Settings card */}
                <div style={{ background:"#FFFFFF", borderRadius:10, border:"0.5px solid #E5E7EB", overflow:"hidden" }}>
                  <div style={{ padding:"10px 16px", background:bg, borderBottom:`0.5px solid ${color}30`, display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:14 }}>⚙️</span>
                    <span style={{ fontSize:13, fontWeight:600, color }}>設定パラメータ</span>
                  </div>
                  <div style={{ padding:"14px 16px" }}>
                    {fields.length > 0 ? (
                      fields.map(fld => renderField(selNode, fld))
                    ) : (
                      <div style={{ fontSize:12, color:"#6B7280", padding:"8px 0" }}>
                        {selNode.pricing.note || "この項目はデフォルト設定で計算されます"}
                      </div>
                    )}
                    {selNode.pricing.note && fields.length > 0 && (
                      <div style={{ marginTop:8, padding:"6px 10px", background:bg, borderRadius:6, fontSize:11, color:color, lineHeight:1.5 }}>
                        ℹ️ {selNode.pricing.note}
                      </div>
                    )}
                  </div>
                </div>

                {/* Breakdown card */}
                <div style={{ background:"#FFFFFF", borderRadius:10, border:"0.5px solid #E5E7EB", overflow:"hidden" }}>
                  <div style={{ padding:"10px 16px", background:bg, borderBottom:`0.5px solid ${color}30`, display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:14 }}>📊</span>
                    <span style={{ fontSize:13, fontWeight:600, color }}>料金内訳</span>
                  </div>
                  <div style={{ padding:"14px 16px" }}>
                    {breakdown.length === 0 ? (
                      <div style={{ fontSize:12, color:"#6B7280" }}>設定を入力すると内訳が表示されます</div>
                    ) : breakdown.map((line, i) => (
                      <div key={i} style={{ marginBottom:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                          <span style={{ fontSize:11, color:"#6B7280", flex:1, paddingRight:8, lineHeight:1.4 }}>{line.label}</span>
                          <span style={{ fontSize:12, fontWeight:600, color:"#111827", flexShrink:0 }}>${line.val.toFixed(2)}</span>
                        </div>
                        <div style={{ height:5, background:"#F3F4F6", borderRadius:3 }}>
                          <div style={{ height:"100%", width:`${totalBreak>0?Math.min(100,(line.val/totalBreak)*100):0}%`, background:color, borderRadius:3 }}/>
                        </div>
                      </div>
                    ))}
                    {breakdown.length > 1 && (
                      <div style={{ borderTop:`0.5px solid ${color}30`, paddingTop:10, marginTop:4, display:"flex", justifyContent:"space-between" }}>
                        <span style={{ fontSize:12, fontWeight:600, color:"#111827" }}>小計</span>
                        <span style={{ fontSize:13, fontWeight:700, color:"#FF9900" }}>${totalBreak.toFixed(2)}/月</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Network free service info panel */}
              {["subnet","securitygroup","nacl","enicard","vpc","iam"].includes(selNode.serviceId) && (() => {
                const infoMap = {
                  subnet: {
                    title:"Subnetの設計ポイント",
                    items:[
                      "📌 Public Subnet: IGW経由でインターネット接続可。ALB・Bastionなどを配置",
                      "🔒 Private Subnet: NAT Gateway経由でアウトバウンドのみ可。EC2・ECS・RDSなどを配置",
                      "🗄️ Isolated Subnet: 完全隔離。RDS・ElastiCacheなどDB専用に",
                      "⚠️ 各サブネットは1つのAZに属する。マルチAZ構成では各AZにサブネットを作成",
                      "💡 AWSがサブネット内の5つのIPを予約（最初の4個 + 最後の1個）",
                      "🔄 Public Subnetには自動パブリックIP割り当てを有効化推奨",
                    ]
                  },
                  securitygroup: {
                    title:"Security Groupのベストプラクティス",
                    items:[
                      "🔐 ステートフル: インバウンドを許可すると、レスポンスは自動で返る",
                      "🎯 最小権限の原則: 必要なポート・IP範囲のみ許可",
                      "🚫 SSH (22) を 0.0.0.0/0 で開けるのはNG。踏み台サーバーまたはSSM推奨",
                      "🔗 SGをソースとしてSGを参照可能: RDS-SGはApp-SGからの3306のみ許可",
                      "📋 1インスタンスに最大5つのSGを適用可（上限緩和申請可）",
                      "⚙️ デフォルトSGはすべてのアウトバウンドを許可している点に注意",
                    ]
                  },
                  nacl: {
                    title:"Network ACLのポイント",
                    items:[
                      "📋 ステートレス: インバウンド・アウトバウンド両方にルールが必要",
                      "🔢 ルールは番号順に評価（小さい番号が優先）",
                      "⚡ エフェメラルポート (1024-65535) のアウトバウンド許可が必須",
                      "🛡️ SGの外側の防衛層として、特定IPのブロックに有効",
                      "📌 1つのサブネットには1つのNACLのみ適用可",
                      "✅ デフォルトNACLはすべてのトラフィックを許可",
                    ]
                  },
                  enicard: {
                    title:"Elastic Network Interface (ENI)",
                    items:[
                      "🔌 EC2インスタンスにアタッチされる仮想NIC",
                      "📌 プライマリENIはインスタンス削除時に自動削除される",
                      "🔄 セカンダリENIは別のインスタンスに付け替え可能",
                      "🛡️ 複数のSGをENIに適用可能",
                      "💡 ENIにEIPを関連付けることで固定IPを持てる",
                    ]
                  },
                  vpc: {
                    title:"VPC設計のベストプラクティス",
                    items:[
                      "🌐 CIDRは /16 〜 /28。一般的に 10.0.0.0/16 など RFC1918プライベートIPを使用",
                      "🔒 VPC自体は無料。NAT Gateway・VPC Endpointなどが課金対象",
                      "⚠️ CIDRは後から変更不可。最初に十分な広さを確保する",
                      "🏗️ リージョンに複数VPCを持つことが可能（デフォルト上限5）",
                      "🔗 VPC Peeringで他VPC・他アカウントのVPCと接続可",
                    ]
                  },
                  iam: {
                    title:"IAMのベストプラクティス",
                    items:[
                      "🔐 ルートアカウントは日常使用しない。MFAを必ず有効化",
                      "👤 人には最小権限のIAMユーザー・ロールを付与",
                      "🤖 EC2・Lambda等のAWSサービスにはIAMロールを使用",
                      "📋 ポリシーはアイデンティティベース vs リソースベースの2種類",
                      "✅ IAM自体は完全無料。作成できるエンティティ数に上限あり",
                    ]
                  },
                };
                const info = infoMap[selNode.serviceId];
                if (!info) return null;
                return (
                  <div style={{ marginTop:16, background:"#FFFFFF", borderRadius:10, border:`0.5px solid ${color}30`, overflow:"hidden" }}>
                    <div style={{ padding:"10px 16px", background:bg, borderBottom:`0.5px solid ${color}30`, display:"flex", alignItems:"center", gap:6 }}>
                      <span>📖</span>
                      <span style={{ fontSize:13, fontWeight:600, color }}>{info.title}</span>
                      <span style={{ marginLeft:"auto", fontSize:11, color:color, fontWeight:600, background:"white", padding:"2px 8px", borderRadius:99 }}>✅ 無料サービス</span>
                    </div>
                    <div style={{ padding:"12px 16px" }}>
                      {info.items.map((item,i) => (
                        <div key={i} style={{ fontSize:12, color:"#111827", lineHeight:1.6, marginBottom:5, paddingBottom:5, borderBottom: i < info.items.length-1 ? `0.5px solid #E5E7EB` : "none" }}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Pricing formula */}
              {!["subnet","securitygroup","nacl","enicard","vpc","iam"].includes(selNode.serviceId) && (
              <div style={{ marginTop:16, padding:"12px 16px", background:"#FFFFFF", borderRadius:10, border:`0.5px solid ${color}30`, borderLeft:`4px solid ${color}` }}>
                <div style={{ fontSize:11, fontWeight:600, color:"#6B7280", marginBottom:6 }}>💡 計算式</div>
                <div style={{ fontSize:12, color:"#111827", lineHeight:1.7 }}>
                  {selNode.serviceId === "ec2" && `[インスタンス単価] × [稼働時間/日] × [稼働日数/月] × [台数] × [リージョン係数${rf}]`}
                  {selNode.serviceId === "lambda" && `([リクエスト数 - 1M無料枠] × $0.0000002) + ([GB-秒 - 400K無料] × $0.0000166667) × [リージョン係数]`}
                  {selNode.serviceId === "s3" && `[標準ストレージGB - 5GB無料] × $0.025 + [IA GB] × $0.019 + [リクエスト] × $0.0004 + [転送GB] × $0.114`}
                  {selNode.serviceId === "rds" && `[インスタンス単価] × [稼働h] × [台数] × [MultiAZ係数] + [ストレージGB] × $0.138 + [バックアップGB] × $0.095`}
                  {selNode.serviceId === "dynamodb" && ((selNode.billingMode||"provisioned")==="ondemand" ? `書込みリクエスト × $1.4842 + 読込みリクエスト × $0.2968 + ストレージGB × $0.285（25GB無料）` : `WCU × $0.742 + RCU × $0.1484（各25無料） + ストレージGB × $0.285（25GB無料）`)}
                  {selNode.serviceId === "bedrock" && `入力トークン × [モデル単価] + 出力トークン × [モデル単価 × 5]（出力は入力の約5倍）`}
                  {selNode.serviceId === "cloudwatch" && `[メトリクス数-10無料] × $0.30 + [ログ取込GB] × $0.76 + [ログ保存GB] × $0.033 + [アラーム-10無料] × $0.10`}
                  {selNode.serviceId === "natgateway" && `[台数] × 730h × $0.062 + [処理データGB] × $0.062 × [台数]（NATは高コスト注意）`}
                  {selNode.serviceId === "vpcendpoint" && `Interface型: [ENI数] × 730h × $0.014 + [処理GB] × $0.01 ｜ Gateway型(S3/DynamoDB): 無料`}
                  {selNode.serviceId === "networkfirewall" && `[エンドポイント数] × 730h × $0.395 + [処理GB] × $0.065`}
                  {selNode.serviceId === "transitgateway" && `[アタッチメント数] × 730h × $0.07 + [処理GB] × $0.02`}
                  {selNode.serviceId === "directconnect" && `[接続数] × 730h × [ポート単価] + [転送GB] × $0.02`}
                  {selNode.serviceId === "clientvpn" && `[エンドポイント数] × 730h × $0.10 + [接続数×時間] × $0.05`}
                  {!["ec2","lambda","s3","rds","dynamodb","bedrock","cloudwatch","natgateway","vpcendpoint","networkfirewall","transitgateway","directconnect","clientvpn"].includes(selNode.serviceId) && `${selNode.pricing.unit} 単価 × 使用量 × リージョン係数 (${rf})`}
                </div>
              </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ── PDF Export (Artifact 対応・外部ライブラリ不使用) ─────────────────────────
// HTML を新ウィンドウで開き、ブラウザの印刷機能で PDF 保存
async function exportPDF({ nodes, connections, region, rf, usdJpy = DEFAULT_USD_JPY }) {
  const totalUSD = nodes.reduce((s,n)=>s+calcDetailedCost(n,rf),0);
  const totalJPY = Math.round(totalUSD * usdJpy);
  const now = new Date().toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"});

  const catsByService = {};
  Object.values(AWS_SERVICES).forEach(cat =>
    cat.services.forEach(s => { catsByService[s.id] = { label: cat.label, color: cat.color }; })
  );

  // ── Diagram SVG ────────────────────────────────────────────────────────────
  const NW=110, NH=88;
  const minX2 = nodes.length ? Math.min(...nodes.map(n=>n.x))-20 : 0;
  const minY2 = nodes.length ? Math.min(...nodes.map(n=>n.y))-20 : 0;
  const maxX2 = nodes.length ? Math.max(...nodes.map(n=>n.x+NW))+20 : 600;
  const maxY2 = nodes.length ? Math.max(...nodes.map(n=>n.y+NH))+20 : 300;
  const svgW = maxX2-minX2, svgH = maxY2-minY2;
  const ox=-minX2, oy=-minY2;
  const CONN_COLORS=["#FF9900","#3B82F6","#10B981","#EC4899","#8B5CF6"];
  const arrowDefs = CONN_COLORS.map((c,i)=>
    `<marker id="a${i}" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="${c}"/></marker>`
  ).join("");
  const connSvg = connections.map((conn,ci)=>{
    const fr=nodes.find(n=>n.id===conn.from), to=nodes.find(n=>n.id===conn.to);
    if(!fr||!to) return "";
    const col=CONN_COLORS[ci%5];
    const x1=fr.x+ox+NW, y1=fr.y+oy+NH/2, x2=to.x+ox, y2=to.y+oy+NH/2;
    const dx2=Math.abs(x2-x1)*0.5;
    return `<path d="M${x1} ${y1} C${x1+dx2} ${y1} ${x2-dx2} ${y2} ${x2} ${y2}" fill="none" stroke="${col}" stroke-width="2" stroke-dasharray="8 4" marker-end="url(#a${ci%5})"/>`;
  }).join("");
  const nodeSvg = nodes.map(node=>{
    const {color}=categoryColor(node.serviceId);
    const cost=calcDetailedCost(node,rf);
    const nx=node.x+ox, ny=node.y+oy;
    const iconSrc=awsIconSrc(node.serviceId,color);
    const h2=color.replace("#",""); const rr=parseInt(h2.slice(0,2),16),gg=parseInt(h2.slice(2,4),16),bb2=parseInt(h2.slice(4,6),16);
    return `<g>
      <rect x="${nx}" y="${ny}" width="${NW}" height="${NH}" rx="10" fill="#FFFFFF" stroke="${color}" stroke-width="1.2" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.12))"/>
      <rect x="${nx}" y="${ny}" width="${NW}" height="4" fill="${color}" opacity="0.95"/>
      <rect x="${nx+NW/2-20}" y="${ny+10}" width="40" height="40" rx="8" fill="rgba(${rr},${gg},${bb2},0.12)" stroke="rgba(${rr},${gg},${bb2},0.35)" stroke-width="1"/>
      ${iconSrc?`<image href="${iconSrc}" x="${nx+NW/2-18}" y="${ny+12}" width="36" height="36"/>`:`<text x="${nx+NW/2}" y="${ny+38}" text-anchor="middle" font-size="20" fill="${color}">${node.icon}</text>`}
      <text x="${nx+NW/2}" y="${ny+62}" text-anchor="middle" font-size="9" font-weight="bold" fill="#1F2937" font-family="Arial">${node.name.length>16?node.name.slice(0,15)+"…":node.name}</text>
      <rect x="${nx+NW/2-26}" y="${ny+68}" width="52" height="13" rx="6" fill="${cost>0?`rgba(${rr},${gg},${bb2},0.14)`:"rgba(16,185,129,0.12)"}" stroke="${cost>0?color:"#10B981"}" stroke-width="0.75"/>
      <text x="${nx+NW/2}" y="${ny+77}" text-anchor="middle" font-size="7.5" font-weight="bold" fill="${cost>0?color:"#10B981"}" font-family="Arial">${cost>0?`$${cost.toFixed(2)}/mo`:"FREE"}</text>
    </g>`;
  }).join("");

  // ── Cost rows ──────────────────────────────────────────────────────────────
  const sortedNodes = [...nodes].sort((a,b)=>calcDetailedCost(b,rf)-calcDetailedCost(a,rf));
  const serviceRows = sortedNodes.map((node,i)=>{
    const cost=calcDetailedCost(node,rf);
    const pct=totalUSD>0?Math.round(cost/totalUSD*100):0;
    const cat=catsByService[node.serviceId];
    const parts=[];
    if(node.pricing?.options){const o=node.pricing.options.find(o=>o.value===node.instanceOption);if(o)parts.push(o.label.split(" ")[0]);}
    if((node.qty||0)>1)parts.push(`×${node.qty}台`);
    if(node.storageGB)parts.push(`${node.storageGB}GB`);
    if(node.requestsM)parts.push(`${node.requestsM}M req`);
    const bg=i%2===0?"#fff":"#fafafa";
    return `<tr style="background:${bg}">
      <td style="padding:8px 10px"><div style="display:flex;align-items:center;gap:8px"><span style="font-size:16px">${node.icon}</span><div><div style="font-size:12px;font-weight:600;color:#232F3E">${node.name}</div><div style="font-size:10px;color:#888">${cat?.label||""}</div></div></div></td>
      <td style="padding:8px 10px;font-size:11px;color:#666">${parts.join(", ")||"default"}</td>
      <td style="padding:8px 10px"><div style="display:flex;align-items:center;gap:6px"><div style="flex:1;background:#eee;border-radius:3px;height:6px"><div style="width:${pct}%;background:${cat?.color||"#FF9900"};height:100%;border-radius:3px"></div></div><span style="font-size:10px;color:#999;white-space:nowrap">${pct}%</span></div></td>
      <td style="padding:8px 10px;font-size:13px;font-weight:700;color:${cost>0?"#FF6600":"#10B981"};text-align:right">${cost>0?`$${cost.toFixed(2)}`:"FREE"}</td>
      <td style="padding:8px 10px;font-size:11px;color:#666;text-align:right">¥${Math.round(cost*usdJpy).toLocaleString()}</td>
    </tr>`;
  }).join("");

  const bycat=nodes.reduce((acc,n)=>{const c=catsByService[n.serviceId];const k=c?.label||"その他";if(!acc[k])acc[k]={color:c?.color||"#888",total:0};acc[k].total+=calcDetailedCost(n,rf);return acc;},{});
  const catRows=Object.entries(bycat).sort((a,b)=>b[1].total-a[1].total).map(([cat,{color,total}])=>{
    const pct=totalUSD>0?Math.round(total/totalUSD*100):0;
    return `<tr><td style="padding:8px 10px;font-size:12px">${cat}</td><td style="padding:8px 10px"><div style="display:flex;align-items:center;gap:8px"><div style="flex:1;background:#eee;border-radius:4px;height:8px"><div style="width:${pct}%;background:${color};height:100%;border-radius:4px"></div></div><span style="font-size:11px;color:#666;white-space:nowrap">${pct}%</span></div></td><td style="padding:8px 10px;font-size:12px;font-weight:700;color:#FF6600;text-align:right">$${total.toFixed(2)}</td><td style="padding:8px 10px;font-size:12px;color:#666;text-align:right">¥${Math.round(total*usdJpy).toLocaleString()}</td></tr>`;
  }).join("");

  // ── Build HTML ─────────────────────────────────────────────────────────────
  const html=`<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"/><title>AWS Report ${now}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Helvetica Neue',Arial,sans-serif;background:#fff;color:#333}
@media print{.no-print{display:none!important}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.page-break{page-break-before:always}.dbg{max-height:none;height:auto}.dbg svg{max-height:340px!important;width:100%!important;height:auto!important}}
.hdr{background:#232F3E;color:white;padding:22px 32px}.hdr h1{font-size:20px;color:#FF9900;margin-bottom:5px}.hdr p{font-size:11px;color:#aaa}
.bar{background:#FF9900;height:4px}
.body{padding:24px 32px}
.sec{display:flex;align-items:center;gap:8px;margin:24px 0 12px}.sec .b{width:4px;height:18px;background:#FF9900;border-radius:2px}.sec h2{font-size:14px;font-weight:700;color:#232F3E}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:6px}
.card{border:1px solid #e8e8e8;border-radius:10px;padding:12px 14px;text-align:center}
.card .lbl{font-size:10px;color:#888;margin-bottom:5px}.card .val{font-size:18px;font-weight:700;color:#FF9900}
table{width:100%;border-collapse:collapse}
th{padding:8px 10px;background:#232F3E;color:white;font-size:11px;font-weight:600;text-align:left}
td{border-bottom:0.5px solid #f0f0f0;vertical-align:middle}
.ttl td{background:#232F3E;color:#FF9900;font-weight:700;font-size:13px;padding:9px 10px}
.dbg{background:#F3F4F6;border:1px solid #E5E7EB;border-radius:10px;padding:14px;overflow:hidden;max-height:420px}
.note{background:#FFF8E7;border-left:4px solid #FF9900;padding:9px 13px;border-radius:0 6px 6px 0;font-size:11px;color:#666;margin-top:20px}
.pbtn{position:fixed;top:14px;right:14px;background:#FF9900;color:#232F3E;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.2)}
</style></head><body>
<button class="pbtn no-print" onclick="window.print()">🖨️ 印刷 / PDF保存 (Ctrl+P)</button>
<div class="hdr"><h1>☁ AWS Architecture &amp; Cost Report</h1><p>Region: ${region} &nbsp;|&nbsp; ${now} &nbsp;|&nbsp; 1 USD = ${usdJpy} JPY</p></div>
<div class="bar"></div>
<div class="body">
  <div class="sec"><div class="b"></div><h2>Summary</h2></div>
  <div class="cards">
    <div class="card"><div class="lbl">Monthly (USD)</div><div class="val">$${totalUSD.toFixed(2)}</div></div>
    <div class="card"><div class="lbl">Monthly (JPY)</div><div class="val">¥${totalJPY.toLocaleString()}</div></div>
    <div class="card"><div class="lbl">Annual (USD)</div><div class="val">$${(totalUSD*12).toFixed(0)}</div></div>
    <div class="card"><div class="lbl">Services</div><div class="val">${nodes.length}</div></div>
  </div>
  ${nodes.length>0?`
  <div class="sec"><div class="b"></div><h2>Architecture Diagram</h2></div>
  <div class="dbg"><svg viewBox="0 0 ${svgW} ${svgH}" width="100%" height="${Math.min(svgH, 380)}" xmlns="http://www.w3.org/2000/svg" style="display:block;max-width:100%;max-height:380px">
    <defs><pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/></pattern>${arrowDefs}</defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    ${connSvg}${nodeSvg}
  </svg></div>`:""}
  <div class="page-break"></div>
  <div class="sec"><div class="b"></div><h2>Cost Breakdown by Service</h2></div>
  <table><thead><tr><th>Service</th><th>Configuration</th><th>Share</th><th style="text-align:right">USD/mo</th><th style="text-align:right">JPY/mo</th></tr></thead>
  <tbody>${serviceRows}<tr class="ttl"><td colspan="3">TOTAL</td><td style="text-align:right">$${totalUSD.toFixed(2)}</td><td style="text-align:right;color:#FFB74D">¥${totalJPY.toLocaleString()}</td></tr></tbody></table>
  <div class="sec" style="margin-top:28px"><div class="b"></div><h2>Category Summary</h2></div>
  <table><thead><tr><th>Category</th><th>Share</th><th style="text-align:right">USD/mo</th><th style="text-align:right">JPY/mo</th></tr></thead>
  <tbody>${catRows}</tbody></table>
  <div class="note">⚠️ 本レポートは概算です。実際の料金は aws.amazon.com/jp/pricing でご確認ください。</div>
</div></body></html>`;

  return { html, filename: `aws-report-${now.replace(/\//g, "-")}.html` };
}

// ── PDF Preview Modal ──────────────────────────────────────────────────────────
function PdfPreviewModal({ nodes, connections, region, rf, onClose, usdJpy = DEFAULT_USD_JPY }) {
  const [loading, setLoading] = useState(true);
  const [htmlData, setHtmlData] = useState(null);
  const [filename, setFilename] = useState("");
  const iframeRef = useRef(null);

  useEffect(() => {
    exportPDF({ nodes, connections, region, rf, usdJpy }).then(({ html, filename: fn }) => {
      setHtmlData(html);
      setFilename(fn);
      setLoading(false);
    });
  }, []);

  const handleDownload = () => {
    if (!htmlData) return;
    const blob = new Blob([htmlData], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:99999,
      background:"rgba(0,0,0,0.82)", backdropFilter:"blur(4px)",
      display:"flex", flexDirection:"column",
    }}>
      {/* Toolbar */}
      <div style={{
        display:"flex", alignItems:"center", gap:10, padding:"10px 16px",
        background:"#232F3E", flexShrink:0, borderBottom:"2px solid #FF9900",
      }}>
        <span style={{color:"#FF9900", fontWeight:700, fontSize:15}}>☁️ PDF プレビュー</span>
        <span style={{fontSize:11, color:"#888", marginLeft:4}}>{filename}</span>
        <div style={{flex:1}}/>
        <button onClick={handleDownload} style={{
          background:"#FF9900", color:"#232F3E", border:"none", borderRadius:8,
          padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer",
          display:"flex", alignItems:"center", gap:6,
        }}>⬇️ HTMLダウンロード</button>
        <div style={{fontSize:11, color:"#888", maxWidth:220, lineHeight:1.4}}>
          ↑ ダウンロード後ブラウザで開き<br/><strong style={{color:"#ccc"}}>Ctrl+P → PDFとして保存</strong>
        </div>
        <button onClick={onClose} style={{
          background:"#444", color:"white", border:"none", borderRadius:8,
          padding:"8px 14px", fontSize:13, cursor:"pointer", marginLeft:4,
        }}>✕ 閉じる</button>
      </div>

      {/* Preview area */}
      <div style={{flex:1, overflow:"hidden", position:"relative", background:"#3a3a3a"}}>
        {loading && (
          <div style={{
            position:"absolute", inset:0, display:"flex", alignItems:"center",
            justifyContent:"center", flexDirection:"column", gap:12, color:"white",
          }}>
            <div style={{fontSize:32}}>⏳</div>
            <div style={{fontSize:14, color:"#aaa"}}>プレビューを生成中...</div>
          </div>
        )}
        {htmlData && (
          <iframe
            ref={iframeRef}
            srcDoc={htmlData}
            style={{width:"100%", height:"100%", border:"none", background:"white"}}
            title="PDF Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>
    </div>
  );
}


// AWS service → draw.io mxgraph.aws4 shape mapping
const DRAWIO_SHAPE = {
    ec2:"mxgraph.aws4.ec2", lambda:"mxgraph.aws4.lambda", ecs:"mxgraph.aws4.ecs",
    eks:"mxgraph.aws4.eks", lightsail:"mxgraph.aws4.lightsail",
    elasticbeanstalk:"mxgraph.aws4.elastic_beanstalk",
    s3:"mxgraph.aws4.s3", ebs:"mxgraph.aws4.elastic_block_store",
    efs:"mxgraph.aws4.elastic_file_system", glacier:"mxgraph.aws4.glacier",
    rds:"mxgraph.aws4.rds", aurora:"mxgraph.aws4.aurora",
    dynamodb:"mxgraph.aws4.dynamodb", elasticache:"mxgraph.aws4.elasticache",
    redshift:"mxgraph.aws4.redshift",
    vpc:"mxgraph.aws4.vpc", subnet:"mxgraph.aws4.subnet",
    alb:"mxgraph.aws4.application_load_balancer",
    cloudfront:"mxgraph.aws4.cloudfront", apigateway:"mxgraph.aws4.api_gateway",
    route53:"mxgraph.aws4.route_53", natgateway:"mxgraph.aws4.nat_gateway",
    igw:"mxgraph.aws4.internet_gateway", transitgateway:"mxgraph.aws4.transit_gateway",
    directconnect:"mxgraph.aws4.direct_connect", vpn:"mxgraph.aws4.site_to_site_vpn",
    sqs:"mxgraph.aws4.sqs", sns:"mxgraph.aws4.sns",
    eventbridge:"mxgraph.aws4.eventbridge", kinesis:"mxgraph.aws4.kinesis_data_streams",
    stepfunctions:"mxgraph.aws4.step_functions",
    iam:"mxgraph.aws4.role", cognito:"mxgraph.aws4.cognito",
    waf:"mxgraph.aws4.waf", cloudwatch:"mxgraph.aws4.cloudwatch",
    kms:"mxgraph.aws4.key_management_service", cloudtrail:"mxgraph.aws4.cloudtrail",
    secretsmanager:"mxgraph.aws4.secrets_manager",
    bedrock:"mxgraph.aws4.bedrock", sagemaker:"mxgraph.aws4.sagemaker",
    rekognition:"mxgraph.aws4.rekognition", glue:"mxgraph.aws4.glue",
    athena:"mxgraph.aws4.athena", emr:"mxgraph.aws4.emr",
    cloudformation:"mxgraph.aws4.cloudformation",
    codecommit:"mxgraph.aws4.codecommit", codepipeline:"mxgraph.aws4.codepipeline",
    appsync:"mxgraph.aws4.appsync",
    iotcore:"mxgraph.aws4.iot_core",
    securitygroup:"mxgraph.aws4.security_group",
    nacl:"mxgraph.aws4.network_access_control_list",
};

// Map draw.io hint → our serviceId
const hintToServiceId = (hint) => {
  const map = {
    ec2:"ec2",lambda:"lambda",ecs:"ecs",eks:"eks",
    elastic_beanstalk:"elasticbeanstalk",lightsail:"lightsail",
    s3:"s3",elastic_block_store:"ebs",elastic_file_system:"efs",glacier:"glacier",
    rds:"rds",aurora:"aurora",dynamodb:"dynamodb",elasticache:"elasticache",redshift:"redshift",
    application_load_balancer:"alb",cloudfront:"cloudfront",
    api_gateway:"apigateway",route_53:"route53",nat_gateway:"natgateway",
    internet_gateway:"igw",transit_gateway:"transitgateway",
    direct_connect:"directconnect",site_to_site_vpn:"vpn",
    vpc:"vpc",subnet:"subnet",security_group:"securitygroup",
    network_access_control_list:"nacl",
    sqs:"sqs",sns:"sns",eventbridge:"eventbridge",
    kinesis_data_streams:"kinesis",step_functions:"stepfunctions",
    role:"iam",cognito:"cognito",waf:"waf",cloudwatch:"cloudwatch",
    key_management_service:"kms",cloudtrail:"cloudtrail",secrets_manager:"secretsmanager",
    bedrock:"bedrock",sagemaker:"sagemaker",rekognition:"rekognition",
    glue:"glue",athena:"athena",emr:"emr",
    cloudformation:"cloudformation",codecommit:"codecommit",codepipeline:"codepipeline",
    appsync:"appsync",iot_core:"iotcore",
  };
  return map[hint] || null;
};

// Export XML helper
function exportDrawioXml(nodes, connections, rf) {
  const esc = s => String(s)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&apos;");
  const idMap = {};
  nodes.forEach((n,i) => { idMap[n.id] = `aws_${i}`; });
  const cells = nodes.map(node => {
    const mid = idMap[node.id];
    const { color } = categoryColor(node.serviceId);
    const shape = DRAWIO_SHAPE[node.serviceId];
    const cost = calcNodeCost(node, rf);
    const costStr = cost > 0 ? ` ($${cost.toFixed(2)}/月)` : "";
    const label = esc(node.name + costStr);
    const style = shape
      ? `sketch=0;outlineConnect=0;fontColor=#232F3E;fillColor=${color};strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=0;fontSize=11;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=${shape};`
      : `rounded=1;whiteSpace=wrap;html=0;fillColor=${color}33;strokeColor=${color};fontColor=#232F3E;fontSize=11;`;
    const w = 78, h = shape ? 78 : 60;
    return `<mxCell id="${mid}" value="${label}" style="${style}" vertex="1" parent="1"><mxGeometry x="${Math.round(node.x)}" y="${Math.round(node.y)}" width="${w}" height="${h}" as="geometry"/></mxCell>`;
  });
  const edges = connections.map((conn,i) => {
    const src = idMap[conn.from], tgt = idMap[conn.to];
    if (!src||!tgt) return null;
    return `<mxCell id="edge_${i}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=1;jettySize=auto;orthogonalLoop=1;html=1;strokeColor=#FF9900;strokeWidth=2;" edge="1" source="${src}" target="${tgt}" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>`;
  }).filter(Boolean);
  const now = new Date().toISOString();
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<mxfile host="app.diagrams.net" modified="${now}" agent="AWS Architecture Tool" version="24.0.0" type="device">`,
    `  <diagram name="AWS Architecture" id="page-1">`,
    `    <mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">`,
    `      <root>`,
    `        <mxCell id="0"/>`,
    `        <mxCell id="1" parent="0"/>`,
    ...cells.map(c=>`        ${c}`),
    ...edges.map(e=>`        ${e}`),
    `      </root>`,
    `    </mxGraphModel>`,
    `  </diagram>`,
    `</mxfile>`,
  ].join("\n");
}

// Parse .drawio file into sheet list
function parseDrawioSheets(xmlStr) {
  const doc = new DOMParser().parseFromString(xmlStr, "text/xml");
  const diagrams = [...doc.querySelectorAll("diagram")];
  if (!diagrams.length) return null;
  return diagrams.map(d => {
    const gm = d.querySelector("mxGraphModel");
    let cells = [], edges = [];
    if (gm) {
      cells = [...gm.querySelectorAll("mxCell[vertex='1']")].map(c => {
        const geo = c.querySelector("mxGeometry");
        const style = c.getAttribute("style")||"";
        const resMatch = style.match(/resIcon=mxgraph\.aws4\.([^;]+)/);
        const shapeMatch = style.match(/shape=mxgraph\.aws4\.([^;]+)/);
        return {
          id: c.getAttribute("id"),
          label: c.getAttribute("value")||"",
          x: parseFloat(geo?.getAttribute("x")||0),
          y: parseFloat(geo?.getAttribute("y")||0),
          hint: resMatch?.[1]||shapeMatch?.[1]||"",
        };
      }).filter(c=>c.id!=="0"&&c.id!=="1");
      edges = [...gm.querySelectorAll("mxCell[edge='1']")].map(c=>({
        id:c.getAttribute("id"),
        source:c.getAttribute("source"),
        target:c.getAttribute("target"),
      })).filter(e=>e.source&&e.target);
    }
    return { id:d.getAttribute("id"), name:d.getAttribute("name")||"Page", cells, edges };
  });
}

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({x:0,y:0});
  const [region, setRegion] = useState("東京 (ap-northeast-1)");
  const [activeTab, setActiveTab] = useState("canvas");
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({x:0,y:0});
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({x:0,y:0});
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [usdJpy, setUsdJpy] = useState(DEFAULT_USD_JPY);
  const [rateMode, setRateMode] = useState("manual"); // "auto" | "manual"
  const [rateFetching, setRateFetching] = useState(false);
  const [rateUpdatedAt, setRateUpdatedAt] = useState(null);
  const [showRatePanel, setShowRatePanel] = useState(false);
  const [manualRate, setManualRate] = useState(String(DEFAULT_USD_JPY));

  // Fetch live rate from Frankfurter API (ECB reference rate, no API key required)
  const fetchLiveRate = async () => {
    setRateFetching(true);
    try {
      const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=JPY");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rate = data?.rates?.JPY;
      if (rate && rate > 0) {
        const rounded = Math.round(rate * 100) / 100;
        setUsdJpy(rounded);
        setManualRate(String(rounded));
        setRateUpdatedAt(new Date());
        return rounded;
      }
    } catch(e) {
      console.warn("Rate fetch failed:", e);
      alert(`為替レートの取得に失敗しました。\n手動入力に切り替えます。\n(${e.message})`);
      setRateMode("manual");
    } finally {
      setRateFetching(false);
    }
    return null;
  };

  useEffect(() => {
    if (rateMode === "auto") fetchLiveRate();
  }, [rateMode]);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [savedList, setSavedList] = useState(()=>{
    try{return JSON.parse(localStorage.getItem("aws_arch_saves")||"[]");}catch{return [];}
  });
  const [drawioSheets, setDrawioSheets] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const drawioFileRef = useRef(null);

  const rf = REGION_FACTOR[region] ?? 1.0;
  const totalUSD = nodes.reduce((s,n)=>s+calcNodeCost(n,rf),0);
  const totalJPY = Math.round(totalUSD * usdJpy);

  // ── Canvas interaction ─────────────────────────────────────────────────────
  const handleCanvasMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    if (e.target === canvasRef.current || e.target.tagName === "rect" && e.target.getAttribute("fill")==="url(#dotgrid)") {
      setSelected(null); setConnecting(null);
      setIsPanning(true);
      setPanStart({x: e.clientX - pan.x, y: e.clientY - pan.y});
    }
  },[pan]);

  const handleCanvasMouseMove = useCallback((e) => {
    if (isPanning) { setPan({x: e.clientX-panStart.x, y: e.clientY-panStart.y}); return; }
    if (!dragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x)/zoom - dragOffset.x;
    const y = (e.clientY - rect.top - pan.y)/zoom - dragOffset.y;
    setNodes(prev=>prev.map(n=>n.id===dragging?{...n,x:Math.max(0,x),y:Math.max(0,y)}:n));
  },[dragging,dragOffset,isPanning,panStart,pan,zoom]);

  const handleCanvasMouseUp = useCallback(()=>{
    setDragging(null); setIsPanning(false);
  },[]);

  const handleWheel = useCallback((e)=>{
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z=>Math.max(0.2,Math.min(3,z*delta)));
  },[]);

  useEffect(()=>{
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener("wheel",handleWheel,{passive:false});
    return ()=>el.removeEventListener("wheel",handleWheel);
  },[handleWheel]);

  const handleDrop = (e)=>{
    e.preventDefault();
    try{
      const svc = JSON.parse(e.dataTransfer.getData("service"));
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX-rect.left-pan.x)/zoom - 60;
      const y = (e.clientY-rect.top-pan.y)/zoom - 50;
      const id = `node-${Date.now()}`;
      setNodes(prev=>[...prev,{
        id, serviceId:svc.id, name:svc.name, icon:svc.icon, desc:svc.desc, pricing:svc.pricing,
        x:Math.max(0,x), y:Math.max(0,y),
        qty:1, storageGB:20, dataGB:10, requestsM:1,
        instanceOption:svc.pricing?.options?.[0]?.value ?? svc.pricing?.base ?? 0,
        hoursPerDay:24, daysPerMonth:30,
      }]);
    }catch{}
  };

  const handleNodeMouseDown = (e,id)=>{
    if (connecting) return;
    e.stopPropagation();
    const node = nodes.find(n=>n.id===id);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x:(e.clientX-rect.left-pan.x)/zoom - node.x,
      y:(e.clientY-rect.top-pan.y)/zoom - node.y,
    });
    setDragging(id); setSelected(id);
  };

  const handleConnect = (e,id)=>{
    e.stopPropagation();
    if (!connecting){ setConnecting(id); return; }
    if (connecting===id){ setConnecting(null); return; }
    const exists = connections.find(c=>(c.from===connecting&&c.to===id)||(c.from===id&&c.to===connecting));
    if (!exists) setConnections(prev=>[...prev,{id:`c${Date.now()}`,from:connecting,to:id}]);
    setConnecting(null);
  };

  const del = ()=>{
    if (!selected) return;
    setConnections(prev=>prev.filter(c=>c.from!==selected&&c.to!==selected));
    setNodes(prev=>prev.filter(n=>n.id!==selected));
    setSelected(null);
  };

  useEffect(()=>{
    const onKey = e=>{
      if (e.key==="Escape") setConnecting(null);
      if ((e.key==="Delete"||e.key==="Backspace")&&selected&&document.activeElement.tagName!=="INPUT"&&document.activeElement.tagName!=="SELECT") del();
    };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[selected,nodes,connections]);

  const selectedNode = nodes.find(n=>n.id===selected);
  const updNode = (field,value)=>setNodes(prev=>prev.map(n=>n.id===selected?{...n,[field]:value}:n));

  // ── Save / Load ─────────────────────────────────────────────────────────────
  const serializeState = (name="")=>({
    version:1, name:name||`アーキテクチャ_${new Date().toLocaleDateString("ja-JP")}`,
    savedAt:new Date().toISOString(), region, nodes, connections,
  });

  const applyState = (data)=>{
    if (!data?.nodes) return alert("無効なファイルです");
    setNodes(data.nodes); setConnections(data.connections||[]);
    if (data.region) setRegion(data.region);
    setZoom(1); setPan({x:0,y:0}); setSelected(null);
  };

  const handleSaveFile = ()=>{
    const name = prompt("保存名",serializeState().name);
    if (name===null) return;
    const blob = new Blob([JSON.stringify(serializeState(name),null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url;
    a.download=`${name.replace(/[^\w\-_]/g,"_")}.json`; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),2000);
    setShowSaveMenu(false);
  };

  const handleLoadFile = (e)=>{
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev=>{ try{ applyState(JSON.parse(ev.target.result)); setShowSaveMenu(false); }catch{ alert("読み込み失敗"); } };
    reader.readAsText(file); e.target.value="";
  };

  const handleSaveBrowser = ()=>{
    const name = prompt("保存名",serializeState().name); if (name===null) return;
    const data = serializeState(name);
    const newList = [data,...savedList.filter(s=>s.name!==name)].slice(0,10);
    setSavedList(newList); localStorage.setItem("aws_arch_saves",JSON.stringify(newList));
    setShowSaveMenu(false);
    const t=document.createElement("div");
    t.style.cssText="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#232F3E;color:white;border:1px solid #FF9900;border-radius:10px;padding:10px 20px;font-size:13px;z-index:99998;";
    t.textContent=`✅ 「${name}」を保存しました`; document.body.appendChild(t);
    setTimeout(()=>t.remove(),3000);
  };

  const handleLoadBrowser = (data)=>{
    if (!window.confirm(`「${data.name}」を読み込みますか？\n現在の内容は失われます。`)) return;
    applyState(data); setShowSaveMenu(false);
  };

  const handleDeleteBrowser = (name)=>{
    const newList = savedList.filter(s=>s.name!==name);
    setSavedList(newList); localStorage.setItem("aws_arch_saves",JSON.stringify(newList));
  };

  // ── draw.io ─────────────────────────────────────────────────────────────────
  const handleExportDrawio = ()=>{
    if (nodes.length===0) return alert("サービスを追加してください");
    try {
      const xml = exportDrawioXml(nodes, connections, rf);
      const test = new DOMParser().parseFromString(xml,"text/xml");
      if (test.querySelector("parsererror")) throw new Error("XML検証エラー");
      const blob = new Blob([xml],{type:"application/xml;charset=utf-8"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href=url;
      a.download=`aws-architecture-${new Date().toLocaleDateString("ja-JP").replace(/\//g,"-")}.drawio`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(url),2000);
      setShowSaveMenu(false);
    } catch(e) {
      alert("エクスポートエラー: "+e.message);
    }
  };

  const importDrawioSheet = (sheet)=>{
    const serviceList = Object.values(AWS_SERVICES).flatMap(c=>c.services);
    let ctr = Date.now();
    const nodeIdMap = {};
    const newNodes = sheet.cells.map(cell=>{
      const sid = hintToServiceId(cell.hint);
      const svc = sid ? serviceList.find(s=>s.id===sid) : null;
      const labelClean = cell.label.replace(/<[^>]+>/g,"").trim().toLowerCase();
      const matched = svc || serviceList.find(s=>s.name.toLowerCase().includes(labelClean)||labelClean.includes(s.name.toLowerCase()));
      const id = `node-${++ctr}`;
      nodeIdMap[cell.id] = id;
      return {
        id, serviceId:matched?.id||"ec2", name:matched?.name||labelClean||"Node",
        icon:matched?.icon||"☁️", desc:matched?.desc||"", pricing:matched?.pricing||{unit:"",base:0},
        x:cell.x, y:cell.y, qty:1, storageGB:20, dataGB:10, requestsM:1,
        instanceOption:matched?.pricing?.options?.[0]?.value??matched?.pricing?.base??0,
      };
    });
    const newConns = sheet.edges.map((e,i)=>({
      id:`c${Date.now()}${i}`, from:nodeIdMap[e.source], to:nodeIdMap[e.target],
    })).filter(e=>e.from&&e.to);
    setNodes(newNodes); setConnections(newConns);
    setZoom(1); setPan({x:0,y:0}); setSelected(null);
    setDrawioSheets(null); setShowSaveMenu(false);
  };

  const handleDrawioFileLoad = (e)=>{
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev=>{
      const sheets = parseDrawioSheets(ev.target.result);
      if (!sheets||sheets.length===0) return alert("draw.ioファイルの読み込みに失敗しました");
      sheets.length===1 ? importDrawioSheet(sheets[0]) : setDrawioSheets(sheets);
    };
    reader.readAsText(file); e.target.value="";
  };

  const menuBtnStyle = (color,disabled=false)=>({
    background:disabled?"#1A1F28":"#151B24",
    color:disabled?"#444":"white",
    border:`0.5px solid ${disabled?"#2A3A4A":color}40`,
    borderRadius:7,padding:"8px 12px",fontSize:12,cursor:disabled?"not-allowed":"pointer",
    textAlign:"left",display:"flex",alignItems:"center",gap:8,
  });

  const handleExport = ()=>{
    if (nodes.length===0) return alert("サービスを追加してからPDF出力できます");
    setShowPreview(true);
  };

  // ── Sidebar filter ───────────────────────────────────────────────────────────
  const filteredServices = Object.entries(AWS_SERVICES).map(([catId,cat])=>({
    ...cat, catId,
    services: cat.services.filter(s=>
      !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat=>cat.services.length>0);

  // ── Arrow markers for connections ────────────────────────────────────────────
  const ARROW_COLORS = ["#FF9900","#60A5FA","#34D399","#F472B6","#A78BFA"];

  // ── Right-panel field renderer ───────────────────────────────────────────────
  const renderField = (node,fld)=>{
    const val = node[fld.f] ?? (fld.type==="select"&&fld.options ? fld.options[0]?.value : fld.min??0);
    const inp = {width:"100%",fontSize:12,padding:"5px 8px",borderRadius:6,border:"0.5px solid #D1D5DB",background:"#FFFFFF",color:"#111827",boxSizing:"border-box",colorScheme:"light"};
    return (
      <div key={fld.f} style={{marginBottom:10}}>
        <label style={{fontSize:11,color:"#6B7280",display:"block",marginBottom:3}}>{fld.label}</label>
        {fld.type==="select"
          ? <select value={val} onChange={e=>updNode(fld.f,isNaN(parseFloat(e.target.value))?e.target.value:parseFloat(e.target.value))} style={inp}>
              {(fld.options||node.pricing.options||[]).map(o=><option key={o.value} value={o.value} style={{background:"#FFFFFF",color:"#111827"}}>{o.label}</option>)}
            </select>
          : <input type="number" min={fld.min??0} max={fld.max} step={fld.step??1} value={val}
              onChange={e=>updNode(fld.f,parseFloat(e.target.value)||0)} style={inp}/>
        }
      </div>
    );
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",fontFamily:"var(--font-sans)",background:"#F3F4F6",overflow:"hidden"}}>

      {/* ── Header ── */}
      <div style={{background:"#232F3E",color:"white",padding:"0 12px",display:"flex",alignItems:"center",gap:10,height:46,flexShrink:0}}>
        <span style={{fontSize:18}}>☁️</span>
        <span style={{fontWeight:600,fontSize:14}}>AWS アーキテクチャ & 料金計算</span>
        <div style={{flex:1}}/>

        {/* Save/Load menu */}
        <div style={{position:"relative"}}>
          <button onClick={()=>setShowSaveMenu(v=>!v)}
            style={{display:"flex",alignItems:"center",gap:5,background:"#37475A",color:"white",border:"0.5px solid #4A5E73",borderRadius:6,padding:"5px 11px",fontSize:12,cursor:"pointer"}}>
            💾 保存 / 読み込み
          </button>
          {showSaveMenu && (
            <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:9999,background:"#1E2530",border:"1px solid #3A4A5A",borderRadius:10,minWidth:300,boxShadow:"0 8px 32px rgba(0,0,0,0.6)",overflow:"hidden"}}>
              <div style={{padding:"10px 14px",background:"#232F3E",borderBottom:"1px solid #3A4A5A",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"#FF9900",fontWeight:700,fontSize:13}}>💾 保存 / 読み込み</span>
                <button onClick={()=>setShowSaveMenu(false)} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:16}}>✕</button>
              </div>
              <div style={{padding:10,display:"flex",flexDirection:"column",gap:6}}>
                <div style={{fontSize:10,color:"#888",letterSpacing:"0.05em",padding:"2px 4px"}}>JSONファイル操作</div>
                <button onClick={handleSaveFile} style={menuBtnStyle("#FF9900")}>⬇️ JSONとして保存</button>
                <button onClick={()=>fileInputRef.current?.click()} style={menuBtnStyle("#60A5FA")}>📂 JSONから読み込み</button>
                <input ref={fileInputRef} type="file" accept=".json" style={{display:"none"}} onChange={handleLoadFile}/>

                <div style={{height:"0.5px",background:"#2A3A4A",margin:"4px 0"}}/>
                <div style={{fontSize:10,color:"#A78BFA",letterSpacing:"0.05em",padding:"2px 4px",fontWeight:600}}>draw.io 連携</div>
                <button onClick={handleExportDrawio} disabled={nodes.length===0} style={menuBtnStyle("#A78BFA",nodes.length===0)}>📐 draw.ioでエクスポート</button>
                <button onClick={()=>drawioFileRef.current?.click()} style={menuBtnStyle("#A78BFA")}>📥 draw.ioから読み込み</button>
                <input ref={drawioFileRef} type="file" accept=".drawio,.xml" style={{display:"none"}} onChange={handleDrawioFileLoad}/>
                <div style={{fontSize:10,color:"#555",padding:"0 4px 2px",lineHeight:1.5}}>※ 複数シートは選択ダイアログ表示</div>

                <div style={{height:"0.5px",background:"#2A3A4A",margin:"4px 0"}}/>
                <div style={{fontSize:10,color:"#888",letterSpacing:"0.05em",padding:"2px 4px"}}>ブラウザ保存（最大10件）</div>
                <button onClick={handleSaveBrowser} disabled={nodes.length===0} style={menuBtnStyle("#34D399",nodes.length===0)}>🔖 ブラウザに保存</button>
                {savedList.length>0 ? (
                  <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:2}}>
                    {savedList.map(s=>(
                      <div key={s.name} style={{display:"flex",alignItems:"center",gap:6,background:"#151B24",borderRadius:6,padding:"6px 10px",border:"0.5px solid #2A3A4A"}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,color:"white",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div>
                          <div style={{fontSize:10,color:"#666"}}>{s.nodes?.length||0}サービス · {new Date(s.savedAt).toLocaleDateString("ja-JP")}</div>
                        </div>
                        <button onClick={()=>handleLoadBrowser(s)} style={{background:"#37475A",color:"white",border:"none",borderRadius:5,padding:"3px 9px",fontSize:11,cursor:"pointer"}}>読込</button>
                        <button onClick={()=>handleDeleteBrowser(s.name)} style={{background:"none",color:"#EF4444",border:"0.5px solid #EF4444",borderRadius:5,padding:"3px 7px",fontSize:11,cursor:"pointer"}}>✕</button>
                      </div>
                    ))}
                  </div>
                ):(
                  <div style={{fontSize:11,color:"#555",textAlign:"center",padding:"4px"}}>保存データなし</div>
                )}
              </div>
            </div>
          )}
        </div>
        {showSaveMenu && <div style={{position:"fixed",inset:0,zIndex:9998}} onClick={()=>setShowSaveMenu(false)}/>}

        <select value={region} onChange={e=>setRegion(e.target.value)}
          style={{background:"#37475A",color:"white",border:"0.5px solid #4A5E73",borderRadius:6,padding:"4px 8px",fontSize:12,cursor:"pointer",colorScheme:"dark"}}>
          {Object.keys(REGION_FACTOR).map(r=><option key={r} style={{background:"#37475A",color:"white"}}>{r}</option>)}
        </select>

        <div style={{background:"#FF9900",color:"#232F3E",borderRadius:6,padding:"4px 10px",fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>
          ${totalUSD.toFixed(2)}/月 <span style={{fontWeight:400,fontSize:11}}>≈ ¥{totalJPY.toLocaleString()}</span>
        </div>

        {/* Exchange rate button */}
        <div style={{position:"relative"}}>
          <button onClick={()=>setShowRatePanel(v=>!v)}
            title="為替レート設定"
            style={{display:"flex",alignItems:"center",gap:5,background: rateMode==="auto" ? "#1E3A2F" : "#37475A",color:rateMode==="auto"?"#34D399":"white",border:`0.5px solid ${rateMode==="auto"?"#34D399":"#4A5E73"}`,borderRadius:6,padding:"5px 11px",fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>
            {rateFetching ? "⏳" : "💱"} 1 USD = ¥{usdJpy.toFixed(2)}
            {rateMode==="auto" && <span style={{fontSize:9,background:"#34D399",color:"#0F2419",borderRadius:4,padding:"1px 5px",fontWeight:700}}>LIVE</span>}
          </button>

          {showRatePanel && (
            <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:9999,background:"#1E2530",border:"1px solid #3A4A5A",borderRadius:10,width:300,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",overflow:"hidden"}}>
              <div style={{padding:"10px 14px",background:"#232F3E",borderBottom:"1px solid #3A4A5A",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"#FF9900",fontWeight:700,fontSize:13}}>💱 為替レート設定</span>
                <button onClick={()=>setShowRatePanel(false)} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:16}}>✕</button>
              </div>
              <div style={{padding:14}}>

                {/* Mode selector */}
                <div style={{display:"flex",gap:6,marginBottom:14}}>
                  {[["manual","✏️ 手動入力"],["auto","🌐 自動取得（ECB）"]].map(([m,label])=>(
                    <button key={m} onClick={()=>setRateMode(m)}
                      style={{flex:1,padding:"7px 0",fontSize:11,fontWeight:600,borderRadius:7,border:`1px solid ${rateMode===m?"#FF9900":"#3A4A5A"}`,background:rateMode===m?"rgba(255,153,0,0.15)":"transparent",color:rateMode===m?"#FF9900":"#888",cursor:"pointer"}}>
                      {label}
                    </button>
                  ))}
                </div>

                {rateMode==="manual" ? (
                  <div>
                    <label style={{fontSize:11,color:"#8B96A5",display:"block",marginBottom:6}}>1 USD = ? JPY</label>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <input type="number" min={1} max={999} step={0.01}
                        value={manualRate}
                        onChange={e=>setManualRate(e.target.value)}
                        style={{flex:1,fontSize:14,padding:"6px 10px",borderRadius:7,border:"1px solid #3A4A5A",background:"#151B24",color:"white",colorScheme:"dark"}}/>
                      <span style={{color:"#888",fontSize:12}}>JPY</span>
                    </div>
                    <button onClick={()=>{const v=parseFloat(manualRate);if(v>0){setUsdJpy(v);setShowRatePanel(false);}}}
                      style={{width:"100%",marginTop:10,background:"#FF9900",color:"#232F3E",border:"none",borderRadius:7,padding:"8px 0",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                      適用
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{fontSize:12,color:"#8B96A5",marginBottom:10,lineHeight:1.6}}>
                      欧州中央銀行（ECB）の参照レートを自動取得します。<br/>
                      <span style={{fontSize:10,color:"#666"}}>※ AWSは請求月末のBloombergレートを使用。本ツールの値は概算です。</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:"#151B24",borderRadius:7,marginBottom:10}}>
                      <span style={{fontSize:12,color:"#aaa"}}>現在のレート</span>
                      <span style={{fontSize:16,fontWeight:700,color:"#34D399"}}>¥{usdJpy.toFixed(2)}</span>
                    </div>
                    {rateUpdatedAt && (
                      <div style={{fontSize:10,color:"#555",textAlign:"right",marginBottom:8}}>
                        取得: {rateUpdatedAt.toLocaleTimeString("ja-JP")}
                      </div>
                    )}
                    <button onClick={()=>{fetchLiveRate().then(()=>setShowRatePanel(false));}}
                      disabled={rateFetching}
                      style={{width:"100%",background:rateFetching?"#2A3A4A":"#34D399",color:rateFetching?"#666":"#0F2419",border:"none",borderRadius:7,padding:"8px 0",fontSize:12,fontWeight:700,cursor:rateFetching?"not-allowed":"pointer"}}>
                      {rateFetching ? "⏳ 取得中..." : "🔄 レートを更新"}
                    </button>
                  </div>
                )}

                <div style={{marginTop:12,padding:"8px 10px",background:"rgba(255,153,0,0.08)",borderRadius:6,border:"0.5px solid rgba(255,153,0,0.2)"}}>
                  <div style={{fontSize:10,color:"#FF9900",marginBottom:3,fontWeight:600}}>💡 AWSの為替レートについて</div>
                  <div style={{fontSize:10,color:"#888",lineHeight:1.6}}>
                    AWS請求は内部的にUSDで計算され、請求確定時（翌月3〜8日）の<br/>
                    Bloombergレートで換算されます。レートはAWSコンソールの請求書で確認できます。
                  </div>
                </div>
              </div>
            </div>
          )}
          {showRatePanel && <div style={{position:"fixed",inset:0,zIndex:9998}} onClick={()=>setShowRatePanel(false)}/>}
        </div>

        <button onClick={handleExport} disabled={nodes.length===0}
          style={{display:"flex",alignItems:"center",gap:5,background:nodes.length===0?"#3A4A5A":"#E8A000",color:nodes.length===0?"#666":"#232F3E",border:"none",borderRadius:6,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:nodes.length===0?"not-allowed":"pointer",whiteSpace:"nowrap"}}>
          📄 PDF出力
        </button>
      </div>

      {/* ── Tab bar ── */}
      <div style={{background:"#37475A",display:"flex",flexShrink:0}}>
        {[["canvas","🏗️ アーキテクチャ"],["cost","💰 料金詳細"]].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)}
            style={{background:activeTab===id?"#070A12":"transparent",color:activeTab===id?"#FF9900":"#ccc",border:"none",padding:"8px 18px",fontSize:13,cursor:"pointer",borderTop:activeTab===id?"2px solid #FF9900":"2px solid transparent",fontWeight:activeTab===id?600:400}}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Main ── */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* ── Canvas tab ── */}
        {activeTab==="canvas" && (<>
          {/* Left sidebar */}
          <div style={{width:190,background:"#F9FAFB",borderRight:"0.5px solid #E5E7EB",overflowY:"auto",flexShrink:0,display:"flex",flexDirection:"column"}}>
            <div style={{padding:"8px",borderBottom:"0.5px solid #E5E7EB"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 サービスを検索"
                style={{width:"100%",background:"#FFFFFF",border:"0.5px solid #D1D5DB",borderRadius:6,padding:"5px 8px",fontSize:12,color:"#111827",boxSizing:"border-box",colorScheme:"light"}}/>
            </div>
            <div style={{flex:1,overflowY:"auto"}}>
              {filteredServices.map(cat=>(
                <div key={cat.catId}>
                  <div style={{padding:"5px 10px",fontSize:9,fontWeight:700,color:cat.color,background:"rgba(0,0,0,0.04)",letterSpacing:"0.08em"}}>{cat.label.toUpperCase()}</div>
                  {cat.services.map(svc=>(
                    <div key={svc.id} draggable onDragStart={e=>e.dataTransfer.setData("service",JSON.stringify(svc))}
                      style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px",cursor:"grab",borderBottom:"0.5px solid #F0F1F3"}}>
                      {awsIconSrc(svc.id,cat.color)
                        ? <img src={awsIconSrc(svc.id,cat.color)} width={20} height={20} style={{borderRadius:4,flexShrink:0}}/>
                        : <span style={{fontSize:14,width:20,textAlign:"center",flexShrink:0}}>{svc.icon}</span>
                      }
                      <div style={{minWidth:0}}>
                        <div style={{fontSize:11,fontWeight:500,color:"#1F2937",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{svc.name}</div>
                        <div style={{fontSize:9,color:"#9CA3AF",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{svc.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div style={{flex:1,position:"relative",overflow:"hidden"}}>
            {/* Toolbar */}
            <div style={{position:"absolute",top:10,right:12,zIndex:10,display:"flex",gap:6,alignItems:"center"}}>
              {connecting && <div style={{background:"#FFFFFF",border:"1px solid #A78BFA",borderRadius:8,padding:"5px 12px",fontSize:12,color:"#7C3AED",boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>接続先をクリック（Escでキャンセル）</div>}
              <div style={{display:"flex",gap:4,background:"#FFFFFF",border:"0.5px solid #D1D5DB",borderRadius:8,padding:"4px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                <button onClick={()=>setZoom(z=>Math.min(3,z*1.2))} style={{background:"none",border:"none",color:"#4B5563",cursor:"pointer",fontSize:16,width:26,height:26}}>+</button>
                <span style={{color:"#6B7280",fontSize:12,alignSelf:"center",minWidth:36,textAlign:"center"}}>{Math.round(zoom*100)}%</span>
                <button onClick={()=>setZoom(z=>Math.max(0.2,z*0.8))} style={{background:"none",border:"none",color:"#4B5563",cursor:"pointer",fontSize:16,width:26,height:26}}>−</button>
                <button onClick={()=>{setZoom(1);setPan({x:0,y:0});}} style={{background:"none",border:"none",color:"#4B5563",cursor:"pointer",fontSize:13,width:26,height:26}}>⊙</button>
              </div>
            </div>

            <svg ref={canvasRef}
              style={{width:"100%",height:"100%",cursor:isPanning?"grabbing":dragging?"grabbing":"default"}}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              onDrop={handleDrop} onDragOver={e=>e.preventDefault()}>
              <defs>
                <pattern id="dotgrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.8" fill="rgba(0,0,0,0.08)"/>
                </pattern>
                <pattern id="dotgridLarge" width="120" height="120" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1.2" fill="rgba(0,0,0,0.05)"/>
                </pattern>
                <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(0,0,0,0.18)"/>
                </filter>
                <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF"/>
                  <stop offset="100%" stopColor="#F8F9FB"/>
                </linearGradient>
                {ARROW_COLORS.map((c,i)=>(
                  <marker key={i} id={`arr${i}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill={c}/>
                  </marker>
                ))}
                <style>{`
                  @keyframes dash{to{stroke-dashoffset:-22;}}
                  .adash{animation:dash 1.2s linear infinite;}
                  @keyframes pulse{0%,100%{opacity:0.25}50%{opacity:0.75}}
                  .apulse{animation:pulse 2.5s ease-in-out infinite;}
                  @keyframes spinr{to{stroke-dashoffset:-40;}}
                  .aspinr{animation:spinr 3s linear infinite;}
                `}</style>
              </defs>
              <rect width="100%" height="100%" fill="#F3F4F6"/>
              <rect width="100%" height="100%" fill="url(#dotgridLarge)"/>
              <rect width="100%" height="100%" fill="url(#dotgrid)"/>

              <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
                {/* Connections */}
                {connections.map((conn,ci)=>{
                  const fr=nodes.find(n=>n.id===conn.from), to=nodes.find(n=>n.id===conn.to);
                  if(!fr||!to) return null;
                  const W=120,H=100;
                  const dx=to.x-fr.x, dy=to.y-fr.y;
                  let x1,y1,x2,y2,cp1x,cp1y,cp2x,cp2y;
                  if(Math.abs(dx)>=Math.abs(dy)){
                    x1=fr.x+W+10;y1=fr.y+H/2;x2=to.x-10;y2=to.y+H/2;
                    const b=Math.max(40,Math.min(Math.abs(dx)*0.45,130));
                    cp1x=x1+b;cp1y=y1;cp2x=x2-b;cp2y=y2;
                  } else {
                    x1=fr.x+W/2;y1=fr.y+H+10;x2=to.x+W/2;y2=to.y-10;
                    const b=Math.max(40,Math.min(Math.abs(dy)*0.45,130));
                    cp1x=x1;cp1y=y1+b;cp2x=x2;cp2y=y2-b;
                  }
                  const pd=`M${x1} ${y1} C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x2} ${y2}`;
                  const col=ARROW_COLORS[ci%ARROW_COLORS.length];
                  const mx=(x1+x2)/2+(cp1x-x1+cp2x-x2)*0.12;
                  const my=(y1+y2)/2+(cp1y-y1+cp2y-y2)*0.12;
                  return(
                    <g key={conn.id}>
                      <path d={pd} fill="none" stroke={col} strokeWidth="14" opacity="0.04"/>
                      <path d={pd} fill="none" stroke={col} strokeWidth="4" opacity="0.1"/>
                      <path d={pd} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="2"/>
                      <path d={pd} fill="none" stroke={col} strokeWidth="2" strokeDasharray="14 10" markerEnd={`url(#arr${ci%5})`} opacity="0.9" className="adash"/>
                      <circle cx={x1} cy={y1} r={4.5} fill={col} opacity="0.9"/>
                      <circle cx={x2} cy={y2} r={4.5} fill={col} opacity="0.9"/>
                      <circle cx={mx} cy={my} r={3} fill={col} opacity="0.5" className="apulse"/>
                      <g style={{cursor:"pointer"}} onClick={()=>setConnections(p=>p.filter(c=>c.id!==conn.id))}>
                        <circle cx={mx} cy={my} r={13} fill="#FFFFFF" stroke={col} strokeWidth="1.5" opacity="0.97"/>
                        <text x={mx} y={my+5} textAnchor="middle" fontSize="13" fontWeight="bold" fill={col} style={{userSelect:"none"}}>✕</text>
                      </g>
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map(node=>{
                  const {color}=categoryColor(node.serviceId);
                  const cost=calcNodeCost(node,rf);
                  const isSel=selected===node.id, isConn=connecting===node.id;
                  const iconSrc=awsIconSrc(node.serviceId,color);
                  const W=120,H=100;
                  const h2r=h=>{h=h.replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];};
                  const [r,g,b]=h2r(color.startsWith("#")?color:"#FF9900");
                  const rgb=`${r},${g},${b}`;
                  const gid=`ng${node.id.replace(/\W/g,"")}`;
                  return(
                    <g key={node.id} transform={`translate(${node.x},${node.y})`}
                      style={{cursor:dragging===node.id?"grabbing":"grab"}}
                      onMouseDown={e=>handleNodeMouseDown(e,node.id)}>
                      <defs>
                        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={`rgba(${rgb},0.10)`}/>
                          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
                        </linearGradient>
                        <clipPath id={`ct${gid}`}><rect x={0} y={0} width={W} height={16} rx={16}/></clipPath>
                      </defs>
                      {isSel&&<><rect x={-10} y={-10} width={W+20} height={H+20} rx={22} fill="none" stroke={`rgba(${rgb},0.6)`} strokeWidth="1.5" strokeDasharray="8 5" className="aspinr"/><rect x={-18} y={-18} width={W+36} height={H+36} rx={26} fill={`rgba(${rgb},0.06)`}/></>}
                      {isConn&&<><rect x={-8} y={-8} width={W+16} height={H+16} rx={20} fill="none" stroke={`rgba(${rgb},0.9)`} strokeWidth="2" strokeDasharray="6 4" className="adash"/><rect x={-14} y={-14} width={W+28} height={H+28} rx={24} fill={`rgba(${rgb},0.08)`} className="apulse"/></>}
                      <ellipse cx={W/2} cy={H+14} rx={48} ry={10} fill={`rgba(${rgb},0.15)`} style={{filter:"blur(6px)"}}/>
                      <rect width={W} height={H} rx={16} fill="url(#cardGrad)" filter="url(#cardShadow)"/>
                      <rect width={W} height={H} rx={16} fill={`url(#${gid})`}/>
                      <rect x={2} y={2} width={W-4} height={H/2-4} rx={14} fill="rgba(255,255,255,0.4)"/>
                      <rect width={W} height={H} rx={16} fill="none" stroke={isSel?"#FF9900":isConn?color:`rgba(${rgb},0.35)`} strokeWidth={isSel||isConn?1.8:1}/>
                      <rect x={0} y={0} width={W} height={5} fill={color} opacity="0.95" clipPath={`url(#ct${gid})`}/>
                      <rect x={14} y={0} width={W*0.4} height={5} fill="rgba(255,255,255,0.35)" clipPath={`url(#ct${gid})`}/>
                      <rect x={W/2-26} y={12} width={52} height={52} rx={14} fill={`rgba(${rgb},0.12)`} stroke={`rgba(${rgb},0.32)`} strokeWidth="1"/>
                      <rect x={W/2-26} y={12} width={52} height={52} rx={14} fill="rgba(255,255,255,0.3)"/>
                      {iconSrc
                        ? <image href={iconSrc} x={W/2-24} y={14} width={48} height={48}/>
                        : <text x={W/2} y={46} textAnchor="middle" fontSize={28} fill={color}>{node.icon}</text>
                      }
                      <text x={W/2} y={76} textAnchor="middle" fontSize={10} fontWeight={700} fill="#1F2937" letterSpacing="0.025em">
                        {node.name.length>16?node.name.slice(0,15)+"…":node.name}
                      </text>
                      {cost>0
                        ? <><rect x={(W-76)/2} y={82} width={76} height={14} rx={7} fill={`rgba(${rgb},0.16)`} stroke={`rgba(${rgb},0.5)`} strokeWidth="0.75"/>
                            <text x={W/2} y={92.5} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={color} letterSpacing="0.05em">${cost.toFixed(2)}/月</text></>
                        : <><rect x={(W-44)/2} y={82} width={44} height={14} rx={7} fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.5)" strokeWidth="0.75"/>
                            <text x={W/2} y={92.5} textAnchor="middle" fontSize={8} fontWeight={800} fill="#10B981" letterSpacing="0.1em">FREE</text></>
                      }
                      <g onClick={e=>handleConnect(e,node.id)} style={{cursor:"pointer"}}>
                        <circle cx={W+14} cy={H/2} r={13} fill={isConn?`rgba(${rgb},0.85)`:"#FFFFFF"} stroke={isConn?color:`rgba(${rgb},0.5)`} strokeWidth="1.5" style={{filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.15))"}}/>
                        <text x={W+14} y={H/2+5} textAnchor="middle" fontSize={15} fill={isConn?"white":color} fontWeight="bold" style={{userSelect:"none"}}>{isConn?"●":"+"}</text>
                      </g>
                      <g onClick={e=>handleConnect(e,node.id)} style={{cursor:"pointer"}}>
                        <circle cx={W/2} cy={H+14} r={13} fill="#FFFFFF" stroke={`rgba(${rgb},0.4)`} strokeWidth="1.5" style={{filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.15))"}}/>
                        <text x={W/2} y={H+18.5} textAnchor="middle" fontSize={15} fill={color} fontWeight="bold" style={{userSelect:"none"}}>+</text>
                      </g>
                      {isSel&&(
                        <g onClick={e=>{e.stopPropagation();del();}} style={{cursor:"pointer"}}>
                          <circle cx={W-2} cy={2} r={13} fill="#FFFFFF" stroke="#EF4444" strokeWidth={1.5} style={{filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.15))"}}/>
                          <text x={W-2} y={7} textAnchor="middle" fontSize={13} fill="#EF4444" fontWeight="bold" style={{userSelect:"none"}}>✕</text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>

              {nodes.length===0&&(
                <g>
                  <text x="50%" y="33%" textAnchor="middle" fontSize={100} fill="rgba(0,0,0,0.02)">☁</text>
                  <rect x="50%" y="46%" width="400" height="100" rx="20" fill="rgba(255,153,0,0.04)" stroke="rgba(255,153,0,0.2)" strokeWidth="1.5" strokeDasharray="8 6" style={{transform:"translate(-200px,-20px)"}}/>
                  <text x="50%" y="44%" textAnchor="middle" fontSize={20} fill="rgba(0,0,0,0.25)" fontWeight={600} letterSpacing="0.05em">AWS Architecture Canvas</text>
                  <text x="50%" y="51%" textAnchor="middle" fontSize={13} fill="rgba(230,126,0,0.7)" letterSpacing="0.02em">← 左パネルからサービスをドラッグ＆ドロップ</text>
                  <text x="50%" y="57%" textAnchor="middle" fontSize={10.5} fill="rgba(0,0,0,0.22)">+ ポートをクリックして接続 · Scrollでズーム · Deleteで削除</text>
                </g>
              )}
            </svg>
          </div>

          {/* Right panel */}
          {selectedNode&&(()=>{
            const {color,bg}=categoryColor(selectedNode.serviceId);
            const cost=calcNodeCost(selectedNode,rf);
            const fields=SERVICE_FIELDS[selectedNode.serviceId]||[];
            return(
              <div style={{width:230,background:"#FFFFFF",borderLeft:"0.5px solid #E5E7EB",overflowY:"auto",flexShrink:0}}>
                <div style={{background:bg,padding:"10px 12px",borderBottom:"0.5px solid #E5E7EB"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {awsIconSrc(selectedNode.serviceId,color)
                      ? <img src={awsIconSrc(selectedNode.serviceId,color)} width={30} height={30} style={{borderRadius:6,flexShrink:0}}/>
                      : <span style={{fontSize:20}}>{selectedNode.icon}</span>
                    }
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color}}>{selectedNode.name}</div>
                      <div style={{fontSize:10,color:"#6B7280"}}>{selectedNode.desc}</div>
                    </div>
                  </div>
                </div>
                <div style={{padding:12}}>
                  <div style={{fontSize:22,fontWeight:700,color:"#FF9900",marginBottom:2}}>${cost.toFixed(2)}<span style={{fontSize:12,fontWeight:400,color:"#6B7280"}}>/月</span></div>
                  <div style={{fontSize:11,color:"#6B7280",marginBottom:12}}>≈ ¥{Math.round(cost*usdJpy).toLocaleString()}</div>
                  {fields.length>0
                    ? fields.map(fld=>renderField(selectedNode,fld))
                    : <div style={{fontSize:12,color:"#6B7280",padding:"8px 0"}}>{selectedNode.pricing.note||"設定項目なし"}</div>
                  }
                  {selectedNode.pricing.note&&fields.length>0&&(
                    <div style={{marginTop:8,padding:"6px 8px",background:bg,borderRadius:6,fontSize:10,color,lineHeight:1.5}}>ℹ️ {selectedNode.pricing.note}</div>
                  )}
                  <button onClick={del} style={{width:"100%",background:"rgba(239,68,68,0.08)",color:"#DC2626",border:"0.5px solid #EF4444",borderRadius:7,padding:"7px 0",fontSize:12,cursor:"pointer",marginTop:10}}>削除</button>
                </div>
              </div>
            );
          })()}
        </>)}

        {/* ── Cost tab ── */}
        {activeTab==="cost"&&(
          <CostTab nodes={nodes} setNodes={setNodes} rf={rf} totalUSD={totalUSD} totalJPY={totalJPY} region={region} usdJpy={usdJpy}/>
        )}
      </div>

      {/* ── Modals ── */}
      {showPreview&&(
        <PdfPreviewModal nodes={nodes} connections={connections} region={region} rf={rf} onClose={()=>setShowPreview(false)} usdJpy={usdJpy}/>
      )}

      {drawioSheets&&(
        <div style={{position:"fixed",inset:0,zIndex:100000,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#1E2530",border:"1px solid #3A4A5A",borderRadius:14,width:400,maxHeight:"80vh",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 16px 48px rgba(0,0,0,0.6)"}}>
            <div style={{padding:"14px 18px",background:"#232F3E",borderBottom:"1px solid #3A4A5A",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{color:"#FF9900",fontWeight:700,fontSize:14}}>📐 シートを選択</span>
              <button onClick={()=>setDrawioSheets(null)} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <div style={{fontSize:12,color:"#888",padding:"10px 18px 6px"}}>{drawioSheets.length}枚のシートが見つかりました。インポートするシートを選択してください。</div>
            <div style={{overflowY:"auto",padding:"8px 14px 14px",display:"flex",flexDirection:"column",gap:8}}>
              {drawioSheets.map(sheet=>(
                <button key={sheet.id} onClick={()=>importDrawioSheet(sheet)}
                  style={{background:"#151B24",border:"1px solid #2A3A4A",borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="#FF9900"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="#2A3A4A"}>
                  <span style={{fontSize:22,flexShrink:0}}>📄</span>
                  <div>
                    <div style={{color:"white",fontWeight:600,fontSize:13}}>{sheet.name}</div>
                    <div style={{color:"#888",fontSize:11,marginTop:2}}>{sheet.cells.length}ノード · {sheet.edges.length}接続</div>
                  </div>
                  <span style={{marginLeft:"auto",color:"#FF9900",fontSize:12,fontWeight:600}}>選択 →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
