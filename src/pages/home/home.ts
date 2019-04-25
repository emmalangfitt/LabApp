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
  public profList: Array<any>; // list of all existing users, edited by search bar
  public enteredRating: number; // rating entered by user
  public loadedProfList:Array<any>; // list of all existing users, not edited by search bar
  public profRef:firebase.database.Reference; // reference to all users in active party
  //public consent: boolean; // if current user consents to experiment based on alert response
  public activePartyNum: number; // number of active party
  private once: boolean = true; // ensures initialization is only run once

  constructor(
    public navCtrl: NavController,
    public profileProvider: ProfileProvider,
    public partyProvider: PartyProvider,
    public alertCtrl: AlertController,
    public events: Events,
    public app: App
  ) {
    // stores rating entered by user on click
    events.subscribe('star-rating:changed', (starRating) => {
      this.enteredRating = starRating;
    });

    this.profileProvider.loaded.subscribe((value) => {
      this.partyProvider.getActivePartyNum().on("value", snap => {
        this.activePartyNum = snap.val();
      });

      this.profRef = firebase.database().ref('/parties/' + this.activePartyNum + '/userProfile/');

      // create and store list of all profs in active party
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

      // only run initialization once the profile provider is loaded
       if (value && this.once) {
           this.initStuff();
           this.once = false;
       }
    });

  }

  /*
    Function to initialize page's data. Also restricts user to
    only access the about page if the party is set to the no-rating
    condition.
  */
  initStuff() {
    if (this.isAdmin()) {
      return;
    }

    this.partyProvider.getRatings().on("value", snap => {
      if(snap.val()) {
        this.app.getRootNav().setRoot('NoRatingsPage');
      }
    });

    // sets the profile list to a list of all users in active party
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

    // reset rating every five minutes (minutes * seconds * milliseconds)
    setInterval(() => {
      this.resetRating();
    }, 5*60*1000);

    //this.requestConsent();
  }

  /*
    Function to update a user's rating based on a new input depending
    on the value entered and if the ratings are weighted or not.
    If weighted:
      new_rating = weightA * old_value + weightB * new_value
    where {user's rating|weight}...
      weightA = {1|.8  2|.65  3|.5  4|.35  5|.2}
      weightB = {1|.2  2|.35  3|.5  4|.65  5|.8}
  */
  saveRating(id: string, profRating: number, num: number): void {
    var weighted;
    this.partyProvider.getWeighted().on("value", snap => {
      weighted = snap.val();
      var rating;
      this.profileProvider.getRating().on("value", snap => {
        rating = Math.trunc(snap.val());
      });

      var old; // initial rating value
      var add; // new rating to add in

      // set weights based on current user's own rating
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

      // average new rating into old rating and save in database
      if (weighted){
        firebase.database().ref('/parties/'+ this.activePartyNum +`/userProfile/` + id)
        .update({rating: ((profRating*old) + (this.enteredRating*add))});
        this.profileProvider.getUserRatings(num).set(1);
      } else {
        firebase.database().ref('/parties/'+ this.activePartyNum +`/userProfile/` + id)
        .update({rating: ((profRating + this.enteredRating)/ 2)});
        this.profileProvider.getUserRatings(num).set(1);
      }
    });
  }

  /*
    Resets the array keeping track of who has rated who so the current
    user can rate other users again. Called every five minutes.
  */
  resetRating(): void {
    var numRef = this.profileProvider.getUserNum();
    var num;
    numRef.on('value', function(snapshot) {
      num = snapshot.val();
    });

    for (var i = 0; i <= 30; i++) {
      if (i != num) { // making sure they cannot rate themselves
        this.profileProvider.getUserRatings(i).set(0);
      }
    }
  }

  /*
    Returns a boolean indicating if the current user is the admin account
  */
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

  /*
    Returns a string indicating if a user can be rated by the current
    user. The user cannot rate themselves or people they already rated
    within the past fives minutes.
  */
  canRateString(num: number, isSelf: boolean, ): string {
    var ratingsRef = this.profileProvider.getUserRatings(num);
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

  /*
    Returns a boolean indicating if a user can be rated by the current
    user. The user cannot rate themselves or people they already rated
    within the past fives minutes.
  */
  canRate(num: number, isSelf: boolean): boolean {
    var ratingsRef = this.profileProvider.getUserRatings(num);
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

  /*
    Initializes the searchbar's prof list to all profs under the active party
  */
  initializeItems(): void {
    this.profList = this.loadedProfList;
  }

  /*
    Searchbar's function to find and display profiles by the entered name.
  */
  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();
    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;
    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    // filter list based on input, ignoring case
    this.profList = this.profList.filter((v) => {
      if(v.first && q || v.lant && q) {
        if (v.first.toLowerCase().indexOf(q.toLowerCase()) > -1
        || v.last.toLowerCase().indexOf(q.toLowerCase()) > -1
        || v.num.toString().toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  /*
    Present alert with consent infirmation and save if the user accepts or not
  */
  // public requestConsent(): void {
  //   this.consentAlert('consent message goes here it will be super long').then(confirm => {
  //     this.profileProvider.setConsent(confirm);
  //   })
  // }

  /*
    Create alert with consent infirmation and allow user to accept or not
  */
  // private consentAlert(message: string): Promise<boolean> {
  //   let resolveFunction: (confirm: boolean) => void;
  //   let promise = new Promise<boolean>(resolve => {
  //     resolveFunction = resolve;
  //   });
  //
  //   let alert = this.alertCtrl.create({
  //     title: 'Consent Collection',
  //     message: message,
  //     enableBackdropDismiss: false,
  //     buttons: [ {
  //       text: 'Cancel',
  //       handler: () => resolveFunction(false)
  //     }, {
  //       text: 'I Agree',
  //       handler: () => resolveFunction(true)
  //     } ]
  //   });
  //   alert.present();
  //   return promise;
  // }
}
