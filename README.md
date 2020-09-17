# freshercooker-dot-in-web-scraper
Uses cheerio to webscrape freshercooker.in for udemy links instead of manually following links.

About:
1. The page scans freshercooker.in for links to udemy courses. 
2. These links redirect to pages within freshercooker domain. 
3. These second pages finally contain the links to free udemy courses freshercooker uploads daily.
4. This projects makes this process easy by fetching all the links on second page directly using web scraping.

Instructions to use: 
1. The project uses express to provide HTML interface so that users can open all the links at once.
2. By default, '/' route loads links for courses on page 1.
3. The user can pass query argument page to go to a specific page number.
eg : '/?page=2' gives links on page 2 and so on.
4. Open All button on the top of the page opens all links in separate Tabs. 


Note : Make sure your browser allows multiple pages to be opened at once. If not allowed, only the first page in the list opens.
