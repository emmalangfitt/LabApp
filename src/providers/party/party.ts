import { Injectable } from '@angular/core';
import firebase, { User } from 'firebase/app';
import 'firebase/database';

@Injectable()
export class PartyProvider {
  public partyList: firebase.database.Reference;
  public activePartyNum: firebase.database.Reference;

  constructor() {
    this.partyList = firebase.database().ref(`/parties/`);
    this.activePartyNum = firebase.database().ref(`/active`);
  }

  getPartyList(): firebase.database.Reference {
    return this.partyList;
  }

  getActivePartyNum(): firebase.database.Reference {
    return this.activePartyNum;
  }

  getActiveParty(): firebase.database.Reference {
    var num;
    var enabled;
    this.activePartyNum.on("value", snap => {
      num = snap.val();
    });
    return firebase.database().ref(`/parties/` + num + `/noratings`);
  }

  getWeighted(): firebase.database.Reference {
    var num;
    var enabled;
    this.activePartyNum.on("value", snap => {
      num = snap.val();
    });
    return firebase.database().ref(`/parties/` + num + `/weightedrankings`);
  }

  getVaried(): firebase.database.Reference {
    var num;
    var enabled;
    this.activePartyNum.on("value", snap => {
      num = snap.val();
    });
    return firebase.database().ref(`/parties/` + num + `/variedstart`);
  }

  setActivePartyNum(active: number): void {
    firebase.database().ref().update({active});
  }

  getNumParties(): number {
    var numParties = 0;
    this.partyList.once("value", function(snapshot) {
      numParties = snapshot.numChildren();
    });
    return numParties;
  }

  getPartyByNum(num: number): firebase.database.Reference {
    return firebase.database().ref(`/parties/` + num);
  }

  addParty(data: Array<any>): void {
    var numParties = 0;
    this.partyList.once("value", function(snapshot) {
      numParties = snapshot.numChildren();
      firebase.database().ref(`/parties/${numParties+1}/number`).set(numParties+1);
      firebase.database().ref(`/parties/${numParties+1}/noratings`).set(false);
      firebase.database().ref(`/parties/${numParties+1}/variedstart`).set(false);
      firebase.database().ref(`/parties/${numParties+1}/weightedrankings`).set(false);
      firebase.database().ref(`/parties/${numParties+1}/active`).set(false);
      firebase.database().ref(`/parties/${numParties+1}/userProfile/V2lgT8NhxhMNfok6y9GOePCTDFy1/role`).set(true);

      data.forEach(function (value) {
        firebase.database().ref(`/parties/${numParties+1}/${value}`).set(true);
      });
    });
  }
}
