// YouTube: load the player only when someone asks for it, so the page stays fast.
document.querySelectorAll(".yt").forEach((box) => {
  box.querySelector(".yt-play").addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${box.dataset.id}?autoplay=1&rel=0`;
    iframe.title = "Paper video";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    box.replaceChildren(iframe);
  });
});

// Strawberry reel: chapter buttons seek the video, and the active chapter tracks playback.
const reel = document.getElementById("reel");
const chapters = [...document.querySelectorAll("#chapters button")];

if (reel && chapters.length) {
  const update = () => {
    const t = reel.currentTime;
    chapters.forEach((btn) => {
      const start = +btn.dataset.start;
      const end = +btn.dataset.end;
      const active = t >= start && t < end;
      const p = t >= end ? 100 : active ? ((t - start) / (end - start)) * 100 : 0;
      btn.style.setProperty("--p", `${p}%`);
      btn.setAttribute("aria-current", active ? "true" : "false");
    });
  };

  chapters.forEach((btn) => {
    btn.addEventListener("click", () => {
      reel.currentTime = +btn.dataset.start;
      reel.play().catch(() => {});
      update();
    });
  });

  reel.addEventListener("timeupdate", update);
  reel.addEventListener("seeked", update);
  update();

  // Play the muted reel when it scrolls into view, unless the visitor prefers reduced motion.
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!calm && "IntersectionObserver" in window) {
    let started = false;
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          reel.play().catch(() => {});
        }
      });
    }, { threshold: 0.6 }).observe(reel);
  }
}
