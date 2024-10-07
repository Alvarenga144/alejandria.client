import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Components/Layout";
import Navbar from "../../Components/Navbar";
import UserHeader from "../../Components/UserHeader";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../../Components/Post/index";
import Product from "../../Components/Product/index";
import useGetUserProfile from "../../Hooks/useGetIUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom";
import productsAtom from "../../atoms/productsAtom";
import { toast } from "sonner";

const Account = () => {
    const { user, loading } = useGetUserProfile();
    const { username } = useParams();
    const [selectedContentType, setSelectedContentType] = useState('aportes');

    // estados de post
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [fetchingPosts, setFetchingPosts] = useState(true);

    // estados de productos
    const [products, setProducts] = useRecoilState(productsAtom);
    const [fetchingProducts, setFetchingProducts] = useState(true);

    useEffect(() => {
        const getProducts = async () => {
            setFetchingProducts(true);
            try {
                const res = await fetch(`/api/Product/UserProducts/${username}`);
                const data = await res.json();

                if (!res.ok) {
                    toast.error("¡Ups! Ah ocurrido un error", {
                        className: "error-toast",
                        description: `${data.error}`,
                        duration: 6000,
                    });
                    return;
                }
                setProducts(data);
            } catch (error) {
                toast.error("¡Ups! Ah ocurrido un error", {
                    className: "error-toast",
                    description: `${data.error}`,
                    duration: 6000,
                });
                setProducts([]);
            } finally {
                setFetchingProducts(false);
            }
        };

        getProducts();
    }, [username, setProducts]);

    // post normales abajo
    
    useEffect(() => {
        const getPosts = async () => {
            setFetchingPosts(true);
            try {
                const res = await fetch(`/api/Post/UserPosts/${username}`);
                const data = await res.json();

                if (!res.ok) {
                    toast.error("¡Ups! Ah ocurrido un error", {
                        className: "error-toast",
                        description: `${data.error}`,
                        duration: 6000,
                    });
                    return;
                }
                setPosts(data);
            } catch (error) {
                toast.error("¡Ups! Ah ocurrido un error", {
                    className: "error-toast",
                    description: `${data.error}`,
                    duration: 6000,
                });
                setPosts([]);
            } finally {
                setFetchingPosts(false);
            }
        };

        getPosts();
    }, [username, setPosts]);

    if (!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />
            </Flex>
        );
    }
    if (!user && !loading) return <h2 className="mx-auto">Usuario no encontrado</h2>;

    return (
        <>
            <Navbar />
            <Layout>
                <UserHeader user={user} setSelectedContentType={setSelectedContentType} />

                {selectedContentType === 'aportes' && (
                    <>
                        {!fetchingPosts && posts.length === 0 && (
                            <h2 className="mx-auto mt-10 font-semibold text-[#303030] dark:text-[#FEFEFE]">El Usuario aún no ha hecho aportes &#x1F615;</h2>
                        )}

                        {fetchingPosts && (
                            <Flex justifyContent={"center"} my={12}>
                                <Spinner size={"xl"} />
                            </Flex>
                        )}

                        {posts.map((post) => (
                            <Post key={post.id} post={post} postedBy={post.postedBy} />
                        ))}
                    </>
                )}

                {selectedContentType === 'productos' && (
                    <>
                        {!fetchingProducts && products.length === 0 && (
                            <h2 className="mx-auto mt-10 font-semibold text-[#303030] dark:text-[#FEFEFE]">El Usuario aún no ha publicado productos &#x1F615;</h2>
                        )}

                        {fetchingProducts && (
                            <Flex justifyContent={"center"} my={12}>
                                <Spinner size={"xl"} />
                            </Flex>
                        )}

                        {products.map((produ) => (
                            <Product key={produ.id} produ={produ} postedBy={produ.postedBy} />
                        ))}
                    </>
                )}
            </Layout>
        </>
    );
};

export { Account as default };
