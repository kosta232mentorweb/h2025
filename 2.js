console.log("Начинаем игру!");

const nx = 40;
const ny = 40;

document.documentElement.style.setProperty("--nx", nx);
document.documentElement.style.setProperty("--ny", ny);

const state = {
  board: {
    field: Array(nx * ny).fill(" "),
  },
};

const board = createHTMLElement("div", { id: "board" }, null, document.body);

board.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) return;
  const [x, y] = cell.id.slice(1).split("_").map(Number);
  setField(x, y, "X");
});

for (let y = 0; y < ny; y++) {
  for (let x = 0; x < nx; x++) {
    const cell = createHTMLElement(
      "div",
      { class: "cell", id: `c${x}_${y}` },
      ` `,
      board
    );
  }
}

const setField = (x, y, val) => (sp[idFromXY(x, y)] = val);

function idFromXY(x, y) {
  return y * nx + x;
}

function xyFromId(idx) {
  const y = Math.trunc(idx / nx);
  const x = idx - y * nx;
  return { x, y };
}

const sp = new Proxy(state.board.field, {
  set(target, key, newValue) {
    target[key] = newValue;
    const { x, y } = xyFromId(Number(key));
    $(`#c${x}_${y}`).textContent = newValue;
    return true;
  },
});

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function createHTMLElement(
  tag,
  attributes = {},
  innerHTML,
  target,
  how = "append"
) {
  const el = document.createElement(tag);
  for (let key in attributes) {
    el.setAttribute(key, attributes[key]);
  }
  if (innerHTML) el.innerHTML = innerHTML;

  if (target) {
    if (["append", "prepend", "before", "after"].includes(how)) {
      target[how](el);
    } else {
      console.log("wrong method", how);
    }
  }

  return el;
}

let z = 0;

for (let y = 0; y < ny; y++) {
  for (let x = 0; x < nx; x++) {
    const val = Math.random() < 0.15 ? "X" : Math.random() < 0.15 ? "O" : " ";
    setField(x, y, val);
  }
}

setInterval(() => {
  // const prev_field = JSON.parse(JSON.stringify(state.board.field));
  const prev_field = state.board.field.slice(); // клонируем

  label: for (let x = 0; x < nx; x++) {
    for (let y = ny; y >= 0; y--) {
      if (prev_field[idFromXY(x, y - 1)] !== " ") {
        continue;
      }
      for (let y2 = y - 1; y2 >= 0; y2--) {
        if (y2 === 0) {
          setField(x, y2, " ");
        } else {
          setField(x, y2, prev_field[idFromXY(x, y2 - 1)]);
        }
      }
      continue label;
    }
  }

  // const prev = state.board.field.slice(); // клонируем

  // for (let x = 0; x < nx; x++) {
  //   // снизу вверх, y = ny-1..0
  //   for (let y = ny - 1; y >= 0; y--) {
  //     if (prev[idFromXY(x, y)] !== " ") continue;

  //     // ищем первый непустой выше текущей пустой
  //     let k = y - 1;
  //     while (k >= 0 && prev[idFromXY(x, k)] === " ") k--;

  //     if (k >= 0) {
  //       setField(x, y, prev[idFromXY(x, k)]);
  //       setField(x, k, " ");
  //     }
  //   }
  // }
}, 500);

const ensureStyle = () => {
  if (!document.styleSheets.length) {
    const s = document.createElement("style");
    document.head.appendChild(s);
  }
};
ensureStyle();

const ww = window.innerWidth;
const wh = window.innerHeight;

const h = Math.trunc(Math.min((ww - 20) / nx, (wh - 20) / ny));

document.styleSheets[0].insertRule(
  `.cell {height: ${h}px !important; font-size: ${h}px !important;}`
);
