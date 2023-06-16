const user = new Object();
user.name = "souvik";
user.age = "Ghosh";
user["full name"] = "souvik ghosh";
user.address = {
  city: "hyderabad",
  country: "India",
};

console.log(user);

for (let key in user) {
  console.log(key, user[key]);
}

let userCopy = Object.assign({}, user);
console.log(userCopy);

//stuctured clone not available in node by default we need to install stuctured-clone, however this is available in browser dom//
//let userDeepCopy = structuredClone(user);

user.address.city = "kolkata";

// city changes in user copy also, so it is shallow copy not a deep copy
console.log(userCopy);
//console.log(userDeepCopy);

//construction function
function Car(name, color) {
  // implicity assigns this ={}

  if (new.target === undefined) {
    return new Car(name, color);
  }
  // set property
  this.name = name;
  this.color = color;
  this.greet = function () {
    // here shorthand does not work like this.greet()
    console.log("Hello");
  };

  // returns this implicitely
}

let car = new Car("Honda", "Blue");
console.log(car);

car = Car("Honda", "Blue");
console.log(car); //undefined because this will not assigned and return as new is not used
console.log(car.greet());

let salary = {
  val: 100,
  currency: "$",
  [Symbol.toPrimitive]: function (hint) {
    console.log(hint);
    if (hint == "string") return "100 $";
    else return 100;
  },
};

console.log("My Salary is " + salary);
console.log(salary * 10);
