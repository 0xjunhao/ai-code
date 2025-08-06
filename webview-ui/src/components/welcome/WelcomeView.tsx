import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { useEffect, useState, memo } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { validateApiConfiguration } from "@/utils/validate"
import ApiOptions from "@/components/settings/ApiOptions"
import ClineLogoWhite from "@/assets/ClineLogoWhite"
import { AccountServiceClient, StateServiceClient } from "@/services/grpc-client"
import { EmptyRequest, BooleanRequest } from "@shared/proto/cline/common"

const WelcomeView = memo(() => {
	const { apiConfiguration, mode } = useExtensionState()
	const [apiErrorMessage, setApiErrorMessage] = useState<string | undefined>(undefined)
	const [showApiOptions, setShowApiOptions] = useState(false)

	const disableLetsGoButton = apiErrorMessage != null

	const handleLogin = () => {
		AccountServiceClient.accountLoginClicked(EmptyRequest.create()).catch((err) =>
			console.error("Failed to get login URL:", err),
		)
	}

	const handleSubmit = async () => {
		try {
			await StateServiceClient.setWelcomeViewCompleted(BooleanRequest.create({ value: true }))
		} catch (error) {
			console.error("Failed to update API configuration or complete welcome view:", error)
		}
	}

	useEffect(() => {
		setApiErrorMessage(validateApiConfiguration(mode, apiConfiguration))
	}, [apiConfiguration, mode])

	return (
		<div className="fixed inset-0 p-0 flex flex-col">
			<div className="h-full px-5 overflow-auto">
				<h2>Hi, I'm Ubicloud AI Code</h2>
				<p>
					I can do all kinds of tasks thanks to breakthroughs in agentic coding capabilities and access to tools that
					let me create & edit files, explore complex projects, use a browser, and execute terminal commands{" "}
					<i>(with your permission, of course)</i>. I can even use MCP to create new tools and extend my own
					capabilities.
				</p>

				<div className="mt-4.5">
					<div>
						<ApiOptions showModelOptions={false} currentMode={mode} />
						<VSCodeButton onClick={handleSubmit} disabled={disableLetsGoButton} className="mt-0.75">
							Let's go!
						</VSCodeButton>
					</div>
				</div>
			</div>
		</div>
	)
})

export default WelcomeView
