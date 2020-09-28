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
        let finalItems = [];
        for (item of links) {
            let { title, link } = item;
            try {
                getHTML(link).then(secondaryHtml => {
                    try {
                        let url = ('' + secondaryHtml).split('https://click.linksynergy.com/deeplink?id=')[1].split('"')[0];
                        url = 'https://click.linksynergy.com/deeplink?id=' + url;
                        //console.log(url);
                        finalItems.push({ title: title, link: url });
                        //opn(url);
                        if (finalItems.length === 14) {
                            //console.log(finalItems);
                            resolve(finalItems);
                        }
                    }
                    catch (ex) {
                        finalItems.push({ title: title, link: link });
                        console.log('Link==============>', link);
                        if (finalItems.length === 14) {
                            resolve(finalItems);
                        }
                    }
                });

            } catch (error) {
                console.log()
                console.log('Exception');
            }
        }
    });
}

function getPageHTML(urls) {
    let code = '';
    for (urlObj of urls) {
        let item = `
					<tr>
						<td> ${urlObj.title} </td>
						<td><a href="${urlObj.link}" target="_blank">Link</a> </td>
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
						padding: 10px;
						border: 1px solid black;
					}
					table {
						border: 2px solid black;
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
				<button onclick="_open()">Open All</button><br><br>
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