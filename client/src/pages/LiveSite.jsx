import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Ghost } from "lucide-react"
import { serverUrl } from "../App"
import axios from "axios"

function LiveSite() {
    const { id } = useParams()
    const [html, setHtml] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-by-slug/${id}`)
                setHtml(result.data.latestCode)
            } catch (error) {
                console.log(error)
                setError("Site not found")
            }
        }
        handleGetWebsite()
    }, [id])

    if (error) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-koda-bg text-white">
                <div className="grid h-16 w-16 place-items-center rounded-2xl glass">
                    <Ghost size={28} className="text-violet-400" />
                </div>
                <p className="text-lg font-semibold">{error}</p>
                <p className="text-sm text-zinc-500">This site may have been moved or never existed.</p>
            </div>
        )
    }

    return (
        <iframe
            title="Live Site"
            srcDoc={html}
            className="h-screen w-screen border-none"
            sandbox="allow-scripts allow-same-origin allow-forms"
        />
    )
}

export default LiveSite
