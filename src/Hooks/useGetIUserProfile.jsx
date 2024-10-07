import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const { username } = useParams();
	// const showToast = useShowToast();

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch(`/api/User/Profile/${username}`);
				if (!res.ok) {
					console.log("Respuesta NO exitosa", await res.text());
                    return;
                }
				const data = await res.json();
				
				setUser(data);
			} catch (error) {
				// showToast("Error", error.message, "error");
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		getUser();
	}, [username]);

	return { loading, user };
};

export { useGetUserProfile as default };