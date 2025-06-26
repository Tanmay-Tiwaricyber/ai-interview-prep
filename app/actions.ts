"use server"

import { generateText } from "ai"
import { google } from "@ai-sdk/google"

interface FormData {
  role: string
  company: string
  experience: string
  focus: string
}

interface Question {
  question: string
  type: "technical" | "behavioral" | "hr"
  difficulty: "easy" | "medium" | "hard"
  answer: string
  tips: string[]
}

interface InterviewKit {
  role: string
  company: string
  experience: string
  questions: Question[]
  generalTips: string[]
}

export async function generateInterviewKit(formData: FormData): Promise<InterviewKit> {
  const { role, company, experience, focus } = formData

  const experienceMap = {
    entry: "Entry Level (0-2 years)",
    mid: "Mid Level (2-5 years)",
    senior: "Senior Level (5+ years)",
  }

  const focusMap = {
    technical: "technical questions with some behavioral",
    behavioral: "behavioral questions with some technical",
    balanced: "balanced mix of technical, behavioral, and HR questions",
  }

  const prompt = `Generate a comprehensive interview preparation kit for a ${role} position${company ? ` at ${company}` : ""} for someone with ${experienceMap[experience as keyof typeof experienceMap]} experience.

Focus on: ${focusMap[focus as keyof typeof focusMap]}

Please provide:
1. 8-12 interview questions with a mix of types based on the focus
2. For each question, provide:
   - Question text
   - Type (technical/behavioral/hr)
   - Difficulty level (easy/medium/hard)
   - A detailed sample answer (2-3 paragraphs)
   - 3-4 specific tips for answering this question
3. 6-8 general interview tips specific to this role and experience level

Format the response as a JSON object with this structure:
{
  "questions": [
    {
      "question": "string",
      "type": "technical|behavioral|hr",
      "difficulty": "easy|medium|hard", 
      "answer": "string",
      "tips": ["string", "string", "string"]
    }
  ],
  "generalTips": ["string", "string", "string"]
}

Make sure the questions are relevant to the ${role} role and appropriate for ${experienceMap[experience as keyof typeof experienceMap]} candidates. Include both coding/technical questions and behavioral questions that assess soft skills, leadership, and cultural fit.`

  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash", {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyAVFE3KLve6OkYOV88lQ7Y0q1rPoRYRB5E",
      }),
      prompt,
      temperature: 0.7,
    })

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response")
    }

    const parsedData = JSON.parse(jsonMatch[0])

    return {
      role,
      company,
      experience: experienceMap[experience as keyof typeof experienceMap],
      questions: parsedData.questions,
      generalTips: parsedData.generalTips,
    }
  } catch (error) {
    console.error("Error generating interview kit:", error)

    // Fallback data in case of API error
    return {
      role,
      company,
      experience: experienceMap[experience as keyof typeof experienceMap],
      questions: [
        {
          question: "Tell me about yourself and your experience with this role.",
          type: "behavioral" as const,
          difficulty: "easy" as const,
          answer:
            "I'm a passionate developer with experience in modern web technologies. I've worked on several projects that involved building scalable applications, and I'm particularly interested in this role because it aligns with my career goals and allows me to contribute to meaningful projects. In my previous role, I led a team of 3 developers to successfully deliver a customer-facing web application that increased user engagement by 40%. I'm excited about this opportunity because it would allow me to work with cutting-edge technologies while contributing to a product that makes a real difference for users.",
          tips: [
            "Keep your answer concise and relevant to the role (2-3 minutes max)",
            "Highlight your most relevant experiences and quantifiable achievements",
            "End with why you're interested in this specific position and company",
            "Practice this answer beforehand as it sets the tone for the entire interview",
          ],
        },
        {
          question: "What is your experience with version control systems like Git?",
          type: "technical" as const,
          difficulty: "easy" as const,
          answer:
            "I have extensive experience with Git for version control in both individual and team projects. I'm comfortable with core Git operations like cloning repositories, creating and switching branches, committing changes, and merging code. In my current role, I use Git daily for collaborative development, including creating feature branches, submitting pull requests, and resolving merge conflicts. I'm also familiar with Git workflows like GitFlow and have experience with platforms like GitHub and GitLab for code review and CI/CD integration. I understand the importance of writing clear commit messages and maintaining a clean commit history for better project maintainability.",
          tips: [
            "Mention specific Git commands and workflows you're familiar with",
            "Discuss your experience with collaborative Git practices like pull requests",
            "Share examples of how you've used Git in team environments",
            "If you're new to Git, mention any personal projects where you've used it",
          ],
        },
      ],
      generalTips: [
        "Research the company thoroughly - know their products, mission, and recent news",
        "Prepare specific examples using the STAR method (Situation, Task, Action, Result)",
        "Practice your answers out loud beforehand, but don't memorize them word-for-word",
        "Prepare thoughtful questions to ask the interviewer about the role and company culture",
        "Bring multiple copies of your resume and a notebook for taking notes",
        "Arrive 10-15 minutes early and dress appropriately for the company culture",
        "Follow up with a thank-you email within 24 hours of the interview",
      ],
    }
  }
}
