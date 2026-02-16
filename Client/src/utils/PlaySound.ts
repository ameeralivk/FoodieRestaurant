

const audio = new Audio("/sounds/universfield-new-notification-026-380249.mp3");

export const playSound = () => {
  audio.currentTime = 0; // restart sound
  audio.play().catch((err) => {
    console.log("Sound blocked:", err);
  });
};
