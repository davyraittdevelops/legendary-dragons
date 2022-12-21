package legendarydragonsfrontend.ptest.simulations
import scala.concurrent.duration._
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._
import legendarydragonsfrontend.ptest.config.Config.getBaseUrl
import legendarydragonsfrontend.ptest.scenarios.Scenarios._

class VisitWebPageSimulation extends Simulation {

  val duration = System.getProperty("duration", "10").toInt seconds
  val userRate = System.getProperty("userRate", "1").toDouble

  val environment = System.getProperty("environment", "local")
  def httpProtocol = http.baseUrl(getBaseUrl(environment)).userAgentHeader("Gatling/test")

  setUp(getWebPageScenario().inject(constantUsersPerSec(userRate) during duration).protocols(httpProtocol))
  .assertions(
    global.responseTime.max.lt(15000),
    global.successfulRequests.percent.gte(50))
}

