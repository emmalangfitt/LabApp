import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, reorderArray } from 'ionic-angular';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { ProfileProvider } from "../../providers/profile/profile";
import firebase from 'firebase/app';

/**
 * Generated class for the PreSurveyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post-survey',
  templateUrl: 'post-survey.html',
})
export class PostSurveyPage {
  public postSurveyForm: FormGroup;
  public profList: Array<any>;
  public profRef:firebase.database.Reference;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public profileProvider: ProfileProvider,
    formBuilder: FormBuilder) {
      this.postSurveyForm = formBuilder.group({
        option: new FormControl(''),
        rating: new FormControl(''),
        shortAnswer: new FormControl('')
      });

      this.profRef = firebase.database().ref('/userProfile/');

      this.profRef.on('value', profList => {
        let profs = [];
        profList.forEach(prof => {
          profs.push({
            first: prof.val().first,
            last: prof.val().last,
            isChecked: false
          });
          return false;
        });

        this.profList = profs;
      });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreSurveyPage');
  }

  submit(): void {
    const option: string = this.postSurveyForm.value.option;
    const rating: number = this.postSurveyForm.value.rating;
    const shortAnswer: string = this.postSurveyForm.value.shortAnswer;
    var checkedProfList = [];

    this.profList.forEach(prof => {
      if (prof.isChecked) {
        checkedProfList.push(prof);
      }
    });

    this.profileProvider.updatePostSurvey(option, rating, shortAnswer, this.profList, checkedProfList);

    this.navCtrl.pop();
    this.profileProvider.postSurveySubmitted = true;
  }

  reorderItem(indexes) {
    this.profList = reorderArray(this.profList, indexes);
  }

}
