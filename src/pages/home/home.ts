import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfileProvider } from "../../providers/profile/profile";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public profList: Array<any>;

  constructor(
    public navCtrl: NavController,
    public profileProvider: ProfileProvider) {
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

}
