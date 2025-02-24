// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log(this.authService.isLoggedIn());
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // If admin tries to access user routes, redirect to admin dashboard
    if (this.authService.isAdmin()) {
      
      console.log("he is ");
      this.router.navigate(['/admin-dashboard']);
      return false;
    }
    console.log("he is not");

    return true;
  }
}