CredentialChain
Tamper-Evident Academic Transcripts & Certificate Verification
This guide explains how to install, start, configure, and test
CredentialChain from beginning to end. Follow the steps in order.
1. Project overview
CredentialChain is a React + Node.js/Express + MongoDB application for
academic certificate registration and verification. It supports
role-based workflows for administrators, institutions, and recruiters.
Certificate files can be hashed with SHA-256, and supported actions can
be recorded in audit logs.
Main roles
- ADMIN: review institutions, approve or reject them, and review
  audit logs.
- INSTITUTION: register certificates after approval.
- RECRUITER: verify certificates and view permitted verification
  history.
Available features depend on the exact version of the source code.
2. Requirements
Install the following:
1. Node.js (prefer a current LTS version) and npm.
2. MongoDB Community Server, or access to a MongoDB database.
3. Visual Studio Code or another code editor.
4. Chrome, Edge, or Firefox.
Check installation in a terminal:
node --version
npm --version
If either command is not recognised, install Node.js and reopen the
terminal.

If using local MongoDB, confirm the MongoDB service is running. MongoDB
Compass can be used to test the connection mongodb://127.0.0.1:27017.
3. Project structure
The project should look similar to this:
CredentialChain/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
Your exact folders may differ. Do not delete existing project files to
match this example.
4. Open the project
1. Download or extract the complete project folder.
2. Open the folder containing both backend and frontend in VS Code.
3. Select Terminal → New Terminal.
4. Make sure the terminal is at the project root.
5. Configure and start the backend
Step 5.1 --- Install backend dependencies
cd backend
npm install
Step 5.2 --- Create backend/.env
Create a file named .env inside backend (not .env.txt) and add
this template:
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/credentialchain
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET_OF_AT_LEAST_32_CHARACTERS
Replace the example JWT secret with a private random string of at least
32 characters.

Important: Check server.js and your authentication/JWT utility to
confirm the exact environment-variable names. If the code expects
JWT_SECRET_KEY instead of JWT_SECRET, use the name the code actually
reads. Add any other required variables shown in your code. Never commit
.env or share your real secrets.
Step 5.3 --- Start MongoDB
Start the MongoDB Community Server service before starting the backend.
The example connection string uses a local database named
credentialchain.
Step 5.4 --- Start the backend server
Run the script that exists in backend/package.json. If it defines
start, use:
npm start
If it defines dev, you can use:
npm run dev
Keep this terminal open. Confirm that the server starts and connects to
MongoDB. If it fails, read the first meaningful error in the terminal
and fix it before continuing.
6. Configure and start the frontend
Step 6.1 --- Open a second terminal
Keep the backend terminal running. Select Terminal → New Terminal in
VS Code.
Step 6.2 --- Install frontend dependencies
From the project root:
cd frontend
npm install
Step 6.3 --- Check the API URL
Open frontend/src/services/api.js (or the equivalent API service
file). The API base URL commonly needs to be:
http://localhost:5000/api
If the project uses a Vite environment variable, check the variable name
in the source code. Vite client environment variables normally start
with VITE_.
Step 6.4 --- Run the frontend
npm run dev
Open the local URL printed by Vite, commonly http://localhost:5173.
Keep both terminal windows open while using the application.
7. First-time setup and end-to-end test
Follow these steps in order.
Step 1 --- Open the application
Visit the frontend URL printed by Vite.
Step 2 --- Create or sign in as ADMIN
Use the registration page to create an ADMIN account if your local
development version permits role selection. Otherwise, sign in with an
existing admin account or use your project's trusted admin setup
process.

Security warning: public administrator self-registration is unsafe
for a real deployment. Restrict admin creation before putting the app
online.
Step 3 --- Register an institution account
1. Sign out of admin.
2. Register a new account with the INSTITUTION role.
3. Complete the institution details requested by the form.
4. Sign in as admin again.
The new institution may initially be marked PENDING.
Step 4 --- Approve the institution
1. Open Institution Verification, commonly /admin/institutions.
2. Find the new institution.
3. Review its details.
4. Click Approve.
5. Confirm that its status changes to verified/approved.
If rejecting an institution for testing, enter a reason if the form
requests one. An unapproved institution generally cannot register
certificates.
Step 5 --- Register a test certificate
1. Sign out of admin.
2. Sign in using the approved institution account.
3. Open the certificate registration page.
4. Enter the required student name, roll number, degree, graduation
   year, and any other required fields.
5. Select a valid PDF if the form requires a certificate file.
6. Submit the form.
7. Confirm that the certificate appears in the list or that the success
   message is shown.
Use fictional test data and a PDF you are authorised to use. Avoid
uploading real student records to a demo application without permission.
Step 6 --- Verify the certificate
1. Sign out and sign in as RECRUITER.
2. Open Verify Certificate.
3. Enter the identifier(s) requested by the page.
4. Submit the verification request.
5. Check whether the result indicates a valid, invalid, or revoked
   certificate.
