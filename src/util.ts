export const sha256 = async (message: string): Promise<string> =>
    Array.prototype.map
        .call(
            new Uint8Array(
                await crypto.subtle.digest("SHA-1", new TextEncoder().encode(message))
            ),
            (x) => ("0" + x.toString(16)).slice(-2)
        )
        .join("");
