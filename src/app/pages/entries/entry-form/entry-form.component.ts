import {Component, OnInit, AfterContentChecked} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {Entry} from '../shared/entry-model';
import {EntryService} from '../shared/entry.service';

import {switchMap} from 'rxjs/operators';

import toastr from 'toastr';

@Component({
    selector: 'app-entry-form',
    templateUrl: './entry-form.component.html',
    styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

    currentAction: string;
    entryForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[] = null;
    submittingForm: boolean = null;
    entry: Entry = new Entry();

    constructor(
        private entryService: EntryService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.setCurrentAction();
        this.buildEntryForm();
        this.loadEntry();
    }

    ngAfterContentChecked(): void {
        this.setPageTitle();
    }

    submitForm() {
        this.submittingForm = true;

        if (this.currentAction === 'new') {
            this.createEntry();
        } else {
            this.updateEntry();
        }
    }

    /**
     * verifica url se é new ou edit
     */
    private setCurrentAction() {
        if (this.route.snapshot.url[0].path === 'new') {
            this.currentAction = 'new';
        } else {
            this.currentAction = 'edit';
        }
    }

    /**
     * formata form
     */
    private buildEntryForm() {
        this.entryForm = this.formBuilder.group({
            id: [null],
            name: [null, [Validators.required, Validators.minLength(2)]],
            description: [null],
            type: [null, [Validators.required]],
            amount: [null, [Validators.required]],
            date: [null, [Validators.required]],
            paid: [null, [Validators.required]],
            categoryId: [null, [Validators.required]]
        });
    }

    /**
     * preenche form se edit
     */
    private loadEntry() {
        if (this.currentAction === 'edit') {
            this.route.paramMap.pipe(
                switchMap(params => this.entryService.getById(+params.get('id')))
            ).subscribe(
                (entry) => {
                    this.entry = entry;
                    this.entryForm.patchValue(entry);
                },
                (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
            );
        }
    }

    /**
     * configura title page após carregamento
     */
    private setPageTitle() {
        if (this.currentAction === 'new') {
            this.pageTitle = 'Cadastro de Novo Lançamento';
        } else {
            const entryName = this.entry.name || '';
            this.pageTitle = 'Editando Lançamento: ' + entryName;
        }
    }

    /**
     * criar categoria
     */
    private createEntry() {
        const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

        this.entryService.create(entry)
            .subscribe(
                entry => this.actionsForSucccess(entry),
                error => this.actionsForError(error)
            );
    }

    /**
     * editar categoria
     */
    private updateEntry() {
        const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

        this.entryService.update(entry)
            .subscribe(
                entry => this.actionsForSucccess(entry),
                error => this.actionsForError(error)
            );
    }

    /**
     * ação de sucesso
     */
    private actionsForSucccess(entry: Entry) {
        toastr.success('Categoria criado com sucesso');

        /**
         * recarrega component
         */
        this.router.navigateByUrl('entries', {skipLocationChange: true})
            .then(() => {
                this.router.navigate(['entries', entry.id, 'edit']);
            });
    }

    /**
     * ação de erro
     */
    private actionsForError(error) {
        toastr.error('Ocorreu um erro ao processar a asua solicitação');

        this.submittingForm = false;

        if (error.status === 422) {
            this.serverErrorMessages = JSON.parse(error._body).errors;
        } else {
            this.serverErrorMessages = ['Falha na comunicação com o servidor.'];
        }
    }
}
