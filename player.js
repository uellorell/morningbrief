(() => {
  const player = document.querySelector('[data-audio-player]');
  if (!player) return;

  const audio = player.querySelector('audio');
  const toggle = player.querySelector('[data-player-toggle]');
  const progress = player.querySelector('[data-progress]');
  const currentTime = player.querySelector('[data-current-time]');
  const duration = player.querySelector('[data-duration]');
  const status = player.querySelector('[data-player-status]');

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  const syncPlayer = () => {
    const percentage = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    progress.value = percentage;
    progress.style.setProperty('--player-progress', `${percentage}%`);
    currentTime.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
  };

  toggle.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        status.textContent = 'Audio belum dapat diputar. Coba tekan play sekali lagi.';
      }
    } else {
      audio.pause();
    }
  });

  player.querySelectorAll('[data-skip]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextTime = audio.currentTime + Number(button.dataset.skip);
      audio.currentTime = Math.max(0, Math.min(nextTime, audio.duration || nextTime));
    });
  });

  progress.addEventListener('input', () => {
    if (!audio.duration) return;
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });

  audio.addEventListener('loadedmetadata', syncPlayer);
  audio.addEventListener('timeupdate', syncPlayer);
  audio.addEventListener('play', () => {
    player.classList.add('is-playing');
    toggle.setAttribute('aria-label', 'Jeda MorningBrief');
    status.textContent = 'MorningBrief sedang diputar.';
  });
  audio.addEventListener('pause', () => {
    player.classList.remove('is-playing');
    toggle.setAttribute('aria-label', 'Putar MorningBrief');
    status.textContent = audio.ended ? 'Cuplikan selesai diputar.' : 'Pemutaran dijeda.';
  });
  audio.addEventListener('ended', syncPlayer);
  audio.addEventListener('error', () => {
    status.textContent = 'Audio sedang tidak tersedia. Silakan coba beberapa saat lagi.';
  });
})();
