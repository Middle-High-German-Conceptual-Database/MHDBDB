import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RefreshGuard implements CanActivate {
  canActivate(): boolean {
    // Use window.location.reload() to force a page refresh
    window.location.reload();
    return false; // Prevent route activation
  }
}
