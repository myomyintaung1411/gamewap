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
// export async function destroyAllVideos() {
//   const players = [...activePlayers.value];
//   for (const player of players) {
//     if (player?.destroyPlayer) {
//       try {
//         await player.destroyPlayer();
//       } catch (e) {
//         console.warn('Failed to destroy player:', e);
//       }
//     }
//   }
//   activePlayers.value = [];

//   // small delay to avoid race with new page mount
//   setTimeout(() => {
//     const videos = document.querySelectorAll('video');
//     videos.forEach(video => {
//       if (!video) return; // ✅ skip nulls
//       try {
//         video.pause();
//         video.removeAttribute('src');
//         video.load();
//       } catch (e) {}
//     });
//     console.log('All videos destroyed safely!');
//   }, 100);
// }


// videoController.js
export async function destroyAllVideos() {
  const players = [...activePlayers.value];

  // Step 1: Stop Jessibuca or any custom video instances
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

  // Step 2: Give renderjs / Web Workers some time to settle
  await new Promise(resolve => setTimeout(resolve, 300)); // wait ~1 frame

  // Step 3: Safely clean up <video> DOM elements
  try {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (!video) return;
      try {
        video.pause();
        // Remove from DOM instead of just clearing src
        video.remove();
      } catch (e) {
        console.warn('Video cleanup failed', e);
      }
    });
  } catch (err) {
    console.warn('Video query error', err);
  }

  console.log('✅ All videos destroyed safely (after renderjs sync)');
}
