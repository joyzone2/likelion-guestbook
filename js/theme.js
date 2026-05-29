const app = document.querySelector("#app");
const writeTitle = document.querySelector("#writeTitle");
const listTitle = document.querySelector("#listTitle");
const writeSideLeft = document.querySelector("#writeSideLeft");
const writeSideRight = document.querySelector("#writeSideRight");

function setThemeByTime() {
  const hour = new Date().getHours();

  app.classList.remove("theme-day");
  app.classList.remove("theme-sunset");
  app.classList.remove("theme-night");

  if (hour >= 6 && hour < 15) {
    app.classList.add("theme-day");

    writeTitle.textContent = "🌻오늘의 기록 남기기🌻";
    listTitle.textContent = "방명록 기록🌤️";
    writeSideLeft.textContent = "morning note";
    writeSideRight.textContent = "soft daylight";
  } else if (hour >= 15 && hour < 19) {
    app.classList.add("theme-sunset");

    writeTitle.textContent = "💌오늘의 기록 남기기💌";
    listTitle.textContent = "방명록 기록✨";
    writeSideLeft.textContent = "sunset note";
    writeSideRight.textContent = "warm memory";
  } else {
    app.classList.add("theme-night");

    writeTitle.textContent = "💫오늘의 기록 남기기💫";
    listTitle.textContent = "방명록 기록🌙";
    writeSideLeft.textContent = "moonlight note";
    writeSideRight.textContent = "leave your day here";
  }
}

setThemeByTime();