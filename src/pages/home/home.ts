import { Component } from '@angular/core';
import { NavController, Alert, AlertController } from 'ionic-angular';
import { ProfileProvider } from "../../providers/profile/profile";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public profList: Array<any>;

  constructor(
    public navCtrl: NavController,
    public profileProvider: ProfileProvider,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.profileProvider.getAllProfiles().on("value", profListSnapshot => {
    this.profList = [];
    profListSnapshot.forEach(snap => {
      this.profList.push({
        first: snap.val().first,
        last: snap.val().last,
        rating: snap.val().rating
      });
      return false;
    });
  });
  }

  rateUser(): void {
    let alert: Alert = this.alertCtrl.create({
      buttons: [
        { text: 'Cancel' },
        { text: 'Save'}
      ]
    });
    alert.present();
  }
}
