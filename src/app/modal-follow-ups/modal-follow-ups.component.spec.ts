import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFollowUpsComponent } from './modal-follow-ups.component';

describe('ModalFollowUpsComponent', () => {
  let component: ModalFollowUpsComponent;
  let fixture: ComponentFixture<ModalFollowUpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFollowUpsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFollowUpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
