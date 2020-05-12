
import boto3
import json
import os
import uuid

def handler(event, context):
  print("HELLO PYTHON")
  dynamodb = boto3.resource("dynamodb", region_name='us-east-1')
  table = dynamodb.Table(os.environ['TABLE_NAME'])

  message = os.environ['TABLE_NAME']
  print(message)

  str_id = str(uuid.uuid1())
  response = table.put_item(
    Item = {
      'id': str(str_id),
      'yimeng-test': '[WRITE FROM PYTHON]{}'.format(message)
    }
  )

  return {
    'message': message
  }
