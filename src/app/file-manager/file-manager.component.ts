import { Component, OnInit, ViewChildren, Renderer, ElementRef,
    HostListener, AfterViewChecked } from '@angular/core';
import { FileService } from '../core/services/file.service';
import { Observable } from 'rxjs';
import { FileElement } from '../core/interfaces/element';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})

export class FileManagerComponent implements OnInit, AfterViewChecked {

    public fileElements: Observable<FileElement[]>;
    public canNavigateUp = false;
    public currentRoot: FileElement;
    public currentPath: string;
    public searchedName: string;
    public selectedELements = {};

    @ViewChildren('divConteiner') divConteiner;
    public index = 0;
    public arrElements = [];

    constructor(private fileService: FileService,
        private renderer: Renderer) { }

    ngOnInit() {
        this.updateFileElementArray();
    }

    ngAfterViewChecked() {
        this.arrElements = this.divConteiner.toArray();

      }

    updateFileElementArray() {
        this.fileElements = this.fileService.itemsInFolder(this.currentRoot ? this.currentRoot.name.toLowerCase() : 'root');
    }

    navigateToFolder(element: FileElement) {
        this.currentRoot = element;
        this.updateFileElementArray();
        this.currentPath = this.currentRoot.path;
        this.canNavigateUp = true;
        this.index = 0;
    }

    navigateToBack() {
        this.currentPath = this.popFromPath(this.currentPath);
        const pathArr = this.currentPath.split('/');
        const parentName = pathArr[pathArr.length - 1];
        if (this.currentPath === '') {
            this.canNavigateUp = false;
            this.fileElements = this.fileService.itemsInFolder('root');
        } else {
            this.fileElements = this.fileService.itemsInFolder(parentName.toLowerCase());
        }
        this.index = 0;

    }

    popFromPath(path: string) {
        let p = path ? path : '';
        const split = p.split('/');
        split.splice(split.length - 1, 1);
        p = split.join('/');
        return p;
    }

    searchForFiles() {
        this.fileElements = this.fileService.searchFiles(this.searchedName);
    }

    sortByName() {
        this.fileElements = this.fileService.sortName();
    }
    sortBySize() {
        this.fileElements = this.fileService.sortSize();
    }
    sortByModificationDate() {
        this.fileElements = this.fileService.sortModifiedDate();
    }

    sortByNameReverce() {
        this.fileElements = this.fileService.sortNameReverce();
    }
    sortBySizeReverce() {
        this.fileElements = this.fileService.sortSizeReverce();
    }
    sortByModificationDateReverce() {
        this.fileElements = this.fileService.sortModifiedDateReverce();
    }


  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 38) {
        if (this.index >= this.arrElements.length) {
            this.index--;
        }

        if (this.index > 0) {
            this.removeBorderStyle(this.index);
            this.index--;
            if (this.index < 0) {
                console.log('poqr e 0-ic');
            } else {
                this.setBorderStyle(this.index);
            }
        }
    }

    if (event.keyCode === 40) {
        if (this.index === 0) {
        this.setBorderStyle(0);
        this.index++;

        } else if (this.index > 0 && this.index < this.arrElements.length) {
            this.removeBorderStyle(this.index - 1);
            this.setBorderStyle(this.index);
            this.index++;
        }
    }
  }

   setBorderStyle(index) {
        const element = this.arrElements[index].nativeElement;
        this.renderer.setElementStyle(element,  'border', '1px solid blue ');

   }
   removeBorderStyle(index) {

    const element = this.arrElements[index].nativeElement;
    this.renderer.setElementStyle(element, 'border', 'none');
   }
}
