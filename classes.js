class Automat {
  constructor() {
    this.alphabet = [];
    this.alphabet[0] = "$";
    this.states = [];
    this.finalStates = [];
    this.initialState;
    this.transitions = [];
    this.transitions.push([]);
    this.transitions[0][0] = "$";
    // Automat determinist
    this.transDetermin = [];
    this.statDetermin = [];
    this.finalStatDetermin = [];
    // Automat miroir
    this.miroirInitial;
    this.miroirFinal;
    this.AutoMiroir;
    this.miroirtransitions = [];
    this.miroirStates = [];
    // Automat reduit
    this.redStates = [];
    // Automat complement
    this.complStates = [];
    this.complFinalStates = [];
  }
  creationAuto() {
    // quand on ajoute une nouvelle etat il faurt qu'on fait d'abord push une linge puis on ajoute
    for (let j = 0; j < this.states.length; j++) {
      this.transitions.push([]);
      this.transitions[j + 1][0] = j + 1;
      for (let i = 1; i < this.alphabet.length; i++) {
        this.transitions[j + 1].push([]);
      }
    }
  }

  affichageAut() {
    console.log("<A,S,Si,F,I>");
    console.log("S : {" + this.states + "}");
    console.log("Si : " + this.initialState);
    console.log("F : {" + this.finalStates + "}");
    console.log("Transition sont décrit dans la table ");
    console.log(this.transitions);
  }

  setAlphabet(w) {
    if (!this.alphabet.includes(w)) {
      this.alphabet.push(w);
      this.transitions[0][this.alphabet.length - 1] = w;
    }
  }
  setState(Si) {
    for (let i = 0; i < Si; i++) {
      this.states.push(i + 1);
    }
  }
  afficheStates() {
    let st = [];
    for (let i = 0; i < this.states.length; i++) {
      st.push("S" + this.states[i]);
    }
    console.log(st);
    return " { " + st + " }";
  }
  setFinalState(i) {
    if (!this.finalStates.includes(i)) {
      this.finalStates.push(i);
    }
  }
  afficherFinal() {
    let fin = [];
    for (let j = 0; j < this.finalStates.length; j++) {
      fin.push("S" + this.finalStates[j]);
    }
    console.log(fin);
    return " { " + fin + " }";
  }
  setInitialStat(i) {
    this.initialState = i;
  }
  setTransition(stati, w, statj) {
    if (this.alphabet.includes(w)) {
      this.transitions[stati][this.transitions[0].indexOf(w, 1)].push(statj);
    }
  }
  rendreDeterministReduit() {
    this.reduction();
    if (!this.isDterminist()) {
      this.rendreDeterminist();
    }
  }
  rendreDeterminist() {
    this.transDetermin.push([]);
    this.transDetermin[0][0] = "$";
    this.statDetermin.push([]);
    this.statDetermin[0][0] = 1;
    for (let i = 1; i < this.alphabet.length; i++) {
      this.transDetermin[0][i] = this.alphabet[i];
    }
    let k = 0;
    while (k < this.statDetermin.length) {
      // ajout d'etat dans la table des transitions
      this.transDetermin.push([]);
      this.transDetermin[k + 1][0] = this.statDetermin[k];
      for (let i = 1; i < this.alphabet.length; i++) {
        this.transDetermin[k + 1].push([]);
      }
      // on fait l'union de tous les transitions des états pour chaque lettre de l'alphabet
      for (let m = 0; m < this.statDetermin[k].length; m++) {
        for (let j = 1; j < this.alphabet.length; j++) {
          let ensEtat = this.transitions[this.statDetermin[k][m]][j];
          for (let l = 0; l < ensEtat.length; l++) {
            if (!this.transDetermin[k + 1][j].includes(ensEtat[l])) {
              this.transDetermin[k + 1][j].push(ensEtat[l]);
            }
          }
          this.transDetermin[k + 1][j].sort();
          let n = 0;
          let trouv = false;
          // ajouter un nouveau état s'il n'est pas déja ajouté
          while (n < this.statDetermin.length && !trouv) {
            if (
              JSON.stringify(this.statDetermin[n]) ==
              JSON.stringify(this.transDetermin[k + 1][j])
            ) {
              trouv = true;
            }
            n++;
          }
          if (!trouv && this.transDetermin[k + 1][j].length > 0) {
            this.statDetermin.push(this.transDetermin[k + 1][j]);
            let r = 0;
            let find = false;
            while (!find && r < this.finalStates.length) {
              if (this.transDetermin[k + 1][j].includes(this.finalStates[r])) {
                find = true;
                this.finalStatDetermin.push(this.transDetermin[k + 1][j]);
              }
              r++;
            }
          }
        }
      }
      k++;
    }
  }
  isDterminist() {
    let trouv = false;
    let fini = false;
    while (!trouv && !fini) {
      let j = 1;

      while (j < this.alphabet.length && !trouv) {
        let i = 0;
        while (i < this.states.length && !trouv) {
          if (this.transitions[this.states[i]][j].length > 1) {
            trouv = true;
          }
          i++;
        }
        j++;
        if (j == this.alphabet.length) {
          fini = true;
        }
      }
    }
    return !trouv;
  }
  rendreComplet() {
    let trouv = false;
    let n = this.states.length + 1;
    for (let i = 1; i < this.alphabet.length; i++) {
      for (let j = 0; j < this.statDetermin.length; j++) {
        if (this.transDetermin[j + 1][i].length == 0) {
          trouv = true;
          this.transDetermin[j + 1][i].push(n);
        }
      }
    }
    if (trouv) {
      this.statDetermin.push([]);
      this.statDetermin[this.statDetermin.length - 1].push(n);

      this.transDetermin.push([]);

      this.transDetermin[this.statDetermin.length].push([]);
      this.transDetermin[this.statDetermin.length][0].push(n);

      for (let i = 1; i < this.alphabet.length; i++) {
        this.transDetermin[this.statDetermin.length].push([]);
        this.transDetermin[this.statDetermin.length][i].push(n);
      }
    }
  }
  reduction() {
    this.reductionNonAcc();
    this.reductionNonCoacc();
    console.log(this.transitions);
    return this.transitions;
  }
  getState() {
    return this.states;
  }
  reductionNonCoacc() {
    let coacc = [];

    coacc = coacc.concat(this.finalStates);
    let change = true;
    //determiner les etats cooacc
    while (change) {
      change = false;
      for (let j = 0; j < this.states.length; j++) {
        if (!coacc.includes(this.transitions[this.states[j]][0])) {
          let trouv = false;
          let k = 1;
          while (k < this.alphabet.length && !trouv) {
            let st = this.transitions[this.states[j]][k];
            let n = 0;
            while (n < st.length && !trouv) {
              if (coacc.includes(st[n])) {
                trouv = true;
                change = true;
                coacc.push(this.states[j]);
              }
              n++;
            }
            k++;
          }
        }
      }
    }

    //eliminer les etats non coac
    // on parcour tout la table des transitions on suprime les états qui n'existe pas dans coacc
    for (let i = 0; i < this.states.length; i++) {
      if (!coacc.includes(this.transitions[this.states[i]][0])) {
        this.transitions[this.states[i]].splice(
          0,
          this.transitions[this.states[i]].length
        );
        this.redStates.push(this.states[i]);
      } else {
        for (let j = 1; j < this.alphabet.length; j++) {
          let n = 0;
          while (n < this.transitions[this.states[i]][j].length) {
            if (!coacc.includes(this.transitions[this.states[i]][j][n])) {
              this.transitions[this.states[i]][j].splice(n, 1);
            } else {
              n++;
            }
          }
        }
      }
    }

    while (this.redStates.length > 0) {
      this.states.splice(this.states.indexOf(this.redStates.shift()), 1);
    }
  }
  reductionNonAcc() {
    // on cherche les etats accessibles

    let acc = [];
    acc.push(this.initialState);

    for (let i = 0; i < acc.length; i++) {
      for (let j = 1; j < this.alphabet.length; j++) {
        for (let k = 0; k < this.transitions[acc[i]][j].length; k++) {
          if (!acc.includes(this.transitions[acc[i]][j][k])) {
            acc.push(this.transitions[acc[i]][j][k]);
          }
        }
      }
    }

    // on suprime les etats non accessible
    for (let i = 0; i < this.states.length; i++) {
      if (!acc.includes(this.states[i])) {
        this.transitions[this.states[i]].splice(
          0,
          this.transitions[this.states[i]].length
        );
        this.redStates.push(this.states[i]);
        if (this.finalStates.includes(this.states[i])) {
          this.finalStates.splice(this.finalStates.indexOf(this.states[i]), 1);
        }
      }
    }

    while (this.redStates.length > 0) {
      this.states.splice(this.states.indexOf(this.redStates.shift()), 1);
    }
  }
  complement() {
    if (!this.isDterminist()) {
      this.rendreDeterminist();
    } else {
      this.transDetermin = this.transitions;
    }
    this.statDetermin = this.states;
    this.rendreComplet();
    //inverser les etats
    for (let i = 0; i < this.statDetermin.length; i++) {
      // parcourir la liste un par un si il n est pas
      //dans fin donc mettre dans this.complFinalStates;
      let r = 0;
      let find = false;

      while (!find && r < this.finalStates.length) {
        if (this.statDetermin[i].length > 1) {
          if (this.statDetermin[i].includes(this.finalStates[r])) {
            find = true;
          }
        } else {
          if (this.statDetermin[i] == this.finalStates[r]) {
            find = true;
          }
        }

        r++;
      }
      if (!find) {
        this.complFinalStates.push(this.statDetermin[i]);
      }
    }
  }
  afficherComplemet() {
    console.log("<Acomp,Scomp,Sicomp,Fcomp,Icomp>");
    console.log("Scomp : {" + this.statDetermin + "}");
    console.log("Sicomp : " + this.initialState);
    console.log("Fcomp : {" + this.complFinalStates + "}");
    console.log("Transition sont décrit dans la table ");
    console.log(this.transDetermin);
  }
  miroir() {
    this.miroirStates = this.miroirStates.concat(this.states);
    if (this.finalStates.length > 1) {
      // ajouter un etat final et relie toutes les etas finaux avec lui par des transitions spantané 0
      this.transitions[0].push("0");
      this.transitions.push([]);
      this.transitions[this.states.length + 1][0] = this.states.length + 1;
      for (let i = 1; i < this.alphabet.length + 1; i++) {
        this.transitions[this.states.length + 1].push([]);
      }

      for (let i = 0; i < this.states.length; i++) {
        this.transitions[i + 1].push([]);
      }

      for (let i = 0; i < this.finalStates.length; i++) {
        this.transitions[this.finalStates[i]][this.alphabet.length].push(
          this.states.length + 1
        );
      }
      this.miroirInitial = this.states.length + 1;
      this.miroirStates.push(this.miroirInitial);
      this.states.push(this.states.length + 1);
    } else {
      this.miroirInitial = this.finalStates[0];
    }

    this.miroirFinal = this.initialState;

    // inverser les transitions
    this.miroirtransitions.push(this.transitions[0]);
    for (let j = 0; j < this.states.length; j++) {
      this.miroirtransitions.push([]);
      this.miroirtransitions[j + 1][0] = j + 1;
      for (let i = 1; i < this.alphabet.length + 1; i++) {
        this.miroirtransitions[j + 1].push([]);
      }
    }
    for (let k = 0; k < this.states.length; k++) {
      for (let i = 1; i < this.alphabet.length + 1; i++) {
        let tr = this.transitions[k + 1][i];
        for (let n = 0; n < tr.length; n++) {
          this.miroirtransitions[tr[n]][i].push(this.transitions[k + 1][0]);
        }
      }
    }
  }
  affichageAutMiroir() {
    console.log("<Amir,Smir,Smir,Fmir,Imir>");
    console.log("Smir : {" + this.miroirStates + "}");
    console.log("Sicomp : " + this.miroirInitial);
    console.log("Fcomp : {" + this.miroirFinal + "}");
    console.log("Transition sont décrit dans la table ");
    console.log(this.miroirtransitions);
  }
  reconnaissance(mot) {
    let i = 0;
    let bloc = false;
    let j = this.initialState;
    while (i < mot.length && !bloc) {
      if (this.transitions[j][this.alphabet.indexOf(mot[i])].length == 0) {
        bloc = true;
      } else {
        j = this.transitions[j][this.alphabet.indexOf(mot[i])][0];
      }
      i++;
    }
    if (bloc) {
      console.log("chemin bloqué");
      return false;
    } else {
      if (this.finalStates.includes(j)) {
        console.log("chemin réussi");
        return true;
      } else {
        console.log("chemin non réussi ");
        return false;
      }
    }
  }
}
/*let aut = new Automat();
aut.setAlphabet("a");
aut.setAlphabet("b");
aut.setAlphabet("c");
aut.setState(1);
aut.setState(2);
aut.setState(3);
aut.setState(4);
aut.setState(5);
aut.setState(6);
aut.creationAuto();
/*aut.setTransition(1, "a", 2);
aut.setTransition(1, "a", 7);
aut.setTransition(1, "b", 3);
aut.setTransition(1, "b", 8);
aut.setTransition(2, "a", 7);
aut.setTransition(3, "a", 4);
aut.setTransition(3, "b", 4);
aut.setTransition(4, "c", 5);
aut.setTransition(5, "a", 3);
aut.setTransition(7, "b", 2);
aut.setTransition(6, "a", 7);
aut.setTransition(8, "a", 3);
aut.setTransition(8, "a", 1);
aut.setTransition(8, "a", 4);
aut.setFinalState(5);
aut.setFinalState(6);*/
/*aut.setTransition(1, "a", 2);
aut.setTransition(2, "a", 3);
aut.setTransition(3, "a", 4);
aut.setTransition(4, "b", 5);
aut.setTransition(5, "b", 6);
aut.setFinalState(5);
aut.setFinalState(6);
aut.setInitialStat(1);
aut.affichageAut();
aut.reconnaissance("aaabb");
//aut.reduction();
//aut.affichageAut();
//aut.affichageAutMiroir();
//aut.rendreDeterministReduit();
//aut.complement();
//aut.afficherComplemet();*/
