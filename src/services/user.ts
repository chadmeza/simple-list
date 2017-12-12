import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {AuthService} from "./auth";
import 'rxjs/Rx';
import firebase from 'firebase';
import {User} from "../models/user";
import {Item} from "../models/item";

@Injectable()
export class UserService {
  public user: User = new User("", "", "");
  public users: User[] = [];

  constructor(private http: Http, private authService: AuthService) {}

  addItem(token: string, item: Item) {
    this.user.items.push(item);

    return this.updateUserData(token);
  }

  getItems() {
    return this.user.items.slice();
  }

  removeItem(token: string, index: number) {
    this.user.items.splice(index, 1);

    return this.updateUserData(token);
  }

  updateItemData(token: string, item: Item, index: number) {
    // Adds a new user to the database.
    return this.http.put('https://simple-list-afb0a.firebaseio.com/users/' + item.createdBy + '/user/items/' + index + '.json?auth=' + token, item)
      .map((response: Response) => {
        return response.json();
      });
  }

  updateUserData(token: string) {
    const userId = this.authService.getActiveUser().uid;

    // Adds a new user to the database.
    return this.http.put('https://simple-list-afb0a.firebaseio.com/users/' + userId + '/user.json?auth=' + token, this.user)
      .map((response: Response) => {
        return response.json();
      });
  }

  registerNewUser(token: string) {
    return this.updateUserData(token);
  }

  getCurrentUser(token: string) {
    const userId = this.authService.getActiveUser().uid;

    // Gets the currently logged-in user data from the database.
    return this.http.get('https://simple-list-afb0a.firebaseio.com/users/' + userId + '/user.json?auth=' + token)
      .map((response: Response) => {
        const user: User = response.json() ? response.json() : null;
        if (!user.hasOwnProperty('items')) {
          user.items = [];
        }

        return user;
      })
      .do(
        (user: User) => {
          if (user) {
            this.user = user;
          }
        }
      );
  }

  searchUsers(token: string, search: string) {
    const userId = this.authService.getActiveUser().email;

    // Gets the currently logged-in user data from the database.
    return this.http.get('https://simple-list-afb0a.firebaseio.com/users.json?auth=' + token)
      .map((response: Response) => {
        const users: User[] = [];
        const results: any[] = response.json() ? response.json() : null;
        //const term: string = search.replace(/[\s]/g, '');
        const term: string = search.trim();

        // Takes the array of objects, and gets the UID of each user.
        for (var result in results) {
          if (!results[result].user.hasOwnProperty('items')) {
            results[result].user.items = [];
          }

          if (results[result].user.email.toLowerCase().search(userId.toLowerCase()) > -1) {
            continue;
          }

          if (results[result].user.name.toLowerCase().search(term.toLowerCase()) > -1) {
            // If the search term matches a user's name, add user to the users array.
            users.push(results[result].user);
          } else if (results[result].user.email.toLowerCase().search(term.toLowerCase()) > -1) {
            // If the search term matches a user's email, add user to the users array.
            users.push(results[result].user);
          }
        }

        return users;
      })
      .do(
        (users: any[]) => {
          if (users) {
            this.users = users;
          }
        }
      );
  }

  uploadImage(imageString) : Promise<any> {
    let image: string  = new Date().getTime() + '.jpg',
      storageRef: any,
      parseUpload: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref('profile/' + image);
      parseUpload = storageRef.putString(imageString, 'data_url');

      parseUpload.on('state_changed', (snapshot) => {},
        (error) => {
          reject(error);
        },
        (success) => {
          resolve(parseUpload.snapshot);
        });
    });
  }

  uploadItemImage(imageString) : Promise<any> {
    const userId = this.authService.getActiveUser().uid;

    let image: string  = new Date().getTime() + '.jpg',
      storageRef: any,
      parseUpload: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref('items/' + userId + '/' + image);
      parseUpload = storageRef.putString(imageString, 'data_url');

      parseUpload.on('state_changed', (snapshot) => {},
        (error) => {
          reject(error);
        },
        (success) => {
          resolve(parseUpload.snapshot);
        });
    });
  }
}
