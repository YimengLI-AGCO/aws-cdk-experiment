package com.yimeng.li;

import com.amazonaws.services.dynamodbv2.datamodeling.*;

import java.util.UUID;


@DynamoDBTable(tableName = "HelloCdkStack-QueueRecorderQueueRecorderTableFA770F2B-U8S0KMFBB5BL")
public class QueueRecorder {
  private UUID id;
  private String payload;

  @DynamoDBHashKey(attributeName = "id")
  @DynamoDBAutoGeneratedKey
  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  @DynamoDBAttribute(attributeName="yimeng-test")
  public String getPayload() {
    return payload;
  }

  public void setPayload(String payload) {
    this.payload = payload;
  }
}
