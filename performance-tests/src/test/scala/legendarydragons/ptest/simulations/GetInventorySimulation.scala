package legendarydragons.ptest.simulations
import scala.concurrent.duration._
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._
import legendarydragons.ptest.config.Config.getRestApiUrl
import legendarydragons.ptest.scenarios.Scenarios._

class GetInventorySimulation extends Simulation {

  val duration = System.getProperty("duration", "10").toInt seconds
  val userRate = System.getProperty("userRate", "1").toDouble
  val environment = System.getProperty("environment", "local")
  def httpProtocol = http.baseUrl(getRestApiUrl(environment))
    .userAgentHeader("Gatling/test")

  setUp(GetInventoryScenario()
  .inject(constantUsersPerSec(userRate) during duration)
  .protocols(httpProtocol))
  .assertions(
    global.responseTime.max.lt(15000),
    global.successfulRequests.percent.gte(50))
}

