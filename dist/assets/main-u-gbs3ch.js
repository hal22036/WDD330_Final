(function () {
  const o = document.createElement("link").relList;
  if (o && o.supports && o.supports("modulepreload")) return;
  for (const e of document.querySelectorAll('link[rel="modulepreload"]')) n(e);
  new MutationObserver((e) => {
    for (const t of e)
      if (t.type === "childList")
        for (const r of t.addedNodes)
          r.tagName === "LINK" && r.rel === "modulepreload" && n(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(e) {
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
  function n(e) {
    if (e.ep) return;
    e.ep = !0;
    const t = s(e);
    fetch(e.href, t);
  }
})();
const m = "exercisedb.p.rapidapi.com",
  d = {
    async fetchBodyPartOptions(c) {
      try {
        const s = await p(
          "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
          c,
        );
        if (!s.ok)
          throw new Error(
            `Failed to fetch body part options. Status: ${s.status}`,
          );
        return s.json();
      } catch (o) {
        return console.error("Error fetching body part options:", o), [];
      }
    },
    async fetchExercises(c, o = 1 / 0, s) {
      try {
        const e = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(
            c,
          )}?limit=${o}`,
          t = await p(e, s);
        if (!t.ok)
          throw new Error(`Failed to fetch exercises. Status: ${t.status}`);
        const r = await t.json(),
          a = Array.isArray(r) ? r : r.exercises ? r.exercises : [r];
        if (!Array.isArray(a) || a.length === 0)
          throw new Error("Invalid or empty exercises data");
        const i = Array.from(new Set(a.flatMap((l) => l.equipment || []))).map(
          (l) => ({ value: l }),
        );
        return (
          console.log("Unique Equipment Types in api.mjs:", i),
          { exercises: a, uniqueEquipmentTypes: i }
        );
      } catch (n) {
        return (
          console.error("Error fetching exercises:", n),
          { exercises: [], uniqueEquipmentTypes: [] }
        );
      }
    },
  };
async function p(c, o) {
  const s = {
    method: "GET",
    headers: { "X-RapidAPI-Key": o, "X-RapidAPI-Host": m },
  };
  try {
    const n = await fetch(c, s);
    if (!n.ok) throw new Error(`Failed to fetch data. Status: ${n.status}`);
    return n;
  } catch (n) {
    return console.error("Error fetching data:", n), { ok: !1 };
  }
}
function f(c, o) {
  const s = document.createElement("h2");
  (s.textContent = "Click a card to do an exercise"), c.appendChild(s);
  const n = document.createElement("div");
  (n.className = "card-container"),
    c.appendChild(n),
    o.forEach((e) => {
      const t = document.createElement("div");
      t.className = "card";
      const r = document.createElement("img");
      (r.src = e.gifUrl), (r.alt = e.name), t.appendChild(r);
      const a = document.createElement("p");
      (a.textContent = e.name), t.appendChild(a), n.appendChild(t);
    });
}
const y = document.getElementById("container");
y.classList.add("container");
function u(c, o) {
  c.innerHTML = "";
  const s = Array.isArray(o) ? o : [o],
    n = document.createElement("option");
  (n.text = "Select an option"),
    (n.value = ""),
    c.add(n),
    s.forEach((e) => {
      const t = document.createElement("option"),
        r = typeof e == "object" ? e.value : e;
      (t.value = r), (t.text = r), c.appendChild(t);
    });
}
document.addEventListener("DOMContentLoaded", async () => {
  const c = document.getElementById("equipmentSelect"),
    o = "08afda21f6msh1d1e95b25d2af67p1d1dbbjsn0d3e89ada2e4",
    s = document.getElementById("bodyPartSelect");
  s.addEventListener("change", async () => {
    const n = s.value;
    try {
      const e = await d.fetchBodyPartOptions(o);
      console.log("Body Part Options:", e);
      const { uniqueEquipmentTypes: t } = await d.fetchExercises(n, 1 / 0, o);
      console.log("Unique Equipment Types in main.js:", t), u(c, t);
    } catch (e) {
      console.error("Error:", e);
    }
  }),
    c.addEventListener("change", async () => {
      const n = s.value,
        e = c.value;
      console.log("Selected Body Part:", n),
        console.log("Selected Equipment:", e);
      const { exercises: t } = await d.fetchExercises(n, 10, o);
      console.log("API response:", t), console.log("Selected Equipment:", e);
      const r = t.filter(
        (i) => (console.log("Checking exercise:", i), e.includes(i.equipment)),
      );
      console.log("Filtered Exercises:", r);
      const a = document.getElementById("container");
      (a.innerHTML = ""),
        r.length === 0
          ? (a.innerHTML =
              "<p class='different'>Please Choose Different Equipment</p>")
          : f(a, r);
    }),
    u(s, await d.fetchBodyPartOptions(o));
});
