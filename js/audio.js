/* ============================================================
   NEXUS OS — Audio Engine (Som Atmosférico)
   O.R.T. — Ordem da Realidade e Tempo
   ============================================================ */

const NexusAudio = (() => {

    let _audioCtx = null;
    let _humOsc = null;
    let _humGain = null;
    let _noiseNode = null;
    let _lpFilter = null;
    let _isAtmospherePlaying = false;

    /** Inicia o contexto de áudio se ainda não existir */
    function _ensureContext() {
        if (!_audioCtx) {
            _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return _audioCtx;
    }

    /** Gera o zumbido suave de monitor CRT */
    function startAtmosphere() {
        if (_isAtmospherePlaying) return;

        const ctx = _ensureContext();
        if (ctx.state === 'suspended') ctx.resume();

        // 1. Zumbido de baixa frequência (Hum)
        _humOsc = ctx.createOscillator();
        _humGain = ctx.createGain();
        _humOsc.type = 'triangle';
        _humOsc.frequency.setValueAtTime(60, ctx.currentTime); // 60Hz hum

        const vol = (typeof NEXUS_CONFIG !== 'undefined') ? NEXUS_CONFIG.audio.masterVolume : 0.25;
        _humGain.gain.setValueAtTime(0.05 * vol, ctx.currentTime);

        // 2. Ruído Branco filtrado (Static)
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        _noiseNode = ctx.createBufferSource();
        _noiseNode.buffer = noiseBuffer;
        _noiseNode.loop = true;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.008, ctx.currentTime); // Aumentado para melhor audição

        // Filtro Passa-Baixa para deixar o ruído mais "quente" e abafado
        _lpFilter = ctx.createBiquadFilter();
        _lpFilter.type = 'lowpass';
        _lpFilter.frequency.setValueAtTime(400, ctx.currentTime);

        // Conexões
        _humOsc.connect(_humGain);
        _humGain.connect(ctx.destination);

        _noiseNode.connect(_lpFilter);
        _lpFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        _humOsc.start();
        _noiseNode.start();
        _isAtmospherePlaying = true;

        console.log('[NEXUS AUDIO] Atmosfera iniciada.');
    }

    /** Listener global para contornar bloqueio de áudio automático */
    document.addEventListener('click', () => {
        if (_audioCtx && _audioCtx.state === 'suspended') {
            _audioCtx.resume();
        }
    }, { once: true });

    function stopAtmosphere() {
        if (_humOsc) {
            _humOsc.stop();
            _humOsc.disconnect();
        }
        if (_noiseNode) {
            _noiseNode.stop();
            _noiseNode.disconnect();
        }
        _isAtmospherePlaying = false;
    }

    return { startAtmosphere, stopAtmosphere };

})();
