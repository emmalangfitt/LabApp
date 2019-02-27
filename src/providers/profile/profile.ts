import {Injectable} from '@angular/core';
import firebase, { User } from 'firebase/app';
import 'firebase/database';
import { AuthProvider } from '../auth/auth';
import { AuthCredential } from 'firebase/auth';
import { BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class ProfileProvider {
  public userProfile: firebase.database.Reference;
  public profListRef: firebase.database.Reference;
  public preSurvey: firebase.database.Reference;
  public postSurvey: firebase.database.Reference;
  public interactedWith: firebase.database.Reference;
  public roleRef: firebase.database.Reference;
  public currentUser: User;
  public numRef: firebase.database.Reference;
  public ratingsRef: firebase.database.Reference;
  public photoRef: firebase.database.Reference;
  public preSurveySubmitted: boolean = false;
  public postSurveySubmitted: boolean = false;
  public loaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public activePartyNum: number;

  constructor () {
    firebase.database().ref(`/active`).on("value", snap => {
        var num = snap.val();

        firebase.auth().onAuthStateChanged( user => {
          if(user){
            this.currentUser = user;
            this.userProfile = firebase.database().ref(`/parties/`+ num + `/userProfile/${user.uid}`);
            this.preSurvey = firebase.database().ref(`/parties/`+ num + `/userProfile/${user.uid}/preSurvey/`);
            this.postSurvey = firebase.database().ref(`/parties/`+ num + `/userProfile/${user.uid}/postSurvey/`);
            this.interactedWith = firebase.database().ref(`/parties/`+ num + `/userProfile/${user.uid}/postSurvey/checkedProfList`);
            this.profListRef = firebase.database().ref(`/parties/`+ num + `/userProfile/`);
            this.numRef = firebase.database().ref(`/parties/`+ num + `/userProfile/${user.uid}/num`);
            this.ratingsRef = firebase.database().ref(`/parties/`+ num + `/userProfile/${user.uid}/ratings/`);
            this.photoRef = firebase.database().ref(`/parties/`+ num + `/userProfile/${user.uid}/photo`);
            this.roleRef = firebase.database().ref(`/parties/`+ num + `/userProfile/${user.uid}/role`);
            this.loaded.next(true);
          }
        });
    });
  }

  getAllProfiles(): firebase.database.Reference {
    return this.profListRef;
  }

  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }

  getUserNum(): firebase.database.Reference {
    return this.numRef;
  }

  getUserRole(): firebase.database.Reference {
    return this.roleRef;
  }

  getUserRatings(num: number): firebase.database.Reference {
    return firebase.database().ref('/parties/'+ this.activePartyNum + '/userProfile/' + this.getCurrentUser() + '/ratings/' + num);
  }

  getUserPhoto(): firebase.database.Reference {
    return this.photoRef;
  }

  getCurrentUser(): string {
    return this.currentUser.uid;
  }

  updateName(first: string, last: string): Promise<any> {
    return this.userProfile.update({ first, last });
  }

  updateRating(rating: number): Promise<any> {
    return this.userProfile.update({rating});
  }

  setConsent(consent: boolean): Promise<any> {
    return this.userProfile.update({consent});
  }

  updatePreSurvey(year: string, gender:
    string, major: string, option: string,
    rating: number, shortAnswer: string): Promise<any> {
      return this.preSurvey.update({year, gender, major, option, rating, shortAnswer});
  }

  updatePostSurvey(option: string, rating: number,
    shortAnswer: string, profList: Array<any>, checkedProfList: Array<any>): Promise<any> {
      return this.postSurvey.update({option, rating, shortAnswer, profList, checkedProfList});
  }

  updateEmail(newEmail: string, password: string): Promise<any> {
    const credential: AuthCredential = firebase.auth.
      EmailAuthProvider.credential(
        this.currentUser.email,
        password
      );
    return this.currentUser
      .reauthenticateWithCredential(credential)
      .then(user => {
        this.currentUser.updateEmail(newEmail).then(user => {
          this.userProfile.update({ email: newEmail });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  updatePassword(newPassword: string, oldPassword: string): Promise<any> {
    const credential: AuthCredential = firebase.auth.
      EmailAuthProvider.credential(
        this.currentUser.email,
        oldPassword
      );

    return this.currentUser
      .reauthenticateWithCredential(credential)
      .then(user => {
        this.currentUser.updatePassword(newPassword).then(user => {
          console.log('Password Changed');
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
}
