import { OnInit, Component } from '@angular/core';
import { NavbarService } from '../navbar.service';

@Component({
  selector: 'dhpp-toggle-navbar',
  templateUrl: './toggle-navbar.component.html',
  styleUrls: ['./toggle-navbar.component.scss']
})
export class ToggleNavbarComponent implements OnInit {
  constructor(private navbarService: NavbarService) {}

  ngOnInit() {}

  toggleNavbar() {
    this.navbarService.toggleNavbar();
  }
}
