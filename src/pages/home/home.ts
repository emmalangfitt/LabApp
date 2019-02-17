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
          rating: prof.val().rating,
          num: prof.val().num,
          photo: prof.val().photo
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
        rating: snap.val().rating,
        num: snap.val().num,
        photo: snap.val().photo
      });
        return false;
      });
    });

    setInterval(() => {
      this.resetRating();
    }, 5*60*1000);
    //setInterval(this.resetRating, 10*1000);
  }

  saveRating(id: string, profRating: number, num: number): void {
    if (id != (this.profileProvider.getCurrentUser())) {
      firebase.database().ref(`/userProfile/` + id).update({rating: ((profRating + this.enteredRating)/ 2)});
      this.profileProvider.getUserRatings(num-1).set(1);
    }
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

  isSelf(id: string, num: number): boolean {
    var ratingsRef = this.profileProvider.getUserRatings(num-1);
    var bool;
    ratingsRef.on('value', function(snapshot) {
      bool = snapshot.val();
    });

    if ((id != (this.profileProvider.getCurrentUser())) &&
    ( bool == 0 ) ) {
      return false;
    } else {
      return true;
    }
  }

  isSelfString(id: string, num: number): string {
    var ratingsRef = this.profileProvider.getUserRatings(num-1);
    var bool;
    ratingsRef.on('value', function(snapshot) {
      bool = snapshot.val();
    });

    if ((id != (this.profileProvider.getCurrentUser())) &&
    ( bool == 0 ) ) {
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
