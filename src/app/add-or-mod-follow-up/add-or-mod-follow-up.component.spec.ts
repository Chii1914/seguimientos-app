import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModFollowUpComponent } from './add-or-mod-follow-up.component';

describe('AddOrModFollowUpComponent', () => {
  let component: AddOrModFollowUpComponent;
  let fixture: ComponentFixture<AddOrModFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrModFollowUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrModFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
