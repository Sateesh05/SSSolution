let express = require('express');
let mysql = require('mysql');
let cors = require('cors');
let bodyparser = require('body-parser');
const { createConnection } = require('net');
app = express();
app.use(cors());
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

let connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'ssdb',
    port: 3306
  }
);
// get Records Of Department Table
app.get('/department', (req, res) => {
  connection.query(`select * from department  order by id desc`, (err, records, fields) => {
    if (err) throw err;
    else {
      res.send(records);
    };
  });
});
app.get('/department/:id', (req, res) => {
  connection.query(`select name,description from department where id = ${req.params.id}`,
    (err, records, fields) => {
      if (err) throw err;
      else {
        res.send(records);
      };
    });
});
const querystring = require('querystring');
const { count } = require('console');
//get All Records of employee Table where department_id
app.get('/allemployees', (req, res) => {
  //console.log(req.query)
  let query = req.query.dept == 0 ? `select * from employee  order by id desc` : `select * from employee where department_id = ${req.query.dept} order by id desc`;
  connection.query(query, (err, records, fields) => {
    if (err) throw err;
    else {
      res.send(records)
    };
  });
});
//get employeelist Ordered By role
app.get('/employee/:role', (req, res) => {
  connection.query(`select *from employee where role='${req.params.role}'`, (err, records, fields) => {
    if (err) throw err;
    else {
      res.send(records)
    };
  })
})
//get employeelist By id
app.get('/employee/Byid/:id', (req, res) => {
  let query = `select *from employee where id=${req.params.id}`;
  //console.log(query)
  connection.query(query, (err, records, fields) => {
    if (err) throw err;
    else {
      res.send(records)
    };
  })
})
//get employee by department_Id
app.get('/employee/dptd/:id', (req, res) => {
  connection.query(`select * from employee where department_id=${req.params.id}`,
    (err, records, fields) => {
      nn
      if (err) throw err;
      else {
        res.send(records);
      };
    });
});
//login authentication and get role,department_id
app.post('/login', (req, res) => {
  let isEmailquery = `select id from employee where email='${req.body.email}'`;
  connection.query(isEmailquery, (err, record, fields) => {
    if (err) throw err;
    else if (record == '') {
      // console.log(record)
      res.send({ message: '0email' })
    } else {
      // console.log(record[0].id)
      let isPsswordquery = `select id from employee where password='${req.body.password}'`;
      connection.query(isPsswordquery, (err, record, fields) => {
        if (err) throw err;
        else if (record == '') {
          //console.log(record)
          return res.send({ message: '0pswd' })
        } else {
          //res.send(record)
          let query = `select department_id,role,id,name,image from employee where email = '${req.body.email}'and password = '${req.body.password}'`;
          //console.log(query);
          connection.query(query, (err, record, fields) => {
            if (err) throw err;
            else {
              //console.log(record)
              if (record.length > 0) {
                res.send(record)
              } else {
                res.send(record)
              };
            };
          })
        }
      })
    }
  });
});

//get recods of leaveRequest Table acorrding to user login
app.get('/leaveRequest', (req, res) => {
  let query = (req.query.departmentName == "Hr department" && req.query.role == "TeamManager") ? `select * from leave_table  order by id desc` : `select * from leave_table  where reportingPerson_id= ${req.query.reportingPerson_id} order by id desc`;
  //console.log(query);
  connection.query(query, (err, records, fields) => {
    //console.log(query)
    if (err) throw err;
    else {
      res.send(records);
    };
  });
});
//get leave record By userid
app.get('/leaveRequest/userid/:userid', (req, res) => {
  let query = `select * from leave_table where userid=${req.params.userid} order by id desc`;
  //console.log(query);
  connection.query(query, (err, records, fields) => {
    if (err) throw err;
    else {
      res.send(records);
    };
  });
});
//insert department method
app.post('/department', (req, res) => {
  connection.query(`insert into department(name,description)values('${req.body.department.name}',
    '${req.body.department.description}')`, (err, result) => {
    if (err) {
      //console.log(err);
      res.send(err);
    }
    else {
      res.send({ insert: 'success' });
    }
  })
});
//insert employee method
app.post('/employee', (req, res) => {
  let query = `insert into employee(name,gender,age,experiance,mobileNumber,email,password
   ,address,dateOfJoining,designation,department_id,role,image)
  values('${req.body.employee.name}','${req.body.employee.gender}','${req.body.employee.age}',
  '${req.body.employee.experiance}',${req.body.employee.mobileNumber},'${req.body.employee.email}',
  '${req.body.employee.password}','${req.body.employee.address}',
  '${req.body.employee.dateOfJoining}','${req.body.employee.designation}',
  ${+req.body.employee.department_id},
  '${req.body.employee.role}','${req.body.employee.image}')`;
  //console.log(query);
  connection.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ insert: 'success' });
    }
  })
});
//insert leaveRequest method
app.post('/leaveRequest', (req, res) => {
  let update_Query = `update leave_table set action='Rejected' where action='Pending' and userid=${req.body.leave.userid} and
   dateOfleave < current_date()`;

  let count_Query = `select count(*) as count from leave_table where action='Pending' and dateOfleave='${req.body.leave.dateOfleave}'
  and userid=${req.body.leave.userid}`;
  //console.log(count_Query);
  let insert_Query = `insert into leave_table(userid,subject,reason,reportingPerson_id,dateOfleave,action )
    values(${req.body.leave.userid},'${req.body.leave.subject}','${req.body.leave.reason}',${req.body.leave.reportingPerson_id},
    '${req.body.leave.dateOfleave}','${req.body.leave.action}')`;

  connection.query(update_Query, (err, result) => {
    if (err) throw err;
  });
  connection.query(count_Query, (err, result) => {
    //console.log(result[0].count);
    if (err) throw err;
    else if (result[0].count > 0) {
      res.send({ insert: 'you have already applied leave at this date' });
    } else {
      connection.query(insert_Query, (err, result) => {
        if (err) throw err;
        else {
          res.send({ insert: 'success' });
        };
      });
    };
  });
});

