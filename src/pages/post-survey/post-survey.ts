import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, reorderArray } from 'ionic-angular';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { ProfileProvider } from "../../providers/profile/profile";
import { PartyProvider } from "../../providers/party/party";
import firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-post-survey',
  templateUrl: 'post-survey.html',
})
export class PostSurveyPage {
  public postSurveyForm: FormGroup; // form of questions
  public allProfList: Array<any>; // all users in active party
  public rankedProfList: Array<any>; // ranked version of allProfList
  public profRef:firebase.database.Reference; // reference to all user profiles
  public activePartyNum: number; // number of active party

  constructor(
    public navCtrl: NavController,
    public partyProvider: PartyProvider,
    public navParams: NavParams,
    public profileProvider: ProfileProvider,
    formBuilder: FormBuilder) {
      this.postSurveyForm = formBuilder.group({
        option: new FormControl(''),
        rating: new FormControl(''),
        shortAnswer: new FormControl('')
      });

      // load lists once profile provider is initialized
      this.profileProvider.loaded.subscribe((value) => {
        this.partyProvider.getActivePartyNum().on("value", snap => {
          this.activePartyNum = snap.val();
        });

        this.profRef = firebase.database().ref('/parties/' + this.activePartyNum + '/userProfile/');


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
          this.rankedProfList = profs.slice();
        });
      });
    }

  /*
    save answers to firebase and push to next page
  */
  submit(): void {
    const option: string = this.postSurveyForm.value.option;
    const rating: number = this.postSurveyForm.value.rating;
    const shortAnswer: string = this.postSurveyForm.value.shortAnswer;
    var checkedProfList = [];

    this.allProfList.forEach(prof => {
      if (prof.isChecked) {
        checkedProfList.push(prof);
      }
    });

    this.profileProvider.updatePostSurvey(option, rating, shortAnswer, this.rankedProfList, checkedProfList);
    this.navCtrl.push('PostSurvey_2Page');
  }

  /*
    used to rank user interactions, re-saves array in new order
  */
  reorderItem(indexes) {
    this.rankedProfList = reorderArray(this.rankedProfList, indexes);
  }

}
