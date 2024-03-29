package legendarydragons.ptest.scenarios
import scala.concurrent.duration._
import scala.util.Random
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import legendarydragons.ptest.requests.Requests

object Scenarios {

  //Feeders, variables
  val random = new Random()
  val registerFeeder = Iterator.continually {
  val randomString = Random.alphanumeric.take(10).mkString
  Map(
    "nickname" -> (s"test-$randomString"),
    "email" -> (s"test-$randomString@legendarydragons.com"),
    "password" ->  (s"Te!312-$randomString")
    )
  }

  val inventoryCardDetailsFeeder = Iterator.continually {
  val randomString = Random.alphanumeric.take(10).mkString
  Map(
    "rid1" -> (s"$randomString"),
    "rid2" -> (s"test_cardid-$randomString"),
    "rid3" -> (s"test_oracleid-$randomString"),
    "rid4" -> (s"test_scryfallid-$randomString")
    )
  }

  val deckFeeder = Iterator.continually {
    val randomString = Random.alphanumeric.take(15).mkString
    Map(
      "deckName" -> (s"deck-$randomString"),
      "deckType" -> (s"EDH-$randomString")
    )
  }

  val emailFeeder = csv("data/accounts.csv").circular

  //Scenarios
  def VisitFrontEndScenario() = scenario("VisitFrontEndScenario")
    .exec(Requests.visitFrontEnd.check(status.is(200)))

  def RegisterAccountScenario() = scenario("RegisterAccountScenario")
    .feed(registerFeeder)
    .exec(Requests.registerAccount.check(status.is(201)))

  def LoginAccountScenario() = scenario("LoginAccountScenario")
    .feed(emailFeeder)
    .exec(Requests.loginAccount.check(status.is(200)))

  def LoginThenConnectToWebSocketScenario() = scenario("LoginAccountScenario")
    .feed(emailFeeder)
    .exec(Requests.loginAccount.check(header("x-amzn-Remapped-Authorization").saveAs("token")))
    .exec { session =>
      var token = session("token").as[String].replace("Bearer ", "")
      println("@@@@@@@@@@@  " + token)
      session.set("token", token)
    }
    .exec(Requests.connectToWebsocket)

  def AddCardToInventoryScenario() = scenario("AddCardToInventoryScenario")
    .feed(emailFeeder)
    .exec(Requests.loginAccount.check(header("x-amzn-Remapped-Authorization").saveAs("token")))
    .exec { session =>
      var token = session("token").as[String].replace("Bearer ", "")
      session.set("token", token)
    }
    .exec(Requests.connectToWebsocket)
    .pause(2)
    .exec(Requests.getInventory)
    .pause(1)
    .feed(inventoryCardDetailsFeeder)
    .exec(Requests.addCardToInventory)
    .pause(2)
    .exec(Requests.removeCardFromInventory)

  def GetInventoryScenario() = scenario("GetInventoryScenario")
    .feed(emailFeeder)
    .exec(Requests.loginAccount.check(header("x-amzn-Remapped-Authorization").saveAs("token")))
    .exec { session =>
      var token = session("token").as[String].replace("Bearer ", "")
      session.set("token", token)
    }
    .exec(Requests.connectToWebsocket)
    .pause(2)
    .feed(inventoryCardDetailsFeeder)
    .exec(Requests.getInventory)

  def CreateDeckScenario() = scenario("CreateDeckScenario")
    .feed(emailFeeder)
    .exec(Requests.loginAccount.check(header("x-amzn-Remapped-Authorization").saveAs("token")))
    .exec { session =>
      var token = session("token").as[String].replace("Bearer ", "")
      session.set("token", token)
    }
    .exec(Requests.connectToWebsocket)
    .pause(2)
    .feed(deckFeeder)
    .exec(Requests.createDeck)
    .pause(1)
    .exec(Requests.getDecks)
    .pause(1)
    .exec(Requests.removeDeck)

  def AddCardToDeckScenario() = scenario("AddCardToDeckScenario")
    .feed(emailFeeder)
    .exec(Requests.loginAccount.check(header("x-amzn-Remapped-Authorization").saveAs("token")))
    .exec { session =>
      var token = session("token").as[String].replace("Bearer ", "")
      session.set("token", token)
    }
    .exec(Requests.connectToWebsocket)
    .pause(2)
    .exec(Requests.getInventory)
    .pause(1)
    .feed(inventoryCardDetailsFeeder)
    .exec(Requests.addCardToInventory)
    .pause(2)
    .feed(deckFeeder)
    .exec(Requests.createDeck)
    .pause(1)
    .exec(Requests.getDecks)
    .pause(1)
    .exec(Requests.addCardToDeck)
    .pause(2)
    .exec(Requests.moveDeckCard)
    .pause(1)
    .exec(Requests.removeSideDeckCardFromDeck)
    .pause(2)
    .exec(Requests.getDeck)
    .pause(1)
    .exec(Requests.removeDeck)
    .pause(2)
    .exec(Requests.removeCardFromInventory)

  def ManageWishlistScenario() = scenario("ManageWishlistScenario")
    .feed(emailFeeder)
    .exec(Requests.loginAccount.check(header("x-amzn-Remapped-Authorization").saveAs("token")))
    .exec { session =>
      var token = session("token").as[String].replace("Bearer ", "")
      session.set("token", token)
    }
    .exec(Requests.connectToWebsocket)
    .pause(2)
    .exec(Requests.createWishlistItem)
    .pause(1)
    .exec(Requests.getWishlist)
    .pause(2)
    .exec(Requests.createAlert)
    .pause(1)
    .exec(Requests.getAlerts)
    .pause(2)
    .exec(Requests.removeAlert)
    .pause(2)
    .exec(Requests.removeWishlistItem)
}
