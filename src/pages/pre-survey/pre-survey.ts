import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { ProfileProvider } from "../../providers/profile/profile";

@IonicPage()
@Component({
  selector: 'page-pre-survey',
  templateUrl: 'pre-survey.html',
})
export class PreSurveyPage {
  public preSurveyForm: FormGroup; // form of questions

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

  /*
    save answers to firebase and push to next page
  */
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
