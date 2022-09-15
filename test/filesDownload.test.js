const path = require('path')
const fs = require('fs')
const expectChai = require('chai').expect;
const data = require('../utils/helper.js');
const waitForFileExists = require('../utils/helper.js')
const axios = require('axios')
const xlsxFile = require('read-excel-file/node')

describe('Should download file from https://the-internet.herokuapp.com/download', () => {
    beforeEach(async () => {
        await browser.url(`https://the-internet.herokuapp.com/download`);
    })
    let base = 'https://the-internet.herokuapp.com/'
    xit('should check for broken links on the page', async () => {
        let links = $$('div.example a')
        let hrefs = await links.map(link => link.getAttribute('href'))
        console.log(await hrefs.length)
        await hrefs.forEach(el => expectChai(el).to.contain('download/'))
        for(let url of hrefs) {
            try {
                const response = await axios.get(base + url)
                console.log(await response.status)
                expectChai(await response.status).to.be.below(400)
            } catch(e) {
                console.log(e)
            }
        }
    })
    it('should open the page and click on some-file.txt download link', async () => {
        if(await $('*=some-file.txt').isExisting()) {
            let link = await $('*=some-file.txt');
            await link.click();
            await browser.keys('Enter')
            const downloadHref = await link.getAttribute('href');
            const splitPath = downloadHref.split('/')
            const fileName = splitPath.splice(-1)[0]
            const filePath = path.join(global.downloadDir, fileName)
            await browser.call(function (){
                return waitForFileExists(filePath, 60000)
              });
            const fileContents = fs.readFileSync(filePath, 'utf-8')
            console.log(fileContents)
            expectChai(fileContents).to.include('asdf')
        } else {
            return 'no such file'
        }
    });
    it('should open the page and click on sample.pdf download link', async function() {
        if(await $('*=sample.pdf').isExisting()) {
            let link = await $('*=sample.pdf')
            await link.click();
            await browser.keys('Enter')
            const downloadHref = await link.getAttribute('href');
            const splitPath = downloadHref.split('/')
            const fileName = splitPath.splice(-1)[0]
            const filePath = path.join(global.downloadDir, fileName)    
            await browser.call(function (){
                return waitForFileExists(filePath, 60000)
              });
            let text = await data(filePath)
            console.log(await text)
            expectChai(await text).to.include('PDF Test File')
        } else {
            return 'no such file'
        }
    })
    it('should open the page and click on first .xlsx download link', async () => {
        let link = await $('*=.xlsx')
        await link.click();
        await browser.keys('Enter')
        const downloadHref = await link.getAttribute('href');
        const splitPath = downloadHref.split('/')
        const fileName = splitPath.splice(-1)[0]
        const filePath = path.join(global.downloadDir, fileName)
        await browser.call(function (){
            return waitForFileExists(filePath, 60000)
          });
        let text = await xlsxFile(filePath)
        console.table(await text)
        expectChai(await text).to.be.an('array')
    })
});