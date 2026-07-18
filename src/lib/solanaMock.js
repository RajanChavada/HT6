export async function sendMockSolanaTransaction() {
  const rpcUrl = import.meta.env.VITE_SOLANA_RPC || "https://api.devnet.solana.com";

  try {
    // Make a real request to the Solana RPC so it shows up in the Network tab
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getLatestBlockhash",
        params: [
          {
            commitment: "processed",
          },
        ],
      }),
    });

    const data = await res.json();
    const blockhash = data?.result?.value?.blockhash || "mockBlockhash123";

    // Simulate blockchain confirmation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate a fake signature that looks like a Solana signature
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let signature = "";
    for (let i = 0; i < 88; i++) {
      signature += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return signature;
  } catch (error) {
    console.warn("Solana RPC error:", error);
    // Fallback if RPC fails
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return "4xT" + Math.random().toString(36).substring(2, 15) + "mockSignature";
  }
}
