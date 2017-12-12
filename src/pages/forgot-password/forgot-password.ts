import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController} from "ionic-angular";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth";

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController,
              private navCtrl: NavController, private authService: AuthService) {}

  onPasswordReset(form: NgForm) {
    // Creates the loading spinner.
    const loading = this.loadingCtrl.create({
      content: 'Signing in ...'
    });
    loading.present();

    // Sends a password reset email.
    this.authService.forgotPassword(form.value.email)
      .then(() => {
        loading.dismiss();
        this.handlerSuccess("A link to reset your password has been sent to your e-mail address.");
      })
      .catch((error) => {
        loading.dismiss();
        this.handlerError("There was a problem with your e-mail address. Please try again.");
      });
  }

  handlerSuccess(successMessage: string) {
    // Creates an alert displaying an error message.
    const alert = this.alertCtrl.create({
      title: "Successful!",
      message: successMessage,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
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

}
