import {
    describe,
    test,
    expect
} from '@jest/globals'
import Routes from '../../src/routes.js'
import fs from 'fs'
import {jest} from '@jest/globals'
import FileHelper from '../../src/file-Helper.js'

describe('#FileHelper', ()=> {
    describe('#getFileStatus', ()=>{
        test('it should return files statuses in correct format', async()=>{
            const statMock = 
                {
                    size: 188188,
                    birthtime: '2021-09-03T20:56:28.443Z',
                    owner: 'mathsena',
                    file: 'file.png'

                }

            const mockUser = 'mathsena'
            process.env.USER = mockUser
            const filename = 'file.png'

            jest.spyOn(fs.promises, fs.promises.readdir.name)
            .mockResolvedValue([filename])

            jest.spyOn(fs.promises, fs.promises.stat.name)
            .mockResolvedValue(statMock)

            const result = await FileHelper.getFilesStatus("/tmp")

            const expectResult = [
                {
                size: "188 kB",
                lastModified: statMock.birthtime,
                owner: mockUser,
                file: filename
                }
            ]

            expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
            expect(result).toMatchObject(expectResult)
        })
    })
})