// Bấm nhãn: nếu có section tương ứng thì cuộn tới, chưa có thì hiện thông báo
const toast = document.getElementById("toast");
let timer;

document.querySelectorAll(".label").forEach((el) => {
  el.addEventListener("click", (e) => {
    const target = document.querySelector(el.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      return;
    }
    e.preventDefault();
    toast.textContent = `Đang mở: ${el.textContent} ✨`;
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove("show"), 1800);
  });
});