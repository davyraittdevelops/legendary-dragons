package legendarydragons.ptest.requests
import scala.concurrent.duration._
import io.gatling.core.Predef._
import io.gatling.http.Predef._

// object are native Scala singletons
object Requests {

    private val contentTypeHeader = Map("Content-Type" -> "application/json;charset=UTF-8")

    /**
      * Gatling action to make a GET request to the "/" endpoint of the baseUrl
      */
    val visitFrontEnd = http("visitFrontEnd").get("/")
}
