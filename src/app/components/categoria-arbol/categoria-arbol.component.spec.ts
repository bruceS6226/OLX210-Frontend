import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaArbolComponent } from './categoria-arbol.component';

describe('TreeCategoryComponent', () => {
  let component: CategoriaArbolComponent;
  let fixture: ComponentFixture<CategoriaArbolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriaArbolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaArbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
