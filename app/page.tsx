"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Code, Users, Loader2, Sparkles } from "lucide-react"
import { generateInterviewKit } from "./actions"

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

export default function InterviewPrepGenerator() {
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    experience: "mid",
    focus: "balanced",
  })
  const [interviewKit, setInterviewKit] = useState<InterviewKit | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!formData.role.trim()) return

    setIsGenerating(true)
    try {
      const kit = await generateInterviewKit(formData)
      setInterviewKit(kit)
    } catch (error) {
      console.error("Error generating interview kit:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportAsHTML = () => {
    if (!interviewKit) return

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Prep Kit - ${interviewKit.role}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; }
        .question { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .question-title { font-weight: bold; color: #333; margin-bottom: 10px; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; }
        .technical { background-color: #e3f2fd; color: #1976d2; }
        .behavioral { background-color: #f3e5f5; color: #7b1fa2; }
        .hr { background-color: #e8f5e8; color: #388e3c; }
        .answer { margin: 15px 0; padding: 15px; background-color: #f9f9f9; border-radius: 4px; }
        .tips { margin-top: 15px; }
        .tips ul { margin: 5px 0; padding-left: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Interview Prep Kit</h1>
        <h2>${interviewKit.role}${interviewKit.company ? ` at ${interviewKit.company}` : ""}</h2>
        <p>Experience Level: ${interviewKit.experience}</p>
    </div>
    
    <h3>General Tips</h3>
    <ul>
        ${interviewKit.generalTips.map((tip) => `<li>${tip}</li>`).join("")}
    </ul>
    
    <h3>Interview Questions</h3>
    ${interviewKit.questions
      .map(
        (q) => `
        <div class="question">
            <div class="question-title">${q.question}</div>
            <span class="badge ${q.type}">${q.type.toUpperCase()}</span>
            <span class="badge">${q.difficulty.toUpperCase()}</span>
            <div class="answer">
                <strong>Sample Answer:</strong><br>
                ${q.answer.replace(/\n/g, "<br>")}
            </div>
            <div class="tips">
                <strong>Tips:</strong>
                <ul>
                    ${q.tips.map((tip) => `<li>${tip}</li>`).join("")}
                </ul>
            </div>
        </div>
    `,
      )
      .join("")}
</body>
</html>`

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `interview-prep-${interviewKit.role.replace(/\s+/g, "-").toLowerCase()}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsMarkdown = () => {
    if (!interviewKit) return

    const markdown = `# Interview Prep Kit

## ${interviewKit.role}${interviewKit.company ? ` at ${interviewKit.company}` : ""}

**Experience Level:** ${interviewKit.experience}

## General Tips

${interviewKit.generalTips.map((tip) => `- ${tip}`).join("\n")}

## Interview Questions

${interviewKit.questions
  .map(
    (q, index) => `
### ${index + 1}. ${q.question}

**Type:** ${q.type.toUpperCase()} | **Difficulty:** ${q.difficulty.toUpperCase()}

**Sample Answer:**
${q.answer}

**Tips:**
${q.tips.map((tip) => `- ${tip}`).join("\n")}

---
`,
  )
  .join("\n")}

*Generated with AI Interview Prep Generator*`

    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `interview-prep-${interviewKit.role.replace(/\s+/g, "-").toLowerCase()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Interview Prep Generator</h1>
          </div>
          <p className="text-lg text-gray-600">Get customized coding and HR interview kits powered by Gemini AI</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Generate Your Interview Kit
            </CardTitle>
            <CardDescription>
              Tell us about the role you're preparing for, and we'll create a personalized interview prep kit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Job Role *</Label>
                <Input
                  id="role"
                  placeholder="e.g., Frontend Developer, Product Manager"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  placeholder="e.g., Google, Microsoft, Startup"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) => setFormData({ ...formData, experience: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="focus">Interview Focus</Label>
                <Select value={formData.focus} onValueChange={(value) => setFormData({ ...formData, focus: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Heavy</SelectItem>
                    <SelectItem value="behavioral">Behavioral Heavy</SelectItem>
                    <SelectItem value="balanced">Balanced Mix</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!formData.role.trim() || isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Your Interview Kit...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Interview Kit
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {interviewKit && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {interviewKit.role}
                    {interviewKit.company && <span className="text-indigo-600"> at {interviewKit.company}</span>}
                  </CardTitle>
                  <CardDescription>
                    Experience Level: {interviewKit.experience} • {interviewKit.questions.length} Questions
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportAsHTML} size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Export HTML
                  </Button>
                  <Button variant="outline" onClick={exportAsMarkdown} size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export MD
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="questions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="questions">Interview Questions</TabsTrigger>
                  <TabsTrigger value="tips">General Tips</TabsTrigger>
                </TabsList>

                <TabsContent value="questions" className="space-y-4">
                  {interviewKit.questions.map((question, index) => (
                    <Card key={index} className="border-l-4 border-l-indigo-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg leading-relaxed">
                            {index + 1}. {question.question}
                          </CardTitle>
                          <div className="flex gap-2 ml-4">
                            <Badge
                              variant={
                                question.type === "technical"
                                  ? "default"
                                  : question.type === "behavioral"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="shrink-0"
                            >
                              {question.type}
                            </Badge>
                            <Badge variant="outline" className="shrink-0">
                              {question.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            Sample Answer
                          </h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="whitespace-pre-wrap text-sm">{question.answer}</p>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold mb-2">💡 Tips</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            {question.tips.map((tip, tipIndex) => (
                              <li key={tipIndex}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="tips">
                  <Card>
                    <CardHeader>
                      <CardTitle>General Interview Tips</CardTitle>
                      <CardDescription>Key strategies to succeed in your {interviewKit.role} interview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {interviewKit.generalTips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-gray-700">{tip}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
