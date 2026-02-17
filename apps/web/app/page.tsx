"use client";

import { useEffect, useState } from "react";
import { Cadence, EnrollmentState } from "@/types/cadence";
import { apiFetch } from "@/lib/api";


const defaultCadence: Cadence = {
  id: "cad_123",
  name: "Welcome Flow",
  steps: [
    {
      id: "1",
      type: "SEND_EMAIL",
      subject: "Welcome",
      body: "Hello there",
    },
    {
      id: "2",
      type: "WAIT",
      seconds: 10,
    },
    {
      id: "3",
      type: "SEND_EMAIL",
      subject: "Follow up",
      body: "Checking in",
    },
  ],
};

export default function Home() {
  const [cadenceJson, setCadenceJson] = useState(
    JSON.stringify(defaultCadence, null, 2)
  );
  const [cadenceId, setCadenceId] = useState("");
  const [contactEmail, setContactEmail] = useState("test@example.com");
  const [enrollmentId, setEnrollmentId] = useState("");
  const [state, setState] = useState<EnrollmentState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Poll enrollment state
  useEffect(() => {
    if (!enrollmentId) return;

    const interval = setInterval(async () => {
      try {
        const data = await apiFetch<EnrollmentState>(
          `/enrollments/${enrollmentId}`
        );
        setState(data);
      } catch {
        // Silent fail while API is unavailable
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [enrollmentId]);

  async function createCadence() {
    const cadence = parseCadenceSafely();
    if (!cadence) return;

    try {
      const result = await apiFetch<{ id: string }>("/cadences", {
        method: "POST",
        body: JSON.stringify(cadence),
      });

      setCadenceId(result.id);
    } catch (err: any) {
      setError('Failed to Create Cadence: '+err.message);
    }
  }

  function parseCadenceSafely(): Cadence | null {
    try {
      setError(null);
      return JSON.parse(cadenceJson);
    } catch {
      setError("Invalid JSON format");
      return null;
    }
  }

  async function updateCadence() {
    const cadence = parseCadenceSafely();
    if (!cadence) return;

    try {
      await apiFetch(`/cadences/${cadence.id}`, {
        method: "PUT",
        body: JSON.stringify(cadence),
      });
    } catch (err: any) {
      setError('Failed to Update Cadence: '+err.message);
    }
  }


  async function enroll() {
    try {
      const result = await apiFetch<{ id: string }>("/enrollments", {
        method: "POST",
        body: JSON.stringify({
          cadenceId,
          contactEmail,
        }),
      });

      setEnrollmentId(result.id);
    } catch (err: any) {
      setError(err.message);
    }
  }


  async function updateRunningCadence() {
    const cadence = parseCadenceSafely();
    if (!cadence) return;

    try {
      await apiFetch(`/enrollments/${enrollmentId}/update-cadence`, {
        method: "POST",
        body: JSON.stringify({
          steps: cadence.steps,
        }),
      });
    } catch (err: any) {
      setError(err.message);
    }
  }


  return (
    <>
      <h1>Email Cadence Manager</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>
          {error}
        </div>
      )}

      <div className="section">
        <h2>Cadence Definition</h2>
        <textarea
          rows={18}
          value={cadenceJson}
          onChange={(e) => setCadenceJson(e.target.value)}
        />
        <br />
        <button onClick={createCadence} disabled={loading}>
          Create Cadence
        </button>
        <button onClick={updateCadence}>Update Cadence</button>
      </div>

      <div className="section">
        <h2>Enroll Contact</h2>
        <input
          placeholder="Cadence ID"
          value={cadenceId}
          onChange={(e) => setCadenceId(e.target.value)}
        />
        <input
          placeholder="Contact Email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <br />
        <button onClick={enroll}>Start Enrollment</button>
      </div>

      <div className="section">
        <h2>Enrollment State</h2>

        <div className="status-box">
          <p>
            <strong>Enrollment ID:</strong> {enrollmentId || "-"}
          </p>
          <p>
            <strong>Status:</strong> {state?.status || "-"}
          </p>
          <p>
            <strong>Current Step Index:</strong>{" "}
            {state?.currentStepIndex ?? "-"}
          </p>
          <p>
            <strong>Steps Version:</strong> {state?.stepsVersion ?? "-"}
          </p>
        </div>

        {enrollmentId && (
          <button onClick={updateRunningCadence}>
            Update Running Workflow
          </button>
        )}
      </div>
    </>
  );
}
