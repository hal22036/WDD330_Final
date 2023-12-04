(function () {
  const n = document.createElement("link").relList;
  if (n && n.supports && n.supports("modulepreload")) return;
  for (const e of document.querySelectorAll('link[rel="modulepreload"]')) r(e);
  new MutationObserver((e) => {
    for (const t of e)
      if (t.type === "childList")
        for (const s of t.addedNodes)
          s.tagName === "LINK" && s.rel === "modulepreload" && r(s);
  }).observe(document, { childList: !0, subtree: !0 });
  function c(e) {
    const t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === "use-credentials"
        ? (t.credentials = "include")
        : e.crossOrigin === "anonymous"
          ? (t.credentials = "omit")
          : (t.credentials = "same-origin"),
      t
    );
  }
  function r(e) {
    if (e.ep) return;
    e.ep = !0;
    const t = c(e);
    fetch(e.href, t);
  }
})();
const f = "exercisedb.p.rapidapi.com",
  l = {
    async fetchBodyPartOptions(o) {
      try {
        const c = await p(
          "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
          o,
        );
        if (!c.ok)
          throw new Error(
            `Failed to fetch body part options. Status: ${c.status}`,
          );
        return c.json();
      } catch (n) {
        return console.error("Error fetching body part options:", n), [];
      }
    },
    async fetchExercises(o, n = 1 / 0, c) {
      try {
        const e = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(
            o,
          )}?limit=${n}`,
          t = await p(e, c);
        if (!t.ok)
          throw new Error(`Failed to fetch exercises. Status: ${t.status}`);
        const s = await t.json(),
          a = Array.isArray(s) ? s : s.exercises ? s.exercises : [s];
        if (!Array.isArray(a) || a.length === 0)
          throw new Error("Invalid or empty exercises data");
        const i = Array.from(new Set(a.flatMap((d) => d.equipment || []))).map(
          (d) => ({ value: d }),
        );
        return (
          console.log("Unique Equipment Types in api.mjs:", i),
          { exercises: a, uniqueEquipmentTypes: i }
        );
      } catch (r) {
        return (
          console.error("Error fetching exercises:", r),
          { exercises: [], uniqueEquipmentTypes: [] }
        );
      }
    },
  };
async function p(o, n) {
  const c = {
    method: "GET",
    headers: { "X-RapidAPI-Key": n, "X-RapidAPI-Host": f },
  };
  try {
    const r = await fetch(o, c);
    if (!r.ok) throw new Error(`Failed to fetch data. Status: ${r.status}`);
    return r;
  } catch (r) {
    return console.error("Error fetching data:", r), { ok: !1 };
  }
}
function y(o, n) {
  const c = document.createElement("h2");
  (c.textContent = "Click a card to do an exercise"), o.appendChild(c);
  const r = document.createElement("div");
  (r.className = "card-container"),
    o.appendChild(r),
    n.forEach((e) => {
      const t = document.createElement("div");
      t.className = "card";
      const s = document.createElement("img");
      (s.src = e.gifUrl), (s.alt = e.name), t.appendChild(s);
      const a = document.createElement("p");
      (a.textContent = e.name),
        t.appendChild(a),
        t.addEventListener("click", () => {
          E(e);
        }),
        r.appendChild(t);
    });
}
function E(o) {
  const n = document.getElementById("chosenCard");
  n.innerHTML = "";
  const c = document.createElement("div");
  (c.className = "chosen-card-content"), n.appendChild(c);
  const r = document.createElement("img");
  (r.src = o.gifUrl), (r.alt = o.name), c.appendChild(r);
  const e = document.createElement("div");
  (e.className = "exercise-details-content"), c.appendChild(e);
  const t = document.createElement("h3");
  (t.textContent = o.name), e.appendChild(t);
  const s = document.createElement("ol");
  o.instructions.forEach((i) => {
    const d = document.createElement("li");
    (d.textContent = i), s.appendChild(d);
  }),
    e.appendChild(s);
  const a = document.createElement("button");
  (a.textContent = "Exercise Complete"),
    (a.className = "completed-button"),
    a.addEventListener("click", () => {
      h(o);
    }),
    e.appendChild(a);
}
function h(o) {
  const n = JSON.parse(localStorage.getItem("completedExercises")) || [];
  n.push({
    name: o.name,
    equipment: o.equipment || "N/A",
    date: new Date().toLocaleDateString(),
  }),
    localStorage.setItem("completedExercises", JSON.stringify(n)),
    u(n);
}
function u(o) {
  const n = document.getElementById("completedExercisesTable"),
    c = document.querySelector(".completed-exercises-container");
  if (o.length === 0) {
    (n.style.display = "none"), (c.style.display = "none");
    return;
  } else (n.style.display = "table"), (c.style.display = "block");
  const r = n.querySelector("tbody");
  (r.innerHTML = ""),
    o.forEach((e) => {
      const t = r.insertRow();
      (t.insertCell(0).textContent = e.name),
        (t.insertCell(1).textContent = e.equipment),
        (t.insertCell(2).textContent = e.date);
    });
}
const g = document.getElementById("container");
g.classList.add("container");
function m(o, n) {
  o.innerHTML = "";
  const c = Array.isArray(n) ? n : [n],
    r = document.createElement("option");
  (r.text = "Select an option"),
    (r.value = ""),
    o.add(r),
    c.forEach((e) => {
      const t = document.createElement("option"),
        s = typeof e == "object" ? e.value : e;
      (t.value = s), (t.text = s), o.appendChild(t);
    });
}
document.addEventListener("DOMContentLoaded", async () => {
  const o = document.getElementById("equipmentSelect"),
    n = "08afda21f6msh1d1e95b25d2af67p1d1dbbjsn0d3e89ada2e4",
    c = document.getElementById("bodyPartSelect");
  c.addEventListener("change", async () => {
    const r = c.value;
    try {
      const e = await l.fetchBodyPartOptions(n);
      console.log("Body Part Options:", e);
      const { uniqueEquipmentTypes: t } = await l.fetchExercises(r, 1 / 0, n);
      console.log("Unique Equipment Types in main.js:", t), m(o, t);
    } catch (e) {
      console.error("Error:", e);
    }
  }),
    o.addEventListener("change", async () => {
      const r = c.value,
        e = o.value;
      console.log("Selected Body Part:", r),
        console.log("Selected Equipment:", e);
      const { exercises: t } = await l.fetchExercises(r, 10, n);
      console.log("API response:", t), console.log("Selected Equipment:", e);
      const s = t.filter(
        (i) => (console.log("Checking exercise:", i), e.includes(i.equipment)),
      );
      console.log("Filtered Exercises:", s);
      const a = document.getElementById("container");
      (a.innerHTML = ""),
        s.length === 0
          ? (a.innerHTML =
              "<p class='different'>Please Choose Different Equipment</p>")
          : y(a, s);
    }),
    m(c, await l.fetchBodyPartOptions(n));
});
document.addEventListener("DOMContentLoaded", () => {
  const o = JSON.parse(localStorage.getItem("completedExercises")) || [];
  u(o);
});