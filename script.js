let invites = [];

const search = document.getElementById("search");
const suggestions = document.getElementById("suggestions");

const searchFace = document.getElementById("searchFace");
const resultFace = document.getElementById("result");
const nameBox = document.getElementById("name");
const tableBox = document.getElementById("table");
const backBtn = document.getElementById("backBtn");
const confettiLayer = document.getElementById("confetti-layer");

// Enlève les accents pour une recherche plus tolérante (ex: "Elie" trouve "Élie")
function normalize(str){
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// CHARGEMENT EXCEL (via SheetJS) - fonctionne sur GitHub Pages
fetch("invites.xlsx")
  .then(res => {
    if (!res.ok) throw new Error("Fichier invites.xlsx introuvable (vérifie le nom exact, sensible à la casse)");
    return res.arrayBuffer();
  })
  .then(buffer => {
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];

    // Les entêtes de colonnes dans Excel doivent être : Prenom, Nom, Table
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    invites = rows.map(row => {
      const keys = Object.keys(row);
      const prenomKey = keys.find(k => k.toLowerCase().includes("prenom") || k.toLowerCase().includes("prénom"));
      const nomKey = keys.find(k => k.toLowerCase() === "nom");
      const tableKey = keys.find(k => k.toLowerCase().includes("table"));

      return {
        prenom: String(row[prenomKey] ?? "").trim(),
        nom: String(row[nomKey] ?? "").trim(),
        table: String(row[tableKey] ?? "").trim()
      };
    });

    console.log("Invités chargés :", invites);
  })
  .catch(err => {
    console.error("Erreur chargement Excel :", err);
  });

search.addEventListener("input", () => {

  const val = normalize(search.value);
  suggestions.innerHTML = "";

  if (val.length < 2) return;

  const filtered = invites.filter(p =>
    normalize(p.prenom).includes(val) ||
    normalize(p.nom).includes(val)
  );

  filtered.slice(0, 6).forEach((p, i) => {

    const div = document.createElement("div");
    div.textContent = `${p.prenom} ${p.nom}`;
    div.setAttribute("tabindex", "0");
    div.style.animationDelay = `${i * 45}ms`;

    const select = () => {
      showResult(p);
      suggestions.innerHTML = "";
      search.value = `${p.prenom} ${p.nom}`;
    };

    div.onclick = select;
    div.addEventListener("keydown", e => {
      if (e.key === "Enter") select();
    });

    suggestions.appendChild(div);
  });

});

function showResult(p){
  nameBox.textContent = p.prenom;
  tableBox.textContent = p.table;

  searchFace.classList.add("hidden");
  resultFace.classList.remove("hidden");
  resultFace.classList.remove("flip-in");
  void resultFace.offsetWidth; // relance l'animation à chaque recherche
  resultFace.classList.add("flip-in");

  launchPetals();
}

backBtn.addEventListener("click", () => {
  resultFace.classList.add("hidden");
  searchFace.classList.remove("hidden");
  search.value = "";
  suggestions.innerHTML = "";
  search.focus();
});

function launchPetals(){
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const colors = ["#b8935a", "#d9c39a", "#d9b8ae"];

  for (let i = 0; i < 26; i++){
    const petal = document.createElement("div");
    petal.className = "petal";

    const duration = 2.4 + Math.random() * 1.6;
    const delay = Math.random() * 0.5;
    const spin = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360);

    petal.style.left = Math.random() * 100 + "vw";
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    petal.style.setProperty("--spin", spin + "deg");
    petal.style.animationDuration = duration + "s";
    petal.style.animationDelay = delay + "s";
    petal.style.opacity = String(0.7 + Math.random() * 0.3);

    confettiLayer.appendChild(petal);

    setTimeout(() => petal.remove(), (duration + delay) * 1000 + 200);
  }
}
