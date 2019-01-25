import { Component } from '@angular/core';
import { NavController, Alert, AlertController } from 'ionic-angular';
import { ProfileProvider } from "../../providers/profile/profile";
import { Events } from 'ionic-angular';
import firebase from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public profList: Array<any>;
  public enteredRating: number;

  constructor(
    public navCtrl: NavController,
    public profileProvider: ProfileProvider,
    public alertCtrl: AlertController,
    public events: Events
  ) {
    events.subscribe('star-rating:changed', (starRating) => {
      this.enteredRating = starRating;
    });
  }

  ionViewDidLoad() {
    this.profileProvider.getAllProfiles().on("value", profListSnapshot => {
    this.profList = [];
    profListSnapshot.forEach(snap => {
      this.profList.push({
        id: snap.key,
        first: snap.val().first,
        last: snap.val().last,
        rating: snap.val().rating
      });
        return false;
      });
    });
  }

  saveRating(id: string, profRating: number): void {
    firebase.database().ref(`/userProfile/` + id).update({rating: ((profRating + this.enteredRating)/ 2)});
  }
}
