# 🚀 Arc Transaction Memo Demo

A simple Next.js application demonstrating how to send USDC transactions with **Transaction Memo** support on the **Arc Testnet** using **Ethers.js** and **MetaMask**.

This project also demonstrates how to verify memo events emitted by the Arc Memo contract.

---

## ✨ Features

* Connect MetaMask
* Detect Arc Testnet network
* Send USDC transfer with Transaction Memo
* Generate Memo ID
* Encode memo bytes
* Verify BeforeMemo event
* Verify Memo event
* Verify:

  * Sender
  * Target
  * CallDataHash
  * Memo ID
  * Memo
* Query Memo event using Memo ID
* Display transaction details
* Display verification results
* Link to Arc Explorer

---

## 🛠 Tech Stack

* Next.js
* React
* TypeScript
* Ethers.js v6
* MetaMask
* Arc Testnet

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/imtiazgul/arc-memo-demo.git
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🌐 Network

This demo is built for:

**Arc Testnet**

Chain ID:

```
5042002
```

---

## ⚙️ How it Works

The application:

1. Connects MetaMask.
2. Verifies the user is on Arc Testnet.
3. Creates ERC20 transfer calldata.
4. Computes the CallDataHash.
5. Generates a Memo ID.
6. Encodes the memo text.
7. Calls the Arc Memo contract.
8. Waits for transaction confirmation.
9. Parses emitted events.
10. Verifies all event fields.
11. Queries the Memo event by Memo ID.
12. Displays the verification results.

---

## ✅ Verification

The application automatically checks:

* Sender
* Target
* CallDataHash
* Memo ID
* Memo

Every check returns either:

```
PASS ✅
```

or

```
FAIL ❌
```

---

## 📄 Example Output

```
Transaction Successful

Transaction Hash:
0x...

Block:
49031802

BeforeMemo Index:
19723

Sender:
0x...

Target:
0x...

Memo:
order=2026-0002

Verification

Sender ✅ PASS
Target ✅ PASS
CallDataHash ✅ PASS
MemoId ✅ PASS
Memo ✅ PASS
```

---

## 📁 Project Structure

```
app/
 └── page.tsx

memo-abi.json

package.json
```

---

## 🎯 Future Improvements

* Copy Transaction Hash button
* Copy Memo ID button
* Dark / Light mode
* Better UI with Tailwind CSS
* Toast notifications
* Transaction history
* Mobile responsive layout
* Support multiple ERC20 tokens

---

## 👨‍💻 Author

**Imtiaz Gul**

GitHub:

https://github.com/imtiazgul

---

## 📜 License

This project is released under the MIT License.
