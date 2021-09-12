import Busboy from 'busboy'

export default class UploadHeandler{
    constructor({io, socketId}){

    }
    onFile(fieldname, file, filename){

    }

    registerEvents(headers, onFinish){
        const busboy = new Busboy({headers})
        busboy.on("file", this.onFile.bind(this))
        busboy.on("finish", onFinish)
        
        return busboy 

    }
}