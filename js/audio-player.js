/* ═══════════════════════════════════════════════════════════════
   Audio Player — Lesson audio narration playback, seek & speed
   ═══════════════════════════════════════════════════════════════ */

window.AudioPlayer = (() => {
  function formatTime(secs) {
    if (isNaN(secs) || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function setupAudioListeners(slug) {
    const audio = document.getElementById('audio-' + slug);
    if (!audio || audio._listenersAttached) return;
    audio._listenersAttached = true;

    const bar = document.getElementById('audio-bar-' + slug);
    const timeDisplay = document.getElementById('audio-time-' + slug);
    const playIcon = document.getElementById('audio-play-icon-' + slug);
    const pauseIcon = document.getElementById('audio-pause-icon-' + slug);

    if (audio.duration && timeDisplay) {
      timeDisplay.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
    }

    audio.addEventListener('loadedmetadata', () => {
      if (timeDisplay && audio.duration) {
        timeDisplay.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      if (bar) bar.style.width = pct + '%';
      if (timeDisplay) {
        timeDisplay.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
      }
    });

    audio.addEventListener('ended', () => {
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (bar) bar.style.width = '0%';
      if (timeDisplay) {
        timeDisplay.textContent = '0:00 / ' + formatTime(audio.duration);
      }
      if (window.Analytics?.trackAudioComplete) {
        window.Analytics.trackAudioComplete(slug, audio.duration);
      }
    });
  }

  function toggleAudio(slug) {
    const audio = document.getElementById('audio-' + slug);
    const playIcon = document.getElementById('audio-play-icon-' + slug);
    const pauseIcon = document.getElementById('audio-pause-icon-' + slug);
    if (!audio) return;

    if (audio.paused) {
      document.querySelectorAll('audio').forEach(a => {
        if (a !== audio && !a.paused) {
          a.pause();
          const otherSlug = a.id.replace('audio-', '');
          const otherPlay = document.getElementById('audio-play-icon-' + otherSlug);
          const otherPause = document.getElementById('audio-pause-icon-' + otherSlug);
          if (otherPlay) otherPlay.style.display = 'block';
          if (otherPause) otherPause.style.display = 'none';
        }
      });
      setupAudioListeners(slug);
      audio.play().then(() => {
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (window.Analytics?.trackAudioPlay) {
          window.Analytics.trackAudioPlay(slug, audio.currentTime);
        }
      }).catch(err => {
        console.warn('Audio playback error:', err);
      });
    } else {
      audio.pause();
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (window.Analytics?.trackAudioPause) {
        window.Analytics.trackAudioPause(slug, audio.currentTime, audio.duration);
      }
    }
  }

  function seekAudio(slug, event) {
    const audio = document.getElementById('audio-' + slug);
    const track = document.getElementById('audio-track-' + slug);
    if (!audio || !track || !audio.duration) return;

    const rect = track.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percent = clickX / rect.width;
    audio.currentTime = percent * audio.duration;
    if (window.Analytics?.trackAudioSeek) {
      window.Analytics.trackAudioSeek(slug, audio.currentTime);
    }
  }

  function cycleAudioSpeed(slug) {
    const audio = document.getElementById('audio-' + slug);
    const btn = document.getElementById('audio-speed-' + slug);
    if (!audio || !btn) return;

    const speeds = [1, 1.25, 1.5, 1.75, 2, 0.75];
    const currentSpeed = audio.playbackRate || 1;
    const nextIndex = (speeds.indexOf(currentSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];

    audio.playbackRate = newSpeed;
    btn.textContent = newSpeed + 'x';
    if (window.Analytics?.trackAudioSpeedChange) {
      window.Analytics.trackAudioSpeedChange(slug, newSpeed);
    }
  }

  window.toggleAudio = toggleAudio;
  window.seekAudio = seekAudio;
  window.cycleAudioSpeed = cycleAudioSpeed;
  window.setupAudioListeners = setupAudioListeners;

  return {
    toggleAudio,
    seekAudio,
    cycleAudioSpeed,
    setupAudioListeners
  };
})();
