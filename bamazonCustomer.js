var inquirer = require('inquirer');
var mysql = require('mysql');
var tablename = "products";
var idarray = [];
var namearray = [];
var departmentarray = [];
var pricearray = [];
var stockarray = [];
var stocknode;
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: "Bamazon"
});
connection.connect();
var mastertable = []
function buy() {
	inquirer.prompt([{
		type: "input",
		message: "What product do you want to buy? (id)",
		name: "product"
	}, {
		type: "input",
		message: "How many do you want to buy?",
		name: "quantity"
	}]).then(function(user) {
		user.quantity = parseInt(user.quantity);
		user.product = parseInt(user.product);
		if (user.quantity && user.product > 0 && user.product < mastertable.length) {
			var queryurl = "SELECT * FROM Bamazon." + tablename + " WHERE ?";
			connection.query(queryurl, [{
				item_id: user.product
			}], function(err, res) {
				if (err) throw err;
				if (user.quantity <= res[0].stock) {
					console.log("We have enough");
					var price;
					price = user.quantity * res[0].price
					console.log("It cost: " + price)
					stocknode = res[0].stock - user.quantity;
					console.log(res[0].product_name + " has the stock of " + stocknode)
					queryURL = "UPDATE Bamazon.products SET ? WHERE ?"
					connection.query(queryURL, [{
						stock: stocknode
					}, {
						item_id: user.product
					}], function(err, res) {
						if (err) throw err;
					});
					readDB();
				} else {
					console.log("We don't have enough");
					readDB();
				}
			})
		} else {
			console.log("Please insert a valid number")
			buy();
		}
	})
}

function readDB() {
	connection.query("SELECT * FROM " + tablename, function(err, res) {
		if (err) throw err;
		resnode = res;
		console.log("ID | Product Name | Department Name | Price | Stock");
		mastertable = [];
		for (var i = 0; i < resnode.length; i++) {
			mastertable.push(resnode[i]);
			pricearray.push(resnode[i].price)
			stockarray.push(resnode[i].stock)
			console.log(mastertable[i].item_id + "|" + mastertable[i].product_name + "|" + mastertable[i].department_name + "|" + "$" + mastertable[i].price + "|" + mastertable[i].stock);
		}
		buy();
	})
}
readDB();