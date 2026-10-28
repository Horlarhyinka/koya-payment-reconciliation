// Payment reconciliation.
//
// Reads payments.jsonl and works out how much money we actually collected.
// Run:  node reconcile.js

const fs = require("fs");

let total = 0;
let count = 0;

const lines = fs.readFileSync("payments.jsonl", "utf8").split("\n").filter((l) => l.length > 0);
const store = {}
for (const line of lines) {
  let event = undefined
  try{
    event = JSON.parse(line);
  }catch(err) {
    void err
    continue
  }
  if(!event?.txn_id)continue;
  const stored = store[event.txn_id]
  if(!stored || Date.parse(event.ts) >= Date.parse(stored.ts)) {
    store[event.txn_id] = event
  }

}
åç
Object.values(store).forEach(s=>{
    if(s.status === "success") {
        count++
        total += parseInt(s.amount)
    }
})


const expected = parseInt(fs.readFileSync("expected.txt", "utf8").trim(), 10);
if (count !== expected) {
  console.log(`Check failed: counted ${count} successful payments, expected ${expected}.`);
  console.log("Something in the data isn't being handled the way the README describes.");
} else {
  console.log(`Check passed: ${count} successful payments.`);
  console.log(`Your code: KOYA-${Math.round(total)}`);
}
