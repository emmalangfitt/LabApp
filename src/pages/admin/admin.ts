import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { PartyProvider } from "../../providers/party/party";
import { LoginPage } from '../login/login';
import firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  public partyList: Array<any>; // holds list of existing parties

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public partyProvider: PartyProvider,
    public authProvider: AuthProvider,
    public alertCtrl: AlertController
  ) {}

  /*
    Function to initialize page data, including the list
    of existing parties
  */
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

  /*
    Logs user out and pushes them to the login page
  */
  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot(LoginPage);
    });s
  }

  /*
    makes the clicked-on party the only active party and
    saves that party num as the "ActivePartyNum" in the
    party provider
  */
  makeActive(num: number): void {
    var numParties = this.partyProvider.getNumParties();
    for(var i = 1; i <= numParties; i++) {
      if( i != num) {
        firebase.database().ref(`/parties/${i}/active`).set(false);
      } else {
        firebase.database().ref(`/parties/${i}/active`).set(true);
      }
    }
    this.partyProvider.setActivePartyNum(num);
  }

  /*
    displays active party in a different color
  */
  fillType(active: boolean): string {
    if (active) {
      return "primary";
    } else {
      return "secondary";
    }
  }

  /*
    Presents an alert to add a new party, automatically given the
    next number. Admin can also set the party's conditions, with a
    checked box meaning that condition is true:
      - noratings: cannot rate other users
      - variedstart: users' ratings start as evenly distributed between 1 and 5
      - weighted rankings: a high-rate user will be weighted more than a low-rated user
  */
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
