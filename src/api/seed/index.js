const User = require("../models/admin");

exports.seedAdmin = async () => {
  const superAdmin = {
    fullName: "Abraham",
    phoneNumber: "0985011172",
    username: "superadmin",
    profilePicture: "avatar.jpg",
    role: "admin",
    password: "p@55w0rd_420",
  };
  const users = await User.findOne({ role: "admin" });

  if (!users) {
    const res = await User.create(superAdmin);
    console.log(res);
  }

  console.log(
    `\n\n\tPhoneNum: ${superAdmin.phoneNumber}\n\tUsername: ${superAdmin.username}\n\tPassword: ${superAdmin.password}\n\n`
  );
};
