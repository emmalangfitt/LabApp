import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { PartyProvider } from "../../providers/party/party";
import { LoginPage } from '../login/login';
import firebase from 'firebase/app';

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
    public authProvider: AuthProvider,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    this.partyProvider.getPartyList().on("value", partySnapshot => {
    this.partyList = [];
    partySnapshot.forEach(snap => {
      this.partyList.push({
        number: snap.val().number,
        active: snap.val().active,
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

  makeActive(num: number): void {
    var numParties = this.partyProvider.getNumParties();
    for(var i = 1; i <= numParties; i++) {
      if( i != num) {
        firebase.database().ref(`/parties/${i}/active`).set(false);
      } else {
        firebase.database().ref(`/parties/${i}/active`).set(true);
      }
    }
  }

  fillType(active: boolean): string {
    if (active) {
      return "primary";
    } else {
      return "secondary";
    }
  }

  public addPartyAlert(): void {

    let alert = this.alertCtrl.create({
      title: 'Add Party',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'noratings',
          value: 'noratings',
          label: "No Rating Others",
          type: 'checkbox',
        },
        {
          name: 'variedstart',
          value: 'variedstart',
          label: "Varied Initial Ratings",
          type: 'checkbox',
        },
        {
          name: 'weightedrankings',
          value: 'weightedrankings',
          label: "Weighted Ratings",
          type: 'checkbox',
        },
      ],
      buttons: [ {
        text: 'Cancel'
      },
      {
        text: 'Add',
        handler: (data) => {
          this.partyProvider.addParty(data);
        }
      } ]
    });

    alert.present();
  }
}
