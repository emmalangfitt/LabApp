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
        q12: new FormControl(''),
        q13: new FormControl(''),
        q14: new FormControl(''),
        q15: new FormControl(''),
        q16: new FormControl(''),
        q17: new FormControl(''),
      });
    }

  /*
    save answers to firebase and push to next page
  */
  submit(): void {
    const q1: string = this.preSurveyForm.value.q1;
    const q2: string = this.preSurveyForm.value.q2;
    const q3: string = this.preSurveyForm.value.q3;
    const q4: string = this.preSurveyForm.value.q4;
    const q5: string = this.preSurveyForm.value.q5;
    const q6: string = this.preSurveyForm.value.q6;
    const q7: string = this.preSurveyForm.value.q7;
    const q8: number = this.preSurveyForm.value.q8;
    const q9: number = this.preSurveyForm.value.q9;
    const q10: number = this.preSurveyForm.value.q10;
    const q11: number = this.preSurveyForm.value.q11;
    const q12: number = this.preSurveyForm.value.q12;
    const q13: number = this.preSurveyForm.value.q13;
    const q14: number = this.preSurveyForm.value.q14;
    const q15: number = this.preSurveyForm.value.q15;
    const q16: number = this.preSurveyForm.value.q16;
    const q17: number = this.preSurveyForm.value.q17;

    this.profileProvider.updatePreSurvey(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17);;
    this.navCtrl.pop();
    this.profileProvider.preSurveySubmitted = true;
  }

}
