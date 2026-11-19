import { useState } from "react";

const WorkerFormContainer = ({ onRegister }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleaned = name.trim().replace(/\s+/g, " ");
    if (!cleaned) {
      setError("Enter the worker's name.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await onRegister(cleaned);
      setName("");
    } 
    catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section id="FormContainer">
        <form id="studentForm" onSubmit={handleSubmit} noValidate>
         
          <div className="input-fields">
            <button id="generateBtn" type="submit" disabled={submitting}>
              {submitting ? "Generating..." : "Generate QR Code"}
            </button>
            <input type="text" name="name" id="workerName" placeholder="Worker's Name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
          </div>

          {error && (
            <p className="form-error" role="alert"> {error} </p>
          )}
        </form>
      </section>
    </>
  );
};

export default WorkerFormContainer;