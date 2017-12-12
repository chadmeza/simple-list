import firebase from 'firebase';

export class AuthService {
  register(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  signin(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    firebase.auth().signOut();
  }

  getActiveUser() {
    return firebase.auth().currentUser;
  }

  forgotPassword(email: string): firebase.Promise<void> {
    // Sends a password reset email.
    return firebase.auth().sendPasswordResetEmail(email);
  }
}
