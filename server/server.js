import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const PORT = 5000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "SnapFix backend is running 🚀",
  });
});

app.post("/api/diagnose", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No image uploaded.",
      });
    }

    console.log("📸 Image received:", req.file.originalname);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1800));

    /*
      DEMO MODE

      Since OpenAI credits are unavailable, SnapFix uses
      different diagnostic scenarios for demonstration.
    */

    const filename = req.file.originalname.toLowerCase();
    const diagnoses = [
      {
        matches: ["headlight"],
        problem: "The headlight appears broken or not securely connected.",
        severity: "High",
        steps: [
          "Turn off the vehicle and let the headlight cool down.",
          "Inspect the bulb, housing, and wiring for visible damage.",
          "Replace the bulb or damaged housing with the correct part.",
          "Test the headlight before driving at night."
        ]
      },
      {
        matches: ["pipe", "leak"],
        problem: "The image suggests a leaking pipe or damaged pipe joint.",
        severity: "High",
        steps: [
          "Shut off the nearest water supply immediately.",
          "Place a container under the leak and dry the surrounding area.",
          "Tighten or replace the damaged fitting or pipe section.",
          "Restore water slowly and check the repair for further leaks."
        ]
      },
      {
        matches: ["phone", "screen"],
        problem: "The phone screen appears cracked and may have damaged touch or display layers.",
        severity: "Medium",
        steps: [
          "Back up important data before handling the phone further.",
          "Avoid pressing on loose glass and cover sharp cracks carefully.",
          "Have the screen replaced by a qualified repair technician.",
          "Test touch, brightness, and the front camera after repair."
        ]
      },
      {
        matches: ["tyre", "tire"],
        problem: "The tyre appears flat or significantly underinflated.",
        severity: "High",
        steps: [
          "Do not drive on the flat tyre unless moving only to a safe location.",
          "Check the tyre for a puncture or damaged valve.",
          "Inflate it to the vehicle manufacturer's recommended pressure.",
          "Use the spare tyre or contact roadside assistance if it will not hold air."
        ]
      },
      {
        matches: ["laptop"],
        problem: "The laptop appears to have physical damage that may affect its display or internal components.",
        severity: "Medium",
        steps: [
          "Shut down the laptop and disconnect its charger.",
          "Check the casing, hinge, screen, and ports for loose parts.",
          "Do not force a damaged hinge or swollen panel closed.",
          "Have the damaged component inspected before continued use."
        ]
      },
      {
        matches: ["wire", "cable"],
        problem: "The wire appears damaged or exposed and may be unsafe to use.",
        severity: "High",
        steps: [
          "Disconnect power before touching the damaged wire.",
          "Keep exposed conductors away from people, water, and metal surfaces.",
          "Replace the cable or have it repaired by a qualified electrician.",
          "Restore power only after the insulation and connections are secure."
        ]
      }
    ];

    const fallbackDiagnosis = {
      problem: "A possible damaged or faulty component is visible in the image.",
      severity: "Medium",
      steps: [
        "Inspect the damaged area carefully for cracks or loose parts.",
        "Stop using the affected component if the damage could worsen.",
        "Secure or replace the damaged component.",
        "Test the system after completing the repair."
      ]
    };

    const diagnosis = diagnoses.find(({ matches }) =>
      matches.some((match) => filename.includes(match))
    ) || fallbackDiagnosis;

    console.log("🤖 Diagnosis generated");

    res.json(diagnosis);

  } catch (error) {
    console.error("❌ Diagnosis error:", error);

    res.status(500).json({
      error: "Failed to analyze the image.",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `🚀 SnapFix backend running at http://localhost:${PORT}`
  );
});