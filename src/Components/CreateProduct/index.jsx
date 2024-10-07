import React, { useRef, useState } from "react";
import {
	Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay, Textarea, useDisclosure,
} from "@chakra-ui/react";
import usePreviewMultipleImages from "../../Hooks/usePreviewMultipleImages";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import postsAtom from "../../atoms/postsAtom";
import productsAtom from "../../atoms/productsAtom";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const MAX_CHAR_TITLE = 60;
const MAX_CHAR = 360;

const CreateProduct = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [titleText, setTitleText] = useState("");
	const [postText, setPostText] = useState("");
	const [priceValue, setPriceValue] = useState("0.00")
	const [postType, setPostType] = useState('Producto');
	const { handleImageChange, images, setImages } = usePreviewMultipleImages();
	const imageRef = useRef(null);
	const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
	const [remainingCharTitle, setRemainingCharTitle] = useState(MAX_CHAR_TITLE);
	const user = useRecoilValue(userAtom);
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useRecoilState(productsAtom);
	const { username } = useParams();

	const handleTitleChange = (e) => {
		const inputText = e.target.value;

		if (inputText.length > MAX_CHAR_TITLE) {
			const truncatedText = inputText.slice(0, MAX_CHAR_TITLE);
			setTitleText(truncatedText);
			setRemainingCharTitle(0);
		} else {
			setTitleText(inputText);
			setRemainingCharTitle(MAX_CHAR_TITLE - inputText.length);
		}
	};

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

	const handlePriceChange = (event) => {
		let input = event.target.value.replace(/\D/g, ''); // Elimina todos los caracteres que no sean dígitos
		if (input.length > 10) {
			input = input.slice(0, 10); // Limita la longitud a 10 dígitos (hasta 100 millones)
		}
		const number = parseInt(input, 10) || 0; // Convierte a número, asegurándose de que sea al menos 0
		const formattedValue = (number / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		setPriceValue(formattedValue);
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

	const handleCreateProduct = async () => {
		const title = titleText.trim();
		const description = postText.trim();
		const price = parseFloat(priceValue.replace(/,/g, '')); // Convierte el precio de string a float

		if (!title) {
			toast.error('El título es obligatorio', {
				className: 'error-toast',
				duration: 6000
			});
			return;
		}

		if (!description) {
			toast.error('La descripción es obligatoria', {
				className: 'error-toast',
				duration: 6000
			});
			return;
		}

		if (isNaN(price) || price <= 0) {
			toast.error('Ingrese un precio válido', {
				className: 'error-toast',
				duration: 6000
			});
			return;
		}

		if (images.length < 2) {
			toast.error('Es necesario enviar al menos 2 imágenes', {
				className: 'error-toast',
				duration: 6000
			});
			return;
		}

		const validPostType = ['Producto', 'Servicio'].includes(postType) ? postType : 'Producto';
		
		setLoading(true);
		try {
			const res = await fetch("/api/Product/CreateProduct", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postedBy: user._id,
					category: validPostType,
					title: title,
					detailedDescription: description,
					price: price,
					imgs: images,
				}),
			});

			if (!res.ok) {
				toast.error("¡Ups! Ha ocurrido un error", {
					className: "error-toast",
					description: "Inténtalo de nuevo",
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
			setTitleText("");
			setImages([]);
			setPriceValue("0.00");
			setRemainingChar(MAX_CHAR);
			setRemainingCharTitle(MAX_CHAR_TITLE);

			toast("Producto publicado", {
				className: "success-toast",
				duration: 5000,
			})

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
				bottom={44}
				right={5}
				bg="#7439f2"
				colorScheme="white"
				onClick={onOpen}
				size={{ base: "sm", sm: "md" }}
			>
				Producto/Servicio
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>Producto o servicio</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={2}>
						<FormControl>
							<Input
								type="text"
								placeholder="Titulo"
								value={titleText}
								onChange={handleTitleChange}
							/>
							<p className="text-sm text-[#404040] font-semibold text-right mb-2">{remainingCharTitle}/{MAX_CHAR_TITLE}</p>
							<Textarea
								placeholder="Descripción..."
								value={postText}
								onChange={handleTextChange}
							/>
							<p className="text-sm text-[#404040] font-semibold text-right mb-2">{remainingChar}/{MAX_CHAR}</p>

							<div className="flex justify-between gap-2 mb-4">
								<div className="flex-1">
									<span className="text-sm text-[#404040] font-light">Tipo de post</span>
									<select
										name="postType"
										id="postType"
										className="w-full rounded px-2 h-[40px]"
										value={postType}
										onChange={(e) => setPostType(e.target.value)}
									>
										<option value="Producto">Producto</option>
										<option value="Servicio">Servicio</option>
									</select>
								</div>
								<div className="flex-1"> 
									<span className="text-sm text-[#404040] font-light">Precio</span>
									<Input
										type="text"
										value={priceValue}
										onChange={handlePriceChange}
										className="w-full"
									/>
								</div>
							</div>


							{/* Botón para abrir el input de archivos */}
							<BsFillImageFill
								style={{ cursor: "pointer" }}
								size={16}
								onClick={() => imageRef.current.click()}
							/>
							<Input
								type="file"
								multiple
								hidden
								accept=".jpg,.jpeg,.png"
								ref={imageRef}
								onChange={handleImageChange}
							/>
						</FormControl>

						{/* Vista previa de las imágenes seleccionadas */}
						{images.map((imgUrl, index) => (
							<Flex key={index} mt={5} w={"full"} position={"relative"}>
								<Image src={imgUrl} alt={`Selected img ${index + 1}`} />
								<CloseButton
									onClick={() => {
										setImages(images.filter((_, i) => i !== index));
									}}
									bg={"gray.100"}
									position={"absolute"}
									top={2}
									right={2}
								/>
							</Flex>
						))}
						{images.length == 0 ? "" : 
							<p className="text-sm text-[#303030] font-bold text-right mt-2">{images.length}/6 fotos</p>
						}
					</ModalBody>

					<ModalFooter>
						<div className="preview flex w-full text-sm text-[#7439f2] mt-1 mb-2 font-base justify-between pr-8 break-all">
							{displayURLs(postText)}
						</div>
						<Button
							bg="#7439f2"
							colorScheme="white"
							onClick={handleCreateProduct}
							isLoading={loading}
						>
							Publicar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export { CreateProduct as default };