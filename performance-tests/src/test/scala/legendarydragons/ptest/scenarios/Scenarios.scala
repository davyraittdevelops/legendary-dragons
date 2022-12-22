package legendarydragons.ptest.scenarios
import scala.concurrent.duration._
import scala.util.Random
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import legendarydragons.ptest.requests.Requests

object Scenarios {

    def VisitFrontEndScenario() = scenario("VisitFrontEndScenario")
      .exec(Requests.visitFrontEnd.check(status.is(200)))

}
