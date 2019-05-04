import {Injectable, Injector} from '@angular/core';
import {BaseResourceService} from '../../../shared/services/base-resource.service';

import {CategoryService} from '../../categories/shared/category.service';

import {Entry} from './entry-model';

import {catchError, flatMap, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

    constructor(protected injector: Injector, private categoryService: CategoryService) {
        super('api/entries', injector, Entry.fromJson);
    }

    /**
     * criar entry
     * OBS: se estiver utilizando api externa retirar operador flatMap e categoryService
     * pois é retornado objeto direto do servidor
     */
    create(entry: Entry): Observable<Entry> {
        return this.setCategoryAndSendToServer(entry, super.create.bind(this));
    }

    /**
     * editar entry
     * OBS: se estiver utilizando api externa retirar operador flatMap e categoryService
     * pois é retornado objeto direto do servidor
     */
    update(entry: Entry): Observable<Entry> {
        return this.setCategoryAndSendToServer(entry, super.update.bind(this));
    }

    private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry> {
        return this.categoryService.getById(entry.categoryId).pipe(
            flatMap(category => {
                entry.category = category;
                return sendFn(entry);
            }),
            catchError(this.handlerError)
        );
    }

    public getByMonthAndYear(month: number, year: number): Observable<Entry[]> {
        return this.getAll().pipe(
            map(entries => this.filterByMonthAndYear(entries, month, year))
        );
    }

    private filterByMonthAndYear(entries: Entry[], month: number, year: number) {
        return entries.filter(entry => {
            const entryDate = moment(entry.date, 'DD/MM/YYYY');
            const monthMatches = entryDate.month() + 1 == month;
            const yearMatches = entryDate.year() == year;

            if (monthMatches && yearMatches) {
                return entry;
            }
        });
    }
}
