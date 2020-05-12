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


/**
 * Request Handler: GET, POST
 */
public class HttpHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

  private static final AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
  private static final DynamoDBMapper dynamoDB = new DynamoDBMapper(client);

  @Override
  public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request,
                                                    Context context) {
    return null;
  }

  /**
   *
   * @param request {@link APIGatewayProxyRequestEvent}(request) from the API Gateway
   * @param context 不知道
   * @return  {@link APIGatewayProxyResponseEvent}(response) of the API Gateway
   */
  public APIGatewayProxyResponseEvent handleGetAllRequest(APIGatewayProxyRequestEvent request,
                                                          Context context) {
    Map<String, String> headers = new HashMap<>();
    headers.put("Content-Type", "text/plain");
    try {
      List<Status> list = dynamoDB.scan(Status.class, new DynamoDBScanExpression());
      String body = new ObjectMapper().writeValueAsString(list);
      headers.put("Content-Type", "text/json");
      return new APIGatewayProxyResponseEvent()
          .withHeaders(headers)
          .withStatusCode(200)
          .withBody(body);
    }
    catch (JsonProcessingException e) {
      return new APIGatewayProxyResponseEvent()
          .withHeaders(headers)
          .withStatusCode(400)
          .withBody("JSON ERROR");
    }
    catch (Exception e) {
      e.printStackTrace();
      return new APIGatewayProxyResponseEvent()
          .withHeaders(headers)
          .withStatusCode(400)
          .withBody("FAIL");
    }
  }

  /**
   *
   * @param request {@link APIGatewayProxyRequestEvent}(request) from the API Gateway
   * @param context 不知道
   * @return  {@link APIGatewayProxyResponseEvent}(response) of the API Gateway
   */
  public APIGatewayProxyResponseEvent handleCreateRequest(APIGatewayProxyRequestEvent request,
                                                          Context context) {
    Map<String, String> headers = new HashMap<>();
    headers.put("Content-Type", "text/plain");
    try {
      String payload = request.getBody();
      ObjectMapper objectMapper = new ObjectMapper();
      Status item = objectMapper.readValue(payload, Status.class);
      dynamoDB.save(item);
      return new APIGatewayProxyResponseEvent()
          .withHeaders(headers)
          .withStatusCode(201)
          .withBody("201: CREATED");
    }
    catch (Exception e) {
      e.printStackTrace();
      return new APIGatewayProxyResponseEvent()
          .withHeaders(headers)
          .withStatusCode(400)
          .withBody("FAIL to CREATE");
    }
  }
}
