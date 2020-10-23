const https = require('https');
const cheerio = require('cheerio');

function getHTML(url) {
    let html = '';
    return new Promise((resolve) => {
        https.get(url, res => {
            res.on('data', rawData => {
                html += rawData;
            });
            res.on('end', () => {
                resolve(html);
            });
        });
    });
}

async function getUdemyLinks(pageNo = 1) {
    return new Promise(async resolve => {
        let pageSuffix = '';
        if (pageNo != 1) pageSuffix = `/page/${pageNo}`;
        let mainHTML = await getHTML(`https://www.freshercooker.in${pageSuffix}`);
        const $ = cheerio.load(mainHTML);

        let found = $('h3.entry-title.td-module-title>a').toArray();

        let links = [];
        let setFound = new Set();

        for (item of found) {
            if (item.attribs && item.attribs.href) {
                let title = item.attribs.title;
                let link = item.attribs.href;
                if (!setFound.has(link)) {
                    setFound.add(link);
                    links.push({ title: title, link: link });
                }
            }
        }
        console.log(links);

        links = Array.from(new Set(links));
        console.log(links);

        const coursePromises = [];
        for (item of links) {
            let { title, link } = item;
            let promise = new Promise((resolve, reject) => {
                getHTML(link).then(secondaryHtml => {
                    try {
                        let url = ('' + secondaryHtml).split('https://click.linksynergy.com/deeplink?id=')[1].split('"')[0];
                        url = 'https://click.linksynergy.com/deeplink?id=' + url;
                        //console.log(url);
                        resolve({ title: title, link: url });
                    }
                    catch (ex) {
                        resolve({ title: title, link: link });
                    }
                });
            });
            coursePromises.push(promise);
        }
        //console.log(coursePromises);
        Promise.all(coursePromises).then(result => {
            console.log(result);
            console.log(`${result.length} courses returned...`)
            resolve(result);
        });
    });
}

function getPageHTML(urls) {
    let code = '';
    for (urlObj of urls) {
        let item = `
					<tr>
						<td> ${urlObj.title} </td>
						<td class="link"><a href="${urlObj.link}" target="_blank">Link</a> </td>
					</tr>
		`;

        code += item;
    }
    let response = `
		<html>
			<head>
				<title>Udemy Links</title>
				<style>
					th,td {
						padding: 15px;
                        border: 1px solid black;
                    }
                    th{
                        padding: 20px;
                        background-color: lightgray;
                    }
					table {
                        border-spacing: 0px;
                        border: 1px solid black;
                    }
                    .link{
                        width: 5rem;
                        text-align:center;
                    }
                    a{
                        text-decoration: none;
                    }
                    .btnAll{
                        background-color: black;
                        color: white;
                        padding: 10px;
                        margin: 0px;
                        margin-left: 10px;
                        transition: all 0.3s ease;
                    }
                    .btnAll:hover{
                        background-color: white;
                        color: black;
                    }
                    .btnContainer{
                        padding: 10px;
                        margin: 0px;
                        border-spacing: 0px;
                    }
				</style>
				<script>
					function _open(){
						let obj = ${JSON.stringify(urls)}
						for(item of obj){
							window.open(item.link);
						}
					}
				</script>
			</head>
            <body>
                <div class="btnContainer">
                Make sure to allow opening multiple links
				<button class="btnAll" onclick="_open()">Open All</button><br><br>
                </div>
                <table>
					<tr>
						<th>Course Name</th>
						<th>Link</th>
					</tr>
					${code}
				</table>
			</body>
		</html>
	`;
    //console.log(response);
    return response;
}

module.exports.udemy = getUdemyLinks;
module.exports.pageHTML = getPageHTML;