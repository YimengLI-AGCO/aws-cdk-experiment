
import boto3
import json
import os
import uuid

def handler(event, context):
  dynamodb = boto3.resource("dynamodb", region_name='us-east-1')
  table = dynamodb.Table(os.environ['TABLE_NAME'])

  message = '{} Hello {}!'.format(os.environ['TABLE_NAME'], "yimeng")
  print(message)

  str_id = str(uuid.uuid1())
  response = table.put_item(
    Item={
      'id': str(str_id),
      'yimeng-test': 'YIMENG - {}'.format(str_id)
    }
  )

  return {
    'message': message
  }
