import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaPanelComponent } from './media-panel.component';

describe('MediaPanelComponent', () => {
  let component: MediaPanelComponent;
  let fixture: ComponentFixture<MediaPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
