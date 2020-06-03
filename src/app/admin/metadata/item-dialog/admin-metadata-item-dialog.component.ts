import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { filter, finalize, mergeMap, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';
import { MatDialogRef } from '@angular/material/dialog';

import { AdminMetadataService } from '../admin-metadata.service';
import { ConfirmDialogService } from 'src/app/ui-helper/confirm-dialog.service';
import Metadata from '../metadata';
import { SnackBarService } from 'src/app/ui-helper/snack-bar.service';

@Component({
  selector: 'app-admin-metadata-item-dialog',
  templateUrl: './admin-metadata-item-dialog.component.html',
  styleUrls: ['./admin-metadata-item-dialog.component.scss']
})
export class AdminMetadataItemDialogComponent implements OnDestroy, OnInit {

  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  EDITOR_OPTIONS: JsonEditorOptions = new JsonEditorOptions();
  item: Metadata;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  SEPARATOR_KEY_CODES = [COMMA, ENTER];
  metadataForm: FormGroup;
  private unsubscribeAll$: Subject<void> = new Subject();

  constructor(
    private readonly confirmDialog: ConfirmDialogService,
    private readonly dialog: MatDialogRef<AdminMetadataItemDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly service: AdminMetadataService,
    private readonly snackBar: SnackBarService
  ) {
    Object.assign(this.EDITOR_OPTIONS, {
      mode: 'code',
      history: false,
      mainMenuBar: false,
      navigationBar: false,
      statusBar: false,
      onChange() { },
      onChangeText() { },
      onValidationError: (errors) =>
        this.metadataForm.get('data').setErrors(errors?.length ? { invalidJson: true } : null)
    });

    this.metadataForm = this.fb.group({
      type: [''],
      uuid: [''],
      data: ['', [Validators.required]]
    });

    this.loading$
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((loading) => this.metadataForm[loading ? 'disable' : 'enable']());
  }

  ngOnDestroy() {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  ngOnInit() {
    if (this.isNewMetadata) {
      this.metadataForm.get('type').setValidators([Validators.required]);
      this.metadataForm.get('uuid').setValidators([Validators.required]);
    }
    this.metadataForm.patchValue(this.item);
  }

  deleteItem() {
    this.confirmDialog.confirm('삭제하시겠습니까?')
      .pipe(filter((result) => !!result))
      .subscribe(() => {
        this.loading$.next(true);
        this.service.deleteItem(this.item.type, this.item.uuid)
          .pipe(
            finalize(() => this.loading$.next(false)),
            mergeMap(({ data: { deleted } }) => deleted ? of(true) : throwError(false)),
            takeUntil(this.unsubscribeAll$)
          )
          .subscribe(
            () => {
              this.snackBar.show('삭제하였습니다.');
              this.dialog.close(true);
            },
            () => this.snackBar.show('삭제할 수 없습니다.')
          );
      });
  }

  get isNewMetadata() {
    return !this.item.type || !this.item.uuid;
  }

  onSubmit() {
    if (this.metadataForm.invalid) {
      return;
    }

    const { type, uuid } = this.metadataForm.value;
    const data: any = this.editor.get();

    const observable = this.isNewMetadata ?
      this.service.postItem({ type, uuid, data }) :
      this.service.putItem(this.item.type, this.item.uuid, { data } as Metadata);

    this.loading$.next(true);
    observable
      .pipe(
        finalize(() => this.loading$.next(false)),
        takeUntil(this.unsubscribeAll$)
      )
      .subscribe(
        () => {
          this.snackBar.show('저장하였습니다.');
          this.dialog.close(true);
        },
        () => this.snackBar.show('저장할 수 없습니다.')
      );
  }

}
