package legendarydragonsfrontend.ptest.scenarios
import scala.concurrent.duration._
import scala.util.Random
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import legendarydragonsfrontend.ptest.requests.FrontendRequests

object Scenarios {

    def getWebPageScenario() = scenario("getWebPageScenario")
      .exec(FrontendRequests.getWebPage.check(status.is(200)))

}
