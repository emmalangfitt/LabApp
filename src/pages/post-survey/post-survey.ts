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
        q1: new FormControl(''),
        q2: new FormControl(''),
        q3: new FormControl(''),
        q4: new FormControl(''),
        q5: new FormControl(''),
        q6: new FormControl(''),
        q7: new FormControl(''),
        q8: new FormControl(''),
        q9: new FormControl(''),
        q10: new FormControl(''),
        q11: new FormControl(''),
        q13: new FormControl(''),
        q14: new FormControl(''),
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
            if(!prof.val().role){
              profs.push({
                photo: prof.val().photo,
                first: prof.val().first,
                last: prof.val().last,
                isChecked: false
              });
            }
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
  // submit(): void {
  //   const option: string = this.postSurveyForm.value.option;
  //   const rating: number = this.postSurveyForm.value.rating;
  //   const shortAnswer: string = this.postSurveyForm.value.shortAnswer;
  //   var checkedProfList = [];
  //
  //   this.allProfList.forEach(prof => {
  //     if (prof.isChecked) {
  //       checkedProfList.push(prof);
  //     }
  //   });
  //
  //   this.profileProvider.updatePostSurvey(option, rating, shortAnswer, this.rankedProfList, checkedProfList);
  //   this.navCtrl.push('PostSurvey_2Page');
  // }

  /*
    save answers to firebase and push to next page
  */
  submit(): void {
    const q1: number = this.postSurveyForm.value.q1;
    const q2: number = this.postSurveyForm.value.q2;
    const q3: number = this.postSurveyForm.value.q3;
    const q4: number = this.postSurveyForm.value.q4;
    const q5: number = this.postSurveyForm.value.q5;
    const q6: number = this.postSurveyForm.value.q6;
    const q7: number = this.postSurveyForm.value.q7;
    const q8: number = this.postSurveyForm.value.q8;
    const q9: number = this.postSurveyForm.value.q9;
    const q10: number = this.postSurveyForm.value.q10;
    const q11: number = this.postSurveyForm.value.q11;
    var checkedProfList = [];
    const q13: string = this.postSurveyForm.value.q13;
    const q14: string = this.postSurveyForm.value.q14;

    this.allProfList.forEach(prof => {
      if (prof.isChecked) {
        checkedProfList.push(prof);
      }
    });

    this.profileProvider.updatePostSurvey(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, checkedProfList, q13, q14);
    this.profileProvider.postSurveySubmitted = true;
    this.navCtrl.pop();
  }

  /*
    used to rank user interactions, re-saves array in new order
  */
  reorderItem(indexes) {
    this.rankedProfList = reorderArray(this.rankedProfList, indexes);
  }

}
