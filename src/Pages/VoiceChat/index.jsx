import 'regenerator-runtime/runtime';
import React, { useState, useRef, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import OwnLayout from "./OwnLayout";
import { Mic, X } from "react-feather";
import LoadingDots from "../../Components/LoadingDots/index";
import {Helmet} from "react-helmet";

const VoiceChatAI = () => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [displayMessage, setDisplayMessage] = useState("");
    const lastMessageRef = useRef(null);
    const maxHistoryLength = 40;

    // Text to speech 
    const [audioSrc, setAudioSrc] = useState(null);
    const lang = 'es-SV';
    const gender = 'Female'
    const nameAssistant = 'es-MX-DaliaNeural';
    const subscriptionKey = "71fab000c2e64a3084c062670e3865a4";
    const userAgent = "lealspeech";

    // Voice to text
    const startListening = () => {
        stopSound();
        SpeechRecognition.startListening({ continuous: true, language: 'es-SV' });
    }
    const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return null;
    }

    // Inicializa el historial leyendo desde localStorage si existe
    const [history, setHistory] = useState(() => {
        const localHistory = localStorage.getItem("voiceChatHistory");
        return localHistory ? JSON.parse(localHistory) : [
            {
                role: "assistant",
                content: "¡Hola! Soy Alejandría ¿En qué puedo ayudarte hoy?",
            },
        ];
    });

    // Obtén el último mensaje general
    const lastMessage = history[history.length - 1];

    // Efecto para recortar y actualizar el mensaje mostrado
    useEffect(() => {
        setDisplayMessage(trimMessage(lastMessage.content));
    }, [lastMessage]);

    // Función para recortar el mensaje a 100 caracteres
    const trimMessage = (content) => {
        return content.length > 120 ? content.substring(0, 117) + '...' : content;
    };

    // Actualizar el estado de 'message' cada vez que cambia 'transcript'
    useEffect(() => {
        setMessage(transcript);
    }, [transcript]);

    useEffect(() => {
        let historyToSave = [...history];
        if (historyToSave.length > maxHistoryLength) {
            historyToSave = historyToSave.slice(-maxHistoryLength);
        }
        localStorage.setItem("voiceChatHistory", JSON.stringify(historyToSave));
    }, [history]);

    // Auto-scroll para el último mensaje
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [history]);

    useEffect(()=>{
        //audio.play();
        if(typeof SimplexNoise !== "undefined" && typeof noise === "undefined"){
            noise = new SimplexNoise();
        }
        if(typeof play !== "undefined" && audio.className !== "active" ){
            play();
            audio.classList.add('active');
        }
    })

    const fetchTTS = (textToConvert) => {
        setLoading(true);

        const ssml = `<speak version='1.0' xml:lang='${lang}'><voice xml:lang='${lang}' xml:gender='${gender}' name='${nameAssistant}'>${textToConvert}</voice></speak>`;

        fetch("https://eastus.tts.speech.microsoft.com/cognitiveservices/v1", {
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": subscriptionKey,
                "Content-Type": "application/ssml+xml",
                "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
                "User-Agent": userAgent
            },
            body: ssml
        })
            .then(response => response.blob())
            .then(blob => {
                const audioUrl = URL.createObjectURL(blob);
                //setAudioSrc(audioUrl);
                playAudioResponse(audioUrl);
                setLoading(false);
            })
            .catch(err => {
                console.log('Error en fetchTTS:', err);
                setLoading(false);
            });
    }

    const playAudioResponse = (audioUrl) => {
        //console.log('Reproduciendo sonido...');
        //new Audio(audioUrl).play();
        setBufferAndPlay(audioUrl);
    }

    const handleClick = () => {
        if (!message.trim()) {
            //console.log('mensaje vacio');
            return;
        }
        if (loading) return;
        setLoading(true);

        setHistory((oldHistory) => [
            ...oldHistory,
            { role: "user", content: message },
        ]);

        fetch("/api/VoiceChat/TextPrompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: message, history: history }),
        })
            .then(async (res) => {
                const responseMessages = await res.json();
                const lastResponseMessage = responseMessages[responseMessages.length - 1];
                setHistory((oldHistory) => [...oldHistory, lastResponseMessage]);
                //console.log(lastResponseMessage.content);
                fetchTTS(lastResponseMessage.content);
                setMessage("");
                resetTranscript();
            })
            .catch((err) => {
                //console.log(err);
                setMessage("");
                resetTranscript();
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleReleaseMic = () => {
        setTimeout(() => {
            SpeechRecognition.stopListening(); // Detiene la grabación
            // Espera un poco más para asegurarse de que el último 'transcript' se ha transferido a 'message'
            setTimeout(() => {
                handleClick();
            }, 1400);
        }, 800); // Retardo de 0.8 segundos
    };

    const handleClearChat = () => {
        setHistory([{ role: "assistant", content: "¡Hola! Soy Alejandría ¿En qué puedo ayudarte hoy?" }]);
        localStorage.removeItem("voiceChatHistory");
        resetTranscript();
        resetSound();
    };

    const handleRefresh = () => {
        handleClearChat();
        window.location.reload(false);
    }

    return (
        <OwnLayout>
            <Helmet>
                <script type="module" src='/assets/visualizer2.js'></script>
            </Helmet>

            <div id="visualizer" className="fixed top-0 w-full h-full z-0"></div>

            <div className="relative z-10">
                <div className="overflow-y-auto flex flex-col gap-2 pb-8">

                    {lastMessage && (
                        <div
                            className='w-auto break-words font-semibold text-lg text-center pt-8 pb-2 px-4 transition-[0.5] text-white bg-gradient-to-b from-gray-900'
                        >
                            {lastMessage.role === 'assistant' && (
                                <p className="text-2xl font-bold text-center text-blue-800 my-2 transition-[0.5]">
                                    Alejandría
                                </p>
                            )}
                            <p className="markdown">
                                {displayMessage}
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div ref={lastMessageRef} className="flex gap-2">
                            <div className="w-auto mx-auto break-words font-semibold text-lg py-4 px-4 transition-[0.5] rounded-xl rounded-tr-xl bg-gray-500/40">
                                <span className="text-white py-2">
                                    <LoadingDots />
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        //handleClick();
                    }}
                >
                    <div className="fixed bottom-0 h-44 mb-32 w-full sm:min-w-[602px] sm:max-w-[620px] ">
                        <textarea
                            aria-label="chat input"
                            value={message}
                            readOnly
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full text-center h-full transition-opacity bg-transparent text-white font-semibold text-2xl focus:outline-none"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleClick();
                                }
                            }}
                        />

                        <div className="flex justify-between w-full px-8">
                            <button
                                onClick={handleRefresh}
                                className="flex w-[64px] h-[64px] mt-6 mb-2 items-center justify-center rounded-full px-3 transition-[0.5] bg-gray-500/40 font-semibold text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="main-grid-item-icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                    <polyline points="23 4 23 10 17 10" />
                                    <polyline points="1 20 1 14 7 14" />
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                </svg>

                            </button>

                            <button
                                onTouchStart={startListening}
                                onMouseDown={startListening}
                                onTouchEnd={handleReleaseMic}
                                onMouseUp={handleReleaseMic}
                                onClick={(e) => {
                                    e.preventDefault();
                                }}
                                className="flex w-[80px] h-[80px] mt-2 mb-4 items-center justify-center rounded-full transition-[0.5] bg-gray-500/40 font-semibold text-white active:bg-gray-400/80 shadow-xl shadow-gray-400/20"
                                aria-label="Record"
                            >
                                <Mic />
                            </button>

                            <button
                                onClick={handleClearChat}
                                className="flex w-[64px] h-[64px] mt-6 mb-2 items-center justify-center rounded-full px-3 transition-[0.5] bg-gray-500/40 font-semibold text-white"
                            >
                                <X />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleClick();
                                }}
                                className="hidden"
                                type="submit"
                                aria-label="Send"
                                disabled={!message || loading}
                            >
                                Send
                            </button>

                        </div>
                    </div>
                </form>
            </div>
        </OwnLayout>
    );
};

export { VoiceChatAI as default };
