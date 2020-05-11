package com.yimeng.li;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import java.util.HashMap;
import java.util.Map;


public class HttpHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

  @Override
  public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request,
                                                    Context context) {
    return null;
  }

  /**
   *
   * @param request
   * @param context
   * @return
   */
  public APIGatewayProxyResponseEvent handleGetAllRequest(APIGatewayProxyRequestEvent request,
                                                          Context context) {
    APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
    response.setBody("works");
    response.setStatusCode(200);
    Map<String, String> headers = new HashMap<>();
    headers.put("Content-Type", "text/plain");
    response.setHeaders(headers);
    return response;
  }
}
