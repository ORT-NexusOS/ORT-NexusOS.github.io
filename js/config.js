// ============================================================
//  NEXUS OS — Configuration File
//  O.R.T. — Ordem da Realidade e Tempo
// ============================================================
//  INSTRUÇÃO: Preencha suas credenciais abaixo antes de
//  fazer o deploy. Consulte o README.md para o guia completo.
// ============================================================

const NEXUS_CONFIG = {

  // ── Supabase (Auth + Database) ─────────────────────────────
  supabase: {
    url: 'https://ptpzcocunxtdzahaoomq.supabase.co',          // Ex: https://xyzxyz.supabase.co
    anonKey: 'sb_publishable_E1LNH-F8852T2ZQNSTY7UA_z3e6_NVs'  // Chave pública (anon/public)
  },

  // ── Cloudinary (Image Storage) ────────────────────────────
  cloudinary: {
    cloudName: 'djaofysdp', // Ex: "nexus-ort"
    uploadPreset: 'nexus_os_uploads'          // Preset sem assinatura (unsigned)
  },

  // ── Audio Settings ────────────────────────────────────────
  audio: {
    enabled: true,  // true = sons ativados | false = silencioso
    masterVolume: 0.25
  },

  // ── System Info ───────────────────────────────────────────
  system: {
    name: 'NEXUS OS',
    version: '7.3.1',
    organization: 'O.R.T.',
    orgFullName: 'Ordem da Realidade e Tempo',
    classification: 'CLASSIFIED — OMEGA CLEARANCE'
  }
};
