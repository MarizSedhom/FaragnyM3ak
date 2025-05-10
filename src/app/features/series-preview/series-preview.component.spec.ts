import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesPreviewComponent } from './series-preview.component';

describe('SeriesPreviewComponent', () => {
  let component: SeriesPreviewComponent;
  let fixture: ComponentFixture<SeriesPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
