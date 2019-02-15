import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostSurveyPage } from './post-survey';

@NgModule({
  declarations: [
    PostSurveyPage,
  ],
  imports: [
    IonicPageModule.forChild(PostSurveyPage),
  ],
})
export class PostSurveyPageModule {}
