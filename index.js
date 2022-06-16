const inquirer = require("inquirer");
const db = require("./db/connection");
require("console.table");

const Questions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a new department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
        message: "What do you want to do?",
      },
    ])

    .then((answers) => {
      // switch(answers.options){
      //   case "View all Departments":
      //     viewDepartments();
      //   break;
      //   case "View all Roles":
      //   getRoles()
      //   break;
      //   case "View all Employees":
      //   break;
      //   }
      if (answers.options === "View all departments") {
        viewDepartments();
      }
      if (answers.options === "View all roles") {
        getRoles();
      }
      if (answers.options === "View all employees") {
        getEmployee();
      }
      if (answers.options === "Add a new department") {
        addDep();
      }
      if (answers.options === "Add a role") {
        addRoles();
      }
      if (answers.options === "Add an employee") {
        addEmp();
      }
      if (answers.options === "Update an employee role") {
        updateEmployeeRole();
      }else process.exit()
    });
};

const viewDepartments = () => {
  console.log("this funtion is running");
  // Query all records in department table
  db.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
    // Show main menu
    Questions();
  });
};
// function seeDepartments (){
//   const data = db.query("SELECT * FROM department")
//   displayDepat(data)
// }
// function displayDepat(results){

// console.table(results)
// }

// View all roles
const getRoles = () => {
  // Query all records in role table
  db.query(`SELECT * FROM  role`, function (err, results) {
    console.table(results);
    // Show main menu
    Questions();
  });
};

// View all employees
const getEmployee = () => {
  // Query all records in employee table
  db.query(`SELECT * FROM employee`, function (err, results) {
    console.table(results);
    // Show main menu
    Questions();
  });
};

// Add a department
const addDep = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the new department called?",
      },
    ])
    .then((answers) => {
      createDepartment(answers.name);
    });
};

// Create a new department in the database
const createDepartment = (name) => {
  db.query("INSERT INTO department SET ?", { name: name }, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(`Department called ${name} created`, "\n");
    // Show main menu
    Questions();
  });
};

// Add a role
const addRoles = () => {
  db.query("SELECT * FROM department", (err, res) => {
    let departmentList = res.map((detlist) => ({
      name: detlist.name,
      value: detlist.id,
    }));

    // Prompt user
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "Please enter the name of the role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Please enter a salary:",
        },
        {
          type: "list",
          name: "department",
          choices: departmentList,
          message: "Please assign the role to a department",
        },
      ])
      .then((answers) => {
        createRole(answers.name, answers.salary, answers.department);
      });
  });
};

// Create a new role in the database
const createRole = (name, salary, department) => {
  db.query(
    "INSERT INTO role SET ?",
    {
      title: name,
      salary: salary,
      department_id: department,
    },
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(`Role called ${name} created`, "\n");
      // Show main menu
      Questions();
    }
  );
};

const addEmp = () => {
  db.query("SELECT * FROM role", (err, res) => {
    let roleList = res.map((role) => ({
      name: role.title,
      value: role.id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "whats is the employee first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "whats is the employee last name?",
        },
        {
          type: "list",
          name: "role",
          choices: roleList,
          message: "Please assign the role to a employee",
        },
      ])
      .then((answers) => {
        db.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answers.firstName,
            last_name: answers.lastName,
            role_id: answers.role,
          },
          (err, res) => {
            if (err) {
              console.log(err);
            }
            console.log("employee successfully added");
            Questions();
          }
        );
      });
  });
};


//update an existing employee role
const updateEmployeeRole = () => {
  db.query(`SELECT * FROM role`, (err, res) => {
    if (err) throw err;
    let role = res.map((roles) => ({ name: roles.title, value: roles.id }));
    db.query(`SELECT * FROM employee`, (err, res) => {
      if (err) throw err;
      let employee = res.map((employees) => {
        return {
          name: employees.first_name + " " + employees.last_name,
          value: employees.id,
        };
      });
      console.log(employee);
      inquirer.prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to update the role for?",
            choices: employee,
          },
          {
            type: "list",
            name: "newRole",
            message: "What should the employee's new role be?",
            choices: role,
          },
        ])
        .then((answers) => {
          db.query(
            `UPDATE employee SET ? WHERE ?`,
            [
              {
                role_id: answers.newRole,
              },
              {
                id: answers.employee,
              },
            ],
            (err, res) => {
              if (err) throw err;
              console.log(
                `\n Successfully updated employee's role in the database! \n`
              );
              Questions();
            }
          );
        });
    });
  });
}


Questions();

