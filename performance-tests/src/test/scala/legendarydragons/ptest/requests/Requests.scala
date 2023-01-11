package legendarydragons.ptest.requests
import scala.concurrent.duration._
import io.gatling.core.Predef._
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

    val connectToWebsocket = ws("Connect to WebSocket").connect("wss://3ghgk1q3mf.execute-api.us-east-1.amazonaws.com/Prod?token=${token}")
}
