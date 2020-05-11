package com.yimeng.li;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.util.Map;

/**
 * Hello World test
 */
public class Handler implements RequestHandler<Map<String,String>, String> {
  @Override
  public String handleRequest(Map<String,String> event, Context context)
  {
    LambdaLogger logger = context.getLogger();
    String response = "李一萌 [200] OK";
    logger.log("Name: 李一萌 " );
    return response;
  }
}