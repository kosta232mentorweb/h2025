console.log(123);

const nx = 55;
const ny = 50;

document.documentElement.style.setProperty("--nx", nx);
document.documentElement.style.setProperty("--ny", ny);

const state = {
  board: {
    field: [],
  },
};

const board = createHTMLElenemt("div", { id: "board" }, null, document.body);

function clicker(event) {
  console.log(event.target.id);
  const id = event.target.id;
  const [x, y] = id
    .slice(1)
    .split("_")
    .map((el) => Number(el));
  console.log(x, y);
  sp[getIdfromXY(x, y)] = "x";
}

for (let y = 0; y < ny; y++) {
  for (let x = 0; x < nx; x++) {
    const cell = createHTMLElenemt(
      "div",
      { class: "cell", id: `c${x}_${y}` },
      `${x}-${y}`,
      board
    );
    //  console.log(cell);
    cell.addEventListener("click", clicker);
  }
}

function getIdfromXY(x, y) {
  return +(y * nx + x);
}

function getXYfromIdx(idx) {
  const y = Math.trunc(idx / nx);
  const x = idx - y * nx;

  return { x, y };
  //   state.board.field.at(y * ny + x);
}

const sp = new Proxy(state.board.field, {
  set(target, key, newValue) {
    //  console.log(target, key, newValue);
    target[key] = newValue;

    const { x, y } = getXYfromIdx(key);
    $(`#c${x}_${y}`).innerHTML = newValue;
    return true;
  },
});

// sp[getXY(x, y)] = getXY(x, y);

console.log(sp);

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function createHTMLElenemt(
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

  // if (target) {
  //   switch (how) {
  //     case "append":
  //       target.append(el);
  //       break;
  //     case "prepend":
  //       target.prepend(el);
  //       break;
  //     case "before":
  //       target.before(el);
  //       break;
  //     case "after":
  //       target.after(el);
  //       break;
  //   }
  // }
  if (target && how in ["append", "prepend", "before", "after"]) {
    target[how](el);
  }

  return el;
}

let z = 0;

for (let y = 0; y < ny; y++) {
  for (let x = 0; x < nx; x++) {
    sp[getIdfromXY(x, y)] = y * nx + x + z;
    //  z++;
  }
}

console.log(sp);

setInterval(() => {
  for (let y = ny - 1; y >= 0; y--) {
    for (let x = 0; x < nx; x++) {
      sp[getIdfromXY(x, y)] =
        y === 0 ? " " : "" + state.board.field[getIdfromXY(x, y - 1)];
    }
  }
}, 2000);
