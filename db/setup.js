const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

async () => {
  try {
    await client.connect();

    db.createCollection('questions', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["question_id", "product_id", "question_body", "asker_name", "asker_email", "question_helpfulness", "question_reported", "answers"],
          properties: {
            question_id: {
              bsonType: "objectId",
            },
            product_id: {
              bsonType: "objectId",
            },
            question_body: {
              bsonType: "string",
            },
            question_date: {
              bsonType: "date",
            },
            asker_name: {
              bsonType: "string",
            },
            asker_email: {
              bsonType: "string",
            },
            question_helpfulness: {
              bsonType: "int",
            },
            question_reported: {
              bsonType: "bool",
            },
            answers: {
              bsonType: ["array"],
              items : {
                bsonType: "object",
                required: ["answer_id", "answer_body", "answer_date", "answerer_name", "answerer_email", "answer_helpfulness", "answer_reported", "photos"],
                properties: {
                  answer_id: {
                    bsonType: "objectId",
                  },
                  answer_body: {
                    bsonType: "string",
                  },
                  answer_date: {
                    bsonType: "date",
                  },
                  answerer_name: {
                    bsonType: "string",
                  },
                  answerer_email: {
                    bsonType: "string",
                  },
                  answer_helpfulness: {
                    bsonType: "int",
                  },
                  answer_reported: {
                    bsonType: "bool",
                  },
                  photos: {
                    bsonType: ["array"],
                    items: {
                      bsonType: "object",
                      required: ["_id", "url"],
                      properties: {
                        "_id": "objectId",
                        url: "string",
                      },
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  } catch (error) {
  }
}
