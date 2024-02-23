import base64
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.http import HttpResponse
import requests as req
import json
from datetime import datetime, timedelta,date
import base64
from django.views.decorators.csrf import csrf_protect


# Create your views here.
def getAccessToken():
    clientId = "AWmyihi1ip94nQebSLHuF1f8Lw18KL8-HLQX32NgICo4ZFQepQwIN195664eoEUWACxjtMy5C8Jq2G9W"
    appSecret = "EAOQzJCPIWcT5uiBiyWSluRjC-ymxrVnVEO9W3LK-eTxYkqxpiUhgCS7TzrGIYYPTiLSWVKKIwiAQv3o"
    url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"
    secret = clientId + ":" + appSecret
    asciistr=secret.encode('ascii')
    base64bytes = base64.b64encode(asciistr)
    base64str=base64bytes.decode('ascii')
    headers={'Authorization':f"Basic {base64str}",}
    response=req.post(url,data= "grant_type=client_credentials",headers=headers)
    data=response.json()
    return data['access_token']
def updatePayment(request):
    data=json.loads(request.body)
    res=capturePayment(data)
    api_key, key = APIKey.objects.create_key(name="my-remote-service")
    today = date.today()
    expiry  = today + timedelta(days=30)
    transcation = Transactions(email = request.user.email,date=today,amount=data['amt'],expiry=expiry,userid=request.user.id,api_key=api_key,package=data['package'],tokens=10000)
    transcation.save()
    return HttpResponse(json.dumps({'api_key':key}))
def capturePayment(data):
    orderID = data['orderID']
    token=getAccessToken()
    token=f'Bearer {token}'
    print(token)
    url = f'https://api-m.sandbox.paypal.com/v2/checkout/orders/{orderID}/capture'
    print(url)
    headers={'Authorization': token,'Content-Type': 'application/json'}
    response = req.post(url=url,headers=headers)
    return response


def createOrder(request):
    data=json.loads(request.body)
    amt=data['amt']
    token=getAccessToken()
    url = "https://api-m.sandbox.paypal.com/v2/checkout/orders"
    token=f'Bearer {token}'
    headers = {'Authorization': token,'Content-Type': 'application/json'}
    payload={'intent' : 'CAPTURE','purchase_units': [{'amount': {'currency_code': 'USD','value': amt,},},]}
    response = req.post(url=url,json=payload, headers=headers)
    print(response.json())
    return HttpResponse(response)
def bsc(request):
    return render(request, 'bscCheckout.html')
def dev(request):
    return render(request, 'devCheckout.html')
def bs(request):
    return render(request,'bsCheckout.html')