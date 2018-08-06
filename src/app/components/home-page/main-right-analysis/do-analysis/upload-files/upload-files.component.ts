import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalDismissReasons, NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FileUploader, FileItem, ParsedResponseHeaders} from "ng2-file-upload";
import {Config} from "../../../../../model/config"
import {FileUploadService} from "../../../../../services/file-upload.service";
import {ResultFileList} from "../../../../../model/resultFileList";


@Component({
    selector: 'app-upload-files',
    templateUrl: './upload-files.component.html',
    styleUrls: ['./upload-files.component.scss'],
})
export class UploadFilesComponent implements OnInit {
    @Output() notify: EventEmitter<number> = new EventEmitter<number>();

    closeResult: string;
    uploadUrl = Config.baseUrl + "file/upload";
    public uploader: FileUploader;
    public myAnalysisId: number;

    constructor(private modalService: NgbModal, private fileUploadService: FileUploadService) {
    }


    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;
    private resultFileList: ResultFileList;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }

    open(content) {
        this.modalService.open(content, {windowClass: "hugeModal"}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    ngOnInit() {
        this.uploader = new FileUploader({
            url: this.uploadUrl,
            isHTML5: true,
            maxFileSize: 1000 * 1000 * 1000,
            allowedMimeType: []
        });
    }

    //request an analysis id for next step to upload files
    getAnalysisId() {
        this.fileUploadService.apply_an_analysis_id().then(
            id => {
                this.myAnalysisId = id;
                console.log("got analysis id: " + this.myAnalysisId);
                this.notify.emit(this.myAnalysisId);
                this.uploader = new FileUploader({
                    url: this.uploadUrl,
                    isHTML5: true,
                    maxFileSize: 1000 * 1000 * 1000,
                    headers: [{name: 'myId', value: String(this.myAnalysisId)}],
                    allowedMimeType: ['text/xml','application/x-gzip']
                    // allowedFileType: [".xml", ".xml.gz"]
                });
                this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
                this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
                this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
                    form.append('myId', this.myAnalysisId);
                };

            }
        );
    }

    //check the files are in server or not
    conformFiles(){
        console.log(this.uploader.queue);
        this.resultFileList = new ResultFileList();
        for (let i=0; i<this.uploader.queue.length; i++){
            let fileItem = this.uploader.queue[i];
            if(fileItem.isSuccess != true || fileItem.isUploaded != true){
                alert("File " + fileItem.file.name + "is not uploaded or not success!")
                return;
            }
            this.resultFileList.fileList.push(fileItem.file.name);
        }
        this.resultFileList.fileListLength = this.uploader.queue.length;
        this.fileUploadService.conform_files(this.resultFileList, this.myAnalysisId).then(
            status=>{console.log(status)}
        )
    }

    onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        console.log(response)
//        let data = JSON.parse(response); //success server response
//         console.log(data)
    }


    onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        console.log(response)
        // let error = JSON.parse(response); //error server response
        // console.log(error)
    }



}
