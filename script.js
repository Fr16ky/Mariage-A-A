let invites = [];

const search = document.getElementById("search");
const suggestions = document.getElementById("suggestions");

const resultBox = document.getElementById("result");
const nameBox = document.getElementById("name");
const tableBox = document.getElementById("table");

// CHARGEMENT CSV (FIABLE SUR GITHUB PAGES)
fetch("invites.csv")
  .then(res => {
    if (!res.ok) throw new Error("CSV introuvable");
    return res.text();
  })
  .then(text => {

    console.log("CSV brut :", text); // DEBUG IMPORTANT

    const lines = text.trim().split("\n");

    invites = lines.slice(1).map(line => {
      const [prenom, nom, table] = line.split(",");
      return { prenom, nom, table };
    });

    console.log("Invités chargés :", invites);
  })
  .catch(err => {
    console.error("Erreur chargement CSV :", err);
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
