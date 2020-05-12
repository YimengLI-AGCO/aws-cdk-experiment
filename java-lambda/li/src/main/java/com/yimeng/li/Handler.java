package com.yimeng.li;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SQSEvent;
import com.amazonaws.services.lambda.runtime.events.SQSEvent.SQSMessage;


/**
 * Hello World test
 */
public class Handler implements RequestHandler<SQSEvent, String> {
  @Override
  public String handleRequest(SQSEvent sqsEvent, Context context) {

    LambdaLogger logger = context.getLogger();
    String response = "李一萌 [200] OK";

    for (SQSMessage msg : sqsEvent.getRecords()) {
      logger.log(String.format("Queue Message: %s", msg.getBody()));
    }

    logger.log("Name: 李一萌 3" );
    return response;
  }
}
