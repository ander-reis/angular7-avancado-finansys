import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {map, catchError, flatMap} from 'rxjs/operators';

import {Category} from './category-model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiPath = 'api/categories';
    constructor(private http: HttpClient) {
    }

    /**
     * retornar list data
     */
    getAll(): Observable<Category[]> {
        return this.http.get(this.apiPath).pipe(
            catchError(this.handlerError),
            map(this.jsonDataToCategories)
        );
    }

    /**
     * retornar por id
     */
    getById(id: number): Observable<Category> {
        const url = `${this.apiPath}/${id}`;
        return this.http.get(url).pipe(
            catchError(this.handlerError),
            map(this.jsonDataToCategory)
        );
    }

    /**
     * criar category
     */
    create(category: Category): Observable<Category> {
        return this.http.post(this.apiPath, category).pipe(
            catchError(this.handlerError),
            map(this.jsonDataToCategory)
        );
    }

    /**
     * editar category
     */
    update(category: Category): Observable<Category> {
        const url = `${this.apiPath}/${category.id}`;
        return this.http.put(url, category).pipe(
            catchError(this.handlerError),
            map(() => category)
        );
    }

    /**
     * excluir category
     */
    delete(id: number): Observable<any> {
        const url = `${this.apiPath}/${id}`;
        return this.http.delete(url).pipe(
            catchError(this.handlerError),
            map(() => null)
        );
    }

    /**
     * metodos private ******************************************************************
     */

    /**
     * retorna categories
     */
    private jsonDataToCategories(jsonData: any[]): Category[] {
        const categories: Category[] = [];
        jsonData.forEach(element => categories.push(element as Category));
        return categories;
    }

    /**
     * retorna category
     */
    private jsonDataToCategory(jsonData: any): Category {
        return jsonData as Category;
    }

    /**
     * retorna error
     */
    private handlerError(error: any): Observable<any> {
        console.log('ERRO NA REQUISIÇÃO => ', error);
        return throwError(error);
    }
}
