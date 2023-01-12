package legendarydragons.ptest.requests
import scala.concurrent.duration._
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.http.protocol.HttpProtocolBuilder
import scala.concurrent.duration._

// object are native Scala singletons
object Requests {

    private val contentTypeHeader = Map("Content-Type" -> "application/json;charset=UTF-8")
    
    val visitFrontEnd = http("visitFrontEnd").get("/")

    val registerAccount = http("registerAccount")
    .post("/users/register")
    .headers(contentTypeHeader)
    .body(StringBody("""{"nickname":"${nickname}","email":"${email}","password":"${password}"}""")).asJson

    val loginAccount = http("loginAccount")
    .post("/users/login")
    .headers(contentTypeHeader)
    .body(StringBody("""{"email":"${email}","password":"${password}"}""")).asJson

    val connectToWebsocket = ws("Connect to WebSocket").connect("wss://3ghgk1q3mf.execute-api.us-east-1.amazonaws.com/Prod?token=${token}")

    val connectToWebsocketAndAddCardToInventory = ws("Connect to WebSocket").connect("wss://3ghgk1q3mf.execute-api.us-east-1.amazonaws.com/Prod?token=${token}")
     .onConnected(
      exec(ws("addCardToInventory")
        .sendText("""{  
          "inventory_id": null, 
          "action": "addCardToInventoryReq",
          "inventory_card":   
          { 
              "PK" : "INVENTORY_CARD#${rid1}",
              "SK" : "INVENTORY#1",
              "entity_type" : "INVENTORY_CARD",
              "inventory_id" : "1",
              "created_at" : "2023-01-12",
              "last_modified" : "2023-01-12",
              "card_id" : "${rid2}",
              "oracle_id" : "${rid3}",
              "card_name" : "${rid2}",
              "colors" : {"SS":["R"]},
              "prices": {"usd":"0.27"},
              "rarity" : "meta",
              "quality" : "uncommon",
              "deck_location" : "side",
              "GSI1_PK" : "INVENTORY#1",
              "GSI1_SK" : ""INVENTORY_CARD#${rid1}",
              "scryfall_id" : "${rid4}"
          }
        }""")))


    
    val connectToWebsocketAndGetInventory = ws("Connect to WebSocket").connect("wss://3ghgk1q3mf.execute-api.us-east-1.amazonaws.com/Prod?token=${token}")
    .onConnected(
      exec(ws("addCardToInventory")
          .sendText("""{"action": "getInventoryReq"}""")
            ))
}
