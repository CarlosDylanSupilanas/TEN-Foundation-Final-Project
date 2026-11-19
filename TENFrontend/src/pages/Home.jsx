import { useMemo } from "react";
import { Link } from "react-router-dom";
import { isSignedIn } from "../utils/auth";
import "../site.css";

const STEPS = [
  {
    title: "1. Register",
    text: "Type the worker's name. Duplicate names are blocked, so nobody gets two IDs.",
  },
  {
    title: "2. Generate",
    text: "The system creates a unique worker ID and a QR code that holds the ID and name.",
  },
  {
    title: "3. Download",
    text: "Save the QR code as an image and print it on the worker's ID.",
  },
];

// Decorative sample QR pattern for the badge
const SIZE = 21;
const CORNERS = [[0, 0], [0, SIZE - 7], [SIZE - 7, 0]];

const makeRandom = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buildCells = () => {
  const rand = makeRandom(20260);
  const cells = [];

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      let dark = null;

      for (const [cr, cc] of CORNERS) {
        const lr = r - cr;
        const lc = c - cc;
        if (lr >= 0 && lr < 7 && lc >= 0 && lc < 7) {
          const edge = lr === 0 || lr === 6 || lc === 0 || lc === 6;
          const core = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
          dark = edge || core;
        } else if (lr >= -1 && lr <= 7 && lc >= -1 && lc <= 7) {
          dark = false;
        }
        if (dark !== null) break;
      }

      cells.push(dark === null ? rand() > 0.5 : dark);
    }
  }
  return cells;
};

const Home = () => {
  const cells = useMemo(buildCells, []);
  const signedIn = isSignedIn();

  return (
    <div className="site">
      <div className="site-header">
        <Link className="site-brand" to="/">Worker QR</Link>
        <nav>
          <Link className="site-btn site-btn-primary" to={signedIn ? "/admin" : "/signin"}>
            {signedIn ? "Open dashboard" : "Sign in"}
          </Link>
        </nav>
      </div>

      <main>
        <section className="site-hero">
          <div>
            <h1>Give every worker a QR ID that matches their record.</h1>
            
            <p className="site-lead">
              Register a worker once and get a unique ID and a QR code with their
              name on it. Download it and put it on their ID card.
            </p>

            <div className="site-hero-actions">
              <Link
                className="site-btn site-btn-primary site-btn-lg"
                to={signedIn ? "/admin" : "/signin"}
              >
                {signedIn ? "Open the dashboard" : "Sign in to the dashboard"}
              </Link>
            </div>
            {!signedIn && (
              <p className="site-hint">
                Admin access only. Accounts are created by your administrator.
              </p>
            )}
          </div>

          <figure className="site-badge" aria-label="Sample worker ID badge">
            <div className="site-badge-slot" aria-hidden="true" />
            <div className="site-qr" role="img" aria-label="Sample QR code">
              {cells.map((dark, i) => (
                <i key={i} className={dark ? "on" : undefined} />
              ))}
            </div>

            <figcaption>
              <strong>Supi At Lanas</strong>
              <span>WRK-4F9A2C</span>
            </figcaption>

          </figure>
        </section>

        <section className="site-steps" aria-labelledby="site-steps-title">
          <h2 id="site-steps-title">How it works</h2>
          <ol>
            {STEPS.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <div className="site-footer">
        <p>Worker QR</p>
      </div>
    </div>
  );
};

export default Home;
