// import required essentials
const express = require('express');
// create new router
const router = express.Router();

let totalBal;

const splitCalculation = (item) => {
    let bal = item.Amount
    let RatioArr = []
    let data = [];
    let i = 0;

    // for Flat
    for (let i = 0; i < item.SplitInfo.length; i++) {
        if(item.SplitInfo[i].SplitType.toString() === "FLAT") {
            let flatResult = calculateFlat(bal, item.SplitInfo[i].SplitValue, item.SplitInfo[i].SplitEntityId);
            bal = flatResult.Amount;
            data.push({"SplitEntityId": flatResult.SplitEntityId, "Amount": flatResult.val});
        }
    }

    // for Percentage
    for (let i = 0; i < item.SplitInfo.length; i++) {
        if(item.SplitInfo[i].SplitType.toString() === "PERCENTAGE") {
            let PctResult = calculatePct(bal, item.SplitInfo[i].SplitValue, item.SplitInfo[i].SplitEntityId);
            bal = PctResult.Amount;
            data.push({"SplitEntityId": PctResult.SplitEntityId, "Amount": PctResult.result});
        }
    }

    // To get Total Ratio
    for (let i = 0; i < item.SplitInfo.length; i++) {
        if(item.SplitInfo[i].SplitType.toString() === "RATIO") {
            let result = getRatio(item.SplitInfo[i].SplitValue);
            RatioArr.push(result)
        }
    }

    let totalRatio = calTotalRatio(RatioArr);
 
    // for Ratio
    for (let i = 0; i < item.SplitInfo.length; i++) {
        if(item.SplitInfo[i].SplitType.toString() === "RATIO") {
            let RatioResult = calculateRatio(item.SplitInfo[i].SplitValue, totalRatio, bal, item.SplitInfo[i].SplitEntityId);
            data.push({"SplitEntityId": RatioResult.splitEntityId, "Amount": RatioResult.result});
        }
    }
    return data
} 


    

const calculateFlat = (intialBal, val, SplitEntityId) => {
    let Amount = intialBal - val;
    return {Amount, val, SplitEntityId}
}

const calculatePct = (val, base, SplitEntityId) => {
    let result = ((val / 100) * base);
    let Amount = val - result;
    return {Amount, result, SplitEntityId}
}

const getRatio = (value) => {
    return value;
}

const calTotalRatio = (item) => {
    let sum = 0;
    item.forEach(x => {
        sum += x;
    });
    return sum
}

const calculateRatio = (splitValue, totalRatioValue, amount, splitEntityId ) => {
    let result = ((splitValue / totalRatioValue) * amount);
    amount =  amount - result;
    totalBal = amount - amount;
    return {result, splitEntityId}
}



router.post('/', function (req, res) {
    
    // create an object of new Item
    let newItem = {
        ID: req.body.ID, 
        Amount: req.body.Amount, 
        Currency: req.body.Currency, 
        CustomerEmail: req.body.CustomerEmail, 
        SplitInfo: req.body.SplitInfo
    };

    // push new item object to data array of items
    // data.push(newItem);
    let result = splitCalculation(newItem);
    let resData = {
        ID: req.body.ID,
        Balance: totalBal,
        SplitBreakdown: result
    }
    // return with status 201
    // 201 means Created. The request has been fulfilled and 
    // has resulted in one or more new resources being created. 
    res.status(201).json(resData);
});

module.exports = router;