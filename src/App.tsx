import {
	ConnectionProvider,
	ShikiProvider,
	ToolProvider,
	useConfig,
} from "@/providers";
import { BrowserRouter, Route, Routes } from "react-router";
import ConfigurationsDialog from "./components/configurationsDialog";
import { ExplorerPage } from "./components/Explorer";
import { ExplorerWrapper } from "./components/Explorer/Wrapper";
import { LLMScoringPage } from "./components/LLMScoring";
import { NotFound } from "./components/NotFound";
import { SettingsPage } from "./components/Settings";
import { TracingPage } from "./components/Tracing";
import { SidebarProvider } from "./components/ui/sidebar";
import Wrapper from "./components/Wrapper";

function App() {
	const { connectionInfo, setConnectionInfo } = useConfig();

	if (!connectionInfo) {
		return <ConfigurationsDialog onSubmit={setConnectionInfo} />;
	}

	return (
		<ConnectionProvider {...connectionInfo}>
			<ToolProvider>
				<ShikiProvider>
					<SidebarProvider>
						<BrowserRouter>
							<Routes>
								<Route path="/" element={<Wrapper />}>
									<Route element={<ExplorerWrapper />}>
										<Route path="/explorer" element={<ExplorerPage />} />
									</Route>
									<Route path="/llm-scoring" element={<LLMScoringPage />} />
									<Route path="/tracing" element={<TracingPage />} />
									<Route path="/settings" element={<SettingsPage />} />
								</Route>
								<Route path="*" element={<NotFound />} />
							</Routes>
						</BrowserRouter>
					</SidebarProvider>
				</ShikiProvider>
			</ToolProvider>
		</ConnectionProvider>
	);
}

export default App;
