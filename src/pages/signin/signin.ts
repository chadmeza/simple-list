import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AlertController, LoadingController, NavController} from "ionic-angular";
import {RegisterPage} from "../register/register";
import {AuthService} from "../../services/auth";
import {ForgotPasswordPage} from "../forgot-password/forgot-password";

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  logo = "http://www.chadmeza.com/downloads/logo-box.jpg";

  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController, private alertCtrl: AlertController,
            private authService: AuthService) {}

  onSignin(form: NgForm) {
    // Creates the loading spinner.
    const loading = this.loadingCtrl.create({
      content: 'Signing in ...'
    });
    loading.present();

    // Signs the user in via authentication.
    this.authService.signin(form.value.email.trim(), form.value.password)
      .then(data => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();

        // Creates an alert displaying the error message.
        this.handlerError(error.message);
      });
  }

  handlerError(errorMessage: string) {
    // Creates an alert displaying an error message.
    const alert = this.alertCtrl.create({
      title: "An error has occurred!",
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

  onRegisterUser() {
    this.navCtrl.push(RegisterPage);
  }

  onForgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);
  }

}
