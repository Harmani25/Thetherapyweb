// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
/* app.get("/", function(req, res) {
    res.send("Hello world!");
}); */

// Create a route for root for the pug index file
//push variables from your express app into the template
/* app.get("/", function(req, res) {
    res.render("index", 
    {'title':'My index page', 'heading':'My headingyesyesyes'});
});
 */

// rendering rows of content iterating in pug
app.get("/", function(req, res) {
    // Set up an array of data
    var test_data = ['one', 'two', 'three', 'four'];
    // Send the array through to the template as a variable called data
    res.render("index", {'title':'My index page', 'heading':'My heading', 'data':test_data});
});


// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
   var sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

//displaying json results of all student programmes
app.get('/all-student', function(req ,res){
   
    sql = 'select * from Students';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
})

//task2 display a formatted list
app.get('/student-formatted', function(req ,res) {
    var sql = 'select * from Students';
   
    db.query(sql).then(results => {
       res.render('all-students', {data:results});
    });
})

//link to the single student page
app.get("/single-student/:id", function(req, res){
    var stId = req.params.id;
    console.log(stId);
    var stSql = "select s.name as student, ps.name as programme, ps.id as pcode from Students s\
    join Student_Programme sp on sp.id = s.id\
    join Programmes ps on ps.id = sp.programme\
    where s.id = ?";

    var modSql = "select * from Programme_Modules pm \
    join Modules m on m.code = pm.module \
    where programme = ?";
    
    db.query(stSql, [stId]).then(results => {
        console.log(results);
        var pCode = results[0].pcode;
        output = '';
        output += '<div><b> Student : </b>' + results[0].student + '</div>' ;
        output += '<div><b> Programme : </b>' + results[0].programme + '</div>' ;
        
        
        //call the database for the modules
         db.query(modSql, [pCode]).then(results => {
            
            output += '<table border = "1px">';
            for (let row of results){
                output += '<tr>';
                output += '<td>' + row.module + '</td>';
                output += '<td>' + row.name + '</td>';
                output += '</tr>'
            }
            output += '</table>';
        
            res.send(output);
        });
    });
});




// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});