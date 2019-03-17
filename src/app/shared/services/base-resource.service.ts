import {BaseResourceModel} from '../models/base-resource.model';
import {Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

export abstract class BaseResourceService<T extends BaseResourceModel> {
    protected http: HttpClient;
    constructor(protected apiPath: string, protected injector: Injector) {
        this.http = injector.get(HttpClient);
    }

    /**
     * retornar list data
     */
    getAll(): Observable<T[]> {
        return this.http.get(this.apiPath).pipe(
            catchError(this.handlerError),
            map(this.jsonDataToResources)
        );
    }

    /**
     * retornar por id
     */
    getById(id: number): Observable<T> {
        const url = `${this.apiPath}/${id}`;
        return this.http.get(url).pipe(
            catchError(this.handlerError),
            map(this.jsonDataToResource)
        );
    }

    /**
     * criar resource
     */
    create(resource: T): Observable<T> {
        return this.http.post(this.apiPath, resource).pipe(
            catchError(this.handlerError),
            map(this.jsonDataToResource)
        );
    }

    /**
     * editar resource
     */
    update(resource: T): Observable<T> {
        const url = `${this.apiPath}/${resource.id}`;
        return this.http.put(url, resource).pipe(
            catchError(this.handlerError),
            map(() => resource)
        );
    }

    /**
     * excluir resource
     */
    delete(id: number): Observable<any> {
        const url = `${this.apiPath}/${id}`;
        return this.http.delete(url).pipe(
            catchError(this.handlerError),
            map(() => null)
        );
    }

    /**
     * metodos protected ******************************************************************
     */

    /**
     * retorna resources
     */
    protected jsonDataToResources(jsonData: any[]): T[] {
        const resources: T[] = [];
        jsonData.forEach(element => resources.push(element as T));
        return resources;
    }

    /**
     * retorna category
     */
    protected jsonDataToResource(jsonData: any): T {
        return jsonData as T;
    }

    /**
     * retorna error
     */
    protected handlerError(error: any): Observable<any> {
        console.log('ERRO NA REQUISIÇÃO => ', error);
        return throwError(error);
    }

}
