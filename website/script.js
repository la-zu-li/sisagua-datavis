const colors = [
  "#03045e",
  "#262d79",
  "#475492",
  "#677bab",
  "#88a2c4",
  "#a9c9dd",
  "#caf0f6",
];
let current = 0;

function cycleColorAndReturn() {
  current = (current + 1) % colors.length;
  return colors[current];
}

const aguaTexts = document.querySelectorAll(".agua");

aguaTexts.forEach((element) =>
  element.addEventListener("click", (e) => {
    const color = cycleColorAndReturn();
    e.target.style.backgroundColor = color;
  }),
);
