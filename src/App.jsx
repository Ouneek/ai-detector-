import { useEffect, useState } from "react";
import {
  Camera,
  Sparkles,
  Upload,
  X,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ShieldCheck,
  RotateCcw,
  History,
  Zap,
} from "lucide-react";

import "./App.css";

const ANALYSIS_STAGES = [
  "INITIALIZING ANALYSIS",
  "ANALYZING IMAGE",
  "IDENTIFYING PROBLEM",
  "ESTIMATING SEVERITY",
  "GENERATING FIX",
];

function App() {
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [analysisStage, setAnalysisStage] = useState(0);
  const [dragging, setDragging] = useState(false);

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("snapfix-history") || "[]"
      );
    } catch {
      return [];
    }
  });

  /* =========================================
     ANALYSIS STAGE ANIMATION
  ========================================= */

  useEffect(() => {
    if (!diagnosing) {
      setAnalysisStage(0);
      return;
    }

    setAnalysisStage(0);

    const interval = setInterval(() => {
      setAnalysisStage((prev) =>
        Math.min(prev + 1, ANALYSIS_STAGES.length - 1)
      );
    }, 360);

    return () => clearInterval(interval);
  }, [diagnosing]);

  /* =========================================
     FILE HANDLING
  ========================================= */

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10MB.");
      return;
    }

    if (image) {
      URL.revokeObjectURL(image);
    }

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);
    setSelectedFile(file);
    setResult(null);
    setError("");
  };

  const handleImageUpload = (e) => {
    processFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }

    setImage(null);
    setSelectedFile(null);
    setResult(null);
    setError("");
  };

  /* =========================================
     RESULT HELPERS
  ========================================= */

  const getCause = (problem = "") => {
    const text = problem.toLowerCase();

    if (
      text.includes("crack") ||
      text.includes("damage") ||
      text.includes("broken")
    ) {
      return "Physical damage may be affecting the component.";
    }

    if (
      text.includes("connection") ||
      text.includes("disconnected") ||
      text.includes("loose")
    ) {
      return "A loose or disconnected component may be causing the issue.";
    }

    if (
      text.includes("clean") ||
      text.includes("dust") ||
      text.includes("debris")
    ) {
      return "Dust, debris, or blocked components may be affecting operation.";
    }

    return "An abnormal physical condition may be contributing to the issue.";
  };

  const getSafety = (severity) => {
    if (severity === "High") {
      return "Disconnect power and avoid using the affected component until it has been inspected.";
    }

    if (severity === "Medium") {
      return "Switch off the device before inspecting connections or damaged components.";
    }

    return "Turn off the device before cleaning or inspecting the affected area.";
  };

  const getActionType = (severity) => {
    if (severity === "High") return "REPAIR / INSPECT";
    if (severity === "Medium") return "INSPECT / REPAIR";
    return "CLEAN / MAINTAIN";
  };

  /* =========================================
     DIAGNOSE
  ========================================= */

  const diagnoseProblem = async () => {
    if (!selectedFile) {
      setError("Upload a photo first.");
      return;
    }

    setDiagnosing(true);
    setResult(null);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(
        "http://localhost:5000/api/diagnose",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong."
        );
      }

      setResult(data);

      /* Save recent diagnosis */
      const historyItem = {
        id: Date.now(),
        problem: data.problem,
        severity: data.severity,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setHistory((prev) => {
        const next = [
          historyItem,
          ...prev.filter(
            (item) => item.problem !== data.problem
          ),
        ].slice(0, 5);

        localStorage.setItem(
          "snapfix-history",
          JSON.stringify(next)
        );

        return next;
      });
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Could not connect to the SnapFix backend."
      );
    } finally {
      setDiagnosing(false);
    }
  };

  /* =========================================
     RESET
  ========================================= */

  const resetApp = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }

    setImage(null);
    setSelectedFile(null);
    setResult(null);
    setError("");
  };

  /* =========================================
     CLEAR HISTORY
  ========================================= */

  const clearHistory = () => {
    localStorage.removeItem("snapfix-history");
    setHistory([]);
  };

  return (
    <div className="app">

      {/* =========================================
          ANIMATED AI BACKGROUND
      ========================================= */}

      <div className="anime-bg">

        <div className="anime-character left-character">

          <div className="character-glow"></div>

          <div className="character-body">

            <div className="character-head">
              <div className="eye left-eye"></div>
              <div className="eye right-eye"></div>
            </div>

            <div className="hair"></div>

            <div className="character-face">
              <span>•ᴗ•</span>
            </div>

          </div>

          <div className="speech-bubble left-bubble">
            <span>Need a fix?</span>
            <strong>I've got you.</strong>
          </div>

        </div>


        <div className="anime-character right-character">

          <div className="character-glow"></div>

          <div className="character-body">

            <div className="character-head">
              <div className="eye left-eye"></div>
              <div className="eye right-eye"></div>
            </div>

            <div className="hair"></div>

            <div className="character-face">
              <span>≧▽≦</span>
            </div>

          </div>

          <div className="speech-bubble right-bubble">
            <span>Snap it!</span>
            <strong>I'll solve it ✦</strong>
          </div>

        </div>

        <div className="floating-orb orb-one"></div>
        <div className="floating-orb orb-two"></div>
        <div className="floating-orb orb-three"></div>
        <div className="floating-orb orb-four"></div>

      </div>


      {/* =========================================
          NAVBAR
      ========================================= */}

      <nav className="navbar">

        <div className="logo">
          SNAP<span>FIX</span>
        </div>

        <div className="nav-center">

          <span className="online-dot"></span>

          AI SYSTEM ONLINE

        </div>

        <button
          className="how-button"
          onClick={() =>
            document
              .getElementById("how")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          How it works
          <ArrowRight size={17} />
        </button>

      </nav>


      {/* =========================================
          MAIN
      ========================================= */}

      <main className="main">

        <section className="hero">

          <div className="badge">
            <Sparkles size={15} />
            AI-POWERED PROBLEM SOLVING
          </div>


          <h1>
            See the problem.
            <br />
            <span>Snap the fix.</span>
          </h1>


          <p className="subtitle">
            SnapFix uses AI to analyze a photo of a
            problem, identify what's wrong, and give
            you a simple step-by-step fix.
          </p>


          {/* =====================================
              UPLOAD CARD
          ===================================== */}

          <div
            className={`upload-card ${
              dragging ? "dragging" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >

            {!image ? (

              <label className="upload-area">

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  hidden
                />

                <div className="upload-orbit">

                  <div className="upload-icon">
                    <Camera size={30} />
                  </div>

                </div>

                <h3>
                  {dragging
                    ? "Drop your image"
                    : "Upload a photo"}
                </h3>

                <p>
                  Show us what's broken and
                  we'll figure it out.
                </p>

                <span className="upload-button">

                  <Upload size={18} />

                  Choose image

                </span>

                <div className="upload-hint">
                  JPG · PNG · WEBP · MAX 10MB
                </div>

              </label>

            ) : (

              <div className="preview-area">

                <img
                  src={image}
                  alt="Uploaded problem"
                  className="preview-image"
                />


                {/* AI SCAN */}

                {diagnosing && (

                  <div className="scan-overlay">

                    <div className="scan-line"></div>

                    <div className="scan-center">

                      <div className="scan-label">

                        <Sparkles size={15} />

                        DEMO ANALYSIS PIPELINE

                      </div>

                      <div className="analysis-stage">
                        {ANALYSIS_STAGES[analysisStage]}
                      </div>

                      <div className="stage-dots">

                        {ANALYSIS_STAGES.map(
                          (_, index) => (
                            <span
                              key={index}
                              className={
                                index <= analysisStage
                                  ? "active"
                                  : ""
                              }
                            />
                          )
                        )}

                      </div>

                    </div>

                  </div>

                )}


                <div className="image-label">
                  IMAGE LOADED ✓
                </div>


                <button
                  className="remove-button"
                  onClick={removeImage}
                >
                  <X size={20} />
                </button>

              </div>

            )}

          </div>


          {/* FILE INFO */}

          {selectedFile && !diagnosing && !result && (

            <div className="file-ready">

              <CheckCircle2 size={15} />

              <span>
                {selectedFile.name}
              </span>

              <strong>
                READY
              </strong>

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="error-message">

              <AlertTriangle size={18} />

              {error}

            </div>

          )}


          {/* =====================================
              DIAGNOSE BUTTON
          ===================================== */}

          <button
            className={`diagnose-button ${
              diagnosing ? "loading" : ""
            }`}
            onClick={diagnoseProblem}
            disabled={
              diagnosing ||
              !selectedFile
            }
          >

            {diagnosing ? (

              <>
                <span className="spinner"></span>

                {ANALYSIS_STAGES[analysisStage]}
              </>

            ) : (

              <>
                <Sparkles size={20} />

                Diagnose with AI

                <ArrowRight size={18} />
              </>

            )}

          </button>


          {/* =====================================
              RESULT
          ===================================== */}

          {result && !diagnosing && (

            <section className="result-card">

              <div className="result-header">

                <div className="result-title">

                  <div className="success-icon">
                    <CheckCircle2 size={23} />
                  </div>

                  <div>

                    <span>
                      ANALYSIS COMPLETE
                    </span>

                    <h2>
                      Here's what we found
                    </h2>

                  </div>

                </div>


                <div
                  className={`severity ${
                    result.severity?.toLowerCase()
                  }`}
                >

                  <AlertTriangle size={15} />

                  {result.severity}

                </div>

              </div>


              {/* ANALYSIS META */}

              <div className="analysis-meta">

                <div className="meta-card">

                  <span>ANALYSIS MODE</span>

                  <strong>
                    <Zap size={14} />
                    DEMO VISION
                  </strong>

                </div>

                <div className="meta-card">

                  <span>SEVERITY</span>

                  <strong>
                    {result.severity}
                  </strong>

                </div>

                <div className="meta-card">

                  <span>NEXT ACTION</span>

                  <strong>
                    {getActionType(result.severity)}
                  </strong>

                </div>

              </div>


              {/* PROBLEM */}

              <div className="problem-box">

                <div className="result-icon">
                  <Wrench size={20} />
                </div>

                <div>

                  <span>
                    IDENTIFIED PROBLEM
                  </span>

                  <p>
                    {result.problem}
                  </p>

                </div>

              </div>


              {/* LIKELY CAUSE */}

              <div className="insight-grid">

                <div className="insight-box">

                  <div className="insight-icon">
                    <Sparkles size={18} />
                  </div>

                  <div>

                    <span>
                      LIKELY CAUSE
                    </span>

                    <p>
                      {getCause(result.problem)}
                    </p>

                  </div>

                </div>


                <div className="insight-box safety">

                  <div className="insight-icon">
                    <ShieldCheck size={18} />
                  </div>

                  <div>

                    <span>
                      SAFETY
                    </span>

                    <p>
                      {getSafety(result.severity)}
                    </p>

                  </div>

                </div>

              </div>


              {/* FIX STEPS */}

              <div className="steps">

                <div className="steps-header">

                  <div>

                    <span>
                      RECOMMENDED ACTION
                    </span>

                    <h3>
                      How to fix it
                    </h3>

                  </div>

                  <ShieldCheck size={22} />

                </div>


                {result.steps?.map(
                  (step, index) => (

                    <div
                      className="step"
                      key={index}
                    >

                      <div className="step-number">

                        {String(
                          index + 1
                        ).padStart(2, "0")}

                      </div>

                      <p>
                        {step}
                      </p>

                    </div>

                  )
                )}

              </div>


              <div className="result-footer">

                <div className="prototype-note">
                  <Sparkles size={14} />
                  Prototype diagnostic pipeline
                </div>

                <button
                  className="again-button"
                  onClick={resetApp}
                >

                  <RotateCcw size={17} />

                  Analyze another problem

                </button>

              </div>

            </section>

          )}


          {/* =====================================
              HISTORY
          ===================================== */}

          {history.length > 0 && (

            <section className="history-card">

              <div className="history-header">

                <div>

                  <span>
                    SNAPFIX MEMORY
                  </span>

                  <h2>
                    Recent diagnoses
                  </h2>

                </div>

                <History size={20} />

              </div>


              <div className="history-list">

                {history.map((item) => (

                  <div
                    className="history-item"
                    key={item.id}
                  >

                    <div className="history-icon">
                      <Wrench size={16} />
                    </div>

                    <div className="history-content">

                      <p>
                        {item.problem}
                      </p>

                      <span>
                        {item.time}
                      </span>

                    </div>

                    <div
                      className={`history-severity ${
                        item.severity?.toLowerCase()
                      }`}
                    >
                      {item.severity}
                    </div>

                  </div>

                ))}

              </div>


              <button
                className="clear-history"
                onClick={clearHistory}
              >
                Clear history
              </button>

            </section>

          )}

        </section>


        {/* =========================================
            HOW IT WORKS
        ========================================= */}

        <section
          className="features"
          id="how"
        >

          <div className="section-label">

            <Sparkles size={15} />

            HOW SNAPFIX WORKS

          </div>


          <div className="features-grid">

            <div className="feature">

              <div className="feature-number">
                01
              </div>

              <div className="feature-icon">
                <Camera size={21} />
              </div>

              <h3>
                Snap
              </h3>

              <p>
                Take a clear photo of whatever
                problem you're dealing with.
              </p>

            </div>


            <div className="feature">

              <div className="feature-number">
                02
              </div>

              <div className="feature-icon">
                <Sparkles size={21} />
              </div>

              <h3>
                Analyze
              </h3>

              <p>
                SnapFix analyzes the image and
                identifies possible problems.
              </p>

            </div>


            <div className="feature">

              <div className="feature-number">
                03
              </div>

              <div className="feature-icon">
                <Wrench size={21} />
              </div>

              <h3>
                Fix
              </h3>

              <p>
                Get simple, understandable steps
                to solve the problem.
              </p>

            </div>

          </div>

        </section>

      </main>


      {/* =========================================
          FOOTER
      ========================================= */}

      <footer>

        <div>
          © 2026 SNAPFIX
        </div>

        <div>
          SEE IT. UNDERSTAND IT. FIX IT.
        </div>

      </footer>

    </div>
  );
}

export default App;