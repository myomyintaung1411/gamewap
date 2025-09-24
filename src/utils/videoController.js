// videoController.js
import { ref } from 'vue';

export const activePlayers = ref([]);

export function registerVideo(playerInstance) {
  if (playerInstance && !activePlayers.value.includes(playerInstance)) {
    activePlayers.value.push(playerInstance);
  }
}

export function unregisterVideo(playerInstance) {
  activePlayers.value = activePlayers.value.filter(p => p !== playerInstance);
}

// Stop all registered players + raw <video> elements
export async function destroyAllVideos() {
  const players = [...activePlayers.value];
  for (const player of players) {
    if (player?.destroyPlayer) {
      try {
        await player.destroyPlayer();
      } catch (e) {
        console.warn('Failed to destroy player:', e);
      }
    }
  }
  activePlayers.value = [];

  // stop all <video> elements on the page
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    try {
      video.pause();
      video.src = '';
      video.load();
    } catch (e) {}
  });

  console.log('All videos destroyed!');
}
