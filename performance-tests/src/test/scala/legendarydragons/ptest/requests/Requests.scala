package legendarydragons.ptest.requests

import scala.concurrent.duration._
import io.gatling.core.Predef.{jsonPath, regex, _}
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

  val connectToWebsocket = ws("Connect to WebSocket")
    .connect("wss://3ghgk1q3mf.execute-api.us-east-1.amazonaws.com/Prod?token=${token}")

  val checkGetInventoryReply = ws.checkTextMessage("Get Inventory Check")
    .check(
      regex("GET_INVENTORY_RESULT"),
      jsonPath("$.data.inventory_id").saveAs("inventoryId"),
    )

  val getInventory = ws("getInventory")
    .sendText("""{"action": "getInventoryReq"}""")
    .await(25)(checkGetInventoryReply)

  val checkAddCardToInventoryReply = ws.checkTextMessage("Add Card To Inventory Check")
    .check(
      regex("INSERT_INVENTORY_CARD_RESULT"),
      jsonPath("$.data.card_id").saveAs("inventoryCardId"),
    )

  val addCardToInventory = ws("addCardToInventory")
    .sendText(
      """
        |{"action": "addCardToInventoryReq","inventory_id": "${inventoryId}","inventory_card":
        |{"oracle_id" : "${rid3}","card_name" : "${rid2}","colors" : ["R"],"prices": {"usd":"0.27"},"rarity" :
        |"meta","quality" : "uncommon", "deck_location" : "side","scryfall_id" : "${rid4}"}}
        |""".stripMargin
    )
    .await(15)(checkAddCardToInventoryReply)

  val checkRemoveCardFromInventoryReply = ws.checkTextMessage("Remove Card From Inventory Check")
    .check(
      regex("REMOVE_INVENTORY_CARD_RESULT"),
    )

  val removeCardFromInventory = ws("removeCardFromInventoryReq")
    .sendText(
      """{"action": "removeCardFromInventoryReq", "inventory_id": "${inventoryId}",
        | "inventory_card_id": "${inventoryCardId}" }""".stripMargin)
    .await(25)(checkRemoveCardFromInventoryReply)
}
