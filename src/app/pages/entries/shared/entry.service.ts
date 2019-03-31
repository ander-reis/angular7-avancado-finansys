import {Injectable, Injector} from '@angular/core';
import {BaseResourceService} from '../../../shared/services/base-resource.service';

import {CategoryService} from '../../categories/shared/category.service';

import {Entry} from './entry-model';

import {catchError, flatMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

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
}
