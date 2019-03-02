/*
  Party Provider
    - provides access to list of parties and their settings
    - lets admin account change the active party
    - gives other providers access to which party is active
    - parties are automatically numbered as number of existing parties + 1
*/

import { Injectable } from '@angular/core';
import firebase, { User } from 'firebase/app';
import 'firebase/database';

@Injectable()
export class PartyProvider {
  public partyList: firebase.database.Reference; // list of all existing parties
  public activePartyNum: firebase.database.Reference; // reference to active party number

  constructor() {
    this.partyList = firebase.database().ref(`/parties/`);
    this.activePartyNum = firebase.database().ref(`/active`);
  }

  /*
    returns reference to list of all parties
  */
  getPartyList(): firebase.database.Reference {
    return this.partyList;
  }

  /*
    returns reference to active party number
  */
  getActivePartyNum(): firebase.database.Reference {
    return this.activePartyNum;
  }

  /*
     returns reference to boolean the indicates whether the active
     party allows user to rate each other or not
  */
  getRatings(): firebase.database.Reference {
    var num;
    var enabled;
    this.activePartyNum.on("value", snap => {
      num = snap.val();
    });
    return firebase.database().ref(`/parties/` + num + `/noratings`);
  }

  /*
     returns reference to boolean the indicates whether the active
     party weights ratings based on the rater's own rating
  */
  getWeighted(): firebase.database.Reference {
    var num;
    var enabled;
    this.activePartyNum.on("value", snap => {
      num = snap.val();
    });
    return firebase.database().ref(`/parties/` + num + `/weightedrankings`);
  }

  /*
     returns reference to boolean the indicates whether the active
     party starts with varied initial ratings
  */
  getVaried(): firebase.database.Reference {
    var num;
    var enabled;
    this.activePartyNum.on("value", snap => {
      num = snap.val();
    });
    return firebase.database().ref(`/parties/` + num + `/variedstart`);
  }

  /*
     sets the active party number to the clicked-on party in firebase
  */
  setActivePartyNum(active: number): void {
    firebase.database().ref().update({active});
  }

  /*
     returns number of existing parties
  */
  getNumParties(): number {
    var numParties = 0;
    this.partyList.once("value", function(snapshot) {
      numParties = snapshot.numChildren();
    });
    return numParties;
  }

  /*
     returns reference to party of given number
  */
  getPartyByNum(num: number): firebase.database.Reference {
    return firebase.database().ref(`/parties/` + num);
  }

  /*
     adds a new party to the firebase database under the number
     of existing parties + 1 and saves the settings set by the admin
     in the add-party alert. New parties are added as inactive and
     must be clicked to be set as active.
  */
  addParty(data: Array<any>): void {
    var numParties = 0;
    this.partyList.once("value", function(snapshot) {
      numParties = snapshot.numChildren();
      firebase.database().ref(`/parties/${numParties+1}/number`).set(numParties+1);
      firebase.database().ref(`/parties/${numParties+1}/noratings`).set(false);
      firebase.database().ref(`/parties/${numParties+1}/variedstart`).set(false);
      firebase.database().ref(`/parties/${numParties+1}/weightedrankings`).set(false);
      firebase.database().ref(`/parties/${numParties+1}/active`).set(false);
      // places the admin account as admin in each party
      firebase.database().ref(`/parties/${numParties+1}/userProfile/V2lgT8NhxhMNfok6y9GOePCTDFy1/role`).set(true);

      data.forEach(function (value) {
        firebase.database().ref(`/parties/${numParties+1}/${value}`).set(true);
      });
    });
  }
}
