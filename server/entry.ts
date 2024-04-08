import {renderPage} from "vike/server";
import {AutoRouter} from "itty-router"
import ping from "./ping"

const app = AutoRouter()

app.get("/api/ping", ping)

app.get("*", async (request) => {
	const pageContextInit = {
		urlOriginal: request.url
	}
	const pageContext = await renderPage(pageContextInit)
	if (pageContext.errorWhileRendering) {
		// Install error tracking here, see https://vike.dev/errors
	}
	const { httpResponse } = pageContext
	if (!httpResponse) {
		return new Response('Not found', { status: 404 })
	} else {
		const { body, statusCode: status, headers } = httpResponse
		return new Response(body, { status, headers })
	}
})

export default app.fetch
