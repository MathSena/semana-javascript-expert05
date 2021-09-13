import {
    describe,
    test,
    expect,
    beforeAll,
    afterAll,
} from '@jest/globals'
import Routes from '../../src/routes.js'
import FormData from 'form-data'
import fs from 'fs'
import {jest} from '@jest/globals'
import TestUtil from '../_util/testeUtil.js'
import FileHelper from '../../src/file-Helper.js'
import { logger } from '../../src/logger.js'
import {tmpdir} from 'os'
import {join} from 'path'

describe('#Routes Integration Teste', ()=> {
    let defaultDownloadsFolder = ''
    beforeAll(async() =>{
        defaultDownloadsFolder = await fs.promises.mkdtemp(join(tmpdir(), 'downloads-'))
    })
    afterAll(async()=>{
        await fs.promises.rm(defaultDownloadsFolder, { recursive: true })
    })

    beforeEach(()=>{
         jest.setTimeout(60000);
        jest.spyOn(logger, 'info')
        .mockImplementation()
    })

    describe('#getFileStatus', ()=>{
        const ioObj = {
            to: (id) => ioObj,
            emit: (event, message) =>{}
        }




        test('should upload file to the folder', async () => {
            const filename = 'amyteste.jpeg'
            const fileStream = fs.createReadStream(`./test/integration/mocks/${filename}`)
            const response = TestUtil.generateWritableStream(() => { })

            const form = new FormData()
            form.append('photo', fileStream)


            const defaultParams = {
                request: Object.assign(form, {
                    headers: form.getHeaders(),
                    method: 'POST',
                    url: '?socketId=10'
                }),
                response: Object.assign(response, {
                    setHeader: jest.fn(),
                    writeHead: jest.fn(),
                    end: jest.fn()
                }),
                values:() => Object.values(defaultParams)
        
            }

            const routes = new Routes(defaultDownloadsFolder)
            routes.setSocketInstance(ioObj)
            const dirBeforeRan = await fs.promises.readdir(defaultDownloadsFolder)
            expect(dirBeforeRan).toEqual([])
            await routes.handler(...defaultParams.values())
            const dirAfterRan = await fs.promises.readdir(defaultDownloadsFolder)
            expect(dirAfterRan).toEqual([filename])







        })
    })
})
 