Use the exact identifier expected by your current interface.
Step 7 --- Check verification history
Open Verification History as a role allowed to access it. Confirm
that the verification attempt appears if the project records
verification history.
Step 8 --- Check audit logs
1. Sign in as ADMIN.
2. Open Audit Logs, commonly /audit-logs.
3. Review the newest entries and timestamps.
Audit records are written when the corresponding backend action
explicitly calls the audit utility. Simply opening the audit page does
not create events. Older actions are not automatically added
retroactively unless the project implements that feature.
8. Common local URLs
These are defaults only; use the URLs configured in your project.
  Purpose                             Common URL
  Frontend                            http://localhost:5173

  Backend                             http://localhost:5000

  API base                            http://localhost:5000/api

  Institution administration          http://localhost:5173/admin/institutions
  Audit logs                          http://localhost:5173/audit-logs
If a page returns "not found," check the routes in
frontend/src/App.jsx.
9. Troubleshooting
MongoDB connection refused
1. Start the MongoDB service.
2. Check MONGODB_URI in backend/.env.
3. Confirm host, port, database credentials, and network access.
4. Restart the backend.
JWT secret missing or too short
1. Check the exact variable name read by the backend.
2. Set a private random secret at least 32 characters long.
3. Save .env.
4. Stop and restart the backend.
Port already in use (EADDRINUSE)
Another process is using the port. Stop the old server or configure a
different port. Make sure the frontend API URL matches the backend port.
Frontend cannot reach backend
1. Confirm the backend is running.
2. Check the API base URL in the frontend service file.
3. Check browser Developer Tools → Console and Network.
4. Check backend terminal errors.
5. Confirm CORS permits the frontend origin.
Login redirects back to login
1. Inspect failed authentication requests in Developer Tools →
   Network.
2. Confirm login stores the token using the storage key expected by the
   API interceptor.
3. Confirm the interceptor sends the token in the format expected by
   the backend.
4. Check JWT configuration, account status, and role permissions.
Institution cannot register certificates
1. Sign in as admin and check that the institution is approved.
2. Confirm the institution user is linked to the correct
   institutionId.
3. Check backend validation and authorization errors.
Audit Logs shows total: 0
1. Perform a new action that should be logged.
2. Confirm the relevant controller calls the audit-writing utility.
3. Confirm the utility import matches its export. For example, if
   utils/audit.js contains module.exports = writeAuditLog, import
   it with const writeAuditLog = require("../utils/audit");.
4. Confirm backend and frontend are using the same MongoDB database.
5. Refresh Audit Logs and inspect the backend terminal.
An empty result means the database query found no audit documents; it
does not prove audit writing is working.
ClipboardCheck is not defined or another icon is undefined
Every Lucide icon used in JSX must be imported from lucide-react. For
example:
import { ClipboardCheck } from "lucide-react";
npm install fails
1. Confirm you are in the correct folder (backend or frontend).
2. Check Node.js/npm versions.
3. Read the first dependency error and check package.json.
4. Do not force-install dependencies or delete the lock file as your
   first fix.
PDF upload fails
Check that the file is a valid PDF and within the configured size limit.
Inspect upload middleware, destination-folder permissions, and the
backend error. Do not disable file validation just to bypass the
problem.
10. Useful commands
Run these from the relevant folder:
npm install
npm start
Or, if a development script exists:
npm run dev
Press Ctrl + C in a server terminal to stop that process.
11. Security checklist before deployment
- [ ] Restrict who can create ADMIN accounts.
- [ ] Never commit .env, JWT secrets, or database credentials.
- [ ] Use HTTPS and secure production database access.
- [ ] Enforce authentication, role permissions, and institution
  ownership on the backend.
- [ ] Validate PDF uploads, file size, file type, and storage paths.
- [ ] Protect student information and limit access to authorised
  users.
- [ ] Review whether every important action is recorded in audit logs.
- [ ] Do not expose stack traces or secrets in API responses.
- [ ] Back up the database and decide how uploaded certificates will
  be retained.
- [ ] Test institution approval, certificate registration,
  verification, and audit logging before release.
12. Final checklist
- [ ] Install Node.js and MongoDB.
- [ ] Open the project in VS Code.
- [ ] Install backend dependencies.
- [ ] Create and configure backend/.env.
- [ ] Start MongoDB.
- [ ] Start the backend and confirm database connection.
- [ ] Install frontend dependencies.
- [ ] Start the frontend and open the Vite URL.
- [ ] Sign in as admin.
- [ ] Register an institution and approve it.
- [ ] Register a test certificate as the institution.
- [ ] Verify the certificate as a recruiter.
- [ ] Check verification history and audit logs.
