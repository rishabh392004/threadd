const query = `
  query GetUserToken($email: String!, $password: String!) {
    getUserToken(email: $email, password: $password)
  }
`;

// Use the email of the user we created earlier
const email = "jane.doe.1781159578475@example.com";

async function run() {
  try {
    // 1. Test login with correct password
    console.log("Attempting login with correct password...");
    const responseSuccess = await fetch('http://localhost:8000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { email, password: "password123" }
      })
    });
    const resultSuccess = await responseSuccess.json();
    console.log("Success Response:");
    console.log(JSON.stringify(resultSuccess, null, 2));

    // 2. Test login with incorrect password
    console.log("\nAttempting login with incorrect password...");
    const responseFail = await fetch('http://localhost:8000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { email, password: "wrong_password" }
      })
    });
    const resultFail = await responseFail.json();
    console.log("Fail Response:");
    console.log(JSON.stringify(resultFail, null, 2));

  } catch (error) {
    console.error("Error making request:", error);
  }
}

run();
