import React, { useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import productsAtom from "../../atoms/productsAtom";
import { toast } from "sonner";
import { Button, FormControl, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, } from "@chakra-ui/react";

const MAX_CHAR = 280;

const ActionsProduct = ({ produ }) => {
    const user = useRecoilValue(userAtom);
    const [liked, setLiked] = useState(produ.likes.includes(user?._id));
    const [posts, setPosts] = useRecoilState(productsAtom);
    const [isLiking, setIsLiking] = useState(false); // to prevent spamming the like button
    const [isReplying, setIsReplying] = useState(false); // to prevent spamming the reply button
    const [reply, setReply] = useState("");
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleTextChange = (e) => {
        const inputText = e.target.value;

        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setReply(truncatedText);
            setRemainingChar(0);
        } else {
            setReply(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };

    const displayURLs = (text) => {
        const regex = /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?\b/g;
        const urls = text.match(regex);

        return urls ? urls.map((url, index) => (
            <div key={index}>
                {url}
            </div>
        )) : '';
    };

    const handleLikeUnlike = async (e) => {
        if (!user) return toast.error("Registrate en Alejandía", {
            className: "error-toast",
            description: "Y podrás interactuar con los usuarios y la IA",
            duration: 6000,
        });
        if (isLiking) return;
        try {
            const res = await fetch(`/api/Product/likeUnlike/${produ.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user._id }),
            });

            if (!res.ok) {
                toast.error("¡Ups! Ah ocurrido un error", {
                    className: "error-toast",
                    description: "No se ha guardado tu me gusta",
                    duration: 6000,
                });
                return;
            }
            const data = await res.json();

            if (!liked) {
                // add the id of the current user to post.likes array
                const updatedPosts = posts.map((p) => {
                    if (p.id === produ.id) {
                        return { ...p, likes: [...p.likes, user._id] };
                    }
                    return p;
                });
                setPosts(updatedPosts);
            } else {
                // remove the id of the current user from post.likes array
                const updatedPosts = posts.map((p) => {
                    if (p.id === produ.id) {
                        return { ...p, likes: p.likes.filter((id) => id !== user._id) };
                    }
                    return p;
                });
                setPosts(updatedPosts);
            }

            setLiked(!liked);
        } catch (error) {
            ctoast.error("¡Ups! Ah ocurrido un error", {
                className: "error-toast",
                description: "Intentalo más tarde",
                duration: 6000,
            });
        } finally {
            setIsLiking(false);
        }
    };

    const handleReply = async (e) => {
        if (!user)
            return toast.error("Registrate en Alejandía", {
                className: "error-toast",
                description: "Y podrás interactuar con los usuarios y la IA",
                duration: 6000,
            });

        const respuesta = reply.trim();
        if (!respuesta.trim()) {
            toast.error('El campo es obligatorio', {
                className: 'error-toast',
                duration: 6000
            });
            return;
        }

        if (isReplying) return;
        setIsReplying(true);
        try {
            const res = await fetch("/api/Product/Reply/" + produ.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: reply }),
            });

            if (!res.ok) {
                toast.error("¡Ups! Ah ocurrido un error", {
                    className: "error-toast",
                    description: "Intentalo más tarde",
                    duration: 6000,
                });
                return;
            }
            const data = await res.json();

            const updatedPosts = posts.map((p) => {
                if (p._id === produ._id) {
                    return { ...p, replies: [...p.replies, data] };
                }
                return p;
            });
            setPosts(updatedPosts);

            onClose();
            setReply("");
            setRemainingChar(MAX_CHAR);
            toast("Comentario publicado", {
                className: "success-toast",
                duration: 5000,
            });

        } catch (error) {
            toast.error("¡Ups! Ah ocurrido un error", {
                className: "error-toast",
                description: "Intentalo más tarde",
                duration: 6000,
            });
        } finally {
            setIsReplying(false);
        }
    };

    return (
        <div>
            <div
                className="flex gap-4 items-center justify-between py-2"
                onClick={(e) => e.preventDefault()}
            >
                <svg
                    aria-label="Like"
                    color={liked ? "rgb(237, 73, 86)" : ""}
                    fill={liked ? "rgb(237, 73, 86)" : "transparent"}
                    height="19"
                    role="img"
                    viewBox="0 0 24 22"
                    width="20"
                    onClick={handleLikeUnlike}
                    className="cursor-pointer text-[#303030] dark:text-[#646464] hover:text-[#ADADAD] transition-[0.5]"
                >
                    <title>Me encanta</title>
                    <path
                        d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
                        stroke="currentColor"
                        strokeWidth="2"
                    ></path>
                </svg>
                {user ?
                    <svg
                        aria-label="Comment"
                        color=""
                        fill=""
                        height="20"
                        role="img"
                        viewBox="0 0 24 24"
                        width="20"
                        onClick={onOpen}
                        className="cursor-pointer text-[#303030] dark:text-[#646464] hover:text-[#ADADAD] transition-[0.5]"
                    >
                        <title>Comentar</title>
                        <path
                            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                            fill="none"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        ></path>
                    </svg>
                    :
                    <svg
                        aria-label="Comment"
                        color=""
                        fill=""
                        height="20"
                        role="img"
                        viewBox="0 0 24 24"
                        width="20"
                        onClick={handleReply}
                        className="cursor-pointer text-[#303030] hover:text-[#ADADAD] transition-[0.5]"
                    >
                        <title>Comentar</title>
                        <path
                            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                            fill="none"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        ></path>
                    </svg>
                }
                <RepostSVG />
                <ShareSVG />
            </div>
            <div>
                {/* replies and likes */}
                <div className="flex gap-2">
                    <p className="text-md text-[#999999] dark:text-[#646464] cursor-pointer">
                        {produ.replies.length} respuestas
                    </p>
                    <p className="text-md text-[#999999]">&bull;</p>
                    <p className="text-md text-[#999999] dark:text-[#646464] cursor-pointer">
                        {produ.likes.length} likes
                    </p>
                </div>
            </div>

            {/* Modal to reply */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Comentar publicación</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={4}>
                        <FormControl>
                            <Textarea
                                placeholder="Pregunta o comenta sobre la publicación..."
                                onChange={handleTextChange}
                                value={reply}
                            />
                            <Text
                                fontSize="xs"
                                fontWeight="bold"
                                textAlign={"right"}
                                m={"1"}
                                color={"gray.800"}
                            >
                                {remainingChar}/{MAX_CHAR}
                            </Text>

                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <div className="preview flex w-full text-sm text-[#7439f2] mt-1 mb-2 font-base justify-between pr-8">
                            {displayURLs(reply)}
                        </div>
                        <Button
                            bg="#7439f2"
                            colorScheme="white"
                            isLoading={isReplying}
                            onClick={handleReply}
                        >
                            Comentar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export { ActionsProduct as default };

const RepostSVG = () => {
    return (
        <div className="relative group/tooltip">
            <svg
                aria-label="Repost"
                color="currentColor"
                fill="currentColor"
                height="20"
                role="img"
                viewBox="0 0 24 24"
                width="20"
                className="cursor-pointer text-[#AFAFAF] dark:text-[#262626] hover:text-[#ADADAD] transition-[0.5]"
            >
                <path
                    fill=""
                    d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
                ></path>
            </svg>
            <span
                className="absolute pointer-events-none transition-all opacity-0 z-20 bottom-full -translate-y-0 py-1 px-1.5 text-xs left-1/2 -translate-x-1/2 rounded-md whitespace-nowrap text-gray-200 bg-gray-800 dark:bg-white dark:text-gray-700 before:content-[''] before:absolute before:bg-gray-800 before:rounded-sm before:w-2.5 before:rotate-45 before:h-2.5 before:-bottom-1 before:-z-10 before:left-1/2 before:-translate-x-1/2 before:dark:bg-white before:dark:gray-800 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-3"
            >Próximamente</span>
        </div>
    );
};

const ShareSVG = () => {
    return (
        <div className="relative group/tooltip">
            <svg
                aria-label="Share"
                color=""
                fill="rgb(243, 245, 247)"
                height="20"
                role="img"
                viewBox="0 0 24 24"
                width="20"
                className="cursor-pointer text-[#AFAFAF] dark:text-[#262626] hover:text-[#ADADAD] transition-[0.5]"
            >
                <line
                    fill="none"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    x1="22"
                    x2="9.218"
                    y1="3"
                    y2="10.083"
                ></line>
                <polygon
                    fill="none"
                    points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                ></polygon>
            </svg>
            <span
                className="absolute pointer-events-none transition-all opacity-0 z-20 bottom-full -translate-y-0 py-1 px-1.5 text-xs left-1/2 -translate-x-1/2 rounded-md whitespace-nowrap text-gray-200 bg-gray-800 dark:bg-white dark:text-gray-700 before:content-[''] before:absolute before:bg-gray-800 before:rounded-sm before:w-2.5 before:rotate-45 before:h-2.5 before:-bottom-1 before:-z-10 before:left-1/2 before:-translate-x-1/2 before:dark:bg-white before:dark:gray-800 group-hover/tooltip:opacity-100 group-hover/tooltip:-translate-y-3"
            >Próximamente</span>
        </div>
    );
};
