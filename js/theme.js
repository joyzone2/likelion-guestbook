const app = document.querySelector("#app");
const writeTitle = document.querySelector("#writeTitle");
const listTitle = document.querySelector("#listTitle");
const writeSideRight = document.querySelector("#writeSideRight");

function setThemeByTime() {
  const hour = new Date().getHours();
  app.classList.remove("theme-day");
  app.classList.remove("theme-sunset");
  app.classList.remove("theme-night");

  if (hour >= 6 && hour < 13) {
    app.classList.add("theme-day");
    writeTitle.textContent = "🌻방명록을 남겨주세요!🌻";
    listTitle.textContent = "방명록 기록☀️";
    writeSideRight.textContent = "It's Light Mode";
  } else if (hour >= 13 && hour < 18) {
    app.classList.add("theme-sunset");
    writeTitle.textContent = "💌방명록을 남겨주세요!💌";
    listTitle.textContent = "방명록 기록✨";
    writeSideRight.textContent = "It's Sunset Mode";
  } else {
    app.classList.add("theme-night");
    writeTitle.textContent = "💫방명록을 남겨주세요!💫";
    listTitle.textContent = "방명록 기록🌙";
    writeSideRight.textContent = "It's Dark Mode";
  }
}
setThemeByTime();