/*
  Auth Provider
    - function to log user in using email and password via firebase authentificaiton
    - allows user to sign up with first name, last name, email, and password
    - presets user data in firebase database on sign up
    - includes functions to reset password and log user out
*/

import {Injectable} from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { PartyProvider } from "../party/party";

@Injectable()
export class AuthProvider {
  public listOfRatings: number[] = new Array(); // indicates if other user has already been rated
  public activePartyNum: number; // number of active party, retrieved from party provider

  constructor(
    public partyProvider: PartyProvider
  ) {
    // retrieve active party number from party provider
    this.partyProvider.getActivePartyNum().on("value", snap => {
      this.activePartyNum = snap.val();
    });
  }

  /*
    logs user in via firebase
  */
  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  /*
    signs user up via firebase and initializes their data accordingly
  */
  signupUser(email: string, password: string, first: string, last: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUserCredential => {
        // save provided email to firebase
        firebase
          .database()
          .ref(`/parties/`+ this.activePartyNum +`/userProfile/${newUserCredential.user.uid}/email`)
          .set(email);
        // set first name
        firebase
          .database()
          .ref(`/parties/`+ this.activePartyNum +`/userProfile/${newUserCredential.user.uid}/first`)
          .set(first);
        // set last name
        firebase
          .database()
          .ref(`/parties/`+ this.activePartyNum +`/userProfile/${newUserCredential.user.uid}/last`)
          .set(last);
        // role is false if not the admin account, true if the admin account
        firebase
          .database()
          .ref(`/parties/`+ this.activePartyNum +`/userProfile/${newUserCredential.user.uid}/role`)
          .set(false);
        // sets placeholder for user photo until user uploads their picture
        firebase
          .database()
          .ref(`/parties/`+ this.activePartyNum +`/userProfile/${newUserCredential.user.uid}/photo`)
          .set('https://firebasestorage.googleapis.com/v0/b/labapp-55218.appspot.com/o/prof-placeholder.png?alt=media&token=627989b9-0d63-44c0-9464-b14020e5d6d0');
        // creates subdirectory for pre-survey answers
        firebase
          .database()
          .ref(`/parties/`+ this.activePartyNum +`/userProfile/${newUserCredential.user.uid}/preSurvey/`);
        // creates subdirectory for post-survey answers
        firebase
          .database()
          .ref(`/parties/`+ this.activePartyNum +`/userProfile/${newUserCredential.user.uid}/postSurvey/`);

        // sets user number as the nth person to sign up under the active party
        // EACH PARTY CAN ONLY HOLD UP TO THIRTY USERS
        var numUsers = 0;
        var activePartyNum = this.activePartyNum;
        firebase.database().ref(`/parties/`+ this.activePartyNum +`/userProfile/`).once("value", function(snapshot) {
          numUsers = snapshot.numChildren(); // start numbering at one due to admin
          firebase
            .database()
            .ref(`/parties/`+ activePartyNum +`/userProfile/${newUserCredential.user.uid}/num`)
            .set(numUsers-1);
        });

        // varies the initial user ratings evenly from one to five if the active
        // party has the "varied ratings" condition
        var varied;
        this.partyProvider.getVaried().on("value", snap => {
          varied = snap.val();

          if (varied) {
            var rate;
            if (numUsers <= 6) { // first six users are rated 1 to start
              rate = 1;
            } else if (numUsers > 6 && numUsers <= 12) { // next six are rated 2
              rate = 2;
            } else if (numUsers > 12 && numUsers <= 18) { // then 3
              rate = 3;
            } else if (numUsers > 18 && numUsers <= 24) { // then 4
              rate = 4;
            } else { // the final six start rated at a 5
              rate = 5;
            }
            firebase
              .database()
              .ref(`/parties/`+ this.activePartyNum +`/userProfile/${newUserCredential.user.uid}/rating`)
              .set(rate);
          }
          // if the party does not have the varied start condition, preset the initial rating to 2.5
          else {
            firebase
              .database()
              .ref(`/parties/`+ this.activePartyNum +`/userProfile/${newUserCredential.user.uid}/rating`)
              .set(2.5);
          }
        });

        // initialize array of rated users so the current user can
        // rate everyone except themselves
        this.listOfRatings = new Array();
        for (var i = 0; i <= 30; i++) {
          if ( (i) == (numUsers-1) ) {
            this.listOfRatings.push(1);
          } else {
            this.listOfRatings.push(0);
          }
        }

        // store this array into firebase
        firebase
          .database()
          .ref(`/parties/`+ this.activePartyNum +`/userProfile/${newUserCredential.user.uid}/ratings/`)
          .set(this.listOfRatings);
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
    }

    /*
      allows user to reset password via an email
    */
    resetPassword(email:string): Promise<void> {
      return firebase.auth().sendPasswordResetEmail(email);
    }

    /*
      logs user out of the app
    */
    logoutUser():Promise<void> {
      const userId: string = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref(`/parties/`+ this.activePartyNum +`/userProfile/${userId}`)
        .off();
      return firebase.auth().signOut();
    }
}
