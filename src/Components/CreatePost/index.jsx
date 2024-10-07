import React, { useRef, useState } from "react";
import {
	Button,
	CloseButton,
	Flex,
	FormControl,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	useDisclosure,
} from "@chakra-ui/react";
import usePreviewImg from "../../Hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import postsAtom from "../../atoms/postsAtom";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const MAX_CHAR = 280;

const CreatePost = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [postText, setPostText] = useState("");
	const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg("");
	const imageRef = useRef(null);
	const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
	const user = useRecoilValue(userAtom);
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const { username } = useParams();

	const handleTextChange = (e) => {
		const inputText = e.target.value;

		if (inputText.length > MAX_CHAR) {
			const truncatedText = inputText.slice(0, MAX_CHAR);
			setPostText(truncatedText);
			setRemainingChar(0);
		} else {
			setPostText(inputText);
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

	const handleCreatePost = async () => {
		const post = postText.trim();

		if (!post.trim()) {
			toast.error('El campo es obligatorio', {
				className: 'error-toast',
				duration: 6000
			});
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/Post/CreatePost", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postedBy: user._id,
					text: postText,
					img: imgUrl,
				}),
			});
			if (!res.ok) {
				toast.error("¡Ups! Ah ocurrido un error", {
					className: "error-toast",
					description: "Intentalo de nuevo",
					duration: 6000,
				});
				return;
			}
			const data = await res.json();

			if (username === user.username) {
				setPosts([data, ...posts]);
			}
			onClose();
			setPostText("");
			setImgUrl("");
			setRemainingChar(MAX_CHAR);

			toast("Post publicado", {
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
			setLoading(false);
		}
	};

	return (
		<>
			<Button
				position={"fixed"}
				bottom={32}
				right={5}
				bg="#7439f2"
				colorScheme="white"
				onClick={onOpen}
				size={{ base: "sm", sm: "md" }}
			>
				Aporte
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>Crear publicación</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={2}>
						<FormControl>
							<Textarea
								placeholder="Escribir aporte para Alejandría..."
								onChange={handleTextChange}
								value={postText}
							/>
							<p className="text-sm text-[#303030] font-bold text-right">{remainingChar}/{MAX_CHAR}</p>

							<Input
								type="file"
								hidden
								accept=".jpg,.jpeg,.png"
								ref={imageRef}
								onChange={handleImageChange}
							/>
							<BsFillImageFill
								style={{ cursor: "pointer" }}
								size={16}
								onClick={() => imageRef.current.click()}
							/>
						</FormControl>

						{imgUrl && (
							<Flex mt={5} w={"full"} position={"relative"}>
								<Image src={imgUrl} alt="Selected img" />
								<CloseButton
									onClick={() => {
										setImgUrl("");
									}}
									bg={"gray.100"}
									position={"absolute"}
									top={2}
									right={2}
								/>
							</Flex>
						)}
					</ModalBody>

					<ModalFooter>
						<div className="preview flex w-full text-sm text-[#7439f2] mt-1 mb-2 font-base justify-between pr-8 break-all">
							{displayURLs(postText)}
						</div>
						<Button
							bg="#7439f2"
							colorScheme="white"
							onClick={handleCreatePost}
							isLoading={loading}
						>
							Publicar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export { CreatePost as default };
