import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  get isAuthed(){
    return !!localStorage.getItem("loginToken") || !!sessionStorage.getItem("loginToken")
  }

  get userName(){
    let token = JSON.parse(localStorage.getItem("loginToken") || sessionStorage.getItem("loginToken") || "")
    return token.username;
  }

  Logout()
  {
    localStorage.removeItem("loginToken");
    sessionStorage.removeItem("loginToken");
    this.router.navigate(["/"])
  }

}
