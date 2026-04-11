/**
 * Minimize Cash Flow 알고리즘으로 구현.
 * https://www.geeksforgeeks.org/dsa/minimize-cash-flow-among-given-set-friends-borrowed-money/
 * expenses 배열로부터 최소 송금 목록을 계산합니다.
 *
 * @param {Array} expenses - [{ payerId, amount, participants: [userId, ...] }]
 * @returns {Array} - [{ fromUserId, toUserId, amount }]
 *
 * 예시:
 *   calcMinSettlements([
 *     { payerId: 1, amount: 60000, participants: [1, 2, 3, 4] },
 *     { payerId: 2, amount: 40000, participants: [1, 2, 3, 4] },
 *   ])
 *   → [{ fromUserId: 3, toUserId: 1, amount: 5000 }, ...]
 */
function calcMinSettlements(expenses) {
  // 1. 각 사람의 순 잔액 계산 (양수: 받아야 함, 음수: 줘야 함)
  const balance = {};

  for (const expense of expenses) {
    const share = expense.amount / expense.participants.length;

    // 결제자는 전체 금액만큼 +
    balance[expense.payerId] = (balance[expense.payerId] ?? 0) + expense.amount;

    // 참여자는 각자의 몫만큼 -
    for (const userId of expense.participants) {
      balance[userId] = (balance[userId] ?? 0) - share;
    }
  }

  // 2. 채권자(받을 사람)와 채무자(줄 사람) 분리
  const creditors = []; // { userId, amount }
  const debtors = []; // { userId, amount }

  for (const [userId, amt] of Object.entries(balance)) {
    const floored = amt > 0 ? Math.floor(amt) : Math.ceil(amt);
    if (floored > 0)
      creditors.push({ userId: Number(userId), amount: floored });
    else if (floored < 0)
      debtors.push({ userId: Number(userId), amount: -floored });
  }

  // 3. Greedy 매칭: 채무자가 채권자에게 순서대로 상환
  const transfers = [];
  let i = 0,
    j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    const settled = Math.min(creditor.amount, debtor.amount);

    transfers.push({
      fromUserId: debtor.userId,
      toUserId: creditor.userId,
      amount: settled,
    });

    creditor.amount -= settled;
    debtor.amount -= settled;

    if (creditor.amount === 0) i++;
    if (debtor.amount === 0) j++;
  }

  return transfers;
}
export { calcMinSettlements };
