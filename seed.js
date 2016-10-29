const models = require('./models');
const Agency = models.Agency;
const User = models.User;
const EMAIL = process.argv[2];
const PASSWORD = process.argv[3];

function createAdmin(agencyId, fn) {
  // Delete existing account in case
  // admin account password is lost
  User.findOneAndRemove({ email: EMAIL }, () => {
    const user = new User();
    user.email = EMAIL;
    user.password = user.generateHash(PASSWORD);
    user.agency = agencyId;
    user.is_admin = true;
    user.save()
      .then(u => fn(null, u))
      .catch(e => fn(e));
  });
}

function findOrCreateAgency(fn) {
  Agency.findOne({ name: 'Nashville Helps' })
    .then(agency => {
      fn(null, agency._id);
    })
    .catch(() => {
      const agency = new Agency({
        name: 'Nashville Helps',
        phone: '123456789',
      });
      agency.save()
        .then(a => fn(null, a._id))
        .catch(e => fn(e));
    });
}

if (!EMAIL || !PASSWORD) {
  console.log('Email and password required');
  process.exit();
} else {
  findOrCreateAgency((error, agencyId) => {
    if (error) {
      console.log(error);
    } else {
      createAdmin(agencyId, (e, u) => {
        if (e) {
          console.log(e);
        } else {
          console.log(`${u.email} created successfully`);
        }
        process.exit();
      });
    }
  });
}

