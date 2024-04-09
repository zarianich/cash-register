const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeOutput = document.getElementById("change-due");
const total = document.getElementById("total");
const change = document.getElementById("change");

let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

total.innerText = `Total: ${price}`;
updateChange(cid);

function updateChange (arr) {
  let resultStr = `<strong>Change left:</strong><br> `;
    arr.forEach(section => {
      resultStr += ` ${section[0]}: \$${section[1]}<br>`;
    });
  change.innerHTML = resultStr;
  cid = arr;
}

purchaseBtn.addEventListener("click", () => {
  const cash = Number(cashInput.value);
  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
  } else if (cash === price) {
    changeOutput.textContent = "No change due - customer paid with exact cash";
  } else {
    const result = checkCashRegister(price, cash, cid);
    let resultStr = `Status: ${result.status}<br>`;
    result.change.forEach(section => {
      resultStr += ` ${section[0]}: \$${section[1]}<br>`;
    });
    changeOutput.innerHTML = resultStr;
  }
});

cashInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        purchaseBtn.click();
    }
});

function checkCashRegister(price, cash, cid) {
  let cashReg = [];

  for (let i = 0; i < cid.length; i++) {
    cashReg.push([cid[i][0], cid[i][1]]);
  }

  const result = {
    status: "",
    change: []
  };

  let changeDue = cleanUpFloat(cash - price);

  function checkSection(id, name, value) {
    if (changeDue >= value && cashReg[id][1] > 0) {
      let amount = 0;

      while (changeDue >= value && cashReg[id][1] >= value) {
        changeDue -= value;
        changeDue = cleanUpFloat(changeDue);
        amount += value;
        amount = cleanUpFloat(amount);
        cashReg[id][1] -= value;
        cashReg[id][1] = cleanUpFloat(cashReg[id][1]);
      }

      result.change.push([name, amount]);
    }
  }

  function cleanUpFloat(num) {
    return parseFloat(num.toFixed(2));
  }

  function checkIfRegisterIsEmpty() {
    for (let i = 0; i < cashReg.length; i++) {
      if (cashReg[i][1] != 0) {
        return false;
      }
    }
    return true;
  }

  while (changeDue > 0) {

    checkSection(8, 'ONE HUNDRED', 100);
    checkSection(7, 'TWENTY', 20);
    checkSection(6, 'TEN', 10);
    checkSection(5, 'FIVE', 5);
    checkSection(4, 'ONE', 1);
    checkSection(3, 'QUARTER', 0.25);
    checkSection(2, 'DIME', 0.1);
    checkSection(1, 'NICKEL', 0.05);
    checkSection(0, 'PENNY', 0.01);

    if (changeDue > 0) {
      result.status = "INSUFFICIENT_FUNDS";
      changeDue = 0;
      result.change = [];
    } else if (checkIfRegisterIsEmpty()) {
      result.status = "CLOSED";
      result.change = [...cid];
    } else {
      result.status = "OPEN";
      updateChange(cashReg);
    }
  }
  return result;
}