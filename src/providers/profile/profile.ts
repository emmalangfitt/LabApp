import {Injectable} from '@angular/core';
import firebase, { User } from 'firebase/app';
import 'firebase/database';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class ProfileProvider {
  public userProfile: firebase.database.Reference;
  public profListRef: firebase.database.Reference;
  public currentUser: User;

  constructor() {
    firebase.auth().onAuthStateChanged( user => {
      if(user){
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
        this.profListRef = firebase.database().ref(`/userProfile/`);
      }
    });
  }

  getAllProfiles(): firebase.database.Reference {
    return this.profListRef;
  }

  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }

  updateName(first: string, last: string): Promise<any> {
    return this.userProfile.update({ first, last });
  }

  updateRating(rating: number): Promise<any> {
    return this.userProfile.update({rating});
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
