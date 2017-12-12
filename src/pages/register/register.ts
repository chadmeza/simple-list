import { Component } from '@angular/core';
import {AlertController, LoadingController} from "ionic-angular";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth";
import {UserService} from "../../services/user";
import {User} from "../../models/user";

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user: User = new User("", "", "");

  constructor(private authService: AuthService, private loadingCtrl: LoadingController,
              private alertCtrl: AlertController, private userService: UserService) {}

  onRegister(form: NgForm) {
    // Creates the loading spinner.
    const loading = this.loadingCtrl.create({
      content: 'Registering your account ...'
    });
    loading.present();

    if (form.value.password != form.value.confirmpassword) {
      loading.dismiss();
      this.handlerError("The passwords to do not match. Please try again.");
      return;
    }

    // Creates a user from the submitted form data.
    this.user = new User(form.value.name, form.value.email.trim(), "");

    // Registers the new user for authentication.
    this.authService.register(form.value.email.trim(), form.value.password)
      .then(data => {
        const userId = this.authService.getActiveUser().uid;
        this.user.uid = userId;

        // If registration for authentication is successful, then add the user data to the user service.
        this.userService.user = this.user;

        // Gets the new user's token, used for database operations.
        this.authService.getActiveUser().getToken()
          .then(
            (token: string) => {
              // Adds a new user to the database.
              this.userService.registerNewUser(token)
                .subscribe(
                  () => loading.dismiss(),
                  error => {
                    loading.dismiss();
                    this.handlerError(error.json().error);
                  }
                );
            }
          );
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

}
