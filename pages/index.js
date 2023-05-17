import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

import LiferayApi from './api/liferayapi';

export default function Home() {
  const [questionInput, setQuestionInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();

    if(questionInput.toLowerCase().startsWith("write")){
      console.log("Break for write logic");

      setResult("Let me help you with that. One Moment...");

      authorContent(questionInput);

      return false;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setQuestionInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  async function authorContent(topicString){
      console.log("Input string is " + topicString);

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: questionInput }),
        });

        const data = await response.json();
        if (response.status !== 200) {
            throw data.error || new Error(`Request failed with status ${response.status}`);
        }


        LiferayApi("/o/headless-delivery/v1.0/sites/20119/blog-postings", {
            method: 'POST', 
            body: {
                "articleBody": data.result,
                "description": data.result.substring(0, 150) + "...",
                "headline": topicString.replace("write a blog post on the topic of",""),
                "viewableBy": "Anyone"
            }
        })
        .then((result) => {
            console.log("Posted Load Request");
            console.log(result.data);
            setResult("All set! Your blog post has been created.");
        })
        .catch(console.log)
  
  }

  return (
    <div>
      <Head>
        <title>OpenAI Integration</title>
        <link rel="icon" href="/askray.png" />
      </Head>

      <main className={styles.main}>
        <img src="/askray.png" className={styles.icon} />
        <h3>How can we help?</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="question"
            placeholder="Enter a question"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          <input type="submit" value="Ask RayChat" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
