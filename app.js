const promptSync = require('prompt-sync')
const prompt = promptSync();
let ROWS = 3;
let COLUMNS = ROWS
const SYMBOLS_COUNT = {
    "A": 4,
    "B": 6,
    "C": 8,
    "D": 10
}

const SYMBOLS_VALUES = {
    "A": 8,
    "B": 6,
    "C": 5,
    "D": 4
}








const checkValidNumber = (number) => {
    if (isNaN(parseFloat(number)) || parseFloat(number) <= 0) return false;
    else return true;
}
const getRows= ()=>{
  const rows = prompt('How many rows do you want in your bet (min:3, max:10, default:3)')
  if(checkValidNumber(rows)){
    if (parseFloat(rows) > 3 && parseFloat(rows) < 10){
        ROWS = rows;
        COLUMNS = rows;
    }
  }
}
const deposit = () => {
    while (true) {
        const amount = prompt('Enter your deposit amount:  ');
        // console.log(checkValidNumber(amount))
        if (checkValidNumber(amount)) return parseFloat(amount);
        else console.log('invalid deposit amount');
    }
}
// const depositAmount = deposit();

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt('Enter the number of lines you want to bet on (maximum of '+ROWS+') :  ');
        let rows = 3
        if(ROWS < 3) rows = 3
        else rows= ROWS;
        // console.log(checkValidNumber(amount))
        if (checkValidNumber(lines) && parseFloat(lines) <= rows) return parseFloat(lines);
        else console.log('invalid number of lines');
    }
}
const getBetAmount = (remBalance, lines) => {
    while (true) {
        const bet = prompt('Enter the amount you want to bet per line:  ');
        // console.log(checkValidNumber(amount))
        if (checkValidNumber(bet) && (parseFloat(bet) * lines) <= remBalance) return parseFloat(bet);
        else console.log('invalid bet amount');
    }
}
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    let result = [];
    for (let i = 0; i < COLUMNS; i++) {
        let resultSymbols = [...symbols]
        result.push([]);
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * resultSymbols.length);
            const selectedSymbol = resultSymbols[randomIndex];
            result[i].push(selectedSymbol);
            resultSymbols.splice(randomIndex, 1);

        }
    }
    return result
}
const transpose = (result) => {
    let rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLUMNS; j++) {
            rows[i].push(result[j][i])
        }
    }
    // console.log(rows)//
    return rows

}

const printRows = (rows) => {
    for (let row of rows) {
        let rowSymbol = "";
        row.forEach((symbol, i) => {
            rowSymbol += symbol;
            if (i !== row.length - 1) rowSymbol += " | "
        });
        console.log(rowSymbol)
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let i = 0; i < lines; i++) {
        let symbols = rows[i]
        let allTheSame = true
        for (let symbol of symbols) {
            if (symbol !== symbols[0]) {
                allTheSame = false
                break
            }
        }
        if (allTheSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }

    }
    console.log ('You won a total of $'+winnings)
    return winnings;
}

const game = () => {
    let balance = deposit()
    getRows();

    while (true) {
        console.log('$'+balance)
       
        const numberOfLines = getNumberOfLines()
        const betAmount = getBetAmount(balance, numberOfLines)
        balance -= betAmount * numberOfLines;
        const rows = transpose(spin())
        printRows(rows)
        const winnings = getWinnings(rows, betAmount, numberOfLines)
        console.log(winnings)
        balance += winnings
        if (balance <= 0) {
            console.log('You do not have enough balance to bet')
            break
        }
        const playAgain = prompt('Do you want to play again (y/n)? ');
        if (playAgain !== 'y' && playAgain !== 'Y') {
            console.log('Your balance is $'+ balance)
            break
        }
    }


}
game()
