let invites = [];

const search = document.getElementById("search");
const suggestions = document.getElementById("suggestions");

const resultBox = document.getElementById("result");
const nameBox = document.getElementById("name");
const tableBox = document.getElementById("table");

// Charger Excel
fetch("invites.xlsx")
  .then(r => r.arrayBuffer())
  .then(data => {
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    invites = XLSX.utils.sheet_to_json(sheet);
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

// mini confettis simple
function launchConfetti(){
  for(let i=0;i<25;i++){
    const c = document.createElement("div");
    c.style.position="fixed";
    c.style.width="6px";
    c.style.height="6px";
    c.style.background="#b08d57";
    c.style.left=Math.random()*100+"vw";
    c.style.top="-10px";
    document.body.appendChild(c);

    let fall = setInterval(()=>{
      c.style.top = (parseFloat(c.style.top)+5)+"px";
      if(parseFloat(c.style.top)>window.innerHeight){
        clearInterval(fall);
        c.remove();
      }
    },20);
  }
}