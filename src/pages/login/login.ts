import { Component } from '@angular/core';
import { Alert, AlertController, Loading, LoadingController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { EmailValidator } from '../../validators/email';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup; // form to gather email and password
  public loading: Loading;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    formBuilder: FormBuilder
  ) {
    this.loginForm = formBuilder.group({
     email: [
       '',
       Validators.compose([Validators.required, EmailValidator.isValid])
     ],
     password: [
       '',
       Validators.compose([Validators.required, Validators.minLength(6)])
     ]
   });
  }

  /*
    Navigate to sign up page on button click
  */
  goToSignup():void {
    this.navCtrl.push('SignupPage');
  }

  /*
    Navigate to rest password page on button click
  */
  goToResetPassword():void {
    this.navCtrl.push('ResetPasswordPage');
  }

  /*
    When "Log In" is clicked, validate that user is registered and
    log them into the active party. Shows loading indicator while validating.
  */
  loginUser(): void {
    if (!this.loginForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.loginForm.value}`
      );
    } else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authProvider.loginUser(email, password).then(
        authData => {
          this.loading.dismiss().then(() => {
            this.navCtrl.setRoot(TabsPage);
          });
        },
        error => {
          this.loading.dismiss().then(() => {
            const alert: Alert = this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            alert.present();
          });
        }
      );
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }

}