//update department method
app.put('/department/:id', (req, res) => {
  const id = req.params.id;
  connection.query(`update department set name= '${req.body.department.name}',
    description='${req.body.department.description}' where id= ${id}`,
    (err, result) => {
      if (err) throw err;
      else {
        res.send({ update: 'success' });
      };
    });
});
//employee update method

app.put('/employee/:id', (req, res) => {
  //console.log(req.body.employee.image);
  connection.query(`update employee set name= '${req.body.employee.name}',
    gender= '${req.body.employee.gender}',
    age= '${req.body.employee.age}',
    experiance= '${req.body.employee.experiance}',
    mobileNumber= ${req.body.employee.mobileNumber},
    email= '${req.body.employee.email}',
    password= '${req.body.employee.password}',
    address= '${req.body.employee.address}',
    dateOfJoining= '${req.body.employee.dateOfJoining}',
    designation= '${req.body.employee.designation}',
    department_id = ${req.body.employee.department_id},
    role= '${req.body.employee.role}',
    image= '${req.body.employee.image}' where id= ${req.params.id}`, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      res.send({ update: 'success' });
    };
  });
});

//profile Update
app.put('/employee/profileUpdate/:id', (req, res) => {
  //console.log(req.body.employee.image);
  connection.query(`update employee set 
    name= '${req.body.employee.name}',
    gender= '${req.body.employee.gender}',
    age= '${req.body.employee.age}',
    mobileNumber= ${req.body.employee.mobileNumber},
    address= '${req.body.employee.address}',
    designation= '${req.body.employee.designation}' where id= ${req.params.id}`, (err, result) => {
    if (err) throw err;
    else {
      res.send({ update: 'success' });
    };
  });
});
//Remove Profile Pic
app.put('/employee/UpdateProfilePic/:id', (req, res) => {
  //console.log(req.body.employee.image);
  connection.query(`update employee set 
    image= '${req.body.employee.image}' where id= ${req.params.id}`, (err, result) => {
    if (err) throw err;
    else {
      res.send({ update: 'success' });
    };
  });
});

//update leaveRequest method
app.put('/leaveRequest/:id', (req, res) => {
  connection.query(`update leave_table set
  userid = ${req.body.leave.userid},
  subject = '${req.body.leave.subject}',
  reason = '${req.body.leave.reason}',
  reportingPerson_id = '${req.body.leave.reportingPerson_id}',
  dateOfleave = '${req.body.leave.dateOfleave}',
  action = '${req.body.leave.action}' where
  id = ${req.params.id}`, (err, result) => {
    if (err) throw err;
    else {
      res.send({ update: 'success' });
    };
  });
});
//leave Status Update by id
app.put('/leaveStatusUpdate/:id', (req, res) => {
  connection.query(`update leave_table set

  action = '${req.body.leave.action}' where id = ${req.params.id}`, (err, result) => {
    if (err) throw err;
    else {
      res.send({ update: 'success' });
    };
  });
});
//delete department method
app.delete('/department/:id', (req, res) => {
  const id = req.params.id;
  connection.query(`delete from department where id= ${id}`, (err, result) => {
    if (err) throw err;
    else {
      res.send({ delete: 'success' });
    };
  });
});
//delete employee method
app.delete('/employee/:id', (req, res) => {
  const id = req.params.id;
  //console.log(id);
  connection.query(`delete from employee where id= ${id}`, (err, result) => {
    if (err) throw err;
    else {
      res.send({ delete: 'success' });
    };
  });
});
//delete leaveRequest method
app.delete('/leaveRequest/:id', (req, res) => {
  connection.query(`delete from leave_table where id= ${req.params.id}`, (err, result) => {
    if (err) throw err;
    else {
      res.send({ delete: 'success' });
    };
  });
});
app.listen(8080);
console.log('server listening port no 8080');
