import { Component } from "@angular/core";
import {
  Alert,
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController
} from "ionic-angular";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { EmailValidator } from "../../validators/email";
import { HomePage } from "../home/home";
import { TabsPage } from "../tabs/tabs";

@IonicPage()
@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
  public signupForm: FormGroup; // collects input of email, password, and name
  public loading: Loading; // displays loading icon while info saves

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    formBuilder: FormBuilder) {
      this.signupForm = formBuilder.group({
        email: new FormControl('', Validators.compose([Validators.required, EmailValidator.isValid])),
        first: new FormControl(''),
        last: new FormControl(''),
        password: new FormControl('', Validators.compose([Validators.minLength(6), Validators.required]))
      });
    }

  /*
    collects info to create a new user account and save their info
    to the firebase database in the current active party
  */
  signupUser(): void {
    if (!this.signupForm.valid) {
      console.log(
        `Need to complete the form, current value: ${this.signupForm.value}`
      );
    } else {
      const email: string = this.signupForm.value.email;
      const first: string = this.signupForm.value.first;
      const last: string = this.signupForm.value.last;
      const password: string = this.signupForm.value.password;

      this.authProvider.signupUser(email, password, first, last).then(
        user => {
          this.loading.dismiss().then(() => {
            this.navCtrl.setRoot(TabsPage);
          });
        },
        error => {
          this.loading.dismiss().then(() => {
            const alert: Alert = this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: "Ok", role: "cancel" }]
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
