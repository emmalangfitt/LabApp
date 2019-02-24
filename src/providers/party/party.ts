import { Injectable } from '@angular/core';
import firebase, { User } from 'firebase/app';
import 'firebase/database';

@Injectable()
export class PartyProvider {
  public partyList: firebase.database.Reference;

  constructor() {
    this.partyList = firebase.database().ref(`/parties/`);
  }

  getPartyList(): firebase.database.Reference {
    return this.partyList;
  }
}
