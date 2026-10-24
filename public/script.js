/* ===== Bấm GIF để hiện phần "Rabbit hole" ===== */
const root = document.documentElement;
const hero = document.getElementById("top");
const scene = document.getElementById("rabbit");

/* Luôn bắt đầu từ đầu trang: tắt khôi phục vị trí cuộn của trình duyệt.
   Nếu không, tải lại trang giữa chừng sẽ bị kéo xuống vùng đang ẩn (chỉ thấy nền kem). */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);
window.addEventListener("pageshow", () => {
  if (root.classList.contains("is-locked")) window.scrollTo(0, 0);
});
// đang khóa mà vẫn bị cuộn (vd. phím, kéo thanh cuộn) thì đưa về đầu
window.addEventListener("scroll", () => {
  if (root.classList.contains("is-locked") && window.scrollY !== 0) window.scrollTo(0, 0);
}, { passive: true });

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

let scrolling = false;

// Cuộn mượt tự điều khiển (easing + thời lượng cố định)
function smoothScrollTo(targetY, duration = 1300) {
  if (reduceMotion.matches) {
    window.scrollTo(0, targetY);
    return;
  }
  const startY = window.scrollY;
  const dist = targetY - startY;
  let t0 = null;            // lấy mốc ở frame đầu tiên, để frame đầu nặng không "ăn" mất đoạn bắt đầu
  scrolling = true;

  // người dùng tự cuộn/chạm thì dừng ngay
  const cancel = () => (scrolling = false);
  window.addEventListener("wheel", cancel, { once: true, passive: true });
  window.addEventListener("touchstart", cancel, { once: true, passive: true });

  function step(now) {
    if (!scrolling) return;
    if (t0 === null) t0 = now;
    const p = Math.min((now - t0) / duration, 1);
    window.scrollTo(0, startY + dist * easeInOutCubic(p));
    if (p < 1) requestAnimationFrame(step);
    else scrolling = false;
  }
  requestAnimationFrame(step);
}

// Giải mã sẵn ảnh nền lúc trình duyệt rảnh (sau khi trang tải xong),
// để lúc bấm không phải giải mã ảnh lớn.
const sceneImg = scene.querySelector(".scene__bg");
window.addEventListener("load", () => {
  const warm = () => sceneImg.decode().catch(() => {});
  "requestIdleCallback" in window ? requestIdleCallback(warm) : setTimeout(warm, 300);
});

function openScene() {
  if (scene.classList.contains("is-open")) return; // đã mở rồi thì thôi

  hero.classList.add("is-pressed");                // phản hồi tức thì
  setTimeout(() => hero.classList.remove("is-pressed"), 200);

  // phần dưới đã được dựng sẵn từ đầu nên chỉ cần bật hiển thị + mở khóa cuộn
  scene.classList.add("is-open");
  scene.removeAttribute("aria-hidden");
  root.classList.remove("is-locked");
  hero.setAttribute("aria-expanded", "true");
  hero.style.cursor = "default";

  // đợi 1 frame để trình duyệt áp trạng thái mới rồi cuộn xuống
  requestAnimationFrame(() => {
    const y = scene.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(y);
  });
}

hero.addEventListener("click", openScene);
hero.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openScene();
  }
});

/* ===== Bấm nhãn =====
   - Link dạng "#id" (cùng trang): cuộn mượt tới section.
   - Link dạng "/community", "/about"...: để trình duyệt chuyển trang bình thường. */
document.querySelectorAll(".label").forEach((el) => {
  el.addEventListener("click", (e) => {
    const href = el.getAttribute("href");
    if (!href || !href.startsWith("#")) return; // chuyển trang như bình thường

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(y, 1000);
  });
});