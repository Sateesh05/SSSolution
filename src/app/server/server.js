let express = require('express');
let mysql = require('mysql');
let cors = require('cors');
let bodyparser = require('body-parser');
const { createConnection } = require('net');
app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

let connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Hyderabad8',
    database: 'ssdb',
    port: 3306
  }
);
// get Records Of Department Table
app.get('/department', (req, res) => {
  connection.query(`select * from department`, (err, records, fields) => {
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
  let query = req.query.dept == 0 ? `select * from employee` : `select * from employee where department_id = ${req.query.dept}`;
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

  let query = `select department_id,role,id,name from employee where email = '${req.body.email}'and password = '${req.body.password}'`;

  //console.log(query);
  connection.query(query, (err, record, fields) => {
    if (err) throw err;
    else {
      if (record.length > 0) {
        res.send(record)

      };
    };
  })
});

//get recods of leaveRequest Table acorrding to user login
app.get('/leaveRequest', (req, res) => {
  let query = (req.query.departmentName == "Hr Department" && req.query.role == "TeamManager") ? `select * from leave_table` : `select * from leave_table where userid= ${req.query.userid} or reportingPerson_id= ${req.query.reportingPerson_id}`;
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
  let query = `select * from leave_table where userid=${req.params.userid}`;
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
    if (err) throw err;
    else {
      res.send({ insert: 'success' });
    }
  })
});
//insert employee method
app.post('/employee', (req, res) => {
  connection.query(`insert into employee(name,gender,age,experiance,mobileNumber,email,password
   ,address,dateOfJoining,designation,department_id,role)
  values('${req.body.employee.name}','${req.body.employee.gender}','${req.body.employee.age}',
  '${req.body.employee.experiance}',${req.body.employee.mobileNumber},'${req.body.employee.email}',
  '${req.body.employee.password}','${req.body.employee.address}',
  '${req.body.employee.dateOfJoining}','${req.body.employee.designation}',
  ${req.body.employee.department_id},
  '${req.body.employee.role}')`, (err, result) => {
    if (err) throw err;
    else {
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
    values(${req.body.leave.userid},'${req.body.leave.subject}','${req.body.leave.reason}','${req.body.leave.reportingPerson_id}',
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
    role= '${req.body.employee.role}' where id= ${req.params.id}`, (err, result) => {
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
