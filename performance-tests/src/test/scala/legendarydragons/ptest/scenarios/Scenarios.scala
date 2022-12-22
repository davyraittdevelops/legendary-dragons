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
  val emailFeeder = csv("data/accounts.csv").circular

  //Scenarios
  def VisitFrontEndScenario() = scenario("VisitFrontEndScenario")
    .exec(Requests.visitFrontEnd.check(status.is(200)))

  def RegisterAccountScenario() = scenario("RegisterAccountScenario")
    .feed(registerFeeder)
    .exec(Requests.registerAccount.check(status.is(201)))

  def LoginAccountScenario() = scenario("LoginAccountScenario")
    .feed(emailFeeder)
    .exec(Requests.loginAccount.check(status.is(201)))

}