import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

//importing the data from mongoDB schema

import Issue from './models/Issue';

//quick implementation for running express serbver check
/*const app=express();
app.get('/',(req,res)=>res.send("Hello World!"));
app.listen(4000,()=>console.log('Express Server Running on port 4000'));*/

const app=express();
const router=express.Router();


app.use(cors());
app.use(bodyParser.json());
  

//establishing the MongoDB connection
//mongoose.connect('mongodb://localhost:27017/issues'); // for local

// for online
mongoose.connect('mongodb://user1:user123@ds227332.mlab.com:27332/institute_db');
const connection=mongoose.connection;

 
connection.once('open',()=>{
    console.log('MongoDB database connection establish successfully');
});

//routing creation

//router ceation for getting all the list of issues from database for default url(list page)
router.route('/issues').get((req,res)=>{
     Issue.find((err,issue)=>{
        if(err)
         console.log(err);
         else
         res.json(issue);
     });
});

//routing for getting the specific issues with particular id from database to page(edit page)

router.route('/issues/:id').get((req,res)=>{
      Issue.findById(req.params.id,(err,issue)=>{
          if(err)
           console.log(err);
           else
           res.json(issue);
      });

});

// creating an issues to add it to databse from page(create page)

router.route('/issues/create').post((req,res)=>{
    let issue=new Issue(req.body);
    issue.save()
       .then(issue=>{
           res.status(200).json({'issue':'Added Successfully'});
       })
       .catch(err=>{
           res.status(400).send('Failed to create a new record');
       });
});

//updating the issues to the databse from the page

router.route('/issues/update/:id').post((req,res)=>{
    Issue.findById(req.params.id,(err,issue)=>{
            if(!issue)
                return next(new Error('Could not load the issue.'));
            else{
                issue.title=req.body.title;
                issue.responsible=req.body.responsible;
                issue.description=req.body.description;
                issue.severity=req.body.severity;
                issue.status=req.body.status;

                issue.save().then(issue=>{
                    res.json('Updated the issue Successfully');
                }).catch(err=>{
                    res.status(400).send('Cannot Update the issue');
                });
            }
    });
});

//deleting the issue from database from page

router.route('/issues/delete/:id').get((req,res)=>{
    Issue.findByIdAndRemove({_id:req.params.id},(err,issue)=>{
        if(err)
           res.json(err);
        else
           res.json('Issues Removed Successfully!');
    });
});

app.use('/',router);

app.listen(4000,()=>console.log('Express Server Running on port 4000'));