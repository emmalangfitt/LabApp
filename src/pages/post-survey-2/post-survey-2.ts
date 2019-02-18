import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, reorderArray } from 'ionic-angular';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { ProfileProvider } from "../../providers/profile/profile";
import firebase from 'firebase/app';


@IonicPage()
@Component({
  selector: 'page-post-survey-2',
  templateUrl: 'post-survey-2.html',
})
export class PostSurvey_2Page {

  public postSurveyForm: FormGroup;
  public allProfList: Array<any>;
  public interactedProfList: Array<any>;
  public profRef:firebase.database.Reference;
  public interactedProfRef:firebase.database.Reference;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public profileProvider: ProfileProvider,
    formBuilder: FormBuilder) {
      this.postSurveyForm = formBuilder.group({
      });

      this.profRef = firebase.database().ref('/userProfile/');
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
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostSurvey_2Page');
  }

  submit(): void {
    this.navCtrl.pop();
    this.navCtrl.pop();
    this.profileProvider.postSurveySubmitted = true;
  }

  reorderItem(indexes) {
    this.interactedProfList = reorderArray(this.interactedProfList, indexes);
  }

}
