# Email Cadence Monorepo

This is a TypeScript monorepo implementing an **email cadence system** using:

- **Next.js** – Frontend  
- **NestJS** – API backend  
- **Worker folder** – Temporal.io workflows (mock/placeholder)

---

## Monorepo Structure

repo/
├─ apps/
│ ├─ web/ # Next.js frontend
│ ├─ api/ # NestJS backend API
│ └─ worker/ # Temporal.io worker folder (mock / placeholder)
├─ package.json
├─ tsconfig.base.json
└─ README.md



---

## Installation

git clone https://github.com/PiemEscy/repo.git
cd repo
npm install

---

## Start All Apps

cd repo
npm run dev


---

## API Usage

- **Create a Cadence**
POST /cadences
Headers: Content-Type: application/json
Body:
{
  "id": "cad_123",
  "name": "Welcome Flow",
  "steps": [
    { "id": "1", "type": "SEND_EMAIL", "subject": "Welcome", "body": "Hello there" },
    { "id": "2", "type": "WAIT", "seconds": 10 },
    { "id": "3", "type": "SEND_EMAIL", "subject": "Follow up", "body": "Checking in" }
  ]
}

- **Start Enrollment**
POST /enrollments
Headers: Content-Type: application/json
Body:
{
  "cadenceId": "cad_123",
  "contactEmail": "user@example.com"
}
Workflow Logs (API console):
{
  "success": true,
  "messageId": "mock-msg-5414",
  "timestamp": 1771315355131
}
[SEND_EMAIL] To: user@example.com, Subject: Welcome, Body: Hello there
[SEND_EMAIL] To: user@example.com, Subject: Follow up, Body: Checking in

- **Start Enrollment**
GET /enrollments/mock-<timestamp>
Sample Response:
{
  "id": "mock-<timestamp>",
  "cadenceId": "cad_123",
  "contactEmail": "user@example.com",
  "currentStepIndex": 2,
  "stepsVersion": 1,
  "status": "COMPLETED",
  "steps": [ ... ],
  "sentEmails": [
    { "success": true, "messageId": "mock-msg-1234", "timestamp": 1676543212345 }
  ]
}

- **Update a Running Enrollment**
POST /enrollments/mock-<timestamp>/update-cadence
Headers: Content-Type: application/json
Body:
{
  "steps": [
    { "id": "1", "type": "SEND_EMAIL", "subject": "Hello Again", "body": "Updated email" }
  ]
}


---

## Behavior:

- Already completed steps remain completed.
- Workflow continues from currentStepIndex.
- stepsVersion is incremented.
- Status is marked COMPLETED if new steps are fewer than currentStepIndex.


