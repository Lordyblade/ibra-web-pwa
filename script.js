if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker terdaftar!"))
    .catch(err => console.log("Gagal daftar SW:", err));
}

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement("button");
  installBtn.textContent = "Install Ibra's Web";
  document.body.appendChild(installBtn);
  installBtn.classList.add("install-btn");
  installBtn.addEventListener("click", () => {
    installBtn.remove();
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === "accepted") console.log("Aplikasi diinstal!");
      deferredPrompt = null;
    });
  });
});
