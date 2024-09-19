from pymongo import MongoClient
from bson.objectid import ObjectId
import certifi

client = MongoClient("mongodb+srv://myAtlasDBUser:Sai123@myatlasclusteredu.qifwasp.mongodb.net/python?retryWrites=true&w=majority",  tlsCAFile=certifi.where())
db = client.loan_management
loan_collection = db.loans

def get_loan_collection():
    return loan_collection
