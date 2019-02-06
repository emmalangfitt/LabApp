import {Injectable} from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

@Injectable()
export class AuthProvider {
  constructor() {}

  public listOfRatings: number[] = new Array();
  public numUsers: number = 1;
  public photo: string = "";

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
          .ref(`/userProfile/${newUserCredential.user.uid}/num`)
          .set(this.numUsers);
        firebase
          .database()
          .ref(`/userProfile/${newUserCredential.user.uid}/photo`)
          .set(this.photo);

        this.listOfRatings = new Array();
        for (var i = 0; i < 30; i++) {
          if ( (i+1) == this.numUsers ) {
            this.listOfRatings.push(1);
          } else {
            this.listOfRatings.push(0);
          }
        }
        this.numUsers = this.numUsers+1;

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
