import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {map, catchError, flatMap} from 'rxjs/operators';

import {Entry} from './entry-model';

@Injectable({
    providedIn: 'root'
})
export class EntryService {
    private apiPath = 'api/entries';
    constructor(private http: HttpClient) {
    }

    /**
     * retornar list data
     */
    getAll(): Observable<Entry[]> {
        return this.http.get(this.apiPath).pipe(
            catchError(this.handlerError),
            map(this.jsonDataToEntries)
        );
    }

    /**
     * retornar por id
     */
    getById(id: number): Observable<Entry> {
        const url = `${this.apiPath}/${id}`;
        return this.http.get(url).pipe(
            catchError(this.handlerError),
            map(this.jsonDataToEntry)
        );
    }

    /**
     * criar entry
     */
    create(entry: Entry): Observable<Entry> {
        return this.http.post(this.apiPath, entry).pipe(
            catchError(this.handlerError),
            map(this.jsonDataToEntry)
        );
    }

    /**
     * editar entry
     */
    update(entry: Entry): Observable<Entry> {
        const url = `${this.apiPath}/${entry.id}`;
        return this.http.put(url, entry).pipe(
            catchError(this.handlerError),
            map(() => entry)
        );
    }

    /**
     * excluir entry
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
     * retorna entries
     */
    private jsonDataToEntries(jsonData: any[]): Entry[] {
        /**
         * exemplos de object e object do tipo Entry
         */
        //console.log(jsonData[0] as Entry);
        //console.log(Object.assign(new Entry(), jsonData[0]));

        const entries: Entry[] = [];
        jsonData.forEach(element => {
            const entry = Object.assign(new Entry(), element);
            entries.push(entry);
        });
        return entries;
    }

    /**
     * retorna entry
     */
    private jsonDataToEntry(jsonData: any): Entry {
        return Object.assign(new Entry(), jsonData);
    }

    /**
     * retorna error
     */
    private handlerError(error: any): Observable<any> {
        console.log('ERRO NA REQUISIÇÃO => ', error);
        return throwError(error);
    }
}
