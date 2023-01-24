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
      jsonPath("$.data").saveAs("inventoryCard"),
    )

  val addCardToInventory = ws("addCardToInventory")
    .sendText(
      """
        |{"action": "addCardToInventoryReq","inventory_id": "${inventoryId}","inventory_card":
        |{"oracle_id" : "${rid3}","card_name" : "${rid2}","colors" : ["R"],"prices": {"usd":"0.27"},"rarity" :
        |"meta","quality" : "uncommon", "deck_location" : "","scryfall_id" : "${rid4}", "image_url": "foobar"}}
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

  val checkCreateDeckReply = ws.checkTextMessage("Create Deck Check")
    .check(
      regex("INSERT_DECK_RESULT"),
      jsonPath("$.data.deck_id").saveAs("deckId"),
    )

  val createDeck = ws("createDeckReq")
    .sendText(
      """{"action": "createDeckReq", "deck_name": "${deckName}", "deck_type": "${deckType}"}"""
    ).await(20)(checkCreateDeckReply)

  val checkGetDecksReply = ws.checkTextMessage("Get Decks Check")
    .check(
      regex("GET_DECKS_RESULT")
    )

  val getDecks = ws("getDecks")
    .sendText("""{"action": "getDecksReq"}""")
    .await(25)(checkGetDecksReply)

  val checkRemoveDeckReply = ws.checkTextMessage("Remove Deck Check")
    .check(
      regex("REMOVE_DECK_RESULT"),
      jsonPath("$.data.deck_id").saveAs("deckId"),
    )

  val removeDeck = ws("removeDeckReq")
    .sendText(
      """{"action": "removeDeckReq", "deck_id": "${deckId}" } """
    ).await(20)(checkRemoveDeckReply)

  val checkAddCardToDeckReply = ws.checkTextMessage("Add Card To Deck Reply")
    .check(
      regex("INSERT_DECK_CARD_RESULT"),
      jsonPath("$.data.deck_id").saveAs("deckId"),
      jsonPath("$.data").saveAs("deckCard"),
    )

  val addCardToDeck = ws("addCardToDeckReq")
    .sendText(
      """{"action": "addCardToDeckReq", "deck_id": "${deckId}", "inventory_card": ${inventoryCard}, "deck_type": "main",  "deck_name": "${deckName}" } """
    ).await(10)(checkAddCardToDeckReply)

  val checkGetDeckReply = ws.checkTextMessage("Get Deck Reply")
    .check(
      regex("GET_DECK_RESULT"),
    )

  val getDeck = ws("getDeckReq")
    .sendText(
      """{"action": "getDeckReq", "deck_id": "${deckId}" } """
    ).await(20)(checkGetDeckReply)

  val checkRemoveSideDeckCardFromDeckReply = ws.checkTextMessage("Remove Side Deck Card from Deck Reply")
    .check(regex("REMOVE_SIDE_DECK_CARD_RESULT"))

  val removeSideDeckCardFromDeck = ws("removeCardFromDeckReq")
    .sendText(
      """{"action": "removeCardFromDeckReq", "deck_id": "${deckId}", "deck_card": ${deckCard}, "inventory_id": "${inventoryId}" } """
    ).await(20)(checkRemoveSideDeckCardFromDeckReply)

  val checkMoveDeckCardReply = ws.checkTextMessage("Move Deck Card Reply")
    .check(regex("MODIFY_SIDE_DECK_CARD_RESULT"))

  // TODO: Update deck_card when move card lambda has been changed
  val moveDeckCard = ws("moveDeckCardReq")
    .sendText(
      """{"action": "moveDeckCardReq", "deck_id": "${deckId}", "deck_card_id": "${inventoryCardId}", "deck_type": "side_deck"}"""
    ).await(10)(checkMoveDeckCardReply)
}
