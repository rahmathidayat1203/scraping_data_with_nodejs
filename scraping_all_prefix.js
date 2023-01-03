const axios = require('axios');
const cheerio = require('cheerio');
const j2cp = require("json2csv").Parser
const fs = require("fs")

const Scraping = async () =>{
    console.log("currently scraping data please wait");
    console.log("this will take a few moments");
    const dataList = []
    const prefixList=[]
    const prefixlinkList = []
    try {
        const {data} = await axios.get(
            'https://www.nesabamedia.com/docs/kb/prefix-a-f/'
        )
        const $ = cheerio.load(data)
        const pl = $(".row > .col-lg-6 > .media > .media-body")
        pl.each(function(){
            let prefix = $(this).find("a").attr("href")
            prefixList.push(prefix)
        })

        for (let i = 0; i < prefixList.length; i++) {
            const reqPref = [
                axios.get(prefixList[i])
            ]
            const {data} = await Promise.any(reqPref)
            const $ = cheerio.load(data)
            const pll = $('.details_cont > ul > li')
            pll.each(function(){
                const prl = $(this).find("a").attr("href")
                prefixlinkList.push(prl)
            })
        }
        for (let i = 0; i< prefixlinkList.length; i++) {
            const reqpll = [
                axios.get(prefixlinkList[i])
            ]
            const {data} = await Promise.any(reqpll)
            const $ = cheerio.load(data)
            const p = $("#post")
            p.each(function(){
                title = $(this).find("h1").text()
                description = $(this).find("div").find("p").text().replace(/\s+/g," ").trim()
                dataList.push({title,description})
            })
        }
        console.log(dataList);
        const jsoContent = JSON.stringify(dataList)
        fs.writeFileSync("./scraping.json",jsoContent,"utf8",function(err){
            if(err){
                return console.log(err);
            }
            console.log("The File Was Created !");
        })
    } catch (error) {
        throw err
    }
}

Scraping()