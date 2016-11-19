var connect = require('connect');
var http = require('http');
var mondo = require('mondo-bank')

var app = connect();

var accountId = 'acc_000096SQdfcdJriLPzqSgL';
var accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaSI6Im9hdXRoY2xpZW50XzAwMDA5NFB2SU5ER3pUM2s2dHo4anAiLCJleHAiOjE0Nzk1MzIxNDMsImlhdCI6MTQ3OTUxMDU0MywianRpIjoidG9rXzAwMDA5RVVjMDNrYzlFVmtJUDd3S2YiLCJ1aSI6InVzZXJfMDAwMDk2RzlLZWswTERhMmpkaUdCZCIsInYiOiIyIn0.3FNqxtZscu1l6TtCMzI-GlKK8NUsF03FWUZVTakRjNg';

// store session state in browser cookie
var cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());


// get balance
app.use('/balance', function(req, res){

    mondo['balance'](accountId, accessToken, function(error, value){
        console.log(value['balance']);
        res.end(value['balance']);
    });

});

// get transactions since start of month
app.use('/transactions', function(req, res){

    var param = {
        account_id: accountId,
        since: '2016-11-01T23:00:00Z'
    };

    var groupData = function (transactions) {
        console.log("Entering groupData");
        var tempGrouping = [];
        for (var i = 0; i < transactions.length; i++) {
            var transactionAmount = transactions[i].amount;
            var transactionCategory = transactions[i].category;
            console.log("i: " + i + ". amount: " + transactionAmount + ". category: " + transactionCategory);
            tempGrouping[transactionCategory] += transactionAmount;
        }
        return tempGrouping;
    };

    mondo['transactions'](param, accessToken, function(error, value){
        var topSpendingCategories = groupData(value[0]);
        console.log(topSpendingCategories);
        //console.log(value);
        res.end(value);
    });

});

// respond to all requests
app.use(function(req, res){
    res.end('Hello from Connect!\n');
});



//create node.js http server and listen on port
http.createServer(app).listen(3000);



