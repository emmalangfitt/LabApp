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
  public loadedProfList:Array<any>;
  public profRef:firebase.database.Reference;

  constructor(
    public navCtrl: NavController,
    public profileProvider: ProfileProvider,
    public alertCtrl: AlertController,
    public events: Events
  ) {
    this.profRef = firebase.database().ref('/userProfile/');

    this.profRef.on('value', profList => {
      let profs = [];
      profList.forEach(prof => {
        profs.push({
          id: prof.key,
          first: prof.val().first,
          last: prof.val().last,
          rating: prof.val().rating
        });
        return false;
      });

      this.profList = profs;
      this.loadedProfList = profs;
    });

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
    if (id != (this.profileProvider.getCurrentUser())) {
      firebase.database().ref(`/userProfile/` + id).update({rating: ((profRating + this.enteredRating)/ 2)});
    }
  }

  isSelf(id: string): boolean {
    if (id != (this.profileProvider.getCurrentUser())) {
      return false;
    } else {
      return true;
    }
  }

  isSelfString(id: string): string {
    if (id != (this.profileProvider.getCurrentUser())) {
      return "false";
    } else {
      return "true";
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
}
