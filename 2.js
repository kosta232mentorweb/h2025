console.log("Начинаем игру!");

const nx = 16;
const ny = 16;

document.documentElement;

document.documentElement.style.setProperty("--nx", nx);
document.documentElement.style.setProperty("--ny", ny);

const state = {
  board: {
    field: Array(nx * ny).fill(" "),
  },
};

const board = createHTMLElement("div", { id: "board" }, null, document.body);

const mouseButtons = { value: 0 };

document.addEventListener("mousedown", (event) => {
  mouseButtons.value = event.buttons;
});

document.addEventListener("mouseup", (event) => {
  mouseButtons.value = 0;
});

board.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) return;
  const [x, y] = cell.id.slice(1).split("_").map(Number);
  setField(x, y, "X");
});

board.addEventListener("mouseover", (event) => {
  if (mouseButtons.value != 1) return;
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

const setField = (x, y, val) => (sp[idxFromXY(x, y)] = val);

function idxFromXY(x, y) {
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
  const prev = state.board.field.slice(); // клонируем

  label: for (let x = 0; x < nx; x++) {
    for (let y = ny - 1; y >= 0; y--) {
      if (prev[idxFromXY(x, y)] !== " ") {
        continue;
      }
      for (let y2 = y; y2 >= 0; y2--) {
        if (y2 === 0) {
          setField(x, y2, " ");
        } else {
          setField(x, y2, prev[idxFromXY(x, y2 - 1)]);
        }
      }
      continue label;
    }
  }
}, 1000);

// setInterval(() => {
//   for (let x = 0; x < nx; x++) {
//     for (let y = ny - 1; y > 0; y--) {
//       const i = idxFromXY(x, y);
//       const j = idxFromXY(x, y - 1);
//       if (state.board.field[i] === " " && state.board.field[j] !== " ") {
//         // одношаговое падение
//         const v = state.board.field[j];
//         sp[i] = v;
//         sp[j] = " ";
//       }
//     }
//   }
// }, 500);

// быстрое падение
// setInterval(() => {
//   const prev = state.board.field.slice(); // снимок только для чтения

//   for (let x = 0; x < nx; x++) {
//     // записываем снизу вверх
//     let writeY = ny - 1;

//     // 1) сваливаем все непустые вниз, сохраняя порядок сверху-вниз
//     for (let y = ny - 1; y >= 0; y--) {
//       const v = prev[idFromXY(x, y)];
//       if (v !== " ") {
//         setField(x, writeY, v);
//         writeY--;
//       }
//     }

//     // 2) остаток сверху заполняем пробелами
//     for (let y = writeY; y >= 0; y--) {
//       setField(x, y, " ");
//     }
//   }
// }, 500);

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

function delay(ms) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

(async () => {
  await delay(1000);
  $("#c2_2").classList.add("bt");
  await delay(1000);
  $("#c2_2").classList.add("br");
  await delay(1000);
  $("#c2_2").classList.add("bb");
  await delay(1000);
  $("#c2_2").classList.add("bl");
})();

function* sId(x, y) {
  const c = "#c";
  yield { c: c + (x + 0) + "_" + (y + 0), class: "bt" };
  yield { c: c + (x + 1) + "_" + (y + 0), class: "bt" };
  yield { c: c + (x + 2) + "_" + (y + 0), class: "bt" };
  yield { c: c + (x + 2) + "_" + (y + 0), class: "br" };
  yield { c: c + (x + 2) + "_" + (y + 1), class: "br" };
  yield { c: c + (x + 2) + "_" + (y + 2), class: "br" };
  yield { c: c + (x + 2) + "_" + (y + 2), class: "bb" };
  yield { c: c + (x + 1) + "_" + (y + 2), class: "bb" };
  yield { c: c + (x + 0) + "_" + (y + 2), class: "bb" };
  yield { c: c + (x + 0) + "_" + (y + 2), class: "bl" };
  yield { c: c + (x + 0) + "_" + (y + 1), class: "bl" };
  yield { c: c + (x + 0) + "_" + (y + 0), class: "bl" };
}

function* sId2(x, y) {
  const c = "#c";
  const m = 2;
  for (const s of rangeGen(0, m))
    yield { c: c + (x + s) + "_" + (y + 0), class: "bt" };
  for (const s of rangeGen(0, m))
    yield { c: c + (x + m) + "_" + (y + s), class: "br" };
  for (const s of rangeGen(m, 0))
    yield { c: c + (x + s) + "_" + (y + m), class: "bb" };
  for (const s of rangeGen(m, 0))
    yield { c: c + (x + 0) + "_" + (y + s), class: "bl" };
}

function* rangeGen(start, end) {
  const dir = end > start;

  if (start === end) yield start;
  else
    for (let i = start; dir ? i <= end : i >= end; dir ? i++ : i--) {
      yield i;
    }
}

function range(start = 0, end = 9) {
  return [...rangeGen(start, end)];
}

console.log([...sId(2, 3)]);
console.log(range(0, 11));

const r3 = range(0, 2);
console.log(r3);
console.log([...rangeGen(2, 0)]);

async function border3x3(x, y, pause = 300) {
  for (let c of sId2(x, y)) {
    await delay(pause);
    $(c.c).classList.add(c.class);
  }
}

(async () => {
  for (let c of sId(5, 5)) {
    await delay(100);
    $(c.c).classList.add(c.class);
  }

  await border3x3(9, 8, 100);
  await border3x3(9, 8, 500);
})();
