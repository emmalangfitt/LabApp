import { Component } from '@angular/core';
import { NavController, Alert, AlertController, App } from 'ionic-angular';
import { ProfileProvider } from "../../providers/profile/profile";
import { PartyProvider } from "../../providers/party/party";
import { Events } from 'ionic-angular';
import firebase from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public profList: Array<any>;
  public enteredRating: number;
  public loadedProfList:Array<any>;
  public profRef:firebase.database.Reference;
  public consent: boolean;
  public activePartyNum: number;
  private once: boolean = true;

  constructor(
    public navCtrl: NavController,
    public profileProvider: ProfileProvider,
    public partyProvider: PartyProvider,
    public alertCtrl: AlertController,
    public events: Events,
    public app: App
  ) {
    events.subscribe('star-rating:changed', (starRating) => {
      this.enteredRating = starRating;
    });

    this.profileProvider.loaded.subscribe((value) => {
      this.partyProvider.getActivePartyNum().on("value", snap => {
        this.activePartyNum = snap.val();
      });

      this.profRef = firebase.database().ref('/parties/' + this.activePartyNum + '/userProfile/');

      this.profRef.on('value', profList => {
        let profs = [];
        profList.forEach(prof => {
          if(prof.val().role != true) {
            var isSelf = false;
            if(prof.key == this.profileProvider.getCurrentUser()) {
              isSelf = true;
            }

            profs.push({
              id: prof.key,
              first: prof.val().first,
              last: prof.val().last,
              rating: prof.val().rating,
              num: prof.val().num,
              photo: prof.val().photo,
              role: prof.val().role,
              self: isSelf
            });
          }
          return false;
        });

        this.profList = profs;
        this.loadedProfList = profs;
      });

       if (value && this.once) {
           this.initStuff();
           this.once = false;
       }
    });

  }

  initStuff() {
    if (this.isAdmin()) {
      return;
    }

    this.partyProvider.getActiveParty().on("value", snap => {
      if(snap.val()) {
        this.app.getRootNav().setRoot('NoRatingsPage');
      }
    });


    this.profileProvider.getAllProfiles().on("value", profListSnapshot => {
    this.profList = [];
    profListSnapshot.forEach(snap => {
      if(snap.val().role != true) {
        var isSelf = false;
        if(snap.key == this.profileProvider.getCurrentUser()) {
          isSelf = true;
        }
        this.profList.push({
          id: snap.key,
          first: snap.val().first,
          last: snap.val().last,
          rating: snap.val().rating,
          num: snap.val().num,
          photo: snap.val().photo,
          role: snap.val().role,
          self: isSelf
        });
      }
        return false;
      });
    });

    setInterval(() => {
      this.resetRating();
    }, 5*60*1000);

    this.requestConsent();
  }

  saveRating(id: string, profRating: number, num: number): void {
    var weighted;
    this.partyProvider.getWeighted().on("value", snap => {
      weighted = snap.val();
      var rating;
      this.profileProvider.getRating().on("value", snap => {
        rating = Math.trunc(snap.val());
      });

      var old;
      var add;

      if (rating == 1) {
        old = .8;
        add = .2;
      } else if (rating == 2) {
        old = .65;
        add = .35;
      } else if (rating == 3) {
        old = .5;
        add = .5;
      } else if (rating == 4) {
        old = .35;
        add = .65;
      } else if (rating == 5) {
        old = .2;
        add = .8;
      }

      if (weighted){
        firebase.database().ref('/parties/'+ this.activePartyNum +`/userProfile/` + id)
        .update({rating: ((profRating*old) + (this.enteredRating*add))});
        this.profileProvider.getUserRatings(num-1).set(1);
      } else {
        firebase.database().ref('/parties/'+ this.activePartyNum +`/userProfile/` + id)
        .update({rating: ((profRating + this.enteredRating)/ 2)});
        this.profileProvider.getUserRatings(num-1).set(1);
      }
    });
  }

  resetRating(): void {
    var numRef = this.profileProvider.getUserNum();
    var num;
    numRef.on('value', function(snapshot) {
      num = snapshot.val();
    });

    for (var i = 0; i < 30; i++) {
      if (i != num-1) {
        this.profileProvider.getUserRatings(i).set(0);
      }
    }
  }

  isAdmin(): boolean {
    var roleRef = this.profileProvider.getUserRole();
    var admin;

    roleRef.once('value').then((snapshot) => {
      admin = snapshot.val();

      if (admin == true) {
        this.app.getRootNav().setRoot('AdminPage');
        return true;
      } else {
        return false;
      }
    });
    return false;
  }

  isSelfString(num: number, isSelf: boolean, ): string {
    var ratingsRef = this.profileProvider.getUserRatings(num-1);
    var bool;
    ratingsRef.on('value', function(snapshot) {
      bool = snapshot.val();
    });

    if (isSelf || bool == 1) {
      return "true";
    } else {
      return "false";
    }
  }

  isSelf(num: number, isSelf: boolean): boolean {
    var ratingsRef = this.profileProvider.getUserRatings(num-1);
    var bool;
    ratingsRef.on('value', function(snapshot) {
      bool = snapshot.val();
    });

    if (isSelf || bool == 1) {
      return true;
    } else {
      return false;
    }
  }

  initializeItems(): void {
    this.profList = this.loadedProfList;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();
    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;
    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }
    this.profList = this.profList.filter((v) => {
      if(v.first && q || v.lant && q) {
        if (v.first.toLowerCase().indexOf(q.toLowerCase()) > -1 || v.last.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  public requestConsent(): void {
    this.consentAlert('consent message goes here it will be super long').then(confirm => {
      this.profileProvider.setConsent(confirm);
    })
  }

  private consentAlert(message: string): Promise<boolean> {
    let resolveFunction: (confirm: boolean) => void;
    let promise = new Promise<boolean>(resolve => {
      resolveFunction = resolve;
    });

    let alert = this.alertCtrl.create({
      title: 'Consent Collection',
      message: message,
      enableBackdropDismiss: false,
      buttons: [ {
        text: 'Cancel',
        handler: () => resolveFunction(false)
      }, {
        text: 'I Agree',
        handler: () => resolveFunction(true)
      } ]
    });
    alert.present();
    return promise;
  }
}
