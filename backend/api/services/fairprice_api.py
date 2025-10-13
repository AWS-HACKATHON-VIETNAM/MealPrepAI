from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
from pandas.core.tools.numeric import to_numeric


def search_grocery_items(query):
    """
    Search for grocery items on NTUC FairPrice

    Args:
        query (str): Search query for grocery items

    Returns:
        list: List of grocery items with price and measurement info
    """
    if not query:
        return []

    # a function to generate the search-query URL
    def generate_url(base_url, keywords):
        query_url = base_url
        cleaned_keywords = keywords.replace(' ', '%20')
        query_url = query_url + cleaned_keywords

        return query_url

    try:
        url = "https://www.fairprice.com.sg/search?query="
        headers = {'User-Agent': 'Mozilla/5.0'}
        req = Request(generate_url(url, query), headers=headers)
        page = urlopen(req)
        html = page.read().decode("utf-8")
    except Exception as exc:
        raise Exception(f"Failed to fetch FairPrice results: {exc}") from exc

    soup = BeautifulSoup(html, "html.parser")

    matches = soup.select('div[class*="product-container"]')

    # initialize the array to be returned
    result = []

    for elem in matches:
        anchor_elements = elem.findChildren("a", recursive=False)

        for match in anchor_elements:
            """
                Step 1: Find the name of the food product
            """
            # the image of the food product contain a 'title' attribute
            #	that has the name of the food product
            image = match.findChildren("img")
            if not image:
                continue
            link_to_product = match.attrs.get('href')
            if not link_to_product:
                continue

            """
                Step 2: Find the price of the food product

                    THE ISSUE OF MULTIPLE PRICES:
                    Sometimes the product may be on discount,
                        so 2 or more prices will be shown.

                    To deal with this, we just return the lowest of
                        all the prices; with the assumption that the lowest
                        price is the discount price offered to the customer.
            """
            # the span elements of the food product
            # 	contain its price
            span_list = match.findChildren("span")
            price_list = []

            for span in span_list:
                # check that the string contained inside the span element is referring to the
                # 	price of the food item (and not a button like "add to cart")
                if ("$" in span.text):
                    cleaned_price = (span.text).replace('$', '').strip()
                    try:
                        price_list.append(float(to_numeric(cleaned_price)))
                    except (TypeError, ValueError):
                        continue

            if not price_list:
                continue

            """
                Step 3: Find the weight/volume of the food product
            """
            units = [
                'kg', 'KG',
                'g', 'G',
                'ml', 'ML',
                'l', 'L'
            ]

            measurement = ""
            for span in span_list:
                text = span.text.strip()
                if any(x in text for x in units) and len(text) <= 15:
                    measurement = text
                    break

            """
                Step 4: Add the title, price, measurement and link to the food product to the result object
            """
            result.append({
                'title': image[0].attrs.get('title', '').strip(),
                'price': min(price_list),
                'measurement': measurement,
                'link': "https://www.fairprice.com.sg" + link_to_product,
                'supermarket': 'ntuc'
            })

    return result
