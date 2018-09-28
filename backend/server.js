'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Issue = require('./models/Issue');

var _Issue2 = _interopRequireDefault(_Issue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//quick implementation for running express serbver check
/*const app=express();
app.get('/',(req,res)=>res.send("Hello World!"));
app.listen(4000,()=>console.log('Express Server Running on port 4000'));*/

var app = (0, _express2.default)();

//importing the data from mongoDB schema

var router = _express2.default.Router();

app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());

//establishing the MongoDB connection
//mongoose.connect('mongodb://localhost:27017/issues'); // for local

// for online
_mongoose2.default.connect('mongodb://user1:user123@ds227332.mlab.com:27332/institute_db');
var connection = _mongoose2.default.connection;

connection.once('open', function () {
    console.log('MongoDB database connection establish successfully');
});

//routing creation

//router ceation for getting all the list of issues from database for default url(list page)
router.route('/issues').get(function (req, res) {
    _Issue2.default.find(function (err, issue) {
        if (err) console.log(err);else res.json(issue);
    });
});

//routing for getting the specific issues with particular id from database to page(edit page)

router.route('/issues/:id').get(function (req, res) {
    _Issue2.default.findById(req.params.id, function (err, issue) {
        if (err) console.log(err);else res.json(issue);
    });
});

// creating an issues to add it to databse from page(create page)

router.route('/issues/create').post(function (req, res) {
    var issue = new _Issue2.default(req.body);
    issue.save().then(function (issue) {
        res.status(200).json({ 'issue': 'Added Successfully' });
    }).catch(function (err) {
        res.status(400).send('Failed to create a new record');
    });
});

//updating the issues to the databse from the page

router.route('/issues/update/:id').post(function (req, res) {
    _Issue2.default.findById(req.params.id, function (err, issue) {
        if (!issue) return next(new Error('Could not load the issue.'));else {
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;

            issue.save().then(function (issue) {
                res.json('Updated the issue Successfully');
            }).catch(function (err) {
                res.status(400).send('Cannot Update the issue');
            });
        }
    });
});

//deleting the issue from database from page

router.route('/issues/delete/:id').get(function (req, res) {
    _Issue2.default.findByIdAndRemove({ _id: req.params.id }, function (err, issue) {
        if (err) res.json(err);else res.json('Issues Removed Successfully!');
    });
});

app.use('/', router);

app.listen(1643, function () {
    return console.log('Express Server Running on port 4000');
});