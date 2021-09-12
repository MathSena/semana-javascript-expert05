import {
    describe,
    test,
    expect
} from '@jest/globals'
import Routes from '../../src/routes.js'
import {jest} from '@jest/globals'


describe('#Routes suite test', ()=> {
    const defaultParams = {
        request:{
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            method: '',
            body: {}
        },
        response: {
            setHeader: jest.fn(),
            writeHead: jest.fn(),
            end: jest.fn()
        },
        values:() => Object.values(defaultParams)

    }
    describe('#setSocketInstance', ()=>{
        test('setSocket should store io instance', ()=>{
            const routes = new Routes()
            const ioObj = {
                to: (id) => ioObj,
                emit: (event, message) =>{}
            }
            routes.setSocketInstance(ioObj)
            expect(routes.io).toStrictEqual(ioObj)
        })
    })

    describe('#handler', ()=>{
       

        test('give an inexistent rote it should choose default route', async ()=>{
            const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.request.method = 'inexistent'
            await routes.handler(...params.values())
            expect(params.response.end).toHaveBeenCalledWith('Hello World')
        })


        test('it should set any request with CORS enabled', async ()=>{
            const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.request.method = 'inexistent'
            await routes.handler(...params.values())
            expect(params.response.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')

        })

        test('give method OPTIONS it should choose options route', async ()=>{
            const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.request.method = 'OPTIONS'
            await routes.handler(...params.values())
            expect(params.response.writeHead).toHaveBeenCalledWith(204)
            expect(params.response.end).toHaveBeenCalled()
            
           

        })

        test('give method POST it should choose post route', async ()=>{
            const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.request.method = 'POST'
            jest.spyOn(routes, routes.post.name).mockResolvedValue()
            await routes.handler(...params.values())
            expect(routes.post).toHaveBeenCalled()           
        })

        test('give method GET it should choose get route', async ()=>{
            const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.request.method = 'GET'
            jest.spyOn(routes, routes.get.name).mockResolvedValue()
            await routes.handler(...params.values())
            expect(routes.get).toHaveBeenCalled()   
           
        })
    })

    describe('#get', ()=>{
        test('given method GET it should list all files downloaded', async()=>{
            const routes = new Routes()
            const params = {
                ...defaultParams
            }
            const filesStatusesMock = [
                {
                size: "188 kB",
                lastModified: '2021-09-03T20:56:443Z',
                owner: 'mathsena',
                file: 'file.txt'
                }
            ]
            jest.spyOn(routes.FileHelper, routes.FileHelper.getFilesStatus.name)
                .mockResolvedValue(filesStatusesMock)

            params.request.method = 'GET'
            await routes.handler(...params.values())

            expect(params.response.writeHead).toHaveBeenCalledWith(200)
            expect(params.response.end).toHaveBeenCalledWith(JSON.stringify(filesStatusesMock))
            
        })
    })



})