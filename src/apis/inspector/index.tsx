import { Hono } from "hono";
import { reactRenderer } from "@hono/react-renderer";

const router = new Hono()
	.get(
		"*",
		reactRenderer(({ children }) => {
			return <html lang="en">{children}</html>;
		}),
	)
	.get("/", (c) => {
		return c.render(
			<>
				<head>
					<meta charSet="utf-8" />
					<meta content="width=device-width, initial-scale=1" name="viewport" />
					{import.meta.env.PROD ? (
						<script type="module" src="/static/client.js" />
					) : (
						<script type="module" src="/src/main.tsx" />
					)}
				</head>
				<body>
					<div id="root" />
				</body>
			</>,
		);
	});

export default router;
