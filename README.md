# Local AI

Run AI locally and privately using Next.js

## Getting Started

1. Install [Ollama](https://ollama.com/download)
2. Download one or more [models](https://ollama.com/library) from Ollama: `ollama run [model]`
  Note: Don't download models larger than your available RAM.
3. Install [Node.js](https://nodejs.org/en)
4. Clone this repository: `git clone https://github.com/Karlito05/local-ai.git`
                          `cd local-ai`
5. In `app/page.tsx`, edit the `model` property to your chosen model.
6. Run the server: `npm run dev`
7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Run AI models locally on your machine
- Private and secure processing of your data
- Customizable model selection

## Pros and Cons

### Pros:
- Enhanced privacy: All processing occurs on your local machine
- No internet required after initial setup
- Customizable to your needs

### Cons:
- Requires a powerful PC for optimal performance
- Limited to locally available models
- May consume significant system resources
