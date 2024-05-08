import axios from 'axios';
import { config } from 'dotenv';
config();

const getOrders = async () => {
    let orders = [];
    let url = `https://${process.env.SHOPIFY_URL}/admin/api/2023-10/orders.json?status=any&limit=250`;
    let count = 0;
    let processedCount = 0;

    while (url && count < 10000) {
        const response = await axios.get(url, {
            headers: {
                'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
            }
        });
        orders = [...orders, ...response.data.orders];
        count += response.data.orders.length;
        processedCount += response.data.orders.length;
        url = getNextPageUrl(response.headers.link);
    }

    const ordersWithInvoice = orders.filter(order => order.tags.includes('Faktura'));

    if (ordersWithInvoice.length === 0) {
        console.log(`Scanned ${processedCount} orders, none met the criteria.`);
      }

    return ordersWithInvoice;
}

const getOrderMetafields = async (orderId) => {
    try {
        const response = await axios.get(`https://${process.env.SHOPIFY_URL}/admin/api/2023-10/orders/${orderId}/metafields.json`, {
            headers: {
                'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
            }
        });
        return response.data.metafields;
    } catch (error) {
        console.error(`Error fetching metafields for order ${orderId}: ${error}`);
        return [];
    }
}

const getNextPageUrl = (linkHeader) => {
    if (!linkHeader) {
        return null;
    }

    const links = linkHeader.split(',').map(linkInfo => {
        const [urlPart, relPart] = linkInfo.split(';');
        const urlMatch = urlPart.match(/<(.*)>/);
        const relMatch = relPart.match(/rel="(.*)"/);

        return {
            url: urlMatch[1],
            rel: relMatch[1]
        }
    })

    const nextLink = links.find(link => link.rel === 'next');

    if (!nextLink) {
        return null;
    }

    return nextLink.url;
}


export { getOrders, getOrderMetafields };