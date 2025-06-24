import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartPie, faBox, faTags, faUsers, faUserCog, faStar, faQuestionCircle, faSignOutAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, RouterModule, FontAwesomeModule]
})
export class SidebarComponent {
  faChartPie = faChartPie;
  faBox = faBox;
  faTags = faTags;
  faUsers = faUsers;
  faUserCog = faUserCog;
  faStar = faStar;
  faQuestionCircle = faQuestionCircle;
  faSignOutAlt = faSignOutAlt;
  faClipboardList = faClipboardList;
}