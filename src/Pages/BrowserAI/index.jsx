import * as React from "react";
import { useState, useRef, useEffect } from "react";
import Layout from "../../Components/Layout/index";
import Navbar from "../../Components/Navbar/index";
import { Send } from "react-feather";
import LoadingDots from "../../Components/LoadingDots/index";
import { LuTrash2 } from "react-icons/lu";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

const BrowserAI = () => {
    const [message, setMessage] = useState("");
    // Inicializa el historial leyendo desde localStorage si existe, si no, inicia con el mensaje de bienvenida.
    const [history, setHistory] = useState(() => {
        const localHistory = localStorage.getItem("chatHistory");
        return localHistory ? JSON.parse(localHistory) : [
            {
                role: "assistant",
                content:
                    "¡Hola! Soy Alejandría, tu asistente virtual. ¿En qué puedo ayudarte hoy?",
            },
        ];
    });

    const lastMessageRef = useRef(null);
    const [loading, setLoading] = useState(false);

    // Define el límite máximo de mensajes en el historial
    const maxHistoryLength = 40;

    useEffect(() => {
        let historyToSave = [...history];

        // Verificar si el historial excede el máximo permitido
        if (historyToSave.length > maxHistoryLength) {
            // Mantener solo los últimos maxHistoryLength mensajes
            historyToSave = historyToSave.slice(-maxHistoryLength);
        }

        // Guarda el historial en el localStorage
        localStorage.setItem("chatHistory", JSON.stringify(historyToSave));
    }, [history]);

    const handleClick = () => {
        // Verifica si el mensaje está vacío o solo contiene espacios en blanco
        if (!message.trim()) {
            setMessage("");
            return;
        }

        // Evita enviar otro mensaje si ya se está procesando uno
        if (loading) return;

        setHistory((oldHistory) => [
            ...oldHistory,
            { role: "user", content: message },
        ]);

        // Preparar el objeto que se va a enviar
        // const payload = { query: message, history: history };
        // console.log(payload)

        setMessage("");
        setLoading(true);

        fetch("/api/Chat/PostMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: message, history: history }),
        })
            .then(async (res) => {
                const responseMessages = await res.json();
                const lastResponseMessage =
                    responseMessages[responseMessages.length - 1];
                setHistory((oldHistory) => [...oldHistory, lastResponseMessage]);
                setLoading(false);
                // console.log("Respuesta:", lastResponseMessage);
            })
            .catch((err) => {
                //console.log(err);
                setLoading(false); // Asegúrate de reiniciar loading si ocurre un error
            });
    };

    const handleClearChat = () => {
        // Limpia el historial en el estado y en el localStorage
        setHistory([
            {
                role: "assistant",
                content:
                    "¡Hola! Soy Alejandría, tu asistente virtual. ¿En qué puedo ayudarte hoy?",
            },
        ]);
        localStorage.removeItem("chatHistory");
    };

    //scroll to bottom of chat
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [history]);

    return (
        <>
            <Navbar />
            <Layout>
                <div className="overflow-y-auto flex flex-col gap-2 px-2 pt-8 pb-[110px]">
                    {history.map((message, idx) => {
                        const isLastMessage = idx === history.length - 1;
                        switch (message.role) {
                            case "assistant":
                                return (
                                    <div
                                        ref={isLastMessage ? lastMessageRef : null}
                                        key={idx}
                                        className="flex transition-[0.5]"
                                    >
                                        <div className="w-auto max-w-md break-words text-[#303030] dark:text-[#FAFAFA] bg-white dark:bg-[#262626] rounded-b-xl rounded-tr-xl p-4 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)] transition-[0.5]">
                                            <p className="text-sm font-medium text-violet-500 mb-1 transition-[0.5]">
                                                Alejandria
                                            </p>
                                            <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkBreaks]}
                                                className="markdown"
                                                components={{
                                                    // maneja los párrafos
                                                    p: ({ node, children, ...props }) => {
                                                        return <div {...props}>{children}<br></br><br></br></div>;
                                                    },
                                                    // Este componente personalizado maneja los bloques de código
                                                    code: ({ node, inline, className, children, ...props }) => {
                                                        if (!inline) {
                                                            // Para los bloques de código overflow-x-auto
                                                            return (
                                                                <div style={{ overflowX: 'auto' }}>
                                                                    <pre className="my-2 px-1 bg-gray-100 dark:bg-[#464646] rounded-md">
                                                                        <code className={`${className} p-2`} {...props}>
                                                                            {children}
                                                                        </code>
                                                                    </pre>
                                                                </div>
                                                            );
                                                        }
                                                        // Para los códigos en línea no aplicamos desplazamiento
                                                        return <code className="py-1 px-2 bg-gray-100 rounded" {...props}>{children}</code>;
                                                    },
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                );
                            case "user":
                                return (
                                    <div
                                        className="w-auto max-w-md break-words rounded-b-xl rounded-tl-xl text-white dark:text-[#FAFAFA] p-4 self-end bg-[#8b5cf6] transition-[0.5] shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]"
                                        key={idx}
                                        ref={isLastMessage ? lastMessageRef : null}
                                    >
                                        {message.content}
                                    </div>
                                );
                        }
                    })}
                    {loading && (
                        <div ref={lastMessageRef} className="flex gap-2">
                            <div className="w-auto max-w-md break-words text-[#303030] dark:text-[#FAFAFA] bg-white dark:bg-[#262626] rounded-b-xl rounded-tr-xl p-4 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)] transition-[0.5]">
                                <span className="text-slate-400 text-[#FAFAFA] py-2">
                                    <LoadingDots />
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <form
                    className="bg-[#e5e6f2] dark:bg-[#151515]"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleClick();
                    }}
                >
                    <div className="flex fixed bottom-0 bg-[#EFEFEF] dark:bg-[#151515] pl-2 pr-4 py-2 h-24 mb-[64px] w-full sm:min-w-[602px] sm:max-w-[602px] sm:px-2 sm:mb-[0px]">
                        <button
                            onClick={handleClearChat}
                            className="bg-[#AFAFAF] dark:bg-[#262626] mr-2 ml-[-8px] text-white px-2 rounded sm:ml-0"
                        >
                            <LuTrash2 />
                        </button>
                        <div className="w-full relative">
                            <textarea
                                aria-label="chat input"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Buscar..."
                                className="w-full h-full resize-none rounded-r-full border border-slate-900/10 transition-[0.5] dark:bg-[#262626] dark:text-[#FAFAFA] bg-white pl-4 pr-20 py-[4px] text-base placeholder:text-[#969696] dark:placeholder:text-[#AFAFAF] focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/10"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleClick();
                                    }
                                }}
                            />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleClick();
                                }}
                                className="flex w-[64px] h-[64px] items-center justify-center rounded-full px-3 transition-[0.5] text-sm bg-violet-600 font-semibold text-white hover:bg-violet-700 active:bg-violet-800 absolute right-2 bottom-2 disabled:bg-violet-100 disabled:text-violet-400 dark:disabled:bg-[#464646]"
                                type="submit"
                                aria-label="Send"
                                disabled={!message || loading}
                            >
                                <Send />
                            </button>
                        </div>
                    </div>
                </form>
            </Layout>
        </>
    );
};

export { BrowserAI as default };
