import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreSurveyPage } from './pre-survey';

@NgModule({
  declarations: [
    PreSurveyPage,
  ],
  imports: [
    IonicPageModule.forChild(PreSurveyPage),
  ],
})
export class PreSurveyPageModule {}
