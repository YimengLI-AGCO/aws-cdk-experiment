package com.yimeng.li;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class HttpHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

  private static final AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
  private static final DynamoDBMapper dynamoDB = new DynamoDBMapper(client);

  @Override
  public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request,
                                                    Context context) {
    return null;
  }

  public APIGatewayProxyResponseEvent handleGetAllRequest(APIGatewayProxyRequestEvent request,
                                                          Context context) {
    Map<String, String> headers = new HashMap<>();
    headers.put("Content-Type", "text/plain");
    try {
      List<QueueRecorder> list = dynamoDB.scan(QueueRecorder.class, new DynamoDBScanExpression());
      String body = new ObjectMapper().writeValueAsString(list);
      headers.put("Content-Type", "text/json");
      return new APIGatewayProxyResponseEvent().withHeaders(headers).withStatusCode(200).withBody(body);
    }
    catch (JsonProcessingException e) {
      return new APIGatewayProxyResponseEvent().withHeaders(headers).withStatusCode(400).withBody("JSON ERROR");
    }
    catch (Exception e) {
      e.printStackTrace();
      return new APIGatewayProxyResponseEvent().withHeaders(headers).withStatusCode(400).withBody("FAIL");
    }
  }
}
