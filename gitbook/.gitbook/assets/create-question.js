/**
 *
 * main() will be run when you invoke this action
 *
 * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
 *
 * @return The output of this action, which must be a JSON object.
 *
 */
const Cloudant = require('@cloudant/cloudant');

let cloudant = null;

async function main(params) {
  if (params.id === undefined || params.question === undefined || params.options === undefined) {
      return {
        error: "Not Enough Arguments",
      }
  }

  const reused = cloudant != null;

  var username = params.username;
  var password = params.password;
  if (cloudant == null) {
    cloudant = Cloudant({
      account: username,
      password: password
    });
  }

  var id = params.id;

  const database = cloudant.db.use('questions');

  const docs = (await database.find({
    "selector": {
      "_id": id
    },
    "fields": [
      "_id",
      "question",
      "options"
    ]
  })).docs;

  if (docs.length > 0) {
    return {
      error: "ID already Exists",
    }
  };

  const data = {
    _id: id,
    question: params.question,
    options: params.options,
  }
  const result = await database.insert(data);
  console.log(result.ok);
  if (result.ok) {
    dbcreate = await cloudant.db.create("questions-" + id);
    return {
      ok: true,
      payload: id,
    }
  }
  return {
    error: "Insertion failed",
  };
}

exports.main = main;
