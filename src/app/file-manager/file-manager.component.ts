import { Component, OnInit } from '@angular/core';
import { FileService } from '../core/services/file.service';
import { Observable } from 'rxjs';
import { FileElement } from '../core/interfaces/element';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {

    public fileElements: Observable<FileElement[]>;
    public canNavigateUp = false;
    public currentRoot: FileElement;
    public currentPath: string;
    public searchedName: string;
    constructor(private fileService: FileService) { }

    ngOnInit() {
        this.updateFileElementArray();
    }

    updateFileElementArray() {
        this.fileElements = this.fileService.itemsInFolder(this.currentRoot ? this.currentRoot.name.toLowerCase() : 'root');
    }

    navigateToFolder(element: FileElement) {
        this.currentRoot = element;
        this.updateFileElementArray();
        this.currentPath = this.currentRoot.path;
        this.canNavigateUp = true;
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
}
