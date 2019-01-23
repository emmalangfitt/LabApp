import { Component } from "@angular/core";
import {
  Alert,
  AlertController,
  NavController
} from "ionic-angular";
import { ProfileProvider } from "../../providers/profile/profile";
import { AuthProvider } from "../../providers/auth/auth";
import { LoginPage } from '../login/login';
import { Events } from 'ionic-angular';

@Component({
  selector: "page-about",
  templateUrl: "about.html"
})

export class AboutPage {
  public userProfile: any;
  public rating: number;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public profileProvider: ProfileProvider,
    public events: Events
  ) {
    events.subscribe('star-rating:changed', (starRating) => {
      //this.profileProvider.updateRating((starRating + this.rating )/ 2);
    });
  }

  ionViewDidLoad() {
    this.profileProvider.getUserProfile().on("value", userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.rating = userProfileSnapshot.val().rating;
    });
  }

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
