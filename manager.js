let mysql = require('mysql');
let inquirer = require('inquirer');
require('console.table');

// initialize connection
let connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

// test connection
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
    }
    managerFunctions();
});

function managerFunctions(){
        inquirer.prompt([{
        type: 'rawlist',
        name: 'choice',
        message: 'Please select a function.',
        choices: ['View Products', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }]).then(function(ans) {
        let answer = ans.choice;
    if(answer === 'View Products'){
        viewProducts();
    }
    else if(answer === 'View Low Inventory'){
        lowInventory();
    }
    else if(answer === 'Add to Inventory'){
        addInventory();
    }
    else if(answer === 'Add New Product'){
        addProduct();
    }
    else{
        console.log('Error! Please make a selection from the available options.')
    }
        });
}

function viewProducts(){
    console.log('Here is our current inventory');
        let query = 'SELECT * FROM products';
        connection.query(query, function(err, res) {
        // show the products
        console.table(res);
    });
};

function lowInventory(res){
    console.log('Here are the items that are low in stock.');
        let query = 'SELECT * FROM products';
        connection.query(query, function(err, res) {
    
            let lowInven = [];
    
            for(let i = 0; i < res.length; i++){
                if(res[i].stock_quantity <= 10){
                lowInven.push(res[i])
            }
        };
    console.table(lowInven)
    });
};

function addInventory(){
    console.log('Here is our current inventory');
    let query = 'SELECT * FROM products';
    connection.query(query, function(err, res) {
        // show the products
        console.table(res);
        
        inquirer.prompt([{
        type: 'input',
        name: 'selection',
        message: 'Select the Item_id of the item you want to add stock to.'

    }]).then(function(ans){
        let selected = parseInt(ans.selection);
        //console.log(res[selected].stock_quantity)
        inquirer.prompt([{
            type: 'input',
            name: 'added',
            message: "How many units would you like to add to this item's iventory?"
            }]).then(function(ans1){
                
                let newQuantity = parseInt(res[selected - 1].stock_quantity) + parseInt(ans1.added);
                let query = connection.query(
                    'UPDATE products SET ? WHERE ?',
                        [
                            {
                                stock_quantity: newQuantity,
                            },
                            {
                                item_id: selected
                            },
                        ],
                    function(err, res){
                    //console.log(newQuantity, selected)
                    if(err){
                        console.log('Error of some sort.')
                    };
                        let query = 'SELECT * FROM products';
                        connection.query(query, function(err, res) {
        
                            console.log('Here is the updated inventory.');
                            console.table(res)
                        });
                });
            })
        });
    });
};
function addProduct(){            
    inquirer.prompt(
                [
                    {
                        type: 'input',
                        name: 'name',
                        message: 'What product would you like to add to the inventory?'
                    },

                    {
                        type: 'input',
                        name: 'department',
                        message: 'What is department does the product belong to?'
                    },
                    {
                        type: 'input',
                        name: 'price',
                        message: 'What is the price of the product?'
                    },
                    {
                        type: 'input',
                        name: 'quantity',
                        message: 'How much of the product will be stocked?'
                    },
                ]).then(function(ans2){
                    let query = connection.query(
                        'INSERT INTO products SET ?',
                            
                                {
                                    product_name: ans2.name,
                                    department_name: ans2.department,
                                    price: ans2.price,
                                    stock_quantity: ans2.quantity,
                                },
                            
                        function(err, res){
                        //console.log(newQuantity, selected)
                        if(err){
                            console.log('Error of some sort.')
                        }
                        let query = 'SELECT * FROM products';
                        connection.query(query, function(err, res) {
        
                            console.log('Here is the updated inventory.');
                            console.table(res)
                        });
                    
                    });

                });
}