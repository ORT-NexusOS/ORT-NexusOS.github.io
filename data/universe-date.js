// ============================================================
//  NEXUS OS — Universe Date Configuration
//  O.R.T. — Ordem da Realidade e Tempo
// ============================================================
//  MESTRE: Edite apenas o objeto abaixo para mudar a data
//  in-universe exibida no canto inferior direito do desktop.
// ============================================================

const UNIVERSE_DATE = {
    day: "23",
    month: "11",
    year: "3575",

    /** Retorna a data formatada: DD/MM/AAAA */
    format() {
        return `${this.day}/${this.month}/${this.year}`;
    },

    /** Lore extra — exibido no Calendário */
    era: "Era da Consolidação",
    cycle: "Ciclo Omega"
};
