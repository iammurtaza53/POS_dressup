from flask import Flask,jsonify
import cloudinary
from cloudinary.models import CloudinaryField
from pymongo import MongoClient
from woocommerce import API


app = Flask(__name__, static_url_path='')

cloudinary.config( 
  cloud_name = "dcibfnzgl", 
  api_key = "434339325419487", 
  api_secret = "WJNs0tzlVf_0a4Lj7aJfGEnWiQA" 
)


from pymongo import MongoClient
client = MongoClient(
    'mongodb://localhost:27017/mynew?retryWrites=false')

db = client.dressup



item_collection = db['products']
categories_collection = db['Categories']



wcapi = API(
    url="http://www.dressup-pk.com/", # Your store URL
    consumer_key="ck_900a6dd8ffabc1a89484a0b1b85582d171114c71", # Your consumer key
    consumer_secret="cs_b1d545f21ff1ca69c7fe9ad93da3a92ac0bd919d", # Your consumer secret
    wp_api=True, # Enable the WP REST API integration
    version="wc/v3", # WooCommerce WP REST API version
    timeout=100000
)

path = "D:/Woo_Commerce/POS_dressup/"



def woo_products():
    return wcapi.get('products', params={"per_page": 100}).json()



def woo_orders():
    return wcapi.get('orders/', params={"per_page": 100}).json()


def woo_cat():
    return wcapi.get('products/categories', params={"per_page": 100}).json()


def get_mongo_categoryname():
    list_name_mongo=[]
    for x in item_collection.find():
        list_name_mongo.append(x['itemCategory'])
    return list(set(list_name_mongo))


def get_woo_categoryname():
    list_name_woo = [ sub['name'] for sub in woo_cat()]
    return list_name_woo


def post_and_get_category_id():
    for cat_name in get_mongo_categoryname():
        if cat_name not in get_woo_categoryname():
            data = {"name": cat_name}
            wcapi.post("products/categories", data).json()
        else:
            for i in woo_cat():
                if i['name'] == cat_name:
                    return i['id']



def list_mongo_product_barcode(): 
    list_mongo_prod_barcode=[]
    for x in item_collection.find({},{ "barcode": 1}):
        list_mongo_prod_barcode.append(str(x['barcode']))
    return list_mongo_prod_barcode



def list_of_woo_product_sku():

    list_woocom_prod_sku = [ sub['sku'] for sub in woo_products()]
    return list_woocom_prod_sku


def Current_date():

    from datetime import datetime,timedelta,date
    cur_date=date.today()
    return(cur_date)


def week_ago():
    from datetime import datetime,timedelta,date
    week_ago = Current_date() - timedelta(7)
    return(week_ago)


def recent_products():
    recent_prod=[]
    from datetime import datetime
    for order in woo_orders():
        orders_date = datetime.strptime(order['date_modified'][:-9], '%Y-%m-%d').date() 
        if week_ago() <= orders_date:
            recent_prod.append(order['line_items']) 
    return recent_prod


# def insert_mongo_img_to_woo():
#     images = []
#     data ={}
#     for mongo_barcode in list_mongo_product_barcode():   
#         if mongo_barcode not in list_of_woo_product_sku(): 
#             myquery = {'barcode':int(mongo_barcode)}
#             mongo_products = item_collection.find(myquery) 
#             for mongo_product in mongo_products:
#                 for images in mongo_product['image']:
#                     all_images = str(path+images)
#                     cloud_url = cloudinary.uploader.upload(all_images)
#                     key = 'src'
#                     data[key] = cloud_url['url']
#                     images.append(data)
#                 return images



@app.route('/Sync')
def post_mongo_product_in_woo():
    # import pdb; pdb.set_trace()
    for mongo_barcode in list_mongo_product_barcode():    # getting mongo product barcode one by one 
        if mongo_barcode not in list_of_woo_product_sku():  # if mongo product barcode doesn't match with woo product sku than
            myquery = {'barcode':int(mongo_barcode)} # get whole record of this mongo product barcode 
            mongo_products = item_collection.find(myquery) 
            for mongo_product in mongo_products:# create this mongo record into woo product 
                if 'image' not in mongo_product:
                    data = {
                        "name": mongo_product['itemName'],
    #                         "type": str(mongo_product['type']),
                        "sku": str(mongo_product['barcode']),
                        "regular_price": str(mongo_product['itemRetail']),
                        "sale_price": str(mongo_product['itemWholesale']),
                        "description": mongo_product['itemDesc'],
    #                         ['dimensions']['length']: str(mongo_product['size']),
                        "categories": [
                            {
                                "id": post_and_get_category_id()
                            }
                        ]
                    }
                else:
                    mongo_images = []
                    data ={}
                    for images in mongo_product['image']:
                        all_images = str(path+images)
                        cloud_url = cloudinary.uploader.upload(all_images)
                        key = 'src'
                        data[key] = cloud_url['url']
                        mongo_images.append(data)
                    data = {
                            "name": mongo_product['itemName'],
                            "sku": str(mongo_product['barcode']),
                            "regular_price": str(mongo_product['itemRetail']),
                            "sale_price": str(mongo_product['itemWholesale']),
                            "description": mongo_product['itemDesc'],
                            "categories": [
                                {
                                    "id": post_and_get_category_id()
                                }
                            ],
                            "images": mongo_images
                        }

                print(wcapi.post("products", data).json())
        
        else:  #  if mongo product barcode match with woo product sku than
            myquery = {'barcode':int(mongo_barcode)}   # get whole record of this mongo product barcode if condition matched
            mongo_products = item_collection.find(myquery)
            for mongo_product in mongo_products: # after getting record replace the itemQty of mongo from woo-commerce recent order-product-quantity
#                 print(mongo_product)
                for recent_product in recent_products():
#                     print(recent_product)
                    if int(recent_product[0]['sku']) == mongo_product['barcode']:
                        
                        item_collection.replace_one( 
                            {"barcode": mongo_product['barcode']}, 
                            { 
                                    'barcode':mongo_product['barcode'],
                                    'itemName':mongo_product['itemName'],
                                    'itemDesc':mongo_product['itemDesc'],
                                    'itemQty':recent_product[0]['quantity'],
                                    'itemWholesale':mongo_product['itemWholesale'],
                                    'itemRetail':mongo_product['itemRetail'],
                                    'itemCategory':mongo_product['itemCategory'],
                                    'itemSupplier':mongo_product['itemSupplier'],
                                    'type':mongo_product['type'],
                                    'size':mongo_product['size'],
                                    'code':mongo_product['code']

                                    } 
                            )

    response = {"status": 'Data has been imported Successfully'}
    return jsonify(response)



def update_qty_mongo_to_woo():
#     import pdb; pdb.set_trace()

    for woo_sku in list_of_woo_product_sku():
        if woo_sku in list_mongo_product_barcode():
            myquery = {'barcode':int(woo_sku)}   # get whole record of this mongo product barcode if condition matched
            mongo_products = item_collection.find(myquery)
            for mongo_product in mongo_products:

                for recent_product in recent_products():
                    if int(recent_product[0]['sku']) == mongo_product['barcode']:
                        data = {
                            'manage_stock':True,
                            "stock_quantity":mongo_product['itemQty']
                            }
                        a_id=str(recent_product[0]['product_id'])
                        wcapi.put("products/"+a_id , data).json()







if __name__ == "__main__":
    DEBUG = True
    app.debug = DEBUG
    app.run()