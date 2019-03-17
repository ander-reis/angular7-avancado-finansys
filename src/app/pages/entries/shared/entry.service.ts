import {Injectable, Injector} from '@angular/core';
import {BaseResourceService} from '../../../shared/services/base-resource.service';

import {CategoryService} from '../../categories/shared/category.service';

import {Entry} from './entry-model';

import {flatMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

    constructor(protected injector: Injector, private categoryService: CategoryService) {
        super('api/entries', injector);
    }

    /**
     * criar entry
     * OBS: se estiver utilizando api externa retirar operador flatMap e categoryService
     * pois é retornado objeto direto do servidor
     */
    create(entry: Entry): Observable<Entry> {
        return this.categoryService.getById(entry.categoryId).pipe(
            flatMap(category => {
                entry.category = category;
                return super.create(entry);
            })
        );
    }

    /**
     * editar entry
     * OBS: se estiver utilizando api externa retirar operador flatMap e categoryService
     * pois é retornado objeto direto do servidor
     */
    update(entry: Entry): Observable<Entry> {
        return this.categoryService.getById(entry.categoryId).pipe(
            flatMap(category => {
               entry.category = category;
               return super.update(entry);
            })
        );
    }

    /**
     * metodos private ******************************************************************
     */

    /**
     * retorna entries
     */
    protected jsonDataToResources(jsonData: any[]): Entry[] {
        /**
         * exemplos de object e object do tipo Entry
         */
        /**
            console.log(jsonData[0] as Entry);
            console.log(Object.assign(new Entry(), jsonData[0]));
         */
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
    protected jsonDataToResource(jsonData: any): Entry {
        return Object.assign(new Entry(), jsonData);
    }
}
