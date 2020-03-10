window.onload = function() {
  let aut = new Automat();
  let nbState;
  let init;
  let nbFin;
  let nbLet;
  let cptalph = 0;
  let cptF = 0;
  let alph = [];
  document.getElementById("valider").addEventListener("click", function() {
    nbState = document.getElementById("nombreEtats").value;
    init = document.getElementById("init").value;
    nbFin = document.getElementById("Nbfin").value;
    nbLet = document.getElementById("nbLettre").value;
    aut.setState(nbState);
    let states = document.getElementById("states");
    let st = aut.afficheStates();
    states.innerHTML += st;
    aut.setInitialStat(init);
    document.getElementById("Initst").innerHTML += " S" + init;
    document.getElementById("etape2").style.visibility = "visible";
    document.getElementById("valider").disabled = true;
  });
  document.getElementById("validF").addEventListener("click", function() {
    cptF++;
    document.getElementById("cpt").innerHTML = cptF;
    let fis = document.getElementById("recupFin").value;
    aut.setFinalState(fis);
    if (cptF == nbFin) {
      document.getElementById("finals").innerHTML += aut.afficherFinal();
      document.getElementById("validF").disabled = true;
    }
  });
  document.getElementById("validLet").addEventListener("click", function() {
    cptalph++;
    alph.push(document.getElementById("lettre").value);
    document.getElementById("cptlettre").innerHTML = cptalph;
    aut.setAlphabet(document.getElementById("lettre").value);
    let cel = document.getElementById("thead").insertCell();
    cel.innerHTML = document.getElementById("lettre").value;
    if (cptalph == nbLet) {
      aut.creationAuto();
      document.getElementById("validLet").disabled = true;
      document.getElementById("etape3").style.visibility = "visible";
      for (let i = 0; i < nbState; i++) {
        let row = document.getElementById("tbody").insertRow();
        row.id = "S" + (i + 1);

        row.innerHTML = "S" + (i + 1);
        for (let j = 0; j < nbLet; j++) {
          let c = row.insertCell();
          c.id = "S" + (i + 1) + alph[j];
        }
      }
    }
  });

  document.getElementById("validTr").addEventListener("click", function() {
    let si = document.getElementById("trinit").value;
    let a = document.getElementById("trLet").value;
    let sj = document.getElementById("trfin").value;
    aut.setTransition(si, a, sj);
    document.getElementById("S" + si + a).innerHTML += " S" + sj;
  });
  document.getElementById("validTrans").addEventListener("click", function() {
    document.getElementById("validTrans").disabled = true;
    document.getElementById("validTr").disabled = true;
  });
  document.getElementById("red").addEventListener("click", function() {
    //aut.reduction();
    let parentElement = document.getElementById("tbody");
    let trans = aut.reduction();
    let stat = aut.getState();
    console.log(stat);
    console.log(trans);
    for (let i = 0; i < nbState; i++) {
      parentElement.removeChild(document.getElementById("S" + (i + 1)));
    }
    for (let j = 0; j < stat.length; j++) {
      let row = document.getElementById("tbody").insertRow();
      row.id = "S" + (i + 1);

      row.innerHTML = "S" + stat[i];
      for (let j = 0; j < nbLet; j++) {
        let c = row.insertCell();
        c.id = "S" + (i + 1) + alph[j];
        c.innerHTML = trans[stat[i]][j + 1];
      }
    }
  });
};
