package legendarydragons.ptest.simulations

import scala.concurrent.duration._
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._
import legendarydragons.ptest.config.Config.getRestApiUrl
import legendarydragons.ptest.scenarios.Scenarios._

class LegendaryDragonsSimulation extends Simulation {
  val duration = System.getProperty("duration", "60").toInt seconds
  val userRate = System.getProperty("userRate", ".5").toDouble

  val environment = System.getProperty("environment", "local")

  def httpProtocol = http.baseUrl(getRestApiUrl(environment))
    .userAgentHeader("Gatling/test")

  setUp(
    AddCardToInventoryScenario()
      .inject(constantUsersPerSec(userRate) during (duration))
      .protocols(httpProtocol),
    AddCardToDeckScenario()
      .inject(constantUsersPerSec(userRate) during (duration))
      .protocols(httpProtocol),
    ManageWishlistScenario()
      .inject(constantUsersPerSec(userRate) during (duration))
      .protocols(httpProtocol)
  )
}