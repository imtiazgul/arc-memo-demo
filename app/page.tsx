"use client";

import React from "react";
import { ethers } from "ethers";
import memoAbi from "../memo-abi.json";

const MEMO_ADDRESS = "0x5294E9927c3306DcBaDb03fe70b92e01cCede505";
const USDC_ADDRESS = "0x3600000000000000000000000000000000000000";


export default function Home() {
  const [result, setResult] = React.useState("");
  const [explorerUrl, setExplorerUrl] = React.useState("");
  
  const [loading, setLoading] = React.useState(false);
  const [recipient, setRecipient] = React.useState(
  "0x49D56EecfB7d2d53Ee4D097Af138aE16edeD85a2"
);

const [amount, setAmount] = React.useState("2");

const [memoIdText, setMemoIdText] = React.useState(
  "invoice-2026-0002"
);

const [memoText, setMemoText] = React.useState(
  "order=2026-0002"
);
  async function sendMemo() {
    try {
      setLoading(true);
setResult("");
      if (!(window as any).ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const provider = new ethers.BrowserProvider(
        (window as any).ethereum
      );

      await provider.send("eth_requestAccounts", []);

      const network = await provider.getNetwork();

      if (Number(network.chainId) !== 5042002) {
        alert("Please switch MetaMask to Arc Testnet");
        return;
      }

      const signer = await provider.getSigner();

      // Check Memo contract exists
      const code = await provider.getCode(MEMO_ADDRESS);

      if (code === "0x") {
        throw new Error("Memo contract not deployed");
      }

      const erc20Interface = new ethers.Interface([
        "function transfer(address to,uint256 amount) returns (bool)"
      ]);

      const memoInterface = new ethers.Interface(memoAbi);
      if (!ethers.isAddress(recipient)) {
  throw new Error("Invalid recipient address");
}

if (Number(amount) <= 0) {
  throw new Error("Amount must be greater than zero");
}

if (!memoIdText.trim()) {
  throw new Error("Memo ID cannot be empty");
}

if (!memoText.trim()) {
  throw new Error("Memo text cannot be empty");
}

      const transferData =
  erc20Interface.encodeFunctionData("transfer", [
    recipient,
    ethers.parseUnits(amount, 6)
  ]);

      const callDataHash = ethers.keccak256(transferData);

      const memoId = ethers.id(memoIdText);

      const memoBytes =
  ethers.toUtf8Bytes(memoText);

      console.log("CallDataHash:", callDataHash);

      const tx = await signer.sendTransaction({
        to: MEMO_ADDRESS,
        data: memoInterface.encodeFunctionData(
          "memo",
          [
            USDC_ADDRESS,
            transferData,
            memoId,
            memoBytes
          ]
        )
      });

      console.log(tx.hash);

      const receipt = await tx.wait();

if (!receipt) {
  throw new Error("Transaction was not mined");
}

const beforeMemoEvents: any[] = [];
const memoEvents: any[] = [];

for (const log of receipt.logs) {
  if (log.address.toLowerCase() !== MEMO_ADDRESS.toLowerCase()) {
    continue;
  }

  try {
    const parsed = memoInterface.parseLog(log);

    if (!parsed) continue;

    if (parsed.name === "BeforeMemo") {
      beforeMemoEvents.push(parsed);
    }

    if (parsed.name === "Memo") {
      memoEvents.push(parsed);
    }
  } catch (err: any) {
  console.error(err);
  alert(err.message);
} finally {
  setLoading(false);
}
}

if (beforeMemoEvents.length !== 1 || memoEvents.length !== 1) {
  throw new Error("Expected one BeforeMemo and one Memo event");
}

const memoArgs = memoEvents[0].args;
const senderOk =
  memoArgs.sender.toLowerCase() === signer.address.toLowerCase();

const targetOk =
  memoArgs.target.toLowerCase() === USDC_ADDRESS.toLowerCase();

const hashOk =
  memoArgs.callDataHash === callDataHash;

const memoIdOk =
  memoArgs.memoId === memoId;

const memoOk =
  ethers.toUtf8String(memoArgs.memo) === memoText;
  const memoTopic = memoInterface.getEvent("Memo")?.topicHash;

if (!memoTopic) {
  throw new Error("Memo event topic not found");
}

const matchingLogs = await provider.getLogs({
  address: MEMO_ADDRESS,
  topics: [memoTopic, null, null, memoId],
  fromBlock: receipt.blockNumber,
  toBlock: receipt.blockNumber,
});
if (matchingLogs.length !== 1) {
  throw new Error(
    `Expected one Memo log for memoId, found ${matchingLogs.length}`
  );
}

const queriedMemo = memoInterface.parseLog(matchingLogs[0]);

console.log("Memo event found by memoId:", queriedMemo);
  console.log({
  senderOk,
  targetOk,
  hashOk,
  memoIdOk,
  memoOk,
});
const txExplorerUrl =
  `https://testnet-scan.arc.xyz/tx/${tx.hash}`;

setExplorerUrl(txExplorerUrl);

setResult(
  `✅ Transaction Successful\n\n` +
  `Transaction Hash:\n${tx.hash}\n\n` +
`Explorer:\n${txExplorerUrl}\n\n` +
  `Block:\n${receipt.blockNumber}\n\n` +

  `BeforeMemo Index:\n${beforeMemoEvents[0].args.memoIndex}\n\n` +

  `Sender:\n${memoArgs.sender}\n\n` +
  `Target:\n${memoArgs.target}\n\n` +

  `Memo ID:\n${memoArgs.memoId}\n\n` +
  `Memo:\n${ethers.toUtf8String(memoArgs.memo)}\n\n` +

  `Memo Index:\n${memoArgs.memoIndex}\n\n` +

  `CallDataHash:\n${memoArgs.callDataHash}\n\n` +

  `=========== Verification ===========\n\n` +

  `Sender: ${senderOk ? "✅ PASS" : "❌ FAIL"}\n` +
  `Target: ${targetOk ? "✅ PASS" : "❌ FAIL"}\n` +
  `CallDataHash: ${hashOk ? "✅ PASS" : "❌ FAIL"}\n` +
  `MemoId: ${memoIdOk ? "✅ PASS" : "❌ FAIL"}\n` +
  `Memo: ${memoOk ? "✅ PASS" : "❌ FAIL"}`
);

alert("Memo transaction verified successfully!");

    } catch (err: any) {
  console.error(err);
  alert(err.message);
} finally {
  setLoading(false);
}
  }

 return (
  <main
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      gap: "20px",
      padding: "20px",
    }}
  >
    <h1
      style={{
        fontSize: "38px",
        fontWeight: "bold",
        color: "#2563eb",
        marginBottom: "0",
      }}
    >
      Arc Transaction Memo Demo
    </h1>

    <p
      style={{
        color: "#666",
        fontSize: "18px",
        marginTop: "0",
      }}
    >
      Send USDC with Transaction Memo on Arc Testnet
    </p>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "90%",
        maxWidth: "700px",
      }}
    >
      <input
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient Address"
        style={{
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
        }}
      />

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="USDC Amount"
        style={{
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
        }}
      />

      <input
        value={memoIdText}
        onChange={(e) => setMemoIdText(e.target.value)}
        placeholder="Memo ID"
        style={{
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
        }}
      />

      <input
        value={memoText}
        onChange={(e) => setMemoText(e.target.value)}
        placeholder="Memo Text"
        style={{
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
        }}
      />
    </div>

    <button
  onClick={sendMemo}
  disabled={loading}
  style={{
    padding: "18px 40px",
    fontSize: "18px",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.6 : 1,
  }}
>
  {loading ? "Sending..." : "Send USDC With Memo"}
</button>

    {result && (
  <div
    style={{
      width: "90%",
      maxWidth: "900px",
      background: "#111827",
      color: "#22c55e",
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid #374151",
      fontFamily: "monospace",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    }}
  >
    {result}
  </div>
  )}
  </main>
);
}