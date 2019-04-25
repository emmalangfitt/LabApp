/*
  Profile Provider
    - provides access to current user's information
    - functions to update user name, email, and password
    - almost exclusively getter and setter methods
*/

import {Injectable} from '@angular/core';
import firebase, { User } from 'firebase/app';
import 'firebase/database';
import { AuthProvider } from '../auth/auth';
import { AuthCredential } from 'firebase/auth';
import { BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class ProfileProvider {
  public userProfile: firebase.database.Reference; // reference to current user's info
  public profListRef: firebase.database.Reference; // list of all profiles in active party
  public preSurvey: firebase.database.Reference; // user's pre-survey answers
  public postSurvey: firebase.database.Reference; // user's post-survey answers
  public interactedWith: firebase.database.Reference; // list of who user interacted with, provided by post-survey
  public roleRef: firebase.database.Reference; // is the user is the admin account
  public currentUser: User; // firebase's user data on current user
  public numRef: firebase.database.Reference; // user's number
  public ratingsRef: firebase.database.Reference; // list of who user has rated in last time increment
  public photoRef: firebase.database.Reference; // user's photo
  public ownRating: firebase.database.Reference; // user's own rating
  public preSurveySubmitted: boolean = false; // if the user has submitted the pre-survey
  public postSurveySubmitted: boolean = false; // if the user has submitted the post-survey
  public loaded: BehaviorSubject<boolean> = new BehaviorSubject(false); // profile provider has finished loading
  public activePartyNum: number; // number of active party

  constructor () {
    firebase.database().ref(`/active`).on("value", snap => {
        var num = snap.val();
        this.activePartyNum = num;

        // intialize all data from firebase using the sactive party number
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
            this.ownRating = firebase.database().ref(`/parties/`+ num + `/userProfile/${user.uid}/rating`);
            this.loaded.next(true); // indicate profile provider has initialized
          }
        });
    });
  }

  /*
    return list of all profiles
  */
  getAllProfiles(): firebase.database.Reference {
    return this.profListRef;
  }

  /*
    return reference to user profile
  */
  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }

  /*
    return user's number
  */
  getUserNum(): firebase.database.Reference {
    return this.numRef;
  }

  /*
    return user's role (true if admin, false if not)
  */
  getUserRole(): firebase.database.Reference {
    return this.roleRef;
  }

  /*
    return if the current user has rated the user with the given number
    within the last time frame
  */
  getUserRatings(num: number): firebase.database.Reference {
    return firebase.database().ref('/parties/'+ this.activePartyNum + '/userProfile/' + this.getCurrentUser() + '/ratings/' + num);
  }

  /*
    return user's photo
  */
  getUserPhoto(): firebase.database.Reference {
    return this.photoRef;
  }

  /*
    return current users firebase ID
  */
  getCurrentUser(): string {
    return this.currentUser.uid;
  }

  /*
    lets user update their name in firebase
  */
  updateName(first: string, last: string): Promise<any> {
    return this.userProfile.update({ first, last });
  }

  /*
    updates current user's rating based on other's input
  */
  updateRating(rating: number): Promise<any> {
    return this.userProfile.update({rating});
  }

  /*
    returns users own rating
  */
  getRating() {
    return this.ownRating;
  }

  /*
    sets in firebase whether or not user consented to the experiment,
    value comes from consent alert on the home page
  */
  // setConsent(consent: boolean): Promise<any> {
  //   return this.userProfile.update({consent});
  // }

  /*
    saves user answers from the pre-survey
  */
  updatePreSurvey(q1: string, q2: string,
    q3: string, q4: string, q5: string,
    q6: string, q7: string, q8: number,
    q9: number, q10: number, q11: number,
    q12: number, q13: number, q14: number,
    q15: number, q16: number, q17: number,): Promise<any> {
      return this.preSurvey.update({q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17});
  }

  /*
    saves user answers from the post-survey
  */
  updatePostSurvey(q1: number, q2: number,
    q3: number, q4: number, q5: number,
    q6: number, q7: number, q8: number,
    q9: number, q10: number, q11: number,
    checkedProfList: Array<any>, q13: string, q14: string): Promise<any> {
      return this.postSurvey.update({q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, checkedProfList, q13, q14});
  }

  /*
    lets user update their email in firebase and updates authentification
  */
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

  /*
    lets user update their password in firebase and updates authentification
  */
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
