'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Quick Wallet App

/////////////////////////////////////////////////
// Preset User Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-07-01T17:01:17.194Z',
    '2022-07-05T23:36:17.929Z',
    '2022-07-06T18:38:27.446Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};


const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

const formatDate = (datePara, locale) => {
  const calcDaysPassed = (date1, date2) => 
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), datePara)
  console.log(daysPassed)
  
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`
  // else {
  //   const day = `${datePara.getDate()}`.padStart(2,0);
  //   const month = `${datePara.getMonth() + 1}`.padStart(2,0);
  //   const year = datePara.getFullYear();
  //   return `${day}/${month}/${year}`
  // }
  return new Intl.DateTimeFormat(locale).format(datePara);
}



// Format Currencies
const formatCurrrency = function (value, locale, currency) {
  const currencyType = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(locale, currencyType).format(value);
}


//Display Transaction Movements
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = ''; //This empty the existing codes in the movement container

  const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;
  
  for (const [i, mov] of movs.entries()){
    const type = mov > 0 ? 'deposit' : 'withdrawal' 
    
    //Date
    const date = new Date(account.movementsDates[i]); // Looping over two array at the same exact time: index
    const displayDate = formatDate(date);

    // Using Internalization of Number to format the movement amount.
    const formattedMov = formatCurrrency(mov, account.locale, account.currency);
     
    const htmlInject = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
    `;
    
    containerMovements.insertAdjacentHTML('afterbegin', htmlInject)
  }
}
// console.log(containerMovements.innerHTML);


//Generating Usernames
const generateUsernames = function (accs) {
  accs.forEach(account => {
    account.username =  account.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  console.log(account.username);
  })
}

generateUsernames(accounts);


//Calculate User Balance
const calcBalance = function (acc) {
  acc.balance = acc.movements
    .reduce(function(accumulator, cur, i){
    return accumulator + cur;
  }, 0);
  const formattedBalance = formatCurrrency(acc.balance, acc.locale, acc.currency); 
  labelBalance.textContent = ` ${formattedBalance}`;
  console.log(acc.balance)
};




//Display Summary
const calcDisplaySummary = function (acct){
  const totalIncome = acct.movements
    .filter(mov => mov > 0)
    .reduce((accu, deposit) => accu + deposit, 0);
  const forIncome = formatCurrrency(totalIncome, acct.locale, acct.currency);
  
  const totalwithdrawals = acct.movements
    .filter(mov => mov < 0)
    .reduce((accu, withdrawal) => accu + withdrawal, 0);
  const forDrawal = formatCurrrency(Math.abs(totalwithdrawals), acct.locale, acct.currency);
  
  const interest = acct.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acct.interestRate/100)
    .filter(int => int >= 1) //This will create an aray of only interests above 1.
    .reduce((accu, intrest) => accu + intrest, 0);
  const forInterest = formatCurrrency(interest, acct.locale, acct.currency);
  
  
  labelSumIn.textContent = `${forIncome}`;
  labelSumOut.textContent = `${forDrawal}`;
  labelSumInterest.textContent = `${forInterest}`;
}

// Reset/Update Ui 
const updateUI = function (acc) {
  //Display transactions
  displayMovements(acc);

  //Calculate Balance
  calcBalance(acc);

  //Display Summary
  calcDisplaySummary(acc)
}


///////////
// Timer

const starteLogOutTimer = function () {
  const counter = () => {
    const min = Math.trunc(time/ 60).toString().padStart(2, 0);
    const sec = time % 60;
    
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started"
    }
    
    time--; 
  };

  // Set time to 5 minutes
  let time = 600;
  
  // Call the timer every seconds
  counter();
  const timer = setInterval(counter, 1000)
  return timer;
};



// Login Verification and Handler
let currentAccount, timer;

// Temporary
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;



btnLogin.addEventListener('click', function (e){
  e.preventDefault(); //Prevents form from submitting

  currentAccount = accounts.find( acc => 
    acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value){
    
    //Reveal UI and text
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`;
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur(); //Loses Focus

    // Current Date and Time
    // Experimenting with Intl Api
    // I guess all the object keynames already exists in the in-built Api.
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    }
    // const locale = navigator.language; // This will check for the browser language on the browser
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
    
    //Update UI
    updateUI(currentAccount);

    if (timer) clearInterval(timer);
    timer = starteLogOutTimer();
  }
});


// Tranfer

btnTransfer.addEventListener('click', function (e){
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);

  if (
    amount > 0 &&
    receiver &&
    currentAccount.balance >= amount &&
    receiver?.username !== currentAccount.username
  ){  
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);

    // Add transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());
    
    updateUI(currentAccount);
    console.log(`${amount} Euro sent!!!`)
    
    //Reset Timer
    clearInterval(timer);
    timer = starteLogOutTimer();
    
  } else if (!receiver) {
    console.log(`Account not found in Database!`)
  }
  else{
     alert(`Insufficient Balance`)
  }

   inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur(); //Loses Focus
})



// Delete Account
btnClose.addEventListener('click', function(d){
  d.preventDefault();
  
  const usernameDEL = inputCloseUsername.value;
  const pinDEL = +inputClosePin.value;
  
  if (currentAccount.username === usernameDEL && pinDEL === currentAccount.pin){
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`
  }
  else{
    alert('Wrong account')
  }

    inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur(); //Loses Focus
});



// Creates an empty loan array for each accounts
const loanRequestedArray = accounts => {
  accounts.forEach(account => account.loanRequested = [])
} 
loanRequestedArray(accounts);


// Loan
btnLoan.addEventListener('click', function (l){
  l.preventDefault();

  
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    currentAccount.movements.push(amount);

    // Wait for specific seconds before loan appear in the movement
    setTimeout(() => {
      // Add movement
      currentAccount.loanRequested.push(amount);
       // Add Loan Date
      currentAccount.movementsDates.push(new Date().toISOString());
      //Update UI
      updateUI(currentAccount);
    }, 2500);
    
    //Clear input
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
    
    //Reset Timer
    clearInterval(timer);
    timer = starteLogOutTimer();
  }
   
})

// Sorting
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})
