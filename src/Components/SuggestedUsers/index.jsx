import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import SuggestedUser from "../SuggestedUser";

const SuggestedUsers = () => {
	const [loading, setLoading] = useState(true);
	const [suggestedUsers, setSuggestedUsers] = useState([]);

	useEffect(() => {
		const getSuggestedUsers = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/User/Suggested");
				const data = await res.json();
				if (!res.ok) {
					// console.log("Error", data.error, "error");
					return;
				}
				setSuggestedUsers(data);
			} catch (error) {
				// console.log("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};

		getSuggestedUsers();
	}, []);

	return (
		<div className="px-4 pt-2 pb-4 border-b border-[#AFAFAF] dark:border-[#464646]">
			<Text mb={2} fontWeight={"bold"} className="text-[#303030] dark:text-[#FAFAFA]">
				Usuarios sugeridos
			</Text>
			<Flex direction={"column"} gap={2}>
				{!loading && suggestedUsers.map((user) => <SuggestedUser key={user._id} user={user} />)}
				{loading &&
					[0, 1, 2].map((_, idx) => (
						<Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
							{/* avatar skeleton */}
							<Box>
								<SkeletonCircle size={"10"} />
							</Box>
							{/* username and fullname skeleton */}
							<Flex w={"full"} flexDirection={"column"} gap={2}>
								<Skeleton h={"8px"} w={"80px"} />
								<Skeleton h={"8px"} w={"90px"} />
							</Flex>
							{/* follow button skeleton */}
							<Flex>
								<Skeleton h={"20px"} w={"60px"} />
							</Flex>
						</Flex>
					))}
			</Flex>
			<NavLink
				to="/Search"
				className="text-end"
			>
				<p className="text-[#7439f2] font-semibold hover:underline cursor-pointer mt-2">Ver más</p>
			</NavLink>
		</div>
	);
};

export { SuggestedUsers as default };