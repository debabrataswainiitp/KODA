const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions"

export const generateResponse = async (prompt, model = "openrouter/auto") => {
    const FALLBACK_MODEL = "openrouter/auto"
    const modelsToTry = model !== FALLBACK_MODEL ? [model, FALLBACK_MODEL] : [model]

    for (const currentModel of modelsToTry) {
        const res = await fetch(openRouterUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: currentModel,
                messages: [
                    { role: "system", content: "You must return ONLY valid raw JSON." },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.2
            }),
        });

        if (res.status === 429) {
            console.log(`${currentModel} rate-limited, falling back...`)
            continue
        }

        if (!res.ok) {
            const err = await res.text()
            throw new Error("openRouter err" + err)
        }

        const data = await res.json()
        return data.choices[0].message.content
    }

    throw new Error("All models are currently unavailable. Please try again shortly.")
}
