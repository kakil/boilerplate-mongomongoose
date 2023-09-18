require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  favoriteFoods: {
    type: [String]
  }
});

let Person;
Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  const personData = {
    name: 'John Doe',
    age: 30,
    favoriteFoods: [ 'Pizza', 'Sushi' ]
  };

  const person = new Person(personData);

  person.save((err, savedPerson) => {
    if (err) {
      return done(err);
    }
    done(null, savedPerson);
  });
  
};

const arrayOfPeople = [
  { name: 'Alice', age: 25, favoriteFoods: ['Burger', 'Salad'] },
  { name: 'Bob', age: 30, favoriteFoods: ['Pasta', 'Ice cream'] }
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, createdPeople) => {
    if (err) {
      return done(err);
    }
    done(null, createdPeople);
  });
  
};

const findPeopleByName = (personName, done) => {
  Person.find( {name: personName}, (err, foundPersons) => {
    if (err) {
      return done(err);
    }
    done(null, foundPersons);
  });
  
};

const findOneByFood = (food, done) => {
  Person.findOne( {favoriteFoods: { $in: [food] } }, (err, foundFood) => {
    if(err) {
      return done(err);
    }
    done(null, foundFood);
  });
};

const findPersonById = (personId, done) => {
  Person.findById( personId, (err, foundId) => {
    if(err) {
      return done(err);
    }
    done(null, foundId);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, foundPerson) => {
    if (err) {
      return done(err);
    }

    if (!foundPerson) {
      return done(new Error('Person not found.'));
    }

    // Add "hamburger" to the list of favoriteFoods
    foundPerson.favoriteFoods.push(foodToAdd);

    // Save the updated Person
    foundPerson.save((err, updatedPerson) => {
      if (err) {
        return done(err);
      }
      done(null, updatedPerson);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName },
    { $set: { age: 20 } },
    { new: true }, // Return the updated document
    (err, updatedPerson) => {
      if (err) {
        return done(err);
      }

      if (!updatedPerson) {
        return done(new Error('Person not found.'));
      }

      done(null, updatedPerson);
    }
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removePerson) => {
    if (err) {
      return done(err);
    }

    if(!removePerson) {
      return done(new Error('Person not found'));
    }
    
    done(null, removePerson);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err, response) => {
    if(err) return console.log(err);
    done(null, response);
  })
};



const queryChain = (done) => {
  const foodToSearch = "burrito";

  // Find people who like the specified food, sort by name, limit results to two, and hide their age
  Person.find({ favoriteFoods: foodToSearch })
    .sort('name')
    .limit(2)
    .select('-age')
    .exec((err, data) => {
      if (err) {
        return done({ error: err.message });
      }
      done(null, data);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
