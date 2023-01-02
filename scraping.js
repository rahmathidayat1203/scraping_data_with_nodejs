const axios = require('axios');
const cheerio = require('cheerio');
const j2cp = require("json2csv").Parser
const fs = require("fs")

const getPostTitles = async () => {
	try {
		const { data } = await axios.get(
			'https://www.nesabamedia.com/docs/kb/prefix-a-f/a'
		);
		const $ = cheerio.load(data);
		const linkList = [];
        const dataList = []
        const a = $('.details_cont > ul > li')
        $(a).each( function () {
            let link = $(this).find('a').attr("href")
            linkList.push(link);
         });

         for (let i = 0;i<linkList.length;i++){
            const req = [
                axios.get(linkList[i])
            ]

            const res = await Promise.any(req)
             const $ = cheerio.load(res.data)
                const ar = $("#post")
                ar.each(function() {
                    title = $(this).find("h1").text()
                    describe = $(this).find("div").find("p").text().replace(/\s+/g," ").trim()
                    dataList.push({title,describe})
                })
         }
         console.log(dataList);
         const jsonContent = JSON.stringify(dataList)
         fs.writeFile("./prefix-A.json", jsonContent, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
	} catch (error) {
		throw error;
	}
};

getPostTitles()