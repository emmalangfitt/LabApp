import {Injectable} from '@angular/core';
import firebase, { User } from 'firebase/app';
import 'firebase/database';
import { AuthProvider } from '../auth/auth';
import { AuthCredential } from 'firebase/auth';

@Injectable()
export class ProfileProvider {
  public userProfile: firebase.database.Reference;
  public profListRef: firebase.database.Reference;
  public preSurvey: firebase.database.Reference;
  public postSurvey: firebase.database.Reference;
  public interactedWith: firebase.database.Reference;
  public currentUser: User;
  public numRef: firebase.database.Reference;
  public ratingsRef: firebase.database.Reference;
  public photoRef: firebase.database.Reference;
  public preSurveySubmitted: boolean = false;
  public postSurveySubmitted: boolean = false;

  constructor() {
    firebase.auth().onAuthStateChanged( user => {
      if(user){
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
        this.preSurvey = firebase.database().ref(`/userProfile/${user.uid}/preSurvey/`);
        this.postSurvey = firebase.database().ref(`/userProfile/${user.uid}/postSurvey/`);
        this.interactedWith = firebase.database().ref(`/userProfile/${user.uid}/postSurvey/checkedProfList`);
        this.profListRef = firebase.database().ref(`/userProfile/`);
        this.numRef = firebase.database().ref(`/userProfile/${user.uid}/num`);
        this.ratingsRef = firebase.database().ref(`/userProfile/${user.uid}/ratings/`);
        this.photoRef = firebase.database().ref(`/userProfile/${user.uid}/photo`);
      }
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

  getUserRatings(num: number): firebase.database.Reference {
    return firebase.database().ref('/userProfile/' + this.getCurrentUser() + '/ratings/' + num);
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
