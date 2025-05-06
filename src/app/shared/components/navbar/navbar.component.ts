import { Component, AfterViewInit, ElementRef, ViewChild, HostListener} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true
})
export class NavbarComponent {
  @ViewChild('searchContainer') searchContainer!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  constructor() {}
  
  ngAfterViewInit() {
    // Make sure the elements are available
    if (this.searchContainer && this.searchInput) {
      this.initSearchFunctionality();
    }
  }

  // Toggle search when clicking the icon
  toggleSearch(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Prevent toggling if clicking the input itself
    if (target === this.searchInput.nativeElement) {
      return;
    }
    
    this.searchContainer.nativeElement.classList.toggle('expanded');
    
    if (this.searchContainer.nativeElement.classList.contains('expanded')) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 300);
    }
  }
  
  // Handle search submission
  handleSearch() {
    const searchTerm = this.searchInput.nativeElement.value.trim();
    if (searchTerm) {
      console.log('Searching for:', searchTerm);
      // Implement your search functionality here
      // For example:
      // this.searchService.search(searchTerm).subscribe(results => {
      //   this.searchResults = results;
      // });
      
      // Clear input
      this.searchInput.nativeElement.value = '';
    }
  }
  
  // Close search field
  closeSearch() {
    if (this.searchContainer) {
      this.searchContainer.nativeElement.classList.remove('expanded');
    }
  }
  
  // Alternative approach using native event listeners
  private initSearchFunctionality() {
    const searchContainer = this.searchContainer.nativeElement;
    const searchInput = this.searchInput.nativeElement;
    
    // Toggle search input when clicking the search icon
    searchContainer.addEventListener('click', (e: Event) => {
      // Prevent the click on the input itself from toggling
      if (e.target === searchInput) {
        return;
      }
      
      // Toggle expanded class
      searchContainer.classList.toggle('expanded');
      
      // Focus input if expanded
      if (searchContainer.classList.contains('expanded')) {
        setTimeout(() => {
          searchInput.focus();
        }, 300);
      }
    });
    
    // Handle search submit
    searchInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        // Get search term
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
          console.log('Searching for:', searchTerm);
          // Add your search functionality here
          
          // Clear input
          searchInput.value = '';
        }
      }
      
      // Close search on Escape
      if (e.key === 'Escape') {
        searchContainer.classList.remove('expanded');
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
