import express from "express";
import http from "http";
import path from "path";
import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy initialize Gemini client
let genAIInstance: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    genAIInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIInstance;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "WeCare Hospitals Full-Stack API" });
});

// API: AI Medical Lab Report & Prescription Analyzer (gemini-3.8-flash)
app.post("/api/ai/analyze-lab-report", async (req, res) => {
  try {
    const { reportText, imageBase64, mimeType } = req.body;
    if (!reportText && !imageBase64) {
      return res.status(400).json({ error: "Please provide either report text or an image." });
    }

    const ai = getGenAI();
    const prompt = `You are a world-class Chief Medical AI Specialist and Clinical Diagnostic Analyst at WeCare Hospitals.
Analyze the following medical lab report, prescription, or diagnostic scan details carefully.
Provide an empathetic, scientifically accurate, and patient-friendly breakdown structured in valid JSON.

Input text:
${reportText || "See attached image"}

Requirements:
Return ONLY a valid JSON object matching this exact schema:
{
  "reportTitle": "string (e.g., Comprehensive Metabolic Panel Analysis)",
  "overallStatus": "Normal" | "Attention Needed" | "Requires Medical Review" | "Critical / Urgent",
  "summary": "string (clear 2-3 sentence overview in simple language)",
  "keyFindings": [
    {
      "parameter": "string (e.g., Fasting Blood Glucose)",
      "value": "string (e.g., 142 mg/dL)",
      "referenceRange": "string (e.g., 70-99 mg/dL)",
      "status": "Normal" | "High" | "Low" | "Borderline",
      "explanation": "string (what this means for patient health)"
    }
  ],
  "potentialConcerns": ["string array of points to discuss"],
  "questionsForDoctor": ["string array of 3-4 specific, empowered questions the patient should ask their doctor during consultation"],
  "recommendedDepartment": "Cardiology" | "Neurology" | "Orthopedics" | "Pediatrics" | "Oncology" | "General Medicine" | "Gastroenterology" | "Dermatology",
  "recommendedAction": "string (e.g., Book an In-Person OPD with an Endocrinologist within 3 days)"
}`;

    const contents: any[] = [];
    if (imageBase64) {
      contents.push({
        inlineData: {
          data: imageBase64.replace(/^data:[^;]+;base64,/, ""),
          mimeType: mimeType || "image/jpeg",
        },
      });
    }
    contents.push(prompt);

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = response.text || "{}";
    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch {
      res.json({
        reportTitle: "Medical Document Review",
        overallStatus: "Requires Medical Review",
        summary: text,
        keyFindings: [],
        potentialConcerns: ["Consult a physician for detailed lab interpretations."],
        questionsForDoctor: ["What further diagnostic steps do you advise based on these values?"],
        recommendedDepartment: "General Medicine",
        recommendedAction: "Schedule a comprehensive consultation with a WeCare specialist.",
      });
    }
  } catch (error: any) {
    console.error("Lab Analysis Error:", error);
    res.status(500).json({
      error: error.message || "Failed to analyze medical report. Please consult a doctor directly.",
    });
  }
});

