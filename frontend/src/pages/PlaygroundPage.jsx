import { useState, useEffect, useRef } from 'react';
import Editor from "@monaco-editor/react";
import { useRecoilValue } from 'recoil';
import { themeAtom } from '../atoms/themeAtom';
import { axiosInstance } from '../lib/axios';
import { CirclePlayIcon, ArrowUpSquareIcon, ArrowDownSquareIcon } from "lucide-react";
import {defaultCodeSnippets} from "../constants/codetemplate.js"

// This API might not understand how to directly execute JavaScript code. JavaScript is typically interpreted in web browsers, not compiled like languages like C++ or Java.
const PlaygroundPage = () => {
	const theme = useRecoilValue(themeAtom);
	const isDarkMode = theme === "dark";
    const [userCode, setUserCode] = useState(``);
    const [userLang, setUserLang] = useState("java");
    const [fontSize, ] = useState(15);
    const [userInput, setUserInput] = useState("");
    const [userOutput, setUserOutput] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(''); // 'Running', 'Error', 'Finished', ''
    const [showInputBox, setShowInputBox] = useState(false);
    const outputRef = useRef(null); // Reference for the output container

    useEffect(() => {
        setUserCode(defaultCodeSnippets[userLang]);
    }, [userLang]);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [userOutput]);

    const compile = () => {
        setLoading(true);
        setStatus('Running');
        if (userCode === ``) {
            setLoading(false);
            setStatus('');
            return;
        }

        axiosInstance.post(`/compile`, {
            code: userCode,
            language: userLang,
            input: userInput
        }).then((res) => {
            console.log(res.data);  // Log the entire response
            const output = (res.data.stdout ? res.data.stdout : '') + (res.data.stderr ? res.data.stderr : '');
            setUserOutput((prevOutput) => [...prevOutput, "\n", output]);
            setStatus(res.data.stderr ? 'Error' : 'Finished');
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            const errorMessage = "Error: " + (err.response ? err.response.data.error : err.message);
            setUserOutput((prevOutput) => [...prevOutput, errorMessage]);
            setStatus('Error');
            setLoading(false);
        });
    };

    const clearOutput = () => {
        setUserOutput([]);
        setStatus('');
    };

    return (
        <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Code Editor Section */}
            <div className={`w-3/5 flex flex-col border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                <div className={`flex justify-between items-center p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <button
                        onClick={compile}
                        disabled={loading}  // Disable button when loading
                        className={`bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-400 flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <CirclePlayIcon />
                        Run Code
                    </button>
                    <select
                        value={userLang}
                        onChange={(e) => setUserLang(e.target.value)}
                        className={`border px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                    >
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                    </select>
                </div>
                <Editor
                    language={userLang}
                    value={userCode}
                    theme="vs-dark"
                    onChange={(value) => setUserCode(value)}
                    options={{ fontSize }}
                    defaultValue="# Enter your code here"
                />
            </div>

            {/* Output Section */}
            <div className="w-2/5 flex flex-col">
                <div className={`flex justify-between items-center p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <h2 className={isDarkMode ? 'text-white' : 'text-black'}>
                        Output:
                        {status && (
                            <span
                                className={`ml-2 px-2 py-1 rounded-full text-sm ${
                                    status === 'Running'
                                        ? 'bg-blue-500 text-white'
                                        : status === 'Error'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-green-500 text-white'
                                }`}
                            >
                                {status}
                            </span>
                        )}
                    </h2>
                    {userOutput.length > 0 && (
                        <button
                            onClick={clearOutput}
                            className={`px-2 py-1 rounded-md ${isDarkMode ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-black bg-gray-300 hover:bg-gray-400'}`}
                        >
                            Clear Console
                        </button>
                    )}
                </div>
                <div ref={outputRef} className={`flex-1 p-4 overflow-auto ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                    {userOutput.map((output, index) => (
                        <pre key={index} className={`whitespace-pre-wrap ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            {output}
                        </pre>
                    ))}
                    {loading ? <span className={isDarkMode ? 'text-blue-400' : 'text-blue-500'}><br/>Running code...</span> : <></>}
                </div>
                {/* Input Box Collapsible */}
                <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <button
                        onClick={() => setShowInputBox(!showInputBox)}
                        className={`px-4 py-1 rounded-md flex items-center gap-2 ${isDarkMode ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-black bg-gray-300 hover:bg-gray-400'}`}
                    >
                        stdin {showInputBox ? <ArrowDownSquareIcon /> : <ArrowUpSquareIcon />}
                    </button>
                    {showInputBox && (
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Enter your input here..."
                            className={`w-full mt-2 p-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                            rows={4}
                        ></textarea>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlaygroundPage;
