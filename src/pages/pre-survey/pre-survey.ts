import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { ProfileProvider } from "../../providers/profile/profile";

/**
 * Generated class for the PreSurveyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pre-survey',
  templateUrl: 'pre-survey.html',
})
export class PreSurveyPage {
  public preSurveyForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public profileProvider: ProfileProvider,
    formBuilder: FormBuilder) {
      this.preSurveyForm = formBuilder.group({
        year: new FormControl(''),
        gender: new FormControl(''),
        major: new FormControl(''),
        option: new FormControl(''),
        rating: new FormControl(''),
        shortAnswer: new FormControl('')
      });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreSurveyPage');
  }

  submit(): void {
    const year: string = this.preSurveyForm.value.year;
    const gender: string = this.preSurveyForm.value.gender;
    const major: string = this.preSurveyForm.value.major;
    const option: string = this.preSurveyForm.value.option;
    const rating: number = this.preSurveyForm.value.rating;
    const shortAnswer: string = this.preSurveyForm.value.shortAnswer;

    this.profileProvider.updatePreSurvey(year, gender, major, option, rating, shortAnswer);
    this.navCtrl.pop();
    this.profileProvider.preSurveySubmitted = true;
  }

}
