import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { PartyProvider } from "../../providers/party/party";
import { LoginPage } from '../login/login';

/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  public partyList: Array<any>;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public partyProvider: PartyProvider,
    public authProvider: AuthProvider
  ) {}

  ionViewDidLoad() {
    this.partyProvider.getPartyList().on("value", partySnapshot => {
    this.partyList = [];
    partySnapshot.forEach(snap => {
      this.partyList.push({
        name: snap.val().name,
        number: snap.val().number
      });
        return false;
      });
    });
  }

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

}
