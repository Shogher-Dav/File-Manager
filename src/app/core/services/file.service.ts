import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { FileElement } from '../interfaces/element';

@Injectable({
  providedIn: 'root'
})
export class FileService {

    public element: FileElement[] = [];
    public objFile: FileElement  = {
        name: '',
        path: '',
        parent: '',
        type: '',
        size: null,
        modificationDate: null
    };
    private requestedElement: BehaviorSubject<FileElement[]>;
    public resultElements: FileElement[];


    constructor(private http: HttpClient) {
        this.getJSON().subscribe(data => {
            data.map(res => {
                this.objFile = res;
                const nameFromPath = res.path.split('/');
                this.objFile.name = nameFromPath[nameFromPath.length - 1];
                this.objFile.parent =  nameFromPath[nameFromPath.length - 2] ? nameFromPath[nameFromPath.length - 2] : 'root';
                const newObjFile = Object.assign({}, this.objFile);
                this.element.push(newObjFile);
                this.itemsInFolder('root');
            });
        });
    }

    public getJSON(): Observable<any> {
        return this.http.get('./assets/files.json');
    }


    itemsInFolder(folderName: string) {
        // find items which have given folder as parent
        this.resultElements = this.element.filter(res => res.parent === folderName);
        if (!this.requestedElement) {
          this.requestedElement = new BehaviorSubject(this.resultElements);
        } else {
          this.requestedElement.next(this.resultElements);
        }
        return this.requestedElement.asObservable();
      }

    searchFiles(itemName: string) {
        const startRegexp = new RegExp(`^${itemName}`, 'g');
        const endRegexp = new RegExp(`${itemName}$`, 'g');

        const elementsStartRegexp = this.element.filter((res) =>
        res.name.match(startRegexp));
        // if file started with given strinf didn't found search file that end with given string
        if (Array.isArray(elementsStartRegexp) && elementsStartRegexp.length === 0) {
            const elementsEndRegexp = this.element.filter((res) =>
            res.name.match(endRegexp));
            return new BehaviorSubject(elementsEndRegexp);
        }
        return new BehaviorSubject(elementsStartRegexp);

    }


    sortName() {
        const sortedResult = this.resultElements.sort((a, b) => (a.name > b.name) ? 1 : -1);
        return new BehaviorSubject(sortedResult);
    }
    sortSize() {
        const sortedResult = this.resultElements.sort((a, b) => (a.size > b.size) ? 1 : -1);
        return new BehaviorSubject(sortedResult);
    }
    sortModifiedDate() {
        const sortedResult = this.resultElements.sort((a, b) => (a.modificationDate > b.modificationDate) ? 1 : -1);
        return new BehaviorSubject(sortedResult);
    }

    sortNameReverce() {
        const sortedResult = this.resultElements.sort((a, b) => (a.name < b.name) ? 1 : -1);
        return new BehaviorSubject(sortedResult);
    }
    sortSizeReverce() {
        const sortedResult = this.resultElements.sort((a, b) => (a.size < b.size) ? 1 : -1);
        return new BehaviorSubject(sortedResult);
    }
    sortModifiedDateReverce() {
        const sortedResult = this.resultElements.sort((a, b) => (a.modificationDate < b.modificationDate) ? 1 : -1);
        return new BehaviorSubject(sortedResult);
    }



}
