'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Tahmid Ferdous',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` 
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}</div>
    </div>
    `;

    // .insertAdjacentHTML
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);

  labelBalance.textContent = `${acc.balance} EUR`;
};

const createUsernames = function (accs) {
  accs.forEach(function (accs) {
    accs.username = accs.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${Math.abs(interest)}`;
};

const updateUi = function (currentAccount) {
  //movements
  displayMovements(currentAccount.movements);
  //balance
  calcDisplayBalance(currentAccount);
  //summary
  calcDisplaySummary(currentAccount);
};

let currentAccount;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //clearing input fields
    inputLoginUsername.value = null;
    inputLoginPin.value = null;

    //showing logged in user
    labelWelcome.textContent = `welcome back , ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //updateUI
    updateUi(currentAccount);
  }
});

btnTransfer.addEventListener('click', event => {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //updateUI
    updateUi(currentAccount);

    inputTransferAmount.value = null;
    inputTransferTo.value = null;
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movement
    currentAccount.movements.push(amount);

    //update UI
    updateUi(currentAccount);
  }
  inputLoanAmount.value = null;
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = null;
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];
// // console.log(arr.reverse());

// movements.forEach((element, i) => {
//   if (element > 0) {
//     console.log(`You deposited ${element}`);
//   } else {
//     console.log(`You withdwaw ${Math.abs(element)}`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// console.log(currencies);

// currencies.forEach((elements, i) => {
//   console.log(i, elements);
// });

// let t1 = [3, 5, 2, 12, 7];
// let t2 = [4, 1, 15, 8, 3];

// console.log(t1.slice(1, -2));

// function checkDogs(dogsJulia, dogsKate) {
//   const newChange = dogsJulia.slice(1, -2);
//   const fullList = [...newChange, ...dogsKate];

//   fullList.forEach((elements, index) => {
//     if (elements < 3) {
//       console.log(
//         `Dog nmuber ${index + 1} is an puppy and is ${elements} years old`
//       );
//     } else {
//       console.log(
//         `Dog nmuber ${index + 1} is an adult and is ${elements} years old`
//       );
//     }
//   });
// }

// checkDogs(t1, t2);

// const arr = [1, 1, 1];

// const num = 2;

// const extra = arr.map(elements => {
//   return elements * num;
// });

// console.log(extra);

// const firstName = 'Tahmid Ferdous Niloy';

// const nameSplit = firstName
//   .split(' ')
//   .map(elements => {
//     return elements[0];
//   })
//   .join('')
//   .toLowerCase();

// console.log(nameSplit);

// const test = ['Tahmid', 'Ferdous'];

//filter

// const aa = movements.filter(el => {
//   return el > 0;
// });

// console.log(aa);

// const withdrawls = movements.filter(el => {
//   return el < 0;
// });

// console.log(withdrawls);

// //reduce

// const reduce1 = movements.reduce((acc, cur, i, arr) => {
//   console.log(`${i} - acc ${acc} - cur ${cur} acu + curr ${acc + cur}`);
//   return acc + cur;
// });

// console.log(reduce1);

// let max = 0;

// const reduce2 = movements.reduce((acc, cur, i, arr) => {
//   if (acc > cur) {
//     return acc;
//   } else {
//     return cur;
//   }
// }, movements[0]);

// console.log(reduce2);

//coding challenge 2

// function calcAverageHumanAge(ages) {
//   ages.forEach((elements, i) => {
//     let age = 2 * elements < 18;
//     if (elements <= 2) {
//       if (age) {
//         console.log(
//           `Human age of this dog is ${age} years old [less than 18 years old]`
//         );
//       } else {
//         console.log(`Human age of this dog is ${age} years old`);
//       }
//     } else {
//       let age = 16 + elements * 4;
//       if (age < 18) {
//         console.log(
//           `Human age of this dog is ${age} years old [less than 18 years old]`
//         );
//       } else {
//         console.log(`Human age of this dog is ${age} years old`);
//       }
//     }
//   });
// }

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

//the magic of chaining methods
// const eurToUsd = 1.1;

// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositsUSD);

//find method

// const pr = movements.find(mov => mov < 0);
// console.log(pr);

// const fnd = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(fnd);

// const arr = [[1, 2, [3]], 3, 4];
// console.log(arr.flat(2));

// const owners = ['jonas', 'zack', 'adam', 'martha'];
// const sorting = owners.map(el => el).sort();
// console.log(sorting);
// console.log(owners);

// console.log(movements);

// const a = movements.sort((a, b) => {
//   return a - b;
// });

// console.log(a);

// const arr = new Array(7).fill(1);
// console.log(arr);

// const arr = Array.from(
//   { length: 100 },
//   (cur, i) => Math.floor(Math.random() * 6) + 1
// );
// console.log(arr);

// const br = Array.from(document.querySelectorAll('.movements__value'));
// console.log(br.map(el => el.textContent));

//final test

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// dogs.forEach(
//   dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
// );
// console.log(dogs);

// const sarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));

// console.log(sarahsDog);
// console.log(
//   sarahsDog.curFood > sarahsDog.recommendedFood
//     ? 'The dog is eating too much'
//     : 'The dog is not eating too much'
// );

// const dogsOwnerEatsTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recommendedFood)
//   .map(dog => dog.owners)
//   .flat(2)
//   .join(' and ');

// console.log(`${dogsOwnerEatsTooMuch} eats too much`);

// const dogsOwnerEatsLittle = dogs
//   .filter(dog => dog.curFood < dog.recommendedFood)
//   .map(dog => dog.owners)
//   .flat(2)
//   .join(' and ');

// console.log(`${dogsOwnerEatsLittle} eats little`);

// const exactAmount = dogs.some(dog => dog.curFood == dog.recommendedFood);
// console.log(exactAmount);

// const okayAmount = dogs.some(dog => dog.curFood <= dog.recommendedFood);
// console.log(okayAmount);

// const shallow = dogs
//   .slice()
//   .sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(shallow);
