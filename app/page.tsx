"use client"

import { roboto } from "./fonts"
import { useState, useRef, FormEvent } from "react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"

interface Message {
  role: string
  content: string | null
}

interface APIResponse {
  message: {
    content: string
  }
}

function tryParseJSONObject(jsonString: string): APIResponse | false {
  try {
    const o = JSON.parse(jsonString)
    if (
      o &&
      typeof o === "object" &&
      "message" in o &&
      "content" in o.message
    ) {
      return o as APIResponse
    }
  } catch (e) {}
  return false
}

export default function Home() {
  const [responseText, setResponseText] = useState<string>("")
  const prevTextRef = useRef<string>("")
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    if (formRef.current) {
      formRef.current.reset()
    }

    const message = formData.get("chat-input") as string
    let pervText = prevTextRef.current

    const body = {
      model: "mixtral:8x7b",
      messages: [
        {
          role: "user",
          content: message,
        },
      ] as Message[],
    }

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      body: JSON.stringify(body),
    })
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error("Failed to read response body")
    }

    let newText = pervText ? pervText + "\n\n" : ""
    newText += `# User: \n ${message} \n # AI:\n`
    setResponseText(newText)

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        prevTextRef.current = newText + "\n"
        break
      }
      const raw_json = new TextDecoder().decode(value)
      const json = tryParseJSONObject(raw_json)

      if (!json) {
        let raw_jsons = raw_json.split("\n")
        raw_jsons.pop()

        for (let raw_json of raw_jsons) {
          const json = JSON.parse(raw_json) as APIResponse
          newText += json.message.content
          setResponseText(newText)
        }
      } else {
        newText += json.message.content
        setResponseText(newText)
      }
    }

    // Reset the form after submission
  }

  return (
    <main className={`${roboto.className} antialiased`}>
      <div className='m-0 pulse flex justify-center items-center'>
        <div className='w-10/12 mt-8 mb-32 rounded-2xl shadow-md align-baseline bg-slate-900 min-h-wfa'>
          <div className='text-white text-justify self-baseline mt-2 mb-6 mx-6 mh-80vh'>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {responseText}
            </ReactMarkdown>
          </div>
        </div>
        <div className='fixed bottom-0 z-50 w-10/12 max-w-3xl bg-transparent pb-10'>
          <form
            ref={formRef}
            className='flex justify-between items-end w-full bg-gray-900 rounded-2xl py-2.5 px-5 border-none-on-focus'
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleSubmit(formData)
            }}
          >
            <input
              type='text'
              id='chat-input'
              placeholder='Type your message here...'
              autoComplete='off'
              name='chat-input'
              required
              className='flex-1 bg-transparent border-none-on-focus text-white p-2.5'
            />
            <button
              type='submit'
              className='bg-sky-800 text-black border-none-on-focus rounded-xl size-10 cursor-pointer self-center'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='send-icon'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
