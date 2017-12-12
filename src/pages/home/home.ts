import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController} from 'ionic-angular';
import {AuthService} from "../../services/auth";
import {UserService} from "../../services/user";
import {User} from "../../models/user";
import {AddItemPage} from "../add-item/add-item";
import {Item} from "../../models/item";
import {UploadService} from "../../services/upload";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: User = new User("", "", "");
  profileImage: any;
  profileUrl: any;
  profileImageSet: boolean = false;

  constructor(public navCtrl: NavController, private authService: AuthService, private userService: UserService,
            private loadingCtrl: LoadingController, private alertCtrl: AlertController,
            private uploadService: UploadService) {}

  ionViewWillEnter() {
    if (this.authService.getActiveUser().email == this.userService.user.email) {
      this.user = this.userService.user;
    }

    if (this.user.name == "") {
      this.loadCurrentUserData();
    }

    if (this.user.image) {
      this.profileImageSet = true;
    }
  }

  loadCurrentUserData() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait ...'
    });
    loading.present();

    // Gets the new user's token, used for database operations.
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          // Loads the current user's data from the database.
          this.userService.getCurrentUser(token)
            .subscribe(
              (user: User) => {
                loading.dismiss();

                if (user) {
                  this.user = user;

                  if (this.user.image) {
                    this.profileImageSet = true;
                  }
                }
              },
              error => {
                loading.dismiss();
                this.handlerError(error.message);
              }
            );
        }
      );
  }

  onLogout() {
    this.authService.logout();
  }

  onSelectPhoto(): void {
    // Creates the loading spinner.
    const loading = this.loadingCtrl.create({
      content: 'Uploading your image ...',
      enableBackdropDismiss: true
    });
    loading.present();

    this.uploadService.selectImage()
      .then((data) => {
        this.profileImage = data;

        this.userService.uploadImage(this.profileImage)
          .then((snapshot: any) => {
            this.profileUrl = snapshot.downloadURL;
            this.profileImageSet = true;
            this.user.image = this.profileUrl;

            // Gets the new user's token, used for database operations.
            this.authService.getActiveUser().getToken()
              .then(
                (token: string) => {
                  // Adds a new user to the database.
                  this.userService.updateUserData(token)
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
          .catch((error) => {
            loading.dismiss();
          });
      })
      .catch((error) => {
        loading.dismiss();
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

  onAddItemToList() {
    this.navCtrl.push(AddItemPage);
  }

  onEditItem(item: Item, index: number) {
    this.navCtrl.push(AddItemPage, {item: item, index: index});
  }

  onDeleteItem(item: Item, index: number) {
    // Creates the loading spinner.
    const loading = this.loadingCtrl.create({
      content: 'Adding your new item ...'
    });
    loading.present();

    // Gets the new user's token, used for database operations.
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          // Adds a new user to the database.
          this.userService.removeItem(token, index)
            .subscribe(
              () => {
                loading.dismiss();
              },
              error => {
                loading.dismiss();
                this.handlerError(error.json().error);
              }
            );
        }
      );
  }

}
