import {Injectable} from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

@Injectable()
export class AuthProvider {
  constructor() {}

  public listOfRatings: number[] = new Array();

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string, first: string, last: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUserCredential => {
        firebase
          .database()
          .ref(`/userProfile/${newUserCredential.user.uid}/email`)
          .set(email);
        firebase
          .database()
          .ref(`/userProfile/${newUserCredential.user.uid}/first`)
          .set(first);
        firebase
          .database()
          .ref(`/userProfile/${newUserCredential.user.uid}/last`)
          .set(last);
        firebase
          .database()
          .ref(`/userProfile/${newUserCredential.user.uid}/rating`)
          .set(2.5);
        firebase
          .database()
          .ref(`/userProfile/${newUserCredential.user.uid}/role`)
          .set(false);
        firebase
          .database()
          .ref(`/userProfile/${newUserCredential.user.uid}/photo`)
          .set('https://firebasestorage.googleapis.com/v0/b/labapp-55218.appspot.com/o/logo.png?alt=media&token=20b4b85d-a03f-4893-a531-195c87438386');
        firebase
          .database()
          .ref(`/userProfile/${newUserCredential.user.uid}/preSurvey/`);
        firebase
          .database()
          .ref(`/userProfile/${newUserCredential.user.uid}/postSurvey/`);

        var numUsers = 0;
        firebase.database().ref(`/userProfile/`).once("value", function(snapshot) {
          numUsers = snapshot.numChildren();
          firebase
            .database()
            .ref(`/userProfile/${newUserCredential.user.uid}/num`)
            .set(numUsers);
        });

        this.listOfRatings = new Array();
        for (var i = 0; i < 30; i++) {
          if ( (i+1) == numUsers ) {
            this.listOfRatings.push(1);
          } else {
            this.listOfRatings.push(0);
          }
        }

        firebase
          .database()
          .ref(`/userProfile/${newUserCredential.user.uid}/ratings/`)
          .set(this.listOfRatings);
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
    }

    resetPassword(email:string): Promise<void> {
      return firebase.auth().sendPasswordResetEmail(email);
    }

    logoutUser():Promise<void> {
      const userId: string = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref(`/userProfile/${userId}`)
        .off();
      return firebase.auth().signOut();
    }
}
