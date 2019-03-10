import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';

import {CategoriesRoutingModule} from './categories-routing.module';
import {CategoryListComponent} from './category-list/category-list.component';
import {CategoryFormComponent} from './category-form/category-form.component';

import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [CategoryListComponent, CategoryFormComponent],
    imports: [
        SharedModule,
        CategoriesRoutingModule,
        ReactiveFormsModule
    ]
})
export class CategoriesModule {
}
