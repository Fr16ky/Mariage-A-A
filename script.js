let invites = [];

const search = document.getElementById("search");
const suggestions = document.getElementById("suggestions");

const resultBox = document.getElementById("result");
const nameBox = document.getElementById("name");
const tableBox = document.getElementById("table");

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

    // Convertit la feuille en tableau d'objets JSON
    // Les entêtes de colonnes dans Excel doivent être : Prenom, Nom, Table
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    invites = rows.map(row => {
      // On cherche les clés en ignorant la casse et les accents éventuels
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

  const val = search.value.toLowerCase();
  suggestions.innerHTML = "";

  if (val.length < 2) return;

  const filtered = invites.filter(p =>
    (p.prenom && p.prenom.toLowerCase().includes(val)) ||
    (p.nom && p.nom.toLowerCase().includes(val))
  );

  filtered.slice(0, 8).forEach(p => {

    const div = document.createElement("div");
    div.textContent = `${p.prenom} ${p.nom}`;

    div.onclick = () => {
      showResult(p);
      suggestions.innerHTML = "";
      search.value = `${p.prenom} ${p.nom}`;
    };

    suggestions.appendChild(div);
  });

});

function showResult(p){
  nameBox.textContent = `Bienvenue ${p.prenom}`;
  tableBox.textContent = `TABLE ${p.table}`;
  resultBox.classList.remove("hidden");

  launchConfetti();
}

function launchConfetti(){
  for(let i=0;i<20;i++){
    const c = document.createElement("div");
    c.style.position="fixed";
    c.style.width="6px";
    c.style.height="6px";
    c.style.background="#b08d57";
    c.style.left=Math.random()*100+"vw";
    c.style.top="-10px";
    document.body.appendChild(c);

    let y = -10;

    let fall = setInterval(()=>{
      y += 5;
      c.style.top = y + "px";

      if(y > window.innerHeight){
        clearInterval(fall);
        c.remove();
      }
    },20);
  }
}