// API: AI Deep Medical Triage & Doctor Matcher
app.post("/api/ai/symptom-triage", async (req, res) => {
  try {
    const { symptoms, duration, severity, age, gender, medicalHistory } = req.body;
    const ai = getGenAI();

    const prompt = `You are the Senior Emergency & Outpatient Triage Director at WeCare Hospitals.
Evaluate the patient's symptoms:
- Symptoms: ${symptoms}
- Duration: ${duration || "Not specified"}
- Severity (1-10): ${severity || "5"}
- Patient Age: ${age || "Adult"}, Gender: ${gender || "Not specified"}
- Past Medical History: ${medicalHistory || "None specified"}

Provide a clinically rigorous, empathetic triage evaluation.
Return ONLY valid JSON matching this schema:
{
  "triageLevel": "Emergency (Red)" | "Urgent / Fast-Track (Orange)" | "Outpatient OPD (Yellow)" | "Routine Care (Green)",
  "urgencyScore": number (1 to 10),
  "primaryAssessment": "string (clear clinical explanation)",
  "redFlagWarnings": ["string array of dangerous symptoms to watch out for"],
  "recommendedDepartment": "string (e.g., Cardiology, General Medicine, Neurology, Orthopedics)",
  "immediateHomeCareAdvice": ["string array of safe, non-invasive comfort measures while awaiting doctor visit"],
  "suggestedSpecialistProfile": "string (what kind of specialist they should see, e.g., Senior Interventional Cardiologist)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Triage API Error:", error);
    res.status(500).json({ error: error.message || "Failed to complete AI triage assessment." });
  }
});

// Setup WebSocket Server on /live for Gemini Live API Voice Conversations
const wss = new WebSocketServer({ server, path: "/live" });

wss.on("connection", async (clientWs: WebSocket) => {
  console.log("Client connected to /live WebSocket for Gemini Voice Consultation");

  let session: any = null;
  let isSessionActive = false;

  try {
    const ai = getGenAI();
    session = await ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Zephyr", // Warm, reassuring medical voice
            },
          },
        },
        systemInstruction: `You are Dr. WeCare Voice, the real-time AI Clinical Voice Assistant for WeCare Hospitals.
You are speaking directly with a patient who is talking into their microphone.
Your goals:
1. Listen attentively with high empathy, calm tone, and warmth.
2. Ask 1 or 2 targeted clarifying questions (duration, pain characteristics, accompanying symptoms).
3. Provide reassuring preliminary triage guidance, suggest the appropriate WeCare medical department (e.g., Cardiology, Orthopedics, Neurology, Pediatrics, General Medicine), and gently guide them to book an OPD slot or visit the 24/7 Emergency Wing if red flags exist.
4. Keep spoken responses concise (2 to 4 sentences maximum) because this is an interactive spoken voice conversation.
5. Never prescribe controlled medications; always emphasize that in-person evaluation by a licensed WeCare physician is essential.`,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          if (clientWs.readyState !== WebSocket.OPEN) return;

          // 1. Send Audio chunks for playback
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            clientWs.send(JSON.stringify({ type: "audio", audio }));
          }

          // 2. Handle interruption
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ type: "interrupted" }));
          }

          // 3. Handle model output transcript
          if (message.serverContent?.modelTurn?.parts) {
            const textParts = message.serverContent.modelTurn.parts
              .filter((p) => p.text)
              .map((p) => p.text)
              .join("");
            if (textParts) {
              clientWs.send(JSON.stringify({ type: "model_transcript", text: textParts }));
            }
          }
        },
        onclose: () => {
          console.log("Gemini Live session closed");
          isSessionActive = false;
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: "session_closed" }));
          }
        },
        onerror: (err: any) => {
          console.error("Gemini Live session error:", err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: "error", message: err?.message || "Live API error" }));
          }
        },
      },
    });

    isSessionActive = true;
    clientWs.send(JSON.stringify({ type: "ready", message: "Connected to Dr. WeCare Voice Live API" }));
  } catch (error: any) {
    console.error("Failed to connect to Gemini Live API:", error);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          type: "error",
          message: error?.message || "Could not establish Gemini Live session. Check GEMINI_API_KEY.",
        })
      );
    }
  }

  clientWs.on("message", (data: any) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === "audio" && msg.audio && session && isSessionActive) {
        session.sendRealtimeInput({
          audio: { data: msg.audio, mimeType: "audio/pcm;rate=16000" },
        });
      } else if (msg.type === "text" && msg.text && session && isSessionActive) {
        session.sendClientContent({
          turns: [{ role: "user", parts: [{ text: msg.text }] }],
          turnComplete: true,
        });
      }
    } catch (err) {
      console.error("Error processing client ws message:", err);
    }
  });

  clientWs.on("close", () => {
    console.log("Client disconnected from /live WebSocket");
    isSessionActive = false;
  });
});

// Vite Middleware for development vs Static Serving for production
async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`WeCare Hospital Server running on http://0.0.0.0:${PORT}`);
  });
}

startApp().catch((err) => {
  console.error("Failed to start server:", err);
});
