"use client";

import React, { useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

const HtmlForm = () => {
    const [code, setCode] = useState("<a href=\"https://veryveryveryverylongdomain.com?dskhgkldsfhgkjsdhfkdj=aoeuroiewuraidlk\">Go</a>");
    const [response, setResponse] = useState("");

    const handleSubmit = async () => {
        try {
            const url = new URL(window.location.href);
            const res = await fetch(url.pathname + 'api/shorten', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ html: code }),
            });

            const data = await res.text();
            // Pretty-print JSON response
            setResponse(data);
        } catch (error: any) {
            setResponse(`Error: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-20 bg-gray-50 dark:bg-gray-900 font-sans">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-900 dark:text-white">
                URL Shortener
            </h1>

            {/* Editors + button */}
            <div className="flex flex-col sm:flex-row gap-10 w-full max-w-6xl">
                {/* HTML Editor */}
                <div className="flex-1 flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">HTML Editor</h2>
                    <AceEditor
                        mode="html"
                        theme="monokai"
                        value={code}
                        onChange={setCode}
                        name="html_editor"
                        editorProps={{ $blockScrolling: true }}
                        width="100%"
                        height="400px"
                        fontSize={14}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                        }}
                        className="rounded-lg shadow-md"
                    />
                    <button
                        onClick={handleSubmit}
                        className="self-start mt-4 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Submit HTML
                    </button>
                </div>

                {/* Response */}
                <div className="flex-1 flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Modified HTML</h2>
                    <AceEditor
                        mode="json"
                        theme="monokai"
                        value={response}
                        readOnly
                        name="response_editor"
                        editorProps={{ $blockScrolling: true }}
                        width="100%"
                        height="400px"
                        fontSize={14}
                        setOptions={{
                            showLineNumbers: true,
                            tabSize: 2,
                        }}
                        className="rounded-lg shadow-md"
                    />
                </div>
            </div>
        </div>

    );
};

export default HtmlForm;
