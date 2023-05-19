export interface ChatCompletionsResponse {
  id: string
  object: string
  created: number
  model: string
  choices: ChatCompletionsResponseChoice[]
}

export interface ChatCompletionsResponseChoice {
  index: number
  delta: ChatCompletionsResponseChoiceDelta
  finish_reason: string
}

export interface ChatCompletionsResponseChoiceDelta {
  content: string
  role: string
}
