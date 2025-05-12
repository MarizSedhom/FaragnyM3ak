import { Component, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/Service/authService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('searchContainer') searchContainer!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngAfterViewInit() {
    // Initialize search functionality after view is initialized
    this.initSearchFunctionality();
  }

  // Toggle search when clicking the icon
  toggleSearch(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const searchContainer = this.searchContainer.nativeElement;
    const searchInput = this.searchInput.nativeElement;

    // Toggle expanded class
    searchContainer.classList.toggle('expanded');

    // Focus input if expanded
    if (searchContainer.classList.contains('expanded')) {
      setTimeout(() => {
        searchInput.focus();
      }, 300);
    }
  }

  // Handle search submission
  handleSearch() {
    const searchTerm = this.searchInput.nativeElement.value.trim();
    if (searchTerm) {
      console.log('Searching for:', searchTerm);
      // Implement your search functionality here
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/search'], { queryParams: { query: searchTerm } });
      });      // Clear input
      this.searchInput.nativeElement.value = '';
    }
  }

  // Close search field
  closeSearch() {
    if (this.searchContainer) {
      this.searchContainer.nativeElement.classList.remove('expanded');
    }
  }

  // Initialize search functionality
  private initSearchFunctionality() {
    const searchInput = this.searchInput.nativeElement;

    // Handle search submit
    searchInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }

      // Close search on Escape
      if (e.key === 'Escape') {
        this.closeSearch();
      }
    });
  }

  // Handle clicks outside the search component
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.searchContainer &&
        !this.searchContainer.nativeElement.contains(event.target) &&
        this.searchContainer.nativeElement.classList.contains('expanded')) {
      this.closeSearch();
    }
  }
}
