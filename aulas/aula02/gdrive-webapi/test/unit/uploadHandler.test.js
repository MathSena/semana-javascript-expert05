import {
    describe,
    test,
    expect
} from '@jest/globals'
import Routes from '../../../../aula02/gdrive-webapi/src/routes.js'
import {jest} from '@jest/globals'
import UploadHeandler from '../../../../aula02/gdrive-webapi/src/uploadHandler.js'
import TestUtil from '../_util/testeUtil.js'


describe('#UploadHandler test suite', ()=> {
    const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) =>{}
    }
    describe('#registerEvents', ()=>{
        test('should call onFile and onFinish functions on Busboy instance', ()=>{
            const uploadHandler = new UploadHeandler({
                io: ioObj,
                socketId: '01'
            })

            jest.spyOn(uploadHandler, uploadHandler.onFile.name)
            .mockResolvedValue()


            const headers = {
                'content-type': 'multipart/form-data; boundary='

            }

            const onFinish = jest.fn()
            const busboyInstace = uploadHandler.registerEvents(headers, onFinish)

            const fileStream = TestUtil.generateReadableStream(['chunk', 'of', 'data'])
            busboyInstace.emit('file', 'fieldname', fileStream, 'filename.txt')

            busboyInstace.listeners("finish")[0].call() 
            expect(uploadHandler.onFile).toHaveBeenCalled()
            expect(onFinish).toHaveBeenCalled()
            

        })

    })
    

 
})