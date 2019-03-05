import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, reorderArray } from 'ionic-angular';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { ProfileProvider } from "../../providers/profile/profile";
import { PartyProvider } from "../../providers/party/party";
import firebase from 'firebase/app';


@IonicPage()
@Component({
  selector: 'page-post-survey-2',
  templateUrl: 'post-survey-2.html',
})
export class PostSurvey_2Page {

  public postSurveyForm: FormGroup; // form of questions
  public allProfList: Array<any>; // all users in active party
  public interactedProfList: Array<any>; // only users that were interacted with
  public profRef:firebase.database.Reference; // reference to all user profiles
  public interactedProfRef:firebase.database.Reference; // reference to interacted user profiles
  public activePartyNum: number; // number of active party

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public partyProvider: PartyProvider,
    public profileProvider: ProfileProvider,
    formBuilder: FormBuilder) {
      this.postSurveyForm = formBuilder.group({
      });

      // load lists once profile provider is initialized
      this.profileProvider.loaded.subscribe((value) => {
        this.partyProvider.getActivePartyNum().on("value", snap => {
          this.activePartyNum = snap.val();
        });

        this.profRef = firebase.database().ref('/parties/' + this.activePartyNum + '/userProfile/');
        this.interactedProfRef = this.profileProvider.interactedWith;

        this.profRef.on('value', profList => {
          let profs = [];
          profList.forEach(prof => {
            profs.push({
              photo: prof.val().photo,
              first: prof.val().first,
              last: prof.val().last,
              isChecked: false
            });
            return false;
          });

          this.allProfList = profs.slice();
        });

        this.interactedProfRef.on('value', profList => {
          let profs = [];
          profList.forEach(prof => {
            profs.push({
              photo: prof.val().photo,
              first: prof.val().first,
              last: prof.val().last
            });
            return false;
          });

          this.interactedProfList = profs.slice();
        });
      });
    }

  /*
    save answers to firebase and push to next page
  */
  submit(): void {
    this.navCtrl.pop();
    this.navCtrl.pop();
    this.profileProvider.postSurveySubmitted = true;
  }

  /*
    used to rank user interactions, re-saves array in new order
  */
  reorderItem(indexes) {
    this.interactedProfList = reorderArray(this.interactedProfList, indexes);
  }

}
