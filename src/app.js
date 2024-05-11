const fs = require("fs");
const express = require("express");
const app = express();

// Function to read user data from JSON file
const getUserData = () => {
  const rawdata = fs.readFileSync(`${__dirname}/data/userDetails.json`);
  return JSON.parse(rawdata);
};

// Function to write user data to JSON file
const writeUserData = (data) => {
  const stringData = JSON.stringify(data, null, 2);
  fs.writeFileSync(`${__dirname}/data/userDetails.json`, stringData);
};

// Route handler for creating new user
app.post("/api/v1/details", (req, res) => {
  // Get user data from request body
  const { name, mail, number } = req.body;

  // Validate user data
  if (!name || !mail || !number) {
    return res.status(400).json({
      status: "Error",
      message: "Please provide all required fields: name, mail, number",
    });
  }

  // Read existing user data
  const userData = getUserData();

  // Generate new user ID
  const newId = userData.length > 0 ? userData[userData.length - 1].id + 1 : 1;

  // Create new user object
  const newUser = { id: newId, name, mail, number };

  // Add new user to the data array
  userData.push(newUser);

  // Write updated user data to JSON file
  writeUserData(userData);

  // Send success response with newly created user
  return res.status(201).json({
    status: "Success",
    message: "User registered successfully",
    data: { newUser },
  });
});

// Function to test user registration (for development purposes)
const testUserRegistration = async (userData) => {
  try {
    const response = await fetch("/api/v1/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("Test User Registration Response:");
    console.log(data);

    if (response.status === 201) {
      console.log("✅ User registered successfully!");
    } else {
      console.error("❌ Error registering user:", data.message);
    }
  } catch (error) {
    console.error("Error during test:", error);
  }
};

// Example usage of test function (comment out for production)
// testUserRegistration({
//   name: "Test User",
//   mail: "test@example.com",
//   number: 1234567890,
// });

module.exports = app;
