import { Component } from '@angular/core';
import {UserService} from "../../services/user";
import {NgForm} from "@angular/forms";
import {AlertController, LoadingController, NavController, NavParams} from "ionic-angular";
import {User} from "../../models/user";
import {Item} from "../../models/item";
import {AuthService} from "../../services/auth";
import {UploadService} from "../../services/upload";

@Component({
  selector: 'page-add-item',
  templateUrl: 'add-item.html',
})
export class AddItemPage {
  user: User;
  newItem: Item;
  editItem: Item;
  index: number;
  itemImageUrl: any;
  itemImage: any;
  itemImageSet: boolean = false;

  constructor(private navCtrl: NavController, private userService: UserService,
              private loadingCtrl: LoadingController, private authService: AuthService,
              private alertCtrl: AlertController, private navParams: NavParams,
              private uploadService: UploadService) {
    this.editItem = this.navParams.get("item");
    this.index = this.navParams.get("index");
  }

  ionViewWillEnter() {
    this.user = this.userService.user;
  }

  onAddItemToList(form: NgForm) {
    // Creates the loading spinner.
    const loading = this.loadingCtrl.create({
      content: 'Adding your new item ...'
    });
    loading.present();

    if (this.editItem != null && this.index != null) {
      this.deleteItem(this.editItem, this.index);
    }

    // Creates a item from the submitted form data.
    this.newItem = {name: form.value.name, description: form.value.description, stores: null, link: null, image: null,
                    price: null, purchased: false, createdBy: null, purchasedBy: null};

    if (form.value.stores) {
      this.newItem.stores = form.value.stores;
    }

    if (form.value.link) {
      this.newItem.link = form.value.link;
    }

    if (form.value.price) {
      if (form.value.price.substr(0,1) == "$") {
        this.newItem.price = form.value.price.substr(1);
      } else {
        this.newItem.price = form.value.price;
      }
    }

    if (this.itemImageSet) {
      this.newItem.image = this.itemImageUrl;
    }

    this.newItem.createdBy = this.authService.getActiveUser().uid;

    // Gets the new user's token, used for database operations.
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          // Adds a new user to the database.
          this.userService.addItem(token, this.newItem)
            .subscribe(
              () => {
                loading.dismiss();
                this.navCtrl.popToRoot();
              },
              error => {
                loading.dismiss();
                this.handlerError(error.json().error);
              }
            );
        }
      );
  }

  deleteItem(item: Item, index: number) {
    // Gets the new user's token, used for database operations.
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          // Adds a new user to the database.
          this.userService.removeItem(token, index)
            .subscribe(
              () => {},
              error => {
                this.handlerError(error.json().error);
              }
            );
        }
      );
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
        this.itemImage = data;

        this.userService.uploadItemImage(this.itemImage)
          .then((snapshot: any) => {
            this.itemImageUrl = snapshot.downloadURL;
            this.itemImageSet = true;
            loading.dismiss();
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

}
