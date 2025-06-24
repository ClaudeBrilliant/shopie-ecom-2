import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, CommonModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent {

  faSearch = faSearch;
  searchTerm: string = '';

}